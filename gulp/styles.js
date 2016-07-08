'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./config');

var $ = require('gulp-load-plugins')();
var wiredep = require('wiredep').stream;
var _ = require('lodash');

gulp.task('styles', function() {
    var sassOptions = {
        style: 'expanded'
    };

    var injectFiles = gulp.src(path.join(conf.paths.src, '/app/main.scss'), {
        read: false
    });

    var injectOptions = {
        transform: function(filePath) {
            filePath = filePath.replace(conf.paths.src + '/app/', '');
            return '@import "' + filePath + '";';
        },
        starttag: '// injector',
        endtag: '// endinjector',
        addRootSlash: false
    };

    return gulp.src([
            path.join(conf.paths.src, '/app/index.scss')
        ])
        .pipe($.inject(injectFiles, injectOptions))
        .pipe(wiredep(_.extend({}, conf.wiredep)))
        .pipe($.sourcemaps.init())
        .pipe($.sass(sassOptions)).on('error', conf.errorHandler('RubySass'))
        .pipe($.autoprefixer()).on('error', conf.errorHandler('Autoprefixer'))
        .pipe($.csso())
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(path.join(conf.paths.dist, '/styles')));
});
