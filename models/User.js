const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String },
    centerName: { type: String },
    phoneNumber: { type: String, required: true, unique: true },
    address: { type: String },
    countryCode: { type: String, required: true },
    dateOfBirth: { type: Date },
    password: { type: String, required: true },
    otp: { type: String },
    otp_expires_at: { type: Date },
    dairyId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userTotalMilkEntry: { type: Number, default: 0 },
    totalMilkEntry: { type: Number, default: 0 },
    totalCustomer: { type: Number, default: 0 },
    registerStartDate: { type: Date },
    registerEndDate: { type: Date },
    priceType: { 
      type: Number, 
      enum: [0, 1, 2, 3],
      default: 0,
      comment: '0 = Not Set, 1 = Fixed Price, 2 = SNF (Solid Not Fat), 3 = CLR (Combined Lactometer Reading)'
    },
    userRoleId: { type: String },
    longitude: { type: Number }, // Added
    latitude: { type: Number }, // Added
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
