const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

// Load environment variables
require('dotenv').config();

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000', // Replace with the URL of your frontend application
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
  };
  
app.use(cors(corsOptions));
// Middleware
app.use(express.json());
app.use(cookieParser())
app.use('/uploads',express.static(__dirname+'/uploads'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
//app.use('/api/communications', require('./routes/communicationRoutes'));

module.exports = app; // Export the app
