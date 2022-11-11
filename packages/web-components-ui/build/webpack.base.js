const path = require('path')

module.exports = {
  output: {
    path: path.resolve(__dirname, '../lib'),
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.css'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader'
      },
      {
        test: /\.tpl$/,
        use: path.resolve(__dirname, '../src/loaders/tpl-loader.js'),
      },
      {
        test: /\.less$/,
        use: ['css-loader', 'less-loader'],
      },
    ],
  },
}
