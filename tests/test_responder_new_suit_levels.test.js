const { makeHandFromPattern } = require('./test-helpers');
const { SAYCBiddingSystem } = require('../js/combined-bidding-system');
const { Bid, Auction } = require('../js/bridge-types');

/**
 * Responder new suit at 1-level requires 6+ points; at 2-level requires 13+ HCP.
 */

describe('Responder new-suit levels over 1-level openings', () => {
  let system;

  beforeEach(() => {
    system = new SAYCBiddingSystem();
    system.startAuction('N');
  });

  test('10+ HCP over 1C with 4 hearts -> 1H response', () => {
    system.currentAuction = new Auction();
    system.currentAuction.add(new Bid('1C'));
    const hand = makeHandFromPattern('Q32', 'KQJ2', 'Q2', '32'); // 11 HCP, 4H
    const bid = system.getBid(hand);
    expect(bid && bid.token).toBe('1H');
  });

  test('6 HCP over 1C with 4 hearts -> 1H response', () => {
    // Seat-aware: West opens 1C, we are East (responder)
    system.currentAuction = new Auction([], { dealer: 'W', ourSeat: 'E' });
    system.currentAuction.add(new Bid('1C', { seat: 'W' }));
    const hand = makeHandFromPattern('Q32', 'KJ42', '762', '983'); // 6 HCP, 4H
    const bid = system.getBid(hand);
    expect(bid && bid.token).toBe('1H');
  });

  test('13 HCP over 1H with 5 diamonds -> 2D response at 2-level', () => {
    system.currentAuction = new Auction();
    system.currentAuction.add(new Bid('1H'));
    // Avoid relaxed takeout double preference so we exercise natural new-suit response
    system.conventions.config.general.relaxed_takeout_doubles = false;
    const hand = makeHandFromPattern('Q2', 'Q2', 'AKQJ2', '32'); // 13 HCP, 5D
    const bid = system.getBid(hand);
    expect(bid && bid.token).toBe('2D');
  });

  test('10 HCP over 1S with 5 diamonds -> no 2D (too weak)', () => {
    system.currentAuction = new Auction();
    system.currentAuction.add(new Bid('1S'));
    const hand = makeHandFromPattern('Q2', 'Q2', 'KQJ32', '32'); // 10 HCP, 5D
    const bid = system.getBid(hand);
    // Engine returns null (pass) or something other than 2D
    expect(!bid || bid.token !== '2D' || bid.isDouble).toBe(true);
  });
});
