
/**
 * Treeview tree node directive
 *
 * @private
 * @package ivh.treeview
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('ivh.treeview').directive('ivhTreeviewNode', ['ivhTreeviewCompiler', 'ivhTreeviewOptions', function(ivhTreeviewCompiler, ivhTreeviewOptions) {
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
        .compile(tElement, function(scope, element, attrs, ctrl) {
          var node = scope.node;

          var getChildren = scope.getChildren = function() {
            return ctrl.children(node);
          };

          scope.ctrl = ctrl;
          scope.childDepth = scope.depth + 1;

          // Expand/collapse the node as dictated by the expandToDepth property
          ctrl.expand(node, ctrl.isInitiallyExpanded(scope.depth));

          /**
           * @todo Provide a way to opt out of this
           */
          var watcher = scope.$watch(function() {
            return getChildren().length > 0;
          }, function(newVal) {
            if(newVal) {
              element.removeClass('ivh-treeview-node-leaf');
            } else {
              element.addClass('ivh-treeview-node-leaf');
            }
          });
        });
    },
    template: ivhTreeviewOptions().nodeTpl
  };
}]);

