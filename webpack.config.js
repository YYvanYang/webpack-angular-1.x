'use strict';

// Modules
var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var ModernizrWebpackPlugin = require('modernizr-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
var chalk = require('chalk');

/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
var ENV = process.env.npm_lifecycle_event;
var isProd = ENV === 'build';

module.exports = function makeWebpackConfig () {
  /**
   * Config
   * Reference: http://webpack.github.io/docs/configuration.html
   * This is the object where all configuration gets set
   */
  var config = {};

  /**
   * Entry
   * Reference: http://webpack.github.io/docs/configuration.html#entry
   * Should be an empty object if it's generating a test build
   * Karma will set this when it's a test build
   */
  config.entry = {
    app: path.join(__dirname, 'src/app.module.js'),
    vendor: [
      path.join(__dirname, 'node_modules/raphael/raphael.js'),
      path.join(__dirname, 'src/js/kartograph-js/dist/kartograph.js'),
      path.join(__dirname, 'src/dep/velocity/velocity.js'),
      path.join(__dirname, 'src/dep/velocity/velocity.ui.js'),
      // path.join(__dirname, 'src/dep/jquery-mousewheel/jquery.mousewheel.js'),
      path.join(__dirname, 'src/dep/jquery.kinetic/jquery.kinetic.js'),
      path.join(__dirname, 'src/dep/angular/angular.js'),
      path.join(__dirname, 'src/dep/angular-sanitize/angular-sanitize.js'),
      path.join(__dirname, 'src/dep/angular-route/angular-route.js'),
      path.join(__dirname, 'src/dep/angular-bindonce/bindonce.js')
    ]
  };

  /**
   * Output
   * Reference: http://webpack.github.io/docs/configuration.html#output
   * Should be an empty object if it's generating a test build
   * Karma will handle setting it up for you when it's a test build
   */
  config.output = {
    // Absolute output directory
    path: __dirname + '/dist',

    // Output path from the view of the page
    // Uses webpack-dev-server in development
    publicPath: isProd ? '/' : 'http://localhost:8080/',

    // Filename for entry points
    // Only adds hash in build mode
    filename: isProd ? 'js/[name].[hash].js' : '[name].bundle.js',

    // Filename for non-entry points
    // Only adds hash in build mode
    chunkFilename: isProd ? 'js/[name].[hash].js' : '[name].bundle.js'
  };

  /**
   * Devtool
   * Reference: http://webpack.github.io/docs/configuration.html#devtool
   * Type of sourcemap to use per build type
   */
  if (isProd) {
    config.devtool = 'source-map';
  } else {
    config.devtool = 'source-map';//'eval-source-map';
  }

  /**
   * Loaders
   * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
   * List: http://webpack.github.io/docs/list-of-loaders.html
   * This handles most of the magic responsible for converting modules
   */

  // Initialize module
  config.module = {
    preLoaders: [],
    loaders: [{
      // CSS LOADER
      // Reference: https://github.com/webpack/css-loader
      // Allow loading css through js
      //
      // Reference: https://github.com/postcss/postcss-loader
      // Postprocess your css with PostCSS plugins
      test: /\.css$/,
      // Reference: https://github.com/webpack/extract-text-webpack-plugin
      // Extract css files in production builds
      //
      // Reference: https://github.com/webpack/style-loader
      // Use style-loader in development.
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap!postcss-loader')
    }, {
      // ASSET LOADER
      // Reference: https://github.com/webpack/file-loader
      // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
      // Rename the file using the asset hash
      // Pass along the updated reference to your code
      // You can add here any file extension you want to get copied to your output
      test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
      loader: 'file'
    }, {
      // HTML template LOADER
      // Reference: https://github.com/teux/ng-cache-loader
      // https://github.com/teux/ng-cache-loader/issues/20#issuecomment-226732135
      // Webpack loader to put HTML partials in the Angular's $templateCache.
      // please add include or exclude or both to fix 'window is not defined'!!!
      test: /\.html$/,
      include: [
          path.resolve(__dirname, "src/page")
      ],
      //exclude: [path.resolve(__dirname, "src/index.tpl.html")],
      loader: 'ng-cache?prefix=[dir]/[dir]'
       }]
  };

  /**
   * PostCSS
   * Reference: https://github.com/postcss/autoprefixer-core
   * Add vendor prefixes to your css
   */
  config.postcss = [
    autoprefixer({
      browsers: ['last 2 version']
    })
  ];

  /**
   * Plugins
   * Reference: http://webpack.github.io/docs/configuration.html#plugins
   * List: http://webpack.github.io/docs/list-of-plugins.html
   */
  config.plugins = [];

  // Reference: https://github.com/ampedandwired/html-webpack-plugin
  // Render index.html
  config.plugins.push(
    new HtmlWebpackPlugin({
      template: './src/index.tpl.html',
      inject: 'body',
      filename: 'index.html'
    }),

    // Reference: https://github.com/webpack/extract-text-webpack-plugin
    // Extract css files
    // Disabled when in test mode or not in build mode
    new ExtractTextPlugin('css/[name].[hash].css', {disable: !isProd}),

    new ModernizrWebpackPlugin({
      //"minify": true,
      "options": [
        "setClasses"
      ],
      filename: 'js/modernizr-bundle.js',
      minify: {
        output: {
          comments: true,
          beautify: false
        }
      },
      // https://github.com/Modernizr/Modernizr/blob/master/lib/config-all.json
      "feature-detects": [
        "test/applicationcache",
        "test/audio",
        "test/canvas",
        "test/canvastext",
        "test/cookies",
        "test/cors",
        "test/fullscreen-api",
        "test/geolocation",
        "test/hashchange",
        "test/history",
        "test/indexeddb",
        "test/postmessage",
        "test/svg",
        "test/touchevents",
        "test/video",
        "test/webanimations",
        "test/webgl",
        "test/websockets",
        "test/xdomainrequest",
        "test/css/animations",
        "test/css/backgroundsize",
        "test/css/borderimage",
        "test/css/borderradius",
        "test/css/boxshadow",
        "test/css/columns",
        "test/css/flexbox",
        "test/css/flexboxlegacy",
        "test/css/fontface",
        "test/css/generatedcontent",
        "test/css/gradients",
        "test/css/hsla",
        "test/css/multiplebgs",
        "test/css/opacity",
        "test/css/rgba",
        "test/css/textshadow",
        "test/css/transforms",
        "test/css/transforms3d",
        "test/css/transitions",
        "test/storage/localstorage",
        "test/storage/sessionstorage",
        "test/storage/websqldatabase",
        "test/svg/clippaths",
        "test/svg/inline",
        "test/svg/smil"
      ]
    }),

    //https://webpack.github.io/docs/shimming-modules.html
    //Make $ and jQuery available in every module without writing require("jquery").
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),

      // https://github.com/clessg/progress-bar-webpack-plugin
     new ProgressBarPlugin({
       format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
       clear: false
     })
  )


  // Add build specific plugins
  if (isProd) {
    config.plugins.push(
      // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
      // Only emit files when there are no errors
      new webpack.NoErrorsPlugin(),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
      // Dedupe modules in the output
      new webpack.optimize.DedupePlugin(),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
      // Minify all javascript, switch loaders to minimizing mode
      //new webpack.optimize.UglifyJsPlugin(),

      // Copy assets from the public folder
      // Reference: https://github.com/kevlened/copy-webpack-plugin
      new CopyWebpackPlugin([{
        from: __dirname + '/src/img'
      }])
    )
  }

  /**
   * Dev server configuration
   * Reference: http://webpack.github.io/docs/configuration.html#devserver
   * Reference: http://webpack.github.io/docs/webpack-dev-server.html
   */
  config.devServer = {
    contentBase: './src',
    stats: 'minimal'
  };

  return config;
}();
