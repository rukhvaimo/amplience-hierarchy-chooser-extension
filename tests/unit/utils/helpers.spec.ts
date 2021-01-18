import * as helpers from "@/utils/helpers";

describe("helpers.ts", () => {
  describe("tryCatch", () => {
    it("Should call try function with body", async () => {
      const tryFunc = { func: () => Promise.resolve() };
      spyOn(tryFunc, "func");
      await helpers.tryCatch(tryFunc.func, () => {}, "test");
      expect(tryFunc.func).toHaveBeenCalledWith("test");
    });
    it("Should call error function", async () => {
      const errFunc = { func: () => {} };
      spyOn(errFunc, "func");

      await helpers.tryCatch(
        () => Promise.reject("Error"),
        errFunc.func,
        "test"
      );
      expect(errFunc.func).toHaveBeenCalledWith("Error");
    });
  });

  describe("isError", () => {
    it("Should return true if arg is error", () => {
      expect(helpers.isError(Error())).toBe(true);
    });
    it("Should return false if arg is not error", () => {
      expect(helpers.isError("nope")).toBe(false);
    });
  });
  describe("whenError", () => {
    it("Should call function when there is an error", () => {
      const func = { func() {} };
      spyOn(func, "func");
      helpers.whenError(func.func)(Error());
      expect(func.func).toHaveBeenCalled();
    });
  });
  describe("notError", () => {
    it("Should return fasle if arg is error", () => {
      expect(helpers.notError(Error())).toBe(false);
    });
    it("Should return true if arg is not error", () => {
      expect(helpers.notError("nope")).toBe(true);
    });
  });
  describe("toPx", () => {
    it("Should convert value to px", () => {
      expect(helpers.toPx(123)).toEqual("123px");
    });
  });
  describe("notEmpty", () => {
    it("Should return true if value is not empty", () => {
      expect(helpers.notEmpty([1])).toEqual(true);
    });
  });
  describe("detokenize", () => {
    it("Should replace variables in a tokenised string", () => {
      const template = "This is a {{var1}} of {{var2}} {{var3}}";
      const variables = { var1: "type", var2: "templated", var3: "string" };
      expect(helpers.detokenize(template, variables)).toEqual(
        "This is a type of templated string"
      );
    });
    it("Should work with different token prefixes", () => {
      const template = "This is a <%var1%> of <%var2%> <%var3%>";
      const variables = { var1: "type", var2: "templated", var3: "string" };
      expect(helpers.detokenize(template, variables, "<%", "%>")).toEqual(
        "This is a type of templated string"
      );
    });
    it("Should not replace the variable if it doesn't exist", () => {
      const template = "I {{exist}}, I {{dont_exist}}";
      const variables = { exist: "EXIST" };
      expect(helpers.detokenize(template, variables)).toEqual(
        "I EXIST, I {{dont_exist}}"
      );
    });
  });
});
