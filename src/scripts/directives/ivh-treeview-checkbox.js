
/**
 * Wrapper for a checkbox directive
 *
 * Basically exists so folks creeting custom node templates don't need to attach
 * their node to this directive explicitly - i.e. keeps consistent interface
 * with the twistie and toggle directives.
 *
 * @package ivh.treeview
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('ivh.treeview').directive('ivhTreeviewCheckbox', [function() {
  'use strict';
  return {
    restrict: 'AE',
    require: '^ivhTreeview',
    template: '<span ivh-treeview-checkbox-helper="node"></span>'
  };
}]);
