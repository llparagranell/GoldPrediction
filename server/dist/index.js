"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
exports.io = io;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Connect Database
(0, db_1.default)();
// API Routes
const auth_1 = __importDefault(require("./api/auth"));
const market_1 = __importDefault(require("./api/market"));
const backtest_1 = __importDefault(require("./api/backtest"));
app.use('/api/auth', auth_1.default);
app.use('/api/market', market_1.default);
app.use('/api/backtest', backtest_1.default);
// Global Market Data Stream Management
const binanceCollector_1 = require("./websocket/binanceCollector");
const oandaCollector_1 = require("./websocket/oandaCollector");
let currentStream = null;
let currentSymbol = 'paxgusdt';
const startStream = (symbol) => {
    if (currentStream) {
        currentStream.close();
    }
    currentSymbol = symbol;
    if (symbol === 'xauusd' || symbol === 'xau_usd') {
        const oanda = (0, oandaCollector_1.startOandaPricing)(io, 'XAU_USD');
        if (oanda) {
            currentStream = oanda;
            return;
        }
        // Fallback to Binance if OANDA fails/missing keys
        symbol = 'paxgusdt';
    }
    currentStream = (0, binanceCollector_1.initBinanceStream)(io, symbol);
};
// Start Initial Stream (Gold)
startStream(currentSymbol);
// Socket.io connection
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    socket.on('subscribe', (symbol) => {
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
const sentimentService_1 = require("./services/sentimentService");
(0, sentimentService_1.startSentimentService)(io);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
