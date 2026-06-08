import React from 'react';
import { X, TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface IndicatorsModalProps {
  isOpen: boolean;
  indicators: any;
  onClose: () => void;
}

const IndicatorsModal: React.FC<IndicatorsModalProps> = ({ isOpen, indicators, onClose }) => {
  if (!isOpen || !indicators) return null;

  const round = (value: number, decimals: number = 2) => {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  };

  const indicatorGroups = [
    {
      title: 'Moving Averages',
      items: [
        { label: 'EMA 50', value: round(indicators.ema50), color: 'text-blue-400' },
        { label: 'EMA 200', value: round(indicators.ema200), color: 'text-purple-400' },
        { label: 'Prev EMA 50', value: round(indicators.prevEma50), color: 'text-blue-300' },
        { label: 'Prev EMA 200', value: round(indicators.prevEma200), color: 'text-purple-300' }
      ]
    },
    {
      title: 'Price & Structure',
      items: [
        { label: 'Current Price', value: round(indicators.currentPrice), color: 'text-white' },
        { label: 'Price Change', value: round(indicators.priceChange), color: indicators.priceChange > 0 ? 'text-green-400' : 'text-red-400' },
        { label: 'Breaking High', value: indicators.isBreakingHigh ? 'YES' : 'NO', color: indicators.isBreakingHigh ? 'text-green-400' : 'text-gray-500' },
        { label: 'Breaking Low', value: indicators.isBreakingLow ? 'YES' : 'NO', color: indicators.isBreakingLow ? 'text-red-400' : 'text-gray-500' }
      ]
    },
    {
      title: 'Support & Resistance',
      items: [
        { label: 'Support Level', value: round(indicators.supportLevel), color: 'text-green-400' },
        { label: 'Resistance Level', value: round(indicators.resistanceLevel), color: 'text-red-400' }
      ]
    },
    {
      title: 'Volume Analysis',
      items: [
        { label: 'Current Volume', value: round(indicators.currentVolume, 0), color: 'text-white' },
        { label: 'Avg Volume (20)', value: round(indicators.avgVolume, 0), color: 'text-gray-300' },
        { label: 'Bid Volume', value: round(indicators.bidVolume, 2), color: 'text-green-400' },
        { label: 'Ask Volume', value: round(indicators.askVolume, 2), color: 'text-red-400' }
      ]
    },
    {
      title: 'Momentum & Volatility',
      items: [
        { label: 'RSI (14)', value: round(indicators.rsi), color: 'text-yellow-400' },
        { label: 'ATR (14)', value: round(indicators.atr, 2), color: 'text-orange-400' },
        { label: 'Order Book Imbalance', value: round(indicators.obi * 100, 2) + '%', color: indicators.obi > 0 ? 'text-green-400' : 'text-red-400' },
        { label: 'Spread', value: round(indicators.spread, 2), color: 'text-white' }
      ]
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
        <div className="glass rounded-2xl p-8 max-w-4xl w-full max-h-[85vh] overflow-y-auto pointer-events-auto shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-blue-400" />
              <h2 className="text-3xl font-bold text-white">Market Indicators</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Grid of Indicator Groups */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {indicatorGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-4 pb-3 border-b border-white/10">
                  {group.title}
                </h3>
                <div className="space-y-3">
                  {group.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">{item.label}</span>
                      <span className={`text-sm font-bold ${item.color}`}>
                        {typeof item.value === 'number' ? item.value.toFixed(typeof item.value > 100 ? 0 : 2) : item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Close Button */}
          <div className="mt-8 flex justify-end">
            <button 
              onClick={onClose}
              className="py-3 px-6 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold text-white uppercase tracking-widest transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default IndicatorsModal;
