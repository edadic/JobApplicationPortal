const db = require('../config/database');

const employerController = {
    async updateProfile(req, res) {
        try {
            const userId = req.user.userId;
            const {
                company_name,
                company_size,
                industry,
                company_description,
                website_url,
                location
            } = req.body;

            // Update employer profile
            await db.execute(
                `UPDATE employer_profiles SET
                    company_name = ?,
                    company_size = ?,
                    industry = ?,
                    company_description = ?,
                    website_url = ?,
                    location = ?
                 WHERE user_id = ?`,
                [company_name, company_size, industry, company_description, website_url, location, userId]
            );

            res.json({ message: 'Profile updated successfully' });
        } catch (error) {
            console.error('Error updating employer profile:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

module.exports = employerController;