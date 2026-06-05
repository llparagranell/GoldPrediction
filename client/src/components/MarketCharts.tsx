import React, { useEffect, useRef } from 'react';
import { useMarketStore } from '../store/useStore';

declare global {
  interface Window {
    TradingView: any;
  }
}

interface MarketChartsProps {
  data: any[];
}

const MarketCharts: React.FC<MarketChartsProps> = () => {
  const { symbol } = useMarketStore();
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (container.current && window.TradingView) {
        let tvSymbol = symbol;
        if (symbol === 'PAXGUSDT') tvSymbol = 'OANDA:XAUUSD';
        else if (symbol.endsWith('USDT')) tvSymbol = `BINANCE:${symbol}`;

        new window.TradingView.widget({
          "autosize": true,
          "symbol": tvSymbol,
          "interval": "1",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "toolbar_bg": "#f1f3f6",
          "enable_publishing": false,
          "hide_top_toolbar": false,
          "allow_symbol_change": true,
          "container_id": "tradingview_chart",
          "backgroundColor": "rgba(10, 10, 10, 0.5)",
          "gridColor": "rgba(255, 255, 255, 0.05)",
          "save_image": false,
          "details": true,
          "hotlist": true,
          "calendar": true,
          "show_popup_button": true,
          "popup_width": "1000",
          "popup_height": "650"
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      // Clean up script if necessary, though tv.js usually handles itself
    };
  }, [symbol]);

  return (
    <div className="glass p-4 rounded-3xl h-full flex flex-col overflow-hidden shadow-2xl">
      <div id="tradingview_chart" ref={container} className="flex-1 w-full rounded-2xl overflow-hidden" />
    </div>
  );
};

export default MarketCharts;
