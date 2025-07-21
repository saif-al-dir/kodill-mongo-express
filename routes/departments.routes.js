const express = require('express');
const router = express.Router();
const Department = require('../models/department.model');

// GET /departments - Get all departments
router.get('/departments', async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /departments/random - Get one random department
router.get('/departments/random', async (req, res) => {
  try {
    const count = await Department.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const dep = await Department.findOne().skip(rand);
    if (!dep) res.status(404).json({ message: 'Not found' });
    else res.json(dep);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /departments/:id - Get a department by ID
router.get('/departments/:id', async (req, res) => {
  try {
    const dep = await Department.findById(req.params.id);
    if (!dep) res.status(404).json({ message: 'Not found' });
    else res.json(dep);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /departments - Add a new department
router.post('/departments', async (req, res) => {
  try {
    const { name } = req.body;
    const newDepartment = new Department({ name });
    await newDepartment.save();
    res.json({ message: 'Department Added',  name});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /departments/:id - Update department name
router.put('/departments/:id', async (req, res) => {
  try {
    const dep = await Department.findById(req.params.id);
    if (dep) {
      dep.name = req.body.name;
      await dep.save();
      res.json({ message: 'Department updated', dep });
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /departments/:id - Delete a department
router.delete('/departments/:id', async (req, res) => {
  try {
    const dep = await Department.findById(req.params.id);
    if (dep) {
      await Department.deleteOne({ _id: req.params.id });
      res.json({ message: 'Department deleted', dep });
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
