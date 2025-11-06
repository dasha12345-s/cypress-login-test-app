describe('Login Form - Flow Test Scenarios', () => {
  let users

  before(() => {
    cy.fixture('users').then((data) => {
      users = data
    })
  })

  beforeEach(() => {
    cy.clearSession()
    cy.visit('/')
  })

  describe('UC-01: Happy Path - Valid Login', () => {
    it('should login successfully with valid credentials', () => {
      cy.login(users.validUser.email, users.validUser.password)
      cy.url()
        .should('include', '/dashboard.html')
      cy.get('[data-cy="welcome-message"]')
        .should('contain', users.validUser.email)
    })
    it('should login successfully with "Remember Me" checked', () => {
      cy.login(users.validUser.email, users.validUser.password, null, true)
      cy.url()
        .should('include', '/dashboard.html')
      cy.get('[data-cy="session-type"]')
        .should('contain', 'Persistent')

      cy.window().then((win) => {
        expect(win.localStorage
          .getItem('isLoggedIn'))
          .to.equal('true')
      })
    })

    it('should login successfully with MFA', () => {
      cy.login(users.mfaUser.email, users.mfaUser.password, users.mfaUser.mfaCode)

      cy.url()
        .should('include', '/dashboard.html')
      cy.get('[data-cy="welcome-message"]')
        .should('contain', users.mfaUser.email)
    })
  })

  describe('UC-02: Wrong Password', () => {
    it('should show error message for incorrect password', () => {
      cy.get('[data-cy="email-input"]')
        .type(users.validUser.email)
      cy.get('[data-cy="password-input"]')
        .type('wrongpassword')
      cy.get('[data-cy="login-button"]')
        .click()

      cy.checkAlert('Invalid email or password')
      cy.get('[data-cy="login-attempts"]')
        .should('be.visible')
    })
  })

  describe('UC-03: Locked Account', () => {
    it('should show locked account message', () => {
      cy.get('[data-cy="email-input"]')
        .type(users.lockedUser.email)
      cy.get('[data-cy="password-input"]')
        .type(users.lockedUser.password)
      cy.get('[data-cy="login-button"]')
        .click()

      cy.checkAlert('Your account is locked', 'warning')
      cy.url()
        .should('not.include', '/dashboard.html')
    })
  })

  describe('UC-04: Unverified Account', () => {
    it('should show email verification message', () => {
      cy.get('[data-cy="email-input"]')
        .type(users.unverifiedUser.email)
      cy.get('[data-cy="password-input"]')
        .type(users.unverifiedUser.password)
      cy.get('[data-cy="login-button"]')
        .click()

      cy.checkAlert('Please verify your email', 'warning')
      cy.url()
        .should('not.include', '/dashboard.html')
    })
  })

  describe('UC-05: Password Expired', () => {
    it('should redirect to password reset for expired password', () => {
      cy.get('[data-cy="email-input"]')
        .type(users.expiredPasswordUser.email)
      cy.get('[data-cy="password-input"]')
        .type(users.expiredPasswordUser.password)
      cy.get('[data-cy="login-button"]')
        .click()

      cy.checkAlert('Your password has expired', 'warning')
      cy.get('[data-cy="close-modal"]', { timeout: 3000 })
        .should('be.visible')
      cy.get('[data-cy="reset-email-input"]')
        .should('have.value', users.expiredPasswordUser.email)
    })
  })

  describe('UC-06: Forgot Password', () => {
    it('should open forgot password modal', () => {
      cy.get('[data-cy="forgot-password"]')
        .click()
      cy.get('[data-cy="close-modal"]')
        .should('be.visible')
    })

    it('should send password reset email', () => {
      cy.get('[data-cy="forgot-password"]')
        .click()
      cy.get('[data-cy="reset-email-input"]')
        .type(users.validUser.email)
      cy.get('[data-cy="send-reset-button"]')
        .click()

      cy.get('[data-cy="reset-success-message"]')
        .should('be.visible')
        .and('contain', 'Password reset link sent')
    })

    it('should close modal after sending reset link', () => {
      cy.get('[data-cy="forgot-password"]')
        .click()
      cy.get('[data-cy="reset-email-input"]')
        .type(users.validUser.email)
      cy.get('[data-cy="send-reset-button"]')
        .click()

      cy.get('[data-cy="close-modal"]', { timeout: 4000 })
        .should('not.be.visible')
    })
  })

  describe('UC-07: SSO Login', () => {
    it('should redirect to Google SSO', () => {
      cy.get('[data-cy="google-login"]')
        .click()

      cy.checkAlert('Redirecting to Google login', 'info')
      cy.url({ timeout: 3000 })
        .should('include', '/dashboard.html')
      cy.get('[data-cy="session-type"]')
        .should('contain', 'SSO-GOOGLE')
    })

    it('should redirect to GitHub SSO', () => {
      cy.get('[data-cy="github-login"]')
        .click()

      cy.checkAlert('Redirecting to GitHub login', 'info')
      cy.url({ timeout: 3000 })
        .should('include', '/dashboard.html')
      cy.get('[data-cy="session-type"]')
        .should('contain', 'SSO-GITHUB')
    })
  })

  describe('Additional UI Tests', () => {
    it('should show MFA input for MFA-enabled user', () => {
      cy.get('[data-cy="email-input"]')
        .type(users.mfaUser.email)
      cy.get('[data-cy="password-input"]')
        .type(users.mfaUser.password)
      cy.get('[data-cy="login-button"]')
        .click()

      cy.get('[data-cy="mfa-input"]')
        .should('be.visible')
      cy.checkAlert('Please enter your MFA code', 'info')
    })
  })

  describe('UC-08: Session Management', () => {
    it('should logout successfully', () => {
      cy.login(users.validUser.email, users.validUser.password)
      cy.url()
        .should('include', '/dashboard.html')

      cy.get('[data-cy="logout-button"]')
        .click()
      cy.url()
        .should('not.include', '/dashboard.html')
      cy.url()
        .should('include', 'index.html')
    })

    it('should redirect to dashboard if already logged in', () => {
      cy.login(users.validUser.email, users.validUser.password)
      cy.url()
        .should('include', '/dashboard.html')

      cy.visit('/')
      cy.url()
        .should('include', '/dashboard.html')
    })

    it('should not persist session without Remember Me', () => {
      cy.login(users.validUser.email, users.validUser.password)
      cy.url()
        .should('include', '/dashboard.html')

      cy.window()
        .then((win) => {
          expect(win.sessionStorage.getItem('isLoggedIn')).to.equal('true')
          expect(win.localStorage.getItem('isLoggedIn')).to.be.null
        })
    })
  })
})
