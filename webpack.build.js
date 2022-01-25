const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin') // eslint-disable-line import/no-extraneous-dependencies
const TerserPlugin = require('terser-webpack-plugin')
const webpackConfig = require('./webpack.config.js')

const htmlMinifierOptions = {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  minifyCSS: true
}

const entries = [{ name: 'js/bundle', path: `${__dirname}/src/index`, html: 'index.html' }]

module.exports = entries.map((entry) => ({
  mode: 'production',
  entry: {
    [entry.name]: [entry.path]
  },
  output: {
    path: `${__dirname}/www/public`,
    filename: '[name].[hash:8].js',
    sourceMapFilename: '[name].[hash:8].map',
    chunkFilename: '[id].[hash:8].js'
  },
  resolve: webpackConfig.resolve,
  module: webpackConfig.module,
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true
          },
          output: {
            comments: false,
            beautify: false
          }
        }
      })
    ],
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: `${entry.name}.vendor`,
          chunks: 'all'
        }
      }
    }
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    }),
    new HtmlWebpackPlugin({
      template: `src/static/${entry.html}`,
      filename: entry.html,
      minify: htmlMinifierOptions
    })
  ]
}))
