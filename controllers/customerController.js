import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Customer from "../models/Customer.js";
import responseHandler from "../helper/responseHandler.js";

// Helper to generate a JWT token for the customer
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, phoneNumber: user.phoneNumber },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// Register Customer
export const registerCustomer = async (req, res) => {
  try {
    const { fullName, phoneNumber, address, countryCode, password, dairyId, roleId } = req.body;

    const existing = await Customer.findOne({ phoneNumber });
    if (existing) {
      return responseHandler.errorResponse(res, "Phone number already used", {}, 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await Customer.create({
      fullName,
      phoneNumber,
      address,
      countryCode,
      password: hashedPassword,
      dairyId,
      roleId
    });

    return responseHandler.successResponse(res, "Customer registered successfully", customer, 201);
  } catch (err) {
    return responseHandler.errorResponse(res, "Customer registration failed", err.message, 500);
  }
};

// Login Customer
export const loginCustomer = async (req, res) => {
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
export const updateCustomer = async (req, res) => {
  try {
    const { id, fullName, phoneNumber, address, countryCode, password, dairyId, roleId } = req.body;
    const customer = await Customer.findById(id);
    if (!customer) {
      return responseHandler.errorResponse(res, "Customer not found", {}, 404);
    }

    customer.fullName = fullName || customer.fullName;
    customer.phoneNumber = phoneNumber || customer.phoneNumber;
    customer.address = address || customer.address;
    customer.countryCode = countryCode || customer.countryCode;
    if (password) customer.password = password;
    if (dairyId) customer.dairyId = dairyId;
    if (roleId) customer.roleId = roleId;

    await customer.save();
    return responseHandler.successResponse(res, "Customer updated successfully", customer, 200);
  } catch (err) {
    return responseHandler.errorResponse(res, "Customer update failed", err.message, 500);
  }
};

// Get Customer Details (Edit)
export const editCustomer = async (req, res) => {
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
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.body;
    const customer = await Customer.findById(id);
    if (!customer) {
      return responseHandler.errorResponse(res, "Customer not found", {}, 404);
    }
    customer.isActive = false;
    await customer.save();
    return responseHandler.successResponse(res, "Customer deleted successfully", {}, 200);
  } catch (err) {
    return responseHandler.errorResponse(res, "Customer deletion failed", err.message, 500);
  }
};
