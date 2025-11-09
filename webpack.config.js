const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    "load-test": "./src/tests/load-test.ts",
    "stress-test": "./src/tests/stress-test.ts",
    "smoke-test": "./src/tests/smoke-test.ts",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "commonjs",
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  target: "web",
  externals: /^(k6|https?\:\/\/)(\/.*)?/,
  plugins: [new CleanWebpackPlugin()],
  stats: {
    colors: true,
  },
};
