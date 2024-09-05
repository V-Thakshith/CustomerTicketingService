const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

// Load environment variables
require('dotenv').config();

const app = express();
connectDB();
const corsOptions = {
    origin: 'http://localhost:3000', // Replace with the URL of your frontend application
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
  };
  
app.use(cors(corsOptions));
// Middleware
app.use(express.json());
app.use(cookieParser())


// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/communications', require('./routes/communicationRoutes'));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
