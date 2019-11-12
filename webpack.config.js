const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { HotModuleReplacementPlugin } = require("webpack");
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
    const isProduction = argv.mode === "production";
    const entryPoints = {
        main: "./src/index.jsx",
        images: "./src/style/partial/images.scss",
    };

    return {
        entry: isProduction ? entryPoints : [entryPoints.main, entryPoints.images],
        plugins: [
            new HotModuleReplacementPlugin(),
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: "[name].css",
            }),
            new HtmlWebpackPlugin({
                title: "Hello Webpack bundled JavaScript Project",
                template: "./src/index.html",
                excludeAssets: [/images.js/],
            }),
            new HtmlWebpackExcludeAssetsPlugin(),
        ],
        resolve: {
            extensions: ['.jpg', '.js', '.jsx', '.png', '.scss']
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
            filename: "[name].js",
        },
        devServer: {
            contentBase: "./build",
            hot: true,
        },
        devtool: "source-map",
    }
};
