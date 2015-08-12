/*global jQuery, angular */

/**
 * Main site scripts for Angular IVH Treeview
 *
 * @copyright 2015 iVantage
 */

(function(ng) {
'use strict';

ng.module('demo', ['ivh.treeview'])
  .controller('SillyCtrl', function(ivhTreeviewMgr) {
    this.stuff = [{
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
            { label: 'Five panel' },
          ]
        }
      ]
    }];

    this.tplFolderOpen = '<span class="twistie glyphicon glyphicon-folder-open"></span>';
    this.tplFolderClose = '<span class="twistie glyphicon glyphicon-folder-close"></span>';
    this.tplLeaf = '<span class="twistie glyphicon glyphicon-map-marker"></span>';
  });

}(angular));


(function($) {
'use strict';

// Initialize tabs
$('.nav-tabs a').click(function (e) {
  e.preventDefault();
  $(this).tab('show');
});

}(jQuery));

