import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// API Routes
import authRoutes from './api/auth';
import marketRoutes from './api/market';
import backtestRoutes from './api/backtest';
app.use('/api/auth', authRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/backtest', backtestRoutes);

// Global Market Data Stream Management
import { initBinanceStream } from './websocket/binanceCollector';
import { startOandaPricing } from './websocket/oandaCollector';

let currentStream: any = null;
let currentSymbol = 'paxgusdt';

const startStream = (symbol: string) => {
  if (currentStream) {
    currentStream.close();
  }
  currentSymbol = symbol;

  if (symbol === 'xauusd' || symbol === 'xau_usd') {
    const oanda = startOandaPricing(io, 'XAU_USD');
    if (oanda) {
      currentStream = oanda;
      return;
    }
    // Fallback to Binance if OANDA fails/missing keys
    symbol = 'paxgusdt';
  }

  currentStream = initBinanceStream(io, symbol);
};

// Start Initial Stream (Gold)
startStream(currentSymbol);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  socket.on('subscribe', (symbol: string) => {
    console.log(`Client ${socket.id} requested symbol: ${symbol}`);
    if (symbol !== currentSymbol) {
      startStream(symbol);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start Sentiment Service
import { startSentimentService } from './services/sentimentService';
startSentimentService(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { io };
