import rewiremock from "rewiremock";
// import rewiremock from 'rewiremock/webpack';

class DynamicContentMock {
  contentItems = {
    get() {
      return {};
    },
  };
}

// rewiremock.overrideEntryPoint("dc-management-sdk-js");

rewiremock("dc-management-sdk-js")
  .callThrough()
  .with({
    DynamicContent: DynamicContentMock,
    ContentItem: {},
  });

export { rewiremock };
