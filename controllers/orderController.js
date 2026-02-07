const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const CustomError = require('../utils/customError');

// GET /orders
const getOrders = async (req, res) => {
  const orders = await Order.find().populate('items.product');
  res.json(orders);
};

// GET /orders/:id
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.product');
  if (!order) throw new CustomError('Order not found', 404);
  res.json(order);
};

// POST /orders
const createOrder = async (req, res) => {
  const { name, email, address } = req.body;
  if (!name || !email || !address) throw new CustomError('Customer info required', 400);

  let cart = await Cart.findOne().populate('items.product');
  if (!cart || cart.items.length === 0) throw new CustomError('Cart is empty', 400);

  for (const item of cart.items) {
    if (item.quantity > item.product.stock) {
      throw new CustomError(`Not enough stock for ${item.product.name}`, 400);
    }
  }

  const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const order = await Order.create({
    items: cart.items.map(item => ({ product: item.product._id, quantity: item.quantity })),
    total,
    customer: { name, email, address },
  });

  for (const item of cart.items) {
    item.product.stock -= item.quantity;
    await item.product.save();
  }

  cart.items = [];
  await cart.save();

  res.status(201).json(order);
};

module.exports = { getOrders, getOrderById, createOrder };
