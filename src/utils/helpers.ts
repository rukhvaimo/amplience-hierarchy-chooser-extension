import {
  compose,
  curry,
  equals,
  identity,
  not,
  pipe,
  type,
  unapply,
  when,
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

export const notError = compose(not, isError);

export const toList = unapply(identity);
