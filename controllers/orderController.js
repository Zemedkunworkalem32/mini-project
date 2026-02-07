const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// GET /orders
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('items.product');
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// GET /orders/:id
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

// POST /orders
const createOrder = async (req, res, next) => {
  try {
    const { name, email, address } = req.body;
    if (!name || !email || !address) return res.status(400).json({ message: 'Customer info required' });

    let cart = await Cart.findOne().populate('items.product');
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    // Check stock
    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        return res.status(400).json({ message: `Not enough stock for ${item.product.name}` });
      }
    }

    // Calculate total
    const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    // Create order
    const order = await Order.create({
      items: cart.items.map(item => ({ product: item.product._id, quantity: item.quantity })),
      total,
      customer: { name, email, address },
    });

    // Reduce product stock
    for (const item of cart.items) {
      item.product.stock -= item.quantity;
      await item.product.save();
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

module.exports = { getOrders, getOrderById, createOrder };
