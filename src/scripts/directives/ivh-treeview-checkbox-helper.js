
/**
 * Selection management logic for treeviews with checkboxes
 *
 * @private
 * @package ivh.treeview
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('ivh.treeview').directive('ivhTreeviewCheckboxHelper', [function() {
  'use strict';
  return {
    restrict: 'A',
    scope: {
      node: '=ivhTreeviewCheckboxHelper'
    },
    require: '^ivhTreeview',
    link: function(scope, element, attrs, trvw) {
      var node = scope.node
        , opts = trvw.opts()
        , indeterminateAttr = opts.indeterminateAttribute
        , selectedAttr = opts.selectedAttribute;

      // Set initial selected state of this checkbox
      scope.isSelected = node[selectedAttr];

      // Local access to the parent controller
      scope.trvw = trvw;

      // Enforce consistent behavior across browsers by making indeterminate
      // checkboxes become checked when clicked/selected using spacebar
      scope.resolveIndeterminateClick = function() {

        //intermediate state is not handled when CheckBoxes state propagation is disabled
        if (opts.disableCheckboxSelectionPropagation) {
          return;
        }

        if(node[indeterminateAttr]) {
          trvw.select(node, true);
        }
      };

      // Update the checkbox when the node's selected status changes
      scope.$watch('node.' + selectedAttr, function(newVal, oldVal) {
        scope.isSelected = newVal;
      });

      if (!opts.disableCheckboxSelectionPropagation) {
        // Update the checkbox when the node's indeterminate status changes
        scope.$watch('node.' + indeterminateAttr, function(newVal, oldVal) {
          element.find('input').prop('indeterminate', newVal);
        });
      }
    },
    template: [
      '<input type="checkbox"',
        'class="ivh-treeview-checkbox"',
        'ng-model="isSelected"',
        'ng-click="resolveIndeterminateClick()"',
        'ng-change="trvw.select(node, isSelected)" />'
    ].join('\n')
  };
}]);

