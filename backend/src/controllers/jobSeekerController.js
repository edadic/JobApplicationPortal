const db = require('../config/database');

const jobSeekerController = {
    async updateProfile(req, res) {
        try {
            const userId = req.user.userId;
            const {
                skills,
                experience_years,
                education_level,
                preferred_job_type,
                preferred_location
            } = req.body;

            // Update job seeker profile
            await db.execute(
                `UPDATE job_seeker_profiles SET
                    skills = ?,
                    experience_years = ?,
                    education_level = ?,
                    preferred_job_type = ?,
                    preferred_location = ?
                 WHERE user_id = ?`,
                [skills, experience_years, education_level, preferred_job_type, preferred_location, userId]
            );

            res.json({ message: 'Profile updated successfully' });
        } catch (error) {
            console.error('Error updating job seeker profile:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async uploadResume(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }
            const userId = req.user.userId;
            const resumeUrl = `/uploads/resumes/${req.file.filename}`;

            await db.execute(
                'UPDATE job_seeker_profiles SET resume_url = ? WHERE user_id = ?',
                [resumeUrl, userId]
            );

            res.json({ message: 'Resume uploaded successfully', resumeUrl });
        } catch (error) {
            console.error('Error uploading resume:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

module.exports = jobSeekerController;