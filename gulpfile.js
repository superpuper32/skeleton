'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const through2 = require('through2').obj;
const fs = require('fs');
const gulpif = require('gulp-if');
const combine = require('stream-combiner2').obj;
const debug = require('gulp-debug');
const stylus = require('gulp-stylus');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const browserSync = require('browser-sync').create();
const notify = require('gulp-notify');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

gulp.task('styles', function() {

    return combine(
        gulp.src('frontend/styles/main.styl'),
        gulpIf(isDevelopment, sourcemaps.init()),
        stylus(),
        gulpIf(isDevelopment, sourcemaps.write()),
        gulp.dest('public')
    ).on('error', notufy.onError());

});

gulp.task('clean', function() {
    return del('public');
});

gulp.task('assets', function() {
    return gulp.src('frontend/assets/**', {since: gulp.lastRun('assets')})
        .pipe(debug({title: 'assets'}))
        .pipe(gulp.dest('public'));
});

gulp.task('build', gulp.series(
    'clean', 
    gulp.parallel('styles', 'assets'))
);

gulp.task('watch', function() {
    gulp.watch('frontend/styles/**/*.*', gulp.series('styles'));

    gulp.watch('frontend/assets/**/*.*', gulp.series('assets'));
});

gulp.task('serve', function() {
    browserSync.init({
        server: 'public'
    });

    browserSync.watch('public/**/*.*').on('change', browserSync.reload)
});

gulp.task('dev',
    gulp.series('build', gulp.parallel('watch', 'serve'))
);

gulp.task('lint', function() {

    let eslintResults = {};

    let cacheFilePath = process.cwd() + '/tmp/lintCache.json';

    try {
        eslintResults = JSON.parse(fs.readFileSync(cacheFilePath));
    } catch (e) {
    }
    
    return gulp.src('frontend/**/*.js', {read: false})
        .pipe(gulpif(
            function(file) {
                return eslintResults[file.path] && eslintResults[file.path].mtime == file.stat.mtime.toJSON();
            },
            through2(function(file, enc, callback) {
                file.eslint = eslintResults[file.path].eslint;
                callback(null, file);
            }),
            combine(
                through2(function(file, enc, callback) {
                    file.contents = fs.readFileSync(file.path);
                    callback(null, file);
                }),
                eslint(),
                through2(function(file, enc, callback) {
                    eslintResults[file.path] = {
                        eslint: file.eslint,
                        mtime: file.stat.mtime
                    };
                    callback(null, file);
                })
            )
        ))
        .on('end', function() {
            fs.writeFileSync(cacheFilePath, JSON.stringify((eslintResults)));
        })
        .pipe(eslint.failAfterError());

});