import faker from "faker";
import { map, pipe, range } from "ramda";
import { getNode } from "../tests/data/Node";

export async function init() {
  return SDK;
}

export const SDK = {
  client: {},
  form: {
    readOnly: false,
    onReadOnlyChange() {},
  },
  frame: {
    startAutoResizer() {},
    setHeight() {},
  },
  field: {
    async getValue() {
      return pipe(
        range(1),
        map(() => ({
          _empty: true,
        }))
      )(faker.random.number(1, 20));
    },
    setValue() {},
    schema: {
      items: {
        allOf: [
          {
            $ref:
              "http://bigcontent.io/cms/schema/v1/core#/definitions/content-link",
          },
          {
            properties: {
              contentType: {
                enum: ["http://test.com"],
              },
            },
          },
        ],
      },
    },
  },
  params: {
    instance: {
      nodeId: faker.random.uuid,
    },
  },
  contentItems: {
    async get(id) {
      return getNode({ id });
    },
  },
};
