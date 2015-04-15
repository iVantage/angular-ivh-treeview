/*global jQuery, describe, beforeEach, afterEach, it, module, inject, expect */

describe('Directive: ivhTreeview + custom node templates', function() {
  'use strict';

  var nodeTpl, bag;

  beforeEach(function() {
    nodeTpl = [
      '<div class="spicy custom template">',
        'It is a {{ctrl.label(node)}}',
        '<div ivh-treeview-children></div>',
      '</div>'
    ].join('\n');

    bag = [{
      label: 'parent',
      children: [{
        label: 'child'
      }]
    }];
  });


  it('should allow custom templates using the global settings', function() {
    module('ivh.treeview', function(ivhTreeviewOptionsProvider) {
      ivhTreeviewOptionsProvider.set({
        nodeTpl: nodeTpl
      });
    });

    inject(function($rootScope, $compile) {
      var $s = $rootScope.$new();
      $s.bag = bag;

      var $el = $compile('<div ivh-treeview="bag"></div>')($s);
      $s.$apply();

      expect($el.find('.spicy.custom.template').length).toBe(2);
    });
  });

  describe('non-global templates', function() {
    var $s, c;
    beforeEach(module('ivh.treeview'));
    beforeEach(inject(function($rootScope, $compile) {
      $s = $rootScope.$new();
      $s.bag = bag;
      c = function(tpl, scp) {
        scp = scp || $s;
        var $el = $compile(tpl)(scp);
        scp.$apply();
        return $el;
      };
    }));

    it('should allow inline template definitions', function() {
      $s.nodeTpl = nodeTpl;
      var $el = c('<div ivh-treeview="bag" ivh-treeview-node-tpl="nodeTpl"></div>');
      expect($el.find('.spicy.custom.template').length).toBe(2);
    });

    it('should allow templates in the options object', function() {
      $s.opts = {
        nodeTpl: nodeTpl
      };
      var $el = c('<div ivh-treeview="bag" ivh-treeview-options="opts"></div>');
      expect($el.find('.spicy.custom.template').length).toBe(2);
    });

    it('should use transcluded content as a node template', function() {
      var $el = c('<div ivh-treeview="bag">' + nodeTpl + '</div>');
      expect($el.find('.spicy.custom.template').length).toBe(2);
    });

  });

});


