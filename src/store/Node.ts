import { notError } from "@/utils/helpers";
import {
  flow,
  hasParentOfType,
  IAnyModelType,
  Instance,
  SnapshotIn,
  SnapshotOut,
  types,
} from "mobx-state-tree";
import { __, when } from "ramda";
import {
  getChildren,
  getNestingLevel,
  getNodeParent,
  getNodePath,
  getVisibleNodes,
  isLast,
} from "@/utils/tree";
import { ContentItemModel } from "./FieldModel";

export const Node = types
  .model({
    children: types.array(types.late((): IAnyModelType => Node)),
    childrenVisible: types.optional(types.boolean, false),
    contentTypeUri: types.optional(types.string, ""),
    hasChildren: types.optional(types.boolean, false),
    id: types.optional(types.identifier, ""),
    label: types.optional(types.string, ""),
    parentId: types.maybeNull(types.string),
    publishingStatus: types.optional(
      types.enumeration(["NONE", "LATEST", "EARLY"]),
      "NONE"
    ),
  })
  .views((self: any) => ({
    get isLast() {
      //@ts-ignore
      return isLast(self);
    },
    get isRoot(): boolean {
      return !hasParentOfType(self, Node);
    },
    get nestingLevel() {
      return getNestingLevel(self);
    },
    get parent() {
      //@ts-ignore
      return getNodeParent(this);
    },
    get path() {
      //@ts-ignore
      return getNodePath(self);
    },
    get visibleNodes() {
      return getVisibleNodes(self);
    },
  }))
  .actions((self) => ({
    loadChildren: flow(function*() {
      const nodes = yield getChildren(self.id);
      //@ts-ignore
      when(notError, self.setChildren)(nodes);
      return nodes;
    }),
    setChildren(children: any[]) {
      self.children.replace(children.map((child) => ({ ...child })));
    },
    showChildren(visible: boolean) {
      self.childrenVisible = visible;
    },
    export() {
      return {
        id: self.id,
        contentType: self.contentTypeUri,
        label: self.label,
      };
    },
    toJSON(): ContentItemModel {
      return {
        id: self.id,
        contentType: self.contentTypeUri,
      };
    },
  }));

export interface INode extends Instance<typeof Node> {}
export interface ITodoSnapshotIn extends SnapshotIn<typeof Node> {}
export interface ITodoSnapshotOut extends SnapshotOut<typeof Node> {}
