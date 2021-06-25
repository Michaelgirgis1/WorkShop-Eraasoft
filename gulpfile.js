var gulp = require('gulp'),
    concat = require('gulp-concat'),
    prefix = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    beeper = require('beeper'),
    notifier = require('node-notifier'),
    cleanCSS = require('gulp-clean-css'),
    minify = require('gulp-minify');

gulp.task('SassCompile', function () {

    return gulp.src(['Content/SASS/main-rtl.scss', 'Content/SASS/main-ltr.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', function (err) {
            console.log(`-----------------------------------------------------------------`);
            console.log(err.message);
            console.log(`-----------------------------------------------------------------`);
            beeper();

            notifier.notify(
                {
                    title: 'Sass Error Compiling',
                    message: `Error in File : ${err.relativePath} \nError in Line : ${err.line} , Column : ${err.column} `,
                    sound: false,
                    wait: false,
                    timeout: 1
                },
                function (err, response) {
                    // Response is response from notification
                }
            );
            this.emit('end');
        }))
        .pipe(prefix('last 2 versions'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('Content/CSS'));
});
gulp.task('concatMinifyAllRtlCss', function () {

    return gulp.src(['../Content/CSS/Vendor/rtl/bootstrapRTL.min.css', '../Content/CSS/Vendor/*.css', '../Content/CSS/main-rtl.css'])
        .pipe(sourcemaps.init())
        .pipe(concat('rtlMinStyle.min.css'))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('../Content/CSS/minifiedStyles'));
});
gulp.task('concatMinifyAllLtrCss', function () {

    return gulp.src(['../Content/CSS/Vendor/ltr/bootstrapLTR.min.css', '../Content/CSS/Vendor/*.css', '../Content/CSS/main-ltr.css'])
        .pipe(sourcemaps.init())
        .pipe(concat('ltrMinStyle.min.css'))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('../Content/CSS/minifiedStyles'));
});


gulp.task('watch', function () {
    gulp.watch(['Content/SASS/*/*.scss', 'Content/SASS/*.scss'], gulp.series(['SassCompile']));
    // gulp.watch('Content/SASS/*/*.scss', gulp.series(['SassCompile','concatMinifyAllRtlCss','concatMinifyAllLtrCss']));

     //gulp.watch('Content/Scripts/Pages/*.js', gulp.series('jsCompress'));
});