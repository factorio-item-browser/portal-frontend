const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const dotenv = require("dotenv");
const HtmlWebpackExcludeAssetsPlugin = require("html-webpack-exclude-assets-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const { DefinePlugin, HotModuleReplacementPlugin } = require("webpack");

module.exports = (env, argv) => {
    const currentPath = path.join(__dirname);
    const isProduction = argv.mode === "production";
    const entryPoints = {
        main: `${currentPath}/src/index.jsx`,
        images: `${currentPath}/src/style/partial/images.scss`,
    };

    const envFilePath = isProduction ? `${currentPath}/.env` : `${currentPath}/.env.development`;
    const envFile = dotenv.config({ path: envFilePath }).parsed;
    const envVars = {};
    for (const [name, value] of Object.entries(envFile)) {
        envVars[`process.env.${name}`] = JSON.stringify(value);
    }

    return {
        entry: isProduction ? entryPoints : [entryPoints.main, entryPoints.images],
        output: {
            path: `${currentPath}/build`,
            publicPath: isProduction ? "./" : "/",
            filename: isProduction ? "asset/js/[name].[hash].js" : "asset/js/[name].js",
        },
        resolve: {
            extensions: [".jpg", ".js", ".json", ".jsx", ".png", ".scss"]
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    use: [
                        "babel-loader",
                    ],
                },
                {
                    test: /\.scss/,
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
                                esModule: false,
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
        plugins: [
            new HotModuleReplacementPlugin(),
            new CleanWebpackPlugin(),
            new CopyPlugin([
                { from: `${currentPath}/src/root/.htaccess` }
            ]),
            new DefinePlugin(envVars),
            new HtmlWebpackPlugin({
                template: `${currentPath}/src/index.ejs`,
                excludeAssets: [/images\.(.*)\.js$/],
            }),
            new HtmlWebpackExcludeAssetsPlugin(),
            new MiniCssExtractPlugin({
                filename: isProduction ? "asset/css/[name].[hash].css" : "asset/css/[name].css",
            }),
        ],
        devServer: {
            contentBase: "./build",
            host: "0.0.0.0",
            hot: true,
            historyApiFallback: true
        },
        devtool: "source-map",
    }
};
