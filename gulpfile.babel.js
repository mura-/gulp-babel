import gulp from 'gulp';
import browserify from 'browserify';
import watchify from 'watchify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';

const BROWSERIFY_OPTIONS = {
  entries: ['./js/main.js'],
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
    .on('error', (err) => {
      console.log("Error: " + err.message);
    })
    .pipe(source('main.js'))
    .pipe(gulp.dest('./dist/js'));
  }

});
