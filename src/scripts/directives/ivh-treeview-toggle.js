
/**
 * Toggle logic for treeview nodes
 *
 * Handles expand/collapse on click. Does nothing for leaf nodes.
 *
 * @private
 * @package ivh.treeview
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('ivh.treeview').directive('ivhTreeviewToggle', [function() {
  'use strict';
  return {
    restrict: 'A',
    require: '^ivhTreeview',
    link: function(scope, element, attrs, trvw) {
      var node = scope.node;

      element.addClass('ivh-treeview-toggle');

      element.bind('click', function() {
        if(!trvw.isLeaf(node)) {
          scope.$apply(function() {
            trvw.toggleExpanded(node);
            trvw.onToggle(node);
          });
        }
      });
    }
  };
}]);
