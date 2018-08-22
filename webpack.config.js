const path = require('path');

module.exports = {
  entry: ['babel-polyfill','./src/index.js'],
  output: {
    filename: 'didery.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'dideryjs',
    libraryTarget: 'umd',
    globalObject: "this"
  },
  node: {
    global: true,
    crypto: true
  },
  externals: [
    {
      'isomorphic-fetch': {
        root: 'isomorphic-fetch',
        commonjs2: 'isomorphic-fetch',
        commonjs: 'isomorphic-fetch',
        amd: 'isomorphic-fetch',
      },
      'crypto': 'crypto'
    }
  ],
  mode: 'production',
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: { loader: "babel-loader" }
    }]
   }
};