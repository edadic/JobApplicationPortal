const db = require('../config/database');
const JobApplication = require('../models/JobApplication');
const JobListing = require('../models/JobListing');

const jobApplicationController = {
    async apply(req, res) {
    try {
        if (req.user.userType !== 'job_seeker') {
            return res.status(403).json({ message: 'Only job seekers can apply for jobs' });
        }

        const { job_id, cover_letter, resume_url } = req.body;

        const [seekerProfile] = await db.execute(
            'SELECT id, resume_url FROM job_seeker_profiles WHERE user_id = ?',
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

        // Use resume_url from request or from profile
        const finalResumeUrl = resume_url || seekerProfile[0].resume_url || null;

        const applicationData = {
            job_id,
            applicant_id: seekerProfile[0].id,
            cover_letter: cover_letter || null,
            resume_url: finalResumeUrl
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
    },

    async getJobSeekerApplications(req, res) {
        try {
            if (req.user.userType !== 'job_seeker') {
                return res.status(403).json({ message: 'Only job seekers can view their applications' });
            }

            const [seekerProfile] = await db.execute(
                'SELECT id FROM job_seeker_profiles WHERE user_id = ?',
                [req.user.userId]
            );

            if (!seekerProfile[0]) {
                return res.status(404).json({ message: 'Job seeker profile not found' });
            }

            const [applications] = await db.execute(`
                SELECT 
                    ja.id as application_id,
                    ja.cover_letter,
                    ja.status as application_status,
                    ja.applied_at,
                    jl.title as job_title,
                    ep.company_name, -- Get company_name from employer_profiles
                    jl.location,
                    jl.salary_range AS salary, -- Use salary_range from job_listings
                    jl.description
                FROM job_applications ja
                JOIN job_listings jl ON ja.job_id = jl.id
                JOIN employer_profiles ep ON jl.employer_id = ep.id -- Join with employer_profiles
                WHERE ja.applicant_id = ?
                ORDER BY ja.applied_at DESC
            `, [seekerProfile[0].id]);

            res.json({
                message: 'Job seeker applications retrieved successfully',
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
    },

    async getApplicationsForJob(req, res) {
        try {
            if (req.user.userType !== 'employer') {
                return res.status(403).json({ message: 'Only employers can view applications' });
            }

            const jobId = req.params.jobId;

            // Check if this job belongs to the employer
            const [employerProfile] = await db.execute(
                'SELECT id FROM employer_profiles WHERE user_id = ?',
                [req.user.userId]
            );
            if (!employerProfile[0]) {
                return res.status(404).json({ message: 'Employer profile not found' });
            }

            const [job] = await db.execute(
                'SELECT * FROM job_listings WHERE id = ? AND employer_id = ?',
                [jobId, employerProfile[0].id]
            );
            if (!job[0]) {
                return res.status(403).json({ message: 'You do not own this job listing' });
            }

            const [applications] = await db.execute(`
                SELECT 
                    ja.id as application_id,
                    ja.cover_letter,
                    ja.status as application_status,
                    ja.applied_at,
                    u.first_name,
                    u.last_name,
                    u.email,
                    jsp.skills,
                    jsp.experience_years,
                    jsp.education_level,
                    jsp.resume_url
                FROM job_applications ja
                JOIN job_seeker_profiles jsp ON ja.applicant_id = jsp.id
                JOIN users u ON jsp.user_id = u.id
                WHERE ja.job_id = ?
                ORDER BY ja.applied_at DESC
            `, [jobId]);

            res.json({ applications });
        } catch (error) {
            console.error('Error fetching applications for job:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async updateApplicationStatus(req, res) {
        try {
            if (req.user.userType !== 'employer') {
                return res.status(403).json({ message: 'Only employers can update application status' });
            }

            const { applicationId } = req.params;
            const { status } = req.body;
            const allowedStatuses = ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'];
            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({ message: 'Invalid status value' });
            }

            // Check if the application belongs to a job owned by this employer
            const [result] = await db.execute(
                `SELECT ja.id FROM job_applications ja
                 JOIN job_listings jl ON ja.job_id = jl.id
                 JOIN employer_profiles ep ON jl.employer_id = ep.id
                 WHERE ja.id = ? AND ep.user_id = ?`,
                [applicationId, req.user.userId]
            );
            if (!result[0]) {
                return res.status(403).json({ message: 'Not authorized to update this application' });
            }
            await db.execute(
                'UPDATE job_applications SET status = ?, updated_at = NOW() WHERE id = ?',
                [status, applicationId]
            );

            res.json({ message: 'Application status updated successfully' });
        } catch (error) {
            console.error('Error updating application status:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

module.exports = jobApplicationController;