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

// State management
let loginAttempts = 0;
let currentCaptcha = '';
let showCaptcha = false;

// DOM Elements
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const mfaInput = document.getElementById('mfa-code');
const mfaGroup = document.getElementById('mfa-group');
const captchaGroup = document.getElementById('captcha-group');
const captchaDisplay = document.getElementById('captcha-display');
const captchaInput = document.getElementById('captcha-input');
const rememberMeCheckbox = document.getElementById('remember-me');
const loginBtn = document.getElementById('login-btn');
const btnText = document.getElementById('btn-text');
const btnSpinner = document.getElementById('btn-spinner');
const alertContainer = document.getElementById('alert-container');
const alertMessage = document.getElementById('alert-message');
const attemptsDisplay = document.getElementById('login-attempts');
const attemptsCount = document.getElementById('attempts-count');
const togglePasswordBtn = document.getElementById('toggle-password');
const forgotPasswordLink = document.getElementById('forgot-password');
const forgotPasswordModal = document.getElementById('forgot-password-modal');
const closeModalBtn = document.getElementById('close-modal');
const forgotPasswordForm = document.getElementById('forgot-password-form');
const resetEmailInput = document.getElementById('reset-email');
const resetMessage = document.getElementById('reset-message');
const googleLoginBtn = document.getElementById('google-login');
const githubLoginBtn = document.getElementById('github-login');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in
    if (sessionStorage.getItem('isLoggedIn') || localStorage.getItem('isLoggedIn')) {
        window.location.href = 'pages/dashboard.html';
    }

    setupEventListeners();
});

function setupEventListeners() {
    // Form submission
    loginForm.addEventListener('submit', handleLogin);

    // Password toggle
    togglePasswordBtn.addEventListener('click', togglePasswordVisibility);

    // Forgot password
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        forgotPasswordModal.style.display = 'flex';
    });

    closeModalBtn.addEventListener('click', () => {
        forgotPasswordModal.style.display = 'none';
        resetMessage.style.display = 'none';
    });

    forgotPasswordForm.addEventListener('submit', handleForgotPassword);

    // CAPTCHA refresh
    document.getElementById('refresh-captcha').addEventListener('click', generateCaptcha);

    // SSO Buttons
    googleLoginBtn.addEventListener('click', handleGoogleLogin);
    githubLoginBtn.addEventListener('click', handleGithubLogin);

    // Click outside modal to close
    window.addEventListener('click', (e) => {
        if (e.target === forgotPasswordModal) {
            forgotPasswordModal.style.display = 'none';
        }
    });
}

function togglePasswordVisibility() {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
}

function generateCaptcha() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    currentCaptcha = '';
    for (let i = 0; i < 6; i++) {
        currentCaptcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    captchaDisplay.textContent = currentCaptcha;
    captchaDisplay.setAttribute('data-captcha', currentCaptcha);
}

function showAlert(message, type = 'error') {
    alertContainer.style.display = 'block';
    alertMessage.textContent = message;
    alertMessage.className = `alert ${type}`;
    alertMessage.setAttribute('data-cy', `alert-${type}`);
}

function hideAlert() {
    alertContainer.style.display = 'none';
}

function setLoading(isLoading) {
    loginBtn.disabled = isLoading;
    btnText.style.display = isLoading ? 'none' : 'inline';
    btnSpinner.style.display = isLoading ? 'inline-block' : 'none';
}

async function handleLogin(e) {
    e.preventDefault();
    hideAlert();

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const mfaCode = mfaInput.value.trim();
    const rememberMe = rememberMeCheckbox.checked;
    const captchaValue = captchaInput.value.trim();

    // Validate CAPTCHA if shown
    if (showCaptcha && captchaValue !== currentCaptcha) {
        showAlert('Invalid CAPTCHA. Please try again.', 'error');
        generateCaptcha();
        return;
    }

    // Basic validation
    if (!email || !password) {
        showAlert('Please enter email and password', 'error');
        return;
    }

    setLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = MOCK_USERS[email];

    // Check if user exists and password is correct
    if (!user || user.password !== password) {
        loginAttempts++;
        attemptsCount.textContent = loginAttempts;
        attemptsDisplay.style.display = 'block';

        showAlert('Invalid email or password', 'error');

        // Show CAPTCHA after 3 failed attempts
        if (loginAttempts >= 3 && !showCaptcha) {
            showCaptcha = true;
            captchaGroup.style.display = 'block';
            generateCaptcha();
            showAlert('Too many failed attempts. Please complete the CAPTCHA.', 'warning');
        }

        // Lock after 5 attempts
        if (loginAttempts >= 5) {
            showAlert('Account temporarily locked due to too many failed attempts. Please try again later.', 'error');
            loginBtn.disabled = true;
        }

        setLoading(false);
        return;
    }

    // Check account status
    if (user.status === 'locked') {
        showAlert('Your account is locked. Please contact support.', 'error');
        setLoading(false);
        return;
    }

    // Check email verification
    if (!user.emailVerified) {
        showAlert('Please verify your email address. ', 'warning');
        setTimeout(() => {
            showAlert('Please verify your email address. Check your inbox for verification link.', 'warning');
        }, 100);
        setLoading(false);
        return;
    }

    // Check password expiration
    if (user.passwordExpired) {
        showAlert('Your password has expired. Redirecting to password reset...', 'warning');
        setTimeout(() => {
            forgotPasswordModal.style.display = 'flex';
            resetEmailInput.value = email;
        }, 2000);
        setLoading(false);
        return;
    }

    // Check MFA
    if (user.mfaEnabled && !mfaGroup.style.display.includes('block')) {
        mfaGroup.style.display = 'block';
        showAlert('Please enter your MFA code', 'info');
        setLoading(false);
        return;
    }

    if (user.mfaEnabled && mfaCode !== user.mfaCode) {
        showAlert('Invalid MFA code', 'error');
        setLoading(false);
        return;
    }

    // Successful login
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('isLoggedIn', 'true');
    storage.setItem('userEmail', email);
    storage.setItem('sessionType', rememberMe ? 'persistent' : 'session');
    storage.setItem('loginTime', new Date().toISOString());

    showAlert('Login successful! Redirecting...', 'success');

    setTimeout(() => {
        window.location.href = 'pages/dashboard.html';
    }, 1500);
}

async function handleForgotPassword(e) {
    e.preventDefault();

    const email = resetEmailInput.value.trim();

    if (!email) {
        return;
    }

    // Simulate sending reset email
    await new Promise(resolve => setTimeout(resolve, 1000));

    resetMessage.style.display = 'block';
    resetMessage.className = 'reset-message success';
    resetMessage.textContent = 'Password reset link sent! Check your email.';
    resetMessage.setAttribute('data-cy', 'reset-success-message');

    setTimeout(() => {
        forgotPasswordModal.style.display = 'none';
        resetMessage.style.display = 'none';
        forgotPasswordForm.reset();
    }, 3000);
}

function handleGoogleLogin() {
    showAlert('Redirecting to Google login...', 'info');
    // Simulate SSO redirect
    setTimeout(() => {
        // In real app, this would redirect to Google OAuth
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userEmail', 'google-user@gmail.com');
        sessionStorage.setItem('sessionType', 'sso-google');
        sessionStorage.setItem('loginTime', new Date().toISOString());
        window.location.href = 'pages/dashboard.html';
    }, 1500);
}

function handleGithubLogin() {
    showAlert('Redirecting to GitHub login...', 'info');
    // Simulate SSO redirect
    setTimeout(() => {
        // In real app, this would redirect to GitHub OAuth
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userEmail', 'github-user@github.com');
        sessionStorage.setItem('sessionType', 'sso-github');
        sessionStorage.setItem('loginTime', new Date().toISOString());
        window.location.href = 'pages/dashboard.html';
    }, 1500);
}
