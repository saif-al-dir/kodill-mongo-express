const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import your routes
const employeesRoutes = require('./routes/employees.routes');
const departmentsRoutes = require('./routes/departments.routes');
const productsRoutes = require('./routes/products.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Mount API routes
app.use('/api', employeesRoutes);
app.use('/api', departmentsRoutes);
app.use('/api', productsRoutes);

// Fallback for unmatched routes
app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://0.0.0.0:27017/companyDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// Success and error handling for connection
db.once('open', () => {
  console.log('✅ Connected to the database');
});

db.on('error', (err) => {
  console.error('❌ Database connection error: ' + err);
});

// Start the server
app.listen(8000, () => {
  console.log('🚀 Server is running on port: 8000');
});
