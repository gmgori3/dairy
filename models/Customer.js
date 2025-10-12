const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    address: { type: String },
    countryCode: { type: String, required: true },
    password: { type: String, required: true },
    otp: { type: String },
    otp_expires_at: { type: Date },
    dairyId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    priceType: { 
      type: Number, 
      enum: [0, 1, 2, 3], // 0: Not Set, 1: Fixed Price, 2: SNF, 3: CLR
      default: 0,
      comment: '0 = Not Set, 1 = Fixed Price, 2 = SNF (Solid Not Fat), 3 = CLR (Combined Lactometer Reading)'
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", CustomerSchema);