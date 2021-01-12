import {
  applySnapshot,
  flow,
  getSnapshot,
  Instance,
  types,
} from "mobx-state-tree";
import { any, propEq, reject, unless } from "ramda";
import { Node } from "./Node";
import { getNodes } from "@/utils/tree";

export const Tree = types
  .model({
    rootNode: types.maybeNull(Node),
    selected: types.maybeNull(types.reference(Node)),
    selectedNodes: types.array(types.reference(Node)),
    treeDisabled: types.optional(types.boolean, false),
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
    deselectNode(nodeId: string) {
      self.selectedNodes.replace(
        //@ts-ignore
        reject(propEq("id", nodeId), self.selectedNodes)
      );
    },
    disableTree() {
      self.treeDisabled = true;
    },
    enableTree() {
      self.treeDisabled = false;
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
    reset() {
      applySnapshot(self, initialState);
    },
    selectNode(id: string) {
      unless(this.isSelected, (id) => self.selectedNodes.push(id))(id);
    },
    setRootNode(rootNode: any): Instance<typeof Node> {
      self.rootNode = Node.create({ ...rootNode });
      return self.rootNode;
    },
  }));

const store = Tree.create();
const initialState = getSnapshot(store);

export interface ITree extends Instance<typeof Tree> {}

export default store;
