const express = require('express');
const router = express.Router();
const jobListingController = require('../controllers/jobListingController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, jobListingController.create);
router.get('/active', jobListingController.getActiveListings);
router.get('/employer', authMiddleware, jobListingController.getEmployerJobs); // Add this line

module.exports = router;