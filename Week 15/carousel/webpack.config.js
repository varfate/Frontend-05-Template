const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './animation-demo.js',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              [
                '@babel/plugin-transform-react-jsx',
                { pragma: 'createElement' },
              ],
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  mode: 'development',
  devServer: {
    contentBase: './dist',
    compress: false,
    port: 9000,
    hot: true,
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './animation.html',
    }),
  ],
};
