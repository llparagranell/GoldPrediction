"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Prediction_1 = __importDefault(require("../models/Prediction"));
const MarketData_1 = __importDefault(require("../models/MarketData"));
const News_1 = __importDefault(require("../models/News"));
const router = express_1.default.Router();
// Get recent predictions
router.get('/predictions', async (req, res) => {
    try {
        const predictions = await Prediction_1.default.find().sort({ timestamp: -1 }).limit(50);
        res.json(predictions);
    }
    catch (err) {
        res.status(500).send('Server Error');
    }
});
// Get recent market data
router.get('/market', async (req, res) => {
    try {
        const data = await MarketData_1.default.find().sort({ timestamp: -1 }).limit(100);
        res.json(data);
    }
    catch (err) {
        res.status(500).send('Server Error');
    }
});
// Get recent news
router.get('/news', async (req, res) => {
    try {
        const news = await News_1.default.find().sort({ timestamp: -1 }).limit(20);
        res.json(news);
    }
    catch (err) {
        res.status(500).send('Server Error');
    }
});
exports.default = router;
