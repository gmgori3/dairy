import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Country from "../models/Country.js";
import moment from "moment";
import responseHandler from "../helper/responseHandler.js";

// Helper to generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, phoneNumber: user.phoneNumber }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// ✅ Login Dairy
export const login = async (req, res) => {
  try {
    const { phoneNumber, password, countryCode } = req.body;
    const user = await User.findOne({ phoneNumber, countryCode });
    if (!user) return responseHandler.errorResponse(res, "Invalid credentials", [], 400);

    if (!user.isActive) return responseHandler.errorResponse(res, "User is inactive", [], 403);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return responseHandler.errorResponse(res, "Invalid credentials", [], 400);

    const userData = user.toObject();
    userData.token = generateToken(user);

    responseHandler.successResponse(res, "Login successful", userData);
  } catch (err) {
    responseHandler.errorResponse(res, "Login failed", err.message, 500);
  }
};

// ✅ Register Dairy
export const registerDairy = async (req, res) => {
  try {
    const { fullName, email, address, countryCode, phoneNumber, centerName, dateOfBirth, longitude, latitude } = req.body;

    if (!fullName || !phoneNumber || !centerName || !dateOfBirth) {
      return responseHandler.errorResponse(res, "Missing required fields", [], 400);
    }

    const existing = await User.findOne({ phoneNumber });
    if (existing) return responseHandler.errorResponse(res, "Phone number already registered", [], 400);

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
      password: hashedPassword,
      longitude,
      latitude
    });

    const userData = dairy.toObject();
    userData.token = generateToken(dairy);

    responseHandler.successResponse(res, "Dairy registered successfully", userData);
  } catch (err) {
    console.error('Registration error:', err);
    responseHandler.errorResponse(res, "Registration failed", err.message, 500);
  }
};

// ✅ Logout
export const logout = async (req, res) => {
  responseHandler.successResponse(res, "Logout successful (remove token on client)");
};

// ✅ Update Dairy
export const dairyUpdate = async (req, res) => {
  try {
    const { dairyId, fullName, email, address, countryCode, phoneNumber, centerName, dateOfBirth, longitude, latitude } = req.body;

    if (!dairyId) return responseHandler.errorResponse(res, "Dairy ID is required", [], 400);

    const dairy = await User.findById(dairyId);
    if (!dairy) return responseHandler.errorResponse(res, "Dairy not found", [], 404);

    if (phoneNumber && phoneNumber !== dairy.phoneNumber) {
      const existing = await User.findOne({ phoneNumber, _id: { $ne: dairyId } });
      if (existing) return responseHandler.errorResponse(res, "Phone number already registered", [], 400);
    }

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;
    if (address) updateData.address = address;
    if (countryCode) updateData.countryCode = countryCode;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (centerName) updateData.centerName = centerName;
    if (dateOfBirth) updateData.dateOfBirth = moment(dateOfBirth, "DD-MM-YYYY").toDate();
    if (longitude) updateData.longitude = longitude;
    if (latitude) updateData.latitude = latitude;

    const updatedDairy = await User.findByIdAndUpdate(dairyId, updateData, { new: true, runValidators: true });

    const userData = updatedDairy.toObject();
    delete userData.password;

    responseHandler.successResponse(res, "Dairy updated successfully", userData);
  } catch (err) {
    console.error('Update error:', err);
    responseHandler.errorResponse(res, "Update failed", err.message, 500);
  }
};

// ✅ Delete Dairy
export const deleteDairy = async (req, res) => {
  try {
    const { dairyId } = req.body;
    const user = await User.findById(dairyId);
    if (!user) return responseHandler.errorResponse(res, "Dairy not found", [], 404);

    user.isActive = false;
    await user.save();

    responseHandler.successResponse(res, "Dairy soft deleted successfully");
  } catch (err) {
    responseHandler.errorResponse(res, "Delete failed", err.message, 500);
  }
};

// ✅ Get Country Codes
export const getCountryCode = async (req, res) => {
  try {
    const countries = await Country.find();
    responseHandler.successResponse(res, "Country data found", countries);
  } catch (err) {
    responseHandler.errorResponse(res, "Error fetching countries", err.message, 500);
  }
};
