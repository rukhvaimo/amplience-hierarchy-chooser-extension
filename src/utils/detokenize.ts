import { always, ifElse, isNil, keys, pipe, propOr, reduce, __ } from "ramda";

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
