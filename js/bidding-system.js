/**
 * Bridge bidding system with SAYC and configurable conventions.
 */

// Constants
const SUITS = ['C', 'D', 'H', 'S'];

/**
 * Base bidding system implementing SAYC with configurable conventions.
 */
class BiddingSystem {
    constructor() {
        this.conventions = new ConventionCard();
        this.currentAuction = null;
        this.vulnerability = null;
        this.ourSeat = null; // 'N','E','S','W'
    }

    /**
     * Start a new auction.
     */
    startAuction(ourSeat, vulWe = false, vulThey = false) {
        this.ourSeat = ourSeat;
        this.currentAuction = new Auction([], { ourSeat });
        this.vulnerability = new VulnerabilityState(vulWe, vulThey);
    }

    /**
     * Start a new auction with both our seat and the dealer specified.
     * Seats will be assigned in strict rotation from the dealer for all bids.
     */
    startAuctionWithDealer(ourSeat, dealer, vulWe = false, vulThey = false) {
        this.ourSeat = ourSeat;
        this.currentAuction = new Auction([], { ourSeat, dealer });
        this.vulnerability = new VulnerabilityState(vulWe, vulThey);
    }

    /**
     * Check if this is an opening bid.
     */
    _isOpeningBid() {
        return this.currentAuction.bids.length === 0;
    }

    /**
     * Get appropriate opening bid for the hand.
     */
    _getOpeningBid(hand) {
        const totalPoints = hand.hcp + hand.distributionPoints;

        // 2C Strong opening
        if (hand.hcp >= 22) {
            return new Bid('2C');
        }

        // 1NT opening
        const balanced = Object.values(hand.lengths).every(length => length <= 5);
        if (balanced && hand.hcp >= 15 && hand.hcp <= 17) {
            return new Bid('1NT');
        }

        // Natural suit opening
        if (totalPoints >= 12) {
            // Find longest suit
            const suits = [...SUITS].sort((a, b) => {
                if (hand.lengths[b] !== hand.lengths[a]) {
                    return hand.lengths[b] - hand.lengths[a];
                }
                return a.localeCompare(b);
            });
            
            if (hand.lengths[suits[0]] >= 5) {
                return new Bid(`1${suits[0]}`);
            }

            // Open 1 of shorter minor with 4-4-3-2 or 4-3-3-3
            if (hand.lengths['C'] >= 3) {
                return new Bid('1C');
            }
            return new Bid('1D');
        }

        return null;
    }

    /**
     * Handle opponent's interference.
     */
    _handleInterference(auction, hand) {
        const lastBid = auction.bids[auction.bids.length - 1];

        // Check for opponents' 1NT opening
        if (auction.bids.length === 1 &&
            lastBid.token === '1NT' &&
            this.conventions.isEnabled('dont', 'notrump_defenses')) {
            
            // DONT convention
            for (const suit of SUITS) {
                if (hand.lengths[suit] >= 6) {
                    return new Bid(`2${suit}`); // Natural
                }
            }
            
            // Find two longest suits for two-suited hands
            const suits = [...SUITS].sort((a, b) => {
                if (hand.lengths[b] !== hand.lengths[a]) {
                    return hand.lengths[b] - hand.lengths[a];
                }
                return a.localeCompare(b);
            });
            
            if (hand.lengths[suits[0]] >= 5 && hand.lengths[suits[1]] >= 4) {
                return new Bid('2C'); // Shows clubs and another suit
            }
        }

        return null;
    }

    /**
     * Handle ace-asking bids.
     */
    _handleAceAsking(auction, hand) {
        if (!auction.bids || auction.bids.length === 0) {
            return null;
        }

        const lastBid = auction.bids[auction.bids.length - 1];
        const { isAceAsking, convention } = this.conventions.isAceAskingBid(auction, lastBid);

        if (isAceAsking) {
            const response = this.conventions.getAceAskingResponse(convention, hand);
            return response ? new Bid(response) : null;
        }

        return null;
    }

    /**
     * Get the next bid for the given hand.
     */
    getBid(hand) {
        if (!this.currentAuction) {
            throw new Error('Auction not started');
        }

        // Opening bid
        if (this._isOpeningBid()) {
            const bid = this._getOpeningBid(hand);
            return bid || new Bid(null); // Pass if no suitable opening
        }

        // Handle opponent's last bid
        if (this.currentAuction.bids.length % 2 === 1) { // Opponent's bid
            const interferenceBid = this._handleInterference(this.currentAuction, hand);
            if (interferenceBid) {
                return interferenceBid;
            }
        }

        // Check for ace-asking sequences
        const aceAskingResponse = this._handleAceAsking(this.currentAuction, hand);
        if (aceAskingResponse) {
            return aceAskingResponse;
        }

        // Default to pass if no other action found
        return new Bid(null);
    }
}

// Browser global exports
if (typeof window !== 'undefined') {
    window.BiddingSystem = BiddingSystem;
}
