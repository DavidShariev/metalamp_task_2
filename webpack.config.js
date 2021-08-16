const path = require('path') //модуль для путей
const HTMLwebpackPlugin = require('html-webpack-plugin'); //плагин для обработки html
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); //очистка файлов старой сборки
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //лоадер для сss
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ImageminPlugin = require("imagemin-webpack");
const imageminGifsicle = require("imagemin-gifsicle");

const isDev = process.env.NODE_ENV === 'development'; //определение режима сборки

const filename = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}` //функция, назначающая ися файла в зависимости от режима

const optimization = () => {
    const configObj = {
        splitChunks: {
            chunks: 'all'
        }
    };

    if(!isDev){
        configObj.minimizer = [
            new OptimizeCssAssetsPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return configObj;
}

const plugins = () => {
    const basePlugins = [
        new HTMLwebpackPlugin({ //обработка html
            template: path.resolve(__dirname, 'src/index.html'),
            filename: 'index.html',
            minify: {
                collapseWhitespace: !isDev
            }
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({ //обработка css файлов
            filename: `./styles/${filename('css')}`
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: path.resolve(__dirname, "src/assets/"), to: path.resolve(__dirname, "dist/assets") }
            ]
        })
    ];

    if(!isDev){
        basePlugins.push(
            new ImageminPlugin({
                bail: false, // Ignore errors on corrupted images
                cache: true,
                imageminOptions: {
                    // Before using imagemin plugins make sure you have added them in `package.json` (`devDependencies`) and installed them

                    // Lossless optimization with custom option
                    // Feel free to experiment with options for better result for you
                    plugins: [
                        ["gifsicle", { interlaced: true }],
                        ["jpegtran", { progressive: true }],
                        ["optipng", { optimizationLevel: 5 }],
                        [
                            "svgo",
                            {
                                plugins: [
                                    {
                                        removeViewBox: false
                                    }
                                ]
                            }
                        ]
                    ]
                }
            })
        )
    }

    return basePlugins;
}

module.exports = {
    mode: 'development', //режим сборки
    context: path.resolve(__dirname, 'src'), //определение контекста для путей
    entry: './index.js', //вход
    output: { //выход
        filename: `js/${filename('js')}`, //установка функции, определяющее название файла 
        path: path.resolve(__dirname, 'dist'),
        publicPath: ''
    },
    devServer: { //настройки webpack-dev-server
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, 'dist'),
        open: true, //автоматическое открытие вкладки
        compress: true,
        hot: true, //перезагрузка сервера при изменение в модулях
        port: 3000
    },
    optimization: optimization(),
    devtool: !isDev ? false : "source-map",
    plugins: plugins(),
    module: { //обработка модулей
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader'
            },
            {
                test: /\.css$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,    
                    }, 'css-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: (resourcePath, context) => {
                            return path.relative(path.dirname(resourcePath), context) + "/";
                        },
                    }
                },
                'css-loader',
                'sass-loader'],
            },
            {
                test: /\.(?:|fig|png|jpg|jpeg|svg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: `./img/${filename('[ext]')}`
                    }
                }]
            },
            {
                test: /\.(?:|woff2|woff|ttf|eot|svg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: `./fonts/${filename('[ext]')}`
                    }
                }]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    }
}