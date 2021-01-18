import { buildTree } from "../../helpers";
import { Tree, ITree } from "@/store/Tree";
import { Node, INode } from "@/store/Node";
import { getNode } from "../../data/Node";
import DynamicContent from "@/store/DynamicContent";
import { gen } from "testcheck";
//@ts-ignore
import Faker from "faker";

import * as treeUtils from "@/utils/tree";

require("jasmine-check").install();

let tree: ITree;

function setRootNode(tree: any) {
  tree.setRootNode(
    getNode({
      root: true,
      hasChildren: true,
      contentTypeUri: "http://test.com",
    })
  );
}

function getTree(root: boolean) {
  const { node } = buildTree(tree, Faker.random.number({ min: 1, max: 14 }));
  return { root, node: root ? tree.rootNode : node };
}

describe("tree.ts", () => {
  beforeEach(async (done) => {
    tree = Tree.create();
    setRootNode(tree);
    await DynamicContent.initialize();
    done();
  });

  describe("getNodes", () => {
    it("Should get nodes", async () => {
      const nodes = await treeUtils.getNodes(Faker.random.uuid());
      expect(nodes).toHaveProperty("root", true);
    });
  });

  describe("getChildren", () => {
    it("Should get children", async () => {
      const children = await treeUtils.getChildren(Faker.random.uuid());
      expect(children.length).toBeGreaterThan(0);
    });
  });

  describe("getVisibleNodes", () => {
    //@ts-ignore
    check.it(
      "Should get all visible nodes below a given node",
      gen.intWithin(1, 14).then((depth) => {
        const showChildren = Faker.random.boolean();
        buildTree(tree, depth, showChildren);
        return { tree, depth, showChildren };
      }),
      ({
        tree,
        depth,
        showChildren,
      }: {
        tree: ITree;
        depth: number;
        showChildren: boolean;
      }) => {
        const visibleNodes = treeUtils.getVisibleNodes(tree.rootNode);
        if (showChildren) {
          // depth +1 because we need to include the root node
          expect(visibleNodes.length).toEqual(depth + 1);
        } else {
          expect(visibleNodes.length).toEqual(1);
        }
      }
    );
  });

  describe("isRoot", () => {
    //@ts-ignore
    check.it(
      "Should return true if node is root, false otherwise",
      gen.boolean.then(getTree),
      ({ root, node }: { root: boolean; node: INode }) => {
        const isRoot = treeUtils.isRoot(node);
        expect(isRoot).toEqual(root);
      }
    );
  });

  describe("notRoot", () => {
    //@ts-ignore
    check.it(
      "Returns the complement of isRoot",
      gen.boolean.then(getTree),
      ({ node }: { root: boolean; node: INode }) => {
        expect(treeUtils.notRoot(node)).toEqual(!treeUtils.isRoot(node));
      }
    );
  });

  describe("getNestingLevel", () => {
    //@ts-ignore
    check.it(
      "Returns the nesting level for a given node",
      gen.intWithin(1, 14).then((depth) => {
        const { node } = buildTree(tree, depth);
        return { depth, node };
      }),
      ({ depth, node }: { depth: number; node: INode }) => {
        const nestingLevel = treeUtils.getNestingLevel(node);
        expect(nestingLevel).toEqual(depth);
      }
    );
  });

  describe("getNodeParent", () => {
    //@ts-ignore
    check.it(
      "Gets the parent of a given node",
      gen.intWithin(0, 14).then((depth) => {
        const { node } = buildTree(tree, depth, true);
        return { depth, node };
      }),
      ({ depth, node }: { depth: number; node: INode }) => {
        const visibleNodes = treeUtils.getVisibleNodes(tree.rootNode);
        const parent = treeUtils.getNodeParent(node);
        if (depth === 0) {
          expect(parent.id).toEqual(tree.rootNode?.id);
        } else {
          expect(parent.id).toEqual(visibleNodes[depth - 1].id);
        }
      }
    );
  });

  describe("isLast", () => {
    it("Returns true if node is last", () => {
      const { node } = buildTree(tree, 14, true);
      const isLast = treeUtils.isLast(node);
      expect(isLast).toBe(true);
    });

    it("Returns false if node is not last", () => {
      buildTree(tree, 14, true);
      tree.rootNode?.setChildren([getNode(), getNode()]);
      //@ts-ignore
      const isLast = treeUtils.isLast(tree.rootNode.children[0]);
      expect(isLast).toBe(false);
    });

    it("Returns true if node is rootNode", () => {
      const isLast = treeUtils.isLast(tree.rootNode);
      expect(isLast).toBe(true);
    });
  });

  describe("hasChildren", () => {
    it("Should return true if node has children", () => {
      buildTree(tree, 14, true);
      tree.rootNode?.setChildren([getNode(), getNode()]);
      //@ts-ignore
      expect(treeUtils.hasChildren(tree.rootNode)).toEqual(true);
    });
    it("Should return false if node does not have children", () => {
      buildTree(tree, 14, true);
      tree.rootNode?.setChildren([]);
      //@ts-ignore
      expect(treeUtils.hasChildren(tree.rootNode)).toEqual(false);
    });
  });

  describe("getPadding", () => {
    //@ts-ignore
    check.it("Calculates padding", gen.int, (amount: number) => {
      const padding = treeUtils.getPadding(20, amount);
      expect(padding).toBe(20 * amount + "px");
    });
  });

  describe("getNodePath", () => {
    it("Should get path to node", () => {
      const { node } = buildTree(tree, 14, true);
      const path = treeUtils.getNodePath(node);
      expect(path.length).toBe(15);
    });
  });

  describe("getPreviousNode", () => {
    it("Should get the previous visible node", () => {
      const { node } = buildTree(tree, 14, true);
      const path = treeUtils.getNodePath(node);
      //@ts-ignore
      const prevNode = treeUtils.previousNode(tree.rootNode, node);
      expect(prevNode).toBe(path[13]);
    });
  });

  describe("isValidType", () => {
    it("Should return true if given a valid type", () => {
      const type = Faker.internet.url();
      const valid = treeUtils.isValidType([type, Faker.internet.url()], type);

      expect(valid).toBe(true);
    });
    it("Should return false if given an invalid type", () => {
      const type = Faker.internet.url();
      const valid = treeUtils.isValidType(
        [Faker.internet.url(), Faker.internet.url()],
        type
      );

      expect(valid).toBe(false);
    });
  });

  describe("isInvalidType", () => {
    it("Should return false if given a valid type", () => {
      const type = Faker.internet.url();
      const valid = treeUtils.isInvalidType([type, Faker.internet.url()], type);

      expect(valid).toBe(false);
    });
    it("Should return true if given an invalid type", () => {
      const type = Faker.internet.url();
      const valid = treeUtils.isInvalidType(
        [Faker.internet.url(), Faker.internet.url()],
        type
      );

      expect(valid).toBe(true);
    });
  });
});
