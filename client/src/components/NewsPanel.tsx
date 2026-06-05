import React, { useEffect, useRef } from 'react';
import { useMarketStore } from '../store/useStore';

const NewsPanel: React.FC = () => {
  const { symbol } = useMarketStore();
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Clear previous widget
    if (container.current) {
      container.current.innerHTML = '';
    }

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
    script.async = true;

    // Map internal symbol to TradingView symbol
    let tvSymbol = symbol;
    if (symbol === 'PAXGUSDT' || symbol === 'XAUUSD') tvSymbol = 'OANDA:XAUUSD';
    else if (symbol.endsWith('USDT')) tvSymbol = `BINANCE:${symbol}`;

    script.innerHTML = JSON.stringify({
      "feedMode": "all_symbols",
      "symbol": tvSymbol,
      "colorTheme": "dark",
      "isTransparent": true,
      "displayMode": "regular",
      "width": "100%",
      "height": "100%",
      "locale": "en"
    });

    if (container.current) {
      container.current.appendChild(script);
    }

    return () => {
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [symbol]);

  return (
    <div className="glass p-4 rounded-2xl h-full flex flex-col">
      <h3 className="label mb-4">Market Intelligence</h3>
      <div className="flex-1 overflow-hidden">
        <div ref={container} className="tradingview-widget-container h-full w-full">
          <div className="tradingview-widget-container__widget h-full w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default NewsPanel;
