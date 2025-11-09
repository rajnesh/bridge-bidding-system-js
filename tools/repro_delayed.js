const { SAYCBiddingSystem } = require('../js/combined-bidding-system');
const { Bid, Auction } = require('../js/bridge-types');
const helpers = require('../tests/test-helpers');

const system = new SAYCBiddingSystem();
system.startAuction('E', false, true);
system.currentAuction = new Auction([], { dealer: 'N', ourSeat: 'N' });
system.currentAuction.reseat('S');
system.currentAuction.add(new Bid('1H'));
system.currentAuction.add(new Bid(null));
system.currentAuction.add(new Bid('1NT'));

const east = helpers.makeTestHand(6,2,3,2,9);
east.distributionPoints = 2;

const bid = system.getBid(east);
console.log('Result bid:', bid && bid.token, 'conventionUsed=', bid && bid.conventionUsed);
