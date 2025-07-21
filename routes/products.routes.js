const express = require('express');
const router = express.Router();
const Product = require('../models/products.model'); // Import the Product model

// GET all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a random product
router.get('/products/random', async (req, res) => {
  try {
    const count = await Product.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const product = await Product.findOne().skip(rand);
    if (!product) res.status(404).json({ message: 'Product not found' });
    else res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a product by ID
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) res.status(404).json({ message: 'Product not found' });
    else res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new product
router.post('/products', async (req, res) => {
  const { name, client } = req.body;

  try {
    const newProduct = new Product({ name, client });
    await newProduct.save();
    res.status(201).json({ message: 'Product added' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update product
router.put('/products/:id', async (req, res) => {
  const { name, client } = req.body;

  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = name;
      product.client = client;
      await product.save();
      res.json({ message: 'Product updated' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE product
router.delete('/products/:id', async (req, res) => {
  try {
    const result = await Product.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) res.status(404).json({ message: 'Product not found' });
    else res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
