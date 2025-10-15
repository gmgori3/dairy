// models/SnfFatData.js
import mongoose from "mongoose";

const snfFatDataSchema = new mongoose.Schema({
  snf: { type: Number, required: true },
  fat: { type: Number, required: true },
  value: { type: Number, default: 0 },
  categorychart_id: { type: Number, default: 0 },
  dairy_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export default mongoose.model("SnfFatData", snfFatDataSchema);
