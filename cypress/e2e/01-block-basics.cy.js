import { slateBeforeEach, slateAfterEach } from '../support/e2e';

describe('Blocks Tests', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('Add Block: Empty', () => {
    // Change page title
    cy.clearSlateTitle();
    cy.getSlateTitle().type('My Add-on Page');

    cy.get('.documentFirstHeading').contains('My Add-on Page');

    //add image block
    cy.getSlate().click();
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Media').click();
    cy.get('.content.active.media .button.image').contains('Image').click();
    cy.get('.block.image .ui.input input[type="text"]').type(
      'https://eea.github.io/volto-eea-design-system/img/eea_icon.png{enter}',
    );

    // Save
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');
  });
});
