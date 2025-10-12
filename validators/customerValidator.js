const { body } = require("express-validator");

exports.registerCustomerValidator = [
  body("firstName").notEmpty().withMessage("First name is required"),
  body("phoneNumber").notEmpty().withMessage("Phone number is required"),
  body("countryCode").notEmpty().withMessage("Country code is required"),
  body("dairyId").notEmpty().withMessage("Dairy ID is required"),
];

exports.updateCustomerValidator = [
  body("id").notEmpty().withMessage("Customer ID is required"),
  body("firstName").notEmpty().withMessage("First name is required"),
  body("phoneNumber").notEmpty().withMessage("Phone number is required"),
  body("countryCode").notEmpty().withMessage("Country code is required"),
];

exports.deleteCustomerValidator = [
  body("id").notEmpty().withMessage("Customer ID is required"),
];

exports.loginCustomerValidator = [
  body("phoneNumber").notEmpty().withMessage("Phone number is required"),
  body("countryCode").notEmpty().withMessage("Country code is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Validator for routes that need a customer ID from the URL parameter (edit customer)
exports.editCustomerValidator = [
  param("id").notEmpty().withMessage("Customer ID is required")
];