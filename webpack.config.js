const webpack = require('webpack');
const path = require('path');
const { resolve } = require("path");

module.exports = {
  entry: resolve(__dirname, "./views/index.js"),
  mode: 'development',
  output: {
    path: path.resolve(__dirname, './dist/'),
    filename: 'index.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.(js|jsx|ts|tsx)$/,
  //       exclude: /(node_modules)/,
  //       loader: 'babel-loader',
  //     }
  //   ],
  // },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
};
