import config from './config';
import gulp from 'gulp';
import browserify from 'browserify';
import watchify from 'watchify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import notify from 'gulp-notify';
import handleErrors from './util/handleErrors';

const BROWSERIFY_OPTIONS = {
  entries: config.js.entries,
  extensions: ['.js'],
  transform: ['babelify'],
  debug: true
}

var watching = false;
gulp.task('enable-watch-mode', ()=> watching = true);

gulp.task('dev', ['enable-watch-mode'], () => {
  gulp.start('js');
});

gulp.task('js', ()=> {
  let bundler = browserify(BROWSERIFY_OPTIONS);

  if (watching) {
    bundler = watchify(bundler);
    bundler.on('update', () => {
      rebundle();
    });
  }
  rebundle();

  function rebundle() {
    bundler
    .bundle()
    .on('error', handleErrors)
    .pipe(source(config.js.entryFile))
    .pipe(gulp.dest(config.js.destDir))
    .pipe(notify("Compile Succeed!"));
  }

});
