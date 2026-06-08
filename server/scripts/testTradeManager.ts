import computeBuyTradePlan from '../src/ai/tradeManager';

const input = {
  entryPrice: 100,
  atr: 1.5,
  supportLevel: 98,
  resistanceLevel: 107,
  riskRewardRatio: 2,
  last15mClose: 99
};

const plan = computeBuyTradePlan(input as any);
console.log(JSON.stringify(plan, null, 2));
