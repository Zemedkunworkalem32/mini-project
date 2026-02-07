const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { getCart, addToCart, updateCart, removeFromCart } = require('../controllers/cartController');
const { validateAddToCart, validateUpdateCart } = require('../middleware/validators');

router.get('/', asyncHandler(getCart));
router.post('/', validateAddToCart, asyncHandler(addToCart));
router.put('/', validateUpdateCart, asyncHandler(updateCart));
router.delete('/:productId', asyncHandler(removeFromCart));

module.exports = router;
