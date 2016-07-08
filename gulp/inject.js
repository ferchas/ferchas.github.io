'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./config');

var $ = require('gulp-load-plugins')();
// Wire Bower dependencies to your source code.
var wiredep = require('wiredep').stream;
var _ = require('lodash');

// Inject Task
gulp.task('inject', ['scripts', 'styles'], function() {
  var injectStyles = gulp.src(path.join(conf.paths.dist, '/styles/*.css'), {
      read: false
  });

  var injectScripts = gulp.src(path.join(conf.paths.dist, '/js/*.js'));

  var injectOptionsCss = {
      ignorePath: [conf.paths.src, path.join(conf.paths.dist, '/')],
      addRootSlash: false
  };

  var injectOptionsJs = {
      ignorePath: [conf.paths.dist, path.join(conf.paths.src, '/app/')],
      addRootSlash: false
  };
    return gulp.src(path.join(conf.paths.src, '/*.html'))
            .pipe($.inject(injectStyles, injectOptionsCss))
            .pipe($.inject(injectScripts, injectOptionsJs))
            .pipe(wiredep(_.extend({}, conf.wiredep)))
            .pipe(gulp.dest(path.join(conf.paths.dist, '/')));

});
