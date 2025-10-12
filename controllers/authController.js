const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Country = require("../models/Country");
const moment = require("moment");
const responseHandler = require("../helper/responseHandler");

// Helper to generate token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, phoneNumber: user.phoneNumber }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// ✅ Register Dairy
exports.registerDairy = async (req, res) => {
  try {
    const { fullName, email, address,countryCode, phoneNumber, centerName, dateOfBirth } = req.body;

    // Validate required fields
    if (!fullName || !phoneNumber || !centerName || !dateOfBirth) {
      return responseHandler.errorResponse(res, "Missing required fields", [], 400);
    }

    const existing = await User.findOne({ phoneNumber });
    if (existing) {
      return responseHandler.errorResponse(res, "Phone number already registered", [], 400);
    }

    const password = "0099";
    const hashedPassword = await bcrypt.hash(password, 10);

    const dairy = await User.create({
      fullName,
      email,
      address,
      countryCode,
      phoneNumber,
      centerName,
      dateOfBirth: moment(dateOfBirth, "DD-MM-YYYY").toDate(),
      otp: password,
      otp_expires_at: moment().add(5, "minutes"),
      password: hashedPassword
    });
    
    const userData = dairy.toObject(); 
    userData.token = generateToken(dairy);

    responseHandler.successResponse(res, "Dairy registered successfully", userData);

  } catch (err) {
    console.error('Registration error:', err);
    responseHandler.errorResponse(res, "Registration failed", err.message, 500);
  }
};


// ✅ Login Dairy
exports.login = async (req, res) => {
  try {
    const { phoneNumber, password, countryCode } = req.body;
    const user = await User.findOne({ phoneNumber, countryCode });
    if (!user) return responseHandler.errorResponse(res, "Invalid credentials", [], 400);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return responseHandler.errorResponse(res, "Invalid credentials", [], 400);

    const userData = user.toObject(); 
    userData.token = generateToken(user);

    responseHandler.successResponse(res, "Login successful", userData);
  } catch (err) {
    responseHandler.errorResponse(res, "Login failed", err.message, 500);
  }
};

// ✅ Logout (frontend just removes token, but here simulate revoke)
exports.logout = async (req, res) => {
  responseHandler.successResponse(res, "Logout successful (remove token on client)");
};

// ✅ Login with OTP
exports.loginWithOtp = async (req, res) => {
  try {
    const { phoneNumber, countryCode, otp } = req.body;
    const user = await User.findOne({ phoneNumber, countryCode });

    if (user && user.otp === otp && moment().isSameOrBefore(user.otp_expires_at)) {
      user.otp = null;
      user.otp_expires_at = null;
      await user.save();
      const userData = user.toObject();
      userData.token = generateToken(userData);
      responseHandler.successResponse(res, "Login successful", userData);
    } else {
      responseHandler.errorResponse(res, "Invalid OTP or expired", [], 400);
    }
  } catch (err) {
    responseHandler.errorResponse(res, "OTP login failed", err.message, 500);
  }
};

// ✅ Delete Dairy
exports.deleteDairy = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findById(id);
    if (!user) return responseHandler.errorResponse(res, "Dairy not found", [], 404);

    await user.deleteOne();
    responseHandler.successResponse(res, "Dairy deleted successfully");
  } catch (err) {
    responseHandler.errorResponse(res, "Delete failed", err.message, 500);
  }
};

// ✅ Update Dairy
exports.dairyUpdate = async (req, res) => {
  try {
    const { dairyId, fullName, email, address, countryCode, phoneNumber, centerName, dateOfBirth } = req.body;

    // Validate dairyId
    if (!dairyId) {
      return responseHandler.errorResponse(res, "Dairy ID is required", [], 400);
    }

    // Check if dairy exists
    const dairy = await User.findById(dairyId);
    if (!dairy) {
      return responseHandler.errorResponse(res, "Dairy not found", [], 404);
    }

    // If phoneNumber is being updated, check if it's already taken by another user
    if (phoneNumber && phoneNumber !== dairy.phoneNumber) {
      const existing = await User.findOne({ phoneNumber, _id: { $ne: dairyId } });
      if (existing) {
        return responseHandler.errorResponse(res, "Phone number already registered", [], 400);
      }
    }

    // Prepare update data
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;
    if (address) updateData.address = address;
    if (countryCode) updateData.countryCode = countryCode;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (centerName) updateData.centerName = centerName;
    if (dateOfBirth) updateData.dateOfBirth = moment(dateOfBirth, "DD-MM-YYYY").toDate();

    // Update dairy
    const updatedDairy = await User.findByIdAndUpdate(
      dairyId,
      updateData,
      { new: true, runValidators: true }
    );

    const userData = updatedDairy.toObject();
    delete userData.password; 

    responseHandler.successResponse(res, "Dairy updated successfully", userData);

  } catch (err) {
    console.error('Update error:', err);
    responseHandler.errorResponse(res, "Update failed", err.message, 500);
  }
};


// ✅ Get Country Codes
exports.getCountryCode = async (req, res) => {
  try {
    const countries = await Country.find();
    responseHandler.successResponse(res, "Country data found", countries);
  } catch (err) {
    responseHandler.errorResponse(res, "Error fetching countries", err.message, 500);
  }
};
