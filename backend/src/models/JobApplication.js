const db = require('../config/database');

class JobApplication {
    static async create(applicationData) {
        const [result] = await db.execute(
            `INSERT INTO job_applications (
                job_id, applicant_id, cover_letter, status, applied_at, updated_at
            ) VALUES (?, ?, ?, ?, NOW(), NOW())`,
            [
                applicationData.job_id,
                applicationData.applicant_id,
                applicationData.cover_letter,
                'pending'
            ]
        );
        return result.insertId;
    }

    static async getByJobAndApplicant(jobId, applicantId) {
        const [applications] = await db.execute(
            'SELECT * FROM job_applications WHERE job_id = ? AND applicant_id = ?',
            [jobId, applicantId]
        );
        return applications[0];
    }

    static async getApplicationsByEmployer(employerId) {
        const [applications] = await db.execute(`
            SELECT 
                ja.id as application_id,
                ja.cover_letter,
                ja.status as application_status,
                ja.applied_at,
                jl.id as job_id,
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
        `, [employerId]);
        return applications;
    }
}

module.exports = JobApplication;