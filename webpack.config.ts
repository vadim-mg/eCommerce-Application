import { resolve as _resolve, join } from 'path';
import { merge } from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import EslintPlugin from 'eslint-webpack-plugin';

import devConfig from './webpack.dev.config';
import prodConfig from './webpack.prod.config';

enum Mode {
  prod = 'prod',
  dev = 'dev',
}

type Env = {
  mode: Mode;
};

const baseConfig = {
  entry: _resolve(__dirname, './src/index.ts'),
  mode: 'development',
  output: {
    path: _resolve(__dirname, 'dist'),
    filename: '[name].[contenthash:6].js',
    clean: true,
    assetModuleFilename: 'assets/[name].[contenthash:8][ext]',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: _resolve(__dirname, 'src/index.html'),
      filename: 'index.html',
    }),
    new EslintPlugin({ extensions: ['ts'] }),
  ],
  devServer: {
    open: false,
    host: 'localhost',
  },
  module: {
    rules: [
      {
        test: /\.(jpg|png|svg|jpeg|gif|webp)$/,
        type: 'asset/resource',
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
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
      '@Img': _resolve(__dirname, 'src/img'),
    },
    extensions: ['.ts', '.js'],
  },
};

export default (env: Env) => {
  const isProductionMode = env?.mode === Mode.prod;
  const envConfig = isProductionMode ? prodConfig : devConfig;

  return merge(baseConfig, envConfig);
};
