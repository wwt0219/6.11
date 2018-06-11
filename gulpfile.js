var gulp = require('gulp');
var minCss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var server = require('gulp-webserver');
var fs = require('fs');
var url = require('url');
var path = require('path');
var sequence = require('gulp-sequence');

gulp.task('server', function() {
    return gulp.src('src')
        .pipe(server({
            port: 8080,
            livereload: true,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;
                if (req.url === '/favicon.ico') {
                    return false
                }
                if (pathname === '/list') {
                    res.end(JSON.stringify({ code: 0, msg: 'wwt' }))
                } else {
                    pathname = pathname === '/' ? '/index.html' : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)))
                }
            }
        }))
});

gulp.task('srcCss', function() {
    return gulp.src('src/css/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('src/css'))
})

gulp.task('buildCss', function() {
    return gulp.src('src/css/*.scss')
        .pipe(sass())
        .pipe(concat('all.css'))
        .pipe(minCss())
        .pipe(gulp.dest('build/css'))
})

gulp.task('srcJs', function() {
    return gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('src/js'))
})


gulp.task('buildJs', ['srcJs'], function() {
    return gulp.src('src/js/*.js')
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/js'))
})
gulp.task('clean', function() {
    return gulp.src('build')
        .pipe(clean())
})

gulp.task('build', function(cb) {
    sequence('clean', 'srcCss', 'buildCss', 'srcJs', 'buildJs', 'server', cb)
})