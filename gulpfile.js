const gulp = require('gulp'),

	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	sourcemaps = require('gulp-sourcemaps'),

	rename = require('gulp-rename'),
	plumber = require('gulp-plumber'),

	imagemin = require('gulp-imagemin'),


	gutil = require('gulp-util'),
	concat = require('gulp-concat'),
	babili = require('gulp-babel-minify'),

	browserSync = require('browser-sync').create(),
	runSequence = require('run-sequence'),
	notify = require('gulp-notify'),
	wait = require('gulp-wait');





	//================
	//=== browserSync
	//================

	gulp.task('browserSync', () => {
		browserSync.init({
			server: {
				baseDir: 'dist'
			}
		})
	});


//================
//=== Styles
//================


gulp.task('styles', () => {
	return gulp.src('src/sass/**/*.scss')
		.pipe(wait(200))
		.pipe(plumber({
			errorHandler: notify.onError('Error: <%= error.message %>')
		}))
		.pipe(sourcemaps.init())
		.pipe(sass({
			errLogToConsole: true,
			outputStyle: 'compressed',
			precision: 10
		}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 3 versions']
		}))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(sourcemaps.write('./maps'))
		.pipe(plumber.stop())
		.pipe(gulp.dest('dist/css'))
		.pipe(notify({
			message: 'TASK: "styles" Completed! 💯',
			onLast: true
		}))
		.pipe(browserSync.stream())
});

//================
// Minify Scripts
//================

gulp.task('scripts', () => {

	return gulp.src([
			'src/js/script.js'
		])
		.pipe(concat('script.min.js'))
		.pipe(babili({
			mangle: {
				keepClassNames: true
			}
		}))
		.on('error', function (err) {
			gutil.log(gutil.colors.red('[Error]'), err.toString());
		})
		.pipe(gulp.dest('dist/js/'));
});

gulp.task('copy', () => {
	return gulp.src('src/**/*.html')
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.stream())
});


//================
//     Images 
//================
gulp.task('images', () => {
	return gulp.src('src/img/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/img'))
});


gulp.task('watch', ['browserSync', 'styles'], () => {
	gulp.watch('src/sass/**/*.scss', ['styles'], browserSync.reload());
	gulp.watch('src/js/**/*.js', ['scripts'], browserSync.reload());
	gulp.watch('src/**/*.html', ['copy'], browserSync.reload());
})


gulp.task('default', function (callback) {
	runSequence(['watch', 'styles', 'scripts', 'browserSync'],
		callback)
});

gulp.task('build', function (callback) {
	runSequence(['default', 'images', 'scripts'],
		callback)
});