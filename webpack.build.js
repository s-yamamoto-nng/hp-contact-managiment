const webpack = require('webpack')
const webpackConfig = require('./webpack.config.js')
const CopyWebpackPlugin = require('copy-webpack-plugin')
// const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const htmlMinifierOptions = {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  minifyCSS: true,
}

const entries = [
  {
    name: 'js/bundle',
    path: __dirname + '/src/index',
    html: 'index.html',
    output: __dirname + '/www/public',
  },
]

module.exports = entries.map(entry => ({
  mode: 'production',
  entry: {
    [entry.name]: [entry.path],
  },
  output: {
    path: entry.output,
    filename: '[name].[chunkhash:8].js',
  },
  resolve: webpackConfig.resolve,
  module: webpackConfig.module,
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          compress: {
            drop_debugger: true,
            drop_console: true,
          },
          warnings: false,
        },
      }),
    ],
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: entry.name + '.vendor',
          chunks: 'all',
        },
      },
    },
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new CopyWebpackPlugin([{ from: 'src/static', ignore: [entry.html] }]),
    new HtmlWebpackPlugin({
      template: 'src/static/' + entry.html,
      filename: entry.html,
      minify: htmlMinifierOptions,
    }),
  ],
}))
