"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.predictSignal = void 0;
const sentimentService_1 = require("../services/sentimentService");
const predictSignal = async (indicators) => {
    const votes = {
        ema: 0,
        structure: 0,
        rsi: 0,
        volume: 0,
        sentiment: 0
    };
    const reasons = [];
    // Factor 1: Moving Average Trend (50 vs 200 EMA)
    if (indicators.ema50 > indicators.ema200) {
        votes.ema = 1;
        reasons.push('✓ 50 EMA above 200 EMA');
    }
    else if (indicators.ema50 < indicators.ema200) {
        votes.ema = -1;
        reasons.push('✓ 50 EMA below 200 EMA');
    }
    else {
        reasons.push('✗ No EMA crossover detected');
    }
    // Factor 2: Market Structure (Breakouts)
    if (indicators.isBreakingHigh) {
        votes.structure = 1;
        reasons.push('✓ Higher High breakout');
    }
    else if (indicators.isBreakingLow) {
        votes.structure = -1;
        reasons.push('✓ Lower Low breakdown');
    }
    else {
        reasons.push('✗ Waiting for structural breakout');
    }
    // Factor 3: RSI 14
    if (indicators.rsi > 60) {
        votes.rsi = 1;
        reasons.push('✓ RSI bullish (>60)');
    }
    else if (indicators.rsi < 40) {
        votes.rsi = -1;
        reasons.push('✓ RSI bearish (<40)');
    }
    else {
        reasons.push('✗ RSI in neutral zone (40-60)');
    }
    // Factor 4: Volume Analysis
    const isVolumeHigh = indicators.currentVolume > indicators.avgVolume * 1.2;
    if (isVolumeHigh && indicators.priceChange > 0) {
        votes.volume = 1;
        reasons.push('✓ Strong buy volume');
    }
    else if (isVolumeHigh && indicators.priceChange < 0) {
        votes.volume = -1;
        reasons.push('✓ Strong sell volume');
    }
    else {
        reasons.push('✗ Low volume / No conviction');
    }
    // Factor 5: News Sentiment
    const sentimentData = await (0, sentimentService_1.getMarketSentiment)();
    if (sentimentData.sentiment === 'Bullish') {
        votes.sentiment = 1;
        reasons.push('✓ Positive news sentiment');
    }
    else if (sentimentData.sentiment === 'Bearish') {
        votes.sentiment = -1;
        reasons.push('✓ Negative news sentiment');
    }
    else {
        reasons.push('✗ Neutral news sentiment');
    }
    // Final Decision Logic
    const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
    let signal = 'NO TRADE';
    if (totalVotes >= 4) {
        signal = 'BUY';
    }
    else if (totalVotes <= -4) {
        signal = 'SELL';
    }
    // Filtering Reasons for display
    const finalReasons = signal === 'NO TRADE'
        ? reasons.filter(r => r.startsWith('✗')).slice(0, 3)
        : reasons.filter(r => r.startsWith('✓'));
    if (signal === 'NO TRADE' && finalReasons.length === 0) {
        finalReasons.push('✗ Less than 4 factors aligned');
    }
    return {
        signal,
        reasons: finalReasons,
        votes // Included for debugging/transparency if needed
    };
};
exports.predictSignal = predictSignal;
