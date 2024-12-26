const path = require("path");
const nodeExternals = require("webpack-node-externals");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const DotenvWebpackPlugin = require("dotenv-webpack");

module.exports = {
  mode: "production", // Use "development" for debugging or "production" for optimized builds
  entry: "./src/app.ts", // The entry point is app.ts
  target: "node", // Node.js target
  externals: [nodeExternals()], // Exclude node_modules from the bundle
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader", // Compile TypeScript
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"], // Resolve TypeScript and JavaScript extensions
  },
  output: {
    filename: "app.js", // Output file
    path: path.resolve(__dirname, "dist"), // Output directory
    libraryTarget: "commonjs2", // Export as CommonJS (Node.js module)
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src/schema/schema.graphql", // Copy GraphQL schema
          to: "schema/schema.graphql", // Keep the relative path in the dist folder
        }
      ],
    }),
    new DotenvWebpackPlugin(),

  ],
};
