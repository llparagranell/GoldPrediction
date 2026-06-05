import mongoose, { Schema, Document } from 'mongoose';

export interface INews extends Document {
  title: string;
  source: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  score: number;
  timestamp: Date;
}

const NewsSchema: Schema = new Schema({
  title: { type: String, required: true },
  source: { type: String, required: true },
  sentiment: { type: String, enum: ['Bullish', 'Bearish', 'Neutral'], required: true },
  score: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<INews>('News', NewsSchema);
