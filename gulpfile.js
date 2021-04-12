'use strict';

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const server = require('browser-sync').create();
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const posthtml = require('gulp-posthtml');
const htmlmin = require('gulp-htmlmin');
const inlinesource = require('gulp-inline-source');
const include = require('posthtml-include'); //
const babel = require('gulp-babel');
const del = require('del');

gulp.task('css', function () {
  return gulp
    .src('src/sass/main.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest('docs/css'))
    .pipe(csso())
    .pipe(rename('main.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('docs/css'))
    .pipe(server.stream());
});

gulp.task('sass', function () {
  return gulp
    .src('src/sass/main.scss')
    .pipe(sass())
    .pipe(gulp.dest('docs/css'));
});

gulp.task('server', function () {
  server.init({
    server: 'docs/',
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });

  gulp.watch('src/sass/**/*.{scss,sass}', gulp.series('css', 'sass'));
  gulp.watch('src/*.html', gulp.series('copy', 'refresh'));
  gulp.watch('src/js/**/*.js', gulp.series('js'));
});

gulp.task('refresh', function (done) {
  server.reload();
  done();
});

gulp.task('html', function () {
  return gulp
    .src('src/*.html')
    .pipe(posthtml([include()]))
    .pipe(
      inlinesource({
        rootpath: 'docs/',
      })
    )
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('docs'));
});

gulp.task('copy', function () {
  return gulp
    .src(['src/fonts/**/*.{woff,woff2}', 'src/img/**', 'src/js/**'], {
      base: 'src',
    })
    .pipe(gulp.dest('docs'));
});

gulp.task('js', () =>
  gulp
    .src('src/js/index.js')
    .pipe(
      babel({
        presets: ['@babel/preset-env'],
      })
    )
    .pipe(gulp.dest('docs/js'))
);

gulp.task('clean', function () {
  return del('docs');
});

gulp.task('assets', gulp.series('clean', 'js', 'css', 'html'));
gulp.task('build', gulp.series('assets', 'html'));
gulp.task('start', gulp.series('assets', 'copy', 'server'));
