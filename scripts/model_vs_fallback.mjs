import * as tf from '@tensorflow/tfjs-node';
import { loadPlayModel, getModelPlay } from '../js/play_model.js';

const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const SUITS = ['S', 'H', 'D', 'C'];
const RANK_POINTS = { J: 1, Q: 2, K: 3, A: 4 };
const SEAT_ORDER = ['N', 'E', 'S', 'W'];
const SEAT_NUMBER = { N: 0, E: 1, S: 2, W: 3 };

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function deal() {
    const deck = [];
    for (const s of SUITS) {
        for (const r of RANKS) deck.push(`${r}${s}`);
    }
    shuffle(deck);
    const hands = { N: [], E: [], S: [], W: [] };
    SEAT_ORDER.forEach((seat, i) => {
        hands[seat] = deck.slice(i * 13, (i + 1) * 13);
    });
    return hands;
}

function hcp(cards) {
    return cards.reduce((sum, c) => sum + (RANK_POINTS[c[0]] || 0), 0);
}

function chooseDeclarer(hands) {
    let bestSeat = 'N';
    let bestPts = -1;
    for (const seat of SEAT_ORDER) {
        const pts = hcp(hands[seat]);
        if (pts > bestPts) { bestPts = pts; bestSeat = seat; }
    }
    return bestSeat;
}

function partnerOf(seat) { return seat === 'N' ? 'S' : seat === 'S' ? 'N' : seat === 'E' ? 'W' : 'E'; }
function leftOf(seat) { return seat === 'N' ? 'E' : seat === 'E' ? 'S' : seat === 'S' ? 'W' : 'N'; }

function suitLength(cards, suit) {
    return cards.filter(c => c.endsWith(suit)).length;
}

function chooseTrump(hands, declarer, dummy) {
    const order = ['S', 'H', 'D', 'C'];
    for (const s of order) {
        if (suitLength(hands[declarer], s) + suitLength(hands[dummy], s) >= 8) return s;
    }
    return null; // NT
}

function codeToIndex(code) {
    if (!code) return -1;
    const r = RANKS.indexOf(code[0]);
    const s = SUITS.indexOf(code.slice(-1));
    if (r === -1 || s === -1) return -1;
    return s * 13 + r;
}

function indexToCode(idx) {
    if (idx < 0 || idx > 51) return null;
    const s = SUITS[Math.floor(idx / 13)];
    const r = RANKS[idx % 13];
    return `${r}${s}`;
}

function legalPlays(hand, leadSuit) {
    if (!leadSuit) return hand.slice();
    const follow = hand.filter(c => c.endsWith(leadSuit));
    return follow.length ? follow : hand.slice();
}

function selectFallbackCard({ legal, trick, trump, seat, contractSide }) {
    const rankIndex = (code) => RANKS.indexOf(code[0]);
    const sortAsc = (arr) => arr.slice().sort((a, b) => rankIndex(a) - rankIndex(b));
    const sameSide = (s) => contractSide === 'NS' ? (s === 'N' || s === 'S') : (s === 'E' || s === 'W');
    const lead = trick[0] || null;
    const leadSuit = lead ? lead.code.slice(-1) : null;
    const hasLead = leadSuit && legal.some(c => c.endsWith(leadSuit));
    const leaderSideMatches = lead ? sameSide(lead.seat) === sameSide(seat) : false;
    const trickTargetSuit = (!leadSuit) ? null : (trump && trick.some(t => t.code.endsWith(trump)) ? trump : leadSuit);
    const highestInTarget = (!trickTargetSuit) ? -1 : Math.max(-1, ...trick.filter(t => t.code.endsWith(trickTargetSuit)).map(t => rankIndex(t.code)));
    const winningCards = (cards) => cards.filter(c => c.endsWith(trickTargetSuit) && rankIndex(c) > highestInTarget);

    if (hasLead) {
        const leadPlays = legal.filter(c => c.endsWith(leadSuit));
        const leadIsHonor = lead ? rankIndex(lead.code) >= rankIndex('J') : false;
        const winningOptions = trickTargetSuit ? winningCards(leadPlays) : [];
        const cheapestWinner = winningOptions.length ? winningOptions.sort((a, b) => rankIndex(a) - rankIndex(b))[0] : null;
        if (leaderSideMatches && leadIsHonor) return cheapestWinner || sortAsc(leadPlays)[0];
        if (leaderSideMatches && !leadIsHonor) return cheapestWinner || sortAsc(leadPlays)[0];
        return cheapestWinner || sortAsc(leadPlays)[0];
    }
    const trumpCards = trump ? legal.filter(c => c.endsWith(trump)) : [];
    if (trumpCards.length) return sortAsc(trumpCards)[0];
    return sortAsc(legal)[0];
}

function computeTrickWinner(trick, trump) {
    if (!trick.length) return null;
    const leadSuit = trick[0].code.slice(-1);
    const pool = (trump && trick.some(t => t.code.endsWith(trump)))
        ? trick.filter(t => t.code.endsWith(trump))
        : trick.filter(t => t.code.endsWith(leadSuit));
    const rankIndex = (code) => RANKS.indexOf(code[0]);
    return pool.reduce((best, cur) => (rankIndex(cur.code) > rankIndex(best.code) ? cur : best)).seat;
}

function computeDuplicateScore(contract, _side, tricksWon, vul) {
    const level = contract.level;
    const strain = contract.strain; // 'C','D','H','S','NT'
    const required = 6 + level;
    const over = tricksWon - required;
    const isMajor = (strain === 'H' || strain === 'S');
    const dbl = contract.dbl || 0; // 0/1/2
    const multiplier = dbl === 0 ? 1 : (dbl === 1 ? 2 : 4);
    const trickValue = strain === 'NT' ? 30 : isMajor ? 30 : 20;
    const firstNTBonus = strain === 'NT' ? 10 : 0;
    const breakdown = { trickPoints: 0, insult: 0, gameBonus: 0, partScoreBonus: 0, slamBonus: 0, overtricks: 0, penalties: 0 };

    if (over < 0) {
        const u = -over;
        if (dbl === 0) {
            breakdown.penalties = (vul ? 100 : 50) * u;
            return { total: -breakdown.penalties, breakdown };
        }
        const first = vul ? 200 : 100;
        const secondThird = vul ? 300 : 200;
        const subsequent = 300; // both vul and non-vul
        let pen = 0;
        if (u >= 1) pen += first;
        if (u >= 2) pen += secondThird;
        if (u >= 3) pen += secondThird;
        if (u >= 4) pen += subsequent * (u - 3);
        if (dbl === 2) pen *= 2;
        breakdown.penalties = pen;
        return { total: -pen, breakdown };
    }

    let baseTrickPoints = (strain === 'NT' ? (firstNTBonus + trickValue * level) : (trickValue * level));
    let trickPoints = baseTrickPoints * multiplier;
    let score = trickPoints;
    breakdown.trickPoints = trickPoints;
    if (dbl === 1) { score += 50; breakdown.insult = 50; }
    if (dbl === 2) { score += 100; breakdown.insult = 100; }
    if (trickPoints >= 100) {
        const gb = vul ? 500 : 300;
        score += gb; breakdown.gameBonus = gb;
    } else {
        score += 50; breakdown.partScoreBonus = 50;
    }
    if (over > 0) {
        if (dbl === 0) {
            const val = over * (strain === 'NT' ? 30 : isMajor ? 30 : 20);
            score += val; breakdown.overtricks = val;
        } else if (dbl === 1) {
            const val = over * (vul ? 200 : 100);
            score += val; breakdown.overtricks = val;
        } else {
            const val = over * (vul ? 400 : 200);
            score += val; breakdown.overtricks = val;
        }
    }
    if (level === 6) { const b = vul ? 750 : 500; score += b; breakdown.slamBonus = b; }
    if (level === 7) { const b = vul ? 1500 : 1000; score += b; breakdown.slamBonus = b; }
    return { total: score, breakdown };
}

async function playHand({ useModel }) {
    const hands = deal();
    const declarer = chooseDeclarer(hands);
    const dummy = partnerOf(declarer);
    const trump = chooseTrump(hands, declarer, dummy);
    const strain = trump ? trump : 'NT';
    const contract = { level: trump ? (trump === 'S' || trump === 'H' ? 4 : 5) : 3, strain, dbl: 0 };
    const contractSide = (declarer === 'N' || declarer === 'S') ? 'NS' : 'EW';
    let leader = leftOf(declarer);
    let tricksNS = 0, tricksEW = 0;
    const handsMutable = Object.fromEntries(SEAT_ORDER.map(s => [s, hands[s].slice()]));
    const playedIdx = new Set();

    for (let trickNo = 0; trickNo < 13; trickNo++) {
        const trick = [];
        for (let i = 0; i < 4; i++) {
            const seat = (i === 0) ? leader : leftOf(trick[i - 1].seat);
            const hand = handsMutable[seat];
            const leadSuit = trick.length ? trick[0].code.slice(-1) : null;
            const legal = legalPlays(hand, leadSuit);
            let card = selectFallbackCard({ legal, trick, trump, seat, contractSide });
            if (useModel) {
                const legalIdx = legal.map(codeToIndex).filter(i => i >= 0);
                const gameState = {
                    hand: Array.from({ length: 52 }, (_, idx) => hand.some(c => codeToIndex(c) === idx)),
                    contract: [contract.level, contract.strain, declarer, contract.dbl, 0, 0, 1],
                    trickHistory: Array.from(playedIdx),
                    currentTrick: trick.map(p => codeToIndex(p.code)).filter(i => i >= 0),
                    currentPlayer: SEAT_NUMBER[seat],
                    vulnerability: 0
                };
                const modelChoice = await getModelPlay(gameState, legalIdx);
                if (modelChoice !== null && modelChoice !== undefined) {
                    const fromModel = (typeof modelChoice === 'number') ? indexToCode(modelChoice) : modelChoice;
                    if (fromModel && legal.includes(fromModel)) card = fromModel;
                }
            }
            // remove card
            const idx = hand.indexOf(card);
            if (idx >= 0) hand.splice(idx, 1);
            trick.push({ seat, code: card });
            playedIdx.add(codeToIndex(card));
        }
        const winner = computeTrickWinner(trick, trump);
        if (winner === 'N' || winner === 'S') tricksNS++; else tricksEW++;
        leader = winner;
    }
    const tricksDecl = contractSide === 'NS' ? tricksNS : tricksEW;
    const score = computeDuplicateScore(contract, contractSide, tricksDecl, false).total;
    return { score, contractSide };
}

async function main() {
    globalThis.tf = tf;
    await loadPlayModel();
    let modelBetter = 0;
    let fallbackBetter = 0;
    let ties = 0;
    for (let i = 0; i < 100; i++) {
        const withModel = await playHand({ useModel: true });
        const withFallback = await playHand({ useModel: false });
        if (withModel.score > withFallback.score) modelBetter++;
        else if (withFallback.score > withModel.score) fallbackBetter++;
        else ties++;
    }
    console.log('Model vs fallback over 100 deals');
    console.log({ modelBetter, fallbackBetter, ties });
}

main().catch(err => {
    console.error('Comparison run failed:', err);
    process.exit(1);
});
