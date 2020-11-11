describe("smoke screen", () => {
  it("Visits the app root url", () => {
    cy.visit("/");
    cy.get(".v-card").should("exist");
  });
});
