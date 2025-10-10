describe('Login Form - All Test Scenarios', () => {
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

      // Verify redirect to dashboard
      cy.url().should('include', '/dashboard.html')
      cy.get('[data-cy="welcome-message"]').should('contain', users.validUser.email)
    })

    it('should login successfully with "Remember Me" checked', () => {
      cy.login(users.validUser.email, users.validUser.password, null, true)

      cy.url().should('include', '/dashboard.html')
      cy.get('[data-cy="session-type"]').should('contain', 'Persistent')

      // Verify localStorage is set
      cy.window().then((win) => {
        expect(win.localStorage.getItem('isLoggedIn')).to.equal('true')
      })
    })

    it('should login successfully with MFA', () => {
      cy.login(users.mfaUser.email, users.mfaUser.password, users.mfaUser.mfaCode)

      cy.url().should('include', '/dashboard.html')
      cy.get('[data-cy="welcome-message"]').should('contain', users.mfaUser.email)
    })
  })

  describe('UC-02: Wrong Password', () => {
    it('should show error message for incorrect password', () => {
      cy.get('[data-cy="email-input"]').type(users.validUser.email)
      cy.get('[data-cy="password-input"]').type('wrongpassword')
      cy.get('[data-cy="login-button"]').click()

      cy.checkAlert('Invalid email or password')
      cy.get('[data-cy="login-attempts"]').should('be.visible')
    })

    it('should show CAPTCHA after 3 failed attempts', () => {
      // Attempt 1-3
      for (let i = 0; i < 3; i++) {
        cy.get('[data-cy="email-input"]').clear().type(users.validUser.email)
        cy.get('[data-cy="password-input"]').clear().type('wrongpassword')
        cy.get('[data-cy="login-button"]').click()
        cy.wait(1000)
      }

      // CAPTCHA should be visible
      cy.get('[data-cy="captcha-display"]').should('be.visible')
      cy.checkAlert('Too many failed attempts', 'warning')
    })

    it('should lock account after 5 failed attempts', () => {
      // Attempt 1-5
      for (let i = 0; i < 5; i++) {
        cy.get('[data-cy="email-input"]').clear().type(users.validUser.email)
        cy.get('[data-cy="password-input"]').clear().type('wrongpassword')
        cy.get('[data-cy="login-button"]').click()

        if (i >= 2) {
          // Handle CAPTCHA
          cy.get('[data-cy="captcha-display"]').invoke('attr', 'data-captcha').then((captcha) => {
            cy.get('[data-cy="captcha-input"]').clear().type(captcha)
          })
          cy.get('[data-cy="login-button"]').click()
        }
        cy.wait(1000)
      }

      // Account should be locked
      cy.checkAlert('Account temporarily locked')
      cy.get('[data-cy="login-button"]').should('be.disabled')
    })
  })

  describe('UC-03: Locked Account', () => {
    it('should show locked account message', () => {
      cy.login(users.lockedUser.email, users.lockedUser.password)

      cy.checkAlert('Your account is locked')
      cy.url().should('not.include', '/dashboard.html')
    })
  })

  describe('UC-04: Unverified Account', () => {
    it('should show email verification message', () => {
      cy.login(users.unverifiedUser.email, users.unverifiedUser.password)

      cy.checkAlert('Please verify your email', 'warning')
      cy.url().should('not.include', '/dashboard.html')
    })
  })

  describe('UC-05: Password Expired', () => {
    it('should redirect to password reset for expired password', () => {
      cy.login(users.expiredPasswordUser.email, users.expiredPasswordUser.password)

      cy.checkAlert('Your password has expired', 'warning')
      cy.get('[data-cy="close-modal"]', { timeout: 3000 }).should('be.visible')
      cy.get('[data-cy="reset-email-input"]').should('have.value', users.expiredPasswordUser.email)
    })
  })

  describe('UC-06: Forgot Password', () => {
    it('should open forgot password modal', () => {
      cy.get('[data-cy="forgot-password"]').click()
      cy.get('[data-cy="close-modal"]').should('be.visible')
    })

    it('should send password reset email', () => {
      cy.get('[data-cy="forgot-password"]').click()
      cy.get('[data-cy="reset-email-input"]').type(users.validUser.email)
      cy.get('[data-cy="send-reset-button"]').click()

      cy.get('[data-cy="reset-success-message"]').should('be.visible')
        .and('contain', 'Password reset link sent')
    })

    it('should close modal after sending reset link', () => {
      cy.get('[data-cy="forgot-password"]').click()
      cy.get('[data-cy="reset-email-input"]').type(users.validUser.email)
      cy.get('[data-cy="send-reset-button"]').click()

      cy.get('[data-cy="close-modal"]', { timeout: 4000 }).should('not.be.visible')
    })
  })

  describe('UC-07: SSO Login', () => {
    it('should redirect to Google SSO', () => {
      cy.get('[data-cy="google-login"]').click()

      cy.checkAlert('Redirecting to Google login', 'info')
      cy.url({ timeout: 3000 }).should('include', '/dashboard.html')
      cy.get('[data-cy="session-type"]').should('contain', 'SSO-GOOGLE')
    })

    it('should redirect to GitHub SSO', () => {
      cy.get('[data-cy="github-login"]').click()

      cy.checkAlert('Redirecting to GitHub login', 'info')
      cy.url({ timeout: 3000 }).should('include', '/dashboard.html')
      cy.get('[data-cy="session-type"]').should('contain', 'SSO-GITHUB')
    })
  })

  describe('Additional UI Tests', () => {
    it('should toggle password visibility', () => {
      cy.get('[data-cy="password-input"]').should('have.attr', 'type', 'password')
      cy.get('[data-cy="toggle-password"]').click()
      cy.get('[data-cy="password-input"]').should('have.attr', 'type', 'text')
    })

    it('should show MFA input for MFA-enabled user', () => {
      cy.get('[data-cy="email-input"]').type(users.mfaUser.email)
      cy.get('[data-cy="password-input"]').type(users.mfaUser.password)
      cy.get('[data-cy="login-button"]').click()

      cy.get('[data-cy="mfa-input"]').should('be.visible')
      cy.checkAlert('Please enter your MFA code', 'info')
    })

    it('should refresh CAPTCHA code', () => {
      // Trigger CAPTCHA
      for (let i = 0; i < 3; i++) {
        cy.get('[data-cy="email-input"]').clear().type(users.validUser.email)
        cy.get('[data-cy="password-input"]').clear().type('wrongpassword')
        cy.get('[data-cy="login-button"]').click()
        cy.wait(1000)
      }

      cy.get('[data-cy="captcha-display"]').invoke('text').then((firstCaptcha) => {
        cy.get('[data-cy="refresh-captcha"]').click()
        cy.get('[data-cy="captcha-display"]').invoke('text').should('not.equal', firstCaptcha)
      })
    })

    it('should validate required fields', () => {
      cy.get('[data-cy="login-button"]').click()

      // HTML5 validation should prevent submission
      cy.get('[data-cy="email-input"]').then(($input) => {
        expect($input[0].validationMessage).to.exist
      })
    })
  })

  describe('Session Management', () => {
    it('should logout successfully', () => {
      cy.login(users.validUser.email, users.validUser.password)
      cy.url().should('include', '/dashboard.html')

      cy.get('[data-cy="logout-button"]').click()
      cy.url().should('not.include', '/dashboard.html')
      cy.url().should('include', 'index.html')
    })

    it('should redirect to dashboard if already logged in', () => {
      cy.login(users.validUser.email, users.validUser.password)
      cy.url().should('include', '/dashboard.html')

      // Try to visit login page
      cy.visit('/')
      cy.url().should('include', '/dashboard.html')
    })

    it('should persist session with Remember Me', () => {
      cy.login(users.validUser.email, users.validUser.password, null, true)

      cy.reload()
      cy.url().should('include', '/dashboard.html')

      cy.window().then((win) => {
        expect(win.localStorage.getItem('isLoggedIn')).to.equal('true')
      })
    })

    it('should not persist session without Remember Me', () => {
      cy.login(users.validUser.email, users.validUser.password)

      cy.window().then((win) => {
        expect(win.sessionStorage.getItem('isLoggedIn')).to.equal('true')
        expect(win.localStorage.getItem('isLoggedIn')).to.be.null
      })
    })
  })
})
