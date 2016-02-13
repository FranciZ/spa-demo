var gulp    = require('gulp');
var domSrc  = require('gulp-dom-src');
var cssmin  = require('gulp-cssmin');
var htmlmin = require('gulp-htmlmin');
var uglify  = require('gulp-uglify');
var concat  = require('gulp-concat');
var rename  = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var gCheerio = require('gulp-cheerio');
var streamqueue = require('streamqueue');
var rimraf  = require('rimraf');

var htmlminOptions = {
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    removeAttributeQuotes: true,
    removeComments: true,
    removeEmptyAttributes: true,
    // removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true
};

gulp.task('clean', function() {
    rimraf.sync('dist');
});


gulp.task('css', function() {
    
    var cssStream = domSrc({file:'index.html',selector:'link[data-build!="exclude"]',attribute:'href'});
    
    return cssStream
        .pipe(cssmin({keepSpecialComments: 0}))
        .pipe(concat('app.full.min.css'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('js', function() {

    var jsStream = domSrc({file:'index.html',selector:'script[data-build!="exclude"]',attribute:'src'});

    return jsStream
        .pipe(concat('app.full.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));

});


gulp.task('html', function() {
    return gulp.src('index.html')
        .pipe(gCheerio(function ($) {
            $('script[data-remove!="exclude"]').remove();
            $('link[data-remove!="exclude"]').remove();
            $('body').append('<script src="app.full.min.js"></script>');
            $('head').append('<link rel="stylesheet" href="app.full.min.css">');
        }))
        .pipe(htmlmin(htmlminOptions))
        .pipe(gulp.dest('dist/'));
});

gulp.task('images', function(){
    return gulp.src('img/**')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/'));
});


gulp.task('build', ['clean', 'css', 'js', 'html']);