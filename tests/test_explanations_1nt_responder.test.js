const { SAYCBiddingSystem } = require('../js/combined-bidding-system');
const { Bid } = require('../js/bridge-types');
const { makeHandFromPattern } = require('./test-helpers');

// Explanation for 2NT over 1NT should be invitational 8–9 HCP, balanced, no 4-card major

describe('Explanations: responder over 1NT opening', () => {
  test('2NT over 1NT shows invitational balanced 8–9, no 4-card major', () => {
    const system = new SAYCBiddingSystem();
    system.startAuction('N');
    system.currentAuction.add(new Bid('1NT'));

    // Balanced 4-3-3-3, 8 HCP, no 4-card major
    const hand = makeHandFromPattern('KQ2', 'Q32', 'J32', '4322');

    const bid = system.getBid(hand);
    expect(bid && bid.token).toBe('2NT');

    const explanation = system.getExplanationFor(bid);
    expect(explanation).toBe('2NT over 1NT: invitational 8–9 HCP, balanced, no 4-card major');
  });
});
