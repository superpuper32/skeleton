'use strict';

const gulp = require('gulp');
const debug = require('gulp-debug');

module.exports = function(options) {
    
    return function() {
        return gulp.src(options.src, {since: gulp.lastRun('assets')})
            .pipe(debug({title: 'assets'}))
            .pipe(gulp.dest('public'));
    };
};