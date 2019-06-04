const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const cleanWebpackPlugin = require('clean-webpack-plugin'); // 清除目录等
// webpack4.x 移除了webpack.optimize.UglifyJsPlugin
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const webpackConfigBase = require('./webpack.base.conf');

const pages = Object.keys(require('../config/config').entriesPage);

const webpackConfigProd = {
    mode: 'production', // 通过 mode 声明生产环境
    output: {
        path: path.resolve(__dirname, '../dist'),
        // 打包多出口文件
        filename: '[name].[chunkhash:7].js',
        publicPath: ''
    },
    // webpack4.x移除了commonChunksPulgin插件，放在了config.optimization里面
    optimization: {
        // namedChunks: true, // webpack4.x之前通过NamedChunksPlugin插件，使用chunkName来替换chunkId，实现固化chunkId，保持缓存的能力
        moduleIds: 'hashed', // webpack4.x之前通过HashedModuleIdsPlugin插件，将模块路径映射成hash值替代moduleId，模块路径基本不变故而hash值也基本不变
        minimizer: [
            // new ParallelUglifyPlugin({ // 多进程压缩
            //     cacheDir: '.cache/',
            //     uglifyJS: {
            //         output: {
            //             comments: false,
            //             beautify: false
            //         },
            //         compress: {
            //             warnings: false,
            //             drop_console: true,
            //             collapse_vars: true,
            //             reduce_vars: true
            //         }
            //     }
            // }),
            new UglifyJSPlugin({
                cache: true,
                parallel: true,
                uglifyOptions: {
                    ie8: true,
                    compress: {
                        warnings: false,
                        drop_debugger: true,
                        drop_console: true
                    }
                }
            }),
            // 插件内部用的是cssnano做的优化，默认开启 会覆盖掉autoprefixer
            new OptimizeCSSPlugin({
                cssProcessorOptions: {
                    safe: true,
                    autoprefixer: false
                }
            })
        ],
        splitChunks: {
            maxInitialRequests: 5, // default 3
            cacheGroups: {
                // cacheGroups 会继承和覆盖splitChunks的配置项，但是test、priorty和reuseExistingChunk只能用于配置缓存组
                vendor: {
                    chunks: 'all', // default async（异步块）建议配置该选项，省略可能出问题
                    name: 'vendor',
                    minSize: 0,
                    minChunks: Math.ceil(pages.length / 3),
                    // maxInitialRequests: 5,
                    reuseExistingChunk: true // 设置是否重用该chunk
                }
            }
        },
        runtimeChunk: {
            name: 'manifest'
        }
    },
    plugins: [
        // 删除dist目录
        new cleanWebpackPlugin(['dist'], {
            root: path.resolve(__dirname, '../'), // 根目录
            verbose: false, // 开启在控制台输出信息
            dry: false
        }),
        // 分离css插件
        new MiniCssExtractPlugin({
            filename: '[name].[hash:7].css',
            chunkFilename: '[name].[contenthash:7].css'
        }),
        new ManifestPlugin({
            fileName: 'manifest.json',
            publicPath: '',
            // basePath: '',
            filter: (FileDescriptor) => {
                if (FileDescriptor && /\.(js|css|html)$/.test(FileDescriptor.name)) {
                    return FileDescriptor;
                }
            }
        }),
        new BundleAnalyzerPlugin()
    ],
    module: {
        rules: []
    },
    // recordsPath: path.join(__dirname, '../records.json')
};
module.exports = merge(webpackConfigBase, webpackConfigProd);