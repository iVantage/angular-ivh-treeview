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

demo.directive('sillyTreeNode', function(ivhTreeviewMgr, ivhTreeviewBfs) {
  return {
    restrict: 'AE',
    templateUrl: 'silly-tree-node.html',
    require: '^ivhTreeview',
    link: function(scope, element, attrs, trvw) {
      var root = trvw.getRoot();

      var labellify = function(label, nodes) {
        var ix = 1;
        var hasLabel = function(node) {
          return node.label === label + ' ' + ix;
        };
        while($.grep(nodes, hasLabel).length) { ix++; }
        return label + ' ' + ix;
      };

      scope.kill = function(nodeToKill) {
        var cont = true;
        ivhTreeviewBfs(root, function(node, parents) {
          if(node === nodeToKill) {
            cont = false;
            if(parents.length) {
              var nIx = parents[0].children.indexOf(node);
              parents[0].children.splice(nIx, 1);
              ivhTreeviewMgr.validate(root, trvw.opts());
            } else {
              root.length = 0;
            }
          }
          return cont;
        });
      };

      scope.spawn = function(nodeSire) {
        var cont = true;
        ivhTreeviewBfs(root, function(node) {
          if(node === nodeSire) {
            cont = false;
            node.children = node.children || [];
            var spawned = angular.copy(node);
            spawned.children = [];
            spawned.label = labellify(node.label, node.children);
            node.children.unshift(spawned);
            ivhTreeviewMgr.validate(root, trvw.opts());
          }
          return cont;
        });
      };
    }
  };
});

demo.directive('sillyRightSizeInput', function() {
  return {
    restrict: 'AE',
    link: function(scope, element, attrs) {
      scope.$watch(attrs.ngModel, function(newVal) {
        newVal = newVal || 'I am a node!';
        var sp = $('<span />')
          .text(newVal)
          .appendTo('body');
        var width = sp.width();
        sp.remove();
        element.css('width', width + 4); // 2px padding either side
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
