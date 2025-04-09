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

    static async getActiveListings() {
        const [jobs] = await db.execute(`
            SELECT 
                jl.title,
                jl.description,
                jl.requirements,
                jl.salary_range,
                jl.location,
                jl.job_type,
                jl.experience_level,
                jl.closing_date,
                ep.company_name
            FROM job_listings jl
            JOIN employer_profiles ep ON jl.employer_id = ep.id
            WHERE jl.status = 'active'
            AND (jl.closing_date IS NULL OR jl.closing_date >= CURDATE())
            ORDER BY jl.created_at DESC
        `);
        return jobs;
    }
}

module.exports = JobListing;