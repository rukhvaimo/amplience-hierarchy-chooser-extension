import faker from "faker";
import { addIndex, map, pipe, range } from "ramda";
import { getNode } from "../tests/data/Node";
import { getContentItem } from "../tests/data/ContentItem";
export class DynamicContent {
  constructor() {
    this.hierarchies = {
      children: {
        async get() {
          return getNode({
            root: true,
            hasChildren: true,
            childrenVisible: true,
            children: pipe(
              range(1),
              map(() => getNode())
            )(faker.random.number(201)),
          });
        },
      },
      parents: {
        async get() {
          const mpaIndexed = addIndex(map);
          const numParents = faker.random.number(200);
          return getNode({
            parents: pipe(
              range(1),
              mpaIndexed((val, idx) => {
                return getNode({
                  root: idx === 0,
                  hasChildren: true,
                });
              })
            )(numParents),
          });
        },
      },
    };

    this.contentItems = {
      async get() {
        return getContentItem();
      },
    };
  }
}
