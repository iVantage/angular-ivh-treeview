
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
      var itm = scope.$eval(attrs.ivhTreeviewCheckbox)
        , indeterminateAttr = attrs.ivhTreeviewIndeterminateAttribute;

      element.bind('change', function() {
        scope.$broadcast('event_ivhTreeviewSelectAll', element.prop('checked'));
        $timeout(function() {
          scope.$parent.$emit('event_ivhTreeviewValidate');
        });
      });
      
      /**
       * Checkbox click handler
       *
       * Note that this fires *after* the change event
       */
      element.bind('click', function(event) {
        var isIndeterminate = itm[indeterminateAttr];
        if(isIndeterminate) {
          element.prop('checked', false);
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      });
      
      var validateCb = function() {
        $timeout(function() {
          var isIndeterminate = itm.__ivhTreeviewIntermediate;
          element.prop('indeterminate', isIndeterminate);
        });
      };

      var makeDeterminate = function() {
        element.prop('indeterminate', false);
      };

      scope.$on('event_ivhTreeviewValidate', validateCb);
      scope.$on('event_ivhTreeviewSelectAll', makeDeterminate);
    }
  };
}]);
