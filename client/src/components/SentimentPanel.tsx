import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SentimentPanelProps {
  sentiment: {
    sentiment?: 'Bullish' | 'Bearish' | 'Neutral';
    score?: number;
    timestamp?: number;
  };
}

const SentimentPanel: React.FC<SentimentPanelProps> = ({ sentiment }) => {
  if (!sentiment.sentiment) return (
    <div className="glass p-6 rounded-2xl h-full flex items-center justify-center">
      <p className="label animate-pulse">Aggregating Signal...</p>
    </div>
  );

  const isBullish = sentiment.sentiment === 'Bullish';
  const isBearish = sentiment.sentiment === 'Bearish';
  const colorClass = isBullish ? 'text-buy' : isBearish ? 'text-sell' : 'text-gray-400';
  const bgColorHex = isBullish ? '#00f57a' : isBearish ? '#ff4757' : '#6b7280';

  return (
    <div className="glass p-6 rounded-2xl h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <span className="label">Market Bias</span>
        <div className="flex items-center gap-1.5 text-[9px] font-bold text-buy bg-buy/[0.08] border border-buy/[0.12] px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-buy animate-pulse" />
          Real-time
        </div>
      </div>

      {/* Main Sentiment Display */}
      <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/[0.05] mb-5">
        <div className="flex items-center gap-4">
          <div
            className="p-3 rounded-xl"
            style={{ background: `${bgColorHex}12`, border: `1px solid ${bgColorHex}20` }}
          >
            {isBullish && <TrendingUp className={`${colorClass} w-6 h-6`} />}
            {isBearish && <TrendingDown className={`${colorClass} w-6 h-6`} />}
            {!isBullish && !isBearish && <Minus className="text-gray-400 w-6 h-6" />}
          </div>
          <div>
            <span className="label block mb-1">Consensus</span>
            <span
              className={`text-2xl font-bold leading-none tracking-[-0.03em] ${colorClass}`}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {sentiment.sentiment}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="label block mb-1">Score</span>
          <span
            className={`text-3xl font-bold ${colorClass}`}
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            {sentiment.score}%
          </span>
        </div>
      </div>

      {/* Score Bar */}
      <div className="flex-1 flex flex-col justify-end">
        <div className="w-full h-1 bg-white/[0.05] rounded-full overflow-hidden mb-4">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${Math.abs(sentiment.score || 0)}%`,
              background: bgColorHex,
              boxShadow: `0 0 8px ${bgColorHex}60`
            }}
          />
        </div>

        <div className="flex items-center justify-center gap-2 opacity-30">
          <div className="w-1 h-1 rounded-full bg-gray-500" />
          <p className="label">
            Refreshed {new Date(sentiment.timestamp || 0).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SentimentPanel;
