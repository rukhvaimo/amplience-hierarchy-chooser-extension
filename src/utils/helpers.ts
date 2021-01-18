import {
  __,
  concat,
  curry,
  equals,
  identity,
  isEmpty,
  pipe,
  toString,
  type,
  unapply,
  when,
  complement,
  addIndex,
  reduce,
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
