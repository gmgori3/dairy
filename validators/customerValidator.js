import { body, param } from "express-validator";

export const registerCustomerValidator = [
  body("firstName").notEmpty().withMessage("First name is required"),
  body("phoneNumber").notEmpty().withMessage("Phone number is required"),
  body("countryCode").notEmpty().withMessage("Country code is required"),
  body("dairyId").notEmpty().withMessage("Dairy ID is required"),
];

export const updateCustomerValidator = [
  body("id").notEmpty().withMessage("Customer ID is required"),
  body("firstName").notEmpty().withMessage("First name is required"),
  body("phoneNumber").notEmpty().withMessage("Phone number is required"),
  body("countryCode").notEmpty().withMessage("Country code is required"),
];

export const deleteCustomerValidator = [
  body("id").notEmpty().withMessage("Customer ID is required"),
];

export const loginCustomerValidator = [
  body("phoneNumber").notEmpty().withMessage("Phone number is required"),
  body("countryCode").notEmpty().withMessage("Country code is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Validator for routes that need a customer ID from the URL parameter (edit customer)
export const editCustomerValidator = [
  param("id").notEmpty().withMessage("Customer ID is required")
];
