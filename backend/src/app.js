const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
<<<<<<< Updated upstream
app.use(cors());
=======
// Update CORS configuration
app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5175'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
}));
>>>>>>> Stashed changes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/applications', require('./routes/jobApplicationRoutes')); 
app.use('/api/jobs', require('./routes/jobListingRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;