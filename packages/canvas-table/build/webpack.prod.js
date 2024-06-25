const path = require('path')
const { merge } = require('webpack-merge')
const config = require('./webpack.base')

module.exports = merge(config, {
  mode: "production",
  externals: {
    vue: 'Vue'
  },
  entry: path.resolve(__dirname, '../src/index.js'),
  output: {
    clean: true,
    library: {
      type: "commonjs2"
    },
    filename: 'index.js'
  },
  optimization: {
    minimize: false,
  },
})
