describe('Contact Tracing', ()=>{
    beforeEach(() => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.window().then((win) => {
            win.sessionStorage.clear()
        });
        cy.visit('/account')
        cy.get('#LoginSwitch').click()
        cy.get('#enterEmail').type('joblo_@test.com')
        cy.get('#enterPassword').type('test')
        cy.get('#SubmitSign').click()
    })
    it("Add Staff", () =>{
        cy.wait(1000)
        cy.findByText('Add New Staff Member').click()
        cy.findByText('Staff Information')
        cy.get('#staffName').type('Ezra Hall')
        cy.get('#staffEmail').type('ezramackhall@gmail.com')
        cy.findByText('Create').click()
        cy.findByText('Ezra Hall')
        cy.findByText('ezramackhall@gmail.com')
        cy.get('#Actions').click()
        cy.findByText('Delete').click()
        cy.findByText('Continue').click()
    })
    it('Report Covid', () => {
        cy.intercept('POST', '/Api/Tracing/Report', (req) => {
            req.body.date = 'Sun Apr 04 2121 14:55:13 GMT-0500 (Central Daylight Time)'
            req.body.cookies.restaurant = '99'
        }).as('covidReport')
        cy.findByText('Reports').click()
        cy.findByText('Submit Report').click()
        cy.findByText('Confirm').click()
        cy.wait('@covidReport')
        cy.get('@covidReport').then(xhr => {
            expect(xhr.response.statusCode).to.equal(200)
        })
        cy.findByText('Report Has Been Confirmed')
        cy.findByText('OK').click()
    })
})