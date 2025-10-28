/**
 * Test helper functions for bridge bidding tests.
 */

// Node.js requires for testing
if (typeof require !== 'undefined') {
    global.Card = require('../js/bridge-types.js').Card;
    global.Hand = require('../js/bridge-types.js').Hand;
    global.Bid = require('../js/bridge-types.js').Bid;
    global.Auction = require('../js/bridge-types.js').Auction;
    global.ConventionCard = require('../js/convention-manager.js').ConventionCard;
    const combinedSystem = require('../js/combined-bidding-system.js');
    global.BiddingSystem = combinedSystem.BiddingSystem;
    global.SAYCBiddingSystem = combinedSystem.SAYCBiddingSystem;
}

/**
 * Create a Hand from a mapping of suits to arrays of ranks.
 * Pads with '2's to reach 13 cards.
 */
function makeHandFromRanks(ranksBySuit) {
    const SUITS = ['C', 'D', 'H', 'S'];
    const buckets = {};
    let total = 0;

    // Initialize all suits
    for (const suit of SUITS) {
        buckets[suit] = [];
    }

    // Add specified cards
    for (const [suit, ranks] of Object.entries(ranksBySuit)) {
        for (const rank of ranks) {
            buckets[suit].push(new Card(rank, suit));
        }
        total += ranks.length;
    }

    // Pad with 2s of clubs if needed
    while (total < 13) {
        buckets['C'].push(new Card('2', 'C'));
        total++;
    }

    return new Hand(buckets);
}

/**
 * Create a hand from string patterns like 'AKQ32' for each suit.
 * Order is: Spades, Hearts, Diamonds, Clubs.
 */
function makeHandFromPattern(spades, hearts, diamonds, clubs) {
    const suits = { S: spades, H: hearts, D: diamonds, C: clubs };
    const buckets = { C: [], D: [], H: [], S: [] };

    for (const [suit, pattern] of Object.entries(suits)) {
        for (const rank of pattern) {
            buckets[suit].push(new Card(rank, suit));
        }
    }

    return new Hand(buckets);
}

/**
 * Create a test hand with specified suit lengths and HCP.
 */
function makeTestHand(spades, hearts, diamonds, clubs, hcp = 10) {
    // Start with all 2s
    const hand = {
        S: Array(spades).fill('2'),
        H: Array(hearts).fill('2'),
        D: Array(diamonds).fill('2'),
        C: Array(clubs).fill('2')
    };

    // Add high cards to match HCP
    const suits = ['S', 'H', 'D', 'C'];
    let remainingHcp = hcp;
    let i = 0;

    while (remainingHcp > 0 && i < suits.length) {
        const suit = suits[i];
        if (hand[suit].length > 0) {
            // Try to use A first (4 HCP)
            if (remainingHcp >= 4) {
                hand[suit][0] = 'A';
                remainingHcp -= 4;
            }
            // Then K (3 HCP)
            else if (remainingHcp >= 3) {
                hand[suit][0] = 'K';
                remainingHcp -= 3;
            }
            // Then Q (2 HCP)
            else if (remainingHcp >= 2) {
                hand[suit][0] = 'Q';
                remainingHcp -= 2;
            }
            // Finally J (1 HCP)
            else if (remainingHcp >= 1) {
                hand[suit][0] = 'J';
                remainingHcp -= 1;
            }
        }
        i++;
    }

    return makeHandFromPattern(
        hand.S.join(''),
        hand.H.join(''),
        hand.D.join(''),
        hand.C.join('')
    );
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        makeHandFromRanks,
        makeHandFromPattern,
        makeTestHand
    };
}
