// require("babel-polyfill"); // moved to index.jsx

// can't use ES6 here
const webpack = require("webpack");
const dotenvWebpack = require("dotenv-webpack");
const path = require("path");

module.exports = {
  entry : {
    adminArea :
      // ['babel-polyfill', './adminSettingsArea/src/index.jsx']
      ['./adminSettingsArea/src/index.jsx']
  },
  output : {
    filename : 'shared/[name].bundle.js',
    path : path.resolve(__dirname, ''),
    publicPath : "/",
    devtoolModuleFilenameTemplate : info =>
      'file://' + path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
  },
  devtool: 'inline-source-map',
  devServer : {
    contentBase : './adminSettingsArea/src',
    hot : true,
    historyApiFallback : true
  },
  plugins : [
    new webpack.HotModuleReplacementPlugin(),
    new dotenvWebpack()
  ],
  node: { // this is for dotenv to work without errors
    fs: "empty"
  },
  module : {
    rules : [
      {
        test : /\.(js|jsx)$/,
        exclude : [/node_modules/, /vendor/],
        use : {
          loader : "babel-loader",
          options : {
            presets : [
              '@babel/preset-env',
              "@babel/preset-react"
            ]
          },
        }
      }, {
        test : /\.css$/i,
        use : ['style-loader', 'css-loader'],
      }
    ],
  },
};