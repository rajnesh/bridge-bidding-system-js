/**
 * Comprehensive bidding tests.
 * Port of test_comprehensive.py from Python version.
 */

const { makeHandFromPattern } = require('./test-helpers');
const { SAYCBiddingSystem } = require('../js/sayc-system');
const { Bid, Auction } = require('../js/bridge-types');

describe('Comprehensive SAYC Tests', () => {
    let system;

    beforeEach(() => {
        system = new SAYCBiddingSystem();
    });

    test('Rule of 20', () => {
        const hands = [
            // Should open (11 HCP + 5 + 4 = 20)
            [makeHandFromPattern('AKQ32', 'J432', '32', '32'), true],
            // Should not open (11 HCP + 4 + 3 = 18)
            [makeHandFromPattern('AKQ2', 'J32', '432', '432'), false],
            // Should open balanced (12 HCP + 4 + 4 = 20)
            [makeHandFromPattern('AKQ2', 'KJ32', '432', '32'), true]
        ];

        for (const [hand, shouldOpen] of hands) {
            const bid = system._getOpeningBid(hand);
            expect(!!bid).toBe(shouldOpen);
        }
    });

    test('Six HCP overcalls', () => {
        system.startAuction('N');
        system.currentAuction.add(new Bid('1C'));

        const hands = [
            // 6 HCP, 5-card suit - should overcall
            [makeHandFromPattern('KQ432', '432', '432', '32'), true],
            // 5 HCP, 5-card suit - should not overcall
            [makeHandFromPattern('KJ432', '432', '432', '32'), false],
            // 6 HCP, 4-card suit - should not overcall
            [makeHandFromPattern('KQ32', '432', '4332', '32'), false]
        ];

        for (const [hand, shouldOvercall] of hands) {
            const bid = system.getBid(hand);
            expect(!!(bid && bid.token)).toBe(shouldOvercall);
        }
    });

    test('Relaxed takeout doubles', () => {
        system.startAuction('N');
        system.currentAuction.add(new Bid('1H'));

        const hands = [
            // Classic takeout double (4-4-3-2)
            [makeHandFromPattern('AKQ2', '2', 'KJ32', 'Q432'), 'X'],
            // Relaxed shape with two 3-card suits (3-3-3-4)
            [makeHandFromPattern('AK2', '2', 'KJ2', 'QJ432'), 'X'],
            // Minimum with two 2-card suits (2-2-4-5)
            [makeHandFromPattern('K2', '2', 'AKJ2', 'QJ432'), 'X'],
            // Too weak for relaxed double
            [makeHandFromPattern('Q2', '2', 'KJ32', 'J4332'), null]
        ];

        for (const [hand, expected] of hands) {
            const bid = system.getBid(hand);
            if (expected === 'X') {
                expect(bid.isDouble).toBe(true);
            } else {
                expect(bid.isDouble || false).toBe(false);
            }
        }
    });

    test('Jacoby 2NT', () => {
        system.startAuction('N');
        system.currentAuction.add(new Bid('1S'));

        system.conventions.config.responses = system.conventions.config.responses || {};
        system.conventions.config.responses.jacoby_2nt = { enabled: true };

        const hands = [
            // Perfect Jacoby 2NT (4 spades, 13 HCP)
            [makeHandFromPattern('KQ32', 'AK32', 'Q32', '32'), '2NT'],
            // Too weak for Jacoby 2NT
            [makeHandFromPattern('KQ32', 'K432', 'Q32', '32'), null],
            // Not enough trump support
            [makeHandFromPattern('K32', 'AKQ2', 'QJ2', '432'), null]
        ];

        for (const [hand, expected] of hands) {
            const bid = system.getBid(hand);
            expect(bid.token).toBe(expected);
        }
    });

    test('Gerber responses', () => {
        system.conventions.config.ace_asking = system.conventions.config.ace_asking || {};
        system.conventions.config.ace_asking.gerber = { enabled: true };

        system.startAuction('N');
        system.currentAuction.add(new Bid('1NT'));
        system.currentAuction.add(new Bid(null)); // Pass
        system.currentAuction.add(new Bid('4C')); // Gerber

        const hands = [
            // 0 aces -> 4D
            [makeHandFromPattern('KQ32', 'KQ32', 'Q32', 'K2'), '4D'],
            // 1 ace -> 4H
            [makeHandFromPattern('A432', 'K432', 'Q32', 'K2'), '4H'],
            // 2 aces -> 4S
            [makeHandFromPattern('A432', 'A432', 'Q32', 'K2'), '4S'],
            // 3 aces -> 4NT
            [makeHandFromPattern('A432', 'A432', 'A32', 'K2'), '4NT'],
            // 4 aces -> 4D
            [makeHandFromPattern('A432', 'A432', 'A32', 'A2'), '4D']
        ];

        for (const [hand, expected] of hands) {
            const askingBid = system.currentAuction.bids[system.currentAuction.bids.length - 1];
            const result = system.conventions.isAceAskingBid(system.currentAuction, askingBid);
            expect(result.isAceAsking).toBe(true);
            expect(result.convention).toBe('gerber');
            
            const response = system.conventions.getAceAskingResponse(result.convention, hand);
            expect(response).toBe(expected);
        }
    });

    test('Balanced hands', () => {
        const hands = [
            // 4-3-3-3 is balanced
            [makeHandFromPattern('AKQ2', 'K32', 'Q32', '432'), true],
            // 4-4-3-2 is balanced
            [makeHandFromPattern('AKQ2', 'KJ32', 'Q32', '32'), true],
            // 5-3-3-2 is balanced
            [makeHandFromPattern('AKQ32', 'K32', 'Q32', '32'), true],
            // 5-4-2-2 is not balanced
            [makeHandFromPattern('AKQ32', 'KJ32', '32', '32'), false],
            // 6-3-2-2 is not balanced
            [makeHandFromPattern('AKQ432', 'K32', '32', '32'), false]
        ];

        for (const [hand, isBalanced] of hands) {
            expect(system._isBalanced(hand)).toBe(isBalanced);
        }
    });

    test('Meckwell defenses', () => {
        // Disable DONT and enable only Meckwell
        system.conventions.config.notrump_defenses = system.conventions.config.notrump_defenses || {};
        system.conventions.config.notrump_defenses.dont = { enabled: false };
        system.conventions.config.notrump_defenses.meckwell = { enabled: true };
        system.conventions.config.strong_club_defenses = system.conventions.config.strong_club_defenses || {};
        system.conventions.config.strong_club_defenses.meckwell = { enabled: true, direct_only: true };

        system.startAuction('N');
        system.currentAuction.add(new Bid('1NT'));

        const hands = [
            // Single-suited hand -> 2C
            [makeHandFromPattern('AKQ432', '32', '432', '32'), '2C'],
            // Both majors -> 2D
            [makeHandFromPattern('KQJ2', 'KQJ2', '432', '32'), '2D'],
            // Major + minor -> 2M
            [makeHandFromPattern('KQJ32', '32', 'KQJ32', '32'), '2S']
        ];

        for (const [hand, expected] of hands) {
            const bid = system.getBid(hand);
            expect(bid.token).toBe(expected);
        }
    });

    test('Lebensohl sequences', () => {
        system.conventions.config.notrump_defenses = system.conventions.config.notrump_defenses || {};
        system.conventions.config.notrump_defenses.lebensohl = {
            enabled: true,
            after_interference: true,
            fast_denies: true
        };

        system.startAuction('N');
        system.currentAuction.add(new Bid('1NT'));
        system.currentAuction.add(new Bid(null)); // Pass
        system.currentAuction.add(new Bid('2H')); // Interference

        const hands = [
            // Fast denial with stopper
            [makeHandFromPattern('AK32', 'KQ2', 'QJ32', '32'), '3NT'],
            // Slow sequence with weak hand
            [makeHandFromPattern('32', '32', 'QJ9432', '432'), '2NT'],
            // Game force without stopper
            [makeHandFromPattern('AKQ2', '2', 'KQJ32', '432'), '3H']
        ];

        for (const [hand, expected] of hands) {
            const bid = system.getBid(hand);
            expect(bid.token).toBe(expected);
        }
    });

    test('Support doubles', () => {
        system.conventions.config.competitive = system.conventions.config.competitive || {};
        system.conventions.config.competitive.support_doubles = { enabled: true, thru: '2S' };

        system.startAuction('N');
        system.currentAuction.add(new Bid('1D')); // We open
        system.currentAuction.add(new Bid('1S')); // They overcall
        system.currentAuction.add(new Bid('1H')); // Partner bids hearts

        const hands = [
            // Perfect support double
            [makeHandFromPattern('32', 'KQ2', 'AKJ32', '432'), true],
            // Four-card support -> natural raise
            [makeHandFromPattern('32', 'KQJ2', 'AKJ32', '32'), false],
            // Two-card support -> no double
            [makeHandFromPattern('432', '32', 'AKJ32', 'KQ2'), false]
        ];

        for (const [hand, shouldDouble] of hands) {
            const bid = system.getBid(hand);
            expect(bid.isDouble || false).toBe(shouldDouble);
        }
    });
});
