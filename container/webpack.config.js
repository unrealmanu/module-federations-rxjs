
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
const deps = require('./package.json').dependencies
const babelOptions = require('./.babelrc.json')

const dist = path.join(__dirname, 'dist')

const port = 3002;

module.exports = {
    entry: './src/index.tsx',
    mode: 'development',
    devtool: "source-map",
    devServer: {
        contentBase: dist,
        port: port,
        historyApiFallback: true,
        liveReload: true
    },
    output: {
        path: dist,
        publicPath: "auto",
    },
    watchOptions: {
        aggregateTimeout: 200,
        poll: 1000,
        ignored: ["node_modules/**"],
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions
                }
            },
            {
                test: /\.s[ac]ss$/i,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('node-sass')
                        }
                    }
                ]
            },
            {
                test: /\.(jpe?g|webp|png|svg)$/i,
                loader: 'file-loader',
                options: {
                    outputPath: 'images'
                }
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new ModuleFederationPlugin({
            name: "sharing",
            filename: "Block.js",
            exposes: {
                "./Block": "./src/app/components/Block",
            },
            /*
            shared: {
                ...deps,
                react: {
                    eager: true,
                },
            }*/
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: './public/index.html'
        })
    ]
}