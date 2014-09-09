
/**
 * Selection management logic for treeviews with checkboxes
 *
 * @private
 * @package ivh.treeview
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('ivh.treeview').directive('ivhTreeviewCheckbox', [function() {
  'use strict';
  return {
    restrict: 'A',
    scope: {
      node: '=ivhTreeviewCheckbox'
    },
    require: '^ivhTreeview',
    link: function(scope, element, attrs, ctrl) {
      var node = scope.node
        , opts = ctrl.opts()
        , indeterminateAttr = opts.indeterminateAttribute
        , selectedAttr = opts.selectedAttribute;

      // Set initial selected state of this checkbox
      scope.isSelected = node[selectedAttr];

      // Local access to the parent controller
      scope.ctrl = ctrl;

      // Update the checkbox when the node's selected status changes
      scope.$watch(function() {
        return node[selectedAttr];
      }, function(newVal, oldVal) {
        scope.isSelected = newVal;
      });

      // Update the checkbox when the node's indeterminate status changes
      scope.$watch(function() {
        return node[indeterminateAttr];
      }, function(newVal, oldVal) {
        element.find('input').prop('indeterminate', newVal);
      });
    },
    template: [
      '<input type="checkbox"',
        'ng-model="isSelected"',
        'ng-change="ctrl.select(node, isSelected)" />'
    ].join('\n')
  };
}]);
