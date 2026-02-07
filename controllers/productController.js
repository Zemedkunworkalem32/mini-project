const Product = require('../models/productModel');
const CustomError = require('../utils/customError');

// GET /products
const getProducts = async (req, res) => {
  const { category, minPrice, maxPrice } = req.query;
  let filter = {};
  if (category) filter.category = category;
  if (minPrice || maxPrice) filter.price = {};
  if (minPrice) filter.price.$gte = Number(minPrice);
  if (maxPrice) filter.price.$lte = Number(maxPrice);

  const products = await Product.find(filter);
  res.json(products);
};

// GET /products/:id
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new CustomError('Product not found', 404);
  res.json(product);
};

// POST /products
const createProduct = async (req, res) => {
  const { name, description, price, stock, category, imageUrl } = req.body;
  if (!name || price < 0 || stock < 0) throw new CustomError('Invalid product data', 400);
  const product = await Product.create({ name, description, price, stock, category, imageUrl });
  res.status(201).json(product);
};

// PUT /products/:id
const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) throw new CustomError('Product not found', 404);
  res.json(product);
};

// DELETE /products/:id
const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new CustomError('Product not found', 404);
  res.json({ message: 'Product deleted successfully' });
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
