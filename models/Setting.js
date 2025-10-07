const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    dairyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    snf: { type: Number, required: true },
    clr: { type: Number, required: true },
    fat: { type: Number, required: true },
    pricePerKg: { type: Number, required: true },
    entryDate: { type: Date, required: true },
    milkType: { type: String, enum: ["cow", "buffalo"], required: true },
    shift: { type: String, enum: ["morning", "evening"], required: true },
    totalPrice: { type: Number, required: true },
    milkWeight: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Setting", settingSchema);
