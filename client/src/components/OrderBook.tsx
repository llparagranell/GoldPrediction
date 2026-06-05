import React from 'react';

interface OrderBookProps {
  bids: number[][];
  asks: number[][];
}

const OrderBook: React.FC<OrderBookProps> = ({ bids, asks }) => {
  const maxVolume = Math.max(
    ...bids.map(b => b[1] || 0),
    ...asks.map(a => a[1] || 0)
  );

  return (
    <div className="glass p-6 rounded-3xl h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="label italic">Order Depth</h3>
        <div className="flex items-center space-x-2 text-[9px] font-bold text-gray-600">
            <span className="w-2 h-2 rounded-full bg-buy/20 animate-pulse"></span>
            <span>Real-time</span>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden premium-scrollbar font-mono">
        <div className="grid grid-cols-2 gap-4 label mb-3 border-b border-white/5 pb-2">
           <span>Price</span>
           <span className="text-right">Amount</span>
        </div>

        {/* Asks (Sell Orders) */}
        <div className="flex flex-col-reverse mb-6">
          {asks.slice(0, 15).map((ask, i) => (
            <div key={i} className="relative flex justify-between text-[11px] py-1 px-3 group hover:bg-white/[0.04] transition-colors rounded-lg overflow-hidden">
              <div 
                className="absolute right-0 top-0 bottom-0 bg-sell/10 transition-all duration-500 border-r-2 border-sell/40"
                style={{ width: `${(ask[1] / maxVolume) * 100}%` }}
              />
              <span className="text-sell font-black italic z-10 price">{ask[0].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              <span className="text-gray-300 font-bold z-10 price">{ask[1].toFixed(4)}</span>
            </div>
          ))}
        </div>

        {/* Spread / Mid Market */}
        <div className="py-3 px-4 my-2 glass rounded-2xl border-accent/20 border-dashed bg-accent/5 flex items-center justify-center space-x-4">
            <div className="label text-accent italic">Mid Price</div>
            <div className="text-lg font-black text-white italic tracking-tighter price">
                {(((bids[0]?.[0] || 0) + (asks[0]?.[0] || 0)) / 2).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </div>
        </div>

        {/* Bids (Buy Orders) */}
        <div className="flex flex-col">
          {bids.slice(0, 15).map((bid, i) => (
            <div key={i} className="relative flex justify-between text-[11px] py-1 px-3 group hover:bg-white/[0.04] transition-colors rounded-lg overflow-hidden">
              <div 
                className="absolute right-0 top-0 bottom-0 bg-buy/10 transition-all duration-500 border-r-2 border-buy/40"
                style={{ width: `${(bid[1] / maxVolume) * 100}%` }}
              />
              <span className="text-buy font-black italic z-10 price">{bid[0].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              <span className="text-gray-300 font-bold z-10 price">{bid[1].toFixed(4)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
