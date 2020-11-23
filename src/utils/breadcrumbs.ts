import {
  add,
  allPass,
  always,
  append,
  apply,
  applySpec,
  assoc,
  complement,
  converge,
  curry,
  equals,
  gt,
  gte,
  head,
  identity,
  ifElse,
  indexOf,
  insert,
  last,
  length,
  lt,
  lte,
  max,
  multiply,
  nth,
  pipe,
  prop,
  propEq,
  propSatisfies,
  reduce,
  reject,
  subtract,
  where,
  __,
} from "ramda";

export type BreadcrumbModel = {
  text: string;
  collapse: Boolean;
  width: number;
};

export type BreadcrumbReducer = {
  crumbs: BreadcrumbModel[];
  crumbsWidth: number;
};

/**
 * Gets the total width of all required breadcrumb dividers
 * @param dividerWidth The width of the divider
 */
export const getTotalDividerWidth = curry(
  (dividerWidth: number, items: any[]) =>
    apply(
      pipe(
        //@ts-ignore
        length,
        subtract(__, 1),
        max(0),
        multiply(dividerWidth)
      ),
      [items]
    )
);

/**
 * Gets the width of all crumbs in the breadcrumb
 */
export const getTotalCrumbsWidth = reduce(
  //@ts-ignore
  (width, crumb) => pipe(prop("width"), add(width))(crumb),
  0
);

/**
 * Gets the total width of the breadcrumb including all crumbs nad dividers
 */
export const getTotalBreadcrumbsWidth = curry(
  (dividerWidth: number, items: any[]) =>
    apply(
      converge(add, [getTotalDividerWidth(dividerWidth), getTotalCrumbsWidth]),
      [items]
    )
);

/**
 * Is the given crumb the first crumb?
 */
export const isLastCrumb = curry((crumbs: any[], item: any) =>
  apply(pipe(last, equals(item)), [crumbs])
);

/**
 * Is the given crumb the last crumb?
 */
export const isFirstCrumb = curry((crumbs: any[], item: any) =>
  apply(pipe(head, equals(item)), [crumbs])
);

/**
 * Should the crumb be collapsed?
 */
export const shouldCollapse = (crumbs: any[], item: any) =>
  apply(
    allPass([
      propEq("collapse", true),
      //@ts-ignore
      complement(isLastCrumb(crumbs)),
      //@ts-ignore
      complement(isFirstCrumb(crumbs)),
    ]),
    [item]
  );

/**
 * Gets the width of all crumbs except the first one and adds the uncollapsed width of the first crumb
 * @param width The width of the crumb
 * @param items The array of crumbs
 */
export const getTailCrumbsWidth = (width: number, items: any[]) =>
  apply(
    converge(add, [
      //@ts-ignore
      pipe(head, prop("width")),
      //@ts-ignore
      pipe(length, subtract(__, 1), nth(__, items), prop("width"), add(width)),
    ]),
    [items]
  );

type Breadcrumb = {
  crumbs: BreadcrumbModel[];
  crumbsWidth: number;
  index: number;
};

/**
 * Validates the breadcrumb model
 */
export const breadcrumbValidator = curry(
  (elementWidth: number, items: BreadcrumbModel[]) =>
    where({
      crumbsWidth: gt(__, elementWidth),
      index: allPass([
        lt(__, subtract(length(items), 2)),
        complement(equals(0)),
      ]),
    })
);

/**
 * Used as a reducer to remove items from the breadcrumb if they don't fit
 */
export const handleHide = curry(
  (
    elementWidth: number,
    dividerWidth: number,
    items: BreadcrumbModel[],
    breadcrumb: Breadcrumb,
    item: BreadcrumbModel,
    index: number
  ) => {
    return ifElse(
      //@ts-ignore
      breadcrumbValidator(elementWidth, items),
      applySpec({
        crumbs: pipe(
          prop("crumbs"),
          //@ts-ignore
          reject(pipe(indexOf(__, items), equals(index)))
        ),
        crumbsWidth: pipe(prop("crumbsWidth"), subtract(__, dividerWidth)),
      }),
      identity
    )({
      ...breadcrumb,
      index,
    });
  }
);

/**
 * Hides breadcrumbs that don't fit into the avilable space
 */
export const hideCrumbs = curry(
  (items: BreadcrumbModel[], crumbs: BreadcrumbModel[]) =>
    apply(
      ifElse(
        allPass([pipe(length, equals(2)), always(gte(length(items), 2))]),
        insert(
          1,
          assoc(
            "collapse",
            true,
            //@ts-ignore
            nth(pipe(length, subtract(__, 2))(items), items)
          )
        ),
        identity
      ),
      [crumbs]
    )
);

/**
 * measures a breadcrumb element
 */
export const measure = curry(($: Document, nodeText: string) => {
  const el = $.createElement("span");

  el.classList.add("breadcrumbs__measure");
  el.innerText = nodeText;
  $.querySelector(".v-application")?.appendChild(el);

  const width = el.scrollWidth;

  el.remove();

  return {
    width,
    text: nodeText,
    collapse: false,
  };
});

export const handleCrumb = (
  breadcrumbs: BreadcrumbReducer,
  baseWidth: number,
  elementWidth: number,
  item: BreadcrumbModel
) => {
  apply(
    ifElse(
      propSatisfies(lte(__, elementWidth), "crumbsWidth"),
      applySpec({
        //@ts-ignore
        crumbs: pipe(prop("crumbs"), append(item)),
        crumbsWidth: prop("crumbsWidth"),
      }),
      applySpec({
        //@ts-ignore
        crumbs: pipe(prop("crumbs"), append(assoc("collapse", true, item))),
        crumbsWidth: pipe(
          prop("crumbsWidth"),
          subtract(__, item.width),
          add(baseWidth)
        ),
      })
    ),
    [breadcrumbs]
  );
};
