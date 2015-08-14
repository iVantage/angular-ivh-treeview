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

$(document).ready(function() {
  $('pre').each(function(ix, block) {
    hljs.highlightBlock(block);
  });
});

}(jQuery, angular, hljs));
