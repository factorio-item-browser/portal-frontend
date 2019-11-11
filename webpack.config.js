const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { HotModuleReplacementPlugin } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
    resolve: {
        extensions: ["*", ".css", ".js", ".jsx", ".scss"],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ["babel-loader"],
            },
            {
                test: /\.(scss|css)/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // publicPath: "../",
                            hmr: process.env.NODE_ENV === "development",
                        },
                    },
                    "css-loader",
                    "sass-loader",
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
