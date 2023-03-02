const gulp = require('gulp'),
	stylelint = require('stylelint'),
	{ ESLint } = require('eslint'),
	cleancss = require('clean-css'),
	uglifyjs = require('uglify-js'),
	replaceExt = require('replace-ext');

function lintCSS() {
	return gulp.src('src/notifier.css')
	.on('data',_stylelint);
}

function lintJS() {
	return gulp.src([
		'gulpfile.js',
		'src/notifier.js'
	])
	.on('data',_eslint);
}

function minifyCSS() {
	return gulp.src('src/notifier.css')
	.on('data',function(file) {
		_cleancss(file);
		file.path = replaceExt(file.path,'.min.css');
	})
	.pipe(gulp.dest('build/'));
}

function minifyJS() {
	return gulp.src('src/notifier.js')
	.on('data',function(file) {
		_uglifyjs(file);
		file.path = replaceExt(file.path,'.min.js');
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
		if (result.output) {
			console.log(result.output);
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
		const eslint = new ESLint({
			useEslintrc: false,
			overrideConfig: {
				extends: 'eslint:recommended',
				parserOptions: {
					//sourceType: 'module',
					ecmaVersion: 'latest'
				},
				env: {
					node: true,
					browser: true,
					worker: true,
					es2022: true
				},
				globals: {
					Notifier: 'writable'
				}
			},
		});

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

function _cleancss(file) {
	const result = new cleancss(/* options */).minify(file.contents.toString());
	file.contents = Buffer.from(result.styles);
}

function _uglifyjs(file) {
	const result = uglifyjs.minify(file.contents.toString(),{
		output: {
			comments: /^!/
		}
	});
	file.contents = Buffer.from(result.code);
}

exports.default = gulp.parallel(minifyCSS,minifyJS);

exports.lint = gulp.parallel(lintCSS,lintJS);
