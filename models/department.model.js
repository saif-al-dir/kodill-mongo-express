const mongoose = require('mongoose');

// Define the schema
const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

// Export the model
module.exports = mongoose.model('Department', departmentSchema);
