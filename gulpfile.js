'use strict';

var gulp = require("gulp");
var uglify = require("gulp-uglify-es").default;
var gulpConcat = require("gulp-concat");
var merge2 = require("merge2");
var packageJson = require("./package.json");
var browserify = require('browserify');
var path = require("path");
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
//var log = require('gulplog');

var module_list = ["./node_modules/cytoscape/dist/cytoscape.js"];


gulp.task("build", function() {
  var c = gulp.src("./js/*.js");
  var j = gulp.src(module_list);

  merge2([j, c])
    .pipe(gulpConcat("./dist/grapholscape.js"))
    .pipe(gulp.dest("."));
});


gulp.task("uglify", function() {
  var c = gulp.src("./js/*.js");
  var j = gulp.src(module_list);

  merge2([j, c])
    .pipe(gulpConcat("./dist/grapholscape_min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("."));
});


gulp.task("browserify", function() {
  var b = browserify({
    entries: './js/main.js',
    debug: true
  });


  b.bundle()
    .pipe(source('grapholscape.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        //.pipe(uglify())
        //.on('error', log.error)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/'));

})


gulp.task("release", function() {
  gulp.src("").pipe(
    electron({
      src: ".",
      packageJson: packageJson,
      release: "./release",
      cache: "./cache",
      version: "v0.37.4",
      packaging: true,
      platforms: ["linux"]
    })
  );
});


gulp.task("watch", function() {
  gulp.watch("./js/**/*.js", ["browserify"]);
});


gulp.task("default", ["build", "watch"]);
