const path = require('path')

module.exports = {
  output: {
    path: path.resolve(__dirname, '../lib'),
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.js', '.css', '.ts', '.vue'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        use: 'babel-loader'
      }
    ],
  },
}
