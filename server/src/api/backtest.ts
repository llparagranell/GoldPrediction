import express from 'express';
import { runBacktest } from '../services/backtestService';

const router = express.Router();

router.post('/run', async (req, res) => {
  try {
    const { symbol, startDate, endDate } = req.body;
    const results = await runBacktest(symbol, new Date(startDate), new Date(endDate));
    res.json(results);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

export default router;
