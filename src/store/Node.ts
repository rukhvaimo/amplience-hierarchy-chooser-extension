import {
  hasParentOfType,
  IAnyModelType,
  Instance,
  SnapshotIn,
  SnapshotOut,
  types,
} from "mobx-state-tree";
import { flatten, ifElse, pipe, propEq, reduce } from "rambda";

const extractVisibleNodes = pipe(
  (node: any) => node.children,
  reduce(
    (visibleNodes: any[], child: any) => [...visibleNodes, child.visibleNodes],
    []
  ),
  flatten
);

const getVisibleNodes = ifElse(
  //@ts-ignore
  propEq("childrenVisible", true),
  (node) => [node, ...extractVisibleNodes(node)],
  (node) => [node]
);

export const Node = types
  .model({
    children: types.array(types.late((): IAnyModelType => Node)),
    childrenVisible: types.optional(types.boolean, false),
    contentTypeId: types.optional(types.string, ""),
    contentTypeUri: types.optional(types.string, ""),
    disabled: types.optional(types.boolean, false),
    hasChildren: types.optional(types.boolean, false),
    id: types.optional(types.identifier, ""),
    label: types.optional(types.string, ""),
    publishingStatus: types.optional(
      types.enumeration(["NONE", "LATEST", "EARLY"]),
      "NONE"
    ),
    _links: types.optional(types.frozen(), {}),
  })
  .views((self: any) => ({
    get isRoot(): boolean {
      return !hasParentOfType(self, Node);
    },
    get visibleNodes() {
      return getVisibleNodes(self);
    },
  }))
  .actions((self) => ({
    setChildren(children: any[]) {
      self.children.replace(children.map((child) => ({ ...child })));
    },
    showChildren(visible: boolean) {
      self.childrenVisible = visible;
    },
  }));

export interface INode extends Instance<typeof Node> {}
export interface ITodoSnapshotIn extends SnapshotIn<typeof Node> {}
export interface ITodoSnapshotOut extends SnapshotOut<typeof Node> {}
