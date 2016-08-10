var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    cp = require('child_process'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    spritesmith = require('gulp.spritesmith'),
    iconfont = require('gulp-iconfont'),
    iconfontCss = require('gulp-iconfont-css'),
    sassUnicode = require('gulp-sass-unicode');

var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/* Build the Jekyll Site */
gulp.task('jekyll-build', ['jsMin'], function (done) {
    browserSync.notify(messages.jekyllBuild);
    var jekyll = process.platform === "win32" ? "jekyll.bat" : "jekyll";
    return cp.spawn(jekyll, ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/* Rebuild Jekyll & do page reload */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    return browserSync.reload();
});

/* Wait for jekyll-build, then launch the Server */
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

/* Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds) */
gulp.task('sass', function () {
    return gulp.src([
            '_scss/index.scss',
            '_scss/vu5.scss',
            '_scss/lotoru.scss',
            '_scss/ssl.scss'
        ])
        .pipe(plumber(function(error) {
            gutil.log(gutil.colors.red(error.message));
            this.emit('end');
        }))
        .pipe(sass({
            includePaths: ['scss'],
            outputStyle: 'expanded',
            onError: browserSync.notify
        }))
        .pipe(sassUnicode())
        .pipe(prefix(['last 2 versions', 'ie 8', 'ie 9'], { cascade: true }))
        .pipe(gulp.dest('_site/assets/css'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('assets/css'));
});

/* Js */
gulp.task('jsConcat', function() {
    return gulp.src([
            '_js/lib/*',
            '_js/vendor/*',
            '_components/**/*.js'
        ])
        .pipe(concat('all.min.js'))
        .pipe(gulp.dest('assets/js'));
});

gulp.task('jsMin', ['jsConcat'], function() {
    return gulp.src(['assets/js/all.min.js'])
        .pipe(plumber(function(error) {
            gutil.log(gutil.colors.red(error.message));
            this.emit('end');
        }))
        .pipe(uglify())
        .pipe(gulp.dest('assets/js'));
});

/* Watch scss files for changes & recompile, watch html/md files, run jekyll & reload BrowserSync */
gulp.task('watch', ['jsMin', 'browser-sync'], function () {
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
        '_pages/**/*',
        '_posts/**/*',
        'assets/img/**/*',
        'assets/fonts/**/*',
        '_config.yml'
    ], ['jekyll-rebuild']);
});

/* Default task, running just `gulp` will compile the sass, compile the jekyll site, launch BrowserSync & watch files. */
gulp.task('default', ['sass', 'jekyll-build']);

/* Payments Sprite */
gulp.task('sprite', function () {
    var spriteData = gulp.src([
        'assets/img/payments/*.png',
        'assets/img/languages/*.png'
    ]).pipe(spritesmith({
        imgName: 'sprite.png',
        imgPath: '../img/sprites/sprite.png',
        cssName: '../../../_scss/vendor/_sprite.scss',
        padding: 12
    }));
    return spriteData.pipe(gulp.dest('assets/img/sprites/'));
});

/* svg fonts task */

gulp.task('fonts', function () {
    var fontName = 'svgFont';

    var projectName = process.argv.slice(3).toString().replace('--', '');
    var opt = {
        src: 'assets/svg/' + projectName + '/*.svg',
        path: '_scss/vendor/fontIconsTemplate/_icons.scss',
        targetPath: '../../../_scss/vendor/_' + projectName + '-icons.scss',
        fontPath: '../fonts/' + projectName +'/',
        dest: 'assets/fonts/' + projectName
    };

    return gulp.src([opt.src])
        .pipe(iconfontCss({
            fontName: fontName,
            path: opt.path,
            targetPath: opt.targetPath,
            fontPath: opt.fontPath,
        })).pipe(iconfont({
            fontName: fontName,
            formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
            normalize: true
        })).pipe(gulp.dest(opt.dest));
});
