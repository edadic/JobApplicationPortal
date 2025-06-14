const JobListing = require('../models/JobListing');
const db = require('../config/database');

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
    },

    async getActiveListings(req, res) {
        try {
            const jobs = await JobListing.getActiveListings();
            res.json({
                message: 'Active job listings retrieved successfully',
                jobs: jobs
            });
        } catch (error) {
            console.error('Error fetching job listings:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async getEmployerJobs(req, res) {
        try {
            const [employerProfile] = await db.execute(
                'SELECT id FROM employer_profiles WHERE user_id = ?',
                [req.user.userId]
            );
    
            if (!employerProfile[0]) {
                return res.status(404).json({ message: 'Employer profile not found' });
            }
    
            const jobs = await JobListing.getByEmployerId(employerProfile[0].id);
            res.json({
                message: 'Employer jobs retrieved successfully',
                jobs
            });
        } catch (error) {
            console.error('Error getting employer jobs:', error);
            res.status(500).json({ message: 'Error retrieving jobs' });
        }
    }
};

module.exports = jobListingController;