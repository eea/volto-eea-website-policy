import { slateBeforeEach, slateAfterEach } from '../support/e2e';

describe('Blocks Tests', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('Add Navigation Block', () => {
    // Change page title
    cy.clearSlateTitle();
    cy.getSlateTitle().type('My Add-on Page');

    cy.get('.documentFirstHeading').contains('My Add-on Page');

    cy.getSlate().click();

    // Add Navigation block
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .contextNavigation').click();
    cy.get('#field-name').type('Nav title');
    cy.get(
      '.field-wrapper-includeTop > .grid > :nth-child(1) > .twelve > .wrapper > .ui > label',
    ).click();
    // cy.get(
    //   '.field-wrapper-currentFolderOnly > .grid > :nth-child(1) > .twelve > .wrapper > .ui > label',
    // ).click();
    cy.get(
      '.field-wrapper-no_icons > .grid > :nth-child(1) > .twelve > .wrapper > .ui > label',
    ).click();
    cy.get(
      '.field-wrapper-no_thumbs > .grid > :nth-child(1) > .twelve > .wrapper > .ui > label',
    ).click();

    // Save
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    // // then the page view should contain our changes
    cy.get('.context-navigation-header').contains('Nav title');

    // Edit to select Accordion variation
    cy.get('.toolbar-actions .edit').click();
    cy.get('.block-editor-contextNavigation').click();
    cy.get(
      '#sidebar-properties .field-wrapper-variation .react-select__value-container',
    ).click();
    cy.get('.field-wrapper-variation .react-select__option')
      .contains('Accordion')
      .click();

    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    // then the page view should contain our changes
    cy.get('.accordion-header').contains('Nav title');
    cy.get('.accordion-header').click();
  });
});
