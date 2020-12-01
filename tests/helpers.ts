import { getNode } from "./data/Node";
import { Node, INode } from "@/store/Node";
import { ITree } from "@/store/Tree";
import { until } from "ramda";
import { resolveIdentifier } from "mobx-state-tree";
//@ts-ignore
import Faker from "faker";

export function buildTree(
  tree: ITree,
  depth = Faker.random.number(14),
  showChildren = false
) {
  tree.setRootNode(
    getNode({
      root: true,
      hasChildren: true,
      contentTypeUri: "http://test.com",
    })
  );

  tree.rootNode?.showChildren(showChildren);

  const node = until(
    (node: INode) => node.nestingLevel === depth,
    (node: INode) => {
      const newNode = getNode({
        root: false,
        hasChildren: true,
        contentTypeUri: "http://test.com",
      });
      node.setChildren([newNode]);
      const newNodeModel = resolveIdentifier(
        Node,
        tree.rootNode as INode,
        newNode.id
      ) as INode;
      newNodeModel.showChildren(showChildren);
      return newNodeModel;
    }
    //@ts-ignore
  )(tree.rootNode);

  return { tree, node };
}
