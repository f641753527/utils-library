const { merge } = require('webpack-merge')
const config = require('./webpack.base')

module.exports = merge(config, {
  output: {
    library: "_",
    libraryTarget: "umd",
    filename: 'index.umd.js'
  },
  optimization: {
    minimize: false,
  },
})
