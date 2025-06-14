const express = require('express');
const router = express.Router();
const jobApplicationController = require('../controllers/jobApplicationController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/apply', authMiddleware, jobApplicationController.apply);
router.get('/employer-applications', authMiddleware, jobApplicationController.getEmployerApplications);
router.get('/my-applications', authMiddleware, jobApplicationController.getJobSeekerApplications);
router.get('/job/:jobId', authMiddleware, jobApplicationController.getApplicationsForJob);
router.patch('/:applicationId/status', authMiddleware, jobApplicationController.updateApplicationStatus);


module.exports = router;