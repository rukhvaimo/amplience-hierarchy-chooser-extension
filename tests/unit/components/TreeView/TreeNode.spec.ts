import rewiremock from "../../../rewiremock";
import { expect } from "chai";
import { mount } from "@vue/test-utils";
import { resolveIdentifier } from "mobx-state-tree";
require("mocha-testcheck").install();

import { until } from "ramda";
import TreeNode from "@/components/TreeView/TreeNode.vue";
// import DynamicContent from "@/store/DynamicContent";
import { Tree } from "@/store/Tree";
import { Node, INode } from "@/store/Node";
import { getNode } from "../../../data/Node";

import { init } from "dc-extensions-sdk";

console.log("treeview", init);

//@ts-ignore
import faker from "faker";

// const TreeNode = rewiremock.proxy(
//   () => require("@/components/TreeView/TreeNode.vue"),
//   (r) => {
//     const mocks = {
//       [`${__dirname}../../../../node_modules/dc-extensions-sdk`]: {
//         async init() {
//           console.log("replaced");
//         },
//       },
//       [`${__dirname}../../../../src/store/DynamicContent`]: r.withDefault({
//         allowedTypes: [],
//       }),
//     };
//     return mocks;
//   }
// ).default;

// rewiremock("dc-extensions-sdk")
//   // .callThrough()
//   .with({
//     async init() {
//       console.log("yep");
//       return {
//         client: {},
//         form: {
//           readOnly: false,
//           onReadOnlyChange() {},
//         },
//         frame: {
//           startAutoResizer() {},
//           setHeight() {},
//         },
//         field: {
//           getValue() {},
//           setValue() {},
//           schema: {
//             items: {
//               allOf: [
//                 {
//                   $ref:
//                     "http://bigcontent.io/cms/schema/v1/core#/definitions/content-link",
//                 },
//                 {
//                   properties: {
//                     contentType: {
//                       enum: ["http://test.com"],
//                     },
//                   },
//                 },
//               ],
//             },
//           },
//         },
//         params: {
//           instance: {
//             nodeId: faker.random.uuid,
//           },
//         },
//       };
//     },
//   });

// beforeEach(() => {
//   console.log("enabling");
//   rewiremock.enable();
// });
// afterEach(() => rewiremock.disable());

// const DynamicContent = {
//   allowedTypes: ["http://test.com"],
//   remainingItems: 10,
// };

function getComponent(props: object = {}) {
  //@ts-ignore
  return mount(TreeNode, { ...props });
  // return mount(TreeNode, { ...props, localVue, DynamicContent });
}

function buildTree(depth: number) {
  const tree = Tree.create();
  tree.setRootNode(
    getNode({
      root: true,
      hasChildren: true,
      contentTypeUri: "http://test.com",
    })
  );
  return until(
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
}

describe("TreeNode.vue", async () => {
  // await DynamicContent.initialize();
  //@ts-ignore
  check.it(
    "Should have the correct left padding",
    //@ts-ignore
    gen.intWithin(1, 1),
    (nestingLevel: number) => {
      const node = buildTree(nestingLevel);
      const wrapper = getComponent({
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
