import { DELAY_IN_MS } from '#shared/constants';
import { colorSwitchToRGB } from '#shared/lib';
import { ElementState } from '#shared/types';

interface State {
  color: ElementState[];
  letter: string[];
}

const state: State[] = [
  {
    color: ['default', 'default', 'default', 'default', 'default'],
    letter: ['h', 'e', 'l', 'l', 'o'],
  },
  {
    color: ['changing', 'default', 'default', 'default', 'changing'],
    letter: ['h', 'e', 'l', 'l', 'o'],
  },
  {
    color: ['modified', 'changing', 'default', 'changing', 'modified'],
    letter: ['o', 'e', 'l', 'l', 'h'],
  },
  {
    color: ['modified', 'modified', 'changing', 'modified', 'modified'],
    letter: ['o', 'l', 'l', 'e', 'h'],
  },
  {
    color: ['modified', 'modified', 'modified', 'modified', 'modified'],
    letter: ['o', 'l', 'l', 'e', 'h'],
  },
];

describe('Reverse String page', () => {
  beforeEach(() => {
    cy.visit('/#/recursion');
    cy.getBySel('reverse-btn').as('reverseBtn');
    cy.getBySel('input').should('be.empty').as('input');
  });

  afterEach(() => {
    cy.get('@input').clear();
    cy.get('@input').should('be.empty');
  });

  it('button disabled with empty input', () => {
    cy.get('@reverseBtn').should('be.disabled');
  });

  it('button enabled with not empty input', () => {
    cy.get('@input').type('hello');
    cy.get('@input').should('have.value', 'hello');
    cy.get('@reverseBtn').should('to.be.not.disabled');
  });

  it('animation correct', () => {
    const text = 'hello';

    cy.get('@input').type(text);
    cy.get('@reverseBtn').click();
    cy.getBySel('loader').as('loader');
    cy.get('@loader').should('exist');

    cy.getBySelLike('circle-').should('have.length', text.length).as('circles');
    cy.getBySelLike('circleText').as('circleTexts');
    cy.getBySelLike('circleShape').as('circleShape');

    state.forEach((state) => {
      cy.get('@circleTexts').each((el, elIndex) => {
        expect(el).to.contain(state.letter[elIndex]);
      });

      cy.get('@circleShape').each((el, elIndex) => {
        expect(el).to.have.css('border', `4px solid ${colorSwitchToRGB(state.color[elIndex])}`);
      });

      cy.wait(DELAY_IN_MS);
    });
  });
});