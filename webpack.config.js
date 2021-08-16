const path = require('path')

module.exports = {
    mode: 'development',                                 //режим сборки
    entry: path.resolve(__dirname, './src/index.js'),    //вход
    output: {                                            //выход
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist')
    }
}