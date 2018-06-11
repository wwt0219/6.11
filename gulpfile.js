var gulp = require('gulp');
var minCss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var server = require('gulp-webserver');
var fs = require('fs');
var url = require('url');
var path = require('path')

gulp.task('server', function() {
    gulp.src('src')
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
    gulp.src('src/css/*.css')
        .pipe(sass())
        .pipe(gulp.dest('src/css'))
})

// gulp.task('srcCss', function() {
//     gulp.src('src/css/*.css')
//         .pipe(sass())
//         .pipe(concat('all.js'))
//         .pipe(gulp.dest('src/css'))
// })

gulp.task('srcjs', function() {
    gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('src/js'))
})