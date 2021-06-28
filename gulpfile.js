"use strict";
const ejs = require("gulp-ejs");
const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync");
const minify = require("gulp-clean-css");

/**
 * insère les partials html dans les pages
 *
 * @return  {void} 
 */
function makeTemplate(){
  return gulp.src("./src/templates/pages/*.html")
    .pipe(ejs())
    .pipe(gulp.dest("./www"));
}

function scss2css() {
  return gulp.src("./scss/main.scss")
    .pipe(sass.sync().on("error", sass.logError))
    .pipe(minify())
    .pipe(gulp.dest("./www/css"));
}

function autoUpdate(){
  browserSync.init({
    server: {
      baseDir : "./www"
    }
  });
  gulp.watch("./scss/**/*.scss", scss2css);
  gulp.watch("./www/").on("change", browserSync.reload);
  gulp.watch("./src/templates/**/*.html", makeTemplate);
}

exports.scss2css = scss2css;
exports.watch = autoUpdate;
exports.makeTemplate = makeTemplate;
