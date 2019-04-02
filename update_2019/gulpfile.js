const { watch, series, src, dest } = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

function reload(done) {
  browserSync.reload();
  done();
}

function serve(done) {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
  done();
}

function css() {
	return src('src/sass/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(postcss([
			autoprefixer({
				browsers: ['last 4 versions']
			})
		]))
        .pipe(sourcemaps.write('./maps'))
		.pipe(dest('dist/css'))
		.pipe(browserSync.stream())
}

function images() {
	return src('src/images/*')
		.pipe(imagemin())
		.pipe(dest('dist/images'))
}

function copy() {
	return src('src/**/*.+(html|js)')
		.pipe(dest('dist'))
		.pipe(browserSync.stream())
}

function watchFiles() {
	watch('src/sass/**/*.scss', { ignoreInitial: false }, series(copy, css, reload));
}

exports.watch = series(serve, watchFiles);
exports.images = series(images);
