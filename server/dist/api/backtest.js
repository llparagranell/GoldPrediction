"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const backtestService_1 = require("../services/backtestService");
const router = express_1.default.Router();
router.post('/run', async (req, res) => {
    try {
        const { symbol, startDate, endDate } = req.body;
        const results = await (0, backtestService_1.runBacktest)(symbol, new Date(startDate), new Date(endDate));
        res.json(results);
    }
    catch (err) {
        res.status(500).send('Server Error');
    }
});
exports.default = router;
