process.env.NODE_ENV = 'development';

const path = require('path');
const { merge } = require('webpack-merge');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  output: {
    filename: 'static/js/bundle.js',
    chunkFilename: 'static/js/[name].chunk.js',
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, '..', 'public'),
    },
    historyApiFallback: true,
    hot: true,
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
  },
  plugins: [new ReactRefreshWebpackPlugin()],
});
