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
    const { firstName, countryCode, phoneNumber, centerName, dateOfBirth } = req.body;
    const existing = await User.findOne({ phoneNumber });
    if (existing) return responseHandler.errorResponse(res, "Phone number already registered", [], 400);

    const password = "0099";
    const hashedPassword = await bcrypt.hash(password, 10);

    const dairy = await User.create({
      firstName,
      countryCode,
      phoneNumber,
      centerName,
      dateOfBirth: moment(dateOfBirth, "DD-MM-YYYY").toDate(),
      otp: password,
      otp_expires_at: moment().add(5, "minutes"),
      password: hashedPassword
    });

    responseHandler.successResponse(res, "Dairy registered successfully", { dairy, token: generateToken(dairy) }, 201);
  } catch (err) {
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

    responseHandler.successResponse(res, "Login successful", { user, token: generateToken(user) });
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

      responseHandler.successResponse(res, "Login successful", { token: generateToken(user) });
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
    const { id, firstName, countryCode, phoneNumber, dateOfBirth } = req.body;
    const dairy = await User.findById(id);
    if (!dairy) return responseHandler.errorResponse(res, "Dairy not found", [], 404);

    dairy.firstName = firstName;
    dairy.countryCode = countryCode;
    dairy.phoneNumber = phoneNumber;
    dairy.dateOfBirth = moment(dateOfBirth, "DD-MM-YYYY").toDate();

    await dairy.save();
    responseHandler.successResponse(res, "Dairy updated successfully", dairy);
  } catch (err) {
    responseHandler.errorResponse(res, "Update failed", err.message, 500);
  }
};

// ✅ Register Customer
exports.registerCustomer = async (req, res) => {
  try {
    const { firstName, countryCode, phoneNumber, dairyId } = req.body;
    const existing = await User.findOne({ phoneNumber });
    if (existing) return responseHandler.errorResponse(res, "Phone number already used", [], 400);

    const customer = await User.create({ firstName, countryCode, phoneNumber, dairyId });
    await User.findByIdAndUpdate(dairyId, { $inc: { totalCustomer: 1 } });

    responseHandler.successResponse(res, "Customer registered successfully", customer);
  } catch (err) {
    responseHandler.errorResponse(res, "Customer register failed", err.message, 500);
  }
};

// ✅ Get Dairy Customers
exports.dairyCustomerDetail = async (req, res) => {
  try {
    const { dairyId } = req.body;
    const customers = await User.find({ dairyId }).select("id firstName lastName phoneNumber");

    if (!customers.length) return responseHandler.errorResponse(res, "No customers found", [], 404);

    responseHandler.successResponse(res, "Customers found", customers);
  } catch (err) {
    responseHandler.errorResponse(res, "Error fetching customers", err.message, 500);
  }
};

// ✅ Update Customer
exports.dairyCustomerUpdate = async (req, res) => {
  try {
    const { id, firstName, countryCode, phoneNumber } = req.body;
    const customer = await User.findById(id);
    if (!customer) return responseHandler.errorResponse(res, "Customer not found", [], 404);

    customer.firstName = firstName;
    customer.countryCode = countryCode;
    customer.phoneNumber = phoneNumber;

    await customer.save();
    responseHandler.successResponse(res, "Customer updated successfully", customer);
  } catch (err) {
    responseHandler.errorResponse(res, "Update failed", err.message, 500);
  }
};

// ✅ Delete Customer
exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.body;
    const customer = await User.findById(id);
    if (!customer) return responseHandler.errorResponse(res, "Customer not found", [], 404);

    await User.findByIdAndUpdate(customer.dairyId, { $inc: { totalCustomer: -1 } });
    await customer.deleteOne();

    responseHandler.successResponse(res, "Customer deleted successfully");
  } catch (err) {
    responseHandler.errorResponse(res, "Delete failed", err.message, 500);
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
