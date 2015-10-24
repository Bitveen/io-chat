var gulp = require('gulp'),
    sass = require('gulp-sass');


gulp.task('sass', function() {
    gulp.src('assets/sass/style.scss')
        .pipe(sass({ outputType: 'compressed' }).on('error', sass.logError))
        .pipe(gulp.dest('public/css'));
});

gulp.task('sass:watch', function() {
    gulp.watch('assets/sass/*.scss', ['sass']);
});