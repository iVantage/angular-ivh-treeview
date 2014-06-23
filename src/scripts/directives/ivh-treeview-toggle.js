
/**
 * Toggle logic for treeview nodes
 *
 * Handles expand/collapse on click. Does nothing for leaf nodes.
 *
 * @private
 * @package ivh.treeview
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('ivh.treeview').directive('ivhTreeviewNodeToggle', ['$timeout', function($timeout) {
  'use strict';
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var canToggle = scope.$eval(attrs.ivhTreeviewNodeToggle);

      var $li = element.parent();

      while($li && $li.prop('nodeName') !== 'LI') {
        $li = $li.parent();
      }

      element.bind('click', function() {
        if(!$li.hasClass('ivh-treeview-node-leaf')) {
          $li.toggleClass('ivh-treeview-node-collapsed');
        }
      });

      //$timeout(function() {
      //  if($li.hasClass('ivh-treeview-node-leaf')) {
      //    return;
      //  }
      //  element.bind('click', function() {
      //    $li.toggleClass('ivh-treeview-node-collapsed');
      //  });
      //});
    }
  };
}]);
