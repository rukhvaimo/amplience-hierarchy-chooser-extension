import {
  getParent,
  hasParentOfType,
  IAnyModelType,
  Instance,
  SnapshotIn,
  SnapshotOut,
  types,
} from "mobx-state-tree";
import {
  __,
  add,
  always,
  apply,
  compose,
  curry,
  equals,
  flatten,
  ifElse,
  not,
  path,
  pipe,
  prop,
  propEq,
  reduce,
  when,
} from "ramda";

const extractVisibleNodes = pipe(
  //@ts-ignore
  prop("children"),
  reduce(
    (visibleNodes: any[], child: any) => [...visibleNodes, child.visibleNodes],
    []
  ),
  flatten
);

const getVisibleNodes = ifElse(
  //@ts-ignore
  propEq("childrenVisible", true),
  //@ts-ignore
  (node) => [node, ...extractVisibleNodes(node)],
  (node) => [node]
);

//@ts-ignore
const isRoot = pipe(prop("isRoot"), equals(true));
const notRoot = compose(not, isRoot);
//@ts-ignore
const incrementParentLevel = pipe(path(["parent", "nestingLevel"]), add(1));

const getNestingLevel = ifElse(isRoot, always(0), incrementParentLevel);
//@ts-ignore
const getParentOfNode = apply(curry(getParent), [__, 2]);

const getNodeParent = when(
  notRoot,
  //@ts-ignore
  getParentOfNode
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
    get nestingLevel() {
      return getNestingLevel(self);
    },
    get parent() {
      //@ts-ignore
      return getNodeParent(this);
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
