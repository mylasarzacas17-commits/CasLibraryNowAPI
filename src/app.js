const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const bookRoutes = require('./routes/bookRoutes');
const memberRoutes = require('./routes/memberRoutes');
const loanRoutes = require('./routes/loanRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/loans', loanRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to CasLibraryNow API',
    version: '1.0.0',
    status: 'running',
  });
});

// Error handler
app.use(errorHandler);

module.exports = app;
