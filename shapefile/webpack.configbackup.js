const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ClosureCompilerPlugin = require("closure-webpack-plugin");

const ROOT = path.resolve(__dirname);
const SRC_DIR = path.resolve(__dirname, 'src');
const DESTINATION = path.resolve(__dirname, 'dist');

const mode = 'development'; // process.env.NODE_ENV;
const dev = (mode !== 'production');
const USE_GCC = true;
const MINIMIZE = !dev;

module.exports = {
  context: ROOT,
  mode,

  entry: {
    'background': './src/background.ts',
    'search': './src/search.tsx',
  },

  output: {
    filename: '[name].js',
    path: DESTINATION,
  },

  resolve: {
    alias: {
      "react": path.resolve(__dirname, 'node_modules/preact/compat'),
      "react-dom": path.resolve(__dirname, 'node_modules/preact/compat'),
    },
    extensions: ['.tsx', '.ts', '.js'],
    modules: [
      SRC_DIR,
      'node_modules'
    ]
  },

  module: {
    rules: [{
      test: /\.tsx?$/,
      use: (!dev && USE_GCC) ? {
        loader: '@monet/tsickle-loader',
        options: {
          externDir: path.resolve(__dirname, 'tmp'),
          skipTsickleProcessing: [
            'typescript/lib/',
            '/webextension-polyfill/',
            '@types/node/',
            '/jest',
            'pretty-format/',
            '/har-format/',
            '/filewriter/',
            '/filesystem/',
          ],
        }
      } : 'ts-loader',
    },
    {
      test: /\.scss$/,
      use: [
        'style-loader', {
          loader: 'css-loader',
          options: {
            modules: {
              localIdentName: dev ? '[name]__[local]--[hash:base64:5]' : '[hash:base64]',
            }
          }
        },
        "sass-loader",
      ]
    },
    {
      test: /\.svg$/,
      use: ['babel-loader', path.resolve(__dirname, 'tools/svg-jsx-loader.js')],
    },
    ]
  },

  devtool: dev && 'inline-source-map',
};