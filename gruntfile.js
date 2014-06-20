/*jshint node:true */

module.exports = function(grunt) {
  'use strict';

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: 'gruntfile.js',
      src: 'src/**/*.js',
      test: 'test/**/*.js'
    },

    clean: {
      dist: 'dist'
    },

    concat: {
      options: {separator: '\n'},
      dist: {
        src: ['src/scripts/module.js', 'src/scripts/**/*.js'],
        dest: 'dist/ivh-treeview.js'
      }
    },

    uglify: {
      dist: {
        src: 'dist/ivh-treeview.js',
        dest: 'dist/ivh-treeview.min.js'
      }
    },

    less: {
      dist: {
        files: {
          'dist/ivh-treeview.css': 'src/styles/**/*.less'
        }
      }
    },

    cssmin: {
      dist: {
        files: {
          'dist/ivh-treeview.min.css': 'dist/ivh-treeview.css'
        }
      }
    },

    watch: {
      livereload: {
        options: {
          livereload: true
        },
        files: ['src/scripts/**/*.js', 'src/styles/**/*.less'],
        tasks: ['jshint', 'build']
      }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js',
        autoWatch: false,
        singleRun: true,
        browsers: [process.env.KARMA_BROWSER || 'Firefox']
      }
    },
    
    bump: {
      options: {
        commitMessage: 'chore: Bump for release (v%VERSION%)',
        files: ['package.json', 'bower.json'],
        commitFiles: ['-a'],
        push: false
      }
    }
  });

  // Load plugins
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Register tasks
  grunt.registerTask('serve', [
    'clean',
    'jshint',
    'build',
    'watch'
  ]);

  grunt.registerTask('server', ['serve']);

  grunt.registerTask('test', [
    'jshint',
    //'karma'
  ]);

  grunt.registerTask('build', [
    'concat',
    'uglify',
    'less',
    'cssmin'
  ]);

  grunt.registerTask('default', [
    'clean',
    'test',
    'build'
  ]);

};
