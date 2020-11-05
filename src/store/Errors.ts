export enum ERROR_TYPE {
  CANNOT_BE_FOUND = "CANNOT_BE_FOUND",
  NOT_ROOT = "NOT_ROOT",
  NOT_HIERARCHY = "NOT_HIERARCHY",
  ARCHIVED = "ARCHIVED",
  UNKNOWN = "UNKNOWN",
}

export type NodeError = ErrorEvent & {
  message: ERROR_TYPE | string;
};

export interface ErrorModel {
  message: string;
  type: ERROR_TYPE;
}

export interface ERROR_MAP {
  [key: string]: ErrorModel;
}

export const NODE_ERRORS: ERROR_MAP = {
  [ERROR_TYPE.ARCHIVED]: {
    type: ERROR_TYPE.ARCHIVED,
    message: "Hierarchy is archived, please check extension configuration",
  },
  [ERROR_TYPE.CANNOT_BE_FOUND]: {
    type: ERROR_TYPE.CANNOT_BE_FOUND,
    message: "Hierarchy cannot be found, please check extension configuration",
  },
  [ERROR_TYPE.NOT_HIERARCHY]: {
    type: ERROR_TYPE.NOT_HIERARCHY,
    message:
      "Specified node is not a hierarchy node, please check extension configuration",
  },
  [ERROR_TYPE.NOT_ROOT]: {
    type: ERROR_TYPE.NOT_ROOT,
    message:
      "Specified node is not a hierarchy root, please check extension configuration",
  },
  [ERROR_TYPE.UNKNOWN]: {
    type: ERROR_TYPE.UNKNOWN,
    message: "Something has gone wrong, please check extension configuration",
  },
};
