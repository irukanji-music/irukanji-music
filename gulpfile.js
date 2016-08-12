var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cp = require('child_process');

var messages = {
    jekyllBuild: 'gulp jekyll-build'
};

// gulp jekyll-build
gulp.task('jekyll-build', ['js-min'], function (done) {
    browserSync.notify(messages.jekyllBuild);
    var jekyll = process.platform === "win32" ? "jekyll.bat" : "jekyll";
    return cp.spawn(jekyll, ['build', '--config', '_config.yml,_config-dev.yml'], {stdio: 'inherit'})
        .on('close', done);
});

// gulp jekyll-rebuild
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

// gulp browser-sync
gulp.task('browser-sync', ['sass'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

// gulp sass
gulp.task('sass', function () {
    return gulp.src([
            '_scss/main.scss'
        ])
        .pipe(plumber(function(error) {
            gutil.log(gutil.colors.red(error.message));
            this.emit('end');
        }))
        .pipe(sass({
            includePaths: ['scss'],
            outputStyle: 'compressed'
        }))
        .pipe(prefix(['last 2 versions', 'ie 8', 'ie 9'], { cascade: true }))
        .pipe(gulp.dest('_site/assets/css/'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('assets/css/'));
});

// gulp js-concat
gulp.task('js-concat', function() {
    return gulp.src([
            '_js/lib/*',
            '_js/vendor/*',
            '_js/main.js',
            '_components/**/*.js',
        ])
        .pipe(concat('all.min.js'))
        .pipe(gulp.dest('assets/js/'));
});

// gulp js-min
gulp.task('js-min', ['js-concat'], function() {
    return gulp.src(['assets/js/all.min.js'])
        .pipe(plumber(function(error) {
            gutil.log(gutil.colors.red(error.message));
            this.emit('end');
        }))
        .pipe(uglify())
        .pipe(gulp.dest('assets/js/'));
});

// gulp watch
gulp.task('watch', ['js-min', 'browser-sync'], function () {
    gulp.watch([
        '_scss/**/*.scss',
        '_components/**/*.scss',
    ], ['sass']);
    gulp.watch([
        '_layouts/*.html',
        '_components/**/*.html',
        '_components/**/*.js',
        '_components/**/*.yml',
        '_components/**/*.json',
        '_js/main.js',
        '_pages/**/*',
        'assets/img/**/*',
        'assets/fonts/**/*',
        '_config-dev.yml'
    ], ['jekyll-rebuild']);
});

// gulp
gulp.task('default', ['sass', 'jekyll-build']);
