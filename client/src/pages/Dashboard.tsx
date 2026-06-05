import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import PredictionPanel from '../components/PredictionPanel';
import OrderBook from '../components/OrderBook';
import MarketCharts from '../components/MarketCharts';
import SentimentPanel from '../components/SentimentPanel';
import NewsPanel from '../components/NewsPanel';
import { useMarketStore } from '../store/useStore';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Dashboard: React.FC = () => {
  const { setMarketData, setSentiment, symbol, bids, asks, prediction, sentiment } = useMarketStore();
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Notify server of initial or changed symbol
    socket.emit('subscribe', symbol.toLowerCase());

    socket.on('marketUpdate', (data) => {
      setMarketData(data);
      
      setChartData(prev => {
        const newData = [...prev, { time: new Date().toLocaleTimeString(), price: data.bids[0]?.[0] || 0 }];
        return newData.slice(-30); // Keep last 30 points
      });
    });

    socket.on('sentimentUpdate', (data) => {
      setSentiment(data);
    });

    return () => {
      socket.off('marketUpdate');
      socket.off('sentimentUpdate');
    };
  }, [symbol]);

  return (
    <div className="min-h-screen flex flex-col bg-dark text-white font-sans selection:bg-accent selection:text-dark uppercase tracking-tight">
      <Header />
      
      <main className="flex-1 px-4 py-5 md:px-6 md:py-6 lg:px-8 lg:py-8 space-y-6 md:space-y-8 max-w-[1920px] mx-auto w-full">
        {/* Top Section: Charts and Panels */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 xl:gap-8 flex-1">
          {/* Left Column: Prediction & Sentiment */}
          <div className="col-span-12 xl:col-span-3 flex flex-col gap-6">
            <div className="flex-1">
              <PredictionPanel prediction={prediction} />
            </div>
            <div className="flex-1">
              <SentimentPanel sentiment={sentiment} />
            </div>
          </div>

          {/* Middle Column: Chart */}
          <div className="col-span-12 xl:col-span-6 min-h-[420px] md:min-h-[520px] flex flex-col">
            <MarketCharts data={chartData} />
          </div>

          {/* Right Column: Order Book */}
          <div className="col-span-12 xl:col-span-3 min-h-[420px] md:min-h-[520px] flex flex-col">
            <OrderBook bids={bids} asks={asks} />
          </div>
        </div>

        {/* Bottom Section: News */}
        <div className="h-[420px] md:h-[520px] w-full">
          <NewsPanel />
        </div>
      </main>

      <footer className="border-t border-white/5 bg-premium/55 backdrop-blur-sm px-4 py-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 text-[11px] text-white/70">
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-buy animate-pulse" /> Network Stable
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-accent" /> AI Neural Core v4.2
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-[11px] text-white/60">
          <span>© 2026 GOLD PREDICTION SYSTEMS</span>
          <span className="text-accent/60 italic font-semibold">STAY DISCIPLINED</span>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
