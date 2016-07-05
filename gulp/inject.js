'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./config');

var $ = require('gulp-load-plugins')();

// Wire Bower dependencies to your source code.
// var wiredep = require('wiredep').stream;

// var _ = require('lodash');

// Inject Task
gulp.task('inject', function() {

    return gulp.src(path.join(conf.paths.src, '/*.html'))
          .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
        // .pipe($.inject(injectStyles, injectOptions))
        // .pipe($.inject(injectScripts, injectOptions))
        // .pipe(wiredep(_.extend({}, conf.wiredep)))

});
