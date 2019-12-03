const CopyWebpackPlugin = require("copy-webpack-plugin");
const ScssConfigWebpackPlugin = require("scss-config-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

module.exports = {
  target: "web",
  mode: "development",
  entry: "./src/index.tsx",
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  resolve: {
    extensions: [".css", ".mjs", ".ts", ".tsx", ".js", ".json"]
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto"
      }
    ]
  },
  devServer: {
    contentBase: "./dist",
    overlay: true,
    publicPath: "/",
    hot: true,
    historyApiFallback: true,
    port: 4220
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.PUBLIC_BUCKET": JSON.stringify(
        "https://future-days-software-public.s3.us-east-2.amazonaws.com"
      )
    }),
    new CopyWebpackPlugin(["index.html"]),
    new ScssConfigWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
};
