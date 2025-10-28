/**
 * Node.js test wrapper for combined-bidding-system.js
 * Provides minimal Node.js compatibility for testing while keeping the main file browser-only
 */

// Load dependencies first
const { ConventionCard } = require('./convention-manager.js');
const { VulnerabilityState, Auction, Bid, Hand } = require('./bridge-types.js');

// Set up browser-like global environment for the combined file
global.window = global;
global.window.ConventionCard = ConventionCard;
global.window.VulnerabilityState = VulnerabilityState;
global.window.Auction = Auction;
global.window.Bid = Bid;
global.window.Hand = Hand;

// Load the browser-only combined file
require('./combined-bidding-system.js');

// Add config loading capability to the SAYCBiddingSystem class
const OriginalSAYCBiddingSystem = global.SAYCBiddingSystem;

// Modify the prototype to add config loading
const originalConstructor = OriginalSAYCBiddingSystem;
function SAYCBiddingSystemWithConfig(configPath = null) {
    originalConstructor.call(this);
    
    if (configPath) {
        try {
            const fs = require('fs');
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            this.conventions.config = config;
        } catch (error) {
            console.error('Error loading config file:', error);
            // Fall back to default config
        }
    }
}

// Set up proper inheritance
SAYCBiddingSystemWithConfig.prototype = Object.create(OriginalSAYCBiddingSystem.prototype);
SAYCBiddingSystemWithConfig.prototype.constructor = SAYCBiddingSystemWithConfig;

// Export for Node.js tests
module.exports = {
    BiddingSystem: global.BiddingSystem,
    SAYCBiddingSystem: SAYCBiddingSystemWithConfig,
    SUITS: global.SUITS
};