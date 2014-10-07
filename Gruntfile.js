module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		bower_concat: {							// Puts all bower js into one file
			all : {
				dest: 'build/js/_bower.js',
				dependencies: {
					'Jcrop':'jquery'
				}
			}
		},
		
		cssmin: {								// Minifies css into one file
			combine: {
				files: {
					'public/stylesheets/style.min.css' : 'build/css/*.css'
				}
			}
		},
		
		compass: {								// Uses compass to compile SCSS
			dist: {
				options: {
					sassDir: 'scss',
					cssDir: 'build/css'
				}
			}
		},
		
		uglify: {								// Concats and minifies all js into one file
			my_target: {
				files: {
					'public/javascript/main.min.js' : 'build/js/*.js'
				}
			}
		},
		watch: {
			
			scss: {								// Anytime a scss file is changed, grunt compiles the SCSS
				files: ['scss/**/*.scss','bower_components/foundation/**/*.scss'],
				tasks: 'compass'
			},
			
			css: {								// Anytime a css file is changed, grunt minifies it into the public folder
				files: 'build/css/*.css',
				tasks: 'cssmin'
			},
			
			bower: {							// Anytime a change happens to bower packages, all bower javascript is combined into one file
				files: 'bower_components/**/*.js',
				tasks: ['bower_concat', 'uglify']
			},

			js: {								// Anytime a js file is changed, grunt compiles all js files into one and minifies it
				files: 'build/js/*.js',
				tasks: 'uglify'
			}
		}
	});
	grunt.loadNpmTasks('grunt-bower-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin')

	grunt.registerTask('default', ['bower_concat', 'compass', 'cssmin', 'uglify']);
}