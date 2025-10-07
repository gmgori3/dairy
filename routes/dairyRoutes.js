const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const snfFatController = require("../controllers/snfFatController"); // added import for SNF Fat controller
const validate = require("../middleware/validate");
const authMiddleware = require("../middleware/authMiddleware");
const milkEntryController = require("../controllers/milkEntryController"); 
const {
  registerDairyValidator,
  loginValidator,
  loginWithOtpValidator,
  registerCustomerValidator,
  updateDairyValidator,
  updateCustomerValidator,
  storeSnfFatValidator,
  updateSnfFatValidator,
} = require("../validators/authValidator");
const {
  milkEntryByDateValidator,
  milkEntryDailyValidator,
  addMilkEntryValidator,
  editMilkEntryValidator,
  updateMilkEntryValidator,
  deleteMilkEntryValidator,
} = require("../validators/milkEntryValidator");

// Milk Entry Routes
router.post("/milk-entry-by-date", authMiddleware, milkEntryByDateValidator, validate, milkEntryController.getMilkEntryByDate);
router.post("/milk-entry-daily", authMiddleware, milkEntryDailyValidator, validate, milkEntryController.getMilkEntryDaily);
router.post("/add-milk-entry", authMiddleware, addMilkEntryValidator, validate, milkEntryController.addMilkEntry);
router.put("/edit-milk-entry", authMiddleware, editMilkEntryValidator, validate, milkEntryController.editMilkEntry);
router.put("/update-milk-entry", authMiddleware, updateMilkEntryValidator, validate, milkEntryController.updateMilkEntry);
router.delete("/delete-milk-entry", authMiddleware, deleteMilkEntryValidator, validate, milkEntryController.deleteMilkEntry);

// Other Routes


// Dairy
router.post("/register-dairy", registerDairyValidator, validate, authController.registerDairy);
router.post("/login", loginValidator, validate, authController.login);
router.post("/login-otp", loginWithOtpValidator, validate, authController.loginWithOtp);
router.put("/update-dairy", authMiddleware, updateDairyValidator, validate, authController.dairyUpdate);
router.delete("/delete-dairy", authMiddleware, authController.deleteDairy);

// Customer
router.post("/register-customer", authMiddleware, registerCustomerValidator, validate, authController.registerCustomer);
router.get("/customers", authMiddleware, authController.dairyCustomerDetail);
router.put("/update-customer", authMiddleware, updateCustomerValidator, validate, authController.dairyCustomerUpdate);
router.delete("/delete-customer", authMiddleware, authController.deleteCustomer);

// Other
router.get("/countries", authController.getCountryCode);
router.post("/logout", authMiddleware, authController.logout);

/// SNF Fat Endpoints
router.post("/store-snf-fat", storeSnfFatValidator, validate, snfFatController.store);
router.put("/update-snf-fat", authMiddleware, updateSnfFatValidator, validate, snfFatController.update);
router.get("/get-snf-by-dairy", authMiddleware, snfFatController.getByDairyId);

// Milk Entry Endpoints can be added here similarly
router.post("/add-milk-entry", authMiddleware, addMilkEntryValidator, validate, milkEntryController.addMilkEntry);
router.get("/milk-entries-daily", authMiddleware,milkEntryDailyValidator, milkEntryController.getMilkEntryDaily);
router.post("/milk-entry-by-date", authMiddleware, milkEntryByDateValidator, validate, milkEntryController.getMilkEntryByDate);
router.put("/edit-milk-entry", authMiddleware, editMilkEntryValidator, validate, milkEntryController.editMilkEntry);
router.put("/update-milk-entry", authMiddleware, updateMilkEntryValidator, validate, milkEntryController.updateMilkEntry);
router.delete("/delete-milk-entry", authMiddleware, deleteMilkEntryValidator, validate, milkEntryController.deleteMilkEntry);

module.exports = router;
