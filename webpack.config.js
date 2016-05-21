var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var CODE = __dirname;
var React = require('react');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');

module.exports = {

  devtool: 'source-map',

  entry: './src/app.js',

  output: {
    path: 'build',
    filename: 'bundle.js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/build/'
  },

  module: {
    loaders: [
      { test: /\.json$/, loader: 'json-loader' },
      { 
        test: /\.(js|jsx)$/, 
        loader: 'babel-loader',
        exclude: [nodeModulesPath],
        query: {
          presets: ['react']
        }
      }
    ]
  }

};
