const path = require('path');
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.IgnorePlugin({resourceRegExp : /jsdom/})
  ],
  entry: {
    sitio: './front/root.tsx'
  },
  devtool: 'inline-source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.tsx$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      }
    ],
  },
  resolve: {
    extensions: ['.mjs', '.tsx', '.ts', '.js', '.jsx'],
    fallback: { "url": require.resolve("url/"), "path": require.resolve("path-browserify") }
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public/front'),
    clean: true
  },
};
