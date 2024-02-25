import { body, validationResult } from "express-validator";
import { Request, Response } from "express";

const loginValidator = [
  body("email", "Invalid does not Empty").not().isEmpty(),
  body("email", "Invalid email").isEmail(),
  body("password", "The minimum password length is 6 characters").isLength({
    min: 6,
  }),
];

const createValidator = [
  body("user.email", "email is not Empty").not().isEmpty(),
  body("user.email", "Invalid email").isEmail(),
  body("user.password", "password is not Empty").not().isEmpty(),
  body("user.password", "The minimum password length is 6 characters").isLength(
    { min: 6 },
  ),
];

const handleAuthValidation = async (req: Request, res: Response) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res.status(400).json({ errors: validationErrors.array() });
  }
};

const emailValidator = [
  body("email", "Invalid does not Empty").not().isEmpty(),
  body("email", "Invalid email").isEmail(),
];

const otpValidator = [
  body("user.email", "email is not Empty").not().isEmpty(),
  body("user.email", "Invalid email").isEmail(),
];

const passwordValidator = [
  body("user.password", "password is not Empty").not().isEmpty(),
];

export {
  loginValidator,
  createValidator,
  emailValidator,
  otpValidator,
  passwordValidator,
  handleAuthValidation,
};
