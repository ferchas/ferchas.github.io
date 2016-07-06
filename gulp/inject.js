'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./config');

var $ = require('gulp-load-plugins')();

// Wire Bower dependencies to your source code.
// var wiredep = require('wiredep').stream;

// var _ = require('lodash');

// Inject Task
gulp.task('inject', ['styles'], function() {
  var injectStyles = gulp.src(path.join(conf.paths.dist, '/styles/*.css'), {
      read: false
  });

var injectOptions = {
    ignorePath: [conf.paths.src, path.join(conf.paths.dist, '/')],
    addRootSlash: false
};

    return gulp.src(path.join(conf.paths.src, '/*.html'))
            .pipe($.inject(injectStyles, injectOptions))
        // .pipe($.inject(injectScripts, injectOptions))
        // .pipe(wiredep(_.extend({}, conf.wiredep)))
            .pipe(gulp.dest(path.join(conf.paths.dist, '/')));

});
