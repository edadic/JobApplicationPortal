const db = require('../config/database');

class JobListing {
    static async create(jobData) {
        const [result] = await db.execute(
            `INSERT INTO job_listings (
                employer_id, title, description, requirements,
                salary_range, location, job_type, experience_level,
                status, closing_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                jobData.employer_id,
                jobData.title,
                jobData.description,
                jobData.requirements,
                jobData.salary_range,
                jobData.location,
                jobData.job_type,
                jobData.experience_level,
                jobData.status || 'active',
                jobData.closing_date
            ]
        );
        return result.insertId;
    }

    static async getById(id) {
        const [jobs] = await db.execute('SELECT * FROM job_listings WHERE id = ?', [id]);
        return jobs[0];
    }
}

module.exports = JobListing;