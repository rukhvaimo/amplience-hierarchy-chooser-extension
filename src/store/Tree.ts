import { flow, IMaybeNull, Instance, types } from "mobx-state-tree";
import { always } from "rambda";
import Store from "./DynamicContent";
import { Node } from "./Node";
import { tryCatch } from "@/utils/helpers";

const getNodes = tryCatch(
  (id: string) => Store.dcManagementSdk.hierarchies.children.get(id),
  always
);

const Tree = types
  .model({
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
      const nodes = yield getNodes(id);
      return nodes;
    }),
    setRootNode(rootNode: any): Instance<typeof Node> {
      self.rootNode = Node.create({ ...rootNode });
      return self.rootNode;
    },
  }));

export default Tree.create();
