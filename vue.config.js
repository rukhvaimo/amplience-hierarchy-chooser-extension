const webpack = require("webpack");

module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
      https: true,
    },
  },
  configureWebpack: {
    plugins: [new webpack.HotModuleReplacementPlugin()],
  },
};
