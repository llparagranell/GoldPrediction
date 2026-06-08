export interface TradeInput {
  entryPrice: number;
  atr: number;
  supportLevel: number;
  resistanceLevel: number;
  riskRewardRatio?: number; // default 2
  highestPriceReached?: number; // optional runtime
  last15mClose?: number; // optional for invalidation
}

export interface TradePlan {
  signal: 'BUY' | 'NO_TRADE' | 'REJECT';
  entryPrice: number;
  stopLoss: number;
  targets: Array<{ level: number; price: number; exitPercent: number }>;
  trailingStop: { activateAt: number; trailBy: number } | null;
  riskPercent: number;
  isHighRisk: boolean;
  invalidationPrice: number;
  shouldExit: boolean;
  summary: string;
  reasons?: string[];
}

const round2 = (v: number) => Math.round(v * 100) / 100;

export function computeBuyTradePlan(input: TradeInput): TradePlan {
  const {
    entryPrice,
    atr,
    supportLevel,
    resistanceLevel,
    riskRewardRatio = 2,
    highestPriceReached,
    last15mClose
  } = input;

  const reasons: string[] = [];

  // Stop calculations
  const stopByATR = entryPrice - 1.5 * atr;
  const stopBySupport = supportLevel - 0.01; // just below support
  // Tighter = closer to entry = higher price
  let stopLoss = Math.max(stopByATR, stopBySupport);

  // Targets
  const t1 = entryPrice + 1 * atr;
  const t2 = entryPrice + 2 * atr;
  const includeT3 = (resistanceLevel - entryPrice) > atr; // skip if within 1 ATR
  const t3 = includeT3 ? resistanceLevel : undefined;

  // Risk metrics
  const riskAmount = entryPrice - stopLoss;
  const riskPercent = (riskAmount / entryPrice) * 100;
  const isHighRisk = riskPercent > 3;

  // Rule: never suggest trade where riskPercent > 5%
  if (riskPercent > 5) {
    reasons.push('Risk percent exceeds 5% — do not suggest trade');
    return {
      signal: 'REJECT',
      entryPrice: round2(entryPrice),
      stopLoss: round2(stopLoss),
      targets: [],
      trailingStop: null,
      riskPercent: round2(riskPercent),
      isHighRisk: true,
      invalidationPrice: round2(stopLoss),
      shouldExit: last15mClose !== undefined ? (last15mClose < stopLoss) : false,
      summary: `Trade rejected: risk ${round2(riskPercent)}% > 5%`,
      reasons
    };
  }

  // Ensure minimum risk-reward ratio: required target price
  const requiredTarget = entryPrice + riskRewardRatio * riskAmount;

  // Build targets in priority order
  const proposedTargets: Array<{ level: number; price: number; exitPercent: number }> = [];
  proposedTargets.push({ level: 1, price: round2(t1), exitPercent: 50 });
  proposedTargets.push({ level: 2, price: round2(t2), exitPercent: 30 });
  if (t3 !== undefined) proposedTargets.push({ level: 3, price: round2(t3), exitPercent: 20 });

  // Check if any target satisfies minimum RR
  const meetsRR = proposedTargets.some(t => t.price >= round2(requiredTarget));
  if (!meetsRR) {
    reasons.push('Targets do not meet minimum risk-reward requirement');
    return {
      signal: 'NO_TRADE',
      entryPrice: round2(entryPrice),
      stopLoss: round2(stopLoss),
      targets: proposedTargets,
      trailingStop: null,
      riskPercent: round2(riskPercent),
      isHighRisk,
      invalidationPrice: round2(stopLoss),
      shouldExit: last15mClose !== undefined ? (last15mClose < stopLoss) : false,
      summary: `No trade: targets fail to deliver ${riskRewardRatio}:1 R:R`,
      reasons
    };
  }

  // Build final plan
  const signal: 'BUY' = 'BUY';

  const trailingStop = {
    activateAt: round2(t1),
    trailBy: round2(1 * atr)
  };

  // Invalidation
  const shouldExit = last15mClose !== undefined ? (last15mClose < stopLoss) : false;

  const summaryParts = [
    `Enter at ${round2(entryPrice)}`,
    `cut loss at ${round2(stopLoss)}`,
    `partial profits at ${round2(t1)} and ${round2(t2)}`
  ];
  if (t3 !== undefined) summaryParts.push(`final target ${round2(t3)}`);

  return {
    signal,
    entryPrice: round2(entryPrice),
    stopLoss: round2(stopLoss),
    targets: proposedTargets,
    trailingStop,
    riskPercent: round2(riskPercent),
    isHighRisk,
    invalidationPrice: round2(stopLoss),
    shouldExit,
    summary: summaryParts.join(', '),
    reasons
  };
}

// Export default for convenience
export default computeBuyTradePlan;
