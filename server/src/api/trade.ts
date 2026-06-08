import express from 'express';
import computeBuyTradePlan from '../ai/tradeManager';

const router = express.Router();

// POST /api/trade/plan
router.post('/plan', (req, res) => {
  try {
    const { entryPrice, atr, supportLevel, resistanceLevel, riskRewardRatio, last15mClose } = req.body;
    if (typeof entryPrice !== 'number' || typeof atr !== 'number') {
      return res.status(400).json({ error: 'entryPrice and atr are required numeric fields' });
    }

    const plan = computeBuyTradePlan({ entryPrice, atr, supportLevel, resistanceLevel, riskRewardRatio, last15mClose });
    res.json(plan);
  } catch (err) {
    console.error('Error computing trade plan', err);
    res.status(500).json({ error: 'Server error computing trade plan' });
  }
});

export default router;
