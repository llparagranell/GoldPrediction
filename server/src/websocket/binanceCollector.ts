import WebSocket from 'ws';
import { Server } from 'socket.io';
import { calculateIndicators } from '../indicators/analyticsEngine';
import { predictSignal } from '../ai/predictionEngine';

// Maintain state for technical indicators
let candles: any[] = [];
const MAX_CANDLES = 250; // Enough for EMA 200

// Throttling state
let lastUpdate = 0;
const UPDATE_THROTTLE_MS = 500; // Emit max 2 times per second

export const initBinanceStream = (io: Server, symbol: string = 'paxgusdt') => {
  // Subscribe to both Depth and Kline streams
  const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${symbol}@depth20@1000ms/${symbol}@kline_1m`);

  ws.on('open', () => {
    console.log(`[Binance] Connection OPEN for ${symbol}`);
  });

  ws.on('message', async (data: any) => {
    try {
        const msg = JSON.parse(data.toString());
        // console.log(`[Binance] Received message on stream: ${msg.stream}`);
        
        const stream = msg.stream;
        const payload = msg.data;

        if (!stream) {
            console.warn('[Binance] Message missing stream field:', msg);
            return;
        }

        if (stream.includes('@kline')) {
            const k = payload.k;
            if (k.x) {
                candles.push({
                    time: k.t,
                    open: parseFloat(k.o),
                    high: parseFloat(k.h),
                    low: parseFloat(k.l),
                    close: parseFloat(k.c),
                    volume: parseFloat(k.v)
                });
                if (candles.length > MAX_CANDLES) candles.shift();
                console.log(`[Binance] Kline closed. Total candles: ${candles.length}`);
            }
        }

        if (stream.includes('@depth')) {
            const now = Date.now();
            if (now - lastUpdate < UPDATE_THROTTLE_MS) return;
            lastUpdate = now;

            if (!payload) {
                console.warn('[Binance] Depth message missing data/payload');
                return;
            }

            const bids = payload.bids?.map((b: any) => [parseFloat(b[0]), parseFloat(b[1])]) || [];
            const asks = payload.asks?.map((a: any) => [parseFloat(a[0]), parseFloat(a[1])]) || [];

            if (bids.length === 0) return;

            const currentPrice = bids[0]?.[0] || 0;
            const indicators = calculateIndicators(bids, asks, candles, currentPrice);
            const prediction = await predictSignal(indicators);
            
            io.emit('marketUpdate', {
                symbol,
                bids: bids.slice(0, 10),
                asks: asks.slice(0, 10),
                indicators,
                prediction,
                timestamp: now
            });
        }
    } catch (err) {
        console.error('[Binance] Error processing message:', err);
    }
  });

  ws.on('error', (err) => {
    console.error(`[Binance] Stream ERROR (${symbol}):`, err);
  });

  ws.on('close', (code, reason) => {
    console.log(`[Binance] Stream CLOSED for ${symbol}. Code: ${code}, Reason: ${reason}`);
  });

  return ws;
};
