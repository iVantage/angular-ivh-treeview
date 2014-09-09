
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
        .compile(tElement, function(scope, element, attrs, ctrl) {
          scope.ctrl = ctrl;

          scope.childDepth = scope.depth + 1;

          var node = scope.node
            , children = scope.children = ctrl.children(node);

          if(!children.length) {
            element.addClass('ivh-treeview-node-leaf');
          }

          if(!ctrl.isExpanded(scope.depth)) {
            element.addClass('ivh-treeview-node-collapsed');
          }

          element.attr('title', ctrl.label(node));
        });
    },
    template: [
      '<div>',
        '<div>',
          '<span ivh-treeview-toggle="node">',
            '(-)',
          '</span>',
          '<span ng-if="ctrl.useCheckboxes()"',
              'ivh-treeview-checkbox="node">',
          '</span>',
          '<span class="ivh-treeview-node-label">',
            '{{ctrl.label(node)}}',
          '</span>',
        '</div>',
        '<ul ng-if="children.length" class="ivh-treeview">',
          '<li ng-repeat="child in children"',
              'ng-hide="ctrl.hasFilter() && !ctrl.isVisible(child)"',
              'ivh-treeview-node="child"',
              'ivh-treeview-depth="childDepth">',
          '</li>',
        '</ul>',
      '</div>'
    ].join('\n')
  };
}]);

