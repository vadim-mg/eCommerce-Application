import Dotenv from 'dotenv-webpack';
import EslintPlugin from 'eslint-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { resolve as _resolve } from 'path';
import { merge } from 'webpack-merge';

import devConfig from './webpack.dev.config';
import prodConfig from './webpack.prod.config';

enum Mode {
  prod = 'prod',
  dev = 'dev',
}

type Env = {
  mode: Mode;
};

const baseConfig = (isProd: boolean) => ({
  entry: _resolve(__dirname, 'src', 'index.ts'),
  mode: 'development',
  output: {
    path: _resolve(__dirname, 'dist'),
    filename: '[name].[contenthash:6].js',
    clean: true,
    assetModuleFilename: 'assets/[name].[contenthash:8][ext]',
  },
  devtool: isProd ? 'source-map' : 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: _resolve(__dirname, 'src', 'index.html'),
      filename: 'index.html',
      favicon: _resolve(__dirname, './src/assets/icons/favicon.svg'),
    }),
    new EslintPlugin({ extensions: ['ts'] }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:6].css',
      chunkFilename: '[id].[contenthash:6].css',
    }),
    new Dotenv(),
  ],
  module: {
    rules: [
      {
        test: /\.(jpg|png|svg|jpeg|gif|webp)$/,
        type: 'asset/resource',
      },
      {
        test: /\.module\.s?css$/i,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: isProd
                  ? '[hash:base64:5]'
                  : '[path][name]__[local]--[hash:base64:5]',
              },
              esModule: false,
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.ts$/i,
        use: 'ts-loader',
        exclude: '/node_modules/',
      },
    ],
  },
  resolve: {
    alias: {
      '@Src': _resolve(__dirname, 'src'),
      '@Assets': _resolve(__dirname, 'src', 'assets'),
      '@Img': _resolve(__dirname, 'src', 'assets', 'img'),
    },
    extensions: ['.ts', '.js'],
  },
});

export default (env: Env) => {
  const isProductionMode = env?.mode === Mode.prod;
  const envConfig = isProductionMode ? prodConfig : devConfig;

  return merge(baseConfig(isProductionMode), envConfig);
};
