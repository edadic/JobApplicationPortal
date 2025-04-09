const JobListing = require('../models/JobListing');

const jobListingController = {
    async create(req, res) {
        try {
            if (req.user.userType !== 'employer') {
                return res.status(403).json({ message: 'Only employers can post job listings' });
            }

            const jobData = {
                employer_id: req.body.employer_id,
                title: req.body.title,
                description: req.body.description,
                requirements: req.body.requirements,
                salary_range: req.body.salary_range,
                location: req.body.location,
                job_type: req.body.job_type,
                experience_level: req.body.experience_level,
                status: req.body.status,
                closing_date: req.body.closing_date
            };

            if (!jobData.title || !jobData.description || !jobData.job_type) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            const jobId = await JobListing.create(jobData);
            const newJob = await JobListing.getById(jobId);

            res.status(201).json({
                message: 'Job listing created successfully',
                job: newJob
            });
        } catch (error) {
            console.error('Error creating job listing:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

module.exports = jobListingController;