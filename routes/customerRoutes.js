import express from "express";
import {
  registerCustomer,
  loginCustomer,
  updateCustomer,
  editCustomer,
  deleteCustomer
} from "../controllers/customerController.js";

import validate from "../middleware/validate.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  registerCustomerValidator,
  loginCustomerValidator,
  updateCustomerValidator,
  deleteCustomerValidator,
  editCustomerValidator
} from "../validators/customerValidator.js";

const router = express.Router();

router.post("/register-customer", registerCustomerValidator, validate, registerCustomer);
router.post("/login-customer", loginCustomerValidator, validate, loginCustomer);
router.put("/update-customer", authMiddleware, updateCustomerValidator, validate, updateCustomer);
router.get("/edit-customer/:id", authMiddleware, editCustomerValidator, validate, editCustomer);
router.delete("/delete-customer", authMiddleware, deleteCustomerValidator, validate, deleteCustomer);

export default router;
