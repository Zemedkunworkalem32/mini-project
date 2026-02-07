const { body, validationResult } = require('express-validator');
const CustomError = require('../utils/customError');

const validateAddToCart = [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(new CustomError(errors.array()[0].msg, 400));
    next();
  },
];

const validateUpdateCart = [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(new CustomError(errors.array()[0].msg, 400));
    next();
  },
];

const validateCreateOrder = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('address').notEmpty().withMessage('Address is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(new CustomError(errors.array()[0].msg, 400));
    next();
  },
];

module.exports = { validateAddToCart, validateUpdateCart, validateCreateOrder };
