/*jshint node:true */
module.exports = function(config) {
  'use strict';
  config.set({
    autoWatch: true,
    singleRun: false,
    frameworks: ['jasmine'],
    files: [
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'src/scripts/*.js',
      'src/scripts/**/*.js',
      'test/spec/**/*.js'
    ],
    browsers: [process.env.TRAVIS ? 'Firefox' : 'Chrome'],
    reporters: [process.env.TRAVIS ? 'dots' : 'progress'],
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-firefox-launcher'
    ],
    logLevel: config.LOG_INFO
  });
};
