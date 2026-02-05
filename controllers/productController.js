const Product = require('../models/productModel');

// GET /products
const getProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);

    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// GET /products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// POST /products
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, category, imageUrl } = req.body;
    if (!name || price < 0 || stock < 0) {
      return res.status(400).json({ message: 'Invalid product data' });
    }
    const product = await Product.create({ name, description, price, stock, category, imageUrl });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// PUT /products/:id
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// DELETE /products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
