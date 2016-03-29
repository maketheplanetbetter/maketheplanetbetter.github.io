var gulp = require('gulp');
var addsrc = require('gulp-add-src');
var autoprefix = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var livereload = require('gulp-livereload');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var paths = {
  'bower': 'bower_components',
  'build': 'assets/build',
  'dist': 'assets/dist'
};

// less task
gulp.task('less', function() {
  gulp.src([
    paths.build + '/less/main.less'
  ])
  .pipe(less({compress: true}))
  .pipe(autoprefix('last 2 version', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
  .pipe(minifycss())
  .pipe(rename({suffix: '-min'}))
  .pipe(gulp.dest(paths.dist + '/css'))
  .pipe(livereload());
});

// js task
gulp.task('js', function () {
  gulp.src([
    paths.build + '/js/**/*.js'
  ])
  .pipe(jshint())
  .pipe(jshint.reporter(stylish))
  .pipe(addsrc([
    paths.bower + '/jquery/dist/jquery.min.js',
    paths.bower + '/jqGoogleForms/js/jquery.jqgoogleforms.min.js'
  ]))
  .pipe(uglify())
  .pipe(concat('main-min.js'))
  .pipe(gulp.dest(paths.dist + '/js'))
  .pipe(livereload());
});

// img tasks
gulp.task('img', function () {
  gulp.src([
    paths.build + '/img/**/*'
  ])
  .pipe(gulp.dest(paths.dist + '/img'));
});

// font tasks
gulp.task('font', function () {
  gulp.src([
    paths.build + '/fonts/**/*',
    paths.bower + '/font-awesome/fonts/*'
  ])
  .pipe(gulp.dest(paths.dist + '/fonts'));
});

// build task
gulp.task('build', ['less',  'js', 'img', 'font']);

// default task
gulp.task('default', function () {
  livereload.listen();
  gulp.watch(paths.build + '/less/**/*.less', ['less']);
  gulp.watch(paths.build + '/js/**/*.js', ['js']);
});
