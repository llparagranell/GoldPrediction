import React from 'react';
import { X } from 'lucide-react';

interface TradeModalProps {
  isOpen: boolean;
  tradePlan: any;
  onClose: () => void;
}

const TradeModal: React.FC<TradeModalProps> = ({ isOpen, tradePlan, onClose }) => {
  if (!isOpen || !tradePlan) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
        <div className="glass rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Trade Plan</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {tradePlan.signal === 'REJECT' && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl mb-4">
              <p className="text-red-400 font-semibold text-center">{tradePlan.summary}</p>
            </div>
          )}

          {tradePlan.signal === 'NO_TRADE' && (
            <div className="p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-xl mb-4">
              <p className="text-yellow-400 font-semibold text-center">{tradePlan.summary}</p>
            </div>
          )}

          {tradePlan.signal === 'BUY' && (
            <div className="space-y-6">
              {/* Entry & Stop Loss */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <p className="text-xs text-gray-400 mb-2 font-semibold">Entry Price</p>
                  <p className="text-3xl font-bold text-green-400">${tradePlan.entryPrice.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <p className="text-xs text-gray-400 mb-2 font-semibold">Stop Loss</p>
                  <p className="text-3xl font-bold text-red-400">${tradePlan.stopLoss.toFixed(2)}</p>
                </div>
              </div>

              {/* Risk Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                  <p className="text-xs text-gray-400 mb-2 font-semibold">Risk %</p>
                  <p className={`text-3xl font-bold ${tradePlan.isHighRisk ? 'text-red-400' : 'text-white'}`}>
                    {tradePlan.riskPercent.toFixed(2)}%
                  </p>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                  <p className="text-xs text-gray-400 mb-2 font-semibold">Trailing Stop</p>
                  <p className="text-3xl font-bold text-white">±${tradePlan.trailingStop.trailBy.toFixed(2)}</p>
                </div>
              </div>

              {/* Target Levels */}
              <div>
                <p className="text-lg font-semibold text-white mb-4">Profit Targets</p>
                <div className="space-y-2">
                  {tradePlan.targets.map((target: any) => (
                    <div key={target.level} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between hover:bg-white/10 transition">
                      <span className="text-sm font-semibold text-gray-300">Target {target.level} <span className="text-gray-500">({target.exitPercent}% exit)</span></span>
                      <span className="text-2xl font-bold text-white">${target.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <p className="text-sm text-blue-300 leading-relaxed">{tradePlan.summary}</p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <button 
                  onClick={onClose}
                  className="py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold text-white uppercase tracking-widest transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={onClose}
                  className="py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold uppercase tracking-widest transition shadow-lg shadow-green-500/30"
                >
                  Confirm Trade
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TradeModal;
