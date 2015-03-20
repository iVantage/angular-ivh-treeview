
/**
 * The recursive step, output child nodes for the scope node
 * 
 * @package ivh.treeview
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('ivh.treeview').directive('ivhTreeviewChildren', function() {
  'use strict';
  return {
    restrict: 'AE',
    template: [
      '<ul ng-if="getChildren().length" class="ivh-treeview">',
        '<li ng-repeat="child in getChildren()"',
            'ng-hide="ctrl.hasFilter() && !ctrl.isVisible(child)"',
            'ng-class="{\'ivh-treeview-node-collapsed\': !ctrl.isExpanded(child) && !ctrl.isLeaf(child)}"',
            'ivh-treeview-node="child"',
            'ivh-treeview-depth="childDepth">',
        '</li>',
      '</ul>'
    ].join('\n')
  };
});
