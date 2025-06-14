const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const jobSeekerController = require('../controllers/jobSeekerController');

router.put('/profile', authMiddleware, jobSeekerController.updateProfile);

module.exports = router;