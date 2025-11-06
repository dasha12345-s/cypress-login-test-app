// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// State management
let loginAttempts = 0;

// DOM Elements
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const mfaInput = document.getElementById('mfa-code');
const mfaGroup = document.getElementById('mfa-group');
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

    // Basic validation
    if (!email || !password) {
        showAlert('Please enter email and password', 'error');
        return;
    }

    setLoading(true);

    try {
        // Call login API
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
                mfaCode: mfaCode || null
            })
        });

        const data = await response.json();

        // Handle failed login
        if (!response.ok || !data.success) {
            // Update attempts counter
            if (data.attempts) {
                loginAttempts = data.attempts;
                attemptsCount.textContent = loginAttempts;
                attemptsDisplay.style.display = 'block';
            }

            // Check if locked
            if (data.locked) {
                loginBtn.disabled = true;
                showAlert(data.message, 'error');
            } else if (data.requiresMfa) {
                mfaGroup.style.display = 'block';
                showAlert(data.message, 'info');
            } else if (data.passwordExpired) {
                showAlert(data.message, 'warning');
                setTimeout(() => {
                    forgotPasswordModal.style.display = 'flex';
                    resetEmailInput.value = email;
                }, 2000);
            } else {
                showAlert(data.message, response.status === 403 ? 'warning' : 'error');
            }

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

    } catch (error) {
        console.error('Login error:', error);
        showAlert('An error occurred. Please try again.', 'error');
        setLoading(false);
    }
}

async function handleForgotPassword(e) {
    e.preventDefault();

    const email = resetEmailInput.value.trim();

    if (!email) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        resetMessage.style.display = 'block';
        resetMessage.className = 'reset-message success';
        resetMessage.textContent = data.message;
        resetMessage.setAttribute('data-cy', 'reset-success-message');

        setTimeout(() => {
            forgotPasswordModal.style.display = 'none';
            resetMessage.style.display = 'none';
            forgotPasswordForm.reset();
        }, 3000);

    } catch (error) {
        console.error('Forgot password error:', error);
        resetMessage.style.display = 'block';
        resetMessage.className = 'reset-message error';
        resetMessage.textContent = 'An error occurred. Please try again.';
    }
}

async function handleGoogleLogin() {
    showAlert('Redirecting to Google login...', 'info');

    try {
        const response = await fetch(`${API_BASE_URL}/sso/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (data.success) {
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('userEmail', data.user.email);
            sessionStorage.setItem('sessionType', data.sessionType);
            sessionStorage.setItem('loginTime', new Date().toISOString());

            setTimeout(() => {
                window.location.href = 'pages/dashboard.html';
            }, 1500);
        }
    } catch (error) {
        console.error('Google SSO error:', error);
        showAlert('An error occurred. Please try again.', 'error');
    }
}

async function handleGithubLogin() {
    showAlert('Redirecting to GitHub login...', 'info');

    try {
        const response = await fetch(`${API_BASE_URL}/sso/github`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (data.success) {
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('userEmail', data.user.email);
            sessionStorage.setItem('sessionType', data.sessionType);
            sessionStorage.setItem('loginTime', new Date().toISOString());

            setTimeout(() => {
                window.location.href = 'pages/dashboard.html';
            }, 1500);
        }
    } catch (error) {
        console.error('GitHub SSO error:', error);
        showAlert('An error occurred. Please try again.', 'error');
    }
}
