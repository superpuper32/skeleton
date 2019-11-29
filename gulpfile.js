'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const through2 = require('through2').obj;
const fs = require('fs');

// githook
gulp.task('lint', function() {   // gulp-cash plugin

    let eslintResults = {};

    let cacheFilePath = process.cwd() + '/tmp/lintCache.json';

    return gulp.src('frontend/**/*.js')
        .pipe(eslint())   // file.eslint   // .eslinterc
        .pipe(through2(function (file, enc, callback) {
            eslintResults[file.path] = {
                eslint: file.eslint,
                mtime: file.stat.mtime
            };
            callback(null, file);
        }, function(callback) {
            fs.writeFileSync(cacheFilePath, JSON.stringify((eslintResults)));
            callback();
        }))
        .pipe(eslint.format());
        //.pipe(eslint.failAfterError());   // exit code = 1

});
