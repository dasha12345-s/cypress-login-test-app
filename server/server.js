const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 3000;

// JWT Secret (in production, use environment variable)
const JWT_SECRET = 'your-secret-key-change-this-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// Mock user database
const MOCK_USERS = {
    'user@test.com': {
        password: 'Password123!',
        status: 'active',
        mfaEnabled: false,
        emailVerified: true
    },
    'mfa@test.com': {
        password: 'Password123!',
        status: 'active',
        mfaEnabled: true,
        mfaCode: '123456',
        emailVerified: true
    },
    'locked@test.com': {
        password: 'Password123!',
        status: 'locked',
        mfaEnabled: false,
        emailVerified: true
    },
    'unverified@test.com': {
        password: 'Password123!',
        status: 'active',
        mfaEnabled: false,
        emailVerified: false
    },
    'expired@test.com': {
        password: 'Password123!',
        status: 'active',
        passwordExpired: true,
        mfaEnabled: false,
        emailVerified: true
    }
};

// Track login attempts per email (in-memory, resets on server restart)
const loginAttempts = {};

// Login endpoint
app.post('/api/login', (req, res) => {
    const { email, password, mfaCode } = req.body;
    console.log(email, loginAttempts[email])

    // Initialize attempts counter for this email
    if (!loginAttempts[email]) {
        loginAttempts[email] = 0;
    }

    const user = MOCK_USERS[email];

    // Check if user exists and password is correct
    if (!user || user.password !== password) {
        loginAttempts[email]++;

        const response = {
            success: false,
            message: 'Invalid email or password',
            attempts: loginAttempts[email]
        };

        // Lock after 5 attempts
        if (loginAttempts[email] >= 5) {
            response.locked = true;
            response.message = 'Account temporarily locked due to too many failed attempts. Please try again later.';
        }

        return res.status(401).json(response);
    }

    // Check account status
    if (user.status === 'locked') {
        return res.status(403).json({
            success: false,
            message: 'Your account is locked. Please contact support.'
        });
    }

    // Check email verification
    if (!user.emailVerified) {
        return res.status(403).json({
            success: false,
            message: 'Please verify your email address. Check your inbox for verification link.'
        });
    }

    // Check password expiration
    if (user.passwordExpired) {
        return res.status(403).json({
            success: false,
            message: 'Your password has expired. Redirecting to password reset...',
            passwordExpired: true
        });
    }

    // Check MFA
    if (user.mfaEnabled && !mfaCode) {
        return res.status(200).json({
            success: false,
            message: 'Please enter your MFA code',
            requiresMfa: true
        });
    }

    if (user.mfaEnabled && mfaCode !== user.mfaCode) {
        return res.status(401).json({
            success: false,
            message: 'Invalid MFA code'
        });
    }

    // Successful login - reset attempts
    loginAttempts[email] = 0;

    // Generate JWT token
    const token = jwt.sign(
        {
            email: email,
            status: user.status,
            mfaEnabled: user.mfaEnabled
        },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.status(200).json({
        success: true,
        message: 'Login successful',
        token: token,
        user: {
            email: email,
            status: user.status
        }
    });
});

// SSO endpoints (mock)
app.post('/api/sso/google', (req, res) => {
    const email = 'google.user@test.com';
    const token = jwt.sign(
        { email, status: 'active', ssoProvider: 'google' },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.status(200).json({
        success: true,
        message: 'Redirecting to Google login',
        token: token,
        sessionType: 'SSO-GOOGLE',
        user: {
            email: email
        }
    });
});

app.post('/api/sso/github', (req, res) => {
    const email = 'github.user@test.com';
    const token = jwt.sign(
        { email, status: 'active', ssoProvider: 'github' },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.status(200).json({
        success: true,
        message: 'Redirecting to GitHub login',
        token: token,
        sessionType: 'SSO-GITHUB',
        user: {
            email: email
        }
    });
});

// Forgot password endpoint
app.post('/api/forgot-password', (req, res) => {
    const { email } = req.body;

    // In a real app, send email here
    res.status(200).json({
        success: true,
        message: 'Password reset link sent! Check your email.'
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Backend API server running on http://localhost:${PORT}`);
    console.log(`📡 API endpoints available at http://localhost:${PORT}/api/*`);
});
