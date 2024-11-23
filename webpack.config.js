const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
module.exports = {
  // Mode can be 'development' or 'production'
  mode: "development", // Set to 'production' for production builds

  // Entry point for the application
  entry: "./src/index.js",

  // Output settings
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/", // Ensures HMR works properly with the dev server
  },

  // Resolve module extensions
  resolve: {
    extensions: [".js", ".jsx", ".json"],
  },

  // Loaders configuration
  module: {
    rules: [
      // Babel loader to transpile JSX/ES6
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [
              "react-refresh/babel", // React Fast Refresh for hot reloading
            ],
          },
        },
      },
      // CSS loader to handle styles
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      // File loader for images (optional)
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: "file-loader",
      },
    ],
  },

  // Dev Server configuration for HMR
  devServer: {
    contentBase: path.join(__dirname, "public"),
    compress: true,
    port: 3000,
    hot: true, // Enable hot module replacement
    historyApiFallback: true, // Fix for react-router (single-page apps)
    open: true, // Open the browser after the server starts
  },

  // Plugins for extra features
  plugins: [
    // Automatically inject script tags into the HTML file
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),

    // Enable Hot Module Replacement for React Fast Refresh
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin(), // Add this line
  ],

  // Source maps for easier debugging
  devtool: "eval-source-map",

  optimization: {
    minimize: true, // Minify JavaScript
    splitChunks: {
      chunks: "all", // Split large bundles into smaller chunks for better caching
    },
  },
};
