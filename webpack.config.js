
const { dirname } = require('path');
const path = require('path');
const webpack = require('webpack');
const { ModuleFilenameHelpers } = require('webpack');
const HTMLwebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const mode = process.env.NODE_ENV
console.log(mode);

dist = {
    'dist': path.join(__dirname, 'dist/'),
    'pages': path.join(__dirname, 'dist/pages/'),
    'scripts': path.join(__dirname, 'dist/scritps/'),
    'assets': path.join(__dirname, 'dist/assets/'),
}
src = {
    'src': path.join(__dirname, 'src/'),
    'pages': path.join(__dirname, 'src/pug/'),
    'scripts': path.join(__dirname, 'src/scripts/'),
    'styles': path.join(__dirname, 'src/styles/'),
    'assets': path.join(__dirname, 'src/assets/')
}

module.exports = {
    experiments: {
        asset: true
    },
    context: src.src,
    mode: mode,
    devtool: mode === 'development' ? false : "source-map",
    entry: {
        main: ['./scripts/main.js'],
        pageOne: ['./scripts/page_one/page_one.js'],
        pageTwo: ['./scripts/page_two/page_two.js'],
    },
    output: {
        clean: true,
        filename: mode === 'development' ? 'scripts/[name].js' : 'scripts/[name].[contenthash].js',
        path: dist.dist,
        publicPath: dist.dist,
        assetModuleFilename: '[path][name][ext]'
    },
    module: {
        rules: [
            {
                test: /\.(html)$/,
                use: ['html-loader']
            },
            {
                test: /\.m?js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader"
                ],
            },
            {
                test: /\.pug$/i,
                use: ['pug-loader']
            },
            {
                test: /\.(jpg|png|svg|ttf|woff|eot)$/,
                type: 'asset',
            },
        ],
    },
    plugins: [
        new HTMLwebpackPlugin({
            template: src.pages + 'index.pug',
            filename: 'index.html',
            minify: !(mode === "development"),
            title: "index",
            chunks: ['main']
        }),
        new HTMLwebpackPlugin({
            template: src.pages + 'page_one.pug',
            filename: 'pages/page_one.html',
            minify: !(mode === "development"),
            chunks: ['main', 'pageOne']
        }),
        new HTMLwebpackPlugin({
            template: src.pages + 'page_two.pug',
            filename: 'pages/page_two.html',
            minify: !(mode === "development"),
            chunks: ['main', 'pageTwo']
        }),
        new webpack.ProvidePlugin({
            '$': 'jquery',
        })
    ],
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            extractComments: false,
        })],
    },
}