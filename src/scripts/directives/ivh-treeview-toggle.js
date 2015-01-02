
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
    link: function(scope, element, attrs, ctrl) {
      var node = scope.node
        , children = ctrl.children(node);

      element.addClass('ivh-treeview-toggle');

      element.bind('click', function() {
        scope.$apply(function() {
          ctrl.onNodeClick(node);
          ctrl.toggleExpanded(node);
        });
      });
    }
  };
}]);
