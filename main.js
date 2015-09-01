/*global jQuery, angular, hljs */

/**
 * Main site scripts for Angular IVH Treeview
 *
 * @copyright 2015 iVantage
 */

(function($, ng) {
'use strict';

var demo = ng.module('demo', ['ivh.treeview']);

demo.controller('SillyCtrl', function(ivhTreeviewMgr) {
  var self = this;

  self.stuff = [{
    label: 'Suitcase',
    children: [
      { label: 'Jacket' },
      { label: 'Shoes' },
      {
        label: 'Hat box',
        selected: true,
        children: [
          { label: 'Fedora' },
          { label: 'Flat cap' },
          { label: 'Top hat' },
          { label: 'Five panel' }
        ]
      }
    ]
  }];

  self.setLastToggle = function(node, tree) {
    // `tree` is not used here, just demonstrating its availability for your
    // callback expressions.
    self.lastToggle = node.label;
  };

  self.tplFolderOpen = '<span class="twistie glyphicon glyphicon-folder-open"></span>';
  self.tplFolderClose = '<span class="twistie glyphicon glyphicon-folder-close"></span>';
  self.tplLeaf = '<span class="twistie glyphicon glyphicon-map-marker"></span>';
});

demo.directive('sillyTreeNode', function() {
  return {
    restrict: 'AE',
    templateUrl: 'silly-tree-node.html'
  };
});

demo.directive('sillyRightSizeInput', function() {
  return {
    restrict: 'AE',
    link: function(scope, element, attrs) {
      scope.$watch(attrs.ngModel, function(newVal) {
        var newSize = Math.max(10, (newVal || '').length);
        element.attr('size', newSize);
      });
    }
  };
});

demo.directive('sillyAsciiBox', function(ivhTreeviewMgr) {
  return {
    restrict: 'AE',
    require: '^ivhTreeview',
    template: [
      '<span class="silly-ascii-box">[',
        '<span ng-show="node.selected" class="x">x</span>',
        '<span ng-show="node.__ivhTreeviewIndeterminate" class="y">~</span>',
        '<span ng-hide="node.selected || node.__ivhTreeviewIndeterminate"> </span>',
      ']</span>',
    ].join(''),
    link: function(scope, element, attrs, trvw) {
      element.on('click', function() {
        ivhTreeviewMgr.select(trvw.getRoot(), scope.node, !scope.node.selected);
        scope.$apply();
      });
    }
  };
});

$(document).ready(function() {
  $('pre').each(function(ix, block) {
    hljs.highlightBlock(block);
  });
});

}(jQuery, angular, hljs));
