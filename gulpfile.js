var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

//styles task
gulp.task('styles', function(){
	return gulp.src('styles/*.scss') //get everything with .scss ending in styles
	.pipe(sass().on('error', sass.logError)) //bring it in "pipe" and move on
	.pipe(concat('style.css')) //convert to css and call it that
	.pipe(autoprefixer('last 2 versions', 'ie8'))
	.pipe(gulp.dest('styles/'))//put it in styles folder
	.pipe(reload({ stream: true}));  
});

gulp.task('js', function(){
	return gulp.src('scripts/*.js')
	.pipe(jshint())
	.pipe(jshint.reporter('jshint-stylish'))
	.pipe(reload({ stream: true}));  
});

gulp.task('browser-sync', function(){
	browserSync.init({
		server: {
			baseDir: './'   //means current file
		}
	});
});

//make a watch task so you don't have to keep using command line. will watch for saving
gulp.task('watch', function() {
	gulp.watch('styles/*.scss', ['styles']);
	gulp.watch('scripts/*.js', ['js']);
	gulp.watch('*.html', reload);
});

gulp.task('default', ['browser-sync', 'styles','js', 'watch']);
