/**
 * Bridge bidding conventions manager and utility functions.
 */

// Node.js requires
if (typeof require !== 'undefined') {
    const fs = require('fs');
    const path = require('path');
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

/**
 * Manages bridge bidding conventions and their configuration.
 */
class ConventionCard {
    static SUITS = ['C', 'D', 'H', 'S']; // Suit ordering

    constructor(configPath = 'conventions.json') {
        this._lastAuction = null;
        
        // Load config synchronously for Node.js, async for browser
        if (typeof require !== 'undefined' && typeof configPath === 'string') {
            // Node.js environment
            try {
                const fs = require('fs');
                const path = require('path');
                const fullPath = path.resolve(__dirname, '..', configPath);
                const data = fs.readFileSync(fullPath, 'utf8');
                this.config = JSON.parse(data);
            } catch (error) {
                console.error('Error loading convention configuration:', error);
                this.config = this._getDefaultConfig();
            }
        } else if (typeof configPath === 'object') {
            // Config object passed directly
            this.config = configPath;
        } else {
            // Browser environment - use default config for now
            this.config = this._getDefaultConfig();
        }
    }

    /**
     * Get default configuration.
     */
    _getDefaultConfig() {
        return {
            ace_asking: {
                gerber: {
                    enabled: true,
                    continuations: true,
                    responses_map: ['4D', '4H', '4S', '4NT']
                },
                blackwood: {
                    enabled: true,
                    variant: 'rkcb',
                    responses: '1430'
                }
            },
            notrump_defenses: {
                dont: { enabled: true, style: 'standard' },
                unusual_nt: { enabled: true, direct: true, passed_hand: false },
                lebensohl: { enabled: true, after_interference: true, fast_denies: true }
            },
            responses: {
                jacoby_2nt: { enabled: true }
            },
            competitive: {
                michaels: { enabled: true, strength: 'wide_range', direct_only: true },
                responsive_doubles: { enabled: true, thru_level: 3, min_strength: 8 },
                negative_doubles: { enabled: true, thru_level: 3 },
                maximal_doubles: { enabled: true },
                support_doubles: { enabled: true, thru: '2S' },
                cue_bid_raises: { enabled: true },
                reopening_doubles: { enabled: true }
            },
            strong_club_defenses: {
                meckwell: { enabled: true, style: 'standard' }
            },
            preempts: {
                weak_two: { enabled: true }
            },
            general: {
                vulnerability_adjustments: true,
                passed_hand_variations: true,
                balance_of_power: true
            }
        };
    }

    /**
     * Load convention configuration (async for browser).
     */
    async loadConfig(configPath = 'conventions.json') {
        try {
            const response = await fetch(configPath);
            this.config = await response.json();
            return this.config;
        } catch (error) {
            console.error('Error loading convention configuration:', error);
            this.config = this._getDefaultConfig();
            return this.config;
        }
    }

    /**
     * Check if a specific convention is enabled.
     */
    isEnabled(convention, category = null) {
        try {
            if (category) {
                return this.config[category][convention].enabled;
            }
            // Search all categories if not specified
            for (const cat in this.config) {
                if (typeof this.config[cat] === 'object' && convention in this.config[cat]) {
                    return this.config[cat][convention].enabled;
                }
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    /**
     * Find the agreed trump suit from the auction context.
     */
    _findTrumpSuit(auction) {
        if (!auction.bids || auction.bids.length === 0) {
            return null;
        }

        const suitBids = [];
        let lastSuitBid = null;
        
        for (const bid of auction.bids) {
            if (!bid.token) continue; // Skip passes
            if (['S', 'H', 'D', 'C'].includes(bid.token.slice(-1))) {
                suitBids.push(bid);
                lastSuitBid = bid;
            }
        }

        // No suit bids found
        if (!lastSuitBid) return null;

        // Look for explicit suit agreement
        if (suitBids.length >= 2) {
            const lastSuit = lastSuitBid.token.slice(-1);
            
            // Consider it agreed if:
            // 1. The suit has been bid before
            for (let i = 0; i < suitBids.length - 1; i++) {
                if (suitBids[i].token.slice(-1) === lastSuit) {
                    return lastSuit;
                }
            }
            
            // 2. Last bid is jump to game in a major
            if (lastSuitBid.token.length === 2 &&
                lastSuitBid.token[0] === '4' &&
                ['S', 'H'].includes(lastSuit)) {
                return lastSuit;
            }
        }

        return null;
    }

    /**
     * Count key cards (4 aces + trump king) and queen for RKCB.
     * Returns {keycards, hasQueen}
     */
    _countRkcbKeycards(hand, trumpSuit) {
        // Count aces
        let keycards = 0;
        ['S', 'H', 'D', 'C'].forEach(suit => {
            hand.suitBuckets[suit].forEach(card => {
                if (card.rank === 'A') keycards++;
            });
        });

        // Add trump king if present
        if (hand.suitBuckets[trumpSuit].some(card => card.rank === 'K')) {
            keycards++;
        }

        // Check for trump queen
        const hasQueen = hand.suitBuckets[trumpSuit].some(card => card.rank === 'Q');

        return { keycards, hasQueen };
    }

    /**
     * Get a specific setting for a convention.
     */
    getConventionSetting(convention, setting, category = null) {
        try {
            if (category) {
                return this.config[category][convention][setting];
            }
            // Search all categories
            for (const cat in this.config) {
                if (typeof this.config[cat] === 'object' && convention in this.config[cat]) {
                    return this.config[cat][convention][setting];
                }
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Determine if a bid is an ace-asking bid and which convention applies.
     * Returns {isAceAsking, convention}
     */
    isAceAskingBid(auction, bid) {
        // Store auction context for response generation
        this._lastAuction = auction;

        if (!bid.token) {
            return { isAceAsking: false, convention: '' };
        }

        // Check for Gerber
        if (this.isEnabled('gerber', 'ace_asking') &&
            bid.token === '4C' &&
            auction.bids.some(b => b.token && b.token.includes('NT'))) {
            return { isAceAsking: true, convention: 'gerber' };
        }

        // Check for Blackwood/RKCB
        if (bid.token === '4NT') {
            if (!this.isEnabled('blackwood', 'ace_asking')) {
                return { isAceAsking: false, convention: '' };
            }

            // Look for the last contract before this asking bid
            let lastContract = null;
            const bidsToScan = (auction.bids.length > 0 && auction.bids[auction.bids.length - 1] === bid)
                ? auction.bids.slice(0, -1)
                : auction.bids;
            
            for (let i = bidsToScan.length - 1; i >= 0; i--) {
                const prevBid = bidsToScan[i];
                if (prevBid.token && !prevBid.isDouble && !prevBid.isRedouble) {
                    lastContract = prevBid.token;
                    break;
                }
            }

            if (!lastContract) {
                return { isAceAsking: false, convention: '' };
            }

            if (lastContract.slice(-2) === 'NT') {
                return { isAceAsking: false, convention: '' };
            }

            const variant = this.getConventionSetting('blackwood', 'variant', 'ace_asking');

            // For RKCB, verify we have a trump suit established; if not, fall back to classic Blackwood
            if (variant === 'rkcb') {
                const trumpSuit = this._findTrumpSuit(auction);
                if (!trumpSuit) {
                    return { isAceAsking: true, convention: 'blackwood_classic' };
                }
                return { isAceAsking: true, convention: 'blackwood_rkcb' };
            }
            return { isAceAsking: true, convention: `blackwood_${variant}` };
        }

        return { isAceAsking: false, convention: '' };
    }

    /**
     * Generate response to ace-asking bid based on convention.
     */
    getAceAskingResponse(convention, hand) {
        if (convention === 'gerber') {
            const responsesMap = this.getConventionSetting('gerber', 'responses_map', 'ace_asking');

            let aceCount = 0;
            ['S', 'H', 'D', 'C'].forEach(suit => {
                hand.suitBuckets[suit].forEach(card => {
                    if (card.rank === 'A') aceCount++;
                });
            });

            // If a responses_map is configured and valid, use it
            if (Array.isArray(responsesMap) && responsesMap.length >= 4) {
                const idx = aceCount < 4 ? aceCount : 0;
                return responsesMap[idx];
            }

            // Default (standard) Gerber mapping fallback
            if (aceCount === 0 || aceCount === 4) return '4D';
            if (aceCount === 1) return '4H';
            if (aceCount === 2) return '4S';
            if (aceCount === 3) return '4NT';
            return '4D';

        } else if (convention.startsWith('blackwood')) {
            const responses = this.getConventionSetting('blackwood', 'responses', 'ace_asking');
            
            if (convention === 'blackwood_rkcb') {
                const trumpSuit = this._findTrumpSuit(this._lastAuction);
                if (!trumpSuit) return null;

                const { keycards, hasQueen } = this._countRkcbKeycards(hand, trumpSuit);

                // Roman Keycard responses:
                // 1430: 5♣=1/4, 5♦=3/0, 5♥=2 no Q, 5♠=2+Q, 5NT=odd+Q
                // 3014: 5♣=3/0, 5♦=1/4, 5♥=2 no Q, 5♠=2+Q, 5NT=odd+Q
                if (responses === '1430') {
                    if ([1, 4].includes(keycards)) return '5C';
                    if ([3, 0].includes(keycards)) return '5D';
                    if (keycards === 2) return hasQueen ? '5S' : '5H';
                    return '5NT';
                } else { // 3014 responses
                    if ([3, 0].includes(keycards)) return '5C';
                    if ([1, 4].includes(keycards)) return '5D';
                    if (keycards === 2) return hasQueen ? '5S' : '5H';
                    return '5NT';
                }
            } else if (convention === 'blackwood_classic') {
                let aceCount = 0;
                ['S', 'H', 'D', 'C'].forEach(suit => {
                    hand.suitBuckets[suit].forEach(card => {
                        if (card.rank === 'A') aceCount++;
                    });
                });

                if (aceCount === 0 || aceCount === 4) return '5C';
                if (aceCount === 1) return '5D';
                if (aceCount === 2) return '5H';
                if (aceCount === 3) return '5S';
                return '5C';
            }
        }

        return null;
    }

    /**
     * Determine if a bid shows two suits and which suits are shown.
     * Returns {isTwoSuited, convention, suits}
     */
    isTwoSuitedOvercall(auction, bid, hand = null) {
        if (!bid.token) {
            return { isTwoSuited: false, convention: '', suits: [] };
        }

        // Check for Michaels Cue-bid
        if (this.isEnabled('michaels', 'competitive')) {
            const style = this.getConventionSetting('michaels', 'strength', 'competitive');
            const directOnly = this.getConventionSetting('michaels', 'direct_only', 'competitive');

            // Skip if not direct seat and direct_only is True
            if (directOnly && auction.bids.length > 1) {
                return { isTwoSuited: false, convention: '', suits: [] };
            }

            const lastContract = auction.lastContract();
            if (bid.token[0] === '2' &&
                lastContract &&
                lastContract[0] === '1' &&
                bid.token[1] === lastContract[1]) {
                
                // Validate hand shape if provided
                if (hand) {
                    const minHcp = style === 'wide_range' ? 6 : 10;
                    if (hand.hcp < minHcp) {
                        return { isTwoSuited: false, convention: '', suits: [] };
                    }

                    // Need 5-5 or better for Michaels
                    const sortedLengths = ConventionCard.SUITS
                        .map(s => ({ suit: s, length: hand.lengths[s] }))
                        .sort((a, b) => b.length - a.length || a.suit.localeCompare(b.suit));
                    
                    if (sortedLengths[0].length < 5 || sortedLengths[1].length < 5) {
                        return { isTwoSuited: false, convention: '', suits: [] };
                    }
                }

                if (['C', 'D'].includes(lastContract[1])) {
                    return { isTwoSuited: true, convention: 'michaels', suits: ['H', 'S'] };
                } else { // Major suit opening
                    const otherMajor = lastContract[1] === 'S' ? 'H' : 'S';
                    return { isTwoSuited: true, convention: 'michaels', suits: [otherMajor, 'C'] };
                }
            }
        }

        // Check for Unusual NT
        if (this.isEnabled('unusual_nt', 'notrump_defenses')) {
            const lastContract = auction.lastContract();
            if (bid.token === '2NT' && lastContract && lastContract[0] === '1') {
                return { isTwoSuited: true, convention: 'unusual_nt', suits: ['C', 'D'] };
            }
        }

        return { isTwoSuited: false, convention: '', suits: [] };
    }

    /**
     * Adjust HCP requirements based on vulnerability.
     * Returns {minAdjust, maxAdjust}
     */
    adjustForVulnerability(bidType, vul) {
        if (!this.config.general.vulnerability_adjustments) {
            return { minAdjust: 0, maxAdjust: 0 };
        }

        const adjustments = {
            'overcall': { fav: -1, unfav: 1 },
            'preempt': { fav: -2, unfav: 2 },
            'weak_two': { fav: -1, unfav: 4 }  // Very conservative when vulnerable
        };

        if (!(bidType in adjustments)) {
            return { minAdjust: 0, maxAdjust: 0 };
        }

        const weVul = vul.we;
        const theyVul = vul.they;

        if (weVul && !theyVul) {  // Unfavorable
            return { minAdjust: adjustments[bidType].unfav, maxAdjust: 0 };
        } else if (!weVul && theyVul) {  // Favorable
            return { minAdjust: adjustments[bidType].fav, maxAdjust: 0 };
        }
        return { minAdjust: 0, maxAdjust: 0 };  // Equal vulnerability
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VulnerabilityState, ConventionCard };
}
