import Vue from "vue";
import Vuetify from "vuetify";
import { mount, createLocalVue } from "@vue/test-utils";
import { resolveIdentifier } from "mobx-state-tree";
require("jasmine-check").install();

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
        hasChildren: node.nestingLevel !== depth,
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
    TreeStore.reset();
  });

  describe("Styles", () => {
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

  describe("Classes", () => {
    it("Should have children-hidden class if children are not visible", () => {
      const node = buildTree(14);
      node?.showChildren(false);
      const wrapper = mount(TreeNode, {
        propsData: {
          node,
        },
        localVue,
        vuetify,
      });
      expect(wrapper.find(".tree-node").classes()).toContain("children-hidden");
    });
    it("Should have is-selected class if node selected", () => {
      const node = buildTree(14);
      TreeStore.selectNode(node?.id as string);
      const wrapper = mount(TreeNode, {
        propsData: {
          node,
        },
        localVue,
        vuetify,
      });
      expect(wrapper.find(".tree-node").classes()).toContain("is-selected");
    });
    // Causes console warnings
    xit("Should have is-disabled class if selection prevented", () => {
      DynamicContent.dcExtensionSdk.field.schema.maxItems = 1;
      const node = buildTree(1);
      TreeStore.selectNode(node?.parent.id as string);
      const wrapper = mount(TreeNode, {
        propsData: {
          node,
        },
        localVue,
        vuetify,
      });
      expect(wrapper.find(".tree-node").classes()).toContain("is-disabled");
    });
    it("Should have is-invalid class if node is invalid", () => {
      const node = buildTree(14);
      node?.setContentTypeUri("http://wrong.net");
      const wrapper = mount(TreeNode, {
        propsData: {
          node,
        },
        localVue,
        vuetify,
      });
      expect(wrapper.find(".tree-node").classes()).toContain("is-invalid");
    });
    it("Should have is-root class if root item", () => {
      buildTree(1);
      const wrapper = mount(TreeNode, {
        propsData: {
          node: TreeStore.rootNode,
        },
        localVue,
        vuetify,
      });
      expect(wrapper.find(".tree-node").classes()).toContain("is-root");
    });
    it("Should have is-last class if item is last at specific level", () => {
      const node = buildTree(14);
      const wrapper = mount(TreeNode, {
        propsData: {
          node,
        },
        localVue,
        vuetify,
      });
      expect(wrapper.find(".tree-node").classes()).toContain("is-last");
    });
    it("Should have has-children class id node has children", () => {
      const node = buildTree(14);
      const wrapper = mount(TreeNode, {
        propsData: {
          node: node?.parent,
        },
        localVue,
        vuetify,
      });
      expect(wrapper.find(".tree-node").classes()).toContain("has-children");
    });
    it("Should have previous-disabled class if previous node is disabled", () => {
      const node = buildTree(14);
      node?.parent.setContentTypeUri("http://invalid.com");
      const wrapper = mount(TreeNode, {
        propsData: {
          node,
        },
        localVue,
        vuetify,
      });
      expect(wrapper.find(".tree-node").classes()).toContain(
        "previous-disabled"
      );
    });
  });

  describe("Selection", () => {
    it("Should select node when item clicked", async () => {
      const node = buildTree(faker.random.number(1, 14));
      const wrapper = mount(TreeNode, {
        propsData: {
          node,
        },
        localVue,
        vuetify,
      });
      await wrapper.find(".tree-node__item").trigger("click");
      expect(wrapper.find(".tree-node").classes()).toContain("is-selected");
    });
    it("Should deselect node when item clicked", async () => {
      const node = buildTree(faker.random.number(1, 14));
      const wrapper = mount(TreeNode, {
        propsData: {
          node,
        },
        localVue,
        vuetify,
      });
      await wrapper.find(".tree-node__item").trigger("click");
      await wrapper.find(".tree-node__item").trigger("click");
      expect(wrapper.find(".tree-node").classes()).not.toContain("is-selected");
    });
  });

  describe("Toggle children", () => {
    it("Should show children", async () => {
      const node = buildTree(12);
      node?.parent.showChildren(false);

      const wrapper = mount(TreeNode, {
        propsData: {
          node: node?.parent,
        },
        localVue,
        vuetify,
      });

      await wrapper.find(".tree-node__toggle-btn").trigger("click");

      expect(node?.parent.childrenVisible).toEqual(true);
    });
    it("Should hide children", async () => {
      const node = buildTree(faker.random.number(12));
      node?.parent.showChildren(true);
      const wrapper = mount(TreeNode, {
        propsData: {
          node: node?.parent,
        },
        localVue,
        vuetify,
      });
      await wrapper.find(".tree-node__toggle-btn").trigger("click");
      expect(node?.parent.childrenVisible).toEqual(false);
    });
  });

  describe("Status icons", () => {
    it("Should show disabled icon if node is invalid", () => {
      const node = buildTree(faker.random.number(12));
      node?.setStatus("ARCHIVED");
      const wrapper = mount(TreeNode, {
        propsData: {
          node,
        },
        localVue,
        vuetify,
      });
      expect(wrapper.find(".disabled-icon").exists()).toBe(true);
    });
    it("Should show status icon if not is valid", () => {
      const node = buildTree(faker.random.number(12));
      node?.setPublishingStatus("LATEST");
      const wrapper = mount(TreeNode, {
        propsData: {
          node,
        },
        localVue,
        vuetify,
      });
      expect(wrapper.find(".status-icon").exists()).toBe(true);
    });
  });
});
