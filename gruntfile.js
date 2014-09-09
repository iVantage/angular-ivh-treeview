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
          'dist/ivh-treeview.css': 'src/styles/ivh-treeview.less',
          'dist/ivh-treeview-theme-basic.css': 'src/styles/ivh-treeview-theme-basic.less'
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

    jasmine: {
      spec: {
        src: ['src/scripts/*.js', 'src/scripts/**/*.js'],
        options: {
          specs: 'test/spec/**/*.js',
          vendor: [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js'
          ]
        }
      }
    },

    watch: {
      scripts: {
        files: 'src/scripts/**/*.js',
        tasks: ['test', 'build:scripts']
      },
      styles: {
        files: 'src/styles/**/*.less',
        tasks: ['build:styles']
      },
      tests: {
        files: 'test/spec/**/*.js',
        tasks: ['test']
      }
    },

    bump: {
      options: {
        commitMessage: 'chore: Bump for release (v%VERSION%)',
        files: ['package.json', 'bower.json'],
        commitFiles: ['package.json', 'bower.json'],
        push: false
      }
    }
  });

  // Load plugins
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('test', [
    'jshint',
    'jasmine'
  ]);

  grunt.registerTask('build:scripts', [
    'concat',
    'uglify'
  ]);

  grunt.registerTask('build:styles', [
    'less',
    'cssmin'
  ]);

  grunt.registerTask('build', [
    'build:scripts',
    'build:styles'
  ]);

  grunt.registerTask('default', [
    'clean',
    'test',
    'build'
  ]);

};
