const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const rules = [{
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        enforce: 'pre',
        include: [
            path.resolve(__dirname, '../src')
        ]
    }, {
        test: /\.(js|jsx)$/,
        // use: ['babel-loader'],
        use: ['happypack/loader?id=happy-babel'],
        exclude: /node_modules/
    }, {
        test: /\.(css|scss|sass)$/,
        use: process.env.NODE_ENV === 'development' ? [
            'style-loader',
            'css-loader',
            'postcss-loader',
            'sass-loader',
        ] : [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
    }, {
        test: /\.less$/,
        use: process.env.NODE_ENV === 'development' ? [
            'style-loader',
            'css-loader',
            'less-loader'
            ] : [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader']
    }, {
        test: /\.(png|jpg|gif)$/i,
        use: [{
            loader: 'url-loader',
            options: {
                name: 'assets/img/[name].[hash:7].[ext]',
                limit: 5 * 1024,
                publicPath: '../'
            }
        }]
    }, {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
            name: 'assets/fonts/[name].[hash:7].[ext]',
            limit: 10000,
            publicPath: ''
        }
    }, {
        test: /\.html$/,
        // 处理html中的img标签
        use: ['html-withimg-loader?min=false']
    }, {
        test: /empty\.ejs/,
        use: [{
            loader: 'ejs-compiled-loader'
        }]
    }
];
module.exports = rules;