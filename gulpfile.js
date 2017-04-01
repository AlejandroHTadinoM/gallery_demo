var gulp = require('gulp');

// Sass compiling
var sass = require('gulp-sass');
var autoPrefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');

// Views compiling
var pug = require('gulp-pug');

// Server
var BS = require('browser-sync');

// JS Concat and minify
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var remane = require('gulp-rename');

// Paths
var stylesSrc = 'assets/sass/*.sass';
var stylesDist = 'dist/csss/';
var jsSrc = 'assets/js/*.js';
var jsDist = 'dist/js/';
var viewsSrc = 'views/*.pug';
var viewsDist = 'dist/';

/*========== Views: Templating engine compiling ==========*/
gulp.task('Views', function () {
	return gulp.src(viewsSrc)
	.pipe(
		pug({
			pretty: false
	}))
	.pipe(gulp.dest(viewsDist))
	.change(BS.reload);
});

/*========== Styles: Sass compiling and compressing ==========*/
gulp.task('Styles', function() {
  return gulp.src(stylesSrc)
    .pipe(
    	sass({
	    	outputStyle: 'compressed'
	  })
    .on('error', sass.logError))
	.pipe(
		autoPrefixer({
		  browsers: ['last 2 versions'],
	      cascade: false
	}))
	.pipe(
		cleanCSS({
		  compatibility: 'ie8',
		  debug: true
		}, function (e){
		  	console.log(e.name + ': ' + e.stats.originalSize);
		  	console.log(e.name + ': ' + e.stats.minifiedSize);
	  }))
	  .pipe(
	  	rename({
		  	sufix: '.min',
		  	extname: '.css'
	  }))
	  .pipe(gulp.dest(stylesDist))
	  .pipe(BS.stream());
});

/*========== JS: JavaScript files concat, compress and renamed ==========*/
gulp.task('JS', function() {
  return gulp.src(jsSrc)
    .pipe(
    	concat('scripts.js', {
	    	newLine: ';'
    }))
    .pipe(uglify())
    .pipe(
    	remane({
	    	sufix: '.min',
	    	extname: '.js'
    }))
    .pipe(gulp.dest(jsDist))
    .change(BS.reload);
});

/*========== Serve: DEV Server running ==========*/
gulp.task('Serve', ['Views', 'Styles', 'JS', 'Watch'], function () {
	BS.init({
		server: './dist'
	});
});

/*========== Watch: Watch files for changes ==========*/
gulp.task('Watch', function () {
	gulp.watch(stylesSrc, ['sass']);
	gulp.watch(jsSrc, ['concat']);
	gulp.watch(viewsSrc, ['views']);
});

/*========== Default gulp task ==========*/
gulp.task('default', ['Serve']);