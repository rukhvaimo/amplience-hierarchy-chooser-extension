import DynamicContent from "@/store/DynamicContent";

import { CardModel } from "@/store/CardModel";
import { getContent } from "../../data/Content";

describe("CardModel.ts", () => {
  beforeEach(async (done) => {
    await DynamicContent.initialize();
    done();
  });

  describe("createEmptyItem", () => {
    it("Should return an empty item", () => {
      const emptyItem = CardModel.createEmptyItem();
      expect(emptyItem).toEqual({ _empty: true });
    });
  });
  describe("isEmpty", () => {
    it("Should return true if model is empty", () => {
      const card = new CardModel(undefined, 0);
      expect(card.isEmpty()).toBe(true);
    });
    it("Should return false if model is not empty", () => {
      const card = new CardModel(getContent(), 0);
      expect(card.isEmpty()).toBe(false);
    });
  });
  describe("toJSON", () => {
    it("Should convert schema to JSON", async () => {
      const content = getContent();
      const card = new CardModel(content, 0);
      expect(card.toJSON()).toEqual({
        _meta: {
          schema:
            "http://bigcontent.io/cms/schema/v1/core#/definitions/content-link",
        },
        contentType: content.contentType,
        id: content.id,
      });
    });
  });
});
