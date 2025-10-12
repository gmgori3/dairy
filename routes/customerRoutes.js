const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const validate = require("../middleware/validate");
const authMiddleware = require("../middleware/authMiddleware");
const {
  registerCustomerValidator,
  loginCustomerValidator,
  updateCustomerValidator,
  deleteCustomerValidator,
  editCustomerValidator,
} = require("../validators/customerValidator");

router.post("/register-customer", registerCustomerValidator, validate, customerController.registerCustomer);
router.post("/login-customer", loginCustomerValidator, validate, customerController.loginCustomer);

router.put("/update-customer", authMiddleware, updateCustomerValidator, validate, customerController.updateCustomer);
router.delete("/delete-customer", authMiddleware, deleteCustomerValidator, validate, customerController.deleteCustomer);
router.get("/edit-customer/:id", authMiddleware, editCustomerValidator, validate, customerController.editCustomer);

module.exports = router;