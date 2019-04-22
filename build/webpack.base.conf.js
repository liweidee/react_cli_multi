const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const htmlWebpackPlugin = require('html-webpack-plugin'); // html模板
const copyWebpackPlugin = require('copy-webpack-plugin'); // 静态资源输出
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const rules = require('./webpack.rules.conf.js');
const createHappyPlugin = require('../config/happypack');
const config = require('../config/config');

const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
const files = fs.readdirSync(path.resolve(__dirname, '../dll'));

// 设置html-webpack-plugin参数相关方法
let getHtmlConfig = (name, dirname, chunks) => {
    return {
        // title: title,
        filename: `${dirname}/${name}.html`,
        template: `src/pages/${dirname}/${name}.ejs`,
        inject: true,
        // favicon: './favicon.ico',
        hash: false,
        meta: {
            viewport: 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1'
        },
        chunks: chunks,
        // excludeChunks: ['manifest'],
        chunkSortMode: 'dependency', // 按照文件的依赖关系排序
        minify: process.env.NODE_ENV === 'development' ? false : {
            // removeComments: true, // 去除注释
            // collapseWhitespace: true // 去除空格
        }
    };
};

let baseConfig = {
    stats: {
        colors: true,
        chunks: false,
        children: false,
        entrypoints: false,
        modules: false
    },
    entry: config.entriesPage,
    // 模块引用配置
    resolve: {
        extensions: ['.js', '.jsx', '.vue', '.json'], // 定义模块查找的后缀
        modules: [
            'node_modules',
            config.resolvePath('lib')
        ],
        alias: { // 定义引用路径别名
            'vue$': 'vue/dist/vue.esm.js',
            '@': config.resolvePath('src'),
            'src': config.resolvePath('src')
        }
    },
    // 模块加载配置
    module: {
        noParse: /jquery|lodash/, // 忽略未采用模块化的文件
        rules: [...rules]
    },
    // 将外部变量或者模块加载进来
    externals: {
        // 'jquery': 'window.jQuery'
    },
    plugins: [
        createHappyPlugin('happy-babel', [{
            loader: 'babel-loader',
            options: {
                babelrc: true,
                cacheDirectory: true // 启用缓存
            }
        }]),
        // 全局暴露统一入口
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
        }),
        //静态资源输出
        new copyWebpackPlugin(config.existStatic ? [{
            from: config.resolvePath('static'),
            to: './assets',
            ignore: ['.*']
        }] : []),
        // 解决webpack4版本 无法找到eslint-loader试图访问this.options被删除的内容
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
            options: {
                context: __dirname
            }
        }),
        new ProgressBarPlugin()
    ]
};

//自动生成html模板
config.htmlPages.forEach(function(element) {
    baseConfig.plugins.push(new htmlWebpackPlugin(getHtmlConfig(element.filename, element.filedir, element.chunks)));
});

files.forEach(file => {
    if(/.*\.dll.js/.test(file)) {
        baseConfig.plugins.push(new AddAssetHtmlWebpackPlugin({ // 将打包好的dll文件挂载到html中
            filepath: path.resolve(__dirname, '../dll', file),
            publicPath: '../'
        }));
    }
    if(/.*\.manifest.json/.test(file)) {
        baseConfig.plugins.push(new webpack.DllReferencePlugin({ // 分析第三方模块是否已经在dll文件里，如果里面有就不用再node_modules在分析打包了
            manifest: path.resolve(__dirname, '../dll', file)
        }));
    }
});

module.exports = baseConfig;