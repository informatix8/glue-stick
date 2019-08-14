describe('index.html', function() {
    it('Scroll 60', function () {
        cy.viewport(1024, 750);
        cy.visit('/index.html');

        cy.scrollTo(0, 60);
        cy.wait(50);

        cy.get('header').should(($element) => {
            const bbox = $element[0].getBoundingClientRect();
            expect(bbox.top, 'top').to.equal(0);
            expect(bbox.bottom, 'bottom').to.equal(77);
        });
    });
});

describe('index.html', function() {
    it('Scroll 100', function() {
        cy.viewport(1024, 750);
        cy.visit('/index.html');

        cy.scrollTo(0, 100);
        cy.wait(50);

        cy.get('aside').should(($element) => {
            const bbox = $element[0].getBoundingClientRect();
            expect(bbox.top, 'top').to.equal(77);
            expect(bbox.bottom, 'bottom').to.equal(750);
        });

        cy.get('article').should(($element) => {
            const bbox = $element[0].getBoundingClientRect();
            expect(bbox.top, 'top').to.equal(54);
            expect(bbox.bottom, 'bottom').to.be.at.least(3000);
        });
    });
});

describe('index.html', function() {
    it('Scroll bottom', function() {
        cy.viewport(1024, 750);
        cy.visit('/index.html');

        cy.scrollTo('bottom');
        cy.wait(50);

        cy.get('aside').should(($element) => {
            const bbox = $element[0].getBoundingClientRect();
            expect(bbox.top, 'top').to.equal(77);
            expect(bbox.bottom, 'bottom').to.equal(673);
        });

        cy.get('article').should(($element) => {
            const bbox = $element[0].getBoundingClientRect();
            expect(bbox.top, 'top').to.be.lessThan(-2000);
            expect(bbox.bottom, 'bottom').to.equal(673);
        });
    });
});
