# Cypress Login Test App

A comprehensive login form application designed for practicing Cypress E2E testing. This app includes all common login scenarios and edge cases.

## Features

### Test Scenarios Covered

#### UC-01: Happy Path ✅
- Valid login with credentials
- Login with "Remember Me" option
- Login with MFA (Multi-Factor Authentication)

#### UC-02: Wrong Password ❌
- Invalid credentials error
- Failed attempt tracking
- CAPTCHA after 3 failed attempts
- Account lock after 5 failed attempts

#### UC-03: Locked Account 🔒
- Account status validation
- Support message display

#### UC-04: Unverified Account 📧
- Email verification check
- Resend verification option

#### UC-05: Password Expired ⏰
- Expired password detection
- Forced password reset flow

#### UC-06: Forgot Password 🔑
- Password reset modal
- Reset email sending
- Success confirmation

#### UC-07: SSO Login 🔐
- Google OAuth integration
- GitHub OAuth integration

### Additional Features
- Password visibility toggle
- CAPTCHA generation and refresh
- Session management (sessionStorage vs localStorage)
- Responsive design
- Custom Cypress commands

## Mock Users

The app includes these test users:

| Email | Password | Features |
|-------|----------|----------|
| `user@test.com` | `Password123!` | Normal user |
| `mfa@test.com` | `Password123!` | MFA enabled (code: `123456`) |
| `locked@test.com` | `Password123!` | Account locked |
| `unverified@test.com` | `Password123!` | Email not verified |
| `expired@test.com` | `Password123!` | Password expired |

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the application:**
   ```bash
   npm start
   ```
   The app will run on `http://localhost:8080`

3. **Open Cypress (in another terminal):**
   ```bash
   npm run cy:open
   ```

4. **Run tests headlessly:**
   ```bash
   npm test
   ```

## Project Structure

```
cypress-login-test-app/
├── cypress/
│   ├── e2e/
│   │   └── login.cy.js          # All test scenarios
│   ├── fixtures/
│   │   └── users.json            # Test data
│   └── support/
│       ├── commands.js           # Custom commands
│       └── e2e.js               # Global setup
├── css/
│   └── style.css                 # Styling
├── js/
│   ├── app.js                    # Main logic
│   └── dashboard.js              # Dashboard logic
├── pages/
│   └── dashboard.html            # Dashboard page
├── index.html                    # Login page
├── cypress.config.js             # Cypress config
└── package.json
```

## Custom Cypress Commands

### `cy.login(email, password, mfaCode, rememberMe)`
Login with credentials and optional MFA/Remember Me.

```javascript
cy.login('user@test.com', 'Password123!')
cy.login('mfa@test.com', 'Password123!', '123456')
cy.login('user@test.com', 'Password123!', null, true)
```

### `cy.checkAlert(message, type)`
Verify alert messages.

```javascript
cy.checkAlert('Invalid email or password', 'error')
cy.checkAlert('Login successful', 'success')
```

### `cy.clearSession()`
Clear all session data.

```javascript
cy.clearSession()
```

## Test Coverage

The test suite includes:
- ✅ 20+ test cases
- ✅ All use cases (UC-01 to UC-07)
- ✅ UI interaction tests
- ✅ Session management tests
- ✅ Error handling tests
- ✅ CAPTCHA validation
- ✅ SSO flow testing

## Running Tests

### Interactive Mode (Cypress UI)
```bash
npm run cy:open
```

### Headless Mode
```bash
npm run cy:run
```

### Specific Test File
```bash
npx cypress run --spec "cypress/e2e/login.cy.js"
```

## Practice Exercises

1. Add more test cases for edge cases
2. Implement API mocking with `cy.intercept()`
3. Add custom assertions
4. Create Page Object Model (POM) pattern
5. Add accessibility tests with cypress-axe
6. Implement visual regression testing

## Data Attributes

All interactive elements have `data-cy` attributes for reliable test selectors:
- `data-cy="email-input"`
- `data-cy="password-input"`
- `data-cy="login-button"`
- `data-cy="mfa-input"`
- `data-cy="captcha-display"`
- And more...

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- Cypress (E2E Testing)
- http-server (Local server)

## Tips for Learning

1. Start with the happy path tests
2. Understand how custom commands work
3. Explore fixture data usage
4. Practice with different assertion types
5. Learn to handle async operations
6. Master element selection strategies

Happy Testing! 🚀
