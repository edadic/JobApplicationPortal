const JobApplication = require('../models/JobApplication');
const JobListing = require('../models/JobListing');

const jobApplicationController = {
    async apply(req, res) {
        try {
            if (req.user.userType !== 'job_seeker') {
                return res.status(403).json({ message: 'Only job seekers can apply for jobs' });
            }

            const { job_id, cover_letter } = req.body;

            const job = await JobListing.getById(job_id);
            if (!job || job.status !== 'active') {
                return res.status(404).json({ message: 'Job not found or no longer active' });
            }

            const existingApplication = await JobApplication.getByJobAndApplicant(job_id, req.user.userId);
            if (existingApplication) {
                return res.status(400).json({ message: 'You have already applied for this job' });
            }

            const applicationData = {
                job_id,
                applicant_id: req.user.userId,
                cover_letter: cover_letter || null
            };

            const applicationId = await JobApplication.create(applicationData);

            res.status(201).json({
                message: 'Application submitted successfully',
                applicationId
            });
        } catch (error) {
            console.error('Error submitting application:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

module.exports = jobApplicationController;