const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { DefinePlugin, HotModuleReplacementPlugin } = require("webpack");
const HtmlWebpackExcludeAssetsPlugin = require("html-webpack-exclude-assets-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const dotenv = require("dotenv");
const path = require("path");

module.exports = (env, argv) => {
    const currentPath = path.join(__dirname);
    const isProduction = argv.mode === "production";
    const entryPoints = {
        main: `${currentPath}/src/index.jsx`,
        images: `${currentPath}/src/style/partial/images.scss`,
    };

    const envFile = dotenv.config({ path: isProduction ? `${currentPath}/.env` : `${currentPath}/.env.development`}).parsed;
    const envVars = {};
    Object.keys(envFile).forEach((name) => {
        envVars[`process.env.${name}`] = JSON.stringify(envFile[name]);
    });

    return {
        entry: isProduction ? entryPoints : [entryPoints.main, entryPoints.images],
        plugins: [
            new HotModuleReplacementPlugin(),
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: isProduction ? "asset/css/[name].[hash].css" : "asset/css/[name].css",
            }),
            new HtmlWebpackPlugin({
                title: "Factorio Item Browser",
                template: `${currentPath}/src/index.html`,
                excludeAssets: [/images\.(.*)\.js$/],
            }),
            new HtmlWebpackExcludeAssetsPlugin(),
            new DefinePlugin(envVars),
        ],
        resolve: {
            extensions: [".jpg", ".js", ".json", ".jsx", ".png", ".scss"]
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: "babel-loader"
                        },
                    ],
                },
                {
                    test: /\.(scss|css)/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                hmr: !isProduction,
                            },
                        },
                        "css-loader",
                        "sass-loader",
                    ],
                },
                {
                    test: /inline\/.*\.(png|svg|jpg|gif)$/,
                    use: [
                        "url-loader",
                        {
                            loader: "image-webpack-loader",
                            options: {
                                disable: !isProduction,
                            },
                        },
                    ],
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    exclude: /inline/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: "asset/image/[name].[hash].[ext]",
                            },
                        },
                        {
                            loader: "image-webpack-loader",
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
            publicPath: isProduction ? "./" : "/",
            filename: isProduction ? "asset/js/[name].[hash].js" : "asset/js/[name].js",
        },
        devServer: {
            contentBase: "./build",
            host: "0.0.0.0",
            hot: true,
            historyApiFallback: true
        },
        devtool: "source-map",
    }
};
