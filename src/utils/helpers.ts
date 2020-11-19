import {
  __,
  concat,
  curry,
  equals,
  identity,
  pipe,
  toString,
  type,
  unapply,
  when,
  complement,
} from "ramda";

export const tryCatch = curry(
  async (left: Function, right: Function, body: any) => {
    try {
      return await left(body);
    } catch (error) {
      return right(error);
    }
  }
);

export const isError = pipe(type, equals("Error"));

//@ts-ignore
export const whenError = when(isError);

export const notError = complement(isError);

export const toList = unapply(identity);

export const toPx = pipe(toString, concat(__, "px"));
