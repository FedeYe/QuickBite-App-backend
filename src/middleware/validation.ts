// All the validation logic for all the requests
import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

// if there are any errors during validation, will send an 400 error msg with all the validation errors
const handleValidationErrors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

// Each time it receives a request to update a User,
// -> checks that each element of the array is a 2)not empty 1)string, otherwise gives the error msg
// -> after checking all, will call the "handleValidationErrors" function to add all the errors it has found
export const validateMyUserRequest = [
  body("name").isString().notEmpty().withMessage("Name must be a string"),
  body("addressLine1")
    .isString()
    .notEmpty()
    .withMessage("AddressLine1 must be a string"),
  body("city").isString().notEmpty().withMessage("City must be a string"),
  body("country").isString().notEmpty().withMessage("Country must be a string"),
  handleValidationErrors,
];
