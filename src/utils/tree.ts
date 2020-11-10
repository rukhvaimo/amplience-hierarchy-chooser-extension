import {
  __,
  add,
  anyPass,
  always,
  apply,
  compose,
  concat,
  curry,
  equals,
  flatten,
  head,
  ifElse,
  isEmpty,
  juxt,
  last,
  not,
  path,
  pipe,
  prop,
  propEq,
  reduce,
  toString,
  when,
  multiply,
  prepend,
  until,
} from "ramda";
import { getParent } from "mobx-state-tree";
import { toList, tryCatch } from "./helpers";
import Store from "@/store/DynamicContent";

//@ts-ignore
const addParent = (nodes) =>
  //@ts-ignore
  pipe(head, getNodeParent, prepend(__, nodes))(nodes);

const extractVisibleNodes = pipe<any[]>(
  prop<any>("children"),
  //@ts-ignore
  reduce(
    (visibleNodes: any[], child: any) => [...visibleNodes, child.visibleNodes],
    []
  ),
  flatten
);

const incrementParentLevel = pipe(
  path<any>(["parent", "nestingLevel"]),
  add(1)
);

//@ts-ignore
const getParentOfNode = apply(curry(getParent), [__, 2]);

const getLastChildId = pipe(
  path<any>(["parent", "children"]),
  last,
  //@ts-ignore
  prop("id")
);
//@ts-ignore
const isLastChild = (node: any) => equals(getLastChildId(node), node.id);

/**
 * Gets nodes from the SDK
 */
export const getNodes = tryCatch(
  (id: string) => Store.dcManagementSdk.hierarchies.children.get(id),
  always
);

/**
 * Gets child nodes
 * @param id The parent ID
 */
export const getChildren = async (id: string) => {
  const { children } = await getNodes(id);
  return children;
};

/**
 * Gets all nodes visible in the tree
 */
export const getVisibleNodes = ifElse(
  propEq<any>("childrenVisible", true),
  //@ts-ignore
  (node) => [node, ...extractVisibleNodes(node)],
  (node) => [node]
);

/**
 * Checks if the node is a root node
 */
//@ts-ignore
export const isRoot: any = pipe<boolean>(prop("isRoot"), equals(true));

/**
 * Checks if the node is not a root node
 */
//@ts-ignore
export const notRoot: any = compose<boolean>(not, isRoot);

/**
 * Gets the nesting level of a node
 */
export const getNestingLevel = ifElse(isRoot, always(0), incrementParentLevel);

/**
 * Gets the parent of the node
 */
export const getNodeParent = when(
  notRoot,
  //@ts-ignore
  getParentOfNode
);

/**
 * Checks if the node is a root node or the last child of a parent node
 */
export const isLast = anyPass([isRoot, isLastChild]);

/**
 * Checks id the node has children
 */
//@ts-ignore
export const hasChildren = pipe(prop("children"), isEmpty, not);

const PADDING = 26;
export const getPadding = pipe(multiply(PADDING), toString, concat(__, "px"));

export const getNodePath = pipe(toList, until(pipe(head, isRoot), addParent));
