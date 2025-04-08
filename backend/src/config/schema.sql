CREATE DATABASE IF NOT EXISTS job_portal;
USE job_portal;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    user_type ENUM('job_seeker', 'employer') NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_user_type (user_type)
);

-- Job seeker profiles
CREATE TABLE job_seeker_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    resume_url VARCHAR(255),
    skills TEXT,
    experience_years INT,
    education_level VARCHAR(100),
    preferred_job_type VARCHAR(100),
    preferred_location VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- Employer profiles
CREATE TABLE employer_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    company_size VARCHAR(50),
    industry VARCHAR(100),
    company_description TEXT,
    website_url VARCHAR(255),
    location VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_company_name (company_name)
);

-- Job listings
CREATE TABLE job_listings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employer_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    salary_range VARCHAR(100),
    location VARCHAR(255),
    job_type ENUM('full_time', 'part_time', 'contract', 'internship') NOT NULL,
    experience_level VARCHAR(50),
    status ENUM('active', 'closed', 'draft') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    closing_date DATE,
    FOREIGN KEY (employer_id) REFERENCES employer_profiles(id) ON DELETE CASCADE,
    INDEX idx_employer_id (employer_id),
    INDEX idx_status (status),
    INDEX idx_job_type (job_type),
    INDEX idx_location (location)
);

-- Job applications
CREATE TABLE job_applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_id INT NOT NULL,
    applicant_id INT NOT NULL,
    cover_letter TEXT,
    status ENUM('pending', 'reviewed', 'shortlisted', 'rejected', 'accepted') DEFAULT 'pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES job_listings(id) ON DELETE CASCADE,
    FOREIGN KEY (applicant_id) REFERENCES job_seeker_profiles(id) ON DELETE CASCADE,
    INDEX idx_job_id (job_id),
    INDEX idx_applicant_id (applicant_id),
    INDEX idx_status (status),
    UNIQUE KEY unique_application (job_id, applicant_id)
);