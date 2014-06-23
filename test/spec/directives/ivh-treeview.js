/*global jQuery, describe, beforeEach, afterEach, it, module, inject, expect */

describe('Directive ivhTreeview', function() {
  'use strict';

  var ng = angular
    , $ = jQuery;

  var scope, compile;

  beforeEach(module('ivh.treeview'));

  var tplBasic = '<div ivh-treeview="bag1"></div>';

  var tplFilter = [
    '<div',
      'ivh-treeview="bag1"',
      'ivh-treeview-filter="filter:myFilter"',
      '></div>'
  ].join('\n');

  beforeEach(inject(function($rootScope, $compile, $timeout) {
    scope = $rootScope.$new();
    scope.bag1 = [{
      label: 'top hat',
      children: [{
        label: 'flat cap'
      },{
        label: 'fedora',
        children: [{label: 'gatsby'}]
      }]
    },{
      label: 'baseball'
    }];

    compile = function(tpl, scp) {
      var $el = $compile(ng.element(tpl))(scp);
      scp.$apply();
      $timeout.flush();
      return $el;
    };
  }));

  describe('basics', function() {
    var $el;

    beforeEach(function() {
      $el = compile(tplBasic, scope);
    });

    it('should create a tree layout', function() {
      expect($el
        .find('ul').eq(0) // Entire tree
        .find('ul').eq(0) // tree.children (flat cap tree)
        .find('ul').eq(0) // tree.children.children (gasby tree)
        .find('li').length
      ).toBe(1);
    });

    /**
     * @todo Collapsing/Expanding
     */
  });

  describe('filtering', function() {
    var $el;

    beforeEach(function() {
      scope.myFilter = 'baseball';
      $el = compile(tplFilter, scope);
    });

    it('should hide filtered out nodes', function() {
      expect(scope.bag1[0].__ivhTreeviewVisible).toBe(false);
      expect(scope.bag1[1].__ivhTreeviewVisible).toBe(true);
    });
  });
});
