import rewiremock from "rewiremock";
// import rewiremock from 'rewiremock/webpack';
import faker from "faker";

rewiremock.overrideEntryPoint(module);

rewiremock("dc-extensions-sdk")
  .callThrough()
  .with({
    async init() {
      return {
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
          getValue() {},
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
      };
    },
  });

export { rewiremock };
