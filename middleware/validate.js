import { validationResult } from "express-validator";

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation error",
      errors: errors.array().map(err => ({ field: err.param, msg: err.msg })),
    });
  }
  next();
};

export default validate;
