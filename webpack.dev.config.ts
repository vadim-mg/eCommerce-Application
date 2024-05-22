import { resolve } from 'path';

const config = {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    open: false,
    host: 'localhost',
    static: resolve(__dirname, './dist'),
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: '/index.html' },
        { from: /./, to: '/index.html' },
      ],
    },
  },
};

export default config;
