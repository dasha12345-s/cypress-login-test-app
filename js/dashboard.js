// Check if user is logged in
const isLoggedIn = sessionStorage.getItem('isLoggedIn') || localStorage.getItem('isLoggedIn');
const userEmail = sessionStorage.getItem('userEmail') || localStorage.getItem('userEmail');
const sessionType = sessionStorage.getItem('sessionType') || localStorage.getItem('sessionType');
const loginTime = sessionStorage.getItem('loginTime') || localStorage.getItem('loginTime');

if (!isLoggedIn) {
    window.location.href = '../index.html';
}

// Display user info
document.getElementById('user-email').textContent = userEmail;
document.getElementById('session-type').textContent = sessionType === 'persistent' ? 'Persistent (Remember Me)' :
                                                       sessionType === 'session' ? 'Session Only' :
                                                       sessionType.includes('sso') ? sessionType.toUpperCase() : 'Unknown';

if (loginTime) {
    const loginDate = new Date(loginTime);
    document.getElementById('login-time').textContent = loginDate.toLocaleString();
}

// Logout functionality
document.getElementById('logout-btn').addEventListener('click', () => {
    sessionStorage.clear();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('sessionType');
    localStorage.removeItem('loginTime');
    window.location.href = '../index.html';
});
