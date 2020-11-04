import { flow, Instance, types } from "mobx-state-tree";
import { any, propEq } from "ramda";
import { Node } from "./Node";
import { getNodes } from "@/utils/tree";

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
    deselctNode(nodeId: string) {
      self.selectedNodes.filter(({ id }) => id === nodeId);
    },
    isSelected(nodeId: string) {
      return any(propEq("id", nodeId), self.selectedNodes);
    },
    loadTree: flow(function*(id: string) {
      const nodes = yield getNodes(id);
      return nodes;
    }),
    selectNode(id: string) {
      self.selectedNodes.push(id);
    },
    setRootNode(rootNode: any): Instance<typeof Node> {
      self.rootNode = Node.create({ ...rootNode });
      return self.rootNode;
    },
  }));

export default Tree.create();
