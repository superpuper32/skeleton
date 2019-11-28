'use strict';

const gulp = require('gulp');
const through2 = require('through2').obj;


gulp.task('assets', function() {

    return gulp.src('frontend/assets/**/**.*')
        .pipe(through2(function(file, enc, callback) {
            let file2 = file.clone();
            file2.path += '.bak';
            this.push(file2);
            callback(null, file);
        }))
        .pipe(gulp.dest('public'))

});
