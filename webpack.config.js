const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { HotModuleReplacementPlugin } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
    entry: "./src/index.js",
    plugins: [
        new HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),
        new HtmlWebpackPlugin({
            title: "Hello Webpack bundled JavaScript Project",
            template: "./src/index.html",
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ["babel-loader"],
            },
            {
                test: /\.(scss|css)/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // publicPath: "../",
                            hmr: !isProduction,
                        },
                    },
                    "css-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    "url-loader",
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            disable: !isProduction,
                        },
                    },
                ],
            },
        ],
    },
    output: {
        path: __dirname + "/build",
        publicPath: "/",
        filename: "main.js",
    },
    devServer: {
        contentBase: "./build",
        hot: true,
    },
    devtool: "source-map",
};
