
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
    link: function(scope, element, attrs) {
      var node = scope[attrs.ivhTreeviewCheckbox]
        , parent = scope[attrs.ivhTreeviewParent]
        , indeterminateAttr = attrs.ivhTreeviewIndeterminateAttribute
        , selectedAttr = attrs.ivhTreeviewSelectedAttribute;

      var makeDeterminate = function() {
        node[indeterminateAttr] = false;
      };

      /**
       * Checkbox click handler
       *
       * Note that this fires *after* the change event
       */
      element.bind('click', function(event) {
        makeDeterminate();
      });

      /**
       * Internal event registration
       */
      scope.$on('event_ivhTreeviewSelectAll', makeDeterminate);

      scope.$watch(function() {
        return node[indeterminateAttr];
      }, function(newVal, oldVal) {
        element.prop('indeterminate', node[indeterminateAttr]);
      });

      /**
       * Watch for selected status changes
       */
      scope.$watch(function() {
        return node[selectedAttr];
      }, function(newVal, oldVal) {
        if(!angular.isUndefined(newVal)) {
          /**
           * @todo Only bother with updates if our selected status differs from
           * the parent node.
           */
          if(!node[indeterminateAttr]) {
            scope.$broadcast('event_ivhTreeviewSelectAll', node[selectedAttr]);
          }
          scope.$parent.$emit('event_ivhTreeviewValidate');
        }
      });
    }
  };
}]);
