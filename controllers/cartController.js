const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// For simplicity, we have a single cart
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne().populate('items.product');
    if (!cart) cart = await Cart.create({ items: [] });
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

// POST /cart
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || quantity < 1) return res.status(400).json({ message: 'Invalid data' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (quantity > product.stock) return res.status(400).json({ message: 'Not enough stock' });

    let cart = await Cart.findOne();
    if (!cart) cart = await Cart.create({ items: [] });

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
      if (cart.items[itemIndex].quantity > product.stock) return res.status(400).json({ message: 'Exceeds stock' });
    } else {
      cart.items.push({ product: productId, quantity });
    }
    await cart.save();
    res.status(201).json(cart);
  } catch (err) {
    next(err);
  }
};

// PUT /cart
const updateCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || quantity < 1) return res.status(400).json({ message: 'Invalid data' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (quantity > product.stock) return res.status(400).json({ message: 'Not enough stock' });

    let cart = await Cart.findOne();
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ message: 'Item not in cart' });

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

// DELETE /cart/:productId
const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    let cart = await Cart.findOne();
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

module.exports = { getCart, addToCart, updateCart, removeFromCart };
