import { expect } from "chai";
import { buildTree } from "../../helpers";
import { Tree, ITree } from "@/store/Tree";
import { Node, INode } from "@/store/Node";
import { getNode } from "../../data/Node";
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
  beforeEach(() => {
    tree = Tree.create();
    setRootNode(tree);
  });

  //describe("getNodes", () => {});
  //describe("getChildren", () => {});

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
          expect(visibleNodes.length).to.equal(depth + 1);
        } else {
          expect(visibleNodes.length).to.equal(1);
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
        expect(isRoot).to.equal(root);
      }
    );
  });

  describe("notRoot", () => {
    //@ts-ignore
    check.it(
      "Returns the complement of isRoot",
      gen.boolean.then(getTree),
      ({ node }: { root: boolean; node: INode }) => {
        expect(treeUtils.notRoot(node)).to.equal(!treeUtils.isRoot(node));
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
        expect(nestingLevel).to.equal(depth);
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
          expect(parent.id).to.equal(tree.rootNode?.id);
        } else {
          expect(parent.id).to.equal(visibleNodes[depth - 1].id);
        }
      }
    );
  });

  // describe("isLast", () => {
  //   //@ts-ignore
  //   check.it("Returns true if node is last");

  //   //@ts-ignore
  //   check.it("Returns false if node is not last");

  //   it("Returns true if node is rootNode");
  // });
});
