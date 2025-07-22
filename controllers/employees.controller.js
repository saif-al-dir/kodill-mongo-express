const Employee = require('../models/employees.model');

exports.getAll = async (req, res) => {
  try {
    const employees = await Employee.find().populate('department'); // Populate department data
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('department');
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  const { firstName, lastName, department } = req.body;
  try {
    const newEmployee = new Employee({ firstName, lastName, department });
    await newEmployee.save();
    res.status(201).json({ message: 'Employee added' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
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
};

exports.delete = async (req, res) => {
  try {
    const result = await Employee.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
