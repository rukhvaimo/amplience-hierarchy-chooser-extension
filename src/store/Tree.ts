import { flow, types } from "mobx-state-tree";
import { always } from "rambda";
import Store from "./DynamicContent";
import { Node, INode } from "./Node";
import { isError, tryCatch } from "@/utils/helpers";

import data from "./mock";

const getNodes = tryCatch(
  Store.dcManagementSdk.hierarchies.children.get,
  always
);

const Tree = types
  .model("Tree", {
    rootNode: types.maybeNull(Node),
    selected: types.maybeNull(types.reference(Node)),
    selectedNodes: types.array(types.reference(Node)),
  })
  .views((self) => ({
    get visibleNodes() {
      return self.rootNode?.visibleNodes || [];
    },
  }))
  .actions((self) => ({
    loadTree: flow(function*(id: string) {
      const { data } = yield getNodes(id);
      yield data;
    }),
    setRootNode(rootNode: INode): Node {
      self.rootNode = Node.create(rootNode);
      return self.rootNode;
    },
  }));

export default Tree.create();
