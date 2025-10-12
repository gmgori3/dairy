const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");
const responseHandler = require("../helper/responseHandler");

// Helper to generate a JWT token for the customer
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, phoneNumber: user.phoneNumber },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// Register Customer
exports.registerCustomer = async (req, res) => {
  try {
    const { firstName, lastName, centerName, phoneNumber, address, countryCode, dateOfBirth, password, dairyId } = req.body;

    // Check if customer already exists based on phone number
    const existing = await Customer.findOne({ phoneNumber });
    if (existing) {
      return responseHandler.errorResponse(res, "Phone number already used", {}, 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await Customer.create({
      firstName,
      lastName,
      centerName,
      phoneNumber,
      address,
      countryCode,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      password: hashedPassword,
      dairyId
    });

    return responseHandler.successResponse(res, "Customer registered successfully", customer, 201);
  } catch (err) {
    return responseHandler.errorResponse(res, "Customer registration failed", err.message, 500);
  }
};

// Login Customer
exports.loginCustomer = async (req, res) => {
  try {
    const { phoneNumber, countryCode, password } = req.body;

    const customer = await Customer.findOne({ phoneNumber, countryCode });
    if (!customer) {
      return responseHandler.errorResponse(res, "Invalid credentials", {}, 400);
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return responseHandler.errorResponse(res, "Invalid credentials", {}, 400);
    }

    const customerData = customer.toObject();
    customerData.token = generateToken(customer);

    return responseHandler.successResponse(res, "Customer logged in successfully", customerData, 200);
  } catch (err) {
    return responseHandler.errorResponse(res, "Customer login failed", err.message, 500);
  }
};

// Update Customer
exports.updateCustomer = async (req, res) => {
  try {
    const { id, firstName, lastName, centerName, phoneNumber, address, countryCode, dateOfBirth, dairyId, fixPrice, isActive } = req.body;
    const customer = await Customer.findById(id);
    if (!customer) {
      return responseHandler.errorResponse(res, "Customer not found", {}, 404);
    }

    customer.firstName = firstName || customer.firstName;
    customer.lastName = lastName || customer.lastName;
    customer.centerName = centerName || customer.centerName;
    customer.phoneNumber = phoneNumber || customer.phoneNumber;
    customer.address = address || customer.address;
    customer.countryCode = countryCode || customer.countryCode;
    if (dateOfBirth) customer.dateOfBirth = new Date(dateOfBirth);
    if (dairyId) customer.dairyId = dairyId;
    if (typeof fixPrice !== "undefined") customer.fixPrice = fixPrice;
    if (typeof isActive !== "undefined") customer.isActive = isActive;

    await customer.save();
    return responseHandler.successResponse(res, "Customer updated successfully", customer, 200);
  } catch (err) {
    return responseHandler.errorResponse(res, "Customer update failed", err.message, 500);
  }
};

// Get Customer Details (Edit)
exports.editCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (!customer) {
      return responseHandler.errorResponse(res, "Customer not found", {}, 404);
    }
    return responseHandler.successResponse(res, "Customer details fetched successfully", customer, 200);
  } catch (err) {
    return responseHandler.errorResponse(res, "Fetching customer details failed", err.message, 500);
  }
};

// Delete Customer
exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.body;
    const customer = await Customer.findById(id);
    if (!customer) {
      return responseHandler.errorResponse(res, "Customer not found", {}, 404);
    }
    await customer.deleteOne();
    return responseHandler.successResponse(res, "Customer deleted successfully", {}, 200);
  } catch (err) {
    return responseHandler.errorResponse(res, "Customer deletion failed", err.message, 500);
  }
};