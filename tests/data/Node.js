import Faker from "faker";

export function getNode(options = {}) {
  const uuid = Faker.random.uuid();
  return {
    id: uuid,
    contentTypeUri: Faker.internet.url(),
    label: Faker.lorem.word(),
    publishingStatus: Faker.helpers.randomize(["NONE", "LATEST", "EARLY"]),
    root: Faker.helpers.randomize([true, false]),
    hasChildren: Faker.helpers.randomize([true, false]),
    repositoryId: Faker.random.uuid(),
    _links: {
      self: {
        href: `https://qa-titan-apigateway.adis.ws/v2/content/hierarchy-node/${uuid}/children`,
      },
      "content-item": {
        href: `https://qa-titan-apigateway.adis.ws/v2/content/content-items/${uuid}`,
      },
      "publish-hierarchy": {
        href:
          "https://qa-titan-apigateway.adis.ws/v2/content/hierarchies/publish",
      },
    },
    ...options,
  };
}
