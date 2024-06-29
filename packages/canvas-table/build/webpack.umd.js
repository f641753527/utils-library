const { merge } = require('webpack-merge')
const config = require('./webpack.base')

module.exports = merge(config, {
  mode: "production",
  output: {
    library: "CanvasTable",
    libraryTarget: "umd",
    filename: 'index.umd.js'
  },
  optimization: {
    minimize: false,
  },
})
