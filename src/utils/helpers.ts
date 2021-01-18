import {
  __,
  concat,
  curry,
  equals,
  isEmpty,
  pipe,
  toString,
  type,
  when,
  complement,
  addIndex,
  reduce,
  always,
  ifElse,
  isNil,
  keys,
} from "ramda";

/**
 * Try,catch for async functions
 */
export const tryCatch = curry(
  async (left: Function, right: Function, body: any) => {
    try {
      return await left(body);
    } catch (error) {
      return right(error);
    }
  }
);

/**
 * Is the given value an error?
 */
export const isError = pipe(type, equals("Error"));

/**
 * When the value is an error, do something
 */
//@ts-ignore
export const whenError = when(isError);

/**
 * Retruns true if the given value is not an error
 */
export const notError = complement(isError);

/**
 * Converts an number to a string and as a 'px' suffix
 */
export const toPx = pipe(toString, concat(__, "px"));

/**
 * Returns true if the given value is not empty
 */
export const notEmpty = complement(isEmpty);

/**
 * Reduce with list property
 */
export const reduceIdx = addIndex(reduce);

function getRegx(prefix: string, suffix: string, variableName: string) {
  return new RegExp(`${prefix}${variableName}${suffix}`, "g");
}

export function detokenize(
  template: string,
  variables: { [name: string]: string | undefined },
  tokenPrefix: string = "{{",
  tokenSuffix: string = "}}"
): string {
  //@ts-ignore
  return pipe(
    keys,
    reduce(
      (tmplt, varName) =>
        pipe(
          //@ts-ignore
          propOr(null, __, variables),
          ifElse(isNil, always(tmplt), (varValue) =>
            tmplt.replace(
              getRegx(tokenPrefix, tokenSuffix, varName),
              encodeURIComponent(varValue)
            )
          )
          //@ts-ignore
        )(varName),
      template
    )
  )(variables);
}
