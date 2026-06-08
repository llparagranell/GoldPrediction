import { getCurrentSentiment } from '../services/sentimentService';
import computeBuyTradePlan from './tradeManager';

export const predictSignal = async (indicators: any) => {
  const votes = {
    ema: 0,
    structure: 0,
    rsi: 0,
    volume: 0,
    sentiment: 0
  };

  const reasons: string[] = [];

  // Factor 1: Moving Average Trend (50 vs 200 EMA)
  // Use current price vs 200 EMA as baseline (above -> buy, below -> sell)
  const prevEma50 = (indicators.prevEma50 ?? indicators.ema50) as number;
  const prevEma200 = (indicators.prevEma200 ?? indicators.ema200) as number;

  if (typeof indicators.currentPrice === 'number') {
    if (indicators.currentPrice > indicators.ema200) {
      votes.ema += 1;
      reasons.push('✓ Price above 200 EMA');
    } else if (indicators.currentPrice < indicators.ema200) {
      votes.ema -= 1;
      reasons.push('✓ Price below 200 EMA');
    }
  } else {
    // Fallback to comparing EMAs if current price not provided
    if (indicators.ema50 > indicators.ema200) {
      votes.ema += 1;
      reasons.push('✓ 50 EMA above 200 EMA');
    } else if (indicators.ema50 < indicators.ema200) {
      votes.ema -= 1;
      reasons.push('✓ 50 EMA below 200 EMA');
    }
  }

  // Strong signal on 50/200 crossover (golden/death cross)
  if (prevEma50 <= prevEma200 && indicators.ema50 > indicators.ema200) {
    votes.ema += 2;
    reasons.push('✓ 50/200 EMA golden cross (strong buy)');
  } else if (prevEma50 >= prevEma200 && indicators.ema50 < indicators.ema200) {
    votes.ema -= 2;
    reasons.push('✓ 50/200 EMA death cross (strong sell)');
  }

  // Factor 2: Market Structure (Breakouts)
  if (indicators.isBreakingHigh) {
    votes.structure = 1;
    reasons.push('✓ Higher High breakout');
  } else if (indicators.isBreakingLow) {
    votes.structure = -1;
    reasons.push('✓ Lower Low breakdown');
  } else {
    reasons.push('✗ Waiting for structural breakout');
  }

  // Factor 3: RSI 14
  if (indicators.rsi > 60) {
    votes.rsi = 1;
    reasons.push('✓ RSI bullish (>60)');
  } else if (indicators.rsi < 40) {
    votes.rsi = -1;
    reasons.push('✓ RSI bearish (<40)');
  } else {
    reasons.push('✗ RSI in neutral zone (40-60)');
  }

  // Factor 4: Volume Analysis
  const isVolumeHigh = indicators.currentVolume > indicators.avgVolume * 1.2;
  if (isVolumeHigh && indicators.priceChange > 0) {
    votes.volume = 1;
    reasons.push('✓ Strong buy volume');
  } else if (isVolumeHigh && indicators.priceChange < 0) {
    votes.volume = -1;
    reasons.push('✓ Strong sell volume');
  } else {
    reasons.push('✗ Low volume / No conviction');
  }

  // Factor 5: News Sentiment
  const sentimentData = getCurrentSentiment();
  if (sentimentData.sentiment === 'Bullish') {
    votes.sentiment = 1;
    reasons.push('✓ Positive news sentiment');
  } else if (sentimentData.sentiment === 'Bearish') {
    votes.sentiment = -1;
    reasons.push('✓ Negative news sentiment');
  } else {
    reasons.push('✗ Neutral news sentiment');
  }

  // Final Decision Logic
  // Final Decision Logic
  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  // Count directional agreement (how many factors are positive vs negative)
  const positiveCount = Object.values(votes).filter(v => v > 0).length;
  const negativeCount = Object.values(votes).filter(v => v < 0).length;

  let signal: 'BUY' | 'SELL' | 'NO TRADE' = 'NO TRADE';

  // If 4 or more factors are directionally positive/negative, prefer that decision
 if (positiveCount >= 3) signal = 'BUY';
else if (negativeCount >= 3) signal = 'SELL';
else if (totalVotes >= 3) signal = 'BUY';
else if (totalVotes <= -3) signal = 'SELL';

// console.log( positiveCount, negativeCount);
  // Structured Factors for UI
  const factors = [
    { label: 'Moving Average (EMA)', status: votes.ema > 0 ? 'success' : 'fail' as const },
    { label: 'Market Structure', status: votes.structure > 0 ? 'success' : 'fail' as const },
    { label: 'RSI Momentum', status: votes.rsi > 0 ? 'success' : 'fail' as const },
    { label: 'Volume Conviction', status: votes.volume > 0 ? 'success' : 'fail' as const },
    { label: 'News Sentiment', status: votes.sentiment > 0 ? 'success' : 'fail' as const }
  ];

  return {
    signal,
    reasons: signal === 'NO TRADE' 
      ? reasons.filter(r => r.startsWith('✗')).slice(0, 3)
      : reasons.filter(r => r.startsWith('✓')),
    factors,
    votes,
    tradePlan: signal === 'BUY'
      ? computeBuyTradePlan({
          entryPrice: indicators.currentPrice,
          atr: indicators.atr || 0,
          supportLevel: indicators.supportLevel || indicators.priceChange + indicators.currentPrice - 2, // fallback
          resistanceLevel: indicators.resistanceLevel || indicators.currentPrice + 5,
          last15mClose: undefined
        })
      : null
  };
};
