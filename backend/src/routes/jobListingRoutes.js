const express = require('express');
const router = express.Router();
const jobListingController = require('../controllers/jobListingController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, jobListingController.create);
router.get('/active', jobListingController.getActiveListings);

module.exports = router;