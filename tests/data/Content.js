import faker from "faker";

export function getContent() {
  return {
    id: faker.random.uuid(),
    contentType: faker.internet.url(),
    label: faker.lorem.word(),
    _meta: {
      schema:
        "http://bigcontent.io/cms/schema/v1/core#/definitions/content-link",
    },
  };
}
