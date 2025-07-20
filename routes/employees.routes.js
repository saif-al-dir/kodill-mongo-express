const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

// GET all employees
router.get('/employees', (req, res) => {
  req.db.collection('employees')
    .find()
    .toArray()
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ message: err }));
});

// GET a random employee
router.get('/employees/random', (req, res) => {
  req.db.collection('employees')
    .aggregate([{ $sample: { size: 1 } }])
    .toArray()
    .then(data => res.json(data[0]))
    .catch(err => res.status(500).json({ message: err }));
});

// GET an employee by ID
router.get('/employees/:id', (req, res) => {
  req.db.collection('employees')
    .findOne({ _id: ObjectId(req.params.id) })
    .then(data => {
      if (!data) res.status(404).json({ message: 'Employee not found' });
      else res.json(data);
    })
    .catch(err => res.status(500).json({ message: err }));
});

// POST new employee
router.post('/employees', (req, res) => {
  const { firstName, lastName } = req.body;

  req.db.collection('employees')
    .insertOne({ firstName, lastName })
    .then(() => res.status(201).json({ message: 'Employee added' }))
    .catch(err => res.status(500).json({ message: err }));
});

// PUT update employee
router.put('/employees/:id', (req, res) => {
  const { firstName, lastName } = req.body;

  req.db.collection('employees')
    .updateOne(
      { _id: ObjectId(req.params.id) },
      { $set: { firstName, lastName } }
    )
    .then(result => {
      if (result.matchedCount === 0) res.status(404).json({ message: 'Employee not found' });
      else res.json({ message: 'Employee updated' });
    })
    .catch(err => res.status(500).json({ message: err }));
});

// DELETE employee
router.delete('/employees/:id', (req, res) => {
  req.db.collection('employees')
    .deleteOne({ _id: ObjectId(req.params.id) })
    .then(result => {
      if (result.deletedCount === 0) res.status(404).json({ message: 'Employee not found' });
      else res.json({ message: 'Employee deleted' });
    })
    .catch(err => res.status(500).json({ message: err }));
});

module.exports = router;