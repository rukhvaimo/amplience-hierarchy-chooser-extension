import rewiremock from "../../../rewiremock";
import DcExtensionsSdk from "../../../mocks/DcExtensionsSdk";
import { expect } from "chai";
import { mount } from "@vue/test-utils";
import { resolveIdentifier } from "mobx-state-tree";
require("mocha-testcheck").install();

import { until } from "ramda";
// import TreeNode from "@/components/TreeView/TreeNode.vue";
// import DynamicContent from "@/store/DynamicContent";
import { Tree } from "@/store/Tree";
import { Node, INode } from "@/store/Node";
import { getNode } from "../../../data/Node";

//@ts-ignore
import faker from "faker";

const tree = Tree.create();

const TreeNode = rewiremock.proxy(
  () => require("@/components/TreeView/TreeNode.vue"),
  (r) => ({
    [`${__dirname}../../../../src/store/DynamicContent`]: r.with({
      allowedTypes: ["http://test.com"],
    }),
    [`${__dirname}../../../../src/store/Tree`]: r.with(tree),
  })
).default;

before(() => rewiremock.enable());
afterEach(() => rewiremock.disable());

function buildTree(depth: number) {
  tree.setRootNode(
    getNode({
      root: true,
      hasChildren: true,
      contentTypeUri: "http://test.com",
    })
  );
  const node = until(
    (node: INode) => node.nestingLevel === depth,
    (node: INode) => {
      const newNode = getNode({
        root: false,
        hasChildren: true,
        contentTypeUri: "http://test.com",
      });
      node.setChildren([newNode]);
      //@ts-ignore
      return resolveIdentifier(Node, tree.rootNode, newNode.id);
    }
    //@ts-ignore
  )(tree.rootNode);
  return { tree, node };
}

describe("TreeNode.vue", () => {
  //@ts-ignore
  check.it(
    "Should have the correct left padding",
    //@ts-ignore
    gen.intWithin(1, 14),
    (nestingLevel: number) => {
      const { node } = buildTree(nestingLevel);
      const wrapper = mount(TreeNode, {
        propsData: {
          node,
        },
      });
      const expectedPadding =
        //@ts-ignore
        nestingLevel * wrapper.vm.paddingAmount + "px";

      expect(wrapper.find(".tree-node").element.style.paddingLeft).to.equal(
        expectedPadding
      );
    }
  );
});
