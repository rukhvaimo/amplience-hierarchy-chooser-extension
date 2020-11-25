const ReWireMockPlugin = require("rewiremock/webpack/plugin");

module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
      https: true,
    },
  },
  configureWebpack: {
    plugins: [
      new (require("rewiremock/webpack/plugin"))(),
      new ReWireMockPlugin(),
    ],
  },
};
