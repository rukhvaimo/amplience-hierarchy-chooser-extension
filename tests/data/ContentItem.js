import faker from "faker";
import { mergeDeepLeft } from "ramda";

export function getContentItem(contentItem = {}) {
  const uuid = faker.random.uuid();
  const parentId = faker.random.uuid();
  return mergeDeepLeft(contentItem, {
    id: uuid,
    contentRepositoryId: faker.random.uuid(),
    folderId: null,
    body: {
      _meta: {
        name: faker.lorem.words(),
        schema: faker.internet.url(),
        hierarchy: {
          parentId,
          root: false,
        },
      },
    },
    version: 1,
    label: faker.lorem.words(),
    status: "ACTIVE",
    createdBy: faker.random.uuid(),
    createdDate: faker.date.past(),
    lastModifiedBy: faker.random.uuid(),
    lastModifiedDate: faker.date.past(),
    lastPublishedVersion: faker.random.number(10),
    lastPublishedDate: faker.date.past(),
    hierarchy: {
      parentId,
      root: false,
    },
    deliveryId: uuid,
    _links: {
      self: {
        href: `https://qa-titan-apigateway.adis.ws/v2/content/content-items/${uuid}`,
      },
      "content-item": {
        href: `https://qa-titan-apigateway.adis.ws/v2/content/content-items/${uuid}{?projection}`,
        templated: true,
      },
      publish: {
        href: `https://qa-titan-apigateway.adis.ws/v2/content/content-items/${uuid}/publish`,
      },
      planned: {
        href: `https://qa-titan-apigateway.adis.ws/v2/content/content-items/${uuid}/planned{?epoch,time}`,
        templated: true,
      },
      update: {
        href: `https://qa-titan-apigateway.adis.ws/v2/content/content-items/${uuid}`,
      },
      "restore-version": {
        href: `https://qa-titan-apigateway.adis.ws/v2/content/content-items/${uuid}/restore`,
      },
      "content-repository": {
        href: `https://qa-titan-apigateway.adis.ws/v2/content/content-repositories/5b3335d64cedfd0001c59252`,
      },
      "content-item-version": {
        href: `https://qa-titan-apigateway.adis.ws/v2/content/content-items/${uuid}/versions{/version}`,
        templated: true,
      },
      "content-item-versions": {
        href: `https://qa-titan-apigateway.adis.ws/v2/content/content-items/${uuid}/versions{?page,size,sort}`,
        templated: true,
      },
      "content-item-history": {
        href: `https://qa-titan-apigateway.adis.ws/v2/content/content-items/${uuid}/history{?page,size,sort}`,
        templated: true,
      },
      copy: {
        href: `https://qa-titan-apigateway.adis.ws/v2/content/content-repositories/{id}/content-items?sourceContentItemId=${uuid}`,
        templated: true,
      },
      unarchive: {
        href: `https://qa-titan-apigateway.adis.ws/v2/content/content-items/${uuid}/unarchive`,
      },
      archive: {
        href: `https://qa-titan-apigateway.adis.ws/v2/content/content-items/${uuid}/archive`,
      },
      "set-locale": {
        href: `https://qa-titan-apigateway.adis.ws/v2/content/content-items/${uuid}/locale`,
      },
      "create-localizations": {
        href: `https://qa-titan-apigateway.adis.ws/v2/content/content-items/${uuid}/localize`,
      },
      localizations: {
        href: `https://qa-titan-apigateway.adis.ws/v2/content/content-items/${uuid}/localizations{?page,size,sort}`,
        templated: true,
      },
      "localization-jobs": {
        href: `https://qa-titan-apigateway.adis.ws/v2/content/localization-jobs/search/findByRootContentItem?id=${uuid}{&page,size,sort}`,
        templated: true,
      },
      "edition-slot-associations": {
        href: `https://qa-titan-apigateway.adis.ws/v2/content/content-items/${uuid}/edition-slot-associations`,
      },
      "edit-workflow": {
        href: `https://qa-titan-apigateway.adis.ws/v2/content/content-items/${uuid}/workflow`,
      },
      "content-item-with-children": {
        href: `https://qa-titan-apigateway.adis.ws/v2/content/content-items/search/findByIdWithChildren?id=${uuid}`,
      },
    },
  });
}
