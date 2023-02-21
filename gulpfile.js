var gulp = require('gulp'); // v4

gulp.task('lint', function () {
	var stylelint = require('stylelint'),
		postcss = require('gulp-postcss'),
		eslint = require('gulp-eslint');

	gulp.src('src/notifier.css')
	.pipe(postcss([
		stylelint()
	]));

	return gulp.src([
		'gulpfile.js',
		'src/notifier.js'
	])
	.pipe(eslint({
		envs: [
			'node',
			'browser',
			'worker',
			'es6'
		],
		rules: {
			'semi': 1,
			'no-undef': 1,
			'no-extra-semi': 1,
			'no-unused-vars': 1
		},
		globals: [
			'Notifier'
		]
	}))
	.pipe(eslint.format());
});

gulp.task('js', function() {
	var uglify = require('gulp-uglify'),
		rename = require('gulp-rename');

	return gulp.src('src/notifier.js')
	.pipe(uglify({
		output: {
			//quote_style: 1,
			comments: /^!/
		}
	}))
	.pipe(rename({
		extname: '.min.js'
	}))
	.pipe(gulp.dest('build/'));
});

gulp.task('css', function() {
	var cleancss = require('gulp-clean-css'), // minify css
		rename = require('gulp-rename');

	return gulp.src('src/notifier.css')
	.pipe(cleancss())
	.pipe(rename({
		extname: '.min.css'
	}))
	.pipe(gulp.dest('build/'));
});

gulp.task('default', gulp.parallel('css','js'));
