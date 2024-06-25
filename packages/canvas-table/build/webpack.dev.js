const path = require('path')
const { merge } = require('webpack-merge')
const htmlWebpackPlugin = require('html-webpack-plugin')
const config = require('./webpack.base')

module.exports = merge(config, {
  mode: "development",
  entry: path.resolve(__dirname, '../src/dev-entry.ts'),
  devServer: {
    port: 8888,
    static: [
      {
        directory: path.join(__dirname, '../public'),
      },
      {
        directory: path.join(__dirname, '../lib'),
      },
    ]
  },
  module: {
    rules: [
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html')
    }),
  ]
})
