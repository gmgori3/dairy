const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String }, // new field
    centerName: { type: String },
    phoneNumber: { type: String, required: true, unique: true },
    address: { type: String }, // new field
    countryCode: { type: String, required: true },
    dateOfBirth: { type: Date },
    password: { type: String, required: true },
    otp: { type: String },
    otp_expires_at: { type: Date },
    dairyId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userTotalMilkEntry: { type: Number, default: 0 }, // new field
    totalMilkEntry: { type: Number, default: 0 }, // new field
    totalCustomer: { type: Number, default: 0 },
    registerStartDate: { type: Date }, // new field
    registerEndDate: { type: Date }, // new field
    fixPrice: { type: Number, default: 0 }, // new field
    userRoleId: { type: String }, // new field (could be ObjectId if referencing a Role collection)
    longitude: { type: Number }, // new field
    latitude: { type: Number }, // new field
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true } // ensures automatic update of createdAt & updatedAt fields
);

module.exports = mongoose.model("User", UserSchema);
