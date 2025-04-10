describe('Login', () => {
    it('should log in to the dashboard page', () => {
      // Start from the index page
      cy.visit('https://localhost:3000/');
   
      // Find the input with id "username" and type in the username
      cy.get('#username').type('desmond');

      // Find the input with id "password" and type in the password
      cy.get('#password').type('password');

      // Find the button that submits the form and click it
      cy.get('button[type*="submit"]').click();
   
      // The new url should include "/about"
      cy.url().should('include', '/dashboard');
   
      // The new page should contain an h1 with "About"
      cy.get('h1').contains('Projectors');
    });
  });