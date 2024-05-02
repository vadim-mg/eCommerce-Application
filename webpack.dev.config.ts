import { resolve } from 'path';

const config = {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    static: resolve(__dirname, './dist'),
  },
};

export default config;
