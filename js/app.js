/**
 * Main application logic for the Bridge Bidding System web interface.
 * Enhanced version with hand generation, auction management, and automated bidding.
 */

let system = null;
let systemReady = false;
let generationMode = 'random';
let handVisibility = 'south';
let currentHands = { N: null, E: null, S: null, W: null };
let currentAuction = null;
let currentTurn = null;
let auctionActive = false;
let dealer = 'S';
let vulnerability = { ns: false, ew: false };
let auctionHistory = [];
let availableConventions = {};
let enabledConventions = {};
let practiceConventions = [];
let selectedPracticeConventions = {}; // Track one selected convention per category
let conventionCategories = {};
let mutuallyExclusiveGroups = [];

// Initialize system when page loads
function initializeSystem() {
    try {
        console.log('Starting initialization...');
        
        if (typeof SAYCBiddingSystem === 'undefined') {
            throw new Error('SAYCBiddingSystem is not defined - scripts may not have loaded correctly');
        }
        
        system = new SAYCBiddingSystem();
        
        // Load conventions configuration (from inlined defaults or built-in)
        system.conventions.loadConfig().then(async () => {
            console.log('Conventions config loaded successfully');
            // Apply any persisted General Settings before building UI
            try {
                const saved = loadPersistedGeneralSettings();
                if (saved) {
                    applyGeneralSettingsToConfig(saved);
                }
            } catch (e) {
                console.warn('Failed to apply persisted general settings:', e);
            }
            await initializeConventionUI();
        }).catch(async (configError) => {
            console.warn('Config loading failed, using default config:', configError.message);
            await initializeConventionUI();
        });
        
        systemReady = true;
        console.log('Bridge bidding system initialized successfully');
        
        // Hide loading indicator and show interface
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
        
        // Enable buttons
        enableUI();
        
    } catch (error) {
        console.error('Initialization failed:', error);
        showError('Error loading bidding system: ' + error.message);
    }
}

function enableUI() {
    // Enable all buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = false);
    
    // Set initial generation mode (Random is checked by default)
    setGenerationMode('random');

    // Hook up dealer/vulnerability overlays
    try {
        const dealerSel = document.getElementById('dealer');
        const vulnSel = document.getElementById('vulnerability');
        if (dealerSel) dealerSel.addEventListener('change', updateTableOverlays);
        if (vulnSel) vulnSel.addEventListener('change', updateTableOverlays);
        // Initial paint
        updateTableOverlays();
    } catch (e) {
        console.warn('Could not initialize table overlays:', e?.message || e);
    }
}

function showError(message) {
    const indicator = document.getElementById('loadingIndicator');
    if (indicator) {
        indicator.className = 'alert alert-danger text-center';
        indicator.innerHTML = '<i class="bi bi-exclamation-triangle"></i> ' + message;
    }
}

// Hand Generation Functions
function setGenerationMode(mode) {
    generationMode = mode;
    
    console.log('Setting generation mode to:', mode);
    
    // Show/hide appropriate mode panels - hide all first
    document.querySelectorAll('.generation-mode').forEach(panel => {
        panel.style.display = 'none';
        console.log('Hiding panel:', panel.id);
    });
    
    // Show/hide the generation buttons based on mode
    const generateBtn = document.getElementById('generateBtn');
    const generateAndViewBtn = document.getElementById('generateAndViewBtn');
    if (generateBtn) {
        // Hide the old standalone button by default; we prefer a single combined action
        generateBtn.style.display = 'none';
    }
    if (generateAndViewBtn) {
        generateAndViewBtn.style.display = (mode === 'random') ? 'inline-block' : 'none';
    }
    
    // Show the selected mode panel (if it exists)
    if (mode === 'manual') {
        const targetPanel = document.getElementById('manualMode');
        if (targetPanel) {
            targetPanel.style.display = 'block';
            console.log('Showing panel: manualMode');
        }
    } else if (mode === 'constraints') {
        const targetPanel = document.getElementById('constraintMode');
        if (targetPanel) {
            targetPanel.style.display = 'block';
            console.log('Showing panel: constraintMode');
        }
    }
    // For 'random' mode, no special panel is needed - just the generate button
}

function generateRandomHands() {
    console.log('generateRandomHands called');
    
    try {
        // Cancel any in-progress auction before creating a new deal
        resetAuctionForNewDeal();

        // Check if system is ready
        if (!systemReady || !system) {
            console.error('System not ready yet');
            showError('System not ready. Please wait for initialization to complete.');
            return;
        }
        
        console.log('Selected practice conventions:', selectedPracticeConventions);
        
        // Check if we're in practice mode
        const hasSelectedPracticeConventions = Object.values(selectedPracticeConventions).some(conv => conv !== null);
        if (hasSelectedPracticeConventions) {
            console.log('Using practice mode generation');
            return generateHandsForPractice();
        }
        
        console.log('Generating random hands...');
        
        // Generate 4 random 13-card hands
        const deck = createDeck();
        shuffleDeck(deck);
        
        console.log('Deck created and shuffled');
        
        // Convert deck cards to suit-separated format for Hand constructor
        currentHands.N = new window.Hand(convertCardsToHandString(deck.slice(0, 13)));
        currentHands.E = new window.Hand(convertCardsToHandString(deck.slice(13, 26)));
        currentHands.S = new window.Hand(convertCardsToHandString(deck.slice(26, 39)));
        currentHands.W = new window.Hand(convertCardsToHandString(deck.slice(39, 52)));
        
        console.log('Hands created successfully');
        
    displayHands();
    showAuctionSetup();
    // Auto-switch to Auction tab for streamlined flow
    try { switchTab('auction'); } catch (e) { console.warn('Could not switch to auction tab:', e); }
        
        console.log('Random hands generation completed');
        
    } catch (error) {
        console.error('Error generating random hands:', error);
        showError('Error generating hands: ' + error.message);
    }
}

function validateSuitInput() {
    const spades = document.getElementById('spadesInput').value.trim().toUpperCase();
    const hearts = document.getElementById('heartsInput').value.trim().toUpperCase();
    const diamonds = document.getElementById('diamondsInput').value.trim().toUpperCase();
    const clubs = document.getElementById('clubsInput').value.trim().toUpperCase();
    
    const errorDiv = document.getElementById('handValidationError');
    const cardCountDiv = document.getElementById('cardCount');
    
    const suitInputs = [
        { element: document.getElementById('spadesInput'), cards: spades, name: 'Spades' },
        { element: document.getElementById('heartsInput'), cards: hearts, name: 'Hearts' },
        { element: document.getElementById('diamondsInput'), cards: diamonds, name: 'Diamonds' },
        { element: document.getElementById('clubsInput'), cards: clubs, name: 'Clubs' }
    ];
    
    try {
        const allCards = [];
        let totalCards = 0;
        
        // Validate each suit
        suitInputs.forEach((suit, suitIndex) => {
            if (suit.cards === '') {
                // Empty suit is ok (void)
                suit.element.classList.remove('valid', 'invalid');
                return;
            }
            
            // Check for duplicate cards within the same suit first
            const suitCards = suit.cards.split('');
            const uniqueCards = [...new Set(suitCards)];
            if (suitCards.length !== uniqueCards.length) {
                throw new Error(`Duplicate cards in ${suit.name}`);
            }
            
            // Validate each card in the suit
            for (let card of suit.cards) {
                if (!'AKQJT98765432'.includes(card)) {
                    throw new Error(`Invalid card '${card}' in ${suit.name}. Use A,K,Q,J,T,9,8,7,6,5,4,3,2`);
                }
                
                // Create a unique card identifier (card + suit)
                const suitSymbols = ['♠', '♥', '♦', '♣'];
                const fullCard = card + suitSymbols[suitIndex];
                
                if (allCards.includes(fullCard)) {
                    throw new Error(`Card '${fullCard}' appears multiple times`);
                }
                
                allCards.push(fullCard);
                totalCards++;
            }
            
            suit.element.classList.remove('invalid');
            suit.element.classList.add('valid');
        });
        
        // Calculate HCP (High Card Points)
        let hcp = 0;
        suitInputs.forEach(suit => {
            for (let card of suit.cards) {
                hcp += window.POINTS[card] || 0;
            }
        });
        
        // Calculate DP (Distribution Points) only if we have exactly 13 cards
        let dp = 0;
        let displayText = `Cards: ${totalCards}/13, HCP: ${hcp}`;
        
        if (totalCards === 13) {
            // Calculate distribution points: void=3, singleton=2, doubleton=1
            suitInputs.forEach(suit => {
                const length = suit.cards.length;
                if (length === 0) dp += 3;       // void
                else if (length === 1) dp += 2;  // singleton
                else if (length === 2) dp += 1;  // doubleton
            });
            displayText += `, DP: ${dp}`;
        }
        
    // Update card count with HCP and DP (centered and blue)
    cardCountDiv.textContent = displayText;
    cardCountDiv.style.color = '#3498db';
        
        if (totalCards > 13) {
            throw new Error(`Too many cards: ${totalCards}/13`);
        }
        
        errorDiv.textContent = '';
        return true; // Always return true for UI validation - just update display
        
    } catch (error) {
        // Mark all inputs as invalid if there's an error
        suitInputs.forEach(suit => {
            if (suit.cards !== '') {
                suit.element.classList.remove('valid');
                suit.element.classList.add('invalid');
            }
        });
        
        errorDiv.textContent = error.message;
        cardCountDiv.textContent = `Cards: ${totalCards}/13`;
        cardCountDiv.style.color = '#dc3545';
        return false;
    }
}

// Keep the old function for backwards compatibility (if needed elsewhere)
function validateHandInput(position) {
    const input = document.getElementById(position + 'HandInput');
    const errorDiv = document.getElementById(position + 'HandError');
    const handString = input.value.trim();
    
    if (!handString) {
        input.classList.remove('valid', 'invalid');
        errorDiv.textContent = '';
        return true;
    }
    
    try {
        const suits = handString.split(/\s+/);
        
        if (suits.length !== 4) {
            throw new Error('Must have exactly 4 suits');
        }
        
        const allCards = [];
        let totalCards = 0;
        
        suits.forEach((suitCards, index) => {
            const suitName = ['spades', 'hearts', 'diamonds', 'clubs'][index];
            
            if (suitCards === '') {
                // Empty suit is ok (void)
                return;
            }
            
            // Validate each card in the suit
            for (let card of suitCards) {
                if (!'AKQJT98765432'.includes(card)) {
                    throw new Error(`Invalid card '${card}' in ${suitName}. Use A,K,Q,J,T,9,8,7,6,5,4,3,2`);
                }
                
                if (allCards.includes(card + index)) {
                    throw new Error(`Duplicate card '${card}' in ${suitName}`);
                }
                
                allCards.push(card + index);
                totalCards++;
            }
        });
        
        if (totalCards !== 13) {
            throw new Error(`Must have exactly 13 cards, found ${totalCards}`);
        }
        
        // Check for duplicate cards across all suits
        const cardCounts = {};
        suits.forEach(suitCards => {
            for (let card of suitCards) {
                cardCounts[card] = (cardCounts[card] || 0) + 1;
                if (cardCounts[card] > 1) {
                    throw new Error(`Card '${card}' appears more than once`);
                }
            }
        });
        
        input.classList.remove('invalid');
        input.classList.add('valid');
        errorDiv.textContent = '';
        return true;
        
    } catch (error) {
        input.classList.remove('valid');
        input.classList.add('invalid');
        errorDiv.textContent = error.message;
        return false;
    }
}

function generateFromManualHands() {
    console.log('generateFromManualHands called');
    
    try {
        // Cancel any in-progress auction before creating a new deal
        resetAuctionForNewDeal();

        if (!systemReady || !system) {
            console.error('System not ready yet');
            showError('System not ready. Please wait for initialization to complete.');
            return;
        }
        
        // Get the suit inputs
        const spades = document.getElementById('spadesInput').value.trim().toUpperCase();
        const hearts = document.getElementById('heartsInput').value.trim().toUpperCase();
        const diamonds = document.getElementById('diamondsInput').value.trim().toUpperCase();
        const clubs = document.getElementById('clubsInput').value.trim().toUpperCase();
        
        console.log('Input values:', { spades, hearts, diamonds, clubs });
        
        // Check that we have exactly 13 cards
        const totalCards = spades.length + hearts.length + diamonds.length + clubs.length;
        console.log('Total cards:', totalCards);
        if (totalCards !== 13) {
            showError(`Hand must have exactly 13 cards. Current: ${totalCards}`);
            return;
        }
        
        // Validate the suit inputs (check for errors)
        console.log('Running validation...');
        validateSuitInput(); // This will update the UI and show any errors
        
        // Check if there are any validation errors displayed
        const errorDiv = document.getElementById('handValidationError');
        if (errorDiv.textContent.trim() !== '') {
            showError('Please fix the errors in your hand entry: ' + errorDiv.textContent);
            return;
        }
        
        console.log('Validation passed, continuing...');
        
        // Create the hand string for South in the format "spades hearts diamonds clubs"
        // Each suit must be represented, use empty string for void suits
        const suitStrings = [
            spades || '',
            hearts || '', 
            diamonds || '',
            clubs || ''
        ];
        const southHandString = suitStrings.join(' ');
        console.log('South hand string:', southHandString);
        
        // Create South's hand
        console.log('Creating South hand with string:', southHandString);
        const southHand = new window.Hand(southHandString);
        console.log('South hand created:', southHand);
        currentHands['S'] = southHand;
        
        // Track used cards from South's hand
        const usedCards = [];
        ['S', 'H', 'D', 'C'].forEach(suit => {
            if (southHand.suitBuckets[suit]) {
                southHand.suitBuckets[suit].forEach(card => {
                    // Store as string in same format as deck (rank + suit)
                    usedCards.push(card.rank + suit);
                });
            }
        });
        
        console.log('South hand created, used cards:', usedCards.length, usedCards);
        
        // Generate remaining hands randomly for North, East, West
        const deck = createDeck();
        const availableCards = deck.filter(deckCard => {
            return !usedCards.includes(deckCard);
        });
        
        shuffleDeck(availableCards);
        
        // Generate North, East, West hands
        const positions = ['N', 'E', 'W'];
        let cardIndex = 0;
        
        positions.forEach(pos => {
            const handCards = availableCards.slice(cardIndex, cardIndex + 13);
            currentHands[pos] = new window.Hand(convertCardsToHandString(handCards));
            cardIndex += 13;
        });
        
        console.log('All hands generated successfully');
        console.log('Current hands:', currentHands);
        
        console.log('Calling displayHands()...');
        displayHands();
    console.log('Calling showAuctionSetup()...');
    showAuctionSetup();
    // Auto-switch to Auction tab after generating from manual input
    try { switchTab('auction'); } catch (e) { console.warn('Could not switch to auction tab:', e); }
        console.log('Manual hand generation completed');
        
    } catch (error) {
        console.error('Error in generateFromManualHands:', error);
        showError('Error generating hands: ' + error.message);
    }
}

function generateWithConstraints() {
    console.log('generateWithConstraints called');
    
    try {
        // Cancel any in-progress auction before creating a new deal
        resetAuctionForNewDeal();

        // Check if system is ready
        if (!systemReady || !system) {
            console.error('System not ready yet');
            showError('System not ready. Please wait for initialization to complete.');
            return;
        }
        
        // Get constraint values from the UI
        const constraints = getConstraints();
        console.log('Constraints:', constraints);
        
        // This is a simplified version - full constraint handling would be complex
        // For now, generate random hands and check if they approximately match constraints
        let attempts = 0;
        let success = false;
        
        while (attempts < 100 && !success) {
            // Generate basic random hands without calling generateRandomHands to avoid recursion
            const deck = createDeck();
            shuffleDeck(deck);
            
            // Convert deck cards to suit-separated format for Hand constructor
            currentHands.N = new window.Hand(convertCardsToHandString(deck.slice(0, 13)));
            currentHands.E = new window.Hand(convertCardsToHandString(deck.slice(13, 26)));
            currentHands.S = new window.Hand(convertCardsToHandString(deck.slice(26, 39)));
            currentHands.W = new window.Hand(convertCardsToHandString(deck.slice(39, 52)));
            
            // Check if hands roughly match constraints
            success = checkConstraints(constraints);
            attempts++;
        }
        
        if (!success) {
            alert('Could not generate hands matching constraints after 100 attempts. Try looser constraints.');
            console.log('Failed to match constraints after 100 attempts');
        } else {
            console.log(`Successfully generated hands with constraints in ${attempts} attempts`);
        }
        
    displayHands();
    showAuctionSetup();
    // Auto-switch to Auction tab after constrained generation
    try { switchTab('auction'); } catch (e) { console.warn('Could not switch to auction tab:', e); }
        
    } catch (error) {
        console.error('Error generating with constraints:', error);
        showError('Error generating with constraints: ' + error.message);
    }
}

function generateConstrainedHands() {
    generateWithConstraints();
}

function getConstraints() {
    // Read constraint values from the UI inputs
    const positions = ['north', 'east', 'south', 'west'];
    const constraints = {};
    
    positions.forEach(position => {
        constraints[position] = {
            hcp: { min: getInputValue(`${position}HcpMin`), max: getInputValue(`${position}HcpMax`) },
            spades: { min: getInputValue(`${position}SpadesMin`), max: getInputValue(`${position}SpadesMax`) },
            hearts: { min: getInputValue(`${position}HeartsMin`), max: getInputValue(`${position}HeartsMax`) },
            diamonds: { min: getInputValue(`${position}DiamondsMin`), max: getInputValue(`${position}DiamondsMax`) },
            clubs: { min: getInputValue(`${position}ClubsMin`), max: getInputValue(`${position}ClubsMax`) }
        };
    });
    
    return constraints;
}

function getInputValue(inputId) {
    const input = document.getElementById(inputId);
    if (input && input.value.trim() !== '') {
        return parseInt(input.value);
    }
    return null;
}

function checkConstraints(constraints) {
    const positions = ['north', 'east', 'south', 'west'];
    const hands = [currentHands.N, currentHands.E, currentHands.S, currentHands.W];
    
    for (let i = 0; i < positions.length; i++) {
        const position = positions[i];
        const hand = hands[i];
        const constraint = constraints[position];
        
        if (!hand) continue;
        
        // Check HCP constraint
        if (constraint.hcp.min !== null && hand.hcp < constraint.hcp.min) {
            return false;
        }
        if (constraint.hcp.max !== null && hand.hcp > constraint.hcp.max) {
            return false;
        }
        
        // Check suit length constraints
        const suits = ['spades', 'hearts', 'diamonds', 'clubs'];
        const suitCodes = ['S', 'H', 'D', 'C'];
        
        for (let j = 0; j < suits.length; j++) {
            const suitLength = hand.lengths[suitCodes[j]];
            if (constraint[suits[j]].min !== null && suitLength < constraint[suits[j]].min) {
                return false;
            }
            if (constraint[suits[j]].max !== null && suitLength > constraint[suits[j]].max) {
                return false;
            }
        }
    }
    
    return true;
}

// Hand Display Functions
function toggleHandVisibility(mode) {
    handVisibility = mode;
    
    // Update button states
    document.getElementById('southOnlyBtn').classList.toggle('btn-light', mode === 'south');
    document.getElementById('southOnlyBtn').classList.toggle('btn-outline-light', mode !== 'south');
    document.getElementById('allHandsBtn').classList.toggle('btn-light', mode === 'all');
    document.getElementById('allHandsBtn').classList.toggle('btn-outline-light', mode !== 'all');
    
    // Show/hide hands - South hand is always visible
    const showAll = mode === 'all';
    document.getElementById('southHand').style.display = 'block'; // Always show South
    document.getElementById('northHand').style.display = showAll ? 'block' : 'none';
    document.getElementById('eastHand').style.display = showAll ? 'block' : 'none';
    document.getElementById('westHand').style.display = showAll ? 'block' : 'none';
}

let otherHandsVisible = false;

function toggleOtherHands() {
    otherHandsVisible = !otherHandsVisible;
    const toggleBtn = document.getElementById('toggleHandsBtn');
    const handsGrid = document.querySelector('.hands-grid');
    
    if (otherHandsVisible) {
        // Show all hands
        document.getElementById('northHand').style.display = 'block';
        document.getElementById('eastHand').style.display = 'block';
        document.getElementById('westHand').style.display = 'block';
        toggleBtn.textContent = 'Hide Other Hands';
        if (handsGrid) handsGrid.classList.remove('solo-south');
    } else {
        // Hide other hands, keep South visible
        document.getElementById('northHand').style.display = 'none';
        document.getElementById('eastHand').style.display = 'none';
        document.getElementById('westHand').style.display = 'none';
        toggleBtn.textContent = 'Show Other Hands';
        if (handsGrid) handsGrid.classList.add('solo-south');
    }
}

function displayHands() {
    console.log('displayHands called');
    console.log('currentHands.S:', currentHands.S);
    
    if (!currentHands.S) {
        console.error('No South hand to display');
        return;
    }
    
    console.log('Displaying all hands...');
    
    // Display all hands
    displaySingleHand('north', currentHands.N);
    displaySingleHand('east', currentHands.E);
    displaySingleHand('south', currentHands.S);
    displaySingleHand('west', currentHands.W);
    
    // Show game layout
    const gameLayout = document.getElementById('gameLayout');
    if (gameLayout) {
        gameLayout.style.display = 'grid';
        console.log('Game layout made visible');
    } else {
        console.error('gameLayout element not found');
    }

    // Clear any previous "Auction Ended" banner or status from a prior deal
    try {
        const auctionGrid = document.querySelector('.auction-grid');
        if (auctionGrid) {
            auctionGrid.querySelectorAll('.auction-result').forEach(el => el.remove());
        }
        const auctionStatus = document.getElementById('auctionStatus');
        if (auctionStatus) {
            // Reset to the default prompt shown on initial load
            auctionStatus.textContent = 'Click "Start Auction" to begin bidding.';
            auctionStatus.className = 'alert alert-info';
        }
    } catch (cleanupErr) {
        console.warn('Could not clear previous auction end state:', cleanupErr?.message || cleanupErr);
    }
    
    // On a new deal, ensure dealer/vulnerability controls are unlocked even if a prior auction was active
    try { setDealerVulnerabilityDisabled(false); } catch (e) {}

    // Show start auction button
    const startAuctionBtn = document.getElementById('startAuctionBtn');
    if (startAuctionBtn) {
        startAuctionBtn.style.display = 'inline-block';
    }
    
    // Set initial visibility based on General Settings preference (default: show all)
    const persistedGS = (function(){ try { return loadPersistedGeneralSettings(); } catch(_) { return null; } })();
    const showAllByDefault = (persistedGS && typeof persistedGS.show_all_hands_by_default === 'boolean') ? persistedGS.show_all_hands_by_default : true;
    otherHandsVisible = !!showAllByDefault;
    // South is always visible
    document.getElementById('southHand').style.display = 'block';
    document.getElementById('northHand').style.display = otherHandsVisible ? 'block' : 'none';
    document.getElementById('eastHand').style.display  = otherHandsVisible ? 'block' : 'none';
    document.getElementById('westHand').style.display  = otherHandsVisible ? 'block' : 'none';
    // Toggle layout class to avoid overlay overlapping when only South is shown
    try {
        const handsGrid = document.querySelector('.hands-grid');
        if (handsGrid) {
            handsGrid.classList.toggle('solo-south', !otherHandsVisible);
        }
    } catch (_) {}

    const toggleBtn = document.getElementById('toggleHandsBtn');
    if (toggleBtn) {
        toggleBtn.textContent = otherHandsVisible ? 'Hide Other Hands' : 'Show Other Hands';
    }
    
    // Update center overlay badges based on current selects
    try { updateTableOverlays(); } catch (e) {}

    // Before any auction starts, keep bid pad disabled by default
    try { setAllBidButtonsDisabled(true); } catch (_) {}

    console.log('displayHands completed');
}

function displaySingleHand(position, hand) {
    console.log(`displaySingleHand called for ${position}`, hand);
    
    if (!hand) {
        console.error(`No hand provided for ${position}`);
        return;
    }
    
    const contentElement = document.getElementById(`${position}HandContent`);
    if (!contentElement) {
        console.error(`Content element for ${position} not found`);
        return;
    }
    
    // Build the hand display HTML
    const suitSymbols = { 'S': '♠', 'H': '♥', 'D': '♦', 'C': '♣' };
    const suitColors = { 'S': '#000', 'H': '#d63031', 'D': '#d63031', 'C': '#000' };
    
    let handHTML = '';
    ['S', 'H', 'D', 'C'].forEach(suitCode => {
        const cards = hand.suitBuckets[suitCode] ? 
            hand.suitBuckets[suitCode].map(card => card.rank).join(' ') : '-';
        
        handHTML += `
            <div class="hand-suit">
                <span class="suit-symbol" style="color: ${suitColors[suitCode]}">${suitSymbols[suitCode]}</span>
                <span class="suit-cards">${cards}</span>
            </div>
        `;
    });
    
    // Calculate distribution points
    const distPoints = calculateDistributionPoints(hand);
    
    // Add HCP and DP display
    handHTML += `<div style="margin-top: 10px; font-size: 0.9em; color: #3498db;">HCP: ${hand.hcp} | DP: ${distPoints}</div>`;
    
    contentElement.innerHTML = handHTML;
    console.log(`Displayed hand for ${position} with ${hand.hcp} HCP and ${distPoints} DP`);
}

function calculateDistributionPoints(hand) {
    // Calculate distribution points using standard method
    let distPoints = 0;
    const lengths = [hand.lengths.S, hand.lengths.H, hand.lengths.D, hand.lengths.C];
    
    lengths.forEach(length => {
        if (length >= 5) {
            distPoints += (length - 4); // 1 point for 5th card, 2 for 6th, etc.
        }
    });
    
    return distPoints;
}

// Update center overlay badges for dealer and vulnerability
function updateTableOverlays() {
    const dealerSel = document.getElementById('dealer');
    const vulnSel = document.getElementById('vulnerability');
    const dealerBadge = document.getElementById('dealerBadge');
    const vulnBadge = document.getElementById('vulnBadge');
    if (!dealerSel || !vulnSel || !dealerBadge || !vulnBadge) return;

    const dealerMap = { N: 'North', E: 'East', S: 'South', W: 'West' };
    const vulnMap = { none: 'None', ns: 'N-S', ew: 'E-W', both: 'Both' };

    const dVal = dealerSel.value || 'S';
    const vVal = vulnSel.value || 'none';

    dealerBadge.textContent = `Dealer: ${dealerMap[dVal] || dVal}`;
    vulnBadge.textContent = `Vul: ${vulnMap[vVal] || vVal}`;

    // Reset and apply vuln color class
    vulnBadge.classList.remove('vul-none', 'vul-ns', 'vul-ew', 'vul-both');
    vulnBadge.classList.add(`vul-${vVal}`);
}

// Fully reset any in-progress auction when starting a new deal
function resetAuctionForNewDeal() {
    try {
        // Flags and state
        auctionActive = false;
        auctionHistory = [];
        currentAuction = [];
        currentTurn = null;

        // Engine state (if present)
        try {
            if (system && typeof system === 'object') {
                if (system.currentAuction) system.currentAuction = null;
            }
        } catch (_) {}

        // UI cleanup
        const biddingInterface = document.getElementById('biddingInterface');
        if (biddingInterface) biddingInterface.style.display = 'none';

        const auctionBids = document.getElementById('auctionBids');
        if (auctionBids) auctionBids.innerHTML = '';

        const explanationsList = document.getElementById('explanationsList');
        if (explanationsList) explanationsList.innerHTML = '';

        const auctionStatus = document.getElementById('auctionStatus');
        if (auctionStatus) {
            auctionStatus.textContent = 'Click "Start Auction" to begin bidding.';
            auctionStatus.className = 'alert alert-info';
        }

        const startAuctionBtn = document.getElementById('startAuctionBtn');
        if (startAuctionBtn) startAuctionBtn.style.display = 'inline-block';

        // Remove any prior "auction ended" banner rows, if still present
        try {
            const auctionGrid = document.querySelector('.auction-grid');
            if (auctionGrid) auctionGrid.querySelectorAll('.auction-result').forEach(el => el.remove());
        } catch (_) {}

        // Ensure controls are enabled so user can adjust before next auction
        try { setDealerVulnerabilityDisabled(false); } catch (_) {}
    } catch (e) {
        console.warn('resetAuctionForNewDeal encountered an issue:', e?.message || e);
    }
}

// Enable/disable Dealer and Vulnerability controls during an active auction
function setDealerVulnerabilityDisabled(disabled) {
    try {
        const dealerSel = document.getElementById('dealer');
        const vulnSel = document.getElementById('vulnerability');
        if (dealerSel) dealerSel.disabled = !!disabled;
        if (vulnSel) vulnSel.disabled = !!disabled;
    } catch (e) {
        console.warn('Failed to toggle dealer/vulnerability controls:', e?.message || e);
    }
}

// Auction Management Functions
function showAuctionSetup() {
    console.log('showAuctionSetup called');
    const auctionSetupElement = document.getElementById('auctionSetup');
    if (auctionSetupElement) {
        auctionSetupElement.style.display = 'block';
        console.log('Auction setup made visible');
    } else {
        // This is optional - auction works without it
        console.log('auctionSetup element not found (optional)');
    }
}

function startAuction() {
    console.log('startAuction called');
    
    // Force switch to Practice Bids tab
    showTab('practice-bids');
    console.log('Switched to Practice Bids tab');
    
    // Ensure any previous "Auction Ended" indicators are cleared before starting
    try {
        const auctionGrid = document.querySelector('.auction-grid');
        if (auctionGrid) {
            auctionGrid.querySelectorAll('.auction-result').forEach(el => el.remove());
        }
    } catch (cleanupErr) {
        console.warn('Could not clear previous auction result row:', cleanupErr?.message || cleanupErr);
    }

    // Show auction content
    const auctionContent = document.getElementById('auctionContent');
    if (auctionContent) {
        auctionContent.style.display = 'block';
        console.log('Auction content made visible');
    } else {
        console.error('auctionContent element not found');
    }
    
    // Immediately show bidding interface if dealer is South
    const dealer = document.getElementById('dealer').value;
    if (dealer === 'S') {
        console.log('Dealer is South - pre-showing bidding interface');
        const biddingInterface = document.getElementById('biddingInterface');
        if (biddingInterface) {
            biddingInterface.style.display = 'block';
            console.log('Pre-showed bidding interface for South dealer');
        }
    }
    
    // Hide start auction button
    const startAuctionBtn = document.getElementById('startAuctionBtn');
    if (startAuctionBtn) {
        startAuctionBtn.style.display = 'none';
    }
    
    // Update auction status to show the auction has started
    const auctionStatus = document.getElementById('auctionStatus');
    if (auctionStatus) {
        auctionStatus.textContent = 'Auction in progress...';
        auctionStatus.className = 'alert alert-success';
    } else {
        console.error('auctionStatus element not found');
    }
    
    // Call the existing auction initialization
    startNewAuction();
}

function startNewAuction() {
    try {
        if (!currentHands.S) {
            alert('Please generate hands first');
            return;
        }
        
        // Clear prior UI remnants so a restart begins cleanly
        try {
            const auctionBids = document.getElementById('auctionBids');
            if (auctionBids) auctionBids.innerHTML = '';
            const explanationsList = document.getElementById('explanationsList');
            if (explanationsList) explanationsList.innerHTML = '';
            const auctionGrid = document.querySelector('.auction-grid');
            if (auctionGrid) auctionGrid.querySelectorAll('.auction-result').forEach(el => el.remove());
        } catch (_) {}

        // Get dealer and vulnerability settings
        dealer = document.getElementById('dealer').value;
        const vulSetting = document.getElementById('vulnerability').value;
        
        // Set vulnerability
        vulnerability.ns = vulSetting === 'ns' || vulSetting === 'both';
        vulnerability.ew = vulSetting === 'ew' || vulSetting === 'both';
        
        // Initialize auction
        auctionHistory = [];
        currentAuction = [];
        auctionActive = true;
    // Lock Dealer/Vulnerability controls while auction is active
    setDealerVulnerabilityDisabled(true);
        
        // Initialize bidding system for this auction (human is always South)
        if (typeof system.startAuctionWithDealer !== 'function') {
            // Shim helper: start auction and set dealer rotation
            system.startAuctionWithDealer = function(ourSeat, dealerSeat, vulNS, vulEW) {
                this.startAuction(ourSeat, /*we*/ vulNS, /*they*/ vulEW);
                if (this.currentAuction && typeof this.currentAuction.reseat === 'function') {
                    this.currentAuction.reseat(dealerSeat);
                } else if (this.currentAuction) {
                    this.currentAuction.dealer = dealerSeat;
                }
            };
        }
        system.startAuctionWithDealer('S', dealer, vulnerability.ns, vulnerability.ew);
        
        // Update auction table headers to show dealer first
        updateAuctionHeaders();
        
    // Determine starting position (first to bid is the dealer)
    currentTurn = dealer;
        
        // Update UI
        updateAuctionTable();
        updateAuctionStatus();
        
        // Start bidding sequence
        processTurn();
        
    } catch (error) {
        console.error('Error starting auction:', error);
        showError('Error starting auction: ' + error.message);
    }
}

function processTurn() {
    if (!auctionActive) return;
    
    console.log(`processTurn called: currentTurn = ${currentTurn}`);
    
    // Check if auction should end before processing turn
    if (isAuctionComplete()) {
        console.log('Auction is complete at start of processTurn, ending...');
        endAuction();
        return;
    }
    
    if (currentTurn === 'S') {
        // Player's turn
        console.log('Showing bidding interface for South');
        
        // Check parent container first
        const auctionContent = document.getElementById('auctionContent');
        console.log('auctionContent element:', auctionContent);
        console.log('auctionContent display:', auctionContent ? auctionContent.style.display : 'not found');
        
        const biddingInterface = document.getElementById('biddingInterface');
        console.log('biddingInterface element:', biddingInterface);
        console.log('biddingInterface display:', biddingInterface ? biddingInterface.style.display : 'not found');
        
        // Ensure parent is visible
        if (auctionContent) {
            auctionContent.style.display = 'block';
            console.log('Ensured auctionContent is visible');
        }
        
        if (biddingInterface) {
            biddingInterface.style.display = 'block';
            console.log('Bidding interface displayed');
        } else {
            console.error('Bidding interface element not found');
        }
    // Re-enable appropriate buttons for user's turn
    updateBidButtons();
        
        // Debug: Check if buttons are enabled
        const bidButtons = document.querySelectorAll('.bid-button');
        console.log('Bid buttons found:', bidButtons.length);
        bidButtons.forEach((btn, index) => {
            if (index < 5) { // Log first 5 buttons
                console.log(`Button ${index}: disabled=${btn.disabled}, onclick=${btn.getAttribute('onclick')}`);
            }
        });
    } else {
        // System's turn
        console.log(`System turn for ${currentTurn}`);
        const biddingInterface = document.getElementById('biddingInterface');
        if (biddingInterface) {
            biddingInterface.style.display = 'none';
        }
        // Disable all bid buttons while it's not the user's turn
        try { setAllBidButtonsDisabled(true); } catch (_) {}
        setTimeout(() => makeSystemBid(), 1000); // Delay for realism
    }
}

function isPartnerResponse(auctionLength) {
    // Determine if the current bid is from partner or opponent
    // Auction positions: 1=South, 2=West, 3=North, 4=East (if South deals)
    // Partners: South-North (1,3), West-East (2,4)
    
    if (auctionLength === 1) {
        // Second bid - if South opened, this should be West (opponent)
        // If West opened, this should be North (opponent)
        // Since we're checking after South's 2C, position 2 is West (opponent)
        return false; // Position 2 (West) is opponent to South
    } else if (auctionLength === 2) {
        // Third bid - if South opened, this should be North (partner)
        return true; // Position 3 (North) is partner to South
    } else if (auctionLength === 3) {
        // Fourth bid - if South opened, this should be East (opponent) 
        return false; // Position 4 (East) is opponent to South
    }
    
    // For longer auctions, use modulo to determine partnership
    // Positions 1,3,5,7... are South/North partnership
    // Positions 2,4,6,8... are West/East partnership
    const position = (auctionLength % 4) + 1;
    return position === 1 || position === 3; // South or North
}

function getConventionExplanation(bid, auction) {
    const bidToken = bid.token;
    const tokens = auction.map(b => b.token).filter(Boolean);
    const suitName = (s) => ({ C: 'clubs', D: 'diamonds', H: 'hearts', S: 'spades' }[s] || s);
    const isSuit = /^[1-7][CDHS]$/.test(bidToken || '');
    const isNT = /^[1-7]NT$/.test(bidToken || '');
    
    // 1-level suit openings (basic SAYC summaries)
    // Show for true openings even after passes (first non-pass in auction)
    if (/^[1][CDHS]$/.test(bidToken)) {
        const prior = auction.slice(0, auction.length);
        const hadAnyNonPass = prior.some(b => (b.token || 'PASS') !== 'PASS');
        const isFirstNonPass = !hadAnyNonPass || (hadAnyNonPass && (function(){
            for (let i = 0; i < prior.length; i++) { if ((prior[i].token || 'PASS') !== 'PASS') return false; }
            return true;
        })());
        if (auction.length === 0 || isFirstNonPass) {
        const s = bidToken.slice(-1);
        if (s === 'H' || s === 'S') {
            return `1${s}: 5+ ${suitName(s)}, about 12+ HCP or Rule of 20`;
        } else {
            // Better minor style
            if (s === 'C') {
                return '1C: Best minor (often 3+), about 12+ HCP or Rule of 20';
            }
            return '1D: Better minor, about 12+ HCP or Rule of 20';
        }
        }
    }

    // 1NT opening
    if (bidToken === '1NT' && auction.length === 0) {
        return '1NT opening: 15–17 HCP, balanced';
    }

    // Strong 2C opening
    if (bidToken === '2C' && auction.length === 0) {
        // Enable Strong 2C by default if convention system fails to load
        const strongTwoClubsEnabled = (system.conventions && system.conventions.isEnabled('strong_2_clubs', 'opening_bids')) || true;
        if (strongTwoClubsEnabled) {
            return 'Strong 2 Clubs (22+ HCP, artificial and game forcing)';
        }
    }

    // Simple, high-signal competitive explanations to avoid generic "Your bid"
    try {
        // Direct overcall (second call of the auction over a 1-level suit opening — no intervening passes by that side)
        if (auction.length === 1 && /^[1][CDHS]$/.test(tokens[0])) {
            if (isSuit) {
                const s = bidToken.slice(-1);
                return `Overcall: natural 5+ ${suitName(s)}`;
            }
            if (bidToken === '1NT') {
                return '1NT overcall: 15–18 HCP, balanced with a stopper';
            }
        }
        // Responder new suit after opponent overcalls (third call when tokens[1] is a suit)
        if (auction.length === 2 && /^[1][CDHS]$/.test(tokens[0]) && /^[12][CDHS]$/.test(tokens[1]) && isSuit) {
            const openerSuit = tokens[0].slice(-1);
            const ourSuit = bidToken.slice(-1);
            if (ourSuit !== openerSuit) {
                return `Natural new suit (${suitName(ourSuit)})`;
            }
        }
        // New suit response at 1-level over partner's 1m (no interference): natural with 6+ points
        if (isSuit && bidToken[0] === '1' && (tokens[0] === '1C' || tokens[0] === '1D')) {
            const between = tokens.slice(1, tokens.length - 1);
            const noOppInterference = between.every(t => t === 'PASS');
            const ourSuit = bidToken.slice(-1);
            const openerSuit = tokens[0].slice(-1);
            if (noOppInterference && ourSuit !== openerSuit) {
                if (ourSuit === 'H' || ourSuit === 'S') {
                    return `New major response: natural 4+ ${suitName(ourSuit)}, 6+ HCP`;
                }
                return `New suit response: natural ${suitName(ourSuit)}, 6+ HCP`;
            }
        }
        // Opener 1NT rebid after responder's suit (fifth call: after 1m/1M - (overcall) - new suit - Pass)
        if (bidToken === '1NT' && auction.length >= 3 && /^[1][CDHS]$/.test(tokens[0])) {
            const partnerNewSuit = tokens[2] && /^[1-2][CDHS]$/.test(tokens[2]);
            if (partnerNewSuit) {
                return '1NT rebid: balanced hand (shows stopper)';
            }
        }
        // Opener 2NT rebid after responder's suit (strong rebid: 18–19 HCP, balanced)
        if (bidToken === '2NT' && auction.length >= 3 && /^[1][CDHS]$/.test(tokens[0])) {
            const partnerNewSuit = tokens[2] && /^[1-2][CDHS]$/.test(tokens[2]);
            if (partnerNewSuit) {
                return '2NT rebid: 18–19 HCP, balanced';
            }
        }
    } catch (_) { /* best-effort competitive mapping */ }

    // Weak Two openings (2D/2H/2S) — simple UI explanation for user's own opening
    if (auction.length === 0 && ['2D','2H','2S'].includes(bidToken)) {
        return 'Weak Two opening (6+ card suit, about 6-10 HCP; stricter when vulnerable)';
    }
    
    // Strong 2C responses only apply to partner (North-South or East-West partnerships)
    const strongTwoClubsEnabled = (system.conventions && system.conventions.isEnabled('strong_2_clubs', 'opening_bids')) || true;
    
    if (auction.length === 1 && auction[0].token === '2C' && strongTwoClubsEnabled) {
        
        // Check if this is partner responding (not opponent overcalling)
        // If South opened 2C, only North can give Strong 2C responses
        // We need to determine the position relationship
        const bidderIsPartner = isPartnerResponse(auction.length);
        
        if (bidderIsPartner) {
            // 2D response to Strong 2C
            if (bidToken === '2D') {
                return 'Waiting response to Strong 2C (negative or no clear positive)';
            }
            
            // Other responses to Strong 2C
            if (['2H', '2S'].includes(bidToken)) {
                return 'Positive response to Strong 2C (8+ HCP, 5+ card suit)';
            }
            if (bidToken === '2NT') {
                return 'Positive response to Strong 2C (8-10 HCP, balanced)';
            }
            if (['3C', '3D', '3H', '3S'].includes(bidToken)) {
                return 'Positive response to Strong 2C (8+ HCP, 5+ card suit)';
            }
            if (bidToken === '3NT') {
                return 'Positive response to Strong 2C (11-13 HCP, balanced)';
            }
        } else {
            // This is an opponent overcalling, not a partner responding
            if (['1C', '1D', '1H', '1S', '1NT', '2C', '2D', '2H', '2S', '2NT', '3C', '3D', '3H', '3S'].includes(bidToken)) {
                return 'Overcall (natural)';
            }
        }
    }
    
    // NT conventions: Stayman, Jacoby, Texas
    try {
        // tokens already computed above
        const lastByUs = (window.system?.currentAuction?.lastSide && window.system.currentAuction.lastSide()) === 'we';
        const lastContract = tokens.slice().reverse().find(t => /(NT|[CDHS])$/.test(t));

        // Stayman: 2C after partner's 1NT
        if (bidToken === '2C') {
            const has1NT = tokens.includes('1NT');
            if (has1NT) {
                return 'Stayman: asking for a 4-card major';
            }
        }

        // Jacoby transfers over 1NT: 2D->H, 2H->S; over 2NT: 3D->H, 3H->S
        if (['2D','2H','3D','3H'].includes(bidToken)) {
            if (tokens.includes('1NT') && (bidToken === '2D' || bidToken === '2H')) {
                const to = bidToken === '2D' ? 'hearts' : 'spades';
                return `Jacoby transfer to ${to}`;
            }
            if (tokens.includes('2NT') && (bidToken === '3D' || bidToken === '3H')) {
                const to = bidToken === '3D' ? 'hearts' : 'spades';
                return `Jacoby transfer to ${to}`;
            }
        }

        // Texas transfers: 4D->4H, 4H->4S over 1NT/2NT
        if (bidToken === '4D' || bidToken === '4H') {
            if (tokens.includes('1NT') || tokens.includes('2NT')) {
                const to = bidToken === '4D' ? 'hearts' : 'spades';
                return `Texas transfer to ${to}`;
            }
        }
    } catch (e) { /* ignore */ }

    // Natural responder 1NT over partner's 1M (no interference): balanced 6–11 HCP, no 4-card support
    try {
        const openedOneLevelMajor = tokens[0] === '1H' || tokens[0] === '1S';
        if (openedOneLevelMajor && bidToken === '1NT') {
            const between = tokens.slice(1, tokens.length - 1);
            const noOppInterference = between.every(t => t === 'PASS');
            if (noOppInterference) {
                const m = tokens[0].slice(-1);
                return `1NT response: balanced 6–11 HCP, no 4-card ${suitName(m)} support`;
            }
        }
    } catch (e) { /* ignore */ }

    // Weak Two responder and continuations (UI-only heuristics)
    try {
        // Feature ask after a Weak Two opening
        if (auction.length >= 1 && ['2D','2H','2S'].includes(tokens[0])) {
            const openerSuit = tokens[0].slice(-1); // C/D/H/S
            // 2NT by partner: feature ask
            if (auction.length === 1 && bidToken === '2NT') {
                return 'Feature ask over Weak Two (asks opener to show A/K in a side suit)';
            }
            // Natural 3NT over Weak Two Major
            if (auction.length === 1 && bidToken === '3NT' && (openerSuit === 'H' || openerSuit === 'S')) {
                return 'Natural 3NT over Weak Two Major';
            }
            // Simple raise to the 3-level
            if (auction.length === 1 && bidToken.length === 2 && bidToken.startsWith('3') && bidToken.slice(-1) === openerSuit) {
                return 'Raise over Weak Two';
            }
            // Raise to game over Weak Two (4M over 2M; 5D over 2D)
            if (auction.length === 1) {
                if ((tokens[0] === '2H' && bidToken === '4H') || (tokens[0] === '2S' && bidToken === '4S') || (tokens[0] === '2D' && bidToken === '5D')) {
                    return 'Raise to game over Weak Two';
                }
            }
            // New suit forcing at the 3-level (3 of a new suit)
            if (auction.length === 1 && /^3[CDHS]$/.test(bidToken) && bidToken.slice(-1) !== openerSuit) {
                return 'New suit forcing over Weak Two';
            }
            // Opener responses to feature ask: 2M - 2NT - 3X
            if (auction.length === 2 && tokens[1] === '2NT' && /^3[CDHS]$/.test(bidToken)) {
                const respSuit = bidToken.slice(-1);
                if (respSuit === openerSuit) {
                    return `No feature over 2NT ask (rebid ${suitName(respSuit)} at 3-level)`;
                }
                return `Feature shown over 2NT ask: ${suitName(respSuit)}`;
            }
        }
    } catch (e) { /* ignore Weak Two UI heuristics */ }

    // Natural raise to game after partner's invitational/limit raise (not a cue-bid)
    try {
        if (tokens.length >= 3) {
            const opener = tokens[0];
            const resp3 = tokens[2];
            const isSuitOpening = /^1[CDHS]$/.test(opener);
            const sameSuitAt3 = /^3[CDHS]$/.test(resp3) && opener.slice(-1) === resp3.slice(-1);
            if (isSuitOpening && sameSuitAt3) {
                const s = opener.slice(-1);
                // Game raise in majors: 4H/4S; in minors: 5C/5D
                if ((s === 'H' || s === 'S') && bidToken === `4${s}`) {
                    return `Raise to game in ${suitName(s)}`;
                }
                if ((s === 'C' || s === 'D') && bidToken === `5${s}`) {
                    return `Raise to game in ${suitName(s)}`;
                }
            }
        }
    } catch (e) { /* ignore */ }

    // Natural minor raises over 1m (no interference)
    try {
        if (tokens.length >= 1 && (tokens[0] === '1C' || tokens[0] === '1D')) {
            const openerSuit = tokens[0].slice(-1);
            const between = tokens.slice(1, tokens.length - 1);
            const noOppInterference = between.every(t => t === 'PASS');
            if (noOppInterference && (bidToken === `2${openerSuit}` || bidToken === `3${openerSuit}`)) {
                if (bidToken[0] === '2') {
                    return `Simple raise of ${suitName(openerSuit)} (6–9 total points, 4+ trumps)`;
                }
                if (bidToken[0] === '3') {
                    return `Invitational raise of ${suitName(openerSuit)} (10–12 total points, 4+ trumps)`;
                }
            }
        }
    } catch (e) { /* ignore */ }

    // Natural responder NT over 1m (balanced, no 4-card major, no interference)
    try {
        if (tokens.length >= 1 && (tokens[0] === '1C' || tokens[0] === '1D')) {
            const between = tokens.slice(1, tokens.length - 1);
            const noOppInterference = between.every(t => t === 'PASS');
            if (noOppInterference && (bidToken === '1NT' || bidToken === '2NT' || bidToken === '3NT')) {
                const rng = (system?.conventions?.config?.general?.nt_over_minors_range) || 'classic';
                const floor = rng === 'wide' ? 6 : 10;
                if (bidToken === '1NT') return `1NT response over a minor: balanced ${floor}–11 HCP, no 4-card major`;
                if (bidToken === '2NT') return '2NT response over a minor: balanced 12–14 HCP, no 4-card major';
                if (bidToken === '3NT') return '3NT response over a minor: balanced 15+ HCP, no 4-card major';
            }
        }
    } catch (e) { /* ignore */ }

    // Cue-bid raise (limit+ raise of partner's suit) — UI-only heuristic for user's bid
    try {
        if (auction.length >= 2) {
            const opener = tokens[0];
            const partnerOvercall = tokens[1];
            const isSuitOpening = /^[1-3][CDHS]$/.test(opener);
            const isPartnerSuitOvercall = /[CDHS]$/.test(partnerOvercall) && !/NT$/.test(partnerOvercall);
            if (isSuitOpening && isPartnerSuitOvercall) {
                const oppSuit = opener.slice(-1);
                const partnerSuit = partnerOvercall.slice(-1);
                if (oppSuit !== partnerSuit && /^[2-5][CDHS]$/.test(bidToken) && bidToken.slice(-1) === oppSuit) {
                    return "Cue Bid Raise (limit+ raise of partner's suit)";
                }
            }
        }
    } catch (e) { /* ignore cue-bid UI */ }

    // Reopening Double (balancing) — UI mapping for user's bid
    try {
        if (bidToken === 'X' && tokens.length >= 3) {
            const last3 = tokens.slice(-3);
            const openingLike = /^[1-3][CDHS]$/.test(last3[0]);
            if (openingLike && last3[1] === 'PASS' && last3[2] === 'PASS') {
                return 'Reopening Double (balancing position)';
            }
        }
    } catch (e) { /* ignore reopening double UI */ }

    // Gerber ask (4C) over NT
    try {
        // tokens already computed above
        const lastContract = [...tokens].reverse().find(t => /NT$/.test(t));
        if (bidToken === '4C' && lastContract) {
            return 'Gerber: asking for aces';
        }
        // Gerber continuation king ask (5C) after a Gerber response
        if (bidToken === '5C') {
            const recent = tokens.slice(-3);
            const validGerberResponses = ['4D','4H','4S','4NT'];
            if (recent.includes('4C') && validGerberResponses.some(r => recent.includes(r))) {
                return 'Gerber continuation: asking for kings';
            }
        }

        // Blackwood/RKCB ask (4NT) over a suit contract (not over NT)
        if (bidToken === '4NT') {
            const lastSuitContract = [...tokens].reverse().find(t => /[CDHS]$/.test(t));
            const lastNtContract = [...tokens].reverse().find(t => /NT$/.test(t));
            if (lastSuitContract && (!lastNtContract || tokens.lastIndexOf(lastSuitContract) > tokens.lastIndexOf(lastNtContract))) {
                const variant = (system?.conventions?.getConventionSetting('blackwood', 'variant', 'ace_asking')) || 'rkcb';
                const rkcb = variant === 'rkcb';
                const resp = (system?.conventions?.getConventionSetting('blackwood', 'responses', 'ace_asking')) || '1430';
                if (rkcb) {
                    return `RKCB ${resp}: asking for keycards`;
                }
                return 'Blackwood: asking for aces';
            }
        }
    } catch (e) {
        // Fall through to default
    }

    return 'Your bid';
}

function makeBid(bidString) {
    try {
        if (currentTurn !== 'S') return;
        
        const bid = new window.Bid(bidString);
        
        // Check if this bid uses a convention
        let explanation = 'Your bid';
        if (bid.conventionUsed) {
            explanation = bid.conventionUsed;
        } else {
            // Check for known conventions based on the bid and auction context
            explanation = getConventionExplanation(bid, currentAuction);
        }
        
        auctionHistory.push({
            position: 'S',
            bid: bid,
            explanation: explanation
        });
        
        currentAuction.push(bid);
        addBidExplanation('S', bid, explanation);
        
        // Move to next turn
        advanceTurn();
        updateAuctionTable();
        updateAuctionStatus();
        
        // Check if auction is over
        console.log('Human bid - checking if auction is complete...');
        console.log('Current auction length:', currentAuction.length);
        console.log('Last 3 bids:', currentAuction.slice(-3).map(bid => bid.token || 'PASS'));
        
        if (isAuctionComplete()) {
            console.log('Auction is complete after human bid, ending...');
            endAuction();
        } else {
            console.log('Auction continues after human bid...');
            processTurn();
        }
        
    } catch (error) {
        console.error('Error making bid:', error);
        alert('Error making bid: ' + error.message);
    }
}

function isHigherBid(newBid, lastBid) {
    if (!lastBid) return true;
    
    // Compare levels first
    if (newBid.level > lastBid.level) return true;
    if (newBid.level < lastBid.level) return false;
    
    // Same level - compare suits (C=0, D=1, H=2, S=3, NT=4)
    const suitOrder = { 'C': 0, 'D': 1, 'H': 2, 'S': 3, 'NT': 4 };
    return suitOrder[newBid.suit] > suitOrder[lastBid.suit];
}

function checkForcedResponse(hand, auction) {
    console.log('checkForcedResponse called');
    console.log('Auction length:', auction.length);
    console.log('First bid:', auction.length > 0 ? auction[0].token : 'none');
    console.log('System object:', !!system);
    console.log('System conventions:', !!system?.conventions);
    console.log('Strong 2C enabled:', system?.conventions?.isEnabled('strong_2_clubs', 'opening_bids'));
    
    // Strong 2C forcing response - only for PARTNER, not opponents
    const firstBidIs2C = auction.length >= 1 && auction[0].token === '2C';
    
    // North is partner to South opener (positions 1=South, 3=North)
    // Calculate current position in rotation
    const currentPosition = (auction.length % 4) + 1;
    const isPartnerToOpener = currentPosition === 3; // North's position
    
    console.log('First bid is 2C?', firstBidIs2C);
    console.log('Is partner responding?', isPartnerToOpener);
    console.log('Current turn would be position:', currentPosition);
    
    // Check if Strong 2C sequence is still forcing (not yet reached game level)
    const isGameLevel = (bid) => {
        if (!bid || !bid.token) return false;
        const token = bid.token;
        // Game level bids: 3NT, 4C, 4D, 4H, 4S, 5C, 5D, 6+ level, 7+ level
        return /^[4-7]/.test(token) || token === '3NT';
    };
    
    const hasReachedGame = auction.some(bid => isGameLevel(bid));
    
    // Always enable Strong 2C (fallback for convention loading issues)
    const strongTwoClubsEnabled = true; // Always enabled as fallback
    console.log('Strong 2C enabled (with fallback):', strongTwoClubsEnabled);
    console.log('Has reached game level?', hasReachedGame);
    
    if (firstBidIs2C && isPartnerToOpener && strongTwoClubsEnabled && !hasReachedGame) {
        console.log('Strong 2C sequence - FORCING response required (must continue to game)');
        
        // Must respond - cannot pass until game is reached
        console.log('Hand HCP:', hand.hcp);
        console.log('Hand distribution:', hand.lengths);
        console.log('Current auction:', auction.map(b => b.token));
        
        // Find the last non-pass bid to determine auction state
        let lastBid = null;
        for (let i = auction.length - 1; i >= 0; i--) {
            if (auction[i].token && auction[i].token !== 'PASS') {
                lastBid = auction[i];
                break;
            }
        }
        
        console.log('Last non-pass bid:', lastBid?.token);
        
        // Determine forced response based on auction sequence and hand strength
        let forcedBid;
        
        if (!lastBid || lastBid.token === '2C') {
            // First response to 2C opening
            if (hand.hcp >= 8) {
                // Positive response (8+ HCP)
                // Look for 5+ card major suits first
                if (hand.lengths.S >= 5) {
                    forcedBid = new window.Bid('2S');
                    forcedBid.conventionUsed = 'Positive response to Strong 2C (5+ spades, 8+ HCP)';
                } else if (hand.lengths.H >= 5) {
                    forcedBid = new window.Bid('2H');
                    forcedBid.conventionUsed = 'Positive response to Strong 2C (5+ hearts, 8+ HCP)';
                } else if (hand.lengths.D >= 5) {
                    forcedBid = new window.Bid('3D');
                    forcedBid.conventionUsed = 'Positive response to Strong 2C (5+ diamonds, 8+ HCP)';
                } else if (hand.lengths.C >= 5) {
                    forcedBid = new window.Bid('3C');
                    forcedBid.conventionUsed = 'Positive response to Strong 2C (5+ clubs, 8+ HCP)';
                } else {
                    // Balanced hand with 8+ HCP
                    forcedBid = new window.Bid('2NT');
                    forcedBid.conventionUsed = 'Positive balanced response to Strong 2C (8+ HCP, no 5-card suit)';
                }
            } else {
                // Negative/waiting response (0-7 HCP)
                forcedBid = new window.Bid('2D');
                forcedBid.conventionUsed = 'Negative waiting response to Strong 2C (0-7 HCP)';
            }
        } else if (lastBid.token === '2NT') {
            // Check if this is after Strong 2C sequence
            // Look for pattern: 2C ... 2D ... 2NT (with any passes in between)
            let found2C = false;
            let found2D = false;
            
            for (let bid of auction) {
                if (bid.token === '2C') found2C = true;
                else if (bid.token === '2D' && found2C) found2D = true;
            }
            
            if (found2C && found2D) {
                // After 2C-2D-2NT sequence, partner cannot pass!
                // This shows balanced 22-24 HCP and is forcing to game
                console.log('Detected 2C-2D-2NT sequence - forcing to game!');
                if (hand.hcp >= 10) {
                    // With 10+ HCP, try for slam (South has 22-24, North 10+ = 32+ combined)
                    forcedBid = new window.Bid('4NT');
                    forcedBid.conventionUsed = 'Quantitative 4NT after Strong 2C-2D-2NT (slam try with 10+ HCP)';
                } else {
                    // Weak hand (0-9 HCP), just bid game
                    forcedBid = new window.Bid('3NT');
                    forcedBid.conventionUsed = 'Forced to game after Strong 2C-2D-2NT sequence (0-9 HCP)';
                }
            }
        } else if (lastBid.token && lastBid.token !== '2C' && lastBid.token !== '2D') {
            // North has already made a positive response, and South has rebid
            // North must continue to support or explore further - cannot pass
            console.log('After positive response and opener rebid - must continue bidding');
            
            // Determine appropriate continuation based on South's rebid and North's hand
            if (lastBid.token === '3H' && hand.lengths.H >= 3) {
                // Support hearts with 3+ card support
                forcedBid = new window.Bid('4H');
                forcedBid.conventionUsed = 'Heart support after Strong 2C sequence (forcing to game)';
            } else if (lastBid.token === '3S' && hand.lengths.S >= 3) {
                // Support spades with 3+ card support  
                forcedBid = new window.Bid('4S');
                forcedBid.conventionUsed = 'Spade support after Strong 2C sequence (forcing to game)';
            } else if (hand.hcp >= 12) {
                // Strong hand - explore slam
                forcedBid = new window.Bid('4NT');
                forcedBid.conventionUsed = 'Slam try after Strong 2C sequence (12+ HCP)';
            } else {
                // Weaker hand - bid 3NT (game)
                forcedBid = new window.Bid('3NT');
                forcedBid.conventionUsed = 'Forced to game after Strong 2C sequence';
            }
        } else {
            // Find next available bid at appropriate level
            const nextBids = ['2H', '2S', '2NT', '3C', '3D', '3H', '3S', '3NT', '4C', '4D', '4H', '4S', '4NT'];
            for (const bidString of nextBids) {
                try {
                    const testBid = new window.Bid(bidString);
                    if (isHigherBid(testBid, lastBid)) {
                        forcedBid = testBid;
                        forcedBid.conventionUsed = `Forced response to Strong 2C sequence (${bidString})`;
                        break;
                    }
                } catch (e) {
                    continue;
                }
            }
        }
        
        console.log('Returning forced bid:', forcedBid?.token);
        return forcedBid;
    }
    
    return null; // No forced response needed
}

function makeSystemBid() {
    try {
        // Get system's bid for current position
        const hand = currentHands[currentTurn];
        const seatNumber = getSeatNumber(currentTurn);
        
        // Initialize system auction if not already done or if we need fresh state
        if (!system.currentAuction || system.currentAuction.bids.length !== currentAuction.length) {
            console.log(`Initializing system auction with dealer: ${dealer}, current turn: ${currentTurn}`);
            // Human is South; keep ourSeat fixed as 'S' for partnership-relative logic
            if (typeof system.startAuctionWithDealer !== 'function') {
                system.startAuctionWithDealer = function(ourSeat, dealerSeat, vulNS, vulEW) {
                    this.startAuction(ourSeat, /*we*/ vulNS, /*they*/ vulEW);
                    if (this.currentAuction && typeof this.currentAuction.reseat === 'function') {
                        this.currentAuction.reseat(dealerSeat);
                    } else if (this.currentAuction) {
                        this.currentAuction.dealer = dealerSeat;
                    }
                };
            }
            system.startAuctionWithDealer('S', dealer, vulnerability.ns, vulnerability.ew);
            
            // Add current auction to system and assign seats based on dealer rotation
            currentAuction.forEach(bid => {
                system.currentAuction.bids.push(bid);
                console.log(`Added bid to system: ${bid.token || 'PASS'}`);
            });
            // Ensure all pushed bids have correct seat assigned for turn-order logic
            if (typeof system.currentAuction.reseat === 'function') {
                system.currentAuction.reseat(dealer);
            }
        }
        
        // Check for forced responses (e.g., Strong 2C)
        console.log('Checking for forced responses...');
        console.log('Current auction:', currentAuction.map(bid => bid.token || 'PASS'));
        const forcedBid = checkForcedResponse(hand, currentAuction);
        console.log('Forced bid result:', forcedBid ? forcedBid.token : 'none');
        
    // Ensure the engine evaluates from the current actor's perspective
    try {
        if (system.currentAuction) {
            system.currentAuction.ourSeat = currentTurn;
        }
    } catch (e) { /* ignore */ }

    // Get bid recommendation
    let recommendedBid = forcedBid || system.getBid(hand);
    let explanation = recommendedBid.conventionUsed || getConventionExplanation(recommendedBid, currentAuction) || 'Standard bid';

        // Normalize obviously inconsistent explanations
        try {
            const tok = recommendedBid.token || 'PASS';
            // Always normalize PASS explanation
            if (tok === 'PASS') {
                explanation = 'Pass';
            }
            // If explanation claims a Strong 2C response but partner did not open 2C, replace with contextual mapping
            if (typeof explanation === 'string' && /Strong 2C/i.test(explanation)) {
                const firstNonPass = (currentAuction || []).find(b => (b.token || 'PASS') !== 'PASS');
                // Determine partner seat relative to current turn
                const partnerSeat = (currentTurn === 'S') ? 'N' : (currentTurn === 'N') ? 'S' : (currentTurn === 'E') ? 'W' : 'E';
                let firstByPartnerIs2C = false;
                if (auctionHistory && auctionHistory.length > 0) {
                    for (const e of auctionHistory) {
                        const t = e?.bid?.token || 'PASS';
                        if (t !== 'PASS') {
                            firstByPartnerIs2C = (e.position === partnerSeat && t === '2C');
                            break;
                        }
                    }
                }
                if (!firstByPartnerIs2C) {
                    // Not a partner 2C opening sequence; recompute a neutral explanation
                    explanation = getConventionExplanation(recommendedBid, currentAuction) || 'Standard bid';
                }
            }
        } catch (_) { /* best-effort */ }

        // Safety filter: prevent weak/indirect or invalid-shape cue-bids of opener's suit (e.g., Michaels)
        // Context: Occasionally, in multi-bid auctions like 1m - Pass - 1H - (?), a 2m cue-bid can slip through
        // from engine fallbacks even with very weak hands. In mainstream styles, a cue-bid of opener's suit here
        // should be either a conventional two-suited overcall (Michaels) made in direct seat, or a strong raise
        // by opener's side after interference (which we never are when partner passed). Guard it at UI level to
        // avoid surprising bids during practice when HCP is clearly insufficient.
        if (!forcedBid && recommendedBid && recommendedBid.token && /^[2-7][CDHS]$/.test(recommendedBid.token)) {
            try {
                // Identify original opening suit (first contract in the auction history)
                const openingEntry = (auctionHistory || []).find(e => e && e.bid && e.bid.token && /^[1-7](C|D|H|S|NT)$/.test(e.bid.token));
                const openingToken = openingEntry?.bid?.token;
                const openingSuit = openingToken && openingToken.length >= 2 && openingToken !== '1NT' ? openingToken[1] : null;

                // Determine if there was any intervening non-pass action after the opening (i.e., not direct seat)
                let nonPassAfterOpening = false;
                if (openingToken) {
                    let seenOpening = false;
                    for (const e of (auctionHistory || [])) {
                        const tok = e?.bid?.token || (e?.bid?.isDouble ? 'X' : e?.bid?.isRedouble ? 'XX' : 'PASS');
                        if (!seenOpening) {
                            if (tok === openingToken) seenOpening = true;
                            continue;
                        }
                        if (seenOpening && tok && tok !== 'PASS') { nonPassAfterOpening = true; break; }
                    }
                }

                // Is this a cue-bid of the opener's suit at the 2-level?
                const isCueOfOpeningSuit = (openingSuit && recommendedBid.token === `2${openingSuit}`);

                // Config: honor Michaels settings; if direct_only is true, disallow indirect seat cue-bids as two-suited overcalls.
                const michaelsCfg = system?.conventions?.config?.competitive?.michaels || {};
                const directOnly = (michaelsCfg.direct_only !== undefined) ? !!michaelsCfg.direct_only : true;

                // HCP threshold for any indirect cue-bid: require at least 8 HCP to proceed.
                const tooWeak = (hand.hcp || 0) < 8;

                // Shape check for Michaels validity when cueing opener's suit
                let invalidMichaelsShape = false;
                if (isCueOfOpeningSuit && hand && hand.lengths) {
                    const len = hand.lengths;
                    const majors55 = (len.H >= 5 && len.S >= 5);
                    const spadesPlusMinor55 = (len.S >= 5 && (len.C >= 5 || len.D >= 5));
                    const heartsPlusMinor55 = (len.H >= 5 && (len.C >= 5 || len.D >= 5));
                    if ((openingSuit === 'C' || openingSuit === 'D') && !majors55) invalidMichaelsShape = true;
                    if (openingSuit === 'H' && !spadesPlusMinor55) invalidMichaelsShape = true;
                    if (openingSuit === 'S' && !heartsPlusMinor55) invalidMichaelsShape = true;
                }

                if (isCueOfOpeningSuit && (nonPassAfterOpening && (directOnly || tooWeak) || invalidMichaelsShape)) {
                    // Downgrade to Pass instead of making a speculative/invalid cue-bid
                    console.warn(`Blocking indirect/weak cue-bid ${recommendedBid.token} with ${hand.hcp} HCP; using PASS instead.`);
                    recommendedBid = new window.Bid('PASS');
                    explanation = 'Pass';
                }
            } catch (_) { /* non-fatal */ }
        }
        console.log('Final recommended bid:', recommendedBid.token || 'PASS');
        
        console.log(`${currentTurn} making bid:`);
        console.log(`  Hand: ${hand.toString()}`);
        console.log(`  HCP: ${hand.hcp}`);
        console.log(`  Current auction length: ${currentAuction.length}`);
        console.log(`  Recommended bid: ${recommendedBid.token || 'PASS'}`);
        console.log(`  Explanation: ${explanation}`);
        
        // Validate the recommended bid - if invalid, pass instead (unless it's a forced bid)
        const bidToken = recommendedBid.token || 'PASS';
        if (forcedBid) {
            // Forced bids always valid (e.g., Strong 2C responses)
            console.log(`${currentTurn} making forced bid: ${bidToken}`);
        } else if (bidToken !== 'PASS' && !isValidSystemBid(bidToken, currentTurn)) {
            console.warn(`${currentTurn} recommended invalid bid ${bidToken}, passing instead`);
            recommendedBid = new window.Bid('PASS'); // Create proper PASS bid
            // Keep explanation simple per UX guidance
            explanation = 'Pass';
        } else if (bidToken === 'PASS' || recommendedBid.token === 'PASS') {
            explanation = 'Pass';
        }

        // Competitive cue-bid explanation: if bidding opponents' previously-bid suit
        if (!forcedBid && recommendedBid.token && recommendedBid.token !== 'PASS' && recommendedBid.token !== 'X' && recommendedBid.token !== 'XX') {
            try {
                const michaelsInfo = detectMichaelsCueBid(currentTurn, recommendedBid, auctionHistory, hand);
                if (michaelsInfo) {
                    explanation = michaelsInfo; // Detailed Michaels description
                } else {
                    const isCue = isCueBidOfOpponentsSuit(currentTurn, recommendedBid, auctionHistory);
                    if (isCue) {
                        explanation = 'Cue bid of opponents\' suit';
                    }
                }
            } catch (_) {}
        }

        // Responder upgrade: after opener's 2NT, push to game with adequate points
        try {
            if (!forcedBid && currentTurn === 'N' && shouldRaiseToGameAfterOpener2NT(hand, auctionHistory)) {
                const hasFiveSpades = (hand.lengths && hand.lengths.S >= 5);
                // If we previously bid 1S, prefer 4S; else 3NT
                const ourSideBidSpades = auctionHistory.some(e => e.position === 'N' && e.bid && e.bid.token === '1S');
                const target = (hasFiveSpades && ourSideBidSpades) ? '4S' : '3NT';
                recommendedBid = new window.Bid(target);
                explanation = 'Game after opener\'s 2NT';
            }
        } catch (e) { console.warn('Responder game check failed:', e?.message || e); }
        
        auctionHistory.push({
            position: currentTurn,
            bid: recommendedBid,
            explanation: explanation
        });
        
        currentAuction.push(recommendedBid);
        addBidExplanation(currentTurn, recommendedBid, explanation);
        
        // Move to next turn
        advanceTurn();
        updateAuctionTable();
        updateAuctionStatus();
        
        // Check if auction is over
        console.log('Checking if auction is complete...');
        console.log('Current auction length:', currentAuction.length);
        console.log('Last 3 bids:', currentAuction.slice(-3).map(bid => bid.token || 'PASS'));
        
        if (isAuctionComplete()) {
            console.log('Auction is complete, ending...');
            endAuction();
        } else {
            console.log('Auction continues...');
            processTurn();
        }
        
    } catch (error) {
        console.error('Error making system bid:', error);
        // Make a pass bid as fallback
        const passBid = new window.Bid('PASS');
        auctionHistory.push({
            position: currentTurn,
            bid: passBid,
            explanation: 'System pass (error)'
        });
        currentAuction.push(passBid);
        addBidExplanation(currentTurn, passBid, 'System pass');
        advanceTurn();
        updateAuctionTable();
        processTurn();
    }
}

// Determine if a bid is a cue bid of opponents' suit based on auction history
function isCueBidOfOpponentsSuit(position, bid, history) {
    if (!bid || !bid.token) return false;
    const token = bid.token;
    const suit = token.replace(/^[1-7]/, ''); // extract suit part like C,D,H,S,NT
    if (suit === 'NT' || suit === 'X' || suit === 'XX') return false;
    const opponents = (position === 'N' || position === 'S') ? ['E','W'] : ['N','S'];
    // Look for any prior non-pass bid by opponents in the same suit
    for (let i = 0; i < history.length; i++) {
        const entry = history[i];
        const t = entry?.bid?.token || 'PASS';
        if (opponents.includes(entry.position) && t !== 'PASS' && t !== 'X' && t !== 'XX') {
            const entrySuit = t.replace(/^[1-7]/, '');
            if (entrySuit === suit) return true;
        }
    }
    return false;
}

// Identify Michaels cue-bid and return a descriptive explanation when appropriate
function detectMichaelsCueBid(position, bid, history, hand) {
    try {
        if (!bid || !bid.token) return null;
        const token = bid.token;
        const suit = token.replace(/^[1-7]/, '');
        if (suit === 'NT' || suit === 'X' || suit === 'XX') return null;
        // Get config
        const cfg = system?.conventions?.config?.competitive?.michaels || {};
        if (cfg.enabled === false) return null;

        // Find opponents' opening bid (first non-pass in history by opponents)
        const ourSide = (position === 'N' || position === 'S') ? ['N','S'] : ['E','W'];
        const oppSide = (position === 'N' || position === 'S') ? ['E','W'] : ['N','S'];
        const firstNonPass = history.find(e => {
            const t = e?.bid?.token || 'PASS';
            return oppSide.includes(e.position) && t !== 'PASS' && t !== 'X' && t !== 'XX';
        });
        if (!firstNonPass) return null;
        const openerTok = firstNonPass.bid.token;
        const openerSuit = openerTok.replace(/^[1-7]/, '');

        // Our bid must be a cue of opener's suit
        if (suit !== openerSuit) return null;

        // Check direct-only constraint: ensure our partnership has not taken any non-pass action and that
        // there are no other non-pass bids between opener and our current action except passes by others.
        if (cfg.direct_only) {
            let sawOpener = false;
            for (let i = 0; i < history.length; i++) {
                const e = history[i];
                const t = e?.bid?.token || 'PASS';
                if (!sawOpener) {
                    if (e === firstNonPass) {
                        sawOpener = true;
                    }
                    continue;
                }
                // Between opener and now: if our side made a non-pass, not direct
                if (ourSide.includes(e.position) && t !== 'PASS') return null;
                // If opponents made another non-pass (besides opener) before our cue, also not direct
                if (oppSide.includes(e.position) && t !== 'PASS' && e !== firstNonPass) return null;
            }
        }

        // If we have the hand, validate that shape matches Michaels requirements (5-5 patterns)
        if (hand && hand.lengths) {
            const len = hand.lengths;
            const hasMajors55 = (len.H >= 5 && len.S >= 5);
            const hasSpadesPlusMinor55 = (len.S >= 5 && (len.C >= 5 || len.D >= 5));
            const hasHeartsPlusMinor55 = (len.H >= 5 && (len.C >= 5 || len.D >= 5));
            if ((openerSuit === 'C' || openerSuit === 'D') && !hasMajors55) return null;
            if (openerSuit === 'H' && !hasSpadesPlusMinor55) return null;
            if (openerSuit === 'S' && !hasHeartsPlusMinor55) return null;
        }

        // Build explanation based on opener's suit
        if (openerSuit === 'C' || openerSuit === 'D') {
            const strength = cfg.strength === 'strong_only' ? 'strong only' : 'wide range';
            return `Michaels cue-bid: both majors (5-5), ${strength}`;
        }
        if (openerSuit === 'H') {
            const strength = cfg.strength === 'strong_only' ? 'strong only' : 'wide range';
            return `Michaels cue-bid: spades + a minor (5-5), ${strength}`;
        }
        if (openerSuit === 'S') {
            const strength = cfg.strength === 'strong_only' ? 'strong only' : 'wide range';
            return `Michaels cue-bid: hearts + a minor (5-5), ${strength}`;
        }
        return null;
    } catch (_) {
        return null;
    }
}

// Check if responder (North) should raise to game after opener's 2NT
function shouldRaiseToGameAfterOpener2NT(hand, history) {
    if (!hand) return false;
    // Find last two non-pass bids and who made the 2NT
    let lastByS = null;
    for (let i = history.length - 1; i >= 0; i--) {
        const e = history[i];
        const tok = e?.bid?.token || 'PASS';
        if (tok !== 'PASS' && tok !== 'X' && tok !== 'XX') {
            if (e.position === 'S') {
                lastByS = tok;
                break;
            }
        }
    }
    if (lastByS !== '2NT') return false;
    // Use a simple threshold to push to game
    return (hand.hcp || 0) >= 12;
}

function getRecommendedBid() {
    try {
        if (currentTurn !== 'S' || !currentHands.S) {
            alert('Not your turn or no hand available');
            return;
        }
        
        // Get system recommendation - use current system auction state
        if (!system.currentAuction || system.currentAuction.bids.length !== currentAuction.length) {
            if (typeof system.startAuctionWithDealer !== 'function') {
                system.startAuctionWithDealer = function(ourSeat, dealerSeat, vulNS, vulEW) {
                    this.startAuction(ourSeat, /*we*/ vulNS, /*they*/ vulEW);
                    if (this.currentAuction && typeof this.currentAuction.reseat === 'function') {
                        this.currentAuction.reseat(dealerSeat);
                    } else if (this.currentAuction) {
                        this.currentAuction.dealer = dealerSeat;
                    }
                };
            }
            system.startAuctionWithDealer('S', dealer, vulnerability.ns, vulnerability.ew);
            currentAuction.forEach(bid => {
                system.currentAuction.bids.push(bid);
            });
        } else {
            // Keep vulnerability in sync even when reusing the auction object
            try {
                system.currentAuction.weVulnerable = vulnerability.ns;
                system.currentAuction.theyVulnerable = vulnerability.ew;
            } catch (_) { /* noop */ }
        }
        // Always evaluate recommendation from South's perspective
        try { if (system.currentAuction) system.currentAuction.ourSeat = 'S'; } catch (_) {}
        
        const recommendedBid = system.getBid(currentHands.S);
        const explanation = recommendedBid.conventionUsed || 'Standard bid';
        
        // Handle null token (which means Pass)
        const bidDisplay = recommendedBid.token || 'PASS';
        
        // Display recommendation
        document.getElementById('recommendedBidDisplay').innerHTML = 
            `<span class="bid-level">${bidDisplay}</span>`;
        document.getElementById('recommendationReason').textContent = explanation;
        document.getElementById('recommendationResult').style.display = 'block';
        
    } catch (error) {
        console.error('Error getting recommendation:', error);
        alert('Error getting recommendation: ' + error.message);
    }
}

// Utility Functions
function createDeck() {
    const suits = ['S', 'H', 'D', 'C'];
    const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
    const deck = [];
    
    suits.forEach(suit => {
        ranks.forEach(rank => {
            deck.push(rank + suit);
        });
    });
    
    return deck;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function convertCardsToHandString(cards) {
    // Convert array of cards like ["AS", "KH", "QD", "JC"] to "AK QJ - -" format
    const suits = { S: [], H: [], D: [], C: [] };
    
    cards.forEach(card => {
        const rank = card.slice(0, -1);
        const suit = card.slice(-1);
        suits[suit].push(rank);
    });
    
    // Sort each suit by rank (A, K, Q, J, T, 9, 8, 7, 6, 5, 4, 3, 2)
    const rankOrder = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
    Object.keys(suits).forEach(suit => {
        suits[suit].sort((a, b) => rankOrder.indexOf(a) - rankOrder.indexOf(b));
    });
    
    // Create the hand string format: "Spades Hearts Diamonds Clubs"
    return [
        suits.S.join('') || '-',
        suits.H.join('') || '-', 
        suits.D.join('') || '-',
        suits.C.join('') || '-'
    ].join(' ');
}

function getSouthCards() {
    if (!currentHands.S) return [];
    const cards = [];
    ['S', 'H', 'D', 'C'].forEach(suit => {
        if (currentHands.S.suits[suit]) {
            currentHands.S.suits[suit].forEach(card => {
                cards.push(card);
            });
        }
    });
    return cards;
}

function calculateDistributionPoints(hand) {
    // Standard distribution points: 3-2-1 for voids, singletons, doubletons
    let points = 0;
    Object.values(hand.lengths).forEach(length => {
        if (length === 0) points += 3;      // void
        else if (length === 1) points += 2; // singleton  
        else if (length === 2) points += 1; // doubleton
    });
    return points;
}

function getSeatNumber(position) {
    const seats = { N: 0, E: 1, S: 2, W: 3 };
    return seats[position];
}

function advanceTurn() {
    const order = ['N', 'E', 'S', 'W'];
    const currentIndex = order.indexOf(currentTurn);
    currentTurn = order[(currentIndex + 1) % 4];
}

function isAuctionComplete() {
    console.log('isAuctionComplete called');
    console.log('Current auction:', currentAuction.map(bid => bid.token || 'PASS'));
    console.log('Auction length:', currentAuction.length);
    
    // Auction ends when 3 consecutive passes after a bid, or 4 passes from start
    if (currentAuction.length < 3) {
        console.log('Less than 3 bids, auction continues');
        return false;
    }
    
    // Check for 4 passes from the start (all pass auction)
    if (currentAuction.length >= 4) {
        const lastFour = currentAuction.slice(-4);
        const allPasses = lastFour.every(bid => (bid.token || 'PASS') === 'PASS');
        console.log('Last 4 bids:', lastFour.map(bid => bid.token || 'PASS'));
        console.log('All passes?', allPasses);
        if (allPasses) {
            console.log('Four consecutive passes - auction ends');
            return true;
        }
    }
    
    // Check for 3 consecutive passes after at least one bid
    if (currentAuction.length >= 3) {
        const lastThree = currentAuction.slice(-3);
        const threeConsecutivePasses = lastThree.every(bid => (bid.token || 'PASS') === 'PASS');
        console.log('Last 3 bids:', lastThree.map(bid => bid.token || 'PASS'));
        console.log('Three consecutive passes?', threeConsecutivePasses);
        
        if (threeConsecutivePasses) {
            // Make sure there was at least one non-pass bid in the auction
            const hasNonPassBid = currentAuction.some(bid => (bid.token || 'PASS') !== 'PASS');
            console.log('Has non-pass bid in auction?', hasNonPassBid);
            if (hasNonPassBid) {
                console.log('Three consecutive passes after a bid - auction ends');
                return true;
            }
        }
    }
    
    console.log('Auction continues');
    return false;
}

function endAuction() {
    auctionActive = false;
    // Re-enable Dealer/Vulnerability controls now that auction is over
    setDealerVulnerabilityDisabled(false);
    
    // Hide auction controls if they exist
    const auctionControls = document.getElementById('auctionControls');
    if (auctionControls) {
        auctionControls.style.display = 'none';
    }
    
    // Update auction status if it exists
    const auctionStatus = document.getElementById('auctionStatus');
    if (auctionStatus) {
        auctionStatus.textContent = 'Auction Ended';
        auctionStatus.className = 'alert alert-warning';
    }

    // Disable bid buttons now that auction is over
    try { setAllBidButtonsDisabled(true); } catch (_) {}

    // Show Start Auction button to allow restart (after optional dealer/vul changes)
    const startAuctionBtn = document.getElementById('startAuctionBtn');
    if (startAuctionBtn) {
        startAuctionBtn.style.display = 'inline-block';
    }
    
    // Add final auction result to the table
    try {
        const auctionGrid = document.querySelector('.auction-grid');
        if (auctionGrid) {
            const resultRow = document.createElement('div');
            resultRow.className = 'auction-result';
            resultRow.style.gridColumn = '1 / -1';
            resultRow.style.textAlign = 'center';
            resultRow.style.fontWeight = 'bold';
            resultRow.style.padding = '10px';
            resultRow.style.backgroundColor = '#f8f9fa';
            resultRow.style.border = '2px solid #28a745';
            resultRow.style.marginTop = '10px';
            resultRow.textContent = 'AUCTION ENDED';
            auctionGrid.appendChild(resultRow);
        }
    } catch (error) {
        console.log('Could not add auction ended message:', error.message);
    }
    
    console.log('Auction ended');
}

function updateAuctionHeaders() {
    const auctionGrid = document.querySelector('.auction-grid');
    if (!auctionGrid) return;
    
    // Get dealer-clockwise order
    const positions = ['W', 'N', 'E', 'S'];
    const dealerIndex = positions.indexOf(dealer);
    const orderedPositions = [];
    
    for (let i = 0; i < 4; i++) {
        orderedPositions.push(positions[(dealerIndex + i) % 4]);
    }
    
    // Update headers
    const headers = auctionGrid.querySelectorAll('.auction-position');
    orderedPositions.forEach((pos, index) => {
        if (headers[index]) {
            const posName = getTurnName(pos);
            if (index === 0) {
                headers[index].innerHTML = `${posName} (dealer)`;
            } else {
                headers[index].innerHTML = posName;
            }
        }
    });
}

function updateAuctionTable() {
    const auctionBids = document.getElementById('auctionBids');
    
    if (!auctionBids) {
        console.error('auctionBids element not found');
        return;
    }
    
    // Update headers to show dealer first
    updateAuctionHeaders();
    
    auctionBids.innerHTML = '';
    
    if (auctionHistory.length === 0) {
        auctionBids.innerHTML = '<div class="text-muted">Auction starting...</div>';
        return;
    }
    
    // Group bids by rounds
    const rounds = [];
    let currentRound = [];
    let expectedPosition = dealer;
    
    auctionHistory.forEach(entry => {
        if (entry.position === expectedPosition && currentRound.length === 0) {
            // Start of new round
            currentRound = [entry];
        } else {
            currentRound.push(entry);
        }
        
        if (currentRound.length === 4) {
            rounds.push(currentRound);
            currentRound = [];
        }
        
        // Advance expected position
        const order = ['W', 'N', 'E', 'S'];
        const index = order.indexOf(expectedPosition);
        expectedPosition = order[(index + 1) % 4];
    });
    
    if (currentRound.length > 0) {
        rounds.push(currentRound);
    }
    
    // Display rounds - use dealer-clockwise order
    const positions = ['W', 'N', 'E', 'S'];
    const dealerIndex = positions.indexOf(dealer);
    const orderedPositions = [];
    
    for (let i = 0; i < 4; i++) {
        orderedPositions.push(positions[(dealerIndex + i) % 4]);
    }
    
    rounds.forEach(round => {
        const roundDiv = document.createElement('div');
        roundDiv.className = 'auction-round';
        
        orderedPositions.forEach(pos => {
            const bidDiv = document.createElement('div');
            bidDiv.className = 'auction-bid';
            const entry = round.find(e => e.position === pos);
            if (entry) {
                const bidToken = entry.bid.token || 'PASS';
                let alertable = false;
                try {
                    alertable = isAlertableExplanation(entry.explanation) && !['PASS','X','XX'].includes(bidToken);
                } catch (_) { /* noop */ }
                // Base formatted bid (with suit color and alert marker)
                let html = formatBidForAuction(bidToken, alertable);
                // Small UI hint for 2NT: Natural vs Unusual (based on explanation text)
                try {
                    const expl = (entry.explanation || '').toLowerCase();
                    if (bidToken === '2NT' && expl) {
                        if (expl.includes('unusual nt')) {
                            html += ' <span class="bid-tag unusual" title="Unusual 2NT — minors, 5-5">U</span>';
                        } else if (expl.includes('natural 2nt overcall')) {
                            html += ' <span class="bid-tag natural" title="Natural 2NT — 19–21 balanced with stopper">N</span>';
                        }
                    }
                    // Tooltip with explanation (suppress tooltips for PASS bids)
                    if (entry.explanation && bidToken !== 'PASS') {
                        bidDiv.title = entry.explanation;
                    }
                } catch (_) { /* ignore tooltip/hint issues */ }
                bidDiv.innerHTML = html;
            } else {
                bidDiv.innerHTML = '-';
            }
            roundDiv.appendChild(bidDiv);
        });
        auctionBids.appendChild(roundDiv);
    });
}

function updateAuctionStatus() {
    const status = document.getElementById('auctionStatus');
    if (auctionActive) {
        const turnName = getTurnName(currentTurn);
        if (currentTurn === 'S') {
            // Inject a Hint button for South and a placeholder for hint text
            status.innerHTML = `${turnName} to bid <button id="hintBtn" class="main-btn compact secondary" style="margin-left:8px;">Hint</button> <span id="hintText" class="hint-text"></span>`;
            const hintBtn = document.getElementById('hintBtn');
            if (hintBtn) {
                hintBtn.addEventListener('click', () => {
                    try {
                        const hint = computeSouthHint();
                        const hintText = document.getElementById('hintText');
                        if (hintText) {
                            hintText.textContent = `${hint.bid} — ${hint.explanation}`;
                        }
                    } catch (e) {
                        console.warn('Hint generation failed:', e?.message || e);
                    }
                });
            }
        } else {
            status.textContent = `${turnName} to bid`;
        }
    }
}

// Compute hint for South using the same engine recommendation logic
function computeSouthHint() {
    if (!currentHands.S) return { bid: '-', explanation: 'No hand available' };
    // Align system auction state with current UI auction
    if (!system.currentAuction || system.currentAuction.bids.length !== currentAuction.length) {
        if (typeof system.startAuctionWithDealer !== 'function') {
            system.startAuctionWithDealer = function(ourSeat, dealerSeat, vulNS, vulEW) {
                this.startAuction(ourSeat, /*we*/ vulNS, /*they*/ vulEW);
                if (this.currentAuction && typeof this.currentAuction.reseat === 'function') {
                    this.currentAuction.reseat(dealerSeat);
                } else if (this.currentAuction) {
                    this.currentAuction.dealer = dealerSeat;
                }
            };
        }
        system.startAuctionWithDealer('S', dealer, vulnerability.ns, vulnerability.ew);
        currentAuction.forEach(b => system.currentAuction.bids.push(b));
        if (typeof system.currentAuction.reseat === 'function') {
            system.currentAuction.reseat(dealer);
        }
    } else {
        // Ensure vulnerability stays in sync even when we reuse the auction object
        try {
            system.currentAuction.weVulnerable = vulnerability.ns;
            system.currentAuction.theyVulnerable = vulnerability.ew;
        } catch (_) { /* noop */ }
    }
    // Always evaluate hint from South's perspective regardless of previous engine calls
    try {
        if (system.currentAuction) {
            system.currentAuction.ourSeat = 'S';
        }
    } catch (_) { /* noop */ }
    const rec = system.getBid(currentHands.S);
    const display = rec.token || 'PASS';
    let explanation = rec.conventionUsed || getConventionExplanation(rec, currentAuction) || 'Standard bid';

    // If PASS is recommended on the opening bid, add a helpful reason when a weak two was close
    try {
        const openingContext = (currentAuction.length === 0) || (currentAuction.length < 4 && currentAuction.every(b => (b.token || 'PASS') === 'PASS'));
        if (display === 'PASS' && openingContext) {
            const lenS = currentHands.S.lengths['S'] || 0;
            const lenH = currentHands.S.lengths['H'] || 0;
            const lenD = currentHands.S.lengths['D'] || 0;
            const hasSixMajor = (lenS >= 6 || lenH >= 6);
            if (hasSixMajor) {
                // Mirror engine thresholds
                const weVul = !!vulnerability.ns;
                const baseMin = 6, baseMax = 10;
                // Engine uses ConventionManager.adjustForVulnerability('weak_two', vuln)
                // Favorable: min-1, Unfavorable: min+4
                let minHcp = baseMin;
                let maxHcp = baseMax;
                if (weVul === true) {
                    minHcp += 4; // be disciplined when vulnerable
                } else if (weVul === false && vulnerability.ew === true) {
                    // equal/favorable logic: if only they are vul, treat as favorable (-1)
                    minHcp -= 1;
                }
                const ourHcp = currentHands.S.hcp || 0;
                // If we were blocked by the vulnerable threshold, explain that
                if (ourHcp < minHcp) {
                    const suitTxt = lenS >= 6 ? 'spades' : 'hearts';
                    explanation = `Pass (disciplined preempts when vulnerable): ${ourHcp} HCP with 6 ${suitTxt}; needs ${minHcp}+ HCP for a Weak Two while vulnerable`;
                }
            }
        }
    } catch (_) { /* best-effort */ }

    // Enhance/simplify hint explanation for readability
    try {
        const h = currentHands.S;
        const hcp = h?.hcp ?? 0;
        const len = h?.lengths || {};
        const suitOrder = ['S','H','D','C'];
        const suitNames = { S: 'spades', H: 'hearts', D: 'diamonds', C: 'clubs' };
        // Determine longest suit (prefer majors on ties)
        let longest = 'S';
        let longestLen = len['S'] || 0;
        for (const s of ['H','D','C']) {
            const l = len[s] || 0;
            if (l > longestLen || (l === longestLen && suitOrder.indexOf(s) < suitOrder.indexOf(longest))) {
                longest = s; longestLen = l;
            }
        }
        // Basic balanced check: no void/singleton and no 6+ card suit
        const lengths = ['S','H','D','C'].map(s => len[s] || 0);
        const hasVoidOrSingleton = lengths.some(x => x <= 1);
        const hasSixPlus = lengths.some(x => x >= 6);
        const isBalanced = !hasVoidOrSingleton && !hasSixPlus;

        const core = `With ${hcp} HCP` + (longestLen >= 5 ? ` and ${longestLen}-card ${suitNames[longest]}` : (isBalanced ? ' and a balanced hand' : ''));

        // If the original explanation is generic, replace with concise rationale; otherwise keep the specific one
        const generic = !explanation || explanation === 'Your bid' || explanation === 'Standard bid' || /^Pass$/i.test(explanation);
        if (generic) {
            // For PASS hints where we couldn’t infer a reason earlier, keep it succinct
            if (display === 'PASS') {
                explanation = `${core}.`;
            } else {
                explanation = `${core}.`;
            }
        }
    } catch (_) { /* best-effort enhancement */ }

    return { bid: display, explanation };
}

function getTurnName(position) {
    const names = { N: 'North', E: 'East', S: 'South (You)', W: 'West' };
    return names[position];
}

// Determine if a bid's explanation implies an alertable convention
function isAlertableExplanation(explanation) {
    if (!explanation || typeof explanation !== 'string') return false;
    const txt = explanation.toLowerCase();
    // Common alertable/conventional phrases
    const needles = [
        'stayman', 'transfer', 'texas', 'gerber', 'blackwood', 'rkcb',
        'splinter', 'drury', 'jacoby 2nt', 'minor suit transfer', 'mst',
        'support double', 'negative double', 'responsive double', 'reopening double',
        'michaels', 'unusual nt', 'cue bid', 'cue bid raise',
        'weak two', 'feature ask', 'ogust', 'quantitative', 'control showing cue bid',
        'strong 2 club', 'strong 2c', 'waiting response', 'positive response',
        'bergen'
    ];
    return needles.some(n => txt.includes(n));
}

// Render a suit symbol for the auction grid (neutral, no color)
function renderSuitSpan(suitLetter) {
    const map = { 'S': '♠', 'H': '♥', 'D': '♦', 'C': '♣' };
    const classMap = { 'S': 'suit-spades', 'H': 'suit-hearts', 'D': 'suit-diamonds', 'C': 'suit-clubs' };
    const symbol = map[suitLetter];
    if (!symbol) return '';
    // Apply suit-specific color classes so icons render in standard colors
    const cls = `card-suit ${classMap[suitLetter] || ''}`;
    return `<span class="${cls}">${symbol}</span>`;
}

// Format a bid token into HTML with suit symbols/colors and optional alert marker
function formatBidForAuction(token, alertable) {
    const t = token || 'PASS';
    if (t === 'PASS' || t === 'X' || t === 'XX') {
        return `<strong>${t}</strong>`;
    }
    // Handle NT bids as plain text (no suit color)
    if (t.endsWith('NT')) {
        return `<strong>${t}${alertable ? '!' : ''}</strong>`;
    }
    // Suit bids: level followed by suit letter
    const level = t.charAt(0);
    const denom = t.slice(1);
    if (['S','H','D','C'].includes(denom)) {
        return `<strong>${level}${renderSuitSpan(denom)}${alertable ? '!' : ''}</strong>`;
    }
    // Fallback: just show as text
    return `<strong>${t}${alertable ? '!' : ''}</strong>`;
}

function updateBidButtons() {
    // Enable/disable bid buttons based on auction state
    const lastBid = getLastNonPassBid();
    console.log('updateBidButtons called, lastBid:', lastBid);
    // If it's not user's turn, keep everything disabled
    if (currentTurn !== 'S') {
        try { setAllBidButtonsDisabled(true); } catch (_) {}
        return;
    }
    
    // Update all bid buttons - user should be able to make any legal bid
    document.querySelectorAll('.bid-button').forEach(btn => {
        const onclickAttr = btn.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes('makeBid')) {
            const bidText = onclickAttr.match(/makeBid\('(.+?)'\)/)[1];
            const isValid = isValidUserBid(bidText, lastBid);
            btn.disabled = !isValid;
            if (bidText === '2H' || bidText === '2S' || bidText === '2NT') {
                console.log(`Button ${bidText}: disabled=${!isValid}, lastBid:`, lastBid);
            }
        }
    });
    
    // Update special buttons
    const doubleBtn = document.getElementById('doubleBtn');
    const redoubleBtn = document.getElementById('redoubleBtn');
    
    if (doubleBtn) doubleBtn.disabled = !canDouble();
    if (redoubleBtn) redoubleBtn.disabled = !canRedouble();
}

function setAllBidButtonsDisabled(disabled) {
    document.querySelectorAll('.bid-button').forEach(btn => btn.disabled = !!disabled);
}

function getLastNonPassBid() {
    console.log('getLastNonPassBid called, currentAuction length:', currentAuction.length);
    for (let i = currentAuction.length - 1; i >= 0; i--) {
        const bid = currentAuction[i];
        console.log(`Checking bid ${i}:`, bid, 'token:', bid?.token);
        const bidToken = bid?.token || 'PASS';
        if (bidToken !== 'PASS' && bidToken !== 'X' && bidToken !== 'XX') {
            console.log('Found last non-pass bid:', bid);
            return bid;
        }
    }
    console.log('No non-pass bid found, returning null');
    return null;
}

function isValidBid(bidString, lastBid) {
    if (bidString === 'PASS') return true;
    
    // Use the passed lastBid parameter consistently
    if (!lastBid) {
        // No previous non-pass bids - any opening bid is valid
        return true;
    }
    
    // Compare bid levels for sufficient bids
    try {
        const newBid = new window.Bid(bidString);
        
        // Must be higher level or same level with higher suit
        const isHigherLevel = newBid.level > lastBid.level;
        const isSameLevelHigherSuit = (newBid.level === lastBid.level && 
                                      getSuitRank(newBid.suit) > getSuitRank(lastBid.suit));
        
        return isHigherLevel || isSameLevelHigherSuit;
    } catch (e) {
        return false;
    }
}

function isValidUserBid(bidString, lastBid) {
    // More permissive validation for user bids
    if (bidString === 'PASS') return true;
    
    // If no previous bid, any opening bid is valid
    if (!lastBid) {
        return true;
    }
    
    // User can make any bid that's higher than the last bid
    try {
        const newBid = new window.Bid(bidString);
        
        // Must be higher level or same level with higher suit
        const isHigherLevel = newBid.level > lastBid.level;
        const isSameLevelHigherSuit = (newBid.level === lastBid.level && 
                                      getSuitRank(newBid.suit) > getSuitRank(lastBid.suit));
        
        return isHigherLevel || isSameLevelHigherSuit;
    } catch (e) {
        return false;
    }
}

function getSuitRank(suit) {
    const ranks = { 'C': 1, 'D': 2, 'H': 3, 'S': 4, 'NT': 5 };
    return ranks[suit] || 0;
}

function getLastNonPassBidWithPosition() {
    // Returns the last non-pass bid along with the position who made it
    for (let i = currentAuction.length - 1; i >= 0; i--) {
        const bid = currentAuction[i];
        const entry = auctionHistory[i];
        const token = bid.token || 'PASS';
        if (token !== 'PASS') {
            return { bid: bid, position: entry.position };
        }
    }
    return null;
}

function isOpponentPosition(position, ourPosition) {
    // Check if the given position is an opponent of ourPosition
    const partnerships = {
        'N': ['N', 'S'], // North-South partnership
        'S': ['N', 'S'], 
        'E': ['E', 'W'], // East-West partnership  
        'W': ['E', 'W']
    };
    
    const ourPartnership = partnerships[ourPosition];
    return !ourPartnership.includes(position);
}

function isValidSystemBid(bidString, position) {
    // Validate a bid for the system (computer players)
    if (bidString === 'PASS' || bidString === null) return true;
    
    // Check basic bid validity
    const lastNonPassBid = getLastNonPassBid();
    if (!isValidBid(bidString, lastNonPassBid)) {
        return false;
    }
    
    // Check double/redouble rules for system
    if (bidString === 'X') {
        const lastNonPassBidWithPos = getLastNonPassBidWithPosition();
        if (!lastNonPassBidWithPos) return false;
        
        // Cannot double if already doubled
        if (lastNonPassBidWithPos.bid.token === 'X' || lastNonPassBidWithPos.bid.token === 'XX') return false;
        
        // Can only double opponent's bid
        return isOpponentPosition(lastNonPassBidWithPos.position, position);
    }
    
    if (bidString === 'XX') {
        // Can redouble if last action was opponent's double
        for (let i = currentAuction.length - 1; i >= 0; i--) {
            const entry = auctionHistory[i];
            if (entry.bid.token === 'X') {
                return isOpponentPosition(entry.position, position);
            } else if (entry.bid.token !== 'PASS') {
                return false;
            }
        }
        return false;
    }
    
    return true;
}

function canDouble() {
    // Can double if last non-pass bid was by opponents and not already doubled
    if (currentAuction.length === 0) return false;
    
    // Find the last non-pass bid and who made it
    const lastNonPassBid = getLastNonPassBidWithPosition();
    if (!lastNonPassBid) return false;
    
    // Cannot double if already doubled or redoubled
    if (lastNonPassBid.bid.token === 'X' || lastNonPassBid.bid.token === 'XX') return false;
    
    // Can only double opponent's bid, not partner's
    const isOpponent = isOpponentPosition(lastNonPassBid.position, 'S');
    
    return isOpponent;
}

function canRedouble() {
    // Can redouble if last action was a double by opponents
    if (currentAuction.length === 0) return false;
    
    // Look for the most recent double
    for (let i = currentAuction.length - 1; i >= 0; i--) {
        const entry = auctionHistory[i];
        if (entry.bid.token === 'X') {
            // Found a double - check if it was by opponent
            return isOpponentPosition(entry.position, 'S');
        } else if (entry.bid.token !== 'PASS') {
            // Found a non-pass, non-double bid - can't redouble
            return false;
        }
    }
    
    return false;
}

function addBidExplanation(position, bid, explanation) {
    const explanationsList = document.getElementById('explanationsList');
    
    if (!explanationsList) {
        console.error('explanationsList element not found');
        return;
    }
    
    const row = document.createElement('div');
    row.className = 'explanation-item';
    const bidDisplay = bid.token || 'PASS';
    // Determine side for styling: we (South), partner (North), opponents (East/West)
    const sideClass = (position === 'S') ? 'we' : (position === 'N' ? 'partner' : 'opponent');

    // Normalize explanation for direct 1-level suit overcalls to keep consistency
    try {
        const isOneLevelSuit = /^[1][CDHS]$/.test(bidDisplay);
        if (isOneLevelSuit) {
            // Inspect history prior to this bid
            const tokens = (auctionHistory || []).map(e => {
                const t = e?.bid?.token;
                if (t) return t;
                if (e?.bid?.isDouble) return 'X';
                if (e?.bid?.isRedouble) return 'XX';
                return 'PASS';
            });
            const currentIdx = tokens.length - 1; // this row's bid
            const prior = tokens.slice(0, currentIdx);
            // Count prior non-pass/non-double bids
            let nonPassCount = 0;
            let openerIdx = -1;
            for (let i = 0; i < prior.length; i++) {
                const t = prior[i];
                if (t !== 'PASS' && t !== 'X' && t !== 'XX') {
                    nonPassCount++;
                    if (openerIdx === -1) openerIdx = i;
                }
            }
            // Direct overcall context: exactly one prior non-pass bid and it was a 1-level suit opening
            if (nonPassCount === 1 && openerIdx >= 0 && /^1[CDHS]$/.test(prior[openerIdx])) {
                // Ensure this bid is by the opponents of the opener's side
                const openerPos = (auctionHistory && auctionHistory[openerIdx] && auctionHistory[openerIdx].position) || null;
                const openerSideNS = openerPos && (openerPos === 'N' || openerPos === 'S');
                const thisSideNS = (position === 'N' || position === 'S');
                const isOpponents = openerPos ? (openerSideNS !== thisSideNS) : true;
                if (isOpponents) {
                    const s = bidDisplay.slice(-1);
                    const suitNameMap = { C: 'clubs', D: 'diamonds', H: 'hearts', S: 'spades' };
                    const suitText = suitNameMap[s] || s;
                    explanation = `Overcall: natural 5+ ${suitText}`;
                }
            }
        }
    } catch (_) { /* best-effort normalization */ }
    
    // If explanation is generic and this is a jump to game in a major after partner previously bid that major, label it clearly
    try {
        const isGeneric = !explanation || explanation === 'Your bid' || explanation === 'Standard bid';
        if (isGeneric && /^4[HS]$/.test(bidDisplay)) {
            const suit = bidDisplay.slice(-1);
            const partnerSeat = (position === 'N') ? 'S' : (position === 'S' ? 'N' : (position === 'E' ? 'W' : 'E'));
            const priorSameSuitByPartner = (auctionHistory || []).some(e => {
                const tok = e?.bid?.token || 'PASS';
                if (e.position !== partnerSeat) return false;
                return new RegExp(`^[1-3]${suit}$`).test(tok);
            });
            if (priorSameSuitByPartner) {
                const nameMap = { H: 'hearts', S: 'spades' };
                explanation = `Raise to game in ${nameMap[suit]}`;
            }
        }
    } catch (_) { /* best-effort enhancement */ }
    // For PASS bids, suppress the trailing explanation text to reduce noise
    const explText = (bidDisplay === 'PASS') ? '' : (explanation || '');
    // Build: Who: <BID>. [Explanation]
    row.innerHTML = `
        <strong class="who">${getTurnName(position)}:</strong>
        <span class="bid-token ${sideClass}">${bidDisplay}.</span>
        ${explText ? `<span class="explanation-text text-muted">${explText}</span>` : ''}
    `;
    explanationsList.appendChild(row);
    
    // Keep a generous history so the panel matches the grid; allow up to 50 before trimming
    const MAX_EXPL = 50;
    while (explanationsList.children.length > MAX_EXPL) {
        explanationsList.removeChild(explanationsList.firstChild);
    }
}





// Convention Management Functions
async function initializeConventionUI() {
    try {
        // Get available conventions from the loaded config
        await loadAvailableConventions();
        // Apply any persisted enabled/disabled choices for Active Conventions
        try {
            const persisted = loadPersistedEnabledConventions();
            if (persisted && typeof persisted === 'object') {
                Object.keys(persisted).forEach(name => {
                    if (availableConventions[name]) {
                        // Keep general conventions always enabled regardless of persisted value
                        if (availableConventions[name].isGeneral) {
                            enabledConventions[name] = true;
                        } else {
                            enabledConventions[name] = !!persisted[name];
                        }
                    }
                });
            }
        } catch (e) {
            console.warn('Failed to apply persisted enabled conventions:', e);
        }
        // Build General Settings (engine-wide toggles)
        createGeneralSettingsSection();
        createConventionCheckboxes();
        createPracticeConventionOptions();
        
        console.log('Convention UI initialized successfully');
    } catch (error) {
        console.error('Error initializing convention UI:', error);
    }
}

// ---- General Settings: persistence helpers ----
const GENERAL_SETTINGS_STORAGE_KEY = 'bridge_general_settings_v1';
const ACTIVE_CONVENTIONS_STORAGE_KEY = 'bridge_enabled_conventions_v1';

function loadPersistedGeneralSettings() {
    try {
        if (typeof window === 'undefined' || !window.localStorage) return null;
        const raw = window.localStorage.getItem(GENERAL_SETTINGS_STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (e) {
        console.warn('loadPersistedGeneralSettings failed:', e);
        return null;
    }
}

function saveGeneralSettings() {
    try {
        if (!system?.conventions?.config) return;
        const cfg = system.conventions.config;
        const snapshot = {
            include_5422: !!(cfg?.general?.balanced_shapes?.include_5422),
            vulnerability_adjustments: !!(cfg?.general?.vulnerability_adjustments),
            rkcb_responses: (cfg?.ace_asking?.blackwood?.responses) || (cfg?.slam_bidding?.blackwood_rkcb?.responses) || '1430',
            support_doubles_thru: (cfg?.competitive?.support_doubles?.thru) || '2S',
            responsive_doubles_thru: Number(cfg?.competitive?.responsive_doubles?.thru_level) || 3,
            michaels_strength: (cfg?.competitive?.michaels?.strength) || 'wide_range',
            unusual_nt_over_minors: !!(cfg?.notrump_defenses?.unusual_nt?.over_minors),
            relaxed_takeout: !!(cfg?.general?.relaxed_takeout_doubles),
            systems_on_over_1nt_interference: {
                // Back-compat: omit 'stayman' from persistence; if present from old store, we'll still read/apply it
                transfers: !!(cfg?.general?.systems_on_over_1nt_interference?.transfers),
                stolen_bid_double: !!(cfg?.general?.systems_on_over_1nt_interference?.stolen_bid_double)
            },
            nt_over_minors_range: (cfg?.general?.nt_over_minors_range) || 'classic',
            // UI preferences not part of engine config
            show_all_hands_by_default: (function(){
                try {
                    const el = document.getElementById('toggle_show_all_hands');
                    if (el) return !!el.checked;
                    const persisted = loadPersistedGeneralSettings();
                    if (persisted && typeof persisted.show_all_hands_by_default === 'boolean') {
                        return persisted.show_all_hands_by_default;
                    }
                } catch(_) {}
                return true; // default
            })()
        };
        if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem(GENERAL_SETTINGS_STORAGE_KEY, JSON.stringify(snapshot));
        }
    } catch (e) {
        console.warn('saveGeneralSettings failed:', e);
    }
}

// ---- Active Conventions: persistence helpers ----
function loadPersistedEnabledConventions() {
    try {
        if (typeof window === 'undefined' || !window.localStorage) return null;
        const raw = window.localStorage.getItem(ACTIVE_CONVENTIONS_STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (e) {
        console.warn('loadPersistedEnabledConventions failed:', e);
        return null;
    }
}

function saveEnabledConventions() {
    try {
        if (typeof window === 'undefined' || !window.localStorage) return;
        // Persist only non-general conventions to keep storage minimal
        const snapshot = {};
        Object.keys(enabledConventions).forEach(name => {
            const meta = availableConventions[name];
            if (!meta || meta.isGeneral) return;
            snapshot[name] = !!enabledConventions[name];
        });
        window.localStorage.setItem(ACTIVE_CONVENTIONS_STORAGE_KEY, JSON.stringify(snapshot));
    } catch (e) {
        console.warn('saveEnabledConventions failed:', e);
    }
}

function applyGeneralSettingsToConfig(settings) {
    try {
        if (!system?.conventions?.config) return;
        const cfg = system.conventions.config;
        cfg.general = cfg.general || {};
        cfg.general.balanced_shapes = cfg.general.balanced_shapes || { include_5422: false };
        if (typeof settings.include_5422 === 'boolean') cfg.general.balanced_shapes.include_5422 = settings.include_5422;
        if (typeof settings.vulnerability_adjustments === 'boolean') cfg.general.vulnerability_adjustments = settings.vulnerability_adjustments;
        if (typeof settings.relaxed_takeout === 'boolean') cfg.general.relaxed_takeout_doubles = settings.relaxed_takeout;
        if (settings.nt_over_minors_range === 'classic' || settings.nt_over_minors_range === 'wide') {
            cfg.general.nt_over_minors_range = settings.nt_over_minors_range;
        }

        // RKCB responses
        const rkcb = settings.rkcb_responses;
        if (rkcb === '1430' || rkcb === '3014') {
            cfg.ace_asking = cfg.ace_asking || {};
            cfg.ace_asking.blackwood = cfg.ace_asking.blackwood || { enabled: true };
            cfg.ace_asking.blackwood.responses = rkcb;
            if (cfg.slam_bidding && cfg.slam_bidding.blackwood_rkcb) {
                cfg.slam_bidding.blackwood_rkcb.responses = rkcb;
            }
        }

        // Competitive settings
        cfg.competitive = cfg.competitive || {};
        cfg.competitive.support_doubles = cfg.competitive.support_doubles || { enabled: true };
        if (settings.support_doubles_thru) cfg.competitive.support_doubles.thru = settings.support_doubles_thru;
        cfg.competitive.responsive_doubles = cfg.competitive.responsive_doubles || { enabled: true };
        if (settings.responsive_doubles_thru) cfg.competitive.responsive_doubles.thru_level = Number(settings.responsive_doubles_thru);
        cfg.competitive.michaels = cfg.competitive.michaels || { enabled: true };
        if (settings.michaels_strength) cfg.competitive.michaels.strength = settings.michaels_strength;

        // Unusual NT over minors toggle
        cfg.notrump_defenses = cfg.notrump_defenses || {};
        cfg.notrump_defenses.unusual_nt = cfg.notrump_defenses.unusual_nt || { enabled: true, direct: true, passed_hand: false, over_minors: false };
        if (typeof settings.unusual_nt_over_minors === 'boolean') {
            cfg.notrump_defenses.unusual_nt.over_minors = settings.unusual_nt_over_minors;
        }

        // Systems-on over 1NT interference (general)
        cfg.general.systems_on_over_1nt_interference = cfg.general.systems_on_over_1nt_interference || {
            stayman: false,
            transfers: false,
            stolen_bid_double: false
        };
        if (settings.systems_on_over_1nt_interference && typeof settings.systems_on_over_1nt_interference === 'object') {
            const s = settings.systems_on_over_1nt_interference;
            if (typeof s.stayman === 'boolean') cfg.general.systems_on_over_1nt_interference.stayman = s.stayman;
            if (typeof s.transfers === 'boolean') cfg.general.systems_on_over_1nt_interference.transfers = s.transfers;
            if (typeof s.stolen_bid_double === 'boolean') cfg.general.systems_on_over_1nt_interference.stolen_bid_double = s.stolen_bid_double;
        }
    } catch (e) {
        console.warn('applyGeneralSettingsToConfig failed:', e);
    }
}

function createGeneralSettingsSection() {
    try {
        const container = document.getElementById('generalSettings');
        if (!container) return;

        const cfg = system?.conventions?.config || {};
        const include5422 = !!(cfg?.general?.balanced_shapes?.include_5422);
        const vulAdj = !!(cfg?.general?.vulnerability_adjustments);
        const relaxedTO = !!(cfg?.general?.relaxed_takeout_doubles);
        const persistedGS = loadPersistedGeneralSettings() || {};
        const showAllHandsDefault = (typeof persistedGS.show_all_hands_by_default === 'boolean') ? persistedGS.show_all_hands_by_default : true;
        // RKCB response structure (1430/3014) - ensure we read from ace_asking.blackwood if present, else slam_bidding.blackwood_rkcb
        const rkcbResp = (cfg?.ace_asking?.blackwood?.responses) || (cfg?.slam_bidding?.blackwood_rkcb?.responses) || '1430';
        const supportThru = (cfg?.competitive?.support_doubles?.thru) || '2S';
        const respDblThru = (cfg?.competitive?.responsive_doubles?.thru_level) || 3;
    const michaelsStrength = (cfg?.competitive?.michaels?.strength) || 'wide_range';
    const unusualOverMinors = !!(cfg?.notrump_defenses?.unusual_nt?.over_minors);
    const sysOn = (cfg?.general?.systems_on_over_1nt_interference) || { transfers:false, stolen_bid_double:false };
    const ntOverMinorsRange = (cfg?.general?.nt_over_minors_range) || 'classic';

        container.innerHTML = `
            <div class="general-settings-card">
                <div class="general-settings-header">General Settings</div>
                <div class="general-settings-row">
                    <label class="toggle">
                        <input type="checkbox" id="toggle_show_all_hands" ${showAllHandsDefault ? 'checked' : ''} />
                        <span>Show all hands by default</span>
                        <span class="general-help-inline">When generating a new deal, start with North/East/West visible.</span>
                    </label>
                </div>
                <div class="general-settings-row" style="margin-top:8px;">
                    <label class="toggle">
                        <input type="checkbox" id="toggle_include_5422" ${include5422 ? 'checked' : ''} />
                        <span>Treat 5-4-2-2 as balanced (semi-balanced)</span>
                        <span class="general-help-inline">Affects 1NT openings and some balanced-hand decisions.</span>
                    </label>
                </div>
                <div class="general-settings-row" style="margin-top:8px;">
                    <label class="toggle">
                        <input type="checkbox" id="toggle_vul_adjust" ${vulAdj ? 'checked' : ''} />
                        <span>Vulnerability adjustments</span>
                        <span class="general-help-inline">Tightens/loosens aggressive actions (e.g., weak twos) based on vulnerability.</span>
                    </label>
                </div>
                <div class="general-settings-row" style="margin-top:8px;">
                    <label class="toggle">
                        <input type="checkbox" id="toggle_relaxed_tko" ${relaxedTO ? 'checked' : ''} />
                        <span>Relaxed takeout doubles</span>
                        <span class="general-help-inline">Allows slightly lighter doubles (e.g., 11+ HCP with shape).</span>
                    </label>
                </div>
                <div class="general-settings-row" style="margin-top:8px;">
                    <label for="select_rkcb_resp" class="toggle" style="gap:6px;">
                        <span>RKCB response structure</span>
                        <select id="select_rkcb_resp">
                            <option value="1430" ${rkcbResp === '1430' ? 'selected' : ''}>1430</option>
                            <option value="3014" ${rkcbResp === '3014' ? 'selected' : ''}>3014</option>
                        </select>
                        <span class="general-help-inline">Determines step meanings for 4NT ace/keycard responses.</span>
                    </label>
                </div>
                <div class="general-settings-row" style="margin-top:8px;">
                    <label for="select_support_thru" class="toggle" style="gap:6px;">
                        <span>Support doubles thru</span>
                        <select id="select_support_thru">
                            <option value="2H" ${supportThru === '2H' ? 'selected' : ''}>2♥</option>
                            <option value="2S" ${supportThru === '2S' ? 'selected' : ''}>2♠</option>
                        </select>
                        <span class="general-help-inline">Highest competitive level where support doubles apply.</span>
                    </label>
                </div>
                <div class="general-settings-row" style="margin-top:8px;">
                    <label for="select_resp_dbl_thru" class="toggle" style="gap:6px;">
                        <span>Responsive doubles thru level</span>
                        <select id="select_resp_dbl_thru">
                            <option value="2" ${Number(respDblThru) === 2 ? 'selected' : ''}>Through 2-level</option>
                            <option value="3" ${Number(respDblThru) === 3 ? 'selected' : ''}>Through 3-level</option>
                        </select>
                        <span class="general-help-inline">Upper bound for using responsive doubles after partner's takeout double.</span>
                    </label>
                </div>
                <div class="general-settings-row" style="margin-top:8px;">
                    <label for="select_michaels_strength" class="toggle" style="gap:6px;">
                        <span>Michaels strength</span>
                        <select id="select_michaels_strength">
                            <option value="wide_range" ${michaelsStrength === 'wide_range' ? 'selected' : ''}>Wide range</option>
                            <option value="strong_only" ${michaelsStrength === 'strong_only' ? 'selected' : ''}>Strong only</option>
                        </select>
                        <span class="general-help-inline">Wide range allows lighter 6-9 HCP Michaels; strong only uses ~10+ HCP.</span>
                    </label>
                </div>
                <div class="general-settings-row" style="margin-top:8px;">
                    <label class="toggle">
                        <input type="checkbox" id="toggle_unusual_nt_over_minors" ${unusualOverMinors ? 'checked' : ''} />
                        <span>Unusual 2NT over minors</span>
                        <span class="general-help-inline">2NT over 1♣/1♦ shows the two lowest unbid suits (5-5). When off, 2NT over minors is natural 19–21 with a stopper.</span>
                    </label>
                </div>
                <div class="general-settings-row" style="margin-top:8px;">
                    <label for="select_nt_over_minors_range" class="toggle" style="gap:6px;">
                        <span>1NT over 1m (balanced, no 4-card major)</span>
                        <select id="select_nt_over_minors_range">
                            <option value="classic" ${ntOverMinorsRange === 'classic' ? 'selected' : ''}>Classic: 10–11 HCP</option>
                            <option value="wide" ${ntOverMinorsRange === 'wide' ? 'selected' : ''}>Wide: 6–11 HCP</option>
                        </select>
                        <span class="general-help-inline">Choose the invitational floor for 1NT responses over minor openings.</span>
                    </label>
                </div>
                <div class="general-settings-divider" style="margin:10px 0; border-top:1px solid #ddd;"></div>
                <div class="general-settings-header">Systems over 1NT interference</div>
                <div class="general-settings-row" style="margin-top:8px;">
                    <label class="toggle">
                        <input type="checkbox" id="toggle_sys_on_transfers" ${sysOn.transfers ? 'checked' : ''} />
                        <span>Keep transfers on over 2♣</span>
                        <span class="general-help-inline">2♦ transfers to ♥ and 2♥ transfers to ♠ after 1NT – (2♣).</span>
                    </label>
                </div>
                <div class="general-settings-row" style="margin-top:8px;">
                    <label class="toggle">
                        <input type="checkbox" id="toggle_sys_on_stolen" ${sysOn.stolen_bid_double ? 'checked' : ''} />
                        <span>Stolen-bid double over 2♣ (X = Stayman)</span>
                        <span class="general-help-inline">When enabled (and Stayman is part of your system), double over 2♣ shows Stayman with 8+ HCP and a 4-card major.</span>
                    </label>
                </div>
            </div>
        `;


        const chk = document.getElementById('toggle_include_5422');
        if (chk) {
            chk.addEventListener('change', (e) => {
                try {
                    if (!system?.conventions?.config?.general) return;
                    if (!system.conventions.config.general.balanced_shapes) {
                        system.conventions.config.general.balanced_shapes = { include_5422: false };
                    }
                    system.conventions.config.general.balanced_shapes.include_5422 = !!e.target.checked;
                    // Optional visual feedback
                    container.classList.add('flash-updated');
                    setTimeout(() => container.classList.remove('flash-updated'), 600);
                    console.log('Updated include_5422 to', e.target.checked);
                    saveGeneralSettings();
                } catch (err) {
                    console.warn('Failed to update include_5422:', err);
                }
            });
        }

        const vul = document.getElementById('toggle_vul_adjust');
        if (vul) {
            vul.addEventListener('change', (e) => {
                try {
                    if (!system?.conventions?.config?.general) return;
                    system.conventions.config.general.vulnerability_adjustments = !!e.target.checked;
                    container.classList.add('flash-updated');
                    setTimeout(() => container.classList.remove('flash-updated'), 600);
                    console.log('Updated vulnerability_adjustments to', e.target.checked);
                    saveGeneralSettings();
                } catch (err) {
                    console.warn('Failed to update vulnerability_adjustments:', err);
                }
            });
        }

        const relaxed = document.getElementById('toggle_relaxed_tko');
        if (relaxed) {
            relaxed.addEventListener('change', (e) => {
                try {
                    if (!system?.conventions?.config?.general) return;
                    system.conventions.config.general.relaxed_takeout_doubles = !!e.target.checked;
                    container.classList.add('flash-updated');
                    setTimeout(() => container.classList.remove('flash-updated'), 600);
                    console.log('Updated relaxed_takeout_doubles to', e.target.checked);
                    saveGeneralSettings();
                } catch (err) {
                    console.warn('Failed to update relaxed_takeout_doubles:', err);
                }
            });
        }

        const rkcbSel = document.getElementById('select_rkcb_resp');
        if (rkcbSel) {
            rkcbSel.addEventListener('change', (e) => {
                try {
                    const val = e.target.value === '3014' ? '3014' : '1430';
                    // Prefer ace_asking.blackwood if present, else create it
                    if (!system.conventions.config.ace_asking) system.conventions.config.ace_asking = {};
                    if (!system.conventions.config.ace_asking.blackwood) system.conventions.config.ace_asking.blackwood = { enabled: true };
                    system.conventions.config.ace_asking.blackwood.responses = val;
                    // Keep slam_bidding.blackwood_rkcb in sync if it exists
                    if (system.conventions.config.slam_bidding && system.conventions.config.slam_bidding.blackwood_rkcb) {
                        system.conventions.config.slam_bidding.blackwood_rkcb.responses = val;
                    }
                    container.classList.add('flash-updated');
                    setTimeout(() => container.classList.remove('flash-updated'), 600);
                    console.log('Updated RKCB responses to', val);
                    saveGeneralSettings();
                    // Refresh convention labels so RKCB name updates live in the UI
                    try { updateRKCBLabelAndRerender(); } catch (e2) { console.warn('RKCB label refresh failed:', e2); }
                } catch (err) {
                    console.warn('Failed to update RKCB responses:', err);
                }
            });
        }

        const supSel = document.getElementById('select_support_thru');
        if (supSel) {
            supSel.addEventListener('change', (e) => {
                try {
                    const val = e.target.value === '2H' ? '2H' : '2S';
                    if (!system.conventions.config.competitive) system.conventions.config.competitive = {};
                    if (!system.conventions.config.competitive.support_doubles) system.conventions.config.competitive.support_doubles = { enabled: true };
                    system.conventions.config.competitive.support_doubles.thru = val;
                    container.classList.add('flash-updated');
                    setTimeout(() => container.classList.remove('flash-updated'), 600);
                    console.log('Updated support_doubles.thru to', val);
                    saveGeneralSettings();
                } catch (err) {
                    console.warn('Failed to update support_doubles.thru:', err);
                }
            });
        }

        const respSel = document.getElementById('select_resp_dbl_thru');
        if (respSel) {
            respSel.addEventListener('change', (e) => {
                try {
                    const val = Number(e.target.value) === 2 ? 2 : 3;
                    if (!system.conventions.config.competitive) system.conventions.config.competitive = {};
                    if (!system.conventions.config.competitive.responsive_doubles) system.conventions.config.competitive.responsive_doubles = { enabled: true };
                    system.conventions.config.competitive.responsive_doubles.thru_level = val;
                    container.classList.add('flash-updated');
                    setTimeout(() => container.classList.remove('flash-updated'), 600);
                    console.log('Updated responsive_doubles.thru_level to', val);
                    saveGeneralSettings();
                } catch (err) {
                    console.warn('Failed to update responsive_doubles.thru_level:', err);
                }
            });
        }

        const micSel = document.getElementById('select_michaels_strength');
        if (micSel) {
            micSel.addEventListener('change', (e) => {
                try {
                    const val = e.target.value === 'strong_only' ? 'strong_only' : 'wide_range';
                    if (!system.conventions.config.competitive) system.conventions.config.competitive = {};
                    if (!system.conventions.config.competitive.michaels) system.conventions.config.competitive.michaels = { enabled: true };
                    system.conventions.config.competitive.michaels.strength = val;
                    container.classList.add('flash-updated');
                    setTimeout(() => container.classList.remove('flash-updated'), 600);
                    console.log('Updated michaels.strength to', val);
                    saveGeneralSettings();
                } catch (err) {
                    console.warn('Failed to update michaels.strength:', err);
                }
            });
        }

        const unnOverMin = document.getElementById('toggle_unusual_nt_over_minors');
        if (unnOverMin) {
            unnOverMin.addEventListener('change', (e) => {
                try {
                    if (!system?.conventions?.config) return;
                    const cfg = system.conventions.config;
                    cfg.notrump_defenses = cfg.notrump_defenses || {};
                    cfg.notrump_defenses.unusual_nt = cfg.notrump_defenses.unusual_nt || { enabled: true, direct: true, passed_hand: false, over_minors: false };
                    cfg.notrump_defenses.unusual_nt.over_minors = !!e.target.checked;
                    container.classList.add('flash-updated');
                    setTimeout(() => container.classList.remove('flash-updated'), 600);
                    console.log('Updated unusual_nt.over_minors to', e.target.checked);
                    saveGeneralSettings();
                } catch (err) {
                    console.warn('Failed to update unusual_nt.over_minors:', err);
                }
            });
        }

        const ntRangeSel = document.getElementById('select_nt_over_minors_range');
        if (ntRangeSel) {
            ntRangeSel.addEventListener('change', (e) => {
                try {
                    const val = (e.target.value === 'wide') ? 'wide' : 'classic';
                    if (!system?.conventions?.config?.general) return;
                    system.conventions.config.general.nt_over_minors_range = val;
                    container.classList.add('flash-updated');
                    setTimeout(() => container.classList.remove('flash-updated'), 600);
                    console.log('Updated general.nt_over_minors_range to', val);
                    saveGeneralSettings();
                } catch (err) {
                    console.warn('Failed to update nt_over_minors_range:', err);
                }
            });
        }

        const showAllChk = document.getElementById('toggle_show_all_hands');
        if (showAllChk) {
            showAllChk.addEventListener('change', () => {
                try {
                    // UI-only preference; just persist
                    container.classList.add('flash-updated');
                    setTimeout(() => container.classList.remove('flash-updated'), 600);
                    console.log('Updated show_all_hands_by_default to', showAllChk.checked);
                    saveGeneralSettings();
                } catch (err) {
                    console.warn('Failed to update show_all_hands_by_default:', err);
                }
            });
        }

        const sysTrans = document.getElementById('toggle_sys_on_transfers');
        if (sysTrans) {
            sysTrans.addEventListener('change', (e) => {
                try {
                    if (!system?.conventions?.config?.general) return;
                    const g = system.conventions.config.general;
                    g.systems_on_over_1nt_interference = g.systems_on_over_1nt_interference || { transfers:false, stolen_bid_double:false };
                    g.systems_on_over_1nt_interference.transfers = !!e.target.checked;
                    container.classList.add('flash-updated');
                    setTimeout(() => container.classList.remove('flash-updated'), 600);
                    console.log('Updated systems_on_over_1nt_interference.transfers to', e.target.checked);
                    saveGeneralSettings();
                } catch (err) {
                    console.warn('Failed to update systems_on_over_1nt_interference.transfers:', err);
                }
            });
        }

        const sysStolen = document.getElementById('toggle_sys_on_stolen');
        if (sysStolen) {
            sysStolen.addEventListener('change', (e) => {
                try {
                    if (!system?.conventions?.config?.general) return;
                    const g = system.conventions.config.general;
                    g.systems_on_over_1nt_interference = g.systems_on_over_1nt_interference || { transfers:false, stolen_bid_double:false };
                    g.systems_on_over_1nt_interference.stolen_bid_double = !!e.target.checked;
                    container.classList.add('flash-updated');
                    setTimeout(() => container.classList.remove('flash-updated'), 600);
                    console.log('Updated systems_on_over_1nt_interference.stolen_bid_double to', e.target.checked);
                    saveGeneralSettings();
                } catch (err) {
                    console.warn('Failed to update systems_on_over_1nt_interference.stolen_bid_double:', err);
                }
            });
        }
    } catch (e) {
        console.warn('createGeneralSettingsSection failed:', e);
    }
}

// Update the RKCB label in-place without resetting all user selections, then re-render UI
function updateRKCBLabelAndRerender() {
    if (!system?.conventions) return;
    const variant = (system.conventions.getConventionSetting('blackwood', 'responses', 'ace_asking')) || '1430';
    const newLabel = `RKC Blackwood ${variant}`;
    const possibleOld = ['RKC Blackwood 1430', 'RKC Blackwood 3014'];

    // If label already correct, just re-render to be safe
    let oldLabel = possibleOld.find(n => n !== newLabel && availableConventions[n]);
    if (!oldLabel && availableConventions[newLabel]) {
        // No rename needed; still update mutual exclusivity label and UI
        updateMutualExclusivityForRKCB(newLabel);
        createConventionCheckboxes();
        createPracticeConventionOptions();
        // Subtle highlight to indicate update
        try { flashRKCBLabel(newLabel); } catch (_) {}
        return;
    }

    // Move availableConventions entry
    const oldEntry = oldLabel ? availableConventions[oldLabel] : null;
    // Preserve enabled state
    if (oldLabel && enabledConventions.hasOwnProperty(oldLabel)) {
        enabledConventions[newLabel] = enabledConventions[oldLabel];
        delete enabledConventions[oldLabel];
    } else if (!enabledConventions.hasOwnProperty(newLabel)) {
        enabledConventions[newLabel] = true;
    }

    // Update category lists (slam_bidding contains RKCB)
    if (conventionCategories['slam_bidding']?.conventions) {
        const list = conventionCategories['slam_bidding'].conventions;
        for (let i = 0; i < list.length; i++) {
            if (possibleOld.includes(list[i])) {
                list[i] = newLabel;
            }
        }
        // Ensure uniqueness
        conventionCategories['slam_bidding'].conventions = Array.from(new Set(conventionCategories['slam_bidding'].conventions));
    }

    // Update practice selections referring to old label
    if (Array.isArray(practiceConventions)) {
        practiceConventions = practiceConventions.map(n => (possibleOld.includes(n) ? newLabel : n));
    }
    if (selectedPracticeConventions && typeof selectedPracticeConventions === 'object') {
        Object.keys(selectedPracticeConventions).forEach(cat => {
            const val = selectedPracticeConventions[cat];
            if (possibleOld.includes(val)) {
                selectedPracticeConventions[cat] = newLabel;
            }
        });
    }

    // Update mutual exclusivity groups
    updateMutualExclusivityForRKCB(newLabel);

    // Re-render panels
    createConventionCheckboxes();
    createPracticeConventionOptions();
    // Persist enabled conventions after relabeling to keep storage in sync
    try { saveEnabledConventions(); } catch (_) {}
    // Subtle highlight to indicate update
    try { flashRKCBLabel(newLabel); } catch (_) {}
}

function updateMutualExclusivityForRKCB(rkcbLabel) {
    if (!Array.isArray(mutuallyExclusiveGroups)) return;
    for (let i = 0; i < mutuallyExclusiveGroups.length; i++) {
        const group = mutuallyExclusiveGroups[i];
        if (Array.isArray(group) && group.includes('Regular Blackwood')) {
            // Replace the RKCB entry in that group with the current label
            const otherIdx = group[0] === 'Regular Blackwood' ? 1 : 0;
            group[otherIdx] = rkcbLabel;
            mutuallyExclusiveGroups[i] = ['Regular Blackwood', rkcbLabel];
            break;
        }
    }
}

// Add a transient highlight to the RKCB convention item(s) after label update
function flashRKCBLabel(rkcbLabel) {
    const idBase = rkcbLabel.replace(/\s+/g, '_');
    const targetIds = [
        `conv_${idBase}`,
        `practice_${idBase}`
    ];
    targetIds.forEach(id => {
        const lbl = document.querySelector(`label[for="${id}"]`);
        if (!lbl || !lbl.parentElement) return;
        const container = lbl.parentElement;
        if (!container.classList || !container.classList.contains('convention-item')) return;
        // Retrigger animation reliably
        container.classList.remove('rkcb-flash');
        // Force reflow
        void container.offsetWidth;
        container.classList.add('rkcb-flash');
        container.addEventListener('animationend', () => {
            container.classList.remove('rkcb-flash');
        }, { once: true });
    });
}

async function loadAvailableConventions() {
    try {
        // Use the config already loaded by ConventionCard to avoid any fetch/CORS
        let conventionsConfig = system?.conventions?.config || null;
        if (!conventionsConfig) {
            // Fallback to hardcoded defaults when config isn't available yet
            loadFallbackConventions();
            return;
        }
        
        // Parse conventions from the loaded configuration
        availableConventions = {};
        conventionCategories = {};
        mutuallyExclusiveGroups = [];
        
        // Process each category
        Object.keys(conventionsConfig).forEach(categoryKey => {
            const category = conventionsConfig[categoryKey];
            
            // Skip general category for UI display but still process for background use
            if (categoryKey !== 'general') {
                conventionCategories[categoryKey] = {
                    name: getCategoryDisplayName(categoryKey),
                    conventions: []
                };
            }
            
            // Process conventions in this category
            Object.keys(category).forEach(conventionKey => {
                const convention = category[conventionKey];
                const displayName = getConventionDisplayName(conventionKey);
                
                availableConventions[displayName] = {
                    category: categoryKey,
                    key: conventionKey,
                    description: convention.description || getDefaultDescription(conventionKey),
                    enabled: convention.enabled !== false, // Default to enabled unless explicitly disabled
                    isGeneral: categoryKey === 'general' // Mark general conventions
                };
                
                // Only add to UI categories if not general
                if (categoryKey !== 'general') {
                    conventionCategories[categoryKey].conventions.push(displayName);
                }
            });
        });
        
        // Set up mutual exclusivity groups
        mutuallyExclusiveGroups = [
            ['DONT', 'Meckwell'], // NT defense systems are mutually exclusive
            ['Regular Blackwood', 'RKC Blackwood 1430'] // Blackwood variants are mutually exclusive
        ];
        
        // Initialize enabled conventions based on JSON configuration
        enabledConventions = {};
        Object.keys(availableConventions).forEach(name => {
            const convention = availableConventions[name];
            // General conventions are always enabled
            if (convention.isGeneral) {
                enabledConventions[name] = true;
            } else {
                enabledConventions[name] = convention.enabled;
            }
        });
        
        console.log('Conventions loaded from inline/default config:', Object.keys(availableConventions));

        // Add a practice-only selector for "Unusual NT (over minors)" without adding an Active checkbox
        try {
            const label = 'Unusual NT (over minors)';
            // Avoid duplicates on reload
            if (!availableConventions[label]) {
                availableConventions[label] = {
                    category: 'competitive',
                    key: 'unusual_nt_over_minors',
                    description: '2NT over 1♣/1♦ shows the two lowest unbid suits (5-5). When off, 2NT over minors is natural 19–21 with a stopper.',
                    enabled: true, // practice-only; enablement handled dynamically in Practice tab
                    isGeneral: false,
                    practiceOnly: true
                };
                if (conventionCategories['competitive']) {
                    conventionCategories['competitive'].conventions.push(label);
                }
            }
        } catch (_) { /* ignore */ }

        // Reorder categories for a balanced two-column layout, with Slam Bidding below Responses (first column)
        const desiredOrder = ['opening_bids','notrump_responses','responses','competitive','slam_bidding','notrump_defenses'];
        const orderedCategories = {};
        desiredOrder.forEach(key => {
            if (conventionCategories[key]) {
                orderedCategories[key] = conventionCategories[key];
            }
        });
        // Append any categories not explicitly ordered
        Object.keys(conventionCategories).forEach(key => {
            if (!orderedCategories[key]) {
                orderedCategories[key] = conventionCategories[key];
            }
        });
        conventionCategories = orderedCategories;
        
    } catch (error) {
        console.error('Error loading conventions (using fallback):', error);
        // Fallback to hardcoded conventions
        loadFallbackConventions();
    }
}

function getCategoryDisplayName(categoryKey) {
    const categoryNames = {
        'opening_bids': 'Opening Bids',
        'slam_bidding': 'Slam Bidding',
        'ace_asking': 'Ace Asking', // Legacy support
        'notrump_responses': 'No Trump Responses',
        'notrump_defenses': 'No Trump Defenses',
        'responses': 'Responses',
        'competitive': 'Competitive Bidding',
        'general': 'General Conventions'
    };
    return categoryNames[categoryKey] || categoryKey;
}

function getConventionDisplayName(conventionKey) {
    // Dynamic naming for RKCB based on selected response structure
    if (conventionKey === 'blackwood_rkcb') {
        try {
            const resp = (system?.conventions?.getConventionSetting('blackwood', 'responses', 'ace_asking')) || '1430';
            return `RKC Blackwood ${resp}`;
        } catch (e) {
            return 'RKC Blackwood 1430';
        }
    }
    const conventionNames = {
        'strong_2_clubs': 'Strong 2 Clubs',
        'weak_2_bids': 'Weak 2 Bids',
        'stayman': 'Stayman',
        'jacoby_transfers': 'Jacoby Transfers',
        'texas_transfers': 'Texas Transfers',
    'minor_suit_transfers': 'Minor Suit Transfers',
        'control_showing_cue_bids': 'Control Showing Cue Bids',
        'gerber': 'Gerber',
        'blackwood_regular': 'Regular Blackwood',
        'blackwood_rkcb': 'RKC Blackwood 1430',
        'dont': 'DONT',
        'meckwell': 'Meckwell',
        'lebensohl': 'Lebensohl',
        'jacoby_2nt': 'Jacoby 2NT',
        'splinter_bids': 'Splinter Bids',
        'unusual_nt': 'Unusual NT',
        'michaels': 'Michaels',
        'responsive_doubles': 'Responsive Doubles',
        'negative_doubles': 'Negative Doubles',
        'takeout_doubles': 'Takeout Doubles',
        'support_doubles': 'Support Doubles',
        'reopening_doubles': 'Reopening Doubles',
        'cue_bid_raises': 'Cue Bid Raises',
        'drury': 'Drury',
        'bergen_raises': 'Bergen Raises'

    };
    return conventionNames[conventionKey] || conventionKey;
}

function getDefaultDescription(conventionKey) {
    const descriptions = {
        'strong_2_clubs': '2C opening shows 22+ HCP, artificial and game forcing',
        'weak_2_bids': 'Weak 2 bids in diamonds, hearts, and spades',
        'stayman': '2C asking for a 4-card major over partner\'s 1NT',
        'jacoby_transfers': '2D/2H over 1NT (3D/3H over 2NT) transferring to hearts/spades',
        'texas_transfers': '4D/4H over 1NT/2NT transferring to 4H/4S to play',
    'minor_suit_transfers': '2S transfers to clubs; 2NT transfers to diamonds over 1NT',
        'control_showing_cue_bids': 'Cue bids showing first or second round control in slam-going auctions',
        'gerber': 'Ace asking convention using 4C',
        'blackwood_regular': 'Regular Blackwood asking for aces only',
    'blackwood_rkcb': 'Roman Key Card Blackwood with variable responses (1430 or 3014)',
        'dont': 'Defense against 1NT opening',
        'meckwell': 'Defense against strong club systems',
        'lebensohl': 'Lebensohl convention after interference',
        'jacoby_2nt': 'Game forcing raise of major suit',
        'splinter_bids': 'Jump bids showing shortness and support',
        'unusual_nt': 'Unusual No Trump showing minors',
        'michaels': 'Cue bid showing 5-5 in majors or major+minor',
        'responsive_doubles': 'Doubles after partner\'s takeout double',
        'negative_doubles': 'Doubles showing unbid major(s)',
        'takeout_doubles': 'Double for takeout, asking partner to bid',
        'support_doubles': 'Double showing 3-card support for partner\'s suit',
        'reopening_doubles': 'Doubles in reopening position',
        'cue_bid_raises': 'Cue bids showing strong raises after interference',
        'bergen_raises': '3♣ = 7-10 HCP and 4+ trumps; 3♦ = 11-12 HCP and 4+ trumps; 3M = preemptive (0-6 HCP, 4+ trumps)'

    };
    return descriptions[conventionKey] || 'Bridge convention';
}

function loadFallbackConventions() {
    // Fallback hardcoded conventions if JSON loading fails
    const rkcbVariant = (system?.conventions?.getConventionSetting('blackwood', 'responses', 'ace_asking')) || '1430';
    const rkcbName = `RKC Blackwood ${rkcbVariant}`;
    availableConventions = {
        'Strong 2 Clubs': { category: 'opening_bids', key: 'strong_2_clubs', description: '2C opening shows 22+ HCP, artificial and game forcing', enabled: true, isGeneral: false },
        'Weak 2 Bids': { category: 'opening_bids', key: 'weak_2_bids', description: 'Weak 2 bids in diamonds, hearts, and spades', enabled: true, isGeneral: false },
        'Stayman': { category: 'notrump_responses', key: 'stayman', description: '2C asking for a 4-card major over partner\'s 1NT', enabled: true, isGeneral: false },
        'Jacoby Transfers': { category: 'notrump_responses', key: 'jacoby_transfers', description: '2D/2H over 1NT; 3D/3H over 2NT transfer to H/S', enabled: true, isGeneral: false },
        'Texas Transfers': { category: 'notrump_responses', key: 'texas_transfers', description: '4D/4H over 1NT/2NT transfer to 4H/4S', enabled: true, isGeneral: false },
    'Minor Suit Transfers': { category: 'notrump_responses', key: 'minor_suit_transfers', description: '2S->3C; 2NT->3D over 1NT', enabled: false, isGeneral: false },
        'Gerber': { category: 'slam_bidding', key: 'gerber', description: 'Ace asking convention using 4C', enabled: true, isGeneral: false },
        'Regular Blackwood': { category: 'slam_bidding', key: 'blackwood_regular', description: 'Regular Blackwood asking for aces only', enabled: false, isGeneral: false },
    [rkcbName]: { category: 'slam_bidding', key: 'blackwood_rkcb', description: `Roman Key Card Blackwood with ${rkcbVariant} responses`, enabled: true, isGeneral: false },
        'Control Showing Cue Bids': { category: 'slam_bidding', key: 'control_showing_cue_bids', description: 'Cue bids showing first or second round control in slam-going auctions', enabled: true, isGeneral: false },
        'DONT': { category: 'notrump_defenses', key: 'dont', description: 'Defense against 1NT opening', enabled: true, isGeneral: false },
        'Meckwell': { category: 'notrump_defenses', key: 'meckwell', description: 'Defense against strong club systems', enabled: false, isGeneral: false },
        'Jacoby 2NT': { category: 'responses', key: 'jacoby_2nt', description: 'Game forcing raise of major suit', enabled: true, isGeneral: false },
    'Splinter Bids': { category: 'responses', key: 'splinter_bids', description: 'Jump bids showing shortness and support', enabled: true, isGeneral: false },
    'Bergen Raises': { category: 'responses', key: 'bergen_raises', description: '3♣/3♦ raises with 4+ trumps (7-10, 11-12); 3M preemptive 0-6', enabled: false, isGeneral: false },
        'Lebensohl': { category: 'competitive', key: 'lebensohl', description: 'Lebensohl convention after interference', enabled: true, isGeneral: false },
        'Unusual NT': { category: 'competitive', key: 'unusual_nt', description: 'Unusual No Trump showing minors', enabled: true, isGeneral: false },
        'Michaels': { category: 'competitive', key: 'michaels', description: 'Cue bid showing 5-5 in majors or major+minor', enabled: true, isGeneral: false },
        'Responsive Doubles': { category: 'competitive', key: 'responsive_doubles', description: 'Doubles after partner\'s takeout double', enabled: true, isGeneral: false },
        'Negative Doubles': { category: 'competitive', key: 'negative_doubles', description: 'Doubles showing unbid major(s)', enabled: true, isGeneral: false },
        'Takeout Doubles': { category: 'competitive', key: 'takeout_doubles', description: 'Double for takeout, asking partner to bid', enabled: true, isGeneral: false },
        'Support Doubles': { category: 'competitive', key: 'support_doubles', description: 'Double showing 3-card support for partner\'s suit', enabled: true, isGeneral: false },
        'Reopening Doubles': { category: 'competitive', key: 'reopening_doubles', description: 'Doubles in reopening position', enabled: true, isGeneral: false },
        'Cue Bid Raises': { category: 'competitive', key: 'cue_bid_raises', description: 'Cue bids showing strong raises after interference', enabled: true, isGeneral: false },
        'Drury': { category: 'responses', key: 'drury', description: 'Drury convention for passed hand major suit raises', enabled: true, isGeneral: false },

        'Vulnerability Adjustments': { category: 'general', key: 'vulnerability_adjustments', description: 'Adjust bidding based on vulnerability', enabled: true, isGeneral: true },
        'Passed Hand Variations': { category: 'general', key: 'passed_hand_variations', description: 'Variations for passed hand bidding', enabled: true, isGeneral: true },
        'Balance of Power': { category: 'general', key: 'balance_of_power', description: 'Balance of power considerations', enabled: true, isGeneral: true }
    };
    
    conventionCategories = {
        'opening_bids': { name: 'Opening Bids', conventions: ['Strong 2 Clubs', 'Weak 2 Bids'] },
    'notrump_responses': { name: 'No Trump Responses', conventions: ['Stayman', 'Jacoby Transfers', 'Texas Transfers', 'Minor Suit Transfers'] },
    'responses': { name: 'Responses', conventions: ['Jacoby 2NT', 'Splinter Bids', 'Bergen Raises', 'Drury'] },
        'competitive': { name: 'Competitive Bidding', conventions: ['Lebensohl', 'Unusual NT', 'Michaels', 'Responsive Doubles', 'Negative Doubles', 'Takeout Doubles', 'Support Doubles', 'Reopening Doubles', 'Cue Bid Raises'] },
    'slam_bidding': { name: 'Slam Bidding', conventions: ['Gerber', 'Regular Blackwood', rkcbName, 'Control Showing Cue Bids'] },
        'notrump_defenses': { name: 'No Trump Defenses', conventions: ['DONT', 'Meckwell'] }
    };
    
    mutuallyExclusiveGroups = [
        ['DONT', 'Meckwell'],
        ['Regular Blackwood', rkcbName]
    ];
    
    enabledConventions = {};
    Object.keys(availableConventions).forEach(name => {
        const convention = availableConventions[name];
        // General conventions are always enabled
        if (convention.isGeneral) {
            enabledConventions[name] = true;
        } else {
            enabledConventions[name] = convention.enabled;
        }
    });
}

function createConventionCheckboxes() {
    console.log('createConventionCheckboxes called');
    console.log('conventionCategories:', conventionCategories);
    console.log('availableConventions:', availableConventions);
    
    const container = document.getElementById('conventionCheckboxes');
    if (!container) {
        console.error('conventionCheckboxes container not found');
        return;
    }
    
    container.innerHTML = '';

    // Build two independent columns so left stack isn't constrained by right column height
    const col1 = document.createElement('div');
    const col2 = document.createElement('div');
    const col3 = document.createElement('div');
    col1.className = 'convention-col col1';
    col2.className = 'convention-col col2';
    col3.className = 'convention-col col3';

    // Three-column layout per request:
    // 1) Opening Bids, Responses, NT Defenses
    // 2) No Trump Responses, Slam Bidding
    // 3) Competitive Bidding
    const col1Order = ['opening_bids','responses','notrump_defenses'];
    const col2Order = ['notrump_responses','slam_bidding'];
    const col3Order = ['competitive'];

    const renderCategory = (categoryKey, targetCol) => {
        const category = conventionCategories[categoryKey];
        if (!category) return;

        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'convention-category';

        const categoryHeader = document.createElement('h6');
        categoryHeader.className = 'convention-category-header';
        categoryHeader.textContent = category.name;
        categoryDiv.appendChild(categoryHeader);

        const rowDiv = document.createElement('div');
        rowDiv.className = 'convention-row';

        category.conventions.forEach(conventionName => {
            const convention = availableConventions[conventionName];
            if (!convention) return;
            // Skip practice-only pseudo items from Active Conventions UI
            if (convention.practiceOnly) return;

            const itemDiv = document.createElement('div');
            itemDiv.className = 'convention-item';
            itemDiv.title = convention.description;

            itemDiv.innerHTML = `
                <input type="checkbox" id="conv_${conventionName.replace(/\s+/g, '_')}" 
                       ${enabledConventions[conventionName] ? 'checked' : ''} 
                       onchange="updateConventionStatus('${conventionName}', this.checked)">
                <label for="conv_${conventionName.replace(/\s+/g, '_')}">
                    ${conventionName}
                </label>
            `;

            rowDiv.appendChild(itemDiv);
        });

        categoryDiv.appendChild(rowDiv);
        targetCol.appendChild(categoryDiv);
    };

    col1Order.forEach(key => renderCategory(key, col1));
    col2Order.forEach(key => renderCategory(key, col2));
    col3Order.forEach(key => renderCategory(key, col3));

    // Append columns to container (container itself is a 2-col grid via CSS)
    container.appendChild(col1);
    container.appendChild(col2);
    container.appendChild(col3);
}

function createPracticeConventionOptions() {
    const container = document.getElementById('practiceConventionCheckboxes');
    if (!container) return;
    
    container.innerHTML = '';

    // Two independent columns for practice options
    const col1 = document.createElement('div');
    const col2 = document.createElement('div');
    const col3 = document.createElement('div');
    col1.className = 'convention-col col1';
    col2.className = 'convention-col col2';
    col3.className = 'convention-col col3';

    // Mirror Active tab three-column grouping
    const col1Order = ['opening_bids','responses','notrump_defenses'];
    const col2Order = ['notrump_responses','slam_bidding'];
    const col3Order = ['competitive'];

    const renderPracticeCategory = (categoryKey, targetCol) => {
        const category = conventionCategories[categoryKey];
        if (!category) return;

        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'convention-category';

        const categoryHeader = document.createElement('h6');
        categoryHeader.className = 'convention-category-header';
        categoryHeader.textContent = category.name;
        categoryDiv.appendChild(categoryHeader);

        const rowDiv = document.createElement('div');
        rowDiv.className = 'convention-row';

        category.conventions.forEach(conventionName => {
            const convention = availableConventions[conventionName];
            if (!convention) return;

            const itemDiv = document.createElement('div');
            itemDiv.className = 'convention-item';
            itemDiv.title = convention.description;

            // For practice-only items, enablement depends on current engine config (not an Active checkbox)
            let isActiveEnabled = enabledConventions[conventionName];
            if (convention.practiceOnly) {
                try {
                    const unn = system?.conventions?.config?.notrump_defenses?.unusual_nt;
                    isActiveEnabled = !!(unn && unn.enabled !== false && unn.over_minors === true);
                } catch (_) { isActiveEnabled = false; }
            }
            const isChecked = selectedPracticeConventions[categoryKey] === conventionName && isActiveEnabled;

            if (!isActiveEnabled) {
                itemDiv.style.opacity = '0.6';
                itemDiv.style.cursor = 'not-allowed';
            }

            // Build label + optional tooltip for practice-only entries
            const isUnusualOverMinors = !!(convention.practiceOnly && convention.key === 'unusual_nt_over_minors');
            const tipText = isUnusualOverMinors
                ? 'Unusual 2NT over minors:\nOver 1♣ → shows ♦ + ♥ (5-5).\nOver 1♦ → shows ♣ + ♥ (5-5).'
                : '';
            itemDiv.innerHTML = `
                <input type="radio" name="practice_${categoryKey}" id="practice_${conventionName.replace(/\s+/g, '_')}" 
                       ${isChecked ? 'checked' : ''} 
                       ${!isActiveEnabled ? 'disabled' : ''}
                       onchange="updatePracticeConventionSelection('${categoryKey}', '${conventionName}')">
                <label for="practice_${conventionName.replace(/\s+/g, '_')}" ${!isActiveEnabled ? 'style=\"color: #6c757d;\"' : ''}>
                    ${conventionName}
                </label>
                ${isUnusualOverMinors ? `<span class="practice-help" title="${tipText}" aria-label="${tipText}" style="margin-left:6px; cursor:help; user-select:none;">ⓘ</span>` : ''}
            `;

            rowDiv.appendChild(itemDiv);
        });

        categoryDiv.appendChild(rowDiv);
        targetCol.appendChild(categoryDiv);
    };

    col1Order.forEach(key => renderPracticeCategory(key, col1));
    col2Order.forEach(key => renderPracticeCategory(key, col2));
    col3Order.forEach(key => renderPracticeCategory(key, col3));

    container.appendChild(col1);
    container.appendChild(col2);
    container.appendChild(col3);
}

function updateConventionStatus(conventionName, enabled) {
    // Handle mutual exclusivity
    if (enabled) {
        // Check if this convention is mutually exclusive with others
        mutuallyExclusiveGroups.forEach(group => {
            if (group.includes(conventionName)) {
                // Disable other conventions in this group
                group.forEach(otherConvention => {
                    if (otherConvention !== conventionName && enabledConventions[otherConvention]) {
                        enabledConventions[otherConvention] = false;
                        // Update the checkbox
                        const otherCheckbox = document.getElementById(`conv_${otherConvention.replace(/\s+/g, '_')}`);
                        if (otherCheckbox) {
                            otherCheckbox.checked = false;
                        }
                        // Remove from practice conventions
                        if (practiceConventions.includes(otherConvention)) {
                            practiceConventions = practiceConventions.filter(name => name !== otherConvention);
                        }
                        console.log(`Convention ${otherConvention} auto-disabled due to mutual exclusivity with ${conventionName}`);
                    }
                });
            }
        });
    }
    
    enabledConventions[conventionName] = enabled;
    
    // If disabling a convention, also remove it from practice conventions
    if (!enabled && practiceConventions.includes(conventionName)) {
        practiceConventions = practiceConventions.filter(name => name !== conventionName);
    }
    
    // Refresh practice convention checkboxes to reflect changes
    createPracticeConventionOptions();
    
    try { saveEnabledConventions(); } catch (_) {}
    console.log(`Convention ${conventionName} ${enabled ? 'enabled' : 'disabled'}`);
}

function updatePracticeConvention(conventionName, enabled) {
    if (enabled) {
        if (!practiceConventions.includes(conventionName)) {
            practiceConventions.push(conventionName);
        }
    } else {
        practiceConventions = practiceConventions.filter(name => name !== conventionName);
    }
    
    console.log(`Practice convention ${conventionName} ${enabled ? 'enabled' : 'disabled'}`);
}

function updatePracticeConventionSelection(categoryKey, conventionName) {
    // Update the selected convention for this category
    if (conventionName === null) {
        delete selectedPracticeConventions[categoryKey];
    } else {
        selectedPracticeConventions[categoryKey] = conventionName;
    }
    
    console.log(`Practice convention selection for ${categoryKey}: ${conventionName || 'None'}`);
    console.log('Current practice selections:', selectedPracticeConventions);
}

function selectAllConventions() {
    Object.keys(availableConventions).forEach(conventionName => {
        const convention = availableConventions[conventionName];
        
        // Skip general conventions (always enabled), Meckwell (user must manually enable),
        // and Regular Blackwood (RKC Blackwood 1430 is preferred)
        if (convention.isGeneral || conventionName === 'Meckwell' || conventionName === 'Regular Blackwood') {
            return;
        }
        
        enabledConventions[conventionName] = true;
        const checkbox = document.getElementById(`conv_${conventionName.replace(/\s+/g, '_')}`);
        if (checkbox) checkbox.checked = true;
    });
    
    // Refresh practice convention checkboxes
    createPracticeConventionOptions();
    try { saveEnabledConventions(); } catch (_) {}
    
    console.log('All conventions enabled (except general, Meckwell, and Regular Blackwood)');
}

function clearAllConventions() {
    Object.keys(availableConventions).forEach(conventionName => {
        const convention = availableConventions[conventionName];
        
        // Skip general conventions (always enabled)
        if (convention.isGeneral) {
            return;
        }
        
        enabledConventions[conventionName] = false;
        const checkbox = document.getElementById(`conv_${conventionName.replace(/\s+/g, '_')}`);
        if (checkbox) checkbox.checked = false;
    });
    
    // Clear all practice conventions and refresh
    practiceConventions = [];
    createPracticeConventionOptions();
    try { saveEnabledConventions(); } catch (_) {}
    
    console.log('All conventions disabled (except general)');
}



function updateSystemConventions() {
    // Update the system's convention configuration based on enabled conventions
    if (!system || !system.conventions || !system.conventions.config) return;
    
    const config = system.conventions.config;
    
    // Update each convention category
    Object.keys(availableConventions).forEach(conventionName => {
        const convention = availableConventions[conventionName];
        const enabled = enabledConventions[conventionName];
        
        try {
            if (config[convention.category] && config[convention.category][convention.key]) {
                config[convention.category][convention.key].enabled = enabled;
            }
        } catch (error) {
            console.warn(`Could not update convention ${conventionName}:`, error);
        }
    });
    
    console.log('System conventions updated');
}

function generateHandsForPractice() {
    try {
        // Cancel any in-progress auction before creating a new deal
        resetAuctionForNewDeal();

        const selectedConventions = Object.values(selectedPracticeConventions).filter(conv => conv !== null);
        console.log(`Generating hands for selected practice conventions:`, selectedPracticeConventions);
        
        if (selectedConventions.length === 0) {
            // No practice conventions selected, generate random hands
            return generateBasicRandomHands();
        }
        
        // Select target convention for this hand generation
        const targetConvention = selectTargetConvention(selectedConventions);
        console.log(`Target convention for this hand: ${targetConvention}`);
        
        // Generate hand optimized for the target convention
        if (generateConventionTargetedHand(targetConvention)) {
            displayHands();
            showAuctionSetup();
            addPracticeIndicator(targetConvention);
            try { switchTab('auction'); } catch (e) { console.warn('Could not switch to auction tab:', e); }
        } else {
            // Fall back to random generation if targeted generation fails
            console.log('Targeted generation failed, falling back to random');
            generateBasicRandomHands();
            displayHands();
            showAuctionSetup();
            try { switchTab('auction'); } catch (e) { console.warn('Could not switch to auction tab:', e); }
        }
        
    } catch (error) {
        console.error('Error generating practice hands:', error);
        generateBasicRandomHands();
        displayHands();
        showAuctionSetup();
        try { switchTab('auction'); } catch (e) { console.warn('Could not switch to auction tab:', e); }
    }
}

// Convenience: one-click generate then view Auction tab
function generateAndViewAuction() {
    try {
        generateRandomHands();
    } catch (e) {
        console.error('generateAndViewAuction failed:', e);
        try { switchTab('auction'); } catch (_) {}
    }
}

function generateBasicRandomHands() {
    const deck = createDeck();
    shuffleDeck(deck);
    
    currentHands.N = new window.Hand(convertCardsToHandString(deck.slice(0, 13)));
    currentHands.E = new window.Hand(convertCardsToHandString(deck.slice(13, 26)));
    currentHands.S = new window.Hand(convertCardsToHandString(deck.slice(26, 39)));
    currentHands.W = new window.Hand(convertCardsToHandString(deck.slice(39, 52)));
}

function selectTargetConvention(selectedConventions) {
    // If there's only one convention, use it
    if (selectedConventions.length === 1) {
        return selectedConventions[0];
    }
    
    // If multiple conventions are selected, try to find one that's compatible
    // For now, randomly select one
    return selectedConventions[Math.floor(Math.random() * selectedConventions.length)];
}

function generateConventionTargetedHand(targetConvention) {
    const maxAttempts = 50;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        generateBasicRandomHands();
        
        if (validateHandForConvention(currentHands.S, targetConvention)) {
            console.log(`Successfully generated hand for ${targetConvention} in ${attempt + 1} attempts`);
            return true;
        }
    }
    
    console.log(`Failed to generate suitable hand for ${targetConvention} after ${maxAttempts} attempts`);
    return false;
}

function validateHandForConvention(southHand, conventionName) {
    switch (conventionName) {
        case 'Strong 2 Clubs':
            return southHand.hcp >= 22;
            
        case 'Weak 2 Bids':
            return southHand.hcp >= 6 && southHand.hcp <= 10 && 
                   (southHand.lengths.H === 6 || southHand.lengths.S === 6 || southHand.lengths.D === 6);
                   
        case 'Jacoby 2NT':
            return southHand.hcp >= 13 && 
                   (southHand.lengths.H >= 4 || southHand.lengths.S >= 4);
                   
        case 'Splinter Bids':
            return southHand.hcp >= 13 && 
                   (southHand.lengths.H >= 4 || southHand.lengths.S >= 4) &&
                   (southHand.lengths.C <= 1 || southHand.lengths.D <= 1 || 
                    southHand.lengths.H <= 1 || southHand.lengths.S <= 1);
                    
        case 'Gerber':
        case 'Regular Blackwood':
        case 'RKC Blackwood 1430':
            return southHand.hcp >= 16; // Strong enough to consider slam
            
        case 'DONT':
        case 'Meckwell':
            return southHand.hcp >= 8; // Enough to interfere over 1NT
            
        case 'Unusual NT':
            return southHand.hcp >= 8 && 
                   southHand.lengths.C >= 5 && southHand.lengths.D >= 5;
        case 'Unusual NT (over minors)':
            return southHand.hcp >= 8 &&
                   southHand.lengths.H >= 5 &&
                   (southHand.lengths.C >= 5 || southHand.lengths.D >= 5);
                   
        case 'Michaels':
            return southHand.hcp >= 8 && 
                   ((southHand.lengths.H >= 5 && southHand.lengths.S >= 5) ||
                    (southHand.lengths.H >= 5 && (southHand.lengths.C >= 5 || southHand.lengths.D >= 5)) ||
                    (southHand.lengths.S >= 5 && (southHand.lengths.C >= 5 || southHand.lengths.D >= 5)));
                    
        case 'Negative Doubles':
        case 'Responsive Doubles':
        case 'Takeout Doubles':
        case 'Support Doubles':
        case 'Reopening Doubles':
            return southHand.hcp >= 6; // Minimum for doubles
            
        case 'Cue Bid Raises':
            return southHand.hcp >= 10 && // Need strength for cue bid raise
                   (southHand.lengths.H >= 3 || southHand.lengths.S >= 3); // Need support
                   
        case 'Drury':
            return southHand.hcp >= 8 && southHand.hcp <= 12 && // Drury range
                   (southHand.lengths.H >= 3 || southHand.lengths.S >= 3); // Need major support
        
        case 'Bergen Raises':
            // Hands suitable for Bergen raises as responder: 4+ card support in a major and up to invitational values
            return southHand.hcp <= 12 && (southHand.lengths.H >= 4 || southHand.lengths.S >= 4);
            
        default:
            return southHand.hcp >= 12; // Generic opening hand strength
    }
}

function addPracticeIndicator(targetConvention) {
    // Remove any existing practice indicators
    const existingIndicators = document.querySelectorAll('.practice-indicator');
    existingIndicators.forEach(indicator => indicator.remove());
    
    if (!targetConvention) return;
    
    // Add new practice indicator
    const indicator = document.createElement('div');
    indicator.className = 'alert alert-info alert-dismissible fade show mt-2 practice-indicator';
    indicator.innerHTML = `
        <i class="bi bi-target"></i> <strong>Practice Mode:</strong> Hand generated for practicing <strong>${targetConvention}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const handCard = document.getElementById('handDisplayCard');
    if (handCard) {
        handCard.appendChild(indicator);
    }
}

// Tab switching functionality
function switchTab(tabName) {
    // Hide all tab panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab panel
    document.getElementById(tabName + 'Panel').classList.add('active');
    
    // Add active class to selected tab button
    const activeBtn = document.getElementById(tabName + 'Tab');
    if (activeBtn) activeBtn.classList.add('active');

    // Update tab progress underline (1..5 based on position among buttons)
    try {
        const nav = document.querySelector('.tab-nav');
        if (nav) {
            const buttons = Array.from(nav.querySelectorAll('.tab-button'));
            const idx = Math.max(1, buttons.findIndex(b => b === activeBtn) + 1);
            nav.style.setProperty('--progress', idx);
        }
    } catch (e) {
        // non-fatal
        console.warn('Failed to update tab progress:', e);
    }
}

// Helper function for startAuction compatibility
function showTab(tabId) {
    if (tabId === 'practice-bids') {
        switchTab('auction');
    } else {
        switchTab(tabId);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add delay to ensure all scripts are loaded
    setTimeout(initializeSystem, 500);
    // Enhance bid buttons to color suit icons only on the buttons (not in the auction grid)
    try {
        enhanceBidButtonsSuitIcons();
    } catch (e) {
        console.warn('Failed to enhance bid button suits:', e);
    }
    // Compute equal chevron widths based on the longest label
    try {
        const setTabChevronWidths = () => {
            const nav = document.querySelector('.tab-nav');
            if (!nav) return;
            const buttons = Array.from(nav.querySelectorAll('.tab-button'));
            if (!buttons.length) return;
            // Reset widths to auto for accurate measurement
            buttons.forEach(b => { b.style.width = 'auto'; b.style.flexBasis = 'auto'; });
            // Prefer width of the "Active Conventions" tab
            const activeConventionsBtn = document.getElementById('activeTab');
            let targetWidth = 0;
            if (activeConventionsBtn) {
                targetWidth = Math.ceil(activeConventionsBtn.scrollWidth);
            }
            // Fallback: if not found or measured 0, use the maximum label width
            if (!targetWidth) {
                targetWidth = buttons.reduce((m, b) => Math.max(m, Math.ceil(b.scrollWidth)), 0);
            }
            // Add a tiny buffer to account for subpixel/font rounding
            nav.style.setProperty('--tab-width', (targetWidth + 2) + 'px');
        };
        setTabChevronWidths();
        // Recompute on window resize (debounced)
        let t;
        window.addEventListener('resize', () => {
            clearTimeout(t);
            t = setTimeout(setTabChevronWidths, 150);
        });
    } catch (e) {
        console.warn('Failed to set tab chevron widths:', e);
    }
});

// Enhance bid button labels by wrapping suit symbols with color classes
function enhanceBidButtonsSuitIcons() {
    const buttons = document.querySelectorAll('.bid-button');
    if (!buttons || !buttons.length) return;
    const wrapSuit = (text) => {
        if (!text || typeof text !== 'string') return text;
        // Avoid double-wrapping
        if (text.includes('<span')) return text;
        // Replace single suit symbols with colored spans
        return text
            .replace('♣', '<span class="card-suit suit-clubs">♣</span>')
            .replace('♦', '<span class="card-suit suit-diamonds">♦</span>')
            .replace('♥', '<span class="card-suit suit-hearts">♥</span>')
            .replace('♠', '<span class="card-suit suit-spades">♠</span>');
    };
    buttons.forEach(btn => {
        // Only transform the visible label, keep onclick handlers untouched
        const original = btn.innerHTML || btn.textContent;
        const transformed = wrapSuit(original);
        if (transformed !== original) {
            btn.innerHTML = transformed;
        }
    });
}
