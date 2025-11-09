const { SAYCBiddingSystem } = require('../js/combined-bidding-system');
const { Hand, Bid } = require('../js/bridge-types');
function parseSuit(str, suit) { return (str||'').split('').filter(Boolean).map(ch=>({rank:ch, suit})); }
function makeHandFromPattern(spades, hearts, diamonds, clubs) {
  return new Hand({ S: parseSuit(spades,'S'), H: parseSuit(hearts,'H'), D: parseSuit(diamonds,'D'), C: parseSuit(clubs,'C') });
}
const hands = [ ['AKQ2','2','KJ32','Q432'], ['AK2','2','KJ2','QJ432'], ['K2','2','AKJ2','QJ432'], ['Q2','2','KJ32','J4332'] ];
const system = new SAYCBiddingSystem();
system.startAuction('N');
system.currentAuction.add(new Bid('1H'));
for (const h of hands) {
  const hand = makeHandFromPattern(h[0], h[1], h[2], h[3]);
  const bid = system.getBid(hand);
  console.log('hand', h, '->', bid && (bid.token || (bid.isDouble ? 'X' : 'PASS')), 'conv', bid && bid.conventionUsed);
}
