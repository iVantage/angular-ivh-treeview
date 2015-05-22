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
      children: [{
        label: 'Jacket'
      }, {
        label: 'Shoes'
      }, {
        label: 'Hat box',
        selected: true,
        children: [{
          label: 'Fedora'
        }]
      }]
    }];
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

