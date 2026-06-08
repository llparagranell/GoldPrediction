import express from 'express';
import Prediction from '../models/Prediction';
import MarketData from '../models/MarketData';
import News from '../models/News';
import { auth } from '../middleware/auth';

const router = express.Router();

// Server health check
router.get('/health', async (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: Date.now() });
});

// Get recent predictions
router.get('/predictions', async (req, res) => {
  try {
    const predictions = await Prediction.find().sort({ timestamp: -1 }).limit(50);
    res.json(predictions);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get recent market data
router.get('/market', async (req, res) => {
  try {
    const data = await MarketData.find().sort({ timestamp: -1 }).limit(100);
    res.json(data);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get recent news
router.get('/news', async (req, res) => {
  try {
    const news = await News.find().sort({ timestamp: -1 }).limit(20);
    res.json(news);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

export default router;
