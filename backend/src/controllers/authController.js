const db = require('../config/database');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authController = {
    async register(req, res) {
        try {
            const { email, password, user_type, first_name, last_name, profile } = req.body;

            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'Email already registered' });
            }

            const userId = await User.create({
                email,
                password,
                user_type,
                first_name,
                last_name
            });

            await User.createProfile(userId, profile, user_type);

            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const isValidPassword = await bcrypt.compare(password, user.password_hash);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { userId: user.id, userType: user.user_type },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    userType: user.user_type,
                    firstName: user.first_name,
                    lastName: user.last_name
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    async getMe(req, res) {
        try {
            const user = await User.findById(req.user.userId);
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            let employerProfile = null;
            if (user.user_type === 'employer') {
                const [profiles] = await db.execute(
                    'SELECT * FROM employer_profiles WHERE user_id = ?',
                    [user.id]
                );
                
                if (profiles && profiles.length > 0) {
                    employerProfile = profiles[0];
                } else {
                    return res.status(404).json({ message: 'Employer profile not found' });
                }
            }

            res.json({
                id: user.id,
                email: user.email,
                userType: user.user_type,
                firstName: user.first_name,
                lastName: user.last_name,
                employerProfile
            });
        } catch (error) {
            console.error('Error in getMe:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
};

module.exports = authController;