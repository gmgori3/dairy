const mongoose = require("mongoose");

const milkSellerSchema = new mongoose.Schema(
  {
    dairyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // or "Dairy" model if exists
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // link to users
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
    deletedAt: { type: Date, default: null }, // Soft delete equivalent
  },
  { timestamps: true }
);

// Soft delete method
milkSellerSchema.methods.softDelete = function () {
  this.deletedAt = new Date();
  return this.save();
};

module.exports = mongoose.model("MilkSeller", milkSellerSchema);
