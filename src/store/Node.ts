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
    status: types.optional(types.enumeration(["ACTIVE", "ARCHIVED"]), "ACTIVE"),
  })
  .views((self: any) => ({
    get isLast() {
      return isLast(self);
    },
    get isRoot(): boolean {
      return !hasParentOfType(self, Node);
    },
    get nestingLevel() {
      return getNestingLevel(self);
    },
    get parent() {
      return getNodeParent(this);
    },
    get path() {
      return getNodePath(self);
    },
    get visibleNodes() {
      return getVisibleNodes(self);
    },
  }))
  .actions((self: any) => ({
    loadChildren: flow(function*() {
      const nodes: any[] = yield getChildren(self.id);
      when(notError, self.setChildren)(nodes);
      return nodes;
    }),
    setChildren(children: any[]) {
      self.children.replace(children.map((child) => ({ ...child })));
    },
    setContentTypeUri(uri: string) {
      self.contentTypeUri = uri;
    },
    setStatus(status: string) {
      self.status = status;
    },
    showChildren(visible: boolean) {
      self.childrenVisible = visible;
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
