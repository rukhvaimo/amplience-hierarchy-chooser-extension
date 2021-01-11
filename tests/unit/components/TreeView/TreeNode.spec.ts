// import { expect } from "chai";
import Vue from "vue";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";
import { resolveIdentifier } from "mobx-state-tree";
require("mocha-testcheck").install();

import { until } from "ramda";
import TreeNode from "@/components/TreeView/TreeNode.vue";
import DynamicContent from "@/store/DynamicContent";
import TreeStore from "@/store/Tree";
import { Node, INode } from "@/store/Node";
import { getNode } from "../../../data/Node";

//@ts-ignore
import faker from "faker";

function buildTree(depth: number) {
  TreeStore.setRootNode(
    getNode({
      root: true,
      hasChildren: true,
      childrenVisible: true,
      contentTypeUri: "http://test.com",
    })
  );
  const node = until(
    (node: INode) => node.nestingLevel === depth,
    (node: INode) => {
      const newNode = getNode({
        root: false,
        hasChildren: true,
        childrenVisible: node.nestingLevel !== depth,
        contentTypeUri: "http://test.com",
      });
      node.setChildren([newNode]);
      //@ts-ignore
      return resolveIdentifier(Node, TreeStore.rootNode, newNode.id);
    }
    //@ts-ignore
  )(TreeStore.rootNode);
  return node;
}

Vue.use(Vuetify);
const localVue = createLocalVue();

describe("TreeNode.vue", () => {
  let vuetify: any;

  beforeEach(async (done) => {
    await DynamicContent.initialize();
    vuetify = new Vuetify();
    done();
  });
  afterEach(() => {
    TreeStore.setRootNode(null);
  });
  //@ts-ignore
  check.it(
    "Should have the correct left padding",
    //@ts-ignore
    gen.intWithin(1, 14),
    (nestingLevel: number) => {
      const node = buildTree(nestingLevel);
      const wrapper = mount(TreeNode, {
        propsData: {
          node,
        },
        localVue,
        vuetify,
      });
      const expectedPadding =
        //@ts-ignore
        nestingLevel * wrapper.vm.paddingAmount + "px";
      expect(wrapper.find(".tree-node").element.style.paddingLeft).toEqual(
        expectedPadding
      );
    }
  );
});
