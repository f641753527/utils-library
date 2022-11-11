const path = require('path')
const { merge } = require('webpack-merge')
const config = require('./webpack.base')

module.exports = merge(config, {
  mode: "production",
  entry: path.resolve(__dirname, '../src/index.ts'),
  output: {
    library: "WebComponent",
    libraryTarget: "umd",
    filename: 'index.umd.js'
  },
  optimization: {
    minimize: false,
  },
})
