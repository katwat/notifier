import gulp from 'gulp';
import stylelint from 'stylelint';
import { ESLint } from 'eslint';
import postcss from 'postcss';
import cssnano from 'cssnano';
import uglifyjs from 'uglify-js';

function gulp_src(globs) {
	return gulp.src(globs,{encoding:false}); // as binary
}

function lintCSS() {
	return gulp_src('src/notifier.css')
	.on('data',_stylelint);
}

function lintJS() {
	return gulp_src([
		'gulpfile.js',
		'src/notifier.js'
	])
	.on('data',_eslint);
}

function minifyCSS() {
	return gulp_src('src/notifier.css')
	.on('data',file => {
		_cssnano(file);
		file.extname = '.min.css'; // -> https://github.com/gulpjs/vinyl
	})
	.pipe(gulp.dest('build/'));
}

function minifyJS() {
	return gulp_src('src/notifier.js')
	.on('data',file => {
		_uglifyjs(file);
		file.extname = '.min.js'; // -> https://github.com/gulpjs/vinyl
	})
	.pipe(gulp.dest('build/'));
}

function _stylelint(file) {
	stylelint.lint({
		config: {
			extends: 'stylelint-config-recommended'
		},
		codeFilename: file.path,
		code: file.contents.toString(),
		formatter: 'string'
	})
	.then(result => {
		if (result.report) {
			console.log(result.report);
		}
	})
	.catch(error => {
		process.exitCode = 1;
		console.error(error);
	});
}

function _eslint(file) {
	(async function() {
		// 1. Create an instance
		const eslint = new ESLint(); // use eslint.config.js

		// 2. Lint text.
		const results = await eslint.lintText(file.contents.toString(),{
			filePath: file.path
		});

		// 3. Format the results.
		const formatter = await eslint.loadFormatter('stylish');
		const resultText = formatter.format(results);

		// 4. Output it.
		if (resultText) {
			console.log(resultText);
		}
	})().catch(error => {
		process.exitCode = 1;
		console.error(error);
	});
}

function _cssnano(file) {
	(async function() {
		// postcss API -> https://postcss.org/api/
		const result = await postcss([cssnano]).process(file.contents.toString(),{from:file.path});
		file.contents = Buffer.from(result.css);
	})().catch(error => {
		console.error(error);
		process.exitCode = 1;
	});
}

function _uglifyjs(file) {
	const result = uglifyjs.minify(file.contents.toString(),{
		output: {
			comments: /^!/
		}
	});
	file.contents = Buffer.from(result.code);
}

const build = gulp.parallel(minifyCSS,minifyJS);

const lint = gulp.parallel(lintCSS,lintJS);

export {build as default, lint};
