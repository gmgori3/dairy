import express from "express";

// Controllers
import { login, registerDairy, dairyUpdate, deleteDairy, getCountryCode, logout } from "../controllers/authController.js";


import { 
  store as storeSnfFat,
  update as updateSnfFat,
  getByDairyId
} from "../controllers/snfFatController.js";

import { 
  getMilkEntryByDate,
  getMilkEntryDaily,
  addMilkEntry,
  editMilkEntry,
  updateMilkEntry,
  deleteMilkEntry
} from "../controllers/milkEntryController.js";

// Middleware
import validate from "../middleware/validate.js";
import authMiddleware from "../middleware/authMiddleware.js";

// Validators
import {
  registerDairyValidator,
  loginValidator,
  loginWithOtpValidator,
  updateDairyValidator,
  storeSnfFatValidator,
  updateSnfFatValidator,
} from "../validators/authValidator.js";

import {
  milkEntryByDateValidator,
  milkEntryDailyValidator,
  addMilkEntryValidator,
  editMilkEntryValidator,
  updateMilkEntryValidator,
  deleteMilkEntryValidator,
} from "../validators/milkEntryValidator.js";

const router = express.Router();

// -------------------- Milk Entry Routes --------------------
router.post(
  "/milk-entry-by-date",
  authMiddleware,
  milkEntryByDateValidator,
  validate,
  getMilkEntryByDate
);

router.post(
  "/milk-entry-daily",
  authMiddleware,
  milkEntryDailyValidator,
  validate,
  getMilkEntryDaily
);

router.post(
  "/add-milk-entry",
  authMiddleware,
  addMilkEntryValidator,
  validate,
  addMilkEntry
);

router.put(
  "/edit-milk-entry",
  authMiddleware,
  editMilkEntryValidator,
  validate,
  editMilkEntry
);

router.put(
  "/update-milk-entry",
  authMiddleware,
  updateMilkEntryValidator,
  validate,
  updateMilkEntry
);

router.delete(
  "/delete-milk-entry",
  authMiddleware,
  deleteMilkEntryValidator,
  validate,
  deleteMilkEntry
);

// -------------------- Dairy Routes --------------------
router.post("/register-dairy", registerDairyValidator, validate, registerDairy);
router.post("/login", loginValidator, validate, login);
//router.post("/login-otp", loginWithOtpValidator, validate, loginWithOtp);
router.put("/update-dairy", authMiddleware, updateDairyValidator, validate, dairyUpdate);
router.delete("/delete-dairy", authMiddleware, deleteDairy);

// -------------------- Other Routes --------------------
router.get("/countries", getCountryCode);
router.post("/logout", authMiddleware, logout);

// -------------------- SNF Fat Routes --------------------
router.post("/store-snf-fat", storeSnfFatValidator, validate, storeSnfFat);
router.put("/update-snf-fat", authMiddleware, updateSnfFatValidator, validate, updateSnfFat);
router.get("/get-snf-by-dairy", authMiddleware, getByDairyId);

export default router;
