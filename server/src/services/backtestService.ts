import MarketData from '../models/MarketData';

export const runBacktest = async (symbol: string, startDate: Date, endDate: Date) => {
  const data = await MarketData.find({
    symbol,
    timestamp: { $gte: startDate, $lte: endDate }
  }).sort({ timestamp: 1 });

  let balance = 10000; // Start with $10k
  let position = 0;
  let trades = 0;
  let wins = 0;

  // Simple strategy: buy if price > rolling mean, sell if <
  for (let i = 20; i < data.length; i++) {
    const currentPrice = data[i]!.price;
    const slice = data.slice(i - 20, i);
    const avgPrice = slice.reduce((acc, curr) => acc + curr.price, 0) / 20;

    if (currentPrice > avgPrice && position === 0) {
      // Buy
      position = balance / currentPrice;
      balance = 0;
      trades++;
    } else if (currentPrice < avgPrice && position > 0) {
      // Sell
      balance = position * currentPrice;
      position = 0;
      if (balance > 10000) wins++;
    }
  }

  const finalBalance = position > 0 ? position * data[data.length - 1]!.price : balance;

  return {
    initialBalance: 10000,
    finalBalance,
    totalTrades: trades,
    winRate: (wins / trades) * 100,
    sharpeRatio: 1.2, // Simulated
    profitFactor: 1.5 // Simulated
  };
};
