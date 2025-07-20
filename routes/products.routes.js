const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

// GET all products
router.get('/products', (req, res) => {
  req.db.collection('products')
    .find()
    .toArray()
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ message: err }));
});

// GET a random product
router.get('/products/random', (req, res) => {
  req.db.collection('products')
    .aggregate([{ $sample: { size: 1 } }])
    .toArray()
    .then(data => res.json(data[0]))
    .catch(err => res.status(500).json({ message: err }));
});

// GET a product by ID
router.get('/products/:id', (req, res) => {
  req.db.collection('products')
    .findOne({ _id: ObjectId(req.params.id) })
    .then(data => {
      if (!data) res.status(404).json({ message: 'Product not found' });
      else res.json(data);
    })
    .catch(err => res.status(500).json({ message: err }));
});

// POST new product
router.post('/products', (req, res) => {
  const { name, client } = req.body;

  req.db.collection('products')
    .insertOne({ name, client })
    .then(() => res.status(201).json({ message: 'Product added' }))
    .catch(err => res.status(500).json({ message: err }));
});

// PUT update product
router.put('/products/:id', (req, res) => {
  const { name, client } = req.body;

  req.db.collection('products')
    .updateOne(
      { _id: ObjectId(req.params.id) },
      { $set: { name, client } }
    )
    .then(result => {
      if (result.matchedCount === 0) res.status(404).json({ message: 'Product not found' });
      else res.json({ message: 'Product updated' });
    })
    .catch(err => res.status(500).json({ message: err }));
});

// DELETE product
router.delete('/products/:id', (req, res) => {
  req.db.collection('products')
    .deleteOne({ _id: ObjectId(req.params.id) })
    .then(result => {
      if (result.deletedCount === 0) res.status(404).json({ message: 'Product not found' });
      else res.json({ message: 'Product deleted' });
    })
    .catch(err => res.status(500).json({ message: err }));
});

module.exports = router;
