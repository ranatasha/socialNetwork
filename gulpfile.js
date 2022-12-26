import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import dartSass from 'sass';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';

const { src, dest, series, watch } = gulp;
const sass = gulpSass(dartSass);

const paths = {
    styles: {
        src: 'public/assets/sass/*.sass',
        dest: 'build-gulp/public/styles/',
        destDev: 'public/assets/css'
    },
    js: {
        server: {
            src: ['**/*.js', '!public/**/*.js'],
            dest: 'build-gulp',
            entry: 'app.js',
            name: 'app.cjs',
        },
        public: {
            src: 'public/scripts/**/*.js',
            dest: 'build-gulp/public/scripts',
        },
    },
    pug: {
        src: 'views/**/*.pug',
        dest: 'build-gulp/views',
    },
};

const jsPublic = () => {
    return src(paths.js.public.src)
        .pipe(babel({ presets: ['@babel/env'] }))
        .pipe(uglify())
        .pipe(dest(paths.js.public.dest));
};

const css = (destination) => {
    return src(paths.styles.src)
        .pipe(
            sass({
                outputStyle: 'compressed',
            }).on('error', sass.logError)
        )
        .pipe(dest(destination));
};
const cssProd = () => css(paths.styles.dest);
const cssDev = () => css(paths.styles.destDev);
const sasswatch = () => {
    watch(paths.styles.src, cssDev)
}

const views = () => {
    return src(paths.pug.src).pipe(dest(paths.pug.dest));
};

const build = series(cssProd, jsPublic, views);

export { cssDev, sasswatch, build };
export default build;