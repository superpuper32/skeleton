'use strict';

const gulp = require('gulp');
const stylus = require('gulp-stylus');
// const concat = require('gulp-concat'); .pipe(concat('all.css'))
const debug = require('gulp-debug');  // .pipe(debug({title: 'src'})) .pipe(debug({title: 'stylus'})) .pipe(debug({title: 'concat'}))
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const del = require('del');
const newer = require('gulp-newer'); // gulp-changed
const browserSync = require('browser-sync').create();
const notify = require('gulp-notify');
// const plumber = require('gulp-plumber');
const multipipe = require('multipipe');
// const combiner = require('stream-combiner2').obj;

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

gulp.task('styles', function() {
    // return gulp.src('frontend/styles/**/*.styl', {base: 'frontend'})
    // console.log(require('stylus/lib/parser').cache);

    return multipipe(
        gulp.src('frontend/styles/main.styl'),
        gulpIf(isDevelopment, sourcemaps.init()),  // file.sourceMap
        stylus(), // async-done
        gulpIf(isDevelopment, sourcemaps.write()),
        gulp.dest('public')
    ).on('error', notify.onError());

});

gulp.task('clean', function() {
    return del('public');
});

gulp.task('assets', function() {
    return gulp.src('frontend/assets/**', {since: gulp.lastRun('assets')})
        .pipe(newer('public'))
        .pipe(debug({title: 'assets'}))
        .pipe(gulp.dest('public'));
});

gulp.task('build', gulp.series(
    'clean', 
    gulp.parallel('styles', 'assets'))
);

gulp.task('watch', function() {

    gulp.watch('frontend/styles/**/*.*', gulp.series('styles'));

    // chokidar
    gulp.watch('frontend/assets/**/*.*', gulp.series('assets'));

});

gulp.task('serve', function() {
    browserSync.init({
        server: 'public'
    });
    
    browserSync.watch('public/**/*.*').on('change', browserSync.reload)
});

gulp.task('dev',
    gulp.series('build', gulp.parallel('watch', 'serve')));




// process.on('exit');