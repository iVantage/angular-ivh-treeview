
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
      element.bind('change', function() {
        scope.$broadcast('event_ivhTreeviewSelectAll', element.prop('checked'));
        
        $timeout(function() {
          scope.$emit('event_ivhTreeviewValidate');
        });
      });
      
      element.bind('click', function(event) {
        var isIndeterminate = scope.$eval(attrs.ivhTreeviewCheckboxIndeterminate);
        if(isIndeterminate) {
          element.prop('checked', false);
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      });
      
      var validateCb = function() {
        $timeout(function() {
          var isIndeterminate = scope.$eval(attrs.ivhTreeviewCheckboxIndeterminate);
          element.prop('indeterminate', isIndeterminate);
        });
      };
        
      scope.$on('event_ivhTreeviewValidate', validateCb);
      scope.$on('event_ivhTreeviewSelectAll', validateCb);
    }
  };
}]);
