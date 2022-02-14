const HtmlWebpackPlugin = require('html-webpack-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: {
    emdx: [__dirname + '/src/index'],
  },
  output: {
    filename: '[name].js',
    publicPath: '/',
  },
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: ['.js', '.json'],
  },
  devServer: {
    contentBase: __dirname + '/src/static',
    historyApiFallback: true,
    inline: true,
    stats: 'errors-only',
    port: 3223,
    host: '0.0.0.0',
    proxy: {
      '/api/**': {
        target: 'http://localhost:' + 3222,
        secure: false,
        changeOrigin: true,
      },
      '/socket.io/**': {
        target: 'ws://localhost:' + 3222,
        ws: true,
        secure: false,
        changeOrigin: true,
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: __dirname + '/src',
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: { browsers: ['last 2 versions', '> 1%'] },
                  loose: true,
                  modules: false,
                  useBuiltIns: 'usage',
                  corejs: 3,
                },
              ],
              '@babel/preset-react',
            ],
            plugins: ['@babel/plugin-syntax-dynamic-import', ['@babel/plugin-proposal-decorators', { legacy: true }], ['@babel/plugin-proposal-class-properties', { loose: false }], 'react-hot-loader/babel'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      template: 'src/static/index.html',
      filename: 'index.html',
      chunks: ['emdx'],
    }),
  ],
}
