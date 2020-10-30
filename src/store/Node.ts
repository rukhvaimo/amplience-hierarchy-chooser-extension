import {
  IAnyModelType,
  Instance,
  SnapshotIn,
  SnapshotOut,
  types,
} from "mobx-state-tree";
import {
  always,
  compose,
  concat,
  equals,
  flatten,
  flip,
  ifElse,
  lensProp,
  reduce,
} from "rambda";

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
  .views((self) => ({
    get visibleNodes(): Node[] {
      const visibleNodesLens = lensProp("visibleNodes");
      const hasChildNodes = compose(equals(true), lensProp("childrenVisible"));
      // const joinVisibleNodes = compose(
      //   flatten,
      //   reduce(flip(call(concat, __, visibleNodesLens)), [])
      // );

      // const getVisibleNodes = ifElse(
      //   hasChildNodes,
      //   joinVisibleNodes,
      //   always([self])
      // );
      // return getVisibleNodes(self);

      // if (self.childrenVisible) {
      //   const visibleChildren = self.childNodes.reduce(
      //     (visibleNodes, child) => [...visibleNodes, child.visibleNodes],
      //     []
      //   );
      //   return flatten([self, ...visibleChildren]);
      // }
      // return [self];

      return [];
    },
  }))
  .actions((self) => ({
    setChildren(children: any[]) {
      self.children.replace(children);
    },
  }));

export interface INode extends Instance<typeof Node> {}
export interface ITodoSnapshotIn extends SnapshotIn<typeof Node> {}
export interface ITodoSnapshotOut extends SnapshotOut<typeof Node> {}
