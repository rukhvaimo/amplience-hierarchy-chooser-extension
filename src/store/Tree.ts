import { flow, Instance, types } from "mobx-state-tree";
import { any, propEq, reject } from "ramda";
import { Node } from "./Node";
import { getNodes } from "@/utils/tree";

const Tree = types
  .model({
    rootNode: types.maybeNull(Node),
    selected: types.maybeNull(types.reference(Node)),
    selectedNodes: types.array(types.reference(Node)),
    treeLoaded: types.optional(types.boolean, false),
  })
  .views((self) => ({
    get visibleNodes() {
      return self.rootNode?.visibleNodes || [];
    },
  }))
  .actions((self) => ({
    clearSelectedNodes() {
      self.selectedNodes.clear();
    },
    deselctNode(nodeId: string) {
      self.selectedNodes.replace(
        //@ts-ignore
        reject(propEq("id", nodeId), self.selectedNodes)
      );
    },
    setSelectedNodes(nodes: string[]) {
      nodes.forEach((id) => self.selectedNodes.push(id));
    },
    setTreeLoaded(loaded: boolean) {
      self.treeLoaded = loaded;
    },
    isSelected(nodeId: string) {
      return any(propEq("id", nodeId), self.selectedNodes);
    },
    loadTree: flow(function*(id: string) {
      const nodes = yield getNodes(id);
      return nodes;
    }),
    selectNode(id: string) {
      const existing = self.selectedNodes.find((node) => node.id === id);

      if (existing) {
        return;
      }

      self.selectedNodes.push(id);
    },
    setRootNode(rootNode: any): Instance<typeof Node> {
      self.rootNode = Node.create({ ...rootNode });
      return self.rootNode;
    },
  }));

export default Tree.create();
