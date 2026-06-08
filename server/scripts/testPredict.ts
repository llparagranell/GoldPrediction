/// <reference types="node" />
import { calculateIndicators } from '../src/indicators/analyticsEngine';
import { predictSignal } from '../src/ai/predictionEngine';

declare const process: any;

const bids = [[100, 1]];
const asks = [[101, 1]];

const candles = Array.from({ length: 60 }).map((_, i) => ({
  time: Date.now() - (60 - i) * 60000,
  open: 100 + i * 0.1,
  high: 100 + i * 0.2,
  low: 99 + i * 0.05,
  close: 100 + i * 0.1,
  volume: 1000 + i
}));

const currentPrice = candles[candles.length - 1].close + 1; // slightly above last close

const indicators = calculateIndicators(bids, asks, candles, currentPrice);

predictSignal(indicators)
  .then(result => {
    console.log('INDICATORS:', indicators);
    console.log('PREDICTION:', result);
  })
  .catch(err => {
    console.error('Error running prediction:', err);
    process.exit(1);
  });
