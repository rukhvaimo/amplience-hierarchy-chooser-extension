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

rewiremock("dc-extensions-sdk").mockThrough((name, value) => {
  console.log(name, value);
  return {
    init() {
      console.log("MOCKED");
    },
    SDK: {},
    params: {},
  };
});

overrideEntryPoint(module);

export default rewiremock;
