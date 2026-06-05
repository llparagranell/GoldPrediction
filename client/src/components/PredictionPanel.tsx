import React from 'react';
import { useMarketStore } from '../store/useStore';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface PredictionPanelProps {
  prediction: {
    signal?: 'BUY' | 'SELL' | 'NO TRADE';
    reasons?: string[];
    factors?: { label: string, status: 'success' | 'fail' }[];
  };
}

const PredictionPanel: React.FC<PredictionPanelProps> = ({ prediction }) => {
  const { symbol } = useMarketStore();
  
  const isBuy = prediction.signal === 'BUY';
  const isSell = prediction.signal === 'SELL';
  const isNoTrade = prediction.signal === 'NO TRADE';
  
  const colorClass = isBuy ? 'text-buy' : isSell ? 'text-sell' : 'text-gray-400';
  const glowClass = isBuy ? 'shadow-[0_0_40px_rgba(0,245,122,0.12)]' : isSell ? 'shadow-[0_0_40px_rgba(255,71,87,0.12)]' : '';
  const successCount = prediction.factors?.filter(f => f.status === 'success').length ?? 0;
  const totalCount = prediction.factors?.length ?? 5;

  if (!prediction.signal) return (
    <div className="glass p-6 rounded-2xl h-full flex flex-col items-center justify-center text-center gap-4">
      <div className="w-10 h-10 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
      <p className="label animate-pulse">Synchronizing Decision Engine...</p>
    </div>
  );

  return (
    <div className={`glass p-6 rounded-2xl h-full flex flex-col transition-all duration-500 ${glowClass} relative overflow-hidden`}>
      {/* Background Accent */}
      <div className={`absolute -top-20 -right-20 w-56 h-56 rounded-full blur-[80px] opacity-[0.07] ${isBuy ? 'bg-buy' : isSell ? 'bg-sell' : 'bg-gray-500'}`} />

      {/* Header */}
      <div className="relative z-10 mb-5">
        <span className="label mb-2 block">{symbol} · Decision Engine</span>
        <div className="flex items-end justify-between">
          <div
            className={`text-5xl font-bold leading-none tracking-[-0.04em] ${colorClass}`}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {prediction.signal}
          </div>
          <div className="flex flex-col items-end">
            <span className="label mb-1">Factors Aligned</span>
            <span className={`text-2xl font-bold ${colorClass}`} style={{ fontFamily: "'Space Mono', monospace" }}>
              {successCount}/{totalCount}
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-white/[0.06] mb-4 relative z-10" />

      {/* Strategy Checklist */}
      <div className="flex-1 flex flex-col relative z-10 gap-1.5">
        <span className="label mb-2">Strategy Checklist</span>
        {prediction.factors?.map((factor, i) => (
          <div
            key={i}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl border transition-colors ${
              factor.status === 'success'
                ? 'bg-white/[0.03] border-white/[0.06]'
                : 'bg-transparent border-white/[0.03]'
            }`}
          >
            <span
              className={`text-[11px] font-semibold tracking-wide ${
                factor.status === 'success' ? 'text-white/80' : 'text-white/25'
              }`}
            >
              {factor.label}
            </span>
            {factor.status === 'success' ? (
              <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${colorClass}`} />
            ) : (
              <XCircle className="w-3.5 h-3.5 flex-shrink-0 text-white/15" />
            )}
          </div>
        ))}
      </div>

      {/* Footer Action */}
      <div className="mt-4 relative z-10">
        {isNoTrade && (
          <div className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-gray-500" />
            <span className="label text-gray-500">Awaiting Confirmation</span>
          </div>
        )}
        {(isBuy || isSell) && (
          <div className="grid grid-cols-2 gap-3">
            <button className={`h-11 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all ${isBuy ? 'bg-buy text-dark shadow-[0_0_20px_rgba(0,245,122,0.3)] hover:scale-[1.02]' : 'bg-white/[0.04] text-white/20 cursor-not-allowed'}`}>
              Market Buy
            </button>
            <button className={`h-11 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all ${isSell ? 'bg-sell text-white shadow-[0_0_20px_rgba(255,71,87,0.3)] hover:scale-[1.02]' : 'bg-white/[0.04] text-white/20 cursor-not-allowed'}`}>
              Market Sell
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionPanel;
