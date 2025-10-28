/// <reference types="cypress" />

describe('Login UI/UX Tests', () => {
    beforeEach('open the app', () => {
        cy.visit('/')
    })

    describe('Logo and branding visible', () => {
        it('should contain logo', () => {
            cy.get('.logo').should('be.visible')
        })
        it('should contain branding text', () => {
            cy.get('[data-cy="brand-name"]')
                .should('be.visible')
                .and('contain', 'SecureAuth')
        })
    })

    describe('Username/email and password fields labeled', () => {
        it('should contain username/email field', () => {
            cy.contains('Email Address').should('be.visible')
            cy.get('[data-cy="email-input"]')
                .should('be.visible')
                .and('have.attr', 'placeholder', 'Enter your email')
        })
        it('should contain password field', () => {
            cy.contains('Password').should('be.visible')
            cy.get('[data-cy="password-input"]')
                .should('be.visible')
                .and('have.attr', 'placeholder', 'Enter your password')
        })
    })

    describe('Button visibility and state', () => {
        it('should display visible and aligned login button', () => {
            cy.get('[data-cy="login-button"]')
                .should('be.visible')
                .and('contain', 'Login')
                .and('have.attr', 'type', 'submit')
                .and('have.attr', 'id', 'login-btn')
        })
    })

    describe('Links visible and working', () => {
        it('should display "Forgot password?" link', () => {
            cy.get('[data-cy="forgot-password"]')
                .should('be.visible')
                .and('contain', 'Forgot password?')
                .click()
            cy.get('[class="modal-content"]')
                .should('be.visible')
            cy.get('[data-cy="close-modal"]')
                .click()
            cy.get('[class="modal-content"]')
                .should('not.be.visible')
        })
    })
    it('should display "Sign up" link with correct href', () => {
        cy.get('[data-cy="signup-link"]')
            .should('be.visible')
            .and('contain', 'Sign up')
            .and('have.attr', 'href', 'pages/signup.html')
    })

    describe('Consistent font, colors, and spacing', () => {
        it('should have consistent font family', () => {
            cy.get('body')
                .should('have.css', 'font-family')
            cy.get('[data-cy="brand-name"]')
                .should('have.css', 'font-family')
            cy.get('[data-cy="email-input"]')
                .should('have.css', 'font-family')
        })
        it('should use primary brand color consistently', () => {
            cy.get('[data-cy="brand-name"]')
                .should('have.css', 'color', 'rgb(102, 126, 234)')
            cy.get('[data-cy="login-button"]')
                .should('have.css', 'background-color', 'rgb(102, 126, 234)')
        })
        it('should have consistent spacing between form fields', () => {
            cy.get('.form-group').first()
                .should('have.css', 'margin-bottom', '20px')
        })
        it('should have consistent input border radius', () => {
            cy.get('[data-cy="email-input"]')
                .should('have.css', 'border-radius', '8px')
        })
        it('should have consistent button styling', () => {
            cy.get('[data-cy="login-button"]')
                .should('have.css', 'border-radius', '8px')
                .and('have.css', 'color', 'rgb(255, 255, 255)')
        })
    })

    describe('Email field validation', () => {
        it('should accept valid email format', () => {
            cy.get('[data-cy="email-input"]')
                .type('user@example.com')
                .should('have.value', 'user@example.com')
        })
        it('should have email type attribute', () => {
            cy.get('[data-cy="email-input"]')
                .type('user@example.com')
                .should('have.attr', 'type', 'email')
        })
        it('should be required field', () => {
            cy.get('[data-cy="email-input"]')
                .should('have.attr', 'required')
        })
    })

    describe('Password masking', () => {
        it('should mask password by default', () => {
            cy.get('[data-cy="password-input"]')
                .should('have.attr', 'type', 'password')
        })
        it('should display toggle password button', () => {
            cy.get('[data-cy="toggle-password"]')
                .should('be.visible')
        })
        it('should reveal password when toggle is clicked', () => {
            cy.get('[data-cy="password-input"]')
                .type('mySecretPassword')
            cy.get('[data-cy="password-input"]')
                .should('have.attr', 'type', 'password')
            cy.get('[data-cy="toggle-password"]')
                .click()
            cy.get('[data-cy="password-input"]')
                .should('have.attr', 'type', 'text')
        })
        it('should hide password again when toggle is clicked twice', () => {
            cy.get('[data-cy="password-input"]')
                .type('mySecretPassword')
            cy.get('[data-cy="toggle-password"]')
                .click()
            cy.get('[data-cy="password-input"]')
                .should('have.attr', 'type', 'text')
            cy.get('[data-cy="toggle-password"]')
                .click()
            cy.get('[data-cy="password-input"]')
                .should('have.attr', 'type', 'password')
        })
        it('should keep password value when toggling visibility', () => {
            const password = 'reallyStrongPassword2025'

            cy.get('[data-cy="password-input"]')
                .type(password)
            cy.get('[data-cy="toggle-password"]')
                .click()
            cy.get('[data-cy="password-input"]')
                .should('have.value', password)
        })
    })

    describe('Tab order (keyboard navigation)', () => {
        it('should allow focusing email field', () => {
            cy.get('[data-cy="email-input"]')
                .focus()
            cy.focused()
                .should('have.attr', 'data-cy', 'email-input')
        })
        it('should allow focusing password field', () => {
            cy.get('[data-cy="password-input"]')
                .focus()
            cy.focused()
                .should('have.attr', 'data-cy', 'password-input')
        })
        it('should allow focusing login button', () => {
            cy.get('[data-cy="login-button"]')
                .focus()
            cy.focused()
                .should('have.attr', 'data-cy', 'login-button')
        })
        it('should submit form with Enter key in email field',() => {
            cy.get('[data-cy="email-input"]')
                .type('user@test.com{enter}')
        })
    })
})