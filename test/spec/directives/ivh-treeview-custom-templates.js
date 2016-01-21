/*global jQuery, describe, beforeEach, afterEach, it, module, inject, expect */

describe('Directive: ivhTreeview + custom node templates', function() {
  'use strict';

  var nodeTpl, nodeTpl2, bag;

  beforeEach(function() {
    nodeTpl = [
      '<div class="spicy custom template">',
        'It is a {{trvw.label(node)}}',
        '<div ivh-treeview-children></div>',
      '</div>'
    ].join('\n');

    nodeTpl2 = [
      '<div class="spicier custom template">',
        'It is a {{trvw.label(node)}}',
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
      $s.nodeTpl2 = nodeTpl2;
      var $el = c('<div ivh-treeview="bag" ivh-treeview-node-tpl="nodeTpl2"></div>');
      expect($el.find('.spicier.custom.template').length).toBe(2);
    });

    it('should allow templates in the options object', function() {
      $s.opts = {
        nodeTpl: nodeTpl2
      };
      var $el = c('<div ivh-treeview="bag" ivh-treeview-options="opts"></div>');
      expect($el.find('.spicier.custom.template').length).toBe(2);
    });

    it('should use transcluded content as a node template', function() {
      var $el = c([
        '<div ivh-treeview="bag">',
          '<script type="text/ng-template">',
            nodeTpl2,
          '</script>',
        '</div>'
      ].join('\n'));
      expect($el.find('.spicier.custom.template').length).toBe(2);
    });

    it('should be able to expand to children of non-rendered nodes', inject(function($rootScope, ivhTreeviewMgr) {
      var $s = $rootScope.$new();

      $s.bag = [{
        id: 0,
        children: [{
          id: 1,
          children: [{
            id: 2,
            children: [{
              id: 3
            }]
          }]
        }]
      }];

      var $el = c([
        '<div ivh-treeview="bag">',
          '<script type="text/ng-template">',
            '<div class="spicier custom template">',
              '<span id="{{node.id}}"></span>',
              '<div ivh-treeview-children ng-if="trvw.isExpanded(node)"></div>',
            '</div>',
          '</script>',
        '</div>'
      ].join('\n'), $s);
      ivhTreeviewMgr.expandTo($s.bag, 3);
      $s.$apply();
      expect($el.find('#3').length).toBe(1);
    }));

  });

});


