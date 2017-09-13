var HTMLWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: "./index.html",
  filename: './index.html',
  inject: 'body'
});

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.ts$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        exclude: '/node_modules/',
        options: {
          configFile: 'tslint.json',
          tsConfigFile: 'tsconfig.json'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.tsx','.ts', '.js']
  },
  plugins: [HTMLWebpackPluginConfig]

};
