import { resolve } from 'path';

const config = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: resolve(__dirname, './dist'),
  },
};

export default config;
