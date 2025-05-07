require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Routes
const bookRoutes = require('./routes/books');
const borrowRoutes = require('./routes/borrow');

app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('SDCKL Library Management System API');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
