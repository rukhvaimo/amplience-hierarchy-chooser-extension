describe("smoke screen", () => {
  it("Visits the app root url", () => {
    cy.visit("/");
    cy.get(".v-sheet").should("exist");
  });
});
