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
var rename = require('gulp-rename');
// Image Minification
var imgMin = require('gulp-imagemin');
/*========== Views: Templating engine compiling ==========*/
gulp.task('Views', function () {
	return gulp.src('views/*.pug')
	.pipe(pug({
		pretty: false
	}))
	.pipe(gulp.dest('dist/'))
	.on('change', BS.reload);
});
/*========== Styles: Sass compiling and compressing ==========*/
gulp.task('Styles', function() {
  return gulp.src('assets/sass/*.sass')
    .pipe(sass().on('error', sass.logError))
	.pipe(autoPrefixer({
		browsers: ['last 2 versions']
	}))
	.pipe(cleanCSS())
	.pipe(rename({
		sufix: '.min'
	}))
	.pipe(gulp.dest('dist/css/'))
	.pipe(BS.stream());
});
/*========== JS: JavaScript files concat, compress and renamed ==========*/
gulp.task('JS', function() {
  return gulp.src('assets/js/*.js')
    .pipe(concat('scripts.js', {
	    	newLine: ';'
    }))
    .pipe(uglify())
    .pipe(rename({
	    	sufix: '.min',
	    	extname: '.js'
    }))
    .pipe(gulp.dest('dist/js/'))
    .on('change', BS.reload);
});
/*========== imgMin: Image minification ==========*/
gulp.task('imgMin', function() {
    return gulp.src('assets/img/')
      .pipe(imgMin([
      		imagemin.gifsicle({interlaced: true}),
			imagemin.jpegtran({progressive: true}),
			imagemin.optipng({optimizationLevel: 5}),
			imagemin.svgo({plugins: [{removeViewBox: true}]})
      	]))
      .pipe(gulp.dest('dist/img'));
});
/*========== Serve: DEV Server running ==========*/
gulp.task('Serve', ['Watch'], function () {
	BS.init({
		server: './dist'
	});
});
/*========== Watch: Watch files for changes ==========*/
gulp.task('Watch', function () {
	gulp.watch('assets/sass/*.sass', ['sass']);
	gulp.watch('assets/js/*.js', ['concat']);
	gulp.watch('views/*.pug', ['views']);
	gulp.watch('assets/img', ['imgMin']);
});
/*========== Default gulp task ==========*/
gulp.task('default', ['Views', 'Styles', 'JS', 'Serve']);
