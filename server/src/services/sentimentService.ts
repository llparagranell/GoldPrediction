import axios from 'axios';

let sentimentCache = {
  sentiment: 'Neutral' as 'Bullish' | 'Bearish' | 'Neutral',
  score: 50,
  timestamp: Date.now()
};

export const getMarketSentiment = async () => {
  // In a real app, you would fetch from NewsAPI or Twitter
  // For this demo, we'll return a simulated bullish sentiment
  const sentiment = {
    sentiment: 'Bullish' as const,
    score: 82,
    timestamp: Date.now()
  };
  sentimentCache = sentiment;
  return sentiment;
};

export const getCurrentSentiment = () => sentimentCache;

export const startSentimentService = (io: any) => {
  // Initial fetch
  getMarketSentiment().then(s => io.emit('sentimentUpdate', s));

  setInterval(async () => {
    const sentiment = await getMarketSentiment();
    io.emit('sentimentUpdate', sentiment);
  }, 60000); // Every minute
};
