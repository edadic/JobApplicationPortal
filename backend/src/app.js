const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');


const app = express();

// Middleware
app.use(cors());

// Update CORS configuration
app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5175'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/applications', require('./routes/jobApplicationRoutes'));
app.use('/api/jobs', require('./routes/jobListingRoutes'));
app.use('/api/job-seekers', require('./routes/jobSeekerRoutes'));
app.use('/api/employers', require('./routes/employerRoutes'));
app.use('/uploads', express.static(path.join(__dirname, '/../uploads')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;