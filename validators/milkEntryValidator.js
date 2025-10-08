const { body } = require("express-validator");

// Get milk entry by date
exports.milkEntryByDateValidator = [
  body("dairyId").notEmpty().withMessage("Dairy ID is required"),
  body("shift").notEmpty().withMessage("Shift is required"),
  body("type").notEmpty().withMessage("Type is required"),
  body("from_date").notEmpty().withMessage("From Date is required"),
  body("to_date").notEmpty().withMessage("To Date is required"),
];

// Get milk entry daily
exports.milkEntryDailyValidator = [
  body("dairyId").notEmpty().withMessage("Dairy ID is required"),
  body("shift").notEmpty().withMessage("Shift is required"),
  body("type").notEmpty().withMessage("Type is required"),
];

// Add milk entry
exports.addMilkEntryValidator = [
  body("dairyId").notEmpty().withMessage("Dairy ID is required"),
  body("shift").notEmpty().withMessage("Shift is required"),
  body("milkWeight").notEmpty().withMessage("Milk Weight is required"),
  body("type").notEmpty().withMessage("Type is required"),
  body("customerId").notEmpty().withMessage("Customer ID is required"),
];

// Edit milk entry
exports.editMilkEntryValidator = [
  body("id").notEmpty().withMessage("ID is required")
];

// Update milk entry
exports.updateMilkEntryValidator = [
  body("id").notEmpty().withMessage("ID is required"),
  body("dairyId").notEmpty().withMessage("Dairy ID is required"),
  body("shift").notEmpty().withMessage("Shift is required"),
  body("milkWeight").notEmpty().withMessage("Milk Weight is required"),
  body("type").notEmpty().withMessage("Type is required"),
  body("customerId").notEmpty().withMessage("Customer ID is required"),
];

// Delete milk entry
exports.deleteMilkEntryValidator = [
  body("id").notEmpty().withMessage("ID is required"),
  body("type").notEmpty().withMessage("Type is required"),
];
