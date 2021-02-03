import DynamicContent from "@/store/DynamicContent";
import { CardModel } from "@/store/CardModel";
import { getContentItem } from "../../data/ContentItem";
import flushPromises from "flush-promises";
import { getContent } from "../..//data/Content";

describe("DynamicContent.ts", () => {
  beforeEach(async (done) => {
    await DynamicContent.initialize();
    done();
  });

  describe("getValue", () => {
    it("Should get field value", async () => {
      const value = await DynamicContent.getValue();
      expect(value[0].contentItem).toEqual({ _empty: true });
    });
    it("Should return model if getting value fails", async () => {
      spyOn(DynamicContent.dcExtensionSdk.field, "getValue").and.returnValue(
        Promise.reject("Error")
      );
      spyOn(console, "info");
      await DynamicContent.getValue();
      expect(console.info).toHaveBeenCalledWith("Unable to get field value");
    });
  });

  describe("updateList", () => {
    it("Should update the list of models", async () => {
      spyOn(DynamicContent.dcExtensionSdk.field, "setValue");
      const content = getContent();
      const card = new CardModel(content, 0);
      await DynamicContent.updateList([card]);
      expect(
        DynamicContent.dcExtensionSdk.field.setValue
      ).toHaveBeenCalledWith([content]);
    });
  });

  describe("getNode", () => {
    it("Should get a node", async () => {
      spyOn(DynamicContent.dcManagementSdk.contentItems, "get").and.returnValue(
        Promise.resolve(
          getContentItem({
            hierarchy: { root: true },
          })
        )
      );
      const node = await DynamicContent.getNode();
      expect(node).toHaveProperty("hierarchy.root", true);
    });
    it("Should set CANNOT_BE_FOUND error", async () => {
      spyOn(DynamicContent, "getNodeId").and.returnValue(null);
      await DynamicContent.getNode();
      expect(DynamicContent.error).toHaveProperty("type", "CANNOT_BE_FOUND");
    });
    it("Should set CANNOT_BE_FOUND error", async () => {
      spyOn(DynamicContent.dcManagementSdk.contentItems, "get").and.returnValue(
        Promise.reject("not found")
      );
      await DynamicContent.getNode();
      expect(DynamicContent.error).toHaveProperty("type", "CANNOT_BE_FOUND");
    });
    it("Should set ARCHIVED error", async () => {
      spyOn(DynamicContent.dcManagementSdk.contentItems, "get").and.returnValue(
        Promise.resolve(
          getContentItem({
            status: "ARCHIVED",
            hierarchy: { root: true },
          })
        )
      );
      await DynamicContent.getNode();
      expect(DynamicContent.error).toHaveProperty("type", "ARCHIVED");
    });
    it("Should set NOT_HIERARCHY error", async () => {
      spyOn(DynamicContent.dcManagementSdk.contentItems, "get").and.returnValue(
        Promise.resolve(
          getContentItem({
            hierarchy: undefined,
          })
        )
      );
      await DynamicContent.getNode();
      expect(DynamicContent.error).toHaveProperty("type", "NOT_HIERARCHY");
    });
    it("Should set NOT_ROOT error", async () => {
      spyOn(DynamicContent.dcManagementSdk.contentItems, "get").and.returnValue(
        Promise.resolve(getContentItem())
      );
      await DynamicContent.getNode();
      expect(DynamicContent.error).toHaveProperty("type", "NOT_ROOT");
    });
  });

  describe("removeItem", () => {
    it("Should remove item from list", async () => {
      spyOn(DynamicContent.dcExtensionSdk.field, "setValue");
      await DynamicContent.updateList([
        new CardModel(getContent(), 0),
        new CardModel({ _empty: true }, 1),
        new CardModel(getContent(), 2),
        new CardModel({ _empty: true }, 3),
      ]);
      await DynamicContent.removeItem(2);
      expect(DynamicContent.model.length).toBe(2);
    });
  });

  describe("setError", () => {
    it("Should set correct error message", () => {
      //@ts-ignore
      DynamicContent.setError(Error("NOT_ROOT"));
      expect(DynamicContent.error).toHaveProperty("type", "NOT_ROOT");
    });
    it("Should set default error message", () => {
      //@ts-ignore
      DynamicContent.setError(Error("RANDOM_ERROR"));
      expect(DynamicContent.error).toHaveProperty("type", "CANNOT_BE_FOUND");
    });
  });

  describe("createModel", () => {
    it("Should create a model", async () => {
      const content = getContent();
      const model = await DynamicContent.createModel([content]);
      expect(model[0]).toHaveProperty("contentItem", content);
    });
  });

  describe("exportModel", () => {
    it("Should export model", () => {
      const content = getContent();
      const model = new CardModel(content, 0);
      const exportedModel = DynamicContent.exportModel([model]);
      expect(exportedModel[0]).toHaveProperty("id", content.id);
    });
  });

  describe("clean", () => {
    it("Should remove empty value for end of array", () => {
      const model = DynamicContent.clean([getContent(), { _empty: true }]);
      expect(model.length).toEqual(1);
    });
  });

  describe("getNodeId", () => {
    it("Should get node ID", () => {
      const id = DynamicContent.getNodeId();
      expect(id).toEqual(DynamicContent.dcExtensionSdk.params.instance.nodeId);
    });
  });

  describe("getItemRef", () => {
    it("Should get item ref", () => {
      const ref = DynamicContent.getItemRef();
      expect(ref).toEqual(
        DynamicContent.dcExtensionSdk.field.schema.items.allOf[0].$ref
      );
    });
  });

  describe("hasHitLimit", () => {
    it("Should return true if limit has been reached", () => {
      const reachedLimit = DynamicContent.hasHitLimit([
        new CardModel(getContent(), 0),
        new CardModel(getContent(), 1),
        new CardModel(getContent(), 2),
        new CardModel(getContent(), 3),
        new CardModel(getContent(), 4),
      ]);
      expect(reachedLimit).toBe(true);
    });
    it("Should return false if limit has not been reached", () => {
      const reachedLimit = DynamicContent.hasHitLimit([
        new CardModel(getContent(), 0),
        new CardModel(getContent(), 1),
        new CardModel(getContent(), 2),
        new CardModel(getContent(), 3),
      ]);
      expect(reachedLimit).toBe(false);
    });
  });

  describe("autoSizeComponent", () => {
    it("Should start autosizer", () => {
      spyOn(DynamicContent.dcExtensionSdk.frame, "startAutoResizer");
      DynamicContent.autoSizeComponent(true);
      expect(
        DynamicContent.dcExtensionSdk.frame.startAutoResizer
      ).toHaveBeenCalled();
    });
    it("Should stop autosizer", () => {
      spyOn(DynamicContent.dcExtensionSdk.frame, "stopAutoResizer");
      DynamicContent.autoSizeComponent(false);
      expect(
        DynamicContent.dcExtensionSdk.frame.stopAutoResizer
      ).toHaveBeenCalled();
    });
  });
});
