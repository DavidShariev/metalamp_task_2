const path = require('path') //модуль для путей
const HTMLwebpackPlugin = require('html-webpack-plugin'); //плагин для обработки html
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); //очистка файлов старой сборки
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //лоадер для сss
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development'; //определение режима сборки

const filename = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}` //функция, назначающая ися файла в зависимости от режима

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
    plugins: [
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
                {from: path.resolve(__dirname, "src/assets/"), to: path.resolve(__dirname, "dist/assets")}
            ]
        })
    ],
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