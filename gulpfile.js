var gulp = require('gulp')
var uglify = require('gulp-uglify-es').default
var gulpConcat = require('gulp-concat')
var merge2 = require('merge2')
var packageJson = require('./package.json')
var path = require('path')

var module_list = []

gulp.task('build', function () {
  var c = gulp.src(['./source/**/*.js', '!./source/examples.js'])
  var j = gulp.src(module_list)

  merge2([j, c])
    .pipe(gulpConcat('./dist/grapholscape.js'))
    .pipe(gulp.dest('.'))
})

gulp.task('uglify', function () {
  var c = gulp.src(['./source/**/*.js', '!./source/examples.js'])
  var j = gulp.src(module_list)

  merge2([j, c])
    .pipe(gulpConcat('./dist/grapholscape.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('.'))
})

gulp.task('release', function () {
  gulp.src('').pipe(
    electron({
      src: '.',
      packageJson: packageJson,
      release: './release',
      cache: './cache',
      version: 'v0.37.4',
      packaging: true,
      platforms: ['linux']
    })
  )
})

gulp.task('watch', function () {
  gulp.watch('./source/**/*.js', ['build'])
})

gulp.task('default', ['build', 'watch'])
