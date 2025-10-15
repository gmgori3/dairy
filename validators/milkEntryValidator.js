import { body } from "express-validator";

// Get milk entry by date
export const milkEntryByDateValidator = [
  body("dairyId").notEmpty().withMessage("Dairy ID is required"),
  body("shift").notEmpty().withMessage("Shift is required"),
  body("type").notEmpty().withMessage("Type is required"),
  body("from_date").notEmpty().withMessage("From Date is required"),
  body("to_date").notEmpty().withMessage("To Date is required"),
];

// Get milk entry daily
export const milkEntryDailyValidator = [
  body("dairyId").notEmpty().withMessage("Dairy ID is required"),
  body("shift").notEmpty().withMessage("Shift is required"),
  body("type").notEmpty().withMessage("Type is required"),
];

// Add milk entry
export const addMilkEntryValidator = [
  body("dairyId").notEmpty().withMessage("Dairy ID is required"),
  body("shift").notEmpty().withMessage("Shift is required"),
  body("milkWeight").notEmpty().withMessage("Milk Weight is required"),
  body("type").notEmpty().withMessage("Type is required"),
  body("customerId").notEmpty().withMessage("Customer ID is required"),
];

// Edit milk entry
export const editMilkEntryValidator = [
  body("id").notEmpty().withMessage("ID is required")
];

// Update milk entry
export const updateMilkEntryValidator = [
  body("id").notEmpty().withMessage("ID is required")
];

// Delete milk entry
export const deleteMilkEntryValidator = [
  body("id").notEmpty().withMessage("ID is required"),
  body("type").notEmpty().withMessage("Type is required"),
];
