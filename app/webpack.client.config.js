var path              = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack           = require('webpack');
var I18nPlugin        = require('i18n-webpack-plugin');
var ISPRODUCTION = process.env.NODE_ENV === 'production';
var languages = {
  en: null,
  'zh-cn': require('./locale/zh-cn'),
  'zh-tw': require('./locale/zh-tw')
};

module.exports =  Object.keys(languages).map(function(language) {
  var devtool = 'source-map';
  var plugins = [
    new ExtractTextPlugin('[name].css'),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({ 'global.GENTLY': false }),
    new I18nPlugin(languages[language])
  ];

  if (ISPRODUCTION) {
    devtool = null;
    plugins = plugins.concat([
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.DedupePlugin()
    ]);
  } else {
    plugins = plugins.concat(new webpack.HotModuleReplacementPlugin());
  }

  var config = {
    name: language,
    entry: path.join(__dirname, '/lib/app.jsx'),
    output: {
      publicPath: 'http://127.0.0.1:8081/build/',
      path: path.join(__dirname, '/build/'),
      filename: language + '.app.js'
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loaders: ['react-hot', 'babel-loader?stage=0']
        },
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
        },
        { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url?limit=10000&minetype=application/font-woff&name=[name].[ext]' },
        { test: /\.(ttf|eot|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url?limit=10000&minetype=application/font-woff&name=[name].[ext]' },
        { test: /\.svg\?v=[0-9]\.[0-9]\.[0-9]$/, loader: 'url?limit=10000&minetype=application/font-woff&name=[name].[ext]' },
        { test: /\.(svg|png|jpg|jpeg)$/, loaders: ['url?limit=10000&name=[name].[ext]'] },
        { test: /\.json$/, loaders: ['json'] }
      ]
    },
    plugins: plugins,
    devtool: devtool,
    node: {
      __dirname: true
    }
  };

  if (ISPRODUCTION) {
    config.output.publicPath = '/build/'
    return config;
  } else {
    return config;
  }
});

module.exports.output = {
  publicPath: 'http://127.0.0.1:8081/build/'
};

module.exports.devServer = {};
