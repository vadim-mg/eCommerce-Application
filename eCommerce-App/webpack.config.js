const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const EslintPlugin = require('eslint-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, "./src/index.ts"),
    output: {
        path: path.resolve(__dirname, "dist"),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "src/index.html"),
      	    filename: "index.html",
        }),
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
              {
                from: path.resolve(__dirname, "src/img"),
                to: path.resolve(__dirname, "dist/img"),
              },
            ],
        }),
        new EslintPlugin({ extensions: ['ts'] }),
    ],
    devServer: {
        open: true,
        host: "localhost",
    },
    module: {
        rules: [
            {
                test: /\.(jpg|png|svg|jpeg|gif)$/,
                type: 'asset/resource',
            },
            {
                test: /\.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.ts$/i,
                use: "ts-loader",
            },
        ],
    },
    resolve: {
        alias: {
            img: path.join(__dirname, "src", "img"),
        },
        extensions: ['.ts', '.js']
    },
};
