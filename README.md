# Bridge Bidding System (SAYC) - JavaScript/Web Version# Bridge Bidding System (SAYC)

A comprehensive JavaScript implementation of the Standard American Yellow Card (SAYC) bidding system for contract bridge, with an interactive Bootstrap-based web interface.A comprehensive Python implementation of the Standard American Yellow Card (SAYC) bidding system for contract bridge, with extensive support for advanced conventions and competitive bidding.

## Features## Features

### Core Bidding Logic### Core Bidding Logic

- **Opening Bids**: 1NT (15-17 HCP), suit openings, weak twos

- **Balanced Hand Detection**: 4-3-3-3, 4-4-3-2, 5-3-3-2 distributions- **Opening Bids**: 1NT (15-17 HCP), suit openings, weak twos with vulnerability adjustments

- **Rule of 20**: Smart opening decisions based on HCP + longest two suits- **Balanced Hand Detection**: 4-3-3-3, 4-4-3-2, 5-3-3-2 distributions

- **Responsive UI**: Beautiful Bootstrap 5 interface with real-time bidding suggestions- **Rule of 20**: Smart opening decisions based on HCP + longest two suits

- **Better Minor**: Intelligent choice between clubs and diamonds

### Major Conventions Supported

- **Jacoby 2NT**: Game-forcing raise with 4+ card support and 13+ HCP### Major Conventions

- **Blackwood & RKCB**: Ace-asking conventions (4NT)

- **Gerber**: Ace-asking after notrump (4C)#### Slam Conventions

- **Takeout Doubles**: Competitive bidding support

- **Simple Overcalls**: Direct overcalls with 5+ HCP- **Blackwood (4NT)**: Classic ace-asking with proper responses (0-4 aces)

- **Roman Key Card Blackwood (RKCB)**: 1430 and 3014 variants with automatic fallback to classic when no trump suit established

### Web Interface Features- **Gerber (4C)**: Ace-asking after notrump bids

- **Interactive Hand Input**: Enter hands in PBN format

- **Visual Hand Display**: Color-coded suits with symbols (♠ ♥ ♦ ♣)#### Notrump Defenses

- **Live HCP Calculation**: Automatic point counting

- **Auction Tracker**: Real-time auction history with seat tracking- **DONT** (Disturbing Opponents' NoTrump): Single-suited, two-suited, and three-suited patterns

- **Bid Recommendations**: Get AI-powered bidding suggestions- **Meckwell**: Comprehensive defense including single-suited (6+ cards), both majors, and major+minor combinations

- **Convention Attribution**: See which convention was used for each bid

- **Vulnerability Control**: Set vulnerability for both sides#### Major Suit Responses

## Quick Start- **Jacoby 2NT**: Game-forcing raise showing 4+ card support and 13+ HCP

- **Lebensohl**: Complex sequences after opponent interference over 1NT

### Option 1: Open Directly in Browser - Fast vs slow denial of stopper

Simply open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge). - Stopper asking with proper detection (A, Kx+, Qxx+)

- Cue bid sequences

### Option 2: Local Web Server (Recommended)

For full functionality:#### Competitive Bidding

```bash- **Support Doubles**: Show exactly 3-card support in competitive auctions

# Using Python- **Negative Doubles**: Takeout doubles after partner opens

python -m http.server 8000- **Responsive Doubles**: Takeout after partner's takeout double

- **Reopening Doubles**: When opponents stop at low level

# Using Node.js- **Cue Bid Raises**: Limit+ raises showing 10+ HCP and 4+ support

npx http-server- **Michaels Cuebid**: Two-suited overcalls

- **Relaxed Takeout Doubles**: Shape-based with 11+ HCP when short in opponent's suit

# Using PHP

php -S localhost:8000#### Other Conventions

```

- **Drury**: Passed hand evaluation (when enabled)

Then visit: `http://localhost:8000`- **Passed Hand Variations**: Adjusted bidding after initial pass

## Usage Guide### Auction Management

### 1. Enter Your Hand- **Seat Tracking**: Proper dealer and position tracking to reduce heuristic behavior

- Format: **Spades Hearts Diamonds Clubs** (space-separated)- **Vulnerability Awareness**: Adjusts weak two ranges and other bids based on vulnerability

- Example: `AKQ2 J432 32 32`- **Convention Attribution**: Each bid tracks which convention was used

- Click **Parse Hand** to analyze

## Project Structure

### 2. Start an Auction

- Select **Our Seat** and **Dealer**```

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

Open browser DevTools (F12) for debugging.└── cards/ # Card data files

````

## Author

## Installation

Rajnesh Kathuria

```bash

---# Clone the repository

git clone <repository-url>

**Live Demo**: Open `index.html` in your browser to start bidding!cd sandbox


# Install dependencies
pip install -r requirements.txt

# Install pytest for testing
pip install pytest
````

## Usage

### Basic Example

```python
from sayc_system import SAYCSystem
from bridge_types import Hand

# Initialize the system
system = SAYCSystem()

# Create a hand (format: "Spades Hearts Diamonds Clubs")
hand = Hand("AKJ3 Q54 K82 974")

# Start an auction
system.start_auction(our_seat=0)

# Get a bid for the hand
bid = system.get_bid(hand)
print(f"Bid: {bid.token}")  # e.g., "1S"
if bid.convention_used:
    print(f"Convention: {bid.convention_used}")
```

### Advanced: Auction with Dealer

```python
from sayc_system import SAYCSystem
from bridge_types import Hand, Bid

system = SAYCSystem()

# Start auction with dealer tracking
system.start_auction_with_dealer(our_seat=1, dealer=0)

# Add opponent's opening bid
system.current_auction.add_bid(Bid("1NT"))

# Get our response
hand = Hand("KQ65 J9843 72 85")
bid = system.get_bid(hand)
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

## Testing

Run the full test suite:

```bash
pytest -v
```

Run specific test files:

```bash
pytest tests/test_sayc.py -v
pytest tests/test_lebensohl.py -v
```

Current test coverage: **29 tests, all passing**

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

## Acknowledgments

Built with comprehensive test coverage to ensure accurate SAYC bidding behavior across a wide range of scenarios.
