/*global jQuery, describe, beforeEach, afterEach, it, module, inject, expect */

describe('Directive ivhTreeview', function() {
  'use strict';

  var ng = angular
    , $ = jQuery;

  var scope, compile;

  beforeEach(module('ivh.treeview'));

  var tplBasic = '<div ivh-treeview="bag1"></div>';
  var tplObjRoot = '<div ivh-treeview="bag1[0]"></div>';

  var tplFilter = [
    '<div',
      'ivh-treeview="bag1"',
      'ivh-treeview-filter="filter:myFilter"',
      '></div>'
  ].join('\n');

  beforeEach(inject(function($rootScope, $compile) {
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
      return $el;
    };
  }));

  describe('basics', function() {
    var $el;

    it('should create a tree layout', function() {
      $el = compile(tplBasic, scope);
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
     
    it('should allow roots objects', function() {
      $el = compile(tplObjRoot, scope);
      expect($el.find('ul').eq(0).find('ul').length).toBe(2);
    });
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
