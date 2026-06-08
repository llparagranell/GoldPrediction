import React from 'react';
import { X, TrendingUp } from 'lucide-react';
import { useMarketStore } from '../store/useStore';

const TradeInfoPanel: React.FC = () => {
  const { tradePlan, setTradePlan } = useMarketStore();

  if (!tradePlan || tradePlan.signal !== 'BUY') return null;

  return (
    <div className="glass p-6 rounded-2xl relative overflow-hidden shadow-lg border border-green-500/20">
      {/* Background Accent */}
      <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full blur-[80px] opacity-[0.07] bg-green-500" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-green-400" />
          <h3 className="text-xl font-bold text-white">Active Trade Plan</h3>
        </div>
        <button
          onClick={() => setTradePlan(null)}
          className="p-1 hover:bg-white/10 rounded-lg transition"
        >
          <X className="w-5 h-5 text-gray-400 hover:text-white" />
        </button>
      </div>

      {/* Main Grid */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Entry Price */}
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
          <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider">Entry Price</p>
          <p className="text-2xl font-bold text-green-400">${tradePlan.entryPrice.toFixed(2)}</p>
        </div>

        {/* Stop Loss */}
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider">Stop Loss</p>
          <p className="text-2xl font-bold text-red-400">${tradePlan.stopLoss.toFixed(2)}</p>
        </div>

        {/* Risk % */}
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider">Risk %</p>
          <p className={`text-2xl font-bold ${tradePlan.isHighRisk ? 'text-red-400' : 'text-yellow-400'}`}>
            {tradePlan.riskPercent.toFixed(2)}%
          </p>
        </div>

        {/* Trailing Stop */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider">Trailing Stop</p>
          <p className="text-2xl font-bold text-blue-400">±${tradePlan.trailingStop.trailBy.toFixed(2)}</p>
        </div>
      </div>

      {/* Profit Targets */}
      <div className="relative z-10">
        <p className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Profit Targets</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {tradePlan.targets.map((target: any) => (
            <div
              key={target.level}
              className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 font-semibold">Target {target.level}</span>
                <span className="text-xs font-bold text-green-400">{target.exitPercent}% exit</span>
              </div>
              <p className="text-xl font-bold text-white">${target.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="relative z-10 mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
        <p className="text-sm text-blue-300 leading-relaxed">{tradePlan.summary}</p>
      </div>
    </div>
  );
};

export default TradeInfoPanel;
