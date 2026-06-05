"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateOFI = exports.calculateIndicators = void 0;
const technicalindicators_1 = require("technicalindicators");
const calculateIndicators = (bids, asks, candles, currentPrice) => {
    // 1. Order Book Imbalance (OBI) - for backward compatibility/context
    const bidVolume = bids.reduce((acc, curr) => acc + curr[1], 0);
    const askVolume = asks.reduce((acc, curr) => acc + curr[1], 0);
    const obi = (bidVolume - askVolume) / (bidVolume + askVolume);
    const spread = (asks[0]?.[0] || 0) - (bids[0]?.[0] || 0);
    // 2. EMAs (50 and 200)
    const closes = candles.map(c => c.close);
    // Add current price as the latest point if candle is not closed yet
    if (currentPrice)
        closes.push(currentPrice);
    const ema50 = technicalindicators_1.EMA.calculate({ period: 50, values: closes });
    const ema200 = technicalindicators_1.EMA.calculate({ period: 200, values: closes });
    const lastEma50 = ema50[ema50.length - 1] || 0;
    const lastEma200 = ema200[ema200.length - 1] || 0;
    // 3. RSI 14
    const rsiValues = technicalindicators_1.RSI.calculate({ period: 14, values: closes });
    const currentRsi = rsiValues[rsiValues.length - 1] || 50;
    // 4. Market Structure (Higher Highs / Lower Lows)
    // Simplified detection: compare current price to previous candle range
    const prevCandle = candles[candles.length - 1];
    const isBreakingHigh = prevCandle ? currentPrice > prevCandle.high : false;
    const isBreakingLow = prevCandle ? currentPrice < prevCandle.low : false;
    // 5. Volume Analysis (current volume vs 20-period average)
    const volumes = candles.map(c => c.volume);
    const avgVolume = volumes.length >= 20
        ? volumes.slice(-20).reduce((a, b) => a + b, 0) / 20
        : 0;
    const currentVolume = candles[candles.length - 1]?.volume || 0;
    return {
        obi,
        spread,
        ema50: lastEma50,
        ema200: lastEma200,
        rsi: currentRsi,
        isBreakingHigh,
        isBreakingLow,
        avgVolume,
        currentVolume,
        bidVolume,
        askVolume,
        priceChange: prevCandle ? currentPrice - prevCandle.close : 0
    };
};
exports.calculateIndicators = calculateIndicators;
const calculateOFI = (prevBids, currentBids) => {
    // OFI implementation would require comparing consecutive book states
    // Simplified for now
    return 0;
};
exports.calculateOFI = calculateOFI;
