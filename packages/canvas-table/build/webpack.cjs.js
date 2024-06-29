const path = require('path')
const { merge } = require('webpack-merge')
const config = require('./webpack.base')

module.exports = merge(config, {
  mode: "production",
  output: {
    clean: true,
    library: {
      type: "commonjs2"
    },
    filename: 'index.js'
  },
  optimization: {
    minimize: true,
  },
})
