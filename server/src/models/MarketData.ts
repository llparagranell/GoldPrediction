import mongoose, { Schema, Document } from 'mongoose';

export interface IMarketData extends Document {
  symbol: string;
  price: number;
  volume: number;
  timestamp: Date;
}

const MarketDataSchema: Schema = new Schema({
  symbol: { type: String, required: true, index: true },
  price: { type: Number, required: true },
  volume: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IMarketData>('MarketData', MarketDataSchema);
