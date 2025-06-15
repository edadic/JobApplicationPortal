const db = require('../config/database');
const { sendMail } = require('../config/mail');

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
    },

    async sendEmailToApplicant(req, res) {
        try {
            const { to, subject, message, applicantName, jobTitle } = req.body;

            const html = `
                <div style="font-family: Arial, sans-serif; background: #f6f8fa; padding: 32px;">
                  <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px;">
                    <h2 style="color: #2563eb;">Message from Employer</h2>
                    <p>Hi <strong>${applicantName}</strong>,</p>
                    <p>${message}</p>
                    <hr style="margin: 32px 0;">
                    <p style="color: #555;">Regarding your application for: <strong>${jobTitle}</strong></p>
                    <p style="font-size: 13px; color: #888;">This message was sent via Job Application Portal.</p>
                  </div>
                </div>
            `;

            await sendMail({ to, subject, html });

            res.json({ message: 'Email sent successfully' });
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ message: 'Failed to send email' });
        }
    }
};

module.exports = employerController;