const mongoose = require("mongoose");

const milkBuyerSchema = new mongoose.Schema(
  {
    dairyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // or "Dairy" if you have a Dairy model
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
    shift: { type: String, enum: ["morning", "evening"], required: true },
    milkType: { type: String, enum: ["cow", "buffalo"], required: true },
    totalPrice: { type: Number, required: true },
    milkWeight: { type: Number, required: true },
    deletedAt: { type: Date, default: null } // soft delete equivalent
  },
  { timestamps: true } // createdAt, updatedAt
);

// Soft delete helper (similar to Laravel's SoftDeletes)
milkBuyerSchema.methods.softDelete = function () {
  this.deletedAt = new Date();
  return this.save();
};

module.exports = mongoose.model("MilkBuyer", milkBuyerSchema);
