const { makeHandFromPattern } = require('./test-helpers');
const { SAYCBiddingSystem } = require('../js/combined-bidding-system');
const { Bid, Auction } = require('../js/bridge-types');

/**
 * 1NT overcall tests (SAYC style used by this engine):
 * - Balanced 15–18 opposite a 1-level suit opening -> 1NT overcall.
 */

describe('1NT overcall over 1-level suit opening', () => {
  let system;

  beforeEach(() => {
    system = new SAYCBiddingSystem();
    system.startAuction('N');
  });

  test('Balanced 16 HCP over 1H -> 1NT overcall', () => {
    system.currentAuction = new Auction();
    system.currentAuction.add(new Bid('1H'));
    // Ensure opener is an opponent (East) for proper interference context
    system.currentAuction.reseat('E');

    // 16 HCP balanced 4-3-3-3
    const hand = makeHandFromPattern('KQ2', 'QJ2', 'KQ2', 'QJ2');
    const bid = system.getBid(hand);
    expect(bid && bid.token).toBe('1NT');
  });

  test('Balanced 18 HCP over 1S -> 1NT overcall', () => {
    system.currentAuction = new Auction();
    system.currentAuction.add(new Bid('1S'));
    system.currentAuction.reseat('E');

    const hand = makeHandFromPattern('AK2', 'QJ2', 'KQ2', 'QJ2'); // 18 HCP balanced
    const bid = system.getBid(hand);
    expect(bid && bid.token).toBe('1NT');
  });
});
