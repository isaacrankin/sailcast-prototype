module.exports = function(grunt) {

	// Load all grunt tasks automatically
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
	require('time-grunt')(grunt);

	grunt.initConfig({

		// Import package manifest
		pkg: grunt.file.readJSON("package.json"),

		// Import build config
		config: grunt.file.readJSON("config.json"),

		// Banner definition
		meta: {
			banner: "/*\n" +
				" *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
				" *  <%= pkg.description %>\n" +
				" *  <%= pkg.repository %>\n" +
				" *\n" +
				" *  Made by <%= pkg.author.name %>\n" +
				" *  Under <%= pkg.license %> License\n" +
				" */\n"
		},

		usebanner: {
			taskName: {
				options: {
					position: 'top' || 'bottom',
					banner: '<%= meta.banner %>',
					linebreak: true || false
				},

				files: {
					src: [ '<%= config.outputPath %>scripts/main.min.js', '<%= config.outputPath %>styles/main.css' ]
				}
			}
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc',
				ignores: [
					'<%= config.workingPath %>scripts/plugins.js'
				]
			},

			all: [
				'<%= config.workingFiles.scripts %>'
			]
		},

		imagemin: {
			png: {
				options: {
					optimizationLevel: 7
				},

				files: [
					{
						expand: true,
						cwd: '<%= config.workingPath %>images/',
						src: ['**/*.png'],
						dest: '<%= config.outputPath %>images/',
						ext: '.png'
					}
				]
			},
			jpg: {
				options: {
					progressive: true,
				},

				files: [
					{
						expand: true,
						cwd: '<%= config.workingPath %>images/',
						src: ['**/*.jpg'],
						dest: '<%= config.outputPath %>images/',
						ext: '.jpg'
					}
				]
			}
		},

		sass: {
			options: {
				style: 'compressed',
				sourcemap: true
			},

			dist: {
				files: [{
					expand: true,
					cwd: 'styles',
					src: ['*.scss'],
					dest: '<%= config.outputPath %>styles',
					ext: '.css'
				}]
			}
		},

		autoprefixer: {

			// prefix the specified file
			single_file: {
				src: '<%= config.outputPath %>styles/main.css'
			}
		},

		copy: {
			main: {
				files: [
					{
						expand: true,
						flatten: true,
						src: ['<%= config.vendorPath %>normalize-css/normalize.css'],
						dest: '<%= config.outputPath %>styles/vendor/'
					}
				]
			},

			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= config.workingPath %>',
					dest: '<%= config.outputPath %>',
					src: [
						'*.{ico,txt,html}',
						'favicon.png',
						'apple-touch-icon-precomposed.png',
						'fonts/{,*/}*.*'
					]
				}]
			},

			// Copy over working scripts, referenced by sourcemaps
			scripts: {
				files: [
					{
						expand: true,
						cwd: '<%= config.workingPath %>scripts/',
						src: ['**'],
						dest: '<%= config.outputPath %>scripts/src/'
					}
				]
			}
		},

		concat: {
			working: {
				src: '<%= config.workingFiles.scripts %>',
				dest: '<%= config.outputPath %>scripts/main.min.js'
			},

			vendor: {
				src: '<%= config.vendorFiles.scripts %>',
				dest: '<%= config.outputPath %>scripts/lib.min.js'
			}
		},

		cssmin: {
			minify: {
				expand: true,
				cwd: '<%= config.outputPath %>styles/vendor/',
				src: ['*.css', '!*.min.css'],
				dest: '<%= config.outputPath %>styles/vendor/'
			}
		},

		uglify: {
			vendor: {
				files: {
					'<%= config.outputPath %>scripts/lib.min.js': '<%= config.vendorFiles.scripts %>'
				}
			},

			modernizr: {
				files: {
					'<%= config.outputPath %>scripts/vendor/modernizr.min.js': '<%= config.vendorPath %>modernizr/modernizr.js'
				}
			},

			main: {
				files: {
					'<%= config.outputPath %>scripts/main.min.js': '<%= config.workingFiles.scripts %>'
				},
				options:{
					sourceMappingURL: "main.map",
					sourceMap: "<%= config.outputPath %>scripts/main.map",
					sourceMapRoot: "src/",
					sourceMapPrefix: 2
				}
			}
		},

		watch: {
			css: {
				files: ['<%= config.workingPath %>styles/{,*/}*.{scss,sass}'],
				tasks: ['sass', 'autoprefixer', 'notify:watch_styles']
			},

			js: {
				files: ['<%= config.workingPath %>scripts/*.js'],
				tasks: ['copy:scripts', 'concat:working', 'notify:watch_scripts']
			}
		},

		notify: {
			watch_styles: {
				options: {
					message: 'Finished compiling styles'
				}
			},
			watch_scripts: {
				options: {
					message: 'Finished compiling scripts'
				}
			},
			deploy: {
				options: {
					message: 'Finished deploying'
				}
			}
		},

		'ftp-deploy': {
			build: {
				auth: {
					host: 's163823.gridserver.com',
					port: 21,
					authKey: 'gridserver'
				},
				src: '<%= config.outputPath %>',
				dest: '/sailcast.isaacrankin.com/html',
				exclusions: [
					'<%= config.outputPath %>.DS_Store',
					'<%= config.outputPath %>Thumbs.db'
				]
			}
		},

		// Mocha
		mocha: {
			all: {
				src: ['tests/testrunner.html']
			},
			options: {
				run: true
			}
		}
	});

	// Default task for production
	grunt.registerTask('default',
		[
			'sass',
			'mocha',
			'jshint',
			'copy',
			'cssmin',
			'autoprefixer',
			'uglify:modernizr',
			'uglify:main',
			'concat:vendor',
			'imagemin',
			'usebanner'
		]
	);

	grunt.registerTask('deploy',
		[
			'default',
			'ftp-deploy',
			'notify:deploy'
		]
	);

	// Compress image in build directory
	grunt.registerTask('image-min',
		[
			'imagemin'
		]
	);
};