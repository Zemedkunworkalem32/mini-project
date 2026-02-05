const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCart, removeFromCart } = require('../controllers/cartController');

router.get('/', getCart);
router.post('/', addToCart);
router.put('/', updateCart);
router.delete('/:productId', removeFromCart);

module.exports = router;
