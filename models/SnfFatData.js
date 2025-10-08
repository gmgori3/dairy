// models/SnfFatData.js
const mongoose = require("mongoose");

const snfFatDataSchema = new mongoose.Schema({
  snf: { type: Number, required: true },
  fat: { type: Number, required: true },
  value: { type: Number, default: 0 },
  categorychart_id: { type: Number, default: 0 },
  dairy_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.model("SnfFatData", snfFatDataSchema);
