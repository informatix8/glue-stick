describe('index3.html', function() {
    it('Scroll 60', function () {
        cy.viewport(1024, 750);
        cy.visit('/index3.html');

        cy.scrollTo(0, 60);
        cy.wait(50);

        cy.get('header').should(($element) => {
            const bbox = $element[0].getBoundingClientRect();
            expect(bbox.top, 'top').to.equal(-60);
            expect(bbox.bottom, 'bottom').to.equal(17);
        });
    });
});

describe('index3.html', function() {
    it('Scroll 300', function() {
        cy.viewport(1024, 750);
        cy.visit('/index3.html');

        cy.scrollTo(0, 300);
        cy.wait(50);

        cy.get('aside').should(($element) => {
            const bbox = $element[0].getBoundingClientRect();
            expect(bbox.top, 'top').to.equal(0);
            expect(bbox.bottom, 'bottom').to.equal(750);
        });

        cy.get('article').should(($element) => {
            const bbox = $element[0].getBoundingClientRect();
            expect(bbox.top, 'top').to.equal(-146);
            expect(bbox.bottom, 'bottom').to.be.within(2900, 3000);
        });
    });
});

describe('index3.html', function() {
    it('Scroll bottom', function() {
        cy.viewport(1024, 750);
        cy.visit('/index3.html');

        cy.scrollTo('bottom');
        cy.wait(50);

        cy.get('aside').should(($element) => {
            const bbox = $element[0].getBoundingClientRect();
            expect(bbox.top, 'top').to.equal(0);
            expect(bbox.bottom, 'bottom').to.equal(673);
        });

        cy.get('article').should(($element) => {
            const bbox = $element[0].getBoundingClientRect();
            expect(bbox.top, 'top').to.be.lessThan(-2300);
            expect(bbox.bottom, 'bottom').to.equal(673);
        });
    });
});
