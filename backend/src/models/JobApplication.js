const db = require('../config/database');

class JobApplication {
    static async create(applicationData) {
        const [result] = await db.execute(
            `INSERT INTO job_applications (
                job_id, applicant_id, cover_letter
            ) VALUES (?, ?, ?)`,
            [
                applicationData.job_id,
                applicationData.applicant_id,
                applicationData.cover_letter
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
}

module.exports = JobApplication;