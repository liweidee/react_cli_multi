const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    stats: {
        colors: true,
        chunks: false,
        children: false,
        entrypoints: false,
        modules: false
    },
    entry: {
        react: ['react', 'react-dom'],
        jquery: ['jquery']
    },
    output: {
        filename: '[name].dll.js',
        path: path.resolve(__dirname, '../dll'),
        library: '[name]' // 打包生成的库名，通过全局变量的形式暴露到全局
    },
    plugins: [
        new webpack.DllPlugin({ // 对暴露到全局的代码进行分析，生成vendors.manifest.json 的映射文件
            name: '[name]',
            path: path.resolve(__dirname, '../dll/[name].manifest.json')
        })
    ]
};