import { EMA, RSI } from 'technicalindicators';

let lastIndicators: any = null;
let lastCalculatedPrice = 0;

export const calculateIndicators = (bids: number[][], asks: number[][], candles: any[], currentPrice: number) => {
  // Optimization: If price hasn't changed and we have cached indicators, return them
  // (We still recalculate if order book volumes might have changed, but OBI is cheap)
  if (lastIndicators && currentPrice === lastCalculatedPrice && candles.length > 0) {
      // Small optimization: only update OBI/Spread which change with depth
      const bidVolume = bids.reduce((acc, curr) => acc + curr[1]!, 0);
      const askVolume = asks.reduce((acc, curr) => acc + curr[1]!, 0);
      return {
          ...lastIndicators,
          obi: (bidVolume - askVolume) / (bidVolume + askVolume),
          spread: (asks[0]?.[0] || 0) - (bids[0]?.[0] || 0),
          bidVolume,
          askVolume
      };
  }

  // 1. Order Book Imbalance (OBI)
  const bidVolume = bids.reduce((acc, curr) => acc + curr[1]!, 0);
  const askVolume = asks.reduce((acc, curr) => acc + curr[1]!, 0);
  const obi = (bidVolume - askVolume) / (bidVolume + askVolume);
  const spread = (asks[0]?.[0] || 0) - (bids[0]?.[0] || 0);

  // 2. EMAs (50 and 200)
  const closes = candles.map(c => c.close);
  if (currentPrice) closes.push(currentPrice);
  
  const ema50 = EMA.calculate({ period: 50, values: closes });
  const ema200 = EMA.calculate({ period: 200, values: closes });
  
  const lastEma50 = ema50[ema50.length - 1] || 0;
  const lastEma200 = ema200[ema200.length - 1] || 0;

  // 3. RSI 14
  const rsiValues = RSI.calculate({ period: 14, values: closes });
  const currentRsi = rsiValues[rsiValues.length - 1] || 50;

  // 4. Market Structure
  const prevCandle = candles[candles.length - 1];
  const isBreakingHigh = prevCandle ? currentPrice > prevCandle.high : false;
  const isBreakingLow = prevCandle ? currentPrice < prevCandle.low : false;

  // 5. Volume Analysis
  const volumes = candles.map(c => c.volume);
  const avgVolume = volumes.length >= 20 
    ? volumes.slice(-20).reduce((a, b) => a + b, 0) / 20 
    : 0;
  const currentVolume = candles[candles.length - 1]?.volume || 0;

  const results = {
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

  lastIndicators = results;
  lastCalculatedPrice = currentPrice;

  return results;
};

export const calculateOFI = (prevBids: number[][], currentBids: number[][]) => {
    // OFI implementation would require comparing consecutive book states
    // Simplified for now
    return 0;
}
