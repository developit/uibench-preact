var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var ghPages = require('gulp-gh-pages');
var path = require('path');

gulp.task('html', function() {
  gulp.src('web/index.html')
      .pipe(gulp.dest(process.env.DEST || 'build'));
});

var PREACT_VERSION = Math.round(process.env.PREACT_VERSION || 10);
var PREACT = process.env.PREACT;
if (PREACT_VERSION===8) {
  PREACT = 'web/preact-8.js';
}

gulp.task('build', function(callback) {
  var cfg = {
    // entry: ['./web/js/main.jsx'],
    entry: ['./web/js/dev.jsx'],
    output: {
      path: path.join(__dirname, process.env.DEST || 'build'),
      filename: 'bundle.js'
    },
    resolve: {
      extensions: ['', '.js', '.jsx'],
      alias: PREACT ? {
        preact: path.resolve(__dirname, PREACT)
      } : {}
    },
    module: {
      loaders: [{
        test: /\.jsx?$/,
        // exclude: /(node_modules)/,
        include: __dirname+'/web/js',
        loaders: ['babel?{ "presets": ["es2015-loose", "react"], "plugins": [["transform-react-jsx", {"pragma": "h"}]] }']
      }]
    },
    node: {
        console: false,
        global: false,
        process: false,
        Buffer: false,
        __filename: false,
        __dirname: false,
        setImmediate: false
    },
    plugins: [
      new webpack.NoErrorsPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        },
        PREACT_VERSION
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
          mangle: {
              keep_fnames: true
          }
      })
    ]
  };

  webpack(cfg, function(err, stats) {
    if (err) throw new gutil.PluginError('build', err);
    gutil.log('[build]', stats.toString({colors: true}));
    callback();
  });
});

gulp.task('deploy', ['default'], function () {
  return gulp.src('./build/**/*')
      .pipe(ghPages());
});

gulp.task('default', ['html', 'build']);
