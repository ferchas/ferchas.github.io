'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./config');

// specify each plugin to useing
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

// clean folders
gulp.task('clean', function(done) {
    $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')], done);
});

// buil html
gulp.task('build', ['html']);

// inject all partials on html
gulp.task('html', ['inject','partials'], function() {
    var partialsInjectFile = gulp.src(path.join(conf.paths.dist, '/partials/*/*.html'));
    var partialsInjectOptions = {
        starttag: '<!-- inject:partials -->',
        transform: function (filePath, file) {
          // return file contents as string
          return file.contents.toString('utf8');
        }
    };

    var sourcesCSS = gulp.src(path.join(conf.paths.dist, '/styles/*.css'),{
      read: false
    });

    var sourcesOptions = {
      ignorePath: path.join(conf.paths.dist, '/'),
    };




    return gulp.src(path.join(conf.paths.dist, '/index.html'))
        .pipe($.inject(partialsInjectFile, partialsInjectOptions))
        .pipe($.inject(sourcesCSS, sourcesOptions))
        .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
        .pipe($.size({
            title: path.join(conf.paths.dist, '/'),
            showFiles: true
        }));
});

gulp.task('partials', function() {
    return gulp.src([
            path.join(conf.paths.src, '/app/**/*.html')
        ])
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(gulp.dest(conf.paths.dist + '/partials/'));
});
