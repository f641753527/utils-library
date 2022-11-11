const path = require('path')
const { merge } = require('webpack-merge')
const config = require('./webpack.base')

module.exports = merge(config, {
  mode: "production",
  entry: path.resolve(__dirname, '../src/index.ts'),
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
