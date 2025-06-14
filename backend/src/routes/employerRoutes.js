const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const employerController = require('../controllers/employerController');

router.put('/profile', authMiddleware, employerController.updateProfile);

module.exports = router;