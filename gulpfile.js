const gulp = require('gulp');
const rollup = require('rollup');
const { watch, series, parallel, src, dest } = gulp;

const browserSync = require('browser-sync').create();

const resolve = require('@rollup/plugin-node-resolve').default;
const commonjs  = require('@rollup/plugin-commonjs');
const { terser }  = require('rollup-plugin-terser');
const babel  = require('@rollup/plugin-babel').default;
async function js_task() {
	production = false;
	const bundle = await rollup.rollup({
		input: 'src/index.js',
		plugins: [
			resolve(), // tells Rollup how to find date-fns in node_modules
			commonjs(), // converts date-fns to ES modules
			babel({ babelHelpers: 'bundled' }),
			production && terser() // minify, but only in production
		]
	});
	await bundle.write({
		file: 'dist/app.js',
		format: 'iife', // immediately-invoked function expression — suitable for <script> tags
		sourcemap: true
	});
}

const less = require('gulp-less');
const path = require('path');
function less_task() {
    return gulp.src("./src/**/*.less")
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.stream());
}

const pug = require('gulp-pug');
function pug_task() {
    return src('./src/**/*.pug')
    .pipe(
      pug({
        // Your options in here.
      })
    )
    .pipe(dest('./dist'))
    .pipe(browserSync.stream());
}

function res_task() {
    return gulp.src(['res/**/*']).pipe(gulp.dest('dist/res'));
}

function server_task(cb) {
    browserSync.init({
        server: "./dist"
    });

    cb();
}

function watch_task(cb) {
    function reload(cb) {
        browserSync.reload();
        cb();
    }

    watch("src/**/*.less", series(less_task));
    watch("src/**/*.js", series(js_task, reload));
    watch("src/**/*.pug", series(pug_task, reload));
    watch("res/**/*", series(res_task, reload));
	
    cb();
}

const build_task = parallel(pug_task, less_task, js_task, res_task);
const serve_task = series(server_task, watch_task)

exports.serve = series(build_task, serve_task);
exports.build = build_task;