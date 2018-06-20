// ////////////////////////////////////////////////
//
// EDIT CONFIG OBJECT BELOW !!!
// 
// jsConcatFiles => list of javascript files (in order) to concatenate
// buildFilesFoldersRemove => list of files to remove when running final build
// // //////////////////////////////////////////////

var config = {
	jsConcatFiles: [
		'./app/js/main.js'
	], 
	buildFilesFoldersRemove:[
		'build/scss/', 
		'build/js/!(*.min.js)',
		'build/maps/'
	]
};


// ////////////////////////////////////////////////
// Required taskes
// gulp build
// bulp build:serve
// // /////////////////////////////////////////////

var gulp 				= require('gulp'),
	sass 				= require('gulp-sass'),
	sourcemaps 			= require('gulp-sourcemaps'),
	autoprefixer 		= require('gulp-autoprefixer'),
	browserSync 		= require('browser-sync'),
	reload 				= browserSync.reload,
	plumber 			= require('gulp-plumber');
	filter 				= require('gulp-filter');
	concat 				= require('gulp-concat'),
	uglify 				= require('gulp-uglify'),
	rename 				= require('gulp-rename'),
	del 				= require('del');


// ////////////////////////////////////////////////
// Log Errors
// // /////////////////////////////////////////////

function errorlog(err){
	console.error(err.message);
	this.emit('end');
}


// ////////////////////////////////////////////////
// Scripts Tasks
// ///////////////////////////////////////////////

gulp.task('scripts', function() {
  return gulp.src(config.jsConcatFiles)
	.pipe(sourcemaps.init())
		.pipe(concat('functions.js'))
		.pipe(uglify())
		.on('error', errorlog)
		.pipe(rename('app.min.js'))		
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('./app/js/'))

    .pipe(reload({stream:true}));
});


// ////////////////////////////////////////////////
// Styles Tasks
// ///////////////////////////////////////////////

gulp.task('sass', function () {
	// Sass plugins
	var sass_plugins = [
		// autoprefixer({ browsers: ['last 3 version'] })
	];

	// Sass task error handler
	var errorHandler = function(errorObj) {
		// Notify the user
		browserSync.notify('Error: ' + beautifyMessage(errorObj.message));

		// Post the message in the console
		console.log(errorObj.message);

		// End this task
		this.emit('end');
	};

	var pipeErrorHandler = plumber(errorHandler);

	var task = gulp.src('app/scss/style.scss')
		.pipe(pipeErrorHandler) 							// Prevent pipe breaking caused by errors from gulp plugins
		.pipe(sourcemaps.init())							// source map init
		.pipe(sass( {
			plugins: sass_plugins
		}).on('error', errorHandler))						// Sass
		.pipe(sourcemaps.write( '.' ))						// sourcemap write
		.pipe(gulp.dest( 'app/css' )) 							// save css file
		.pipe(filter('**/*.css')) 							// filter only css files (remove the map file)
		.pipe(reload({stream: true})); 						// inject the changed css


	return task;
});


// ////////////////////////////////////////////////
// HTML Tasks
// // /////////////////////////////////////////////

gulp.task('html', function(){
    gulp.src('app/**/*.html')
    .pipe(reload({stream:true}));
});


// ////////////////////////////////////////////////
// Browser-Sync Tasks
// // /////////////////////////////////////////////

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./app/"
        }
    });
});

// task to run build server for testing final app
gulp.task('build:serve', function() {
    browserSync({
        server: {
            baseDir: "./build/"
        }
    });
});


// ////////////////////////////////////////////////
// Build Tasks
// // /////////////////////////////////////////////

// clean out all files and folders from build folder
gulp.task('build:cleanfolder', function (cb) {
	del([
		'build/**'
	], cb);
});

// task to create build directory of all files
gulp.task('build:copy', ['build:cleanfolder'], function(){
    return gulp.src('app/**/*/')
    .pipe(gulp.dest('build/'));
});

// task to removed unwanted build files
// list all files and directories here that you don't want included
gulp.task('build:remove', ['build:copy'], function (cb) {
	del(config.buildFilesFoldersRemove, cb);
});

gulp.task('build', ['build:copy', 'build:remove']);


// ////////////////////////////////////////////////
// Watch Tasks
// // /////////////////////////////////////////////

gulp.task ('watch', function(){
	gulp.watch('app/scss/**/*.scss', ['sass']);
	gulp.watch('app/js/**/*.js', ['scripts']);
  	gulp.watch('app/**/*.html', ['html']);
});


gulp.task('default', ['scripts', 'sass', 'html', 'browser-sync', 'watch']);


// Helpers

/**
 * Prepare message for browser notify.
 * @param  {string} message raw message
 * @return {string}         parsed message - new lines replaced by html elements.
 */
function beautifyMessage(message) {
	return '<p style="text-align: left">' + message.replace(/\n/g, '<br>') + '</p>';
};