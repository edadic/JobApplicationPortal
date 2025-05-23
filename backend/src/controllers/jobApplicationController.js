const db = require('../config/database');
const JobApplication = require('../models/JobApplication');
const JobListing = require('../models/JobListing');

const jobApplicationController = {
    async apply(req, res) {
        try {
            if (req.user.userType !== 'job_seeker') {
                return res.status(403).json({ message: 'Only job seekers can apply for jobs' });
            }

            const { job_id, cover_letter } = req.body;

            const [seekerProfile] = await db.execute(
                'SELECT id FROM job_seeker_profiles WHERE user_id = ?',
                [req.user.userId]
            );

            if (!seekerProfile[0]) {
                return res.status(404).json({ message: 'Job seeker profile not found' });
            }

            const job = await JobListing.getById(job_id);
            if (!job || job.status !== 'active') {
                return res.status(404).json({ message: 'Job not found or no longer active' });
            }

            const existingApplication = await JobApplication.getByJobAndApplicant(job_id, seekerProfile[0].id);
            if (existingApplication) {
                return res.status(400).json({ message: 'You have already applied for this job' });
            }

            const applicationData = {
                job_id,
                applicant_id: seekerProfile[0].id,
                cover_letter: cover_letter || null
            };

            const applicationId = await JobApplication.create(applicationData);

            res.status(201).json({
                message: 'Application submitted successfully',
                applicationId
            });
        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                sqlMessage: error.sqlMessage
            });
            res.status(500).json({ 
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    async getEmployerApplications(req, res) {
        try {
            if (req.user.userType !== 'employer') {
                return res.status(403).json({ message: 'Only employers can view applications' });
            }

            const [employerProfile] = await db.execute(
                'SELECT id FROM employer_profiles WHERE user_id = ?',
                [req.user.userId]
            );

            if (!employerProfile[0]) {
                return res.status(404).json({ message: 'Employer profile not found' });
            }

            const [applications] = await db.execute(`
                SELECT 
                    ja.id as application_id,
                    ja.cover_letter,
                    ja.status as application_status,
                    ja.applied_at,
                    jl.title as job_title,
                    u.first_name,
                    u.last_name,
                    u.email,
                    jsp.skills,
                    jsp.experience_years,
                    jsp.education_level,
                    jsp.resume_url
                FROM job_applications ja
                JOIN job_listings jl ON ja.job_id = jl.id
                JOIN job_seeker_profiles jsp ON ja.applicant_id = jsp.id
                JOIN users u ON jsp.user_id = u.id
                WHERE jl.employer_id = ?
                ORDER BY ja.applied_at DESC
            `, [employerProfile[0].id]);

            res.json({
                message: 'Applications retrieved successfully',
                applications
            });
        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                sqlMessage: error.sqlMessage
            });
            res.status(500).json({ 
                message: 'Internal server error',
                error: error.message
            });
        }
    }
};

module.exports = jobApplicationController;