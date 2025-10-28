/**
 * Main application logic for the Bridge Bidding System web interface.
 */

let system = null;
let currentHand = null;
let systemReady = false;

// Function to initialize the system - scripts are loaded synchronously now
function initializeSystem() {
    try {
        console.log('Starting initialization...');
        
        // Check if classes are available
        if (typeof SAYCBiddingSystem === 'undefined') {
            throw new Error('SAYCBiddingSystem is not defined - scripts may not have loaded correctly');
        }
        
        console.log('All required classes are available');
        console.log('Creating SAYCBiddingSystem...');
        system = new SAYCBiddingSystem();
        console.log('SAYCBiddingSystem created successfully');
        
        // Load conventions configuration
        console.log('Loading conventions config...');
        system.conventions.loadConfig('conventions.json').then(() => {
            console.log('Conventions config loaded successfully');
        }).catch(configError => {
            console.warn('Config loading failed, using default config:', configError.message);
        });
        
        systemReady = true;
        console.log('Bridge bidding system initialized successfully');
        
        // Hide loading indicator
        console.log('Looking for loading indicator...');
        const loadingIndicator = document.getElementById('loadingIndicator');
        console.log('Loading indicator found:', loadingIndicator !== null);
        if (loadingIndicator) {
            console.log('Hiding loading indicator...');
            loadingIndicator.style.display = 'none';
            console.log('Loading indicator hidden');
        }
        
        // Enable UI elements
        console.log('Enabling buttons...');
        const buttons = document.querySelectorAll('button');
        console.log('Found buttons:', buttons.length);
        buttons.forEach(btn => {
            btn.disabled = false;
            console.log('Enabled button:', btn.textContent.trim());
        });
        
        console.log('🎉 Initialization complete!');
        
    } catch (error) {
        console.error('Error initializing system:', error);
        
        // Update loading indicator to show error
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) {
            loadingIndicator.className = 'alert alert-danger text-center';
            loadingIndicator.innerHTML = '<i class="bi bi-exclamation-triangle"></i> Error loading bidding system: ' + error.message;
        }
        
        alert('Error loading bidding system: ' + error.message + '\nPlease check the console for details.');
        systemReady = false;
    }
}

// Initialize the system when the page loads - scripts are loaded synchronously
window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting initialization...');
    initializeSystem();
});

/**
 * Parse the hand from input and display it.
 */
function parseHand() {
    const handInput = document.getElementById('handInput').value.trim();
    
    try {
        currentHand = new Hand(handInput);
        displayHand(currentHand);
        displayHandStats(currentHand);
        
        // Show the hand display sections
        document.getElementById('handDisplay').style.display = 'block';
        document.getElementById('handStats').style.display = 'block';
    } catch (error) {
        alert('Error parsing hand: ' + error.message);
        console.error(error);
    }
}

/**
 * Display the hand in a readable format.
 */
function displayHand(hand) {
    const suitSymbols = { 'S': '♠', 'H': '♥', 'D': '♦', 'C': '♣' };
    
    for (const suit of ['S', 'H', 'D', 'C']) {
        const cards = hand.suitBuckets[suit].map(card => card.rank).join(' ');
        const element = document.getElementById(suit.toLowerCase() === 's' ? 'spades' : 
                                               suit.toLowerCase() === 'h' ? 'hearts' :
                                               suit.toLowerCase() === 'd' ? 'diamonds' : 'clubs');
        element.textContent = cards || '—';
    }
}

/**
 * Display hand statistics.
 */
function displayHandStats(hand) {
    document.getElementById('hcpDisplay').textContent = hand.hcp;
    document.getElementById('distPointsDisplay').textContent = hand.distributionPoints;
    document.getElementById('totalPointsDisplay').textContent = hand.hcp + hand.distributionPoints;
}

/**
 * Start a new auction.
 */
function startAuction() {
    if (!system || !systemReady) {
        alert('System not initialized yet. Please wait for initialization to complete.');
        return;
    }
    
    const ourSeat = document.getElementById('ourSeat').value;
    const dealer = document.getElementById('dealer').value;
    const vulWe = document.getElementById('vulWe').checked;
    const vulThey = document.getElementById('vulThey').checked;
    
    try {
        system.startAuctionWithDealer(ourSeat, dealer, vulWe, vulThey);
    } catch (error) {
        alert('Error starting auction: ' + error.message);
        console.error(error);
        return;
    }
    
    updateAuctionDisplay();
    document.getElementById('bidResult').style.display = 'none';
    
    console.log(`Auction started: Our seat=${ourSeat}, Dealer=${dealer}, Vul We=${vulWe}, Vul They=${vulThey}`);
}

/**
 * Get recommended bid for current hand.
 */
function getBid() {
    if (!system || !systemReady) {
        alert('System not initialized yet. Please wait for initialization to complete.');
        return;
    }
    
    if (!system.currentAuction) {
        alert('Please start an auction first');
        return;
    }
    
    if (!currentHand) {
        alert('Please parse a hand first');
        return;
    }
    
    try {
        const bid = system.getBid(currentHand);
        displayBid(bid);
    } catch (error) {
        alert('Error getting bid: ' + error.message);
        console.error(error);
    }
}

/**
 * Display the recommended bid.
 */
function displayBid(bid) {
    const bidElement = document.getElementById('recommendedBid');
    const conventionElement = document.getElementById('conventionUsed');
    
    if (bid.isDouble) {
        bidElement.innerHTML = '<span class="bid-level">DOUBLE</span>';
        bidElement.className = 'bid-box bg-warning text-dark';
    } else if (bid.isRedouble) {
        bidElement.innerHTML = '<span class="bid-level">REDOUBLE</span>';
        bidElement.className = 'bid-box bg-danger text-white';
    } else if (!bid.token) {
        bidElement.innerHTML = '<span class="bid-level">PASS</span>';
        bidElement.className = 'bid-box bg-secondary text-white';
    } else {
        const suitSymbol = getSuitSymbol(bid.token[1]);
        bidElement.innerHTML = `<span class="bid-level">${bid.token[0]}</span>${suitSymbol}`;
        bidElement.className = 'bid-box bg-primary text-white';
    }
    
    if (bid.conventionUsed) {
        conventionElement.innerHTML = `<i class="bi bi-info-circle"></i> ${bid.conventionUsed}`;
        conventionElement.style.display = 'block';
    } else {
        conventionElement.style.display = 'none';
    }
    
    document.getElementById('bidResult').style.display = 'block';
}

/**
 * Add a bid to the current auction.
 */
function addBid() {
    if (!system || !systemReady) {
        alert('System not initialized yet. Please wait for initialization to complete.');
        return;
    }
    
    if (!system.currentAuction) {
        alert('Please start an auction first');
        return;
    }
    
    const bidInput = document.getElementById('bidToAdd').value.trim().toUpperCase();
    
    try {
        let bid;
        if (bidInput === 'PASS' || bidInput === 'P') {
            bid = new Bid(null);
        } else if (bidInput === 'DOUBLE' || bidInput === 'X' || bidInput === 'DBL') {
            bid = new Bid(null, { isDouble: true });
        } else if (bidInput === 'REDOUBLE' || bidInput === 'XX' || bidInput === 'RDBL') {
            bid = new Bid(null, { isRedouble: true });
        } else {
            bid = new Bid(bidInput);
        }
        
        system.currentAuction.add(bid);
        updateAuctionDisplay();
        document.getElementById('bidToAdd').value = '';
    } catch (error) {
        alert('Invalid bid format');
        console.error(error);
    }
}

/**
 * Update the auction history display.
 */
function updateAuctionDisplay() {
    const auctionHistory = document.getElementById('auctionHistory');
    
    if (!system.currentAuction || system.currentAuction.bids.length === 0) {
        auctionHistory.innerHTML = '<p class="text-muted text-center">No bids yet.</p>';
        return;
    }
    
    let html = '<div class="row">';
    const seats = ['N', 'E', 'S', 'W'];
    const dealerIdx = seats.indexOf(system.currentAuction.dealer || 'N');
    
    // Add seat headers
    for (let i = 0; i < 4; i++) {
        const seat = seats[(dealerIdx + i) % 4];
        html += `<div class="col-3 text-center fw-bold">${seat}</div>`;
    }
    html += '</div><div class="row mt-2">';
    
    // Add bids
    system.currentAuction.bids.forEach((bid, idx) => {
        const seat = seats[(dealerIdx + idx) % 4];
        const isOurs = seat === system.ourSeat || 
                      (seat === 'N' && system.ourSeat === 'S') ||
                      (seat === 'S' && system.ourSeat === 'N') ||
                      (seat === 'E' && system.ourSeat === 'W') ||
                      (seat === 'W' && system.ourSeat === 'E');
        
        const bidClass = isOurs ? 'bid-we' : 'bid-they';
        let bidText;
        
        if (bid.isDouble) bidText = 'X';
        else if (bid.isRedouble) bidText = 'XX';
        else if (!bid.token) bidText = 'Pass';
        else bidText = bid.token[0] + getSuitSymbol(bid.token[1]);
        
        html += `<div class="col-3"><div class="bid-item ${bidClass}">${bidText}</div></div>`;
        
        if ((idx + 1) % 4 === 0) {
            html += '</div><div class="row mt-1">';
        }
    });
    
    html += '</div>';
    auctionHistory.innerHTML = html;
}

/**
 * Get suit symbol for display.
 */
function getSuitSymbol(suit) {
    const symbols = {
        'S': '<span class="suit-spades">♠</span>',
        'H': '<span class="suit-hearts">♥</span>',
        'D': '<span class="suit-diamonds">♦</span>',
        'C': '<span class="suit-clubs">♣</span>',
        'N': 'NT'
    };
    return symbols[suit] || suit;
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement.id === 'handInput') {
            parseHand();
        } else if (activeElement.id === 'bidToAdd') {
            addBid();
        }
    }
});
