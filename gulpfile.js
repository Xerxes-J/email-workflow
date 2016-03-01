'use strict';

// Include Gulp
var gulp = require('gulp');

// Define Base folders
var src = './src/';
var dest = './build/';

// BrowserSync
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;

// Include Plugins
var autoprefixer = require('autoprefixer');

var plugins = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'gulp.*'],
	replaceString: /\bgulp[\-.]/,
	lazy: true,
  camelize: true,
});

// See where error is located
var onError = function (err) {
  plugins.util.beep();
  console.log(err);
};

// SCSS
gulp.task('sass', function () {
	// SCSS Source
	return gulp.src(src + 'scss/style.scss')
  // Prevent gulp watch from crashing
  .pipe(plugins.plumber(onError))
	// Check Size
	.pipe(plugins.size())
	// SCSS to CSS with Error Watch
  .pipe(plugins.sass().on('error', plugins.sass.logError))
  // CSS Autoprefixer
  .pipe(plugins.postcss([
		autoprefixer({
			browsers: ['last 2 versions', 'ie 8', 'ie 9'],
			cascade: true
		})
	]))
  // CSS Rename for IE stylesheet
  .pipe(plugins.rename({basename:'style'}))
  // SCSS Destination for IE stylesheet
  .pipe(gulp.dest(dest + 'css'))
  // CSS Rename
  .pipe(plugins.rename({basename:'style', suffix: '.min'}))
  // SCSS Compress
	.pipe(plugins.sass({outputStyle: 'compressed'}))
  // Check Size
	.pipe(plugins.size())
  // SCSS Destination
  .pipe(gulp.dest(dest + 'css'));
});

// Compressing images & handle SVG files
gulp.task('img', function() {
  return gulp.src(src + 'img/*')
	.pipe(plugins.imagemin({ optimizationLevel: 1, progressive: true, interlaced: true }))
  .pipe(gulp.dest(dest + 'img'));
});

// Watch files for changes
gulp.task('watch', ['browser-sync'], function() {
  // Watch HTML files
  gulp.watch(dest + '*.html', reload);
  // Watch Sass files
  gulp.watch(src + 'scss/**/*', ['sass', reload]);
});

// Browser Sync
gulp.task('browser-sync', function() {
	browserSync.init(['./build/css/**.*'], {
    server: {
        baseDir: "./build"
    }
	});
});

gulp.task('inline', function() {
	return gulp.src(dest + '*.html')
    .pipe(plugins.inlineCss())
    .pipe(gulp.dest(dest + 'inline'));
});

// Default task
gulp.task('default', ['sass', 'watch', 'img', 'browser-sync']);
