'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./config');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

gulp.task('scripts', function() {

    return gulp.src(path.join(conf.paths.src, '/app/**/js/*.js'))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.concat('all.js'))
        .pipe($.uglify())
        .pipe(browserSync.reload({stream: true}))
        .pipe($.size())

        .pipe(gulp.dest(path.join(conf.paths.dist, '/js')));
});
