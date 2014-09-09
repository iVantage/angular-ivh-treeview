
/**
 * The `ivh-treeview` directive
 *
 * A filterable tree view with checkbox support.
 *
 * Example:
 *
 * ```
 * <div
 *   ivh-treeview="myHierarchicalData">
 *   ivh-treeview-filter="myFilterText">
 * </div>
 * ```
 *
 * @package <package-name>
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('ivh.treeview').directive('ivhTreeview', function() {
  'use strict';
  return {
    restrict: 'A',
    scope: {
      // The tree data store
      root: '=ivhTreeview',

      // Config options
      childrenAttribute: '=ivhTreeviewChildrenAttribute',
      defaultSelectedState: '=ivhTreeviewDefaultSelectedState',
      expandToDepth: '=ivhTreeviewExpandToDepth',
      idAttribute: '=ivhTreeviewIdAttribute',
      indeterminateAttribute: '=ivhTreeviewIndeterminateAttribute',
      labelAttribute: '=ivhTreeviewLabelAttribute',
      selectedAttribute: '=ivhTreeviewSelectedAttribute',
      useCheckboxes: '=ivhTreeviewUseCheckboxes',
      visibleAttribute: '=ivhTreeviewVisibleAttribute',

      // The filter
      filter: '=ivhTreeviewFilter'
    },
    controllerAs: 'ctrl',
    controller: ['$scope', '$element', '$attrs', '$transclude', 'ivhTreeviewMgr', 'ivhTreeviewOptions', function($scope, $element, $attrs, $transclude, ivhTreeviewMgr, ivhTreeviewOptions) {
      var ng = angular
        , ctrl = this;

      var root = ctrl.root = $scope.root;

      // Merge any locally set options with those registered with hte
      // ivhTreeviewOptions provider
      var localOpts = ng.extend({}, ivhTreeviewOptions());
      ng.forEach([
        'childrenAttribute',
        'defaultSelectedState',
        'expandToDepth',
        'idAttribute',
        'indeterminateAttribute',
        'labelAttribute',
        'selectedAttribute',
        'useCheckboxes',
        'visibleAttribute'
      ], function(attr) {
        if(ng.isDefined($scope[attr])) {
          localOpts[attr] = $scope[attr];
        }
      });

      // Give child directives an easy way to get at merged options
      ctrl.opts = function() {
        return localOpts;
      };

      ctrl.children = function(node) {
        var children = node[localOpts.childrenAttribute];
        return ng.isArray(children) ? children : [];
      };

      ctrl.label = function(node) {
        return node[localOpts.labelAttribute];
      };

      ctrl.isVisible = function(node) {
        return true;
      };

      ctrl.useCheckboxes = function() {
        return localOpts.useCheckboxes;
      };

      ctrl.select = function(node, isSelected) {
        ivhTreeviewMgr.select(root, node, localOpts, isSelected);
      };
    }],
    template: [
      '<ul>',
        '<li ng-repeat="child in root | ivhTreeviewAsArray"',
            'ivh-treeview-node="child">',
        '</li>',
      '</ul>'
    ].join('\n')
  };
});

