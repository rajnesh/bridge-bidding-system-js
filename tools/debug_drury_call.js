const { makeHandFromPattern } = require('../tests/test-helpers');
const { SAYCBiddingSystem } = require('../js/combined-bidding-system');
const { Bid } = require('../js/bridge-types');

const system = new SAYCBiddingSystem();
system.startAuction('N');
system.currentAuction.ourSeat = 'S';
// Build the auction according to the test
system.currentAuction.add(new Bid(null, { seat: 'N' }));
system.currentAuction.add(new Bid(null, { seat: 'E' }));
system.currentAuction.add(new Bid('1H', { seat: 'S' }));
system.currentAuction.add(new Bid(null, { seat: 'W' }));
system.currentAuction.add(new Bid('2C', { seat: 'N' }));
system.currentAuction.add(new Bid(null, { seat: 'E' }));

const hand = makeHandFromPattern('KQ72', 'QJ972', '82', 'Q2');
console.log('Auction tokens:', system.currentAuction.bids.map(b => b?.token || (b?.isDouble?'X':'PASS')));
const dr = system._handleDruryOpenerRebid(system.currentAuction, hand);
console.log('Drury result:', dr && (dr.token || (dr.isDouble? 'X': '')), dr && dr.conventionUsed);
const bid = system.getBid(hand);
console.log('getBid returned:', bid && (bid.token || (bid.isDouble? 'X':'')), bid && bid.conventionUsed);
