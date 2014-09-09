
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
      node: '=ivhTreeviewNode'
    },
    require: '^ivhTreeview',
    compile: function(tElement) {
      return ivhTreeviewCompiler
        .compile(tElement, function(scope, element, attrs, ctrl) {
          scope.ctrl = ctrl;
        });
    },
    template: [
      '<div ng-show="ctrl.isVisible(node)">',
        '<div title="{{ctrl.label(node)}}">',
          '(-)',
          '<span ng-if="ctrl.useCheckboxes()"',
              'ivh-treeview-checkbox="node">',
          '</span>',
          '<span class="ivh-treeview-node-label">',
            '{{ctrl.label(node)}}',
          '</span>',
        '</div>',
        '<ul class="ivh-treeview">',
          '<li ng-repeat="child in ctrl.children(node)"',
              'ivh-treeview-node="child">',
          '</li>',
        '</ul>',
      '</div>'
    ].join('\n')
  };
}]);

