describe('index2.html', function() {
    it('Scroll 60', function () {
        cy.viewport(1024, 750);
        cy.visit('/index2.html');

        cy.scrollTo(0, 60);
        cy.wait(50);

        cy.get('header').should(($element) => {
            const bbox = $element[0].getBoundingClientRect();
            expect(bbox.top, 'top').to.equal(0);
            expect(bbox.bottom, 'bottom').to.equal(77);
        });
    });
});

describe('index2.html', function() {
    it('Scroll 55', function() {
        cy.viewport(1024, 750);
        cy.visit('/index2.html');

        cy.scrollTo(0, 55);
        cy.wait(50);

        cy.get('.title-bar').should(($element) => {
            const bbox = $element[0].getBoundingClientRect();
            expect(bbox.top, 'top').to.equal(99);
            expect(bbox.bottom, 'bottom').to.equal(298.75);
        });

        cy.get('nav').should(($element) => {
            const bbox = $element[0].getBoundingClientRect();
            expect(bbox.top, 'top').to.equal(22);
            expect(bbox.bottom, 'bottom').to.equal(99);
        });

        cy.get('aside').should(($element) => {
            const bbox = $element[0].getBoundingClientRect();
            expect(bbox.top, 'top').to.equal(298.75);
            expect(bbox.bottom, 'bottom').to.be.at.least(3300);
        });

        cy.get('article').should(($element) => {
            const bbox = $element[0].getBoundingClientRect();
            expect(bbox.top, 'top').to.equal(298.75);
            expect(bbox.bottom, 'bottom').to.be.at.least(3000);
        });
    });
});

describe('index2.html', function() {
    it('Scroll 200', function() {
        cy.viewport(1024, 750);
        cy.visit('/index2.html');

        cy.scrollTo(0, 200);
        cy.wait(50);

        cy.get('.title-bar').should(($element) => {
            const bbox = $element[0].getBoundingClientRect();
            expect(bbox.top, 'top').to.equal(77);
            expect(bbox.bottom, 'bottom').to.equal(276.75);
        });

        cy.get('nav').should(($element) => {
            const bbox = $element[0].getBoundingClientRect();
            expect(bbox.top, 'top').to.equal(-123);
            expect(bbox.bottom, 'bottom').to.equal(-46);
        });

        cy.get('aside').should(($element) => {
            const bbox = $element[0].getBoundingClientRect();
            expect(bbox.top, 'top').to.equal(276.75);
            expect(bbox.bottom, 'bottom').to.equal(750);
        });

        cy.get('article').should(($element) => {
            const bbox = $element[0].getBoundingClientRect();
            expect(bbox.top, 'top').to.equal(154);
            expect(bbox.bottom, 'bottom').to.be.at.least(3000);
        });
    });
});

describe('index2.html', function() {
    it('Scroll bottom', function() {
        cy.viewport(1024, 750);
        cy.visit('/index2.html');

        cy.scrollTo('bottom');
        cy.wait(50);

        cy.get('.title-bar').should(($element) => {
            const bbox = $element[0].getBoundingClientRect();
            expect(bbox.top, 'top').to.equal(77);
            expect(bbox.bottom, 'bottom').to.equal(276.75);
        });

        cy.get('nav').should(($element) => {
            const bbox = $element[0].getBoundingClientRect();
            expect(bbox.top, 'top').to.be.lessThan(-2600);
            expect(bbox.bottom, 'bottom').to.be.lessThan(-2500);
        });

        cy.get('aside').should(($element) => {
            const bbox = $element[0].getBoundingClientRect();
            expect(bbox.top, 'top').to.equal(276.75);
            expect(bbox.bottom, 'bottom').to.equal(674);
        });

        cy.get('article').should(($element) => {
            const bbox = $element[0].getBoundingClientRect();
            expect(bbox.top, 'top').to.be.lessThan(-2300);
            expect(bbox.bottom, 'bottom').to.equal(674);
        });
    });
});
