const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const dom = new JSDOM(`<!doctype html><html><body>
<div class="tab-container"><div class="tab-nav"></div></div>
<div id="playPanel" class="tab-panel">
  <div id="playContractInfo"></div>
  <div id="playStatus" style="display:none"></div>
  <div class="play-controls">
    <button id="playUndoBtn"></button>
    <button id="playClearTrickBtn"></button>
    <button id="playClaimBtn"></button>
    <button id="playReplayBtn"></button>
    <button id="playNewDealBtn"></button>
    <div>Tricks — N/S: <span id="trickCountNS">0</span> | E/W: <span id="trickCountEW">0</span></div>
  </div>
  <div class="play-layout">
    <div class="play-hand" id="playNorthArea">
      <div class="hand-title">North</div>
      <div id="playNorthHand" class="cards-row"></div>
    </div>
    <div class="play-table" id="playTableArea">
      <div class="trick-area" id="trickArea"></div>
      <div id="playResultSummary"></div>
      <ul id="playScoreBreakdown"></ul>
    </div>
    <div class="play-hand" id="playSouthArea">
      <div class="hand-title">South</div>
      <div id="playSouthHand" class="cards-row"></div>
    </div>
  </div>
</div>
<div id="auctionContent"></div>
<div class="auction-grid"></div>
<div id="auctionStatus" class="alert"></div>
<div id="hintBtn"></div>
</body></html>`, { pretendToBeVisual: true, url: 'http://localhost/' });

const win = dom.window;
win.console = console;

// Bridge app scripts expect browser-like globals; expose them on Node globalThis
globalThis.window = win;
globalThis.document = win.document;
globalThis.navigator = win.navigator;
globalThis.HTMLElement = win.HTMLElement;
globalThis.Node = win.Node;
globalThis.getComputedStyle = win.getComputedStyle.bind(win);
// Propagate timers so app.js retries work as in browser
globalThis.requestAnimationFrame = win.requestAnimationFrame?.bind(win) || (cb => setTimeout(cb, 16));
globalThis.cancelAnimationFrame = win.cancelAnimationFrame?.bind(win) || clearTimeout;

// Minimal stub to satisfy initializeSystem retry loop
if (typeof win.SAYCBiddingSystem !== 'function') {
  win.SAYCBiddingSystem = function StubSystem() {
    this.getExplanationFor = () => 'Standard bid';
    this.conventions = { isEnabled: () => false };
    this.getRecommendedBid = () => ({ bid: new win.Bid('PASS'), explanation: 'Pass' });
  };
}

const scriptPaths = ['js/bridge-types.js','js/cards-svg.js','js/app.js'];
for (const relPath of scriptPaths) {
  const code = fs.readFileSync(path.join(process.cwd(), relPath), 'utf8');
  win.eval(code);
}

// Provide nav buttons for switchTab progress logic
const nav = win.document.querySelector('.tab-nav');
['active','settings','practice','generation','auction','play'].forEach(name => {
  const btn = win.document.createElement('button');
  btn.className = 'tab-button';
  btn.id = `${name}Tab`;
  nav.appendChild(btn);
});

// Add panels to allow switchTab to work
['active','settings','practice','generation','auction','play'].forEach(name => {
  const panel = win.document.createElement('div');
  panel.className = 'tab-panel';
  panel.id = `${name}Panel`;
  win.document.body.appendChild(panel);
});

win.currentHands = {
  N: new win.Hand({ S: [new win.Card('A','S'), new win.Card('Q','S')], H: [], D: [], C: [] }),
  S: new win.Hand({ S: [new win.Card('K','S'), new win.Card('J','S')], H: [], D: [], C: [] }),
  E: new win.Hand({ S: [new win.Card('T','S')], H: [], D: [], C: [] }),
  W: new win.Hand({ S: [new win.Card('9','S')], H: [], D: [], C: [] })
};
win.auctionHistory = [
  { position: 'S', bid: new win.Bid('1NT') },
  { position: 'W', bid: new win.Bid('PASS') },
  { position: 'N', bid: new win.Bid('PASS') },
  { position: 'E', bid: new win.Bid('PASS') }
];

if (typeof win.endAuction === 'function') {
  win.endAuction();
}

if (typeof win.goToPlay === 'function') {
  win.goToPlay();
}

console.log('South cards rendered:', win.document.getElementById('playSouthHand').childElementCount);
console.log('North cards rendered:', win.document.getElementById('playNorthHand').childElementCount);
console.log('Contract text:', win.document.getElementById('playContractInfo').textContent.trim());
