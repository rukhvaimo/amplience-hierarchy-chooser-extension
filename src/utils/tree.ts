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
  identity,
  ifElse,
  isEmpty,
  last,
  multiply,
  not,
  path,
  pipe,
  prepend,
  prop,
  propEq,
  reduce,
  toString,
  until,
  when,
  findIndex,
  subtract,
  includes,
  eqProps,
  nth,
  of,
  complement,
} from "ramda";
import { getParent } from "mobx-state-tree";
import { toList, toPx, tryCatch } from "./helpers";
import Store from "@/store/DynamicContent";
import { INode } from "@/store/Node";

//@ts-ignore
const addParent = (nodes) =>
  //@ts-ignore
  pipe(head, getNodeParent, prepend(__, nodes))(nodes);

const extractVisibleNodes = pipe(
  //@ts-ignore
  prop("children"),
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
  identity
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
  propEq("childrenVisible", true),
  //@ts-ignore
  (node) => [node, ...extractVisibleNodes(node)],
  of
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

/**
 * Calculates the node padding
 */
export const getPadding = curry((padding: number, amount: number) =>
  pipe(multiply(padding), toPx)(amount)
);

/**
 * Gets the path to a given node
 */
export const getNodePath = pipe(toList, until(pipe(head, isRoot), addParent));

/**
 * Gets the previous rendered node
 */
export const previousNode = curry((root: INode, node: INode) => {
  const visibleNodes = getVisibleNodes(root);
  return pipe(
    //@ts-ignore
    prop("id"),
    propEq("id"),
    //@ts-ignore
    findIndex(__, visibleNodes),
    subtract(1),
    //@ts-ignore
    nth(__, visibleNodes)
    //@ts-ignore
  )(node);
});

/**
 * Is the node type valid?
 */
export const isValidType = curry((allowedTypes: string[], type: string) =>
  includes(type, allowedTypes)
);

/**
 * Is the node type invalid?
 */
//@ts-ignore
export const isInvalidType = complement(isValidType);
