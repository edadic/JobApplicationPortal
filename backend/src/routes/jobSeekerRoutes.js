const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const jobSeekerController = require('../controllers/jobSeekerController');
const upload = require('../config/multer');


router.put('/profile', authMiddleware, jobSeekerController.updateProfile);
router.post('/upload-resume', authMiddleware, upload.single('resume'), jobSeekerController.uploadResume);

module.exports = router;