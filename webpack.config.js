const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin') // eslint-disable-line import/no-extraneous-dependencies

module.exports = {
  mode: 'development',
  entry: {
    'js/bundle': ['@babel/polyfill', `${__dirname}/src/index`],
  },
  output: {
    publicPath: '/',
    filename: '[name].js',
  },
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: ['.js', '.jsx', '.json'],
  },
  devServer: {
    static: {
      directory: `${__dirname}/src/static`,
    },
    historyApiFallback: true,
    hot: true,
    port: 3223,
    host: '0.0.0.0',
    proxy: {
      '/api/**': {
        target: 'http://localhost:3222',
        secure: false,
        changeOrigin: true,
      },
      '/socket.io/**': {
        target: 'ws://localhost:3222',
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
        include: `${__dirname}/src`,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/static/index.html',
      filename: 'index.html',
      chunks: ['js/bundle'],
    }),
  ],
}
