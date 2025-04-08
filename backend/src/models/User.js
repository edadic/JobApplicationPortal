const db = require('../config/database');
const bcrypt = require('bcrypt');

class User {
    static async create(userData) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const [result] = await db.execute(
            'INSERT INTO users (email, password_hash, user_type, first_name, last_name) VALUES (?, ?, ?, ?, ?)',
            [userData.email, hashedPassword, userData.user_type, userData.first_name, userData.last_name]
        );
        return result.insertId;
    }

    static async findByEmail(email) {
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return users[0];
    }

    static async createProfile(userId, profileData, userType) {
        const table = userType === 'job_seeker' ? 'job_seeker_profiles' : 'employer_profiles';
        const fields = userType === 'job_seeker' 
            ? '(user_id, resume_url, skills, experience_years, education_level, preferred_job_type, preferred_location)'
            : '(user_id, company_name, company_size, industry, company_description, website_url, location)';
        
        const placeholders = userType === 'job_seeker' 
            ? '(?, ?, ?, ?, ?, ?, ?)'
            : '(?, ?, ?, ?, ?, ?, ?)';

        const values = userType === 'job_seeker'
            ? [userId, profileData.resume_url, profileData.skills, profileData.experience_years, 
               profileData.education_level, profileData.preferred_job_type, profileData.preferred_location]
            : [userId, profileData.company_name, profileData.company_size, profileData.industry,
               profileData.company_description, profileData.website_url, profileData.location];

        const [result] = await db.execute(
            `INSERT INTO ${table} ${fields} VALUES ${placeholders}`,
            values
        );
        return result.insertId;
    }
}

module.exports = User;