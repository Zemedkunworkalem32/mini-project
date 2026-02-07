const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { getOrders, getOrderById, createOrder } = require('../controllers/orderController');
const { validateCreateOrder } = require('../middleware/validators');

router.get('/', asyncHandler(getOrders));
router.get('/:id', asyncHandler(getOrderById));
router.post('/', validateCreateOrder, asyncHandler(createOrder));

module.exports = router;
