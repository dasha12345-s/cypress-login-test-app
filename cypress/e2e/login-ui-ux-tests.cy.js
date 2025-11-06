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
        it('should display "Sign up" link with correct href', () => {
            cy.get('[data-cy="signup-link"]')
                .should('be.visible')
                .and('contain', 'Sign up')
                .and('have.attr', 'href', 'pages/signup.html')
        })
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
        it('should submit form with Enter key in login field', () => {
            cy.get('[data-cy="email-input"]')
                .type('user@test.com{enter}')
            cy.get('[data-cy="password-input"]')
                .type('Password123!{enter}')
            cy.get('[data-cy="login-button"]')
                .should('exist')
        })
    })

    describe('Autofill and Remember me', () => {
        it('should display "Remember me" checkbox', () => {
            cy.get('[data-cy="remember-me"]')
                .should('be.visible')
        })
        it('should display "Remember me" label', () => {
            cy.contains('Remember me').should('be.visible')
        })
        it('should be unchecked by default', () => {
            cy.get('[data-cy="remember-me"]')
                .should('not.be.checked')
        })
        it('should allow checking the checkbox', () => {
            cy.get('[data-cy="remember-me"]')
                .check()
            cy.get('[data-cy="remember-me"]')
                .should('be.checked')
        })
        it('should allow unchecking the checkbox', () => {
            cy.get('[data-cy="remember-me"]')
                .check()
                .uncheck()
            cy.get('[data-cy="remember-me"]')
                .should('not.be.checked')
        })
    })

    describe('Copy/paste in password field', () => {
        const password = 'ReallyStrongPassword'

        it('should allow pasting password', () => {
            cy.get('[data-cy="password-input"]')
                .invoke('val', password)
                .should('have.value', password)
        })
        it('should allow typing and clearing password', () => {
            cy.get('[data-cy="password-input"]')
                .type('ThePassword')
                .should('have.value', 'ThePassword')
                .clear()
                .should('have.value', '')
        })
        it('should allow selecting all text in password field', () => {
            cy.get('[data-cy="password-input"]')
                .type(password)
                .type('{selectall}')
                .type('EvenStrongerPassword')
                .should('have.value', 'EvenStrongerPassword')
        })
        it('should allow backspace in password field', () => {
            cy.get('[data-cy="password-input"]')
                .type('NewTest123')
                .type('{backspace}{backspace}{backspace}')
                .should('have.value', 'NewTest')
        })
    })

    describe('Inline validation - empty fields', () => {
        it('should prevent submission with empty fields', () => {
            cy.get('[data-cy="login-button"]')
                .click()
            cy.url().should('not.include', 'dashboard')
        })
    })

    describe('Error message clarity', () => {
        it('should display error message for invalid login', () => {
            cy.get('[data-cy="email-input"]')
                .type('wrong@test.com')
            cy.get('[data-cy="password-input"]')
                .type('wrongpassword')
            cy.get('[data-cy="login-button"]')
                .click()

            cy.get('[data-cy="alert-error"]')
                .should('be.visible')
                .and('contain', 'Invalid email or password')
        })
        it('should use red styling for error messages', () => {
            cy.get('[data-cy="email-input"]')
                .type('wrong@test.com')
            cy.get('[data-cy="password-input"]')
                .type('wrongpassword')
            cy.get('[data-cy="login-button"]')
                .click()

            cy.get('[data-cy="alert-error"]')
                .should('have.css', 'color', 'rgb(204, 51, 51)')
        })
        it('should display success message after valid login', () => {
            cy.get('[data-cy="email-input"]')
                .type('user@test.com')
            cy.get('[data-cy="password-input"]')
                .type('Password123!')
            cy.get('[data-cy="login-button"]')
                .click()

            cy.get('[data-cy="alert-success"]')
                .should('be.visible')
                .and('contain', 'Login successful')
        })
    })

    describe('Generic error - invalid credentials', () => {
        it('should show generic error for wrong email', () => {
            cy.get('[data-cy="email-input"]')
                .type('nonexistent@test.com')
            cy.get('[data-cy="password-input"]')
                .type('Password123!')
            cy.get('[data-cy="login-button"]')
                .click()

            cy.get('[data-cy="alert-error"]')
                .should('be.visible')
                .and('contain', 'Invalid email or password')
                .and('not.contain', 'user not found')
        })
        it('should show generic error for wrong password', () => {
            cy.get('[data-cy="email-input"]')
                .type('user@test.com')
            cy.get('[data-cy="password-input"]')
                .type('WrongPassword!')
            cy.get('[data-cy="login-button"]')
                .click()

            cy.get('[data-cy="alert-error"]')
                .should('be.visible')
                .and('contain', 'Invalid email or password')
        })
    })

    describe('Responsive layout', () => {
        it('should display correctly on tablet', () => {
            cy.viewport(1280, 720)
            cy.get('.login-box')
                .should('be.visible')
        })
        it('should display correctly on tablet', () => {
            cy.viewport('ipad-2')
            cy.get('.login-box')
                .should('be.visible')
        })
        it('should display correctly on mobile', () => {
            cy.viewport('iphone-x')
            cy.get('.login-box')
                .should('be.visible')
            cy.get('[data-cy="email-input"]')
                .should('be.visible')
            cy.get('[data-cy="password-input"]')
                .should('be.visible')
        })
        it('should adjust styling for mobile screens', () => {
            cy.viewport(375, 667)
            cy.get('.login-box')
                .should('have.css', 'padding', '25px')
            cy.get('h1').should('have.css', 'font-size', '24px')
        })
    })

    describe('Mobile touch targets', () => {
        it('should have tappable buttons on mobile', () => {
            cy.viewport('iphone-x')
            cy.get('[data-cy="login-button"]')
                .should('be.visible')
                .invoke('outerHeight')
                .should('be.gte', 44)
        })
        it('should have adequate spacing between clickable elements', () => {
            cy.viewport('iphone-x')
            cy.get('[data-cy="remember-me"]')
                .should('be.visible')
            cy.get('[data-cy="forgot-password"]')
                .should('be.visible')
            cy.get('[data-cy="remember-me"]')
                .click()
            cy.get('[data-cy="remember-me"]')
                .should('be.checked')
        })
    })

    describe('Loading indicator', () => {
        it('should display loading spinner during login', () => {
            cy.get('[data-cy="email-input"]')
                .type('user@test.com')
            cy.get('[data-cy="password-input"]')
                .type('Password123!')
            cy.get('[data-cy="login-button"]')
                .click()

            cy.get('#btn-spinner')
                .should('be.visible')
        })
        it('should hide button text while loading', () => {
            cy.get('[data-cy="email-input"]')
                .type('user@test.com')
            cy.get('[data-cy="password-input"]')
                .type('Password123!')
            cy.get('[data-cy="login-button"]')
                .click()

            cy.get('#btn-text')
                .should('not.be.visible')
        })
        it('should disable login button during loading', () => {
            cy.get('[data-cy="email-input"]')
                .type('user@test.com')
            cy.get('[data-cy="password-input"]')
                .type('Password123!')
            cy.get('[data-cy="login-button"]')
                .click()
                
            cy.get('[data-cy="login-button"]')
                .should('be.disabled')
        })
    })
})