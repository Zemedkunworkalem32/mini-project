const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const CustomError = require('../utils/customError');

// GET /cart
const getCart = async (req, res) => {
  let cart = await Cart.findOne().populate('items.product');
  if (!cart) cart = await Cart.create({ items: [] });
  res.json(cart);
};

// POST /cart
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId || quantity < 1) throw new CustomError('Invalid data', 400);

  const product = await Product.findById(productId);
  if (!product) throw new CustomError('Product not found', 404);
  if (quantity > product.stock) throw new CustomError('Not enough stock', 400);

  let cart = await Cart.findOne();
  if (!cart) cart = await Cart.create({ items: [] });

  const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
    if (cart.items[itemIndex].quantity > product.stock) throw new CustomError('Exceeds stock', 400);
  } else {
    cart.items.push({ product: productId, quantity });
  }
  await cart.save();
  res.status(201).json(cart);
};

// PUT /cart
const updateCart = async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId || quantity < 1) throw new CustomError('Invalid data', 400);

  const product = await Product.findById(productId);
  if (!product) throw new CustomError('Product not found', 404);

  let cart = await Cart.findOne();
  if (!cart) throw new CustomError('Cart not found', 404);

  const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
  if (itemIndex === -1) throw new CustomError('Item not in cart', 404);

  cart.items[itemIndex].quantity = quantity;
  await cart.save();
  res.json(cart);
};

// DELETE /cart/:productId
const removeFromCart = async (req, res) => {
  const { productId } = req.params;

  let cart = await Cart.findOne();
  if (!cart) throw new CustomError('Cart not found', 404);

  cart.items = cart.items.filter(item => item.product.toString() !== productId);
  await cart.save();
  res.json(cart);
};

module.exports = { getCart, addToCart, updateCart, removeFromCart };
