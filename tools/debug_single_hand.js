const { makeHandFromPattern } = require('../tests/test-helpers');
const { SAYCBiddingSystem } = require('../js/combined-bidding-system');
const { Bid, Auction } = require('../js/bridge-types');

const system = new SAYCBiddingSystem();
system.startAuction('N');
system.currentAuction.add(new Bid('1H'));

const hand = makeHandFromPattern('Q2', '2', 'KJ32', 'J4332');
console.log('Hand hcp, lengths:', hand.hcp, hand.lengths);
const bid = system.getBid(hand);
console.log('Bid returned:', bid && (bid.token || (bid.isDouble? 'X':'?')) , 'conventionUsed=', bid && bid.conventionUsed);
