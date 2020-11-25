import {
  addPlugin,
  overrideEntryPoint,
  plugins,
  resolveExtensions,
} from "rewiremock";
import rewiremock from "rewiremock/webpack";

addPlugin(plugins.webpackAlias);
addPlugin(plugins.usedByDefault);
addPlugin(plugins.alwaysMatchOrigin);
addPlugin(plugins.mockThroughByDefault);
// addPlugin(plugins.relative)

resolveExtensions([".vue", ".js", ".ts"]);

rewiremock("dc-extensions-sdk").with({
  init() {
    console.log("MOCKED");
  },
  SDK: {},
  params: {},
});

rewiremock.enable();

overrideEntryPoint(module);

export default rewiremock;
