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
  },
  devtool: 'eval',
  devServer : {
    contentBase : './adminSettingsArea/src',
    hot : true,
    historyApiFallback : true
  },
  plugins : [
    new webpack.HotModuleReplacementPlugin(),
    new dotenvWebpack()
  ],
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
      }
    ],
  },
};