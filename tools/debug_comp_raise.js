const { Hand, Bid, Auction } = require('../js/bridge-types');
const { SAYCBiddingSystem } = require('../js/combined-bidding-system');
const { makeTestHand } = require('../tests/test-helpers');

const system = new SAYCBiddingSystem();
system.startAuction('N');
const a = new Auction([], { dealer: 'S', ourSeat: 'N' });
a.add(new Bid('1C'));
a.add(new Bid('2D'));
system.currentAuction = a;
const hand = makeTestHand(3,3,4,3,8);
const bid = system.getBid(hand);
console.log('Comp raise bid:', bid);
