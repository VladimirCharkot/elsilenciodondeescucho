const path = require('path');

module.exports = {
  entry: {
    sitio: './front/root_indice.tsx',
    editor: './front/root_editor.tsx',
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
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: { "url": require.resolve("url/") }
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public/front'),
    clean: true
  },
};
