// Custom Login Command
Cypress.Commands.add('login', (email, password, mfaCode = null, rememberMe = false) => {
  cy.visit('/')
  cy.get('[data-cy="email-input"]').type(email)
  cy.get('[data-cy="password-input"]').type(password)

  if (rememberMe) {
    cy.get('[data-cy="remember-me"]').check()
  }

  cy.get('[data-cy="login-button"]').click()

  // Handle MFA if needed
  if (mfaCode) {
    cy.get('[data-cy="mfa-input"]').should('be.visible').type(mfaCode)
    cy.get('[data-cy="login-button"]').click()
  }
})

// Command to check alert messages
Cypress.Commands.add('checkAlert', (message, type = 'error') => {
  cy.get(`[data-cy="alert-${type}"]`).should('be.visible').and('contain', message)
})

// Command to clear session/storage
Cypress.Commands.add('clearSession', () => {
  cy.clearLocalStorage()
  cy.clearCookies()
  cy.window().then((win) => {
    win.sessionStorage.clear()
  })
})