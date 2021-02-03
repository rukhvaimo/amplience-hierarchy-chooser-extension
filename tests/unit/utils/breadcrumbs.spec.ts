import * as helpers from "@/utils/breadcrumbs";

//@ts-ignore
import faker from "faker";
import { range } from "ramda";
import { gen } from "testcheck";

require("jasmine-check").install();

describe("breadcrumbs.ts", () => {
  describe("getTotalDividerWidth", () => {
    //@ts-ignore
    check.it(
      "Should get the width of all breadcrumb dividers",
      gen.int,
      (numItems: number) => {
        const items = range(0, numItems);
        const length = numItems <= 1 ? 0 : items.length * 20 - 20;
        expect(helpers.getTotalDividerWidth(20, items)).toEqual(length);
      }
    );
  });
  describe("getTotalCrumbsWidth", () => {
    //@ts-ignore
    check.it(
      "Should get total width of crumbs",
      gen.int,
      (numItems: number) => {
        const items = range(0, numItems).map(() => ({
          width: faker.random.number(),
        }));
        let totalWidth = 0;
        items.forEach((x) => {
          totalWidth += x.width;
        });
        expect(helpers.getTotalCrumbsWidth(items)).toEqual(totalWidth);
      }
    );
  });
  describe("getTotalBreadcrumbsWidth", () => {
    //@ts-ignore
    check.it(
      "Should get total width of crumbs",
      gen.int,
      (numItems: number) => {
        const items = range(0, numItems).map(() => ({
          width: faker.random.number(),
        }));
        let totalWidth = 0;
        items.forEach((x) => {
          totalWidth += x.width + 20;
        });
        totalWidth -= totalWidth === 0 ? 0 : 20;
        expect(helpers.getTotalBreadcrumbsWidth(20, items)).toEqual(totalWidth);
      }
    );
  });
  describe("isLastCrumb", () => {
    it("Should equal true", () => {
      const item = { width: faker.random.number() };
      const items = range(0, 10).map(() => ({
        width: faker.random.number(),
      }));
      items.push(item);
      expect(helpers.isLastCrumb(items, item)).toEqual(true);
    });
    it("Should equal false", () => {
      const items = range(0, 10).map(() => ({
        width: faker.random.number(),
      }));
      const item = items[5];
      expect(helpers.isLastCrumb(items, item)).toEqual(false);
    });
  });
  describe("isFirstCrumb", () => {
    it("Should equal true", () => {
      const items = range(0, 10).map(() => ({
        width: faker.random.number(),
      }));
      const item = items[0];
      expect(helpers.isFirstCrumb(items, item)).toEqual(true);
    });
    it("Should equal false", () => {
      const items = range(0, 10).map(() => ({
        width: faker.random.number(),
      }));
      const item = items[5];
      expect(helpers.isFirstCrumb(items, item)).toEqual(false);
    });
  });
  describe("shouldCollapse", () => {
    it("Should collapse crumb when collapse true and not first or last item", () => {
      const items = range(0, 10).map(() => ({
        width: faker.random.number(),
        collapse: false,
      }));
      items[1].collapse = true;
      expect(helpers.shouldCollapse(items, items[1])).toEqual(true);
    });
    it("Should not collapse crumb when collapse false", () => {
      const items = range(0, 10).map(() => ({
        width: faker.random.number(),
        collapse: false,
      }));
      expect(helpers.shouldCollapse(items, items[1])).toEqual(false);
    });
    it("Should not collapse crumb when first item", () => {
      const items = range(0, 10).map(() => ({
        width: faker.random.number(),
        collapse: false,
      }));
      items[0].collapse = true;
      expect(helpers.shouldCollapse(items, items[0])).toEqual(false);
    });
    it("Should not collapse crumb when last item", () => {
      const items = range(0, 10).map(() => ({
        width: faker.random.number(),
        collapse: false,
      }));
      items[9].collapse = true;
      expect(helpers.shouldCollapse(items, items[9])).toEqual(false);
    });
  });
  xdescribe("getTailCrumbsWidth", () => {});
  xdescribe("breadcrumbValidator", () => {});
  xdescribe("handleHide", () => {});
  xdescribe("hideCrumbs", () => {});
  xdescribe("measure", () => {});
  xdescribe("handleCrumb", () => {});
  xdescribe("handleCrumb", () => {});
});
