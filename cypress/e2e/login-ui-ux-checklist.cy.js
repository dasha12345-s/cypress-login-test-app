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
})