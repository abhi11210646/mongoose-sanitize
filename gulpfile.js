const mocha = require('gulp-mocha');
const jshint = require('gulp-jshint');
const gulp = require('gulp');

gulp.task('lint', function () {
	return gulp.src(['./lib/*.js', './test/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('test', function () {
	return gulp.src('test/test.js', { read: false })
		.pipe(mocha({ reporter: 'list' }));
});
gulp.task('default', gulp.series('lint', 'test'));