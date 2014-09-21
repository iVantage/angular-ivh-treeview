
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

      /**
       * @todo Allow opt out of updates if we don't want the extra watchers
       */
      // if(!children.length) {
      //   return;
      // }

      element.addClass('ivh-treeview-toggle');

      var $li = element.parent();

      while($li && $li.prop('nodeName') !== 'LI') {
        $li = $li.parent();
      }

      element.bind('click', function() {
        if(ctrl.children(node).length) {
          $li.toggleClass('ivh-treeview-node-collapsed');
        } else {
          $li.removeClass('ivh-treeview-node-collapsed');
        }
      });
    }
  };
}]);
