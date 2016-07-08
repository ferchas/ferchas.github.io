'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./config');

var browserSync = require('browser-sync');

var util = require('util');


function browserSyncInit(baseDir, browser) {
    browser = browser === undefined ? 'default' : browser;

    var routes = null;
    if (baseDir === conf.paths.dist || (util.isArray(baseDir) && baseDir.indexOf(conf.paths.src) !== -1)) {
        routes = {
            '/bower_components': 'bower_components'
        };
    }

    var server = {
        baseDir: baseDir,
        routes: routes
    };

    browserSync.instance = browserSync.init({
        startPath: '/',
        server: server,
        browser: browser
    });
}


gulp.task('serve', ['build','watch'], function() {
  browserSyncInit(conf.paths.dist);
});
