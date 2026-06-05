import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderFlow extends Document {
  symbol: string;
  buyVolume: number;
  sellVolume: number;
  delta: number;
  imbalance: number;
  timestamp: Date;
}

const OrderFlowSchema: Schema = new Schema({
  symbol: { type: String, required: true, index: true },
  buyVolume: { type: Number, required: true },
  sellVolume: { type: Number, required: true },
  delta: { type: Number, required: true },
  imbalance: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IOrderFlow>('OrderFlow', OrderFlowSchema);
