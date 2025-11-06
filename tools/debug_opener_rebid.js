const { Hand, Bid, Auction } = require('../js/bridge-types');
const { SAYCBiddingSystem } = require('../js/combined-bidding-system');

function makeHandFromPattern(spades, hearts, diamonds, clubs) {
  function parseSuit(str, suit) {
    const arr = [];
    for (const ch of (str||'')) arr.push({ rank: ch.toUpperCase(), suit });
    return arr;
  }
  const buckets = {
    'S': parseSuit(spades, 'S'),
    'H': parseSuit(hearts, 'H'),
    'D': parseSuit(diamonds, 'D'),
    'C': parseSuit(clubs, 'C'),
  };
  return new Hand(buckets);
}

// Build auction: dealer S, ourSeat N, sequence: 1C, PASS, 1D, PASS
const system = new SAYCBiddingSystem();
const a = new Auction([], { dealer: 'S', ourSeat: 'N' });
a.add(new Bid('1C'));
a.add(new Bid(null));
a.add(new Bid('1D'));
a.add(new Bid(null));
system.currentAuction = a;

// North opener hand ~13 HCP balanced
const hand = makeHandFromPattern('KQ2','QJ2','K32','Q32');
const bid = system.getBid(hand);
console.log('Bid:', bid);
console.log('Token:', bid && bid.token, 'isDouble:', bid && bid.isDouble, 'isRedouble:', bid && bid.isRedouble, 'conv:', bid && bid.conventionUsed);

// Inspect seats and tokens
const bids = a.bids;
console.log('Auction tokens/seats:', bids.map(b=>({t:b.token, s:b.seat})));

// Try to replicate opener 1NT rebid detection
let ourOpeningIdx = -1;
for (let i = 0; i < bids.length; i++) {
  const b = bids[i];
  if (b && b.token && /^1[CDHS]$/.test(b.token)) {
    // Same side as ourSeat?
    const sameSide = (['N','S'].includes(b.seat) && ['N','S'].includes(a.ourSeat)) || (['E','W'].includes(b.seat) && ['E','W'].includes(a.ourSeat));
    if (sameSide) { ourOpeningIdx = i; break; }
  }
}
console.log('ourOpeningIdx', ourOpeningIdx);
if (ourOpeningIdx >= 0) {
  const partnerIdx = ourOpeningIdx + 2;
  console.log('partnerIdx', partnerIdx, 'token=', bids[partnerIdx] && bids[partnerIdx].token);
}
