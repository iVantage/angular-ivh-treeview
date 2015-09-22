
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
    require: '^ivhTreeviewNode',
    template: [
      '<ul ng-if="getChildren().length" class="ivh-treeview">',
        '<li ng-repeat="child in getChildren()"',
            'ng-hide="trvw.hasFilter() && !trvw.isVisible(child)"',
            'class="ivh-treeview-node"',
            'ng-class="{\'ivh-treeview-node-collapsed\': !trvw.isExpanded(child) && !trvw.isLeaf(child)}"',
            'ivh-treeview-node="child"',
            'ivh-treeview-depth="childDepth">',
        '</li>',
      '</ul>'
    ].join('\n')
  };
});
