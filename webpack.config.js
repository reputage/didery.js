const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'didery.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'production',
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: { loader: "babel-loader" }
    }] 
   }
};