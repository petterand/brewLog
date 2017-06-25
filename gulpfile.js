var gulp = require('gulp');
var concat = require('gulp-concat');
var less = require('gulp-less');
var merge = require('merge-stream');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');
var minifycss = require('gulp-minify-css');
var notifier = require('node-notifier')


var srcFiles = {
    css: ['./node_modules/materialize-css/dist/css/materialize.css'],
    less: ['app/web/less/*.less'],
    js: ['./node_modules/angular/angular.js', './app/web/js/**/*.js']

}

gulp.task('clean', function(cb) {
    del(['build/**']).then(function() {
        cb();
    });
});

gulp.task('css', ['clean'], function() {
    var cssStream = gulp.src(srcFiles.css)
        .pipe(concat('style.css'));

    var lessStream = gulp.src('./app/web/less/style.less')
        .pipe(less());

    var mergedStream = merge(cssStream, lessStream)
        .pipe(concat('style.css'))
        .pipe(minifycss())
        .pipe(gulp.dest('./build/css'));

    return mergedStream;
});

gulp.task('js', ['clean'] ,function() {
    return gulp.src(srcFiles.js)
        .pipe(sourcemaps.init())
        .pipe(concat('script.js'))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./build/js/'));
});

gulp.task('html', ['clean'], function() {
    gulp.src('./app/web/html/index.html')
        .pipe(gulp.dest('./build/'));
});

gulp.task('build', ['css','js', 'html'], function() {
    notifier.notify({
        title: 'Build done',
        message: 'The build is done!',
        timeout: 3
    });

});


gulp.task('default', ['build']);