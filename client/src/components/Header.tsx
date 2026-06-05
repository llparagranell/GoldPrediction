import React from 'react';
import { Activity, Wifi, TrendingUp, BarChart3, Zap } from 'lucide-react';
import { useMarketStore } from '../store/useStore';

const Header: React.FC = () => {
  const { price } = useMarketStore();

  return (
    <header className="border-b border-border-premium bg-premium/95 backdrop-blur-2xl px-4 py-4 sm:px-6 sm:py-4 sticky top-0 z-50">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="w-11 h-11 bg-accent shadow-[0_0_26px_rgba(0,255,204,0.22)] rounded-2xl flex items-center justify-center transition-transform duration-300 hover:-translate-y-0.5 cursor-pointer">
            <Activity className="text-dark w-5 h-5" />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-xl sm:text-2xl font-bold tracking-[-0.04em] leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Gold<span className="text-accent text-glow-accent">Prediction</span>
            </h1>
            <span className="label mt-1 text-[10px] sm:text-[11px]">Professional Trading Engine</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-6">
          <div className="flex flex-col items-center">
            <span className="label mb-1 flex items-center gap-1 text-xs">
              <TrendingUp className="w-3 h-3 text-buy" /> 24H High
            </span>
            <span className="text-sm font-semibold price text-white/90">{price ? (price * 1.024).toFixed(2) : '—'}</span>
          </div>
          <div className="w-px h-8 bg-white/[0.07]" />
          <div className="flex flex-col items-center">
            <span className="label mb-1 flex items-center gap-1 text-xs">
              <TrendingUp className="w-3 h-3 text-sell rotate-180" /> 24H Low
            </span>
            <span className="text-sm font-semibold price text-white/90">{price ? (price * 0.985).toFixed(2) : '—'}</span>
          </div>
          <div className="w-px h-8 bg-white/[0.07]" />
          <div className="flex flex-col items-center">
            <span className="label mb-1 flex items-center gap-1 text-xs">
              <BarChart3 className="w-3 h-3 text-accent" /> Volume 24H
            </span>
            <span className="text-sm font-semibold price text-white/90">12.4M</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          {price > 0 && (
            <div className="flex flex-col items-end min-w-[110px]">
              <span className="label mb-0.5 text-[10px]">Live Price</span>
              <span className="text-lg sm:text-xl font-bold price text-accent text-glow-accent" style={{ fontFamily: "'Space Mono', monospace", letterSpacing: '0.01em' }}>
                ${price.toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 px-3 py-2 glass rounded-2xl min-w-[120px]">
            <div className="relative">
              <Wifi className="w-4 h-4 text-accent" />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-buy animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-white/70 leading-none">LIVE</span>
              <span className="text-[9px] text-accent/60 font-semibold uppercase tracking-widest leading-none mt-0.5">16ms</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-buy/[0.08] border border-buy/[0.12] rounded-2xl min-w-[120px]">
            <Zap className="w-4 h-4 text-buy" />
            <span className="text-[10px] font-bold text-buy uppercase tracking-wider">Engine Active</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
