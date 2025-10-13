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
})