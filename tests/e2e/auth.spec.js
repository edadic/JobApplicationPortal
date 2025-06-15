import { test, expect } from '@playwright/test';

const jobSeeker = {
    email: 'jobseeker@test1.com',
    username: 'testseeker1',
    password: 'test123'
};

const employer = {
    email: 'employer@test1.com',
    username: 'testemployer1',
    password: 'test123'
};

// Test Suite 1: Authentication
test.describe('Authentication flows', () => {
    // test('Job seeker can register', async ({ page }) => {
    //     await page.goto('http://localhost:5174/register');
    //     await page.fill('input[placeholder="Email address"]', jobSeeker.email);
    //     await page.fill('input[placeholder="Username"]', jobSeeker.username);
    //     await page.fill('input[placeholder="Password"]', jobSeeker.password);
    //     // Don't check employer checkbox

    //     // Wait for response after registration
    // const responsePromise = page.waitForResponse(response => 
    //     response.url().includes('/api/auth/register') && 
    //     response.status() === 200
    // );
    
    // await page.click('button:text("Register")');
    // await responsePromise;
    //     await expect(page).toHaveURL('http://localhost:5174/login');
    // });

    // test('Employer can register', async ({ page }) => {
    //     await page.goto('http://localhost:5174/register');
    //     await page.fill('input[placeholder="Email address"]', employer.email);
    //     await page.fill('input[placeholder="Username"]', employer.username);
    //     await page.fill('input[placeholder="Password"]', employer.password);
    //     await page.check('input[type="checkbox"]'); // Check employer checkbox

    //     const responsePromise = page.waitForResponse(response =>
    //         response.url().includes('/api/auth/register') && 
    //         response.status() === 200
    //     );
    //     await page.click('button:text("Register")');
    //     await expect(page).toHaveURL('http://localhost:5174/login');
    // });

    test('User can login as employer', async ({ page }) => {
        await page.goto('http://localhost:5174/login');
        await page.fill('input[type="email"]', employer.email);
        await page.fill('input[type="password"]', employer.password);
        await page.click('button:text("Sign in")');
        await expect(page).toHaveURL('http://localhost:5174/');
    });
    test('Employer can logout', async ({ page }) => {
        await page.goto('http://localhost:5174/login');
        await page.fill('input[type="email"]', employer.email);
        await page.fill('input[type="password"]', employer.password);
        await page.click('button:text("Sign in")');
        await expect(page).toHaveURL('http://localhost:5174/');
        await page.click('button:text("Logout")');
        await expect(page).toHaveURL('http://localhost:5174/login');
    });
    test('Job seeker can login', async ({ page }) => {
        await page.goto('http://localhost:5174/login');
        await page.fill('input[type="email"]', jobSeeker.email);
        await page.fill('input[type="password"]', jobSeeker.password);
        await page.click('button:text("Sign in")');
        await expect(page).toHaveURL('http://localhost:5174/');
    });
    test('Job seeker can logout', async ({ page }) => {
        await page.goto('http://localhost:5174/login');
        await page.fill('input[type="email"]', jobSeeker.email);
        await page.fill('input[type="password"]', jobSeeker.password);
        await page.click('button:text("Sign in")');
        await expect(page).toHaveURL('http://localhost:5174/');
        await page.click('button:text("Logout")');
        await expect(page).toHaveURL('http://localhost:5174/login');
    });
    test('User cannot login with invalid credentials', async ({ page }) => {
        await page.goto('http://localhost:5174/login');
        await page.fill('input[type="email"]', 'invalid@example.com');
        await page.fill('input[type="password"]', 'wrongpassword');
        await page.click('button:text("Sign in")');
        await expect(page).toHaveURL('http://localhost:5174/login');
    });
});

// Test Suite 2: Profile Management
test.describe('Profile management', () => {
    test('Job seeker can complete profile', async ({ page }) => {
        // Login first
        await page.goto('http://localhost:5174/login');
        await page.fill('input[type="email"]', jobSeeker.email);
        await page.fill('input[type="password"]', jobSeeker.password);
        await page.click('button:text("Sign in")');

        // Go to profile
        await page.click('text=Profile');
        await page.click('button:text("Edit Profile")');
        await page.fill('input[placeholder="Experience Years"]', '3');
        await page.fill('input[placeholder="Education Level"]', 'Bachelor');
        await page.fill('input[placeholder="Preferred Job Type"]', 'Full-time');
        await page.fill('input[placeholder="Preferred Location"]', 'Remote');
        await page.click('button:text("Save")');
        await expect(page).toHaveURL('http://localhost:5174/profile');        
});
});

// Test Suite 3: Job Management
test.describe('Job management', () => {
    test('Job seeker can apply and check application status', async ({ page }) => {
        // Login as employer first to create a job
        await page.goto('http://localhost:5174/login');
        await page.fill('input[type="email"]', employer.email);
        await page.fill('input[type="password"]', employer.password);
        await page.click('button:text("Sign in")');

        // Create job listing
        await page.click('text=My Job Listings');
        await page.click('button:text("Post New Job")');
        await page.fill('input[placeholder="Job Title"]', 'Software Engineer');
        await page.fill('textarea[placeholder="Description"]', 'We are looking for a ...');
        await page.fill('input[placeholder="Location"]', 'Remote');
        await page.selectOption('select', 'Full Time');
        await page.fill('input[placeholder="Salary Range"]', '50000-70000');
        await page.click('button:text("Post Job")');
        
        // Logout employer
        await page.click('button:text("Logout")');

        // Login as job seeker
        await page.fill('input[type="email"]', jobSeeker.email);
        await page.fill('input[type="password"]', jobSeeker.password);
        await page.click('button:text("Sign in")');

        // Apply for job
        await page.click('text=All Jobs');
        await page.click('text=Software Engineer');
        await page.click('button:text("Apply Now")');
        await page.fill('textarea[placeholder="Tell us why you\'re interested in this position..."]', 'I am very interested in this position');
        if (await page.isVisible('input[type="file"]')) {
            await page.setInputFiles('input[type="file"]', '/Users/eldardadic/Desktop/sixth semester/SE/JobApplicationPortal 12.52.05/backend/uploads/resumes/resume_13_1749990949099.pdf'); // Ensure this path is correct
        }
        await page.click('button:text("Submit Application")');

        // Check application status
        await page.click('text=My Applications');
        await expect(
            page.getByRole('heading', { name: 'My Applications', level: 1 })
        ).toBeVisible({ timeout: 10000 });
        await expect(page.locator('text=Software Engineer')).toBeVisible({ timeout: 10000 });
        await expect(page.getByText('Status: pending')).toBeVisible();
    });
});

// Test Suite 4: Email Sending
test.describe('Email sending as an employer', () => {
    test('Employer can send job application emails', async ({ page }) => {
        // Login as employer
        await page.goto('http://localhost:5174/login');
        await page.fill('input[type="email"]', employer.email);
        await page.fill('input[type="password"]', employer.password);
        await page.click('button:text("Sign in")');
        await expect(page).toHaveURL('http://localhost:5174/');

        // Go to job applications
        await page.click('text=My Job Listings');

        // Select an application and send email
        await page.click('text=View Applications');
        await page.click('button:text("Send Message")');
        await page.fill('textarea[placeholder="Message"]', 'Thank you for applying!');
        await page.click('button:text("Send Email")');
    });
});