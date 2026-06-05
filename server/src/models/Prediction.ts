import mongoose, { Schema, Document } from 'mongoose';

export interface IPrediction extends Document {
  symbol: string;
  signal: 'BUY' | 'SELL' | 'NEUTRAL';
  confidence: number;
  strength: 'VERY LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY HIGH';
  reasons: string[];
  timeframe: string;
  timestamp: Date;
}

const PredictionSchema: Schema = new Schema({
  symbol: { type: String, required: true, index: true },
  signal: { type: String, enum: ['BUY', 'SELL', 'NEUTRAL'], required: true },
  confidence: { type: Number, required: true },
  strength: { type: String, required: true },
  reasons: [{ type: String }],
  timeframe: { type: String, default: '1m' },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IPrediction>('Prediction', PredictionSchema);
