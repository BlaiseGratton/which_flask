"use strict";

var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps'),
     del = require('del');

gulp.task("concatScripts", function() {
    return gulp.src([
        'bower_components/angular-route/angular-route.min.js',
        'bower_components/angular-local-storage/dist/angular-local-storage.min.js',
        'src/js/app.js',
        'src/js/*.js',
        'src/js/**/*.js'
        ])
    .pipe(maps.init())
    .pipe(concat('app.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('static/js'));
});

gulp.task('minifyScripts', ['concatScripts'], function() {
  return gulp.src("static/js/app.js")
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(gulp.dest('static/js'));
});

gulp.task('compileSass', function() {
  return gulp.src("src/styles/main.scss")
      .pipe(maps.init())
      .pipe(sass())
      .pipe(maps.write('./'))
      .pipe(gulp.dest('static/styles'));
});

gulp.task('watchFiles', function() {
  gulp.watch(['src/styles/**/*.scss', 'src/styles/*.scss'], ['compileSass']);
  gulp.watch(['src/js/*.js', 'src/js/**/*.js'], ['concatScripts']);
});

gulp.task('serve', ['watchFiles']);

gulp.task('clean', function() {
  del('static');
});

gulp.task("build", ['clean', 'minifyScripts', 'compileSass'], function() {
  return gulp.src(["styles/main.css", "js/app.min.js"], { base: './'})
            .pipe(gulp.dest('static'));
});

gulp.task("default", ["serve"]);
