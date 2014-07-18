
/**
 * Selection management logic for treeviews with checkboxes
 *
 * @private
 * @package ivh.treeview
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('ivh.treeview').directive('ivhTreeviewCheckbox', ['$timeout', function($timeout) {
  'use strict';
  return {
    link: function(scope, element, attrs) {
      var node = scope[attrs.ivhTreeviewCheckbox]
        , parent = scope[attrs.ivhTreeviewParent]
        , indeterminateAttr = attrs.ivhTreeviewIndeterminateAttribute
        , selectedAttr = attrs.ivhTreeviewSelectedAttribute;

      var validateCb = function() {
        $timeout(function() {
          var isIndeterminate = node.__ivhTreeviewIntermediate;
          element.prop('indeterminate', isIndeterminate);
        });
      };

      var makeDeterminate = function() {
        node[indeterminateAttr] = false;
      };

      /**
       * Checkbox click handler
       *
       * Note that this fires *after* the change event
       */
      element.bind('click', makeDeterminate);

      /**
       * Internal event registration
       */
      scope.$on('event_ivhTreeviewValidate', validateCb);
      scope.$on('event_ivhTreeviewSelectAll', makeDeterminate);

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
          $timeout(function() {
            scope.$parent.$emit('event_ivhTreeviewValidate');
          });
        }
      });
    }
  };
}]);
