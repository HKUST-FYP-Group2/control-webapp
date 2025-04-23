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
   
      // The new url should include "/dashboard"
      cy.url().should('include', '/dashboard');
   
      // The new page should contain an h1 with "Projectors"
      cy.get('h1').contains('Projectors');
    });

    it('should register an account', () => {
      // Start from the index page
      cy.visit("https://localhost:3000");

      // Find the button that goes to the register page and click it
      cy.get('a[href*="/register"]').click();

      // Find the input with id "email" and type in the new username
      const randomUsername = Math.random().toString(36).substring(2,7);
      cy.get("#email").type(randomUsername);

      // Find the input with id "streamKey" and type in the new stream key
      cy.get("#streamKey").type(`${randomUsername}_key`);

      // Find the input with id "password" and type in the new password
      cy.get("#password").type('password');

      // Find the input with id "confirmPassword" and type in the new password again
      cy.get("#confirmPassword").type('password');

      // Find the button that submits the form and click it
      cy.get('button[type*="submit"]').click();
    });

    it('should open the pair projector page', () => {
      // Start from the index page
      cy.visit('https://localhost:3000/');
   
      // Find the input with id "username" and type in the username
      cy.get('#username').type('desmond');

      // Find the input with id "password" and type in the password
      cy.get('#password').type('password');

      // Find the button that submits the form and click it
      cy.get('button[type*="submit"]').click();
   
      // The new url should include "/dashboard"
      cy.url().should('include', '/dashboard');

      // Find the button that goes to the dashboard page and click it
      cy.get('a[href*="/dashboard/pair"]').click();
    });

    it('should log in and log out', () => {
      // Start from the index page
      cy.visit('https://localhost:3000/');
   
      // Find the input with id "username" and type in the username
      cy.get('#username').type('desmond');

      // Find the input with id "password" and type in the password
      cy.get('#password').type('password');

      // Find the button that submits the form and click it
      cy.get('button[type*="submit"]').click();
   
      // The new url should include "/dashboard"
      cy.url().should('include', '/dashboard');

      // Find the button that goes to the dashboard page and click it
      cy.get('a[href*="/"]').click();
    });

    it('should be able to change projector settings', () => {
      // Start from the index page
      cy.visit('https://localhost:3000/');
   
      // Find the input with id "username" and type in the username
      cy.get('#username').type('desmond');

      // Find the input with id "password" and type in the password
      cy.get('#password').type('password');

      // Find the button that submits the form and click it
      cy.get('button[type*="submit"]').click();
   
      // The new url should include "/dashboard"
      cy.url().should('include', '/dashboard');

      // Find a projector tile and click it
      cy.get('div > h2').click();

      cy.wait(3000);

      // Find the input with id "audioInput" and type in a URL to an audio file
      cy.get('#audioInput').type('https://upload.wikimedia.org/wikipedia/en/d/d0/Rick_Astley_-_Never_Gonna_Give_You_Up.ogg');
      cy.get('button').contains('URL').click();

      cy.wait(3000);

      // Find the slider with id "volume" and press left arrow 3 times
      // cy.get('#volume').click().type('{leftArrow}'.repeat(3));
      cy.get('#volume')
        .invoke("val", 5)
        .trigger("change");

      cy.wait(3000);

      // Find the slider with id "brightness" and press left arrow 3 times
      cy.get('#brightness')
        .invoke("val", 80)
        .trigger("change");

      cy.wait(3000);

      // Find all switches and click on them
      cy.get('.react-switch-bg').each(($el, index, $list) => {
        cy.wrap($el).click();
        cy.wait(3000);
      });

      cy.wait(3000);

      // Find all color selectors and change them
      cy.get('input[type=color]').each(($el, index, $list) => {
        cy.wrap($el)
          .invoke('val', '#ff0000')
          .trigger('change');
        cy.wait(3000);
      });
    });
  });