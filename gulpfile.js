var gulp = require("gulp");
var server = require("browser-sync").create();
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var rename = require("gulp-rename");
var minify = require("gulp-csso");
var imagemin = require("gulp-imagemin");
// var webp = require("gulp-webp");
var del = require("del");
var htmlmin = require("gulp-htmlmin");

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/*.{woff,woff2}"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
  return del("build");
});

gulp.task("images", function() {
	return gulp.src("source/img/**")
	.pipe(imagemin([
			imagemin.optipng({optimizationLevel: 3}),
			imagemin.mozjpeg({quality: 75, progressive: true}),
			imagemin.svgo()
		]))
	.pipe(gulp.dest("build/img"));
});

// gulp.task("webp", function() {
// 	return gulp.src("source/img/*.{png,jpg,jpeg}")
// 	.pipe(webp({quality: 75}))
// 	.pipe(gulp.dest("build/img"));
// });

gulp.task("style", function() {
  return gulp.src("source/sass/style.scss")
  .pipe(plumber())
  .pipe(sass())
  .pipe(postcss([
        autoprefixer()
    ]))
  .pipe(minify())
  .pipe(rename("style.min.css"))
  .pipe(gulp.dest("build/css"))
  .pipe(server.stream());
});

gulp.task("html", function() {
  return gulp.src("source/*.html")
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest("build"));
});

gulp.task("serve", function() {
  server.init({
    server: "build/"
  });
  gulp.watch("source/sass/**/*.{scss,sass}", gulp.parallel("style"));
  gulp.watch("source/*.html", gulp.parallel("html"))
    .on("change", server.reload);
});

gulp.task("build", gulp.series("clean", "copy", "images", "style", "html", "serve"));