/**
 * play_model.js
 * This file handles loading the TensorFlow.js model for card play.
 * Updated to use the new RL-based model.
 */

const PLAY_OBS_TENSOR_SIZE = 171;
const NUM_CARDS = 52;
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const SUITS = ['S', 'H', 'D', 'C'];

let playModel = null;

/**
 * Loads the TensorFlow.js playing model.
 * @param {string} modelPath - The path to the model.json file.
 */
export async function loadPlayModel(modelPath = './models/play_rl_model/model.json') {
    if (playModel) {
        //console.log("Play model already loaded.");
        return;
    }
    //console.log(`Loading play model from ${modelPath}...`);
    //console.log(`Play model will use backend: ${tf.getBackend ? tf.getBackend() : 'unknown'}`);
    try {
        if (typeof window === 'undefined') {
            const { resolve } = await import('path');
            const handler = tf.io.fileSystem(resolve(modelPath));
            playModel = await tf.loadGraphModel(handler);
        } else {
            playModel = await tf.loadGraphModel(modelPath);
        }
        //console.log("Play model loaded successfully.");

        const dummyObs = tf.zeros([1, PLAY_OBS_TENSOR_SIZE]);
        try {
            const result = playModel.execute(dummyObs);
            tf.dispose(result);
            //console.log("Play model warmed up.");
        } catch (e) {
            //console.warn("Play model warmup failed (continuing):", e);
        } finally {
            tf.dispose(dummyObs);
        }
    } catch (e) {
        console.error("Failed to load play model:", e);
        throw e;
    }
}

/**
 * Encodes the current game state for the play model.
 * Matches `encode_play_observation_tensor` in `gpu/bridge_state_gpu.py`.
 * @param {object} gameState - An object representing the current game state.
 * @returns {Float32Array}
 */
function encodePlayObservation(gameState) {
    const obs = new Float32Array(PLAY_OBS_TENSOR_SIZE).fill(0);
    let ptr = 0;

    // 1. Current player's hand (52)
    // gameState.hand is array of 52 booleans
    for (let i = 0; i < 52; i++) {
        if (gameState.hand[i]) {
            obs[ptr + i] = 1.0;
        }
    }
    ptr += 52;

    // 2. Contract info (7)
    // gameState.contract is [level, strain, declarer, dbl, vulNS, vulEW, hasDDT]
    for (let i = 0; i < 7; i++) {
        obs[ptr + i] = gameState.contract[i];
    }
    ptr += 7;

    // 3. Trick history (52)
    // gameState.trickHistory is array of card codes played
    for (const cardCode of gameState.trickHistory) {
        if (cardCode >= 0 && cardCode < 52) {
            obs[ptr + cardCode] = 1.0;
        }
    }
    ptr += 52;

    // 4. Cards in current trick (52)
    // gameState.currentTrick is array of card codes
    for (const cardCode of gameState.currentTrick) {
        if (cardCode >= 0 && cardCode < 52) {
            obs[ptr + cardCode] = 1.0;
        }
    }
    ptr += 52;

    // 5. Current player one-hot (4)
    if (gameState.currentPlayer >= 0 && gameState.currentPlayer < 4) {
        obs[ptr + gameState.currentPlayer] = 1.0;
    }
    ptr += 4;

    // 6. Vulnerability one-hot (4)
    // gameState.vulnerability is 0-3
    if (gameState.vulnerability >= 0 && gameState.vulnerability < 4) {
        obs[ptr + gameState.vulnerability] = 1.0;
    }

    return obs;
}

/**
 * Uses the model to predict the next card to play.
 * @param {object} gameState - The current game state.
 * @param {Array<number>} legalPlays - An array of legal card indices.
 * @returns {Promise<number>} The index of the predicted card to play.
 */
async function runModelPlay(gameState, legalPlays) {
    const formatCard = (c) => {
        if (typeof c === 'number') {
            const suit = SUITS[Math.floor(c / 13)] || '?';
            const rank = RANKS[c % 13] || '?';
            return `${rank}${suit}`;
        }
        return String(c);
    };

    if (!playModel) {
        const choice = legalPlays[0];
        console.log(`DEBUG play choice: ${formatCard(choice)} [fallback:unloaded]`);
        return { card: choice, confidence: 0 }; // Safe fallback
    }

    // 1. Prepare model inputs
    const obsTensor = tf.tensor2d([encodePlayObservation(gameState)]);

    // 2. Run inference
    let resultTensor;
    try {
        resultTensor = playModel.execute(obsTensor);
    } catch (e) {
        console.error("Play model execution failed:", e);
        tf.dispose(obsTensor);
        const choice = legalPlays[0];
        console.log(`DEBUG play choice: ${formatCard(choice)} [fallback:exec-error]`);
        return { card: choice, confidence: 0 };
    }

    const logits = await resultTensor.data();

    // 3. Mask illegal moves and find best + confidence
    let bestCard = -1;
    let maxLogit = -Infinity;
    const legalLogits = [];
    for (const card of legalPlays) {
        const logit = logits[card];
        legalLogits.push(logit);
        if (logit > maxLogit) {
            maxLogit = logit;
            bestCard = card;
        }
    }

    // Compute softmax probability among legal plays for the selected card
    let confidence = 0;
    if (legalLogits.length && bestCard !== -1) {
        const maxLegal = Math.max(...legalLogits);
        const expSum = legalLogits.reduce((sum, l) => sum + Math.exp(l - maxLegal), 0);
        const bestIdx = legalPlays.indexOf(bestCard);
        if (bestIdx >= 0 && expSum > 0) {
            confidence = Math.exp(legalLogits[bestIdx] - maxLegal) / expSum;
        }
    }

    // Safety: if numerical issues produce 0/NaN, or model logits unavailable, fall back to uniform confidence
    if (!Number.isFinite(confidence) || confidence <= 0 || bestCard === -1) {
        bestCard = bestCard === -1 && legalPlays.length ? legalPlays[0] : bestCard;
        confidence = legalPlays.length ? (1 / legalPlays.length) : 0;
    }

    tf.dispose([obsTensor, resultTensor]);

    if (bestCard !== -1) {
        console.log(`DEBUG play choice: ${formatCard(bestCard)} [model]`);
        return { card: bestCard, confidence }; // confidence as probability (0-1)
    } else {
        const choice = legalPlays[0];
        console.log(`DEBUG play choice: ${formatCard(choice)} [fallback:no-legal-logit]`);
        return { card: choice, confidence: 0 };
    }
}

/**
 * Returns only the chosen card index (backward compatible).
 */
export async function getModelPlay(gameState, legalPlays) {
    const { card } = await runModelPlay(gameState, legalPlays);
    return card;
}

/**
 * Returns both the chosen card index and the model confidence (softmax over legal plays).
 */
export async function getModelPlayWithConfidence(gameState, legalPlays) {
    return runModelPlay(gameState, legalPlays);
}
