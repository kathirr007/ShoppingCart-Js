var gulp = require('gulp'),
  browserSync = require('browser-sync'),
  pngcrush = require('imagemin-pngcrush'),
  clean = require('del'),
  $ = require('gulp-load-plugins')({ lazy: true })
var env,
  jsSources,
  sassSources,
  htmlSources,
  jsonData,
  imgSources,
  sourceDir,
  outputDir
var sassOpts = {}
env = process.env.NODE_ENV || 'development'
sourceDir = 'src/'
outputDir = env == 'development' ? 'builds/development/' : 'builds/production/'
fonts = [sourceDir + 'assets/fonts/**/*']
imgSources = [sourceDir + 'assets/images/**/*']
jsSources = [sourceDir + 'assets/js/*.js']
sassSources = [sourceDir + 'assets/scss/**/*.scss']
htmlSources = [sourceDir + '*.html']
jsonData = [sourceDir + 'assets/data/cart.json']
sassOpts = {
  outputStyle: env == 'development' ? 'nested' : 'compressed',
  precison: 3,
  errLogToConsole: true,
}
gulp.task('clean', cb => {
  clean(outputDir)
  cb()
})

gulp.task('reload', done => {
  browserSync.reload()
  done()
})

gulp.task('fonts', () => {
  return gulp.src(fonts).pipe(gulp.dest(outputDir + 'assets/fonts'))
})
gulp.task(
  'sass',
  gulp.parallel('fonts', () => {
    return gulp
      .src(sassSources)
      .pipe($.sourcemaps.init())
      .pipe($.sass(sassOpts).on('error', $.sass.logError))
      .pipe(
        $.autoprefixer({
          overrideBrowserslist: [
            'Android 2.3',
            'Android >= 4',
            'Chrome >= 20',
            'Firefox >= 24',
            'Explorer >= 8',
            'iOS >= 6',
            'Opera >= 12',
            'Safari >= 6',
          ],
        })
      )
      .pipe($.sourcemaps.write('./maps'))
      .pipe(gulp.dest(outputDir + 'assets/css/'))
      .pipe(browserSync.stream())
  })
)
gulp.task('html', () => {
  return gulp
    .src(sourceDir + '*.html')
    .pipe($.preprocess())
    .pipe($.if(env === 'production', $.htmlmin({ collapseWhitespace: true })))
    .pipe(gulp.dest(outputDir))
})
gulp.task('images', () => {
  return gulp
    .src(imgSources)
    .pipe($.newer(outputDir + 'assets/images'))
    .pipe(
      $.if(
        env === 'production',
        $.imagemin({
          progressive: true,
          svgoPlugin: [{ removeViewBox: false }],
          use: [pngcrush()],
        })
      )
    )
    .pipe(gulp.dest(outputDir + 'assets/images'))
})
gulp.task('js', () => {
  return gulp
    .src(jsSources)
    .pipe($.preprocess())
    .pipe($.if(env === 'production', $.uglify()))
    .pipe(gulp.dest(outputDir + 'assets/js'))
})
gulp.task('json', () => {
  return gulp
    .src(jsonData)
    .pipe($.preprocess())
    .pipe($.if(env === 'production', $.jsonminify()))
    .pipe(gulp.dest(outputDir + 'assets/data'))
})

gulp.task('browsersync', () => {
  browserSync({
    server: {
      baseDir: outputDir,
    },
    port: 3006,
    open: false,
    notify: true,
  })
})
gulp.task(
  'watch',
  gulp.parallel('browsersync', () => {
    gulp.watch(jsSources, gulp.series('js', 'reload'))
    gulp.watch(fonts, gulp.series('fonts', 'reload'))
    gulp.watch(jsonData, gulp.series('json', 'reload'))
    gulp.watch(sassSources, gulp.series('sass'))
    gulp.watch(imgSources, gulp.series('images', 'reload'))
    gulp.watch(htmlSources, gulp.series('html', 'reload'))
  })
)

gulp.task(
  'default',
  gulp.parallel('html', 'sass', 'js', 'images', 'json', 'watch')
)
