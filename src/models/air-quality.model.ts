import * as mongoose from "mongoose";

export const AirQualitySchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  aqi: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export interface AirQuality extends mongoose.Document {
  id: string;
  location: string;
  aqi: number;
  timestamp: Date;
  createdAt: Date;
}
