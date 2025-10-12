// validators/authValidator.js
const { body, check } = require("express-validator");

exports.registerDairyValidator = [
  body("fullName").notEmpty().withMessage("Full name is required"),
  body("countryCode").notEmpty().withMessage("Country code is required"),
  body("phoneNumber")
    .notEmpty().withMessage("Phone number is required")
    .isMobilePhone().withMessage("Invalid phone number"),
  body("centerName").notEmpty().withMessage("Center name is required"),
  body("dateOfBirth").notEmpty().withMessage("Date of birth is required"),
];

exports.loginValidator = [
  body("phoneNumber").notEmpty().withMessage("Phone number is required"),
  body("countryCode").notEmpty().withMessage("Country code is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

exports.loginWithOtpValidator = [
  body("phoneNumber").notEmpty().withMessage("Phone number is required"),
  body("countryCode").notEmpty().withMessage("Country code is required"),
  body("otp").notEmpty().withMessage("OTP is required"),
];

exports.updateDairyValidator = [
  body("id").notEmpty().withMessage("ID is required"),
  body("firstName").notEmpty().withMessage("First name is required"),
  // body("phoneNumber").notEmpty().withMessage("Phone number is required"),
];


// SNF Fat Validators
exports.storeSnfFatValidator = [
    check("data").isArray().withMessage("Data must be an array"),
    check("data.*.snf")
        .exists().withMessage("SNF is required")
        .isNumeric().withMessage("SNF must be numeric"),
    check("data.*.fat")
        .exists().withMessage("FAT is required")
        .isNumeric().withMessage("FAT must be numeric"),
    check("data.*.dairy_id")
        .exists().withMessage("Dairy ID is required"),
    check("data.*.value")
        .optional().isNumeric().withMessage("Value must be numeric"),
    check("data.*.categorychart_id")
        .optional().isInt().withMessage("Category Chart ID must be an integer"),
];

exports.updateSnfFatValidator = [
    check("data").isArray().withMessage("Data must be an array"),
    check("data.*.id")
        .exists().withMessage("ID is required")
        .isInt().withMessage("ID must be an integer"),
    check("data.*.snf")
        .exists().withMessage("SNF is required")
        .isNumeric().withMessage("SNF must be numeric"),
    check("data.*.fat")
        .exists().withMessage("FAT is required")
        .isNumeric().withMessage("FAT must be numeric"),
    check("data.*.dairy_id")
        .exists().withMessage("Dairy ID is required")
        .isInt().withMessage("Dairy ID must be an integer"),
    check("data.*.value")
        .optional().isNumeric().withMessage("Value must be numeric"),
    check("data.*.categorychart_id")
        .optional().isInt().withMessage("Category Chart ID must be an integer"),
];
