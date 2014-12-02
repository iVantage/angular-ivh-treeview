
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
 * @package ivh.treeview
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('ivh.treeview').directive('ivhTreeview', ['ivhTreeviewMgr', function(ivhTreeviewMgr) {
  'use strict';
  return {
    restrict: 'A',
    scope: {
      // The tree data store
      root: '=ivhTreeview',

      // Config options
      childrenAttribute: '=ivhTreeviewChildrenAttribute',
      clickHandler: '=ivhTreeviewClickHandler',
      defaultSelectedState: '=ivhTreeviewDefaultSelectedState',
      expandToDepth: '=ivhTreeviewExpandToDepth',
      idAttribute: '=ivhTreeviewIdAttribute',
      indeterminateAttribute: '=ivhTreeviewIndeterminateAttribute',
      labelAttribute: '=ivhTreeviewLabelAttribute',
      selectedAttribute: '=ivhTreeviewSelectedAttribute',
      useCheckboxes: '=ivhTreeviewUseCheckboxes',
      validate: '=ivhTreeviewValidate',
      visibleAttribute: '=ivhTreeviewVisibleAttribute',

      // The filter
      filter: '=ivhTreeviewFilter'
    },
    controllerAs: 'ctrl',
    controller: ['$scope', '$element', '$attrs', '$transclude', 'ivhTreeviewOptions', 'filterFilter', function($scope, $element, $attrs, $transclude, ivhTreeviewOptions, filterFilter) {
      var ng = angular
        , ctrl = this;

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
        'validate',
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

      ctrl.hasFilter = function() {
        return ng.isDefined($scope.filter);
      };

      ctrl.getFilter = function() {
        return $scope.filter || '';
      };

      ctrl.isVisible = function(node) {
        var filter = ctrl.getFilter();
        if(!filter) {
          return true;
        }
        return !!filterFilter([node], filter).length;
      };

      ctrl.useCheckboxes = function() {
        return localOpts.useCheckboxes;
      };

      ctrl.select = function(node, isSelected) {
        ivhTreeviewMgr.select($scope.root, node, localOpts, isSelected);
      };

      ctrl.isExpanded = function(depth) {
        var expandTo = localOpts.expandToDepth === -1 ?
          Infinity : localOpts.expandToDepth;
        return depth < expandTo;
      };

      ctrl.onNodeClick = function(node) {
        ($scope.clickHandler || angular.noop)(node, $scope.root);
      };
    }],
    link: function(scope, element, attrs) {
      var opts = scope.ctrl.opts();

      // Allow opt-in validate on startup
      if(opts.validate) {
        ivhTreeviewMgr.validate(scope.root, opts);
      }
    },
    template: [
      '<ul class="ivh-treeview">',
        '<li ng-repeat="child in root | ivhTreeviewAsArray"',
            'ng-hide="ctrl.hasFilter() && !ctrl.isVisible(child)"',
            'ivh-treeview-node="child"',
            'ivh-treeview-depth="0">',
        '</li>',
      '</ul>'
    ].join('\n')
  };
}]);

