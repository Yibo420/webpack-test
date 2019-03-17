const path = require('path');
const DefinePlugin = require('webpack/lib/DefinePlugin')
const { WebPlugin } = require('web-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
module.exports = {
    mode: 'development',
    // JS执行入口文件
    entry: './main',
    output: {
        // 将所有依赖的模块合并输出到bundle.js文件
        filename: '[name]_[chunkhash:8].js',
        // 将输出文件都放倒dist目录下
        path: path.resolve(__dirname, './dist'),
    },
    resolve: {
      // 先尝试TS后缀的TS源码文件
      extensions: ['.ts', '.js', 'vue']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader']
            },
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    // 让tsc将vue文件当成一个TS模块去处理，以解决module not found的问题，tsc本身不会处理.vue结尾的文件
                    appendTsSuffixTo: [/\.vue$/],
                }
            },
            {
                test: /\.vue$/,
                loader: ['vue-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
             // 用正则表达式去匹配要用该loader转换的css文件
             test: /\.css$/,
             use: ExtractTextPlugin.extract({
                 fallback: "style-loader",
                 use:['css-loader','postcss-loader']
             })
            }
            ]
    },
    plugins: [
        // 一个webplugin对应一个html文件
        new WebPlugin({
            template: './template.html', // html模板文件所在的文件路径
            filename: 'index.html' // 输出的html文件名称
        }),
        new ExtractTextPlugin({
            // 从.js文件中提取出来的.css文件的名称
            filename: `[name]_[hash:8].css`,
        }),
        new DefinePlugin({
            // 定义NODE_ENV环境变量为production，以去除源码中只有开发时才需要的部分
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        // 压缩输出的JS代码
        new VueLoaderPlugin()
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    },
    devtool: 'source-map'
}