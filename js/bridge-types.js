/**
 * Type definitions for bridge bidding system.
 */

/**
 * High-card points mapping
 */
const POINTS = { 'J': 1, 'Q': 2, 'K': 3, 'A': 4 };

/**
 * Represents a playing card.
 */
class Card {
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }
}

/**
 * Represents a bridge hand.
 */
class Hand {
    constructor(suitBuckets) {
        if (typeof suitBuckets === 'string') {
            // Parse PBN-style hand string like "AKQ2 J432 32 32"
            const parts = suitBuckets.trim().split(/\s+/);
            if (parts.length !== 4) {
                throw new Error('Invalid hand string format. Expected 4 space-separated suit strings.');
            }
            const suits = ['S', 'H', 'D', 'C'];
            this.suitBuckets = {};
            suits.forEach((suit, index) => {
                this.suitBuckets[suit] = Array.from(parts[index]).map(rank => new Card(rank, suit));
            });
        } else {
            this.suitBuckets = suitBuckets;
        }

        // Calculate lengths
        this.lengths = {};
        Object.keys(this.suitBuckets).forEach(suit => {
            this.lengths[suit] = this.suitBuckets[suit].length;
        });

        // Calculate HCP
        this.hcp = 0;
        Object.values(this.suitBuckets).forEach(cards => {
            cards.forEach(card => {
                this.hcp += POINTS[card.rank] || 0;
            });
        });

        // Distribution points: void=3, singleton=2, doubleton=1
        this.distributionPoints = 0;
        Object.values(this.lengths).forEach(length => {
            if (length === 0) this.distributionPoints += 3;
            else if (length === 1) this.distributionPoints += 2;
            else if (length === 2) this.distributionPoints += 1;
        });
    }
}

/**
 * Represents a bridge bid.
 */
class Bid {
    constructor(token, options = {}) {
        this.token = token; // null for Pass
        this.isDouble = options.isDouble || false;
        this.isRedouble = options.isRedouble || false;
        this.conventionUsed = options.conventionUsed || null;
        this.seat = options.seat || null; // 'N','E','S','W'
    }
}

/**
 * Represents a bridge auction with optional seat/position tracking.
 */
class Auction {
    static TURN_ORDER = ['N', 'E', 'S', 'W'];

    constructor(bids = [], options = {}) {
        this.bids = bids;
        this.ourSeat = options.ourSeat || null;
        this.dealer = options.dealer || null;

        // If dealer is known, assign seats to existing bids in order
        if (this.dealer && this.bids.length > 0) {
            const startIdx = Auction.TURN_ORDER.indexOf(this.dealer);
            this.bids.forEach((bid, i) => {
                if (bid.seat === null) {
                    bid.seat = Auction.TURN_ORDER[(startIdx + i) % 4];
                }
            });
        }
    }

    /**
     * Returns the last contract bid in the auction.
     */
    lastContract() {
        for (let i = this.bids.length - 1; i >= 0; i--) {
            const bid = this.bids[i];
            if (bid.token && !bid.isDouble && !bid.isRedouble) {
                return bid.token;
            }
        }
        return null;
    }

    /**
     * Check if the auction is closed (3 consecutive passes or 4 passes total).
     */
    isClosed() {
        if (this.bids.length < 3) return false;
        
        // Check for three consecutive passes
        const lastThree = this.bids.slice(-3);
        if (lastThree.length === 3 && lastThree.every(bid => bid.token === null)) {
            return true;
        }
        
        // Check for four passes from start
        if (this.bids.length === 4 && this.bids.every(bid => bid.token === null)) {
            return true;
        }
        
        return false;
    }

    /**
     * Add a bid to the auction, auto-assigning seat when possible.
     */
    add(bid) {
        if (bid.seat === null && this.dealer) {
            // If dealer is known, follow strict rotation
            const startIdx = Auction.TURN_ORDER.indexOf(this.dealer);
            const nextIdx = (startIdx + this.bids.length) % 4;
            bid.seat = Auction.TURN_ORDER[nextIdx];
        }
        this.bids.push(bid);
    }

    /**
     * Return the seat (N/E/S/W) of the last non-pass bid, if known.
     */
    lastBidderSeat() {
        for (let i = this.bids.length - 1; i >= 0; i--) {
            if (this.bids[i].token !== null) {
                return this.bids[i].seat;
            }
        }
        return null;
    }

    /**
     * Return 'we' if last bid was by our side, 'they' if by opponents, else null.
     */
    lastSide() {
        const seat = this.lastBidderSeat();
        if (!seat || !this.ourSeat) return null;
        
        // Our side seats are the same polarity (N/S) or (E/W)
        const us = ['N', 'S'].includes(this.ourSeat);
        const them = !us;
        const lastIsNS = ['N', 'S'].includes(seat);
        
        if (us && lastIsNS) return 'we';
        if (them && !lastIsNS) return 'they';
        
        // Opposite cases
        return us ? 'they' : 'we';
    }

    /**
     * Set dealer and assign seats to all existing bids in rotation.
     * This overwrites any previously assigned bid.seat values to ensure consistency.
     */
    reseat(dealer) {
        if (!Auction.TURN_ORDER.includes(dealer)) {
            throw new Error("Dealer must be one of 'N','E','S','W'");
        }
        this.dealer = dealer;
        const startIdx = Auction.TURN_ORDER.indexOf(this.dealer);
        this.bids.forEach((bid, i) => {
            bid.seat = Auction.TURN_ORDER[(startIdx + i) % 4];
        });
    }
}

/**
 * Represents vulnerability state for both sides.
 */
class VulnerabilityState {
    constructor(we = false, they = false) {
        this.we = we;
        this.they = they;
    }
}

// Browser global exports
if (typeof window !== 'undefined') {
    window.Card = Card;
    window.Hand = Hand;
    window.Bid = Bid;
    window.Auction = Auction;
    window.VulnerabilityState = VulnerabilityState;
    window.POINTS = POINTS;
}

// Node.js exports
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Card,
        Hand,
        Bid,
        Auction,
        VulnerabilityState,
        POINTS
    };
}
