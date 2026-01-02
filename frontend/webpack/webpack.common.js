const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const appDir = path.resolve(__dirname, '..');
const srcDir = path.join(appDir, 'src');
const publicDir = path.join(appDir, 'public');

const mode = process.env.NODE_ENV || 'production';
const isProd = mode === 'production';

const loadEnv = () => {
  const envFiles = [
    `.env.${mode}.local`,
    `.env.${mode}`,
    '.env.local',
    '.env',
  ];

  const parsed = {};

  envFiles.forEach((file) => {
    const filePath = path.join(appDir, file);
    if (!fs.existsSync(filePath)) {
      return;
    }
    Object.assign(parsed, dotenv.parse(fs.readFileSync(filePath)));
  });

  return {
    ...parsed,
    ...process.env,
  };
};

const rawEnv = loadEnv();
const rawPublicUrl = rawEnv.PUBLIC_URL || '';
const publicUrl = rawPublicUrl === '/' ? '' : rawPublicUrl.replace(/\/$/, '');
const publicPath = publicUrl ? `${publicUrl}/` : '/';

const defineEnv = Object.keys(rawEnv)
  .filter((key) => key === 'PUBLIC_URL' || key.startsWith('REACT_APP_'))
  .reduce(
    (acc, key) => ({
      ...acc,
      [`process.env.${key}`]: JSON.stringify(rawEnv[key]),
    }),
    {}
  );

defineEnv['process.env.NODE_ENV'] = JSON.stringify(mode);
defineEnv['process.env.PUBLIC_URL'] = JSON.stringify(publicUrl);

const styleLoader = isProd ? MiniCssExtractPlugin.loader : 'style-loader';

const cssModuleOptions = {
  modules: {
    localIdentName: isProd ? '[hash:base64]' : '[path][name]__[local]',
  },
};

module.exports = {
  entry: path.join(srcDir, 'index.tsx'),
  output: {
    path: path.join(appDir, 'dist'),
    publicPath,
    assetModuleFilename: 'static/media/[name].[contenthash:8][ext]',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        include: srcDir,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.module\.css$/,
        use: [
          styleLoader,
          {
            loader: 'css-loader',
            options: cssModuleOptions,
          },
        ],
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [styleLoader, 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(publicDir, 'index.html'),
      inject: 'body',
      templateParameters: {
        PUBLIC_URL: publicUrl,
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: publicDir,
          to: '.',
          globOptions: {
            ignore: ['**/index.html'],
          },
        },
      ],
    }),
    new webpack.DefinePlugin(defineEnv),
  ],
};
