var gulp         = require('gulp');
var sass         = require('gulp-sass');
var cleanCSS     = require('gulp-clean-css');
var concat       = require('gulp-concat');
var uglify       = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var spritesmith  = require('gulp.spritesmith');
var runSequence  = require('run-sequence');

/**
 * Compile and minify SCSS
 */
gulp.task('sass', function () {
    return gulp.src('../assets/scss/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(gulp.dest('../www/css'));
});

/**
 * Concat and minify JS
 */
gulp.task('concat', function() {
    return gulp.src('../assets/js/*js')
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('../www/js'));
});

/**
 * Generate sprite and css file from PNGs
 */
gulp.task('sprites', function () {

    var options = {
        cssName: '_sprites.scss',
        cssFormat: 'scss',
        cssOpts: {
            cssClass: function (item) {
                // If this is a hover sprite, name it as a hover one (e.g. 'home-hover' -> 'home:hover')
                if (item.name.indexOf('-hover') !== -1) {
                    return '.icon-' + item.name.replace('-hover', ':hover');
                    // Otherwise, use the name as the selector (e.g. 'home' -> 'home')
                } else {
                    return '.icon-' + item.name;
                }
            }
        },
        imgName: 'sprite.png',
        imgPath: '../images/design/sprite.png' // Imgpath par rapport au fichier css minifié
    };

    var spriteData = gulp.src('../assets/images/sprites/**/*.png').pipe(spritesmith(options));

    spriteData.img
        .pipe(gulp.dest('../www/images'));

    spriteData.css
        .pipe(gulp.dest('../assets/scss'));
});

/**
 * Watch task
 */
gulp.task('watch', function () {
    gulp.watch('../assets/scss/*scss', ['sass']);
    gulp.watch('../assets/js/*js', ['concat']);
    gulp.watch('../assets/images/sprites/**/*.png', ['sprites']);
});


/**
 * Build all assets
 */
gulp.task('build', function() {
    runSequence('sass', 'concat', 'sprites');
});