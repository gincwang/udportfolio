var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

gulp.task('minify', function() {
    return gulp.src('views/js/*.js')
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'))
});
