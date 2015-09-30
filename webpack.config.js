var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var CODE = __dirname;
var React = require('react');

module.exports = {

  devtool: 'eval',

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
      { test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  }

};
