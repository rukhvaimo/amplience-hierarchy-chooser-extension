import faker from "faker";
import { map, pipe, range } from "ramda";
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
    };

    this.contentItems = {
      async get() {
        return getContentItem();
      },
    };
  }
}
