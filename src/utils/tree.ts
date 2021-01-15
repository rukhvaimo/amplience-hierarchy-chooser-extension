import {
  __,
  add,
  anyPass,
  always,
  apply,
  compose,
  curry,
  equals,
  flatten,
  head,
  identity,
  ifElse,
  isEmpty,
  last,
  length,
  multiply,
  not,
  path,
  pipe,
  prepend,
  prop,
  propEq,
  reduce,
  until,
  when,
  findIndex,
  subtract,
  includes,
  nth,
  of,
  complement,
  F,
  isNil,
  or,
  and,
  gte,
  range,
  reject,
} from "ramda";
import { getParent } from "mobx-state-tree";
import { toPx, tryCatch } from "./helpers";
import Store from "@/store/DynamicContent";
import { INode } from "@/store/Node";

const addParent = (nodes: INode[]): INode[] =>
  //@ts-ignore
  pipe(head, getNodeParent, prepend(__, nodes))(nodes);

const extractVisibleNodes = pipe(
  prop<string, INode[]>("children"),
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

const getParentOfNode = apply(curry<any>(getParent), [__, 2]);

const getLastChildId = pipe(
  path<any>(["parent", "children"]),
  last,
  prop<string, INode>("id")
);

const isLastChild = (node: INode): boolean =>
  equals<any>(getLastChildId(node), node.id);

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
  (node) => [node, ...extractVisibleNodes(node)],
  of
);

/**
 * Checks if the node is a root node
 */
export const isRoot: any = pipe(prop<string, boolean>("isRoot"), equals(true));

/**
 * Checks if the node is not a root node
 */
export const notRoot: any = compose<Function, boolean>(not, isRoot);

/**
 * Gets the nesting level of a node
 */
export const getNestingLevel = ifElse(isRoot, always(0), incrementParentLevel);

/**
 * Gets the parent of the node
 */
export const getNodeParent: Function = when<boolean, Function>(
  notRoot,
  getParentOfNode
);

/**
 * Checks if the node is a root node or the last child of a parent node
 */
export const isLast = anyPass([isRoot, isLastChild]);

/**
 * Checks if the node has children
 */

export const hasChildren = pipe(
  prop<string, INode>("children"),
  complement(isEmpty)
);

/**
 * Calculates the node padding
 */
export const getPadding = curry((padding: number, amount: number) =>
  pipe(multiply(padding), toPx)(amount)
);

/**
 * Gets the path to a given node
 */
export const getNodePath: Function = pipe(
  //@ts-ignore
  of,
  until(pipe(head, isRoot), addParent)
);

/**
 * Gets the previous rendered node
 */
export const previousNode = curry((root: INode, node: INode) => {
  const visibleNodes = getVisibleNodes(root);

  return pipe(
    prop<string, INode>("id"),
    propEq("id"),
    //@ts-ignore
    findIndex(__, visibleNodes),
    subtract(__, 1),
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

/**
 * Is the previous node disabled?
 */
export const previousNodeDisabled = (
  rootNode: INode,
  allowedTypes: string[],
  node: INode
) =>
  apply(
    pipe(
      previousNode(rootNode),
      ifElse(
        or(isRoot, isNil),
        F,
        pipe(
          prop("contentTypeUri"),
          //@ts-ignore
          isInvalidType(allowedTypes)
        )
      )
    ),
    [node]
  );

/**
 * Get the left padding amount
 */
export const paddingLeft = (
  nestingLevel: number,
  isInvalid: boolean,
  padding: number
) =>
  apply(
    pipe(
      multiply(nestingLevel),
      ifElse(always(isInvalid), add(32), identity),
      toPx
    ),
    [padding]
  );

/**
 * Get an array of the node's nesting levels
 */
export const nestingLevels = (path: INode[], nestingLevel: number) =>
  apply(
    pipe(
      range(0),
      //@ts-ignore
      reject(pipe(nth(__, path), propEq("isLast", true)))
    ),
    [nestingLevel]
  );

/**
 * Should selection be prevented?
 */
export const preventSelection = (
  isSelected: boolean,
  remainingItems: number,
  selectedNodes: INode[]
) =>
  apply(
    pipe(
      //@ts-ignore
      length,
      gte(__, remainingItems),
      and(not(isSelected))
    ),
    [selectedNodes]
  );
