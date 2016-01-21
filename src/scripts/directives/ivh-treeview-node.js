
/**
 * Treeview tree node directive
 *
 * @private
 * @package ivh.treeview
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('ivh.treeview').directive('ivhTreeviewNode', ['ivhTreeviewCompiler', function(ivhTreeviewCompiler) {
  'use strict';
  return {
    restrict: 'A',
    scope: {
      node: '=ivhTreeviewNode',
      depth: '=ivhTreeviewDepth'
    },
    require: '^ivhTreeview',
    compile: function(tElement) {
      return ivhTreeviewCompiler
        .compile(tElement, function(scope, element, attrs, trvw) {
          var node = scope.node;

          var getChildren = scope.getChildren = function() {
            return trvw.children(node);
          };

          scope.trvw = trvw;
          scope.childDepth = scope.depth + 1;

          // Expand/collapse the node as dictated by the expandToDepth property.
          // Note that we will respect the expanded state of this node if it has
          // been expanded by e.g. `ivhTreeviewMgr.expandTo` but not yet
          // rendered.
          if(!trvw.isExpanded(node)) {
            trvw.expand(node, trvw.isInitiallyExpanded(scope.depth));
          }

          /**
           * @todo Provide a way to opt out of this
           */
          scope.$watch(function() {
            return getChildren().length > 0;
          }, function(newVal) {
            if(newVal) {
              element.removeClass('ivh-treeview-node-leaf');
            } else {
              element.addClass('ivh-treeview-node-leaf');
            }
          });
        });
    }
  };
}]);

