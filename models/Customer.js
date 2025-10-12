const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    centerName: { type: String },
    phoneNumber: { type: String, required: true, unique: true },
    address: { type: String },
    countryCode: { type: String, required: true },
    dateOfBirth: { type: Date },
    password: { type: String, required: true },
    otp: { type: String },
    otp_expires_at: { type: Date },
    dairyId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    fixPrice: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", CustomerSchema);