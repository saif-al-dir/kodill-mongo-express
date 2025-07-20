const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient } = require('mongodb');
const employeesRoutes = require('./routes/employees.routes');
const departmentsRoutes = require('./routes/departments.routes');
const productsRoutes = require('./routes/products.routes');


const uri = 'mongodb://0.0.0.0:27017'; // MongoDB connection URI

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    if (err) {
      console.error('Database connection failed:', err);
      return;
    }
    else {
      console.log('✅ Successfully connected to MongoDB');
      const db = client.db('companyDB');        // ← select your DB
      const app = express();

      // Middleware
      app.use(cors());
      app.use(express.json());
      app.use(express.urlencoded({ extended: false }));
      
      app.use((req, res, next) => {
        req.db = db;
        next();
      });


      // your existing routes (they’ll use `db` internally)
      app.use('/api', employeesRoutes);
      app.use('/api', departmentsRoutes);
      app.use('/api', productsRoutes);

      // 404 Handler
      app.use((req, res) => res.status(404).send({ message: 'Not found...' }));


      // Start the server
      app.listen(8000, () => {
        console.log('🚀 Server listening on port 8000');
      });
    }
  });

