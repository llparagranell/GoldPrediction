"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startOandaPricing = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const API_TOKEN = process.env.OANDA_API_KEY;
const ACCOUNT_ID = process.env.OANDA_ACCOUNT_ID;
const BASE_URL = process.env.OANDA_ENV === 'live' ? 'https://api-fxtrade.oanda.com' : 'https://api-fxpractice.oanda.com';
const startOandaPricing = (io, instrument = 'XAU_USD') => {
    if (!API_TOKEN || !ACCOUNT_ID) {
        console.error('OANDA credentials missing. Falling back to Binance data for Gold.');
        return null;
    }
    const fetchPrice = async () => {
        try {
            const response = await axios_1.default.get(`${BASE_URL}/v3/accounts/${ACCOUNT_ID}/pricing`, {
                headers: {
                    'Authorization': `Bearer ${API_TOKEN}`
                },
                params: {
                    instruments: instrument
                }
            });
            const priceData = response.data.prices[0];
            const bid = parseFloat(priceData.bids[0].price);
            const ask = parseFloat(priceData.asks[0].price);
            const price = (bid + ask) / 2;
            // Map OANDA data to the unified marketUpdate format
            // Note: OANDA doesn't provide a real order book via this simple REST endpoint,
            // so we simulate the book structure or provided basic pricing.
            io.emit('marketUpdate', {
                symbol: instrument.replace('_', ''),
                bids: [[bid, 1]], // [price, volume]
                asks: [[ask, 1]],
                indicators: {
                    obi: 0.5,
                    spread: ask - bid,
                    liquidityScore: 1.0,
                    bidVolume: 1,
                    askVolume: 1
                },
                prediction: {
                    signal: 'NEUTRAL',
                    confidence: 50,
                    strength: 'MEDIUM',
                    reasons: ['OANDA Real-time Feed Active']
                },
                timestamp: Date.now()
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('OANDA Price Fetch Error:', error.message);
            }
        }
    };
    const interval = setInterval(fetchPrice, 2000);
    return {
        close: () => clearInterval(interval)
    };
};
exports.startOandaPricing = startOandaPricing;
