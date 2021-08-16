const path = require('path') //модуль для путей
const HTMLwebpackPlugin = require('html-webpack-plugin'); //плагин для обработки html
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); //очистка файлов старой сборки
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //лоадер для сss

const isDev = process.env.NODE_ENV === 'development'; //определение режима сборки

const filename = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}` //функция, назначающая ися файла в зависимости от режима

module.exports = {
    mode: 'development', //режим сборки
    context: path.resolve(__dirname, 'src'), //определение контекста для путей
    entry: './index.js', //вход
    output: { //выход
        filename: `js/${filename('js')}`, //установка функции, определяющее название файла 
        path: path.resolve(__dirname, 'dist')
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
        })
    ],
    module: { //обработка модулей
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            }
        ]
    }
}