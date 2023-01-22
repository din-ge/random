// გალპის მოდულების შემოტანა
const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();

// css ფაილების ჩართვის თანმიმდევრობა
const cssFiles = [
   './src/css/main.css',
   './src/css/media.css'
]
//js ფაილების ჩართვის თანმიმდევრობა
const jsFiles = [
   './src/js/lib.js',
   './src/js/main.js'
]

// CSS სტილების ჩართვის ამოცანა
function styles() {
   // CSS ფაილების ძებნის შაბლონი
   // ყველა ფაილი './src/css/**/*.css' შაბლონით
   return gulp.src(cssFiles)
   // ერთ ფაილში გაერთიანება
   .pipe(concat('style.css'))
   // პრეფიქსების დამატება ბრაუზერებისთვის
   .pipe(autoprefixer({
      cascade: false
   }))
   // მინიმიზაცია
   .pipe(cleanCSS({
      level: 2
   }))
   // კატალოგი სადაც ჩადებს
   .pipe(gulp.dest('./build/css'))
   .pipe(browserSync.stream());
}

// JS სკრიპტების ამოცანა
function scripts() {
   // JS ფაილების ძებნის შაბლონი
   // ყველა ფაილი ამ შაბლონით './src/js/**/*.js'
   return gulp.src(jsFiles)
   // ერთ ფაილში
   .pipe(concat('script.js'))
   // მინიფიკაცია JS
   .pipe(uglify({
      toplevel: true
   }))
   // სკრიპტების კატალოგი
   .pipe(gulp.dest('./build/js'))
   .pipe(browserSync.stream());
}

// ჩასუფთავება, ყველა ფაილის წაშლა
function clean() {
   return del(['build/*'])
}

// ფაილების ცვლილებებზე თვალთვალი
function watch() {
   browserSync.init({
      server: {
          baseDir: "./"
      }
  });
  // CSS ფაილებზე თვალთვალი
  gulp.watch('./src/css/**/*.css', styles)
  // JS ფაილების თვალთვალი
  gulp.watch('./src/js/**/*.js', scripts)
  // HTML-ის შეცვლის შემთხვევაში იქნება სინქრონიზაცია
  gulp.watch("./*.html").on('change', browserSync.reload);
}

// ამოცანა, რომელიც იძახებს styles
gulp.task('styles', styles);
// ამოცანა, რომელიც იძახებს  scripts
gulp.task('scripts', scripts);
// ამოცანა, რომელიც ჩაასუფთავებს  build-ს
gulp.task('del', clean);
// ამოცანა ცვლილებების სათვალთვალოდ
gulp.task('watch', watch);
// ამოცანა, რომელიც წაშლის ფაილებს  build-ში და გაუშვებს  styles და scripts
gulp.task('build', gulp.series(clean, gulp.parallel(styles,scripts)));
// ამოცანა გაუშვებს  build-ს და watch-ს ერთმანეთის მიყოლებით
gulp.task('dev', gulp.series('build','watch'));