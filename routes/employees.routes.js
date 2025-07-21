const express = require('express');
const router = express.Router();
const Employee = require('../models/employees.model'); // Import the Employee model

// GET all employees
router.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a random employee
router.get('/employees/random', async (req, res) => {
  try {
    const count = await Employee.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const employee = await Employee.findOne().skip(rand);
    if (!employee) res.status(404).json({ message: 'Employee not found' });
    else res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET an employee by ID
router.get('/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) res.status(404).json({ message: 'Employee not found' });
    else res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new employee
router.post('/employees', async (req, res) => {
  const { firstName, lastName, department } = req.body;

  try {
    const newEmployee = new Employee({ firstName, lastName, department });
    await newEmployee.save();
    res.status(201).json({ message: 'Employee added' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update employee
router.put('/employees/:id', async (req, res) => {
  const { firstName, lastName, department } = req.body;

  try {
    const employee = await Employee.findById(req.params.id);
    if (employee) {
      employee.firstName = firstName;
      employee.lastName = lastName;
      employee.department = department;
      await employee.save();
      res.json({ message: 'Employee updated' });
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE employee
router.delete('/employees/:id', async (req, res) => {
  try {
    const result = await Employee.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) res.status(404).json({ message: 'Employee not found' });
    else res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
