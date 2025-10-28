# Bridge Bidding System (SAYC) - JavaScript/Web Implementation

A comprehensive JavaScript implementation of the Standard American Yellow Card (SAYC) bidding system for contract bridge, featuring an interactive Bootstrap-based web interface.

## Features

### Core Bidding Logic

- **Opening Bids**: 1NT (15-17 HCP), suit openings, weak twos
- **Balanced Hand Detection**: 4-3-3-3, 4-4-3-2, 5-3-3-2 distributions
- **Rule of 20**: Smart opening decisions based on HCP + longest two suits
- **Better Minor**: Intelligent choice between clubs and diamonds

### Major Conventions Supported

#### Slam Conventions

- **Blackwood (4NT)**: Classic ace-asking with proper responses (0-4 aces)
- **Roman Key Card Blackwood (RKCB)**: 1430 and 3014 variants
- **Gerber (4C)**: Ace-asking after notrump bids

#### Notrump Defenses

- **DONT** (Disturbing Opponents' NoTrump): Single-suited, two-suited, and three-suited patterns
- **Meckwell**: Comprehensive defense including single-suited and two-suited combinations

#### Major Suit Responses

- **Jacoby 2NT**: Game-forcing raise showing 4+ card support and 13+ HCP
- **Splinter Bids**: Jump bids in new suits showing game-forcing values with 4+ support and singleton/void
- **Lebensohl**: Complex sequences after opponent interference over 1NT
  - Fast vs slow denial of stopper
  - Stopper asking with proper detection (A, Kx+, Qxx+)
  - Cue bid sequences

#### Competitive Bidding

- **Support Doubles**: Show exactly 3-card support in competitive auctions
- **Negative Doubles**: Takeout doubles after partner opens
- **Responsive Doubles**: Takeout after partner's takeout double
- **Reopening Doubles**: When opponents stop at low level
- **Cue Bid Raises**: Limit+ raises showing 10+ HCP and 4+ support
- **Michaels Cuebid**: Two-suited overcalls
- **Relaxed Takeout Doubles**: Shape-based with 11+ HCP when short in opponent's suit

#### Other Conventions

- **Drury**: Passed hand evaluation (when enabled)
- **Passed Hand Variations**: Adjusted bidding after initial pass

### Web Interface Features

- **Interactive Hand Input**: Enter hands in standard format
- **Visual Hand Display**: Color-coded suits with symbols (♠ ♥ ♦ ♣)
- **Live HCP Calculation**: Automatic point counting
- **Auction Tracker**: Real-time auction history with seat tracking
- **Bid Recommendations**: Get AI-powered bidding suggestions
- **Convention Attribution**: See which convention was used for each bid
- **Vulnerability Control**: Set vulnerability for both sides

### Auction Management

- **Seat Tracking**: Proper dealer and position tracking
- **Vulnerability Awareness**: Adjusts bidding ranges based on vulnerability
- **Convention Attribution**: Each bid tracks which convention was used

## Quick Start

### Option 1: Open Directly in Browser

Simply open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge).

### Option 2: Local Web Server (Recommended)

For full functionality:

```bash
# Using Node.js
npx http-server

# Using Python
python -m http.server 8000

# Using PHP
php -S localhost:8000
```

Then visit: `http://localhost:8000`

## Usage Guide

### 1. Enter Your Hand

- Format: **Spades Hearts Diamonds Clubs** (space-separated)
- Example: `AKQ2 J432 32 32`
- Click **Parse Hand** to analyze

### 2. Start an Auction

- Select **Our Seat** and **Dealer**

- Set vulnerability checkboxes if needed├── bidding_system.py # Base bidding system framework

- Click **Start New Auction**├── bridge_types.py # Core types: Card, Hand, Bid, Auction

├── sayc_system.py # SAYC implementation with all conventions

### 3. Get Bidding Suggestion├── convention_manager.py # Convention configuration and checking

- Click **Get My Bid** to see the recommended bid├── conventions.json # Convention settings and configurations

├── tests/

### 4. Build the Auction│ ├── test_sayc.py # Core SAYC bidding tests

- Type bids: **1S, 2NT, PASS, X, XX**│ ├── test_advanced.py # Advanced convention tests

│ ├── test_competitive.py # Competitive bidding tests

## Development│ ├── test_comprehensive.py # Integration tests

│ └── test_lebensohl.py # Lebensohl-specific tests

## Project Structure

```
├── index.html              # Main web interface
├── js/
│   ├── app.js               # Main application logic
│   ├── bridge-types.js      # Core types: Card, Hand, Bid, Auction
│   ├── bidding-system.js    # Base bidding system framework
│   ├── sayc-system.js       # SAYC implementation with all conventions
│   └── convention-manager.js # Convention configuration and management
├── css/                     # Styling files
├── cards/                   # Card data files
├── conventions.json         # Convention settings and configurations
└── tests/                   # Test files
    ├── test-helpers.js      # Testing utilities
    ├── test_sayc.test.js    # Core SAYC bidding tests
    ├── test_advanced.test.js # Advanced convention tests
    ├── test_competitive.test.js # Competitive bidding tests
    ├── test_comprehensive.test.js # Integration tests
    └── test_lebensohl.test.js # Lebensohl-specific tests
```

## Installation

```bash
# Clone the repository
git clone https://github.com/rajnesh/bridge-bidding-system.git
cd bridge-bidding-system

# Install dependencies (for testing)
npm install
```

## JavaScript API Usage

### Basic Example

```javascript
// Initialize the system
const system = new SAYCSystem();

// Create a hand (format: "Spades Hearts Diamonds Clubs")
const hand = new Hand("AKJ3 Q54 K82 974");

// Start an auction
system.startAuction(0); // our_seat = 0 (North)

// Get a bid for the hand
const bid = system.getBid(hand);
console.log(`Bid: ${bid.token}`); // e.g., "1S"
if (bid.conventionUsed) {
  console.log(`Convention: ${bid.conventionUsed}`);
}
```

### Advanced: Auction with Dealer

```javascript
// Start auction with dealer tracking
system.startAuctionWithDealer(1, 0); // our_seat=1 (East), dealer=0 (North)

// Add opponent's opening bid
system.currentAuction.addBid(new Bid("1NT"));

// Get our response
const hand = new Hand("KQ65 J9843 72 85");
const bid = system.getBid(hand);
```

### Configuring Conventions

Edit `conventions.json` to enable/disable conventions or change settings:

```json
{
  "ace_asking": {
    "blackwood": {
      "enabled": true,
      "variant": "rkcb"
    }
  },
  "notrump_defenses": {
    "dont": { "enabled": true },
    "meckwell": { "enabled": true }
  }
}
```

## Development

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test tests/test_sayc.test.js
```

### Debugging

Open browser DevTools (F12) for debugging. The console will show:

- Parsed hand information
- Bidding logic decisions
- Convention matches
- Error messages

## Key Implementation Details

### HCP Calculation

- Jack (J) = 1 point
- Queen (Q) = 2 points
- King (K) = 3 points
- Ace (A) = 4 points

### Rule of 20

A hand opens if: `HCP + length of two longest suits >= 19`

### Stopper Detection (Lebensohl)

- Ace = stopper
- King with 1+ other card (Kx, Kxx, etc.) = stopper
- Queen with 2+ other cards (Qxx, Qxxx, etc.) = stopper

### Seat Notation

- 0 = North
- 1 = East
- 2 = South
- 3 = West

## Contributing

Contributions are welcome! Areas for enhancement:

- Additional conventions (Splinter bids, Fourth suit forcing, etc.)
- More sophisticated competitive bidding
- Logging infrastructure for debugging
- Hand evaluation refinements
- Opening lead suggestions

## Author

Rajnesh Kathuria

## Live Demo

**Simply open `index.html` in your browser to start bidding!**

## Acknowledgments

Built with comprehensive test coverage to ensure accurate SAYC bidding behavior across a wide range of scenarios. This JavaScript implementation provides an interactive web-based interface for learning and practicing bridge bidding conventions.
