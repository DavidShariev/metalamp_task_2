const path = require('path') //модуль для путей

const isDev = process.env.NODE_ENV === 'development'; //определение режима сборки

const filename = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}` //функция, назначающая ися файла в зависимости от режима

module.exports = {
    mode: 'development', //режим сборки
    context: path.resolve(__dirname, 'src'), //определение контекста для путей
    entry: './index.js', //вход
    output: { //выход
        filename: `js/${filename('js')}`, //установка функции, определяющее название файла 
        path: path.resolve(__dirname, 'dist')
    }
}