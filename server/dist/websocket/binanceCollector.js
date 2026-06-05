"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initBinanceStream = void 0;
const ws_1 = __importDefault(require("ws"));
const analyticsEngine_1 = require("../indicators/analyticsEngine");
// Maintain state for technical indicators
let candles = [];
const MAX_CANDLES = 250; // Enough for EMA 200
const initBinanceStream = (io, symbol = 'paxgusdt') => {
    // Subscribe to both Depth and Kline streams
    const ws = new ws_1.default(`wss://stream.binance.com:9443/stream?streams=${symbol}@depth20@1000ms/${symbol}@kline_1m`);
    ws.on('open', () => {
        console.log(`Connected to Binance Multi-Stream for ${symbol}`);
    });
    ws.on('message', (data) => {
        const msg = JSON.parse(data);
        const stream = msg.stream;
        const payload = msg.data;
        if (stream.includes('@kline')) {
            const k = payload.k;
            if (k.x) { // Kline is closed
                candles.push({
                    time: k.t,
                    open: parseFloat(k.o),
                    high: parseFloat(k.h),
                    low: parseFloat(k.l),
                    close: parseFloat(k.c),
                    volume: parseFloat(k.v)
                });
                if (candles.length > MAX_CANDLES)
                    candles.shift();
            }
        }
        if (stream.includes('@depth')) {
            if (!payload.bids || !payload.asks)
                return;
            const bids = payload.bids.map((b) => [parseFloat(b[0]), parseFloat(b[1])]);
            const asks = payload.asks.map((a) => [parseFloat(a[0]), parseFloat(a[1])]);
            // Indicators now take candles for EMA/RSI
            const currentPrice = bids[0]?.[0] || 0;
            const indicators = (0, analyticsEngine_1.calculateIndicators)(bids, asks, candles, currentPrice);
            Promise.resolve().then(() => __importStar(require('../ai/predictionEngine'))).then(({ predictSignal }) => {
                predictSignal(indicators).then(prediction => {
                    io.emit('marketUpdate', {
                        symbol,
                        bids: bids.slice(0, 10),
                        asks: asks.slice(0, 10),
                        indicators,
                        prediction,
                        timestamp: Date.now()
                    });
                });
            });
        }
    });
    ws.on('error', (err) => {
        console.error(`Binance Multi-Stream Error (${symbol}):`, err);
    });
    ws.on('close', () => {
        console.log(`Binance Multi-Stream Closed for ${symbol}`);
    });
    return ws;
};
exports.initBinanceStream = initBinanceStream;
