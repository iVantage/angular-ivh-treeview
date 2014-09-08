
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
      childrenAttr: '=ivhTreeviewChildrenAttribute',
      defaultSelectedState: '=ivhTreeviewDefaultSelectedState',
      expandToDepth: '=ivhTreeviewExpandToDepth',
      idAttr: '=ivhTreeviewIdAttribute',
      indeterminateAttr: '=ivhTreeviewIndeterminateAttribute',
      labelAttr: '=ivhTreeviewLabelAttribute',
      selectedAttr: '=ivhTreeviewSelectedAttribute',
      useCheckboxes: '=ivhTreeviewUseCheckboxes',
      visibleAttr: '=ivhTreeviewVisibleAttribute',

      // The filter
      filter: '=ivhTreeviewFilter'
    },
    controllerAs: 'tree',
    controller: function($scope, $element, $attrs, $transclude, ivhTreeviewOptions) {
      var ng = angular
        , ctrl = this;

      ctrl.root = $scope.root;

      // Merge any locally set options with those registered with hte
      // ivhTreeviewOptions provider
      var localOpts = {};

      if(ng.isDefined($scope.childAttr)) {
        localOpts.childrenAttribute = $scope.childrenAttr;
      }

      if(ng.isDefined($scope.defaultSelectedState)) {
        localOpts.defaultSelectedState = $scope.defaultSelectedState;
      }

      if(ng.isDefined($scope.expandToDepth)) {
        localOpts.expandToDepth = $scope.expandToDepth;
      }

      if(ng.isDefined($scope.idAttr)) {
        localOpts.idAttribute = $scope.idAttr;
      }

      if(ng.isDefined($scope.indeterminateAttr)) {
        localOpts.indeterminateAttribute = $scope.indeterminateAttr;
      }

      if(ng.isDefined($scope.labelAttr)) {
        localOpts.labelAttribute = $scope.labelAttr;
      }

      if(ng.isDefined($scope.selectedAttr)) {
        localOpts.selectedAttribute = $scope.selectedAttr;
      }

      if(ng.isDefined($scope.useCheckboxes)) {
        localOpts.useCheckboxes = $scope.useCheckboxes;
      }

      if(ng.isDefined($scope.visibleAttr)) {
        localOpts.visibleAttribute = $scope.visibleAttr;
      }

      var mergedOpts = ng.extend({}, ivhTreeviewOptions(), localOpts);

      // Give child directives an easy way to get at merged options
      ctrl.opts = function() {
        return mergedOpts;
      };

      ctrl.children = function(node) {
        /*code*/
      };

      ctrl.label = function(node) {
        /*code*/
      };

      ctrl.useCheckboxes = function() {
        return mergedOpts.useCheckboxes;
      };
    },
    template: '<div data-ivh-treeview-node="tree.root"></div>'
  };
});

