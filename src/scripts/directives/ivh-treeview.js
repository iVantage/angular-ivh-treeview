
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
    transclude: true,
    scope: {
      // The tree data store
      root: '=ivhTreeview',

      // Specific config options
      childrenAttribute: '=ivhTreeviewChildrenAttribute',
      clickHandler: '=ivhTreeviewClickHandler',
      changeHandler: '=ivhTreeviewChangeHandler',
      defaultSelectedState: '=ivhTreeviewDefaultSelectedState',
      expandToDepth: '=ivhTreeviewExpandToDepth',
      idAttribute: '=ivhTreeviewIdAttribute',
      indeterminateAttribute: '=ivhTreeviewIndeterminateAttribute',
      expandedAttribute: '=ivhTreeviewExpandedAttribute',
      labelAttribute: '=ivhTreeviewLabelAttribute',
      nodeTpl: '=ivhTreeviewNodeTpl',
      selectedAttribute: '=ivhTreeviewSelectedAttribute',
      twistieCollapsedTpl: '=ivhTreeviewTwistieCollapsedTpl',
      twistieExpandedTpl: '=ivhTreeviewTwistieExpandedTpl',
      twistieLeafTpl: '=ivhTreeviewTwistieLeafTpl',
      useCheckboxes: '=ivhTreeviewUseCheckboxes',
      validate: '=ivhTreeviewValidate',
      visibleAttribute: '=ivhTreeviewVisibleAttribute',

      // Generic options object
      userOptions: '=ivhTreeviewOptions',

      // The filter
      filter: '=ivhTreeviewFilter'
    },
    controllerAs: 'ctrl',
    controller: ['$scope', '$element', '$attrs', '$transclude', 'ivhTreeviewOptions', 'filterFilter', function($scope, $element, $attrs, $transclude, ivhTreeviewOptions, filterFilter) {
      var ng = angular
        , ctrl = this;

      // Merge any locally set options with those registered with hte
      // ivhTreeviewOptions provider
      var localOpts = ng.extend({}, ivhTreeviewOptions(), $scope.userOptions);

      ng.forEach([
        'childrenAttribute',
        'defaultSelectedState',
        'expandToDepth',
        'idAttribute',
        'indeterminateAttribute',
        'expandedAttribute',
        'labelAttribute',
        'nodeTpl',
        'selectedAttribute',
        'twistieCollapsedTpl',
        'twistieExpandedTpl',
        'twistieLeafTpl',
        'useCheckboxes',
        'validate',
        'visibleAttribute'
      ], function(attr) {
        if(ng.isDefined($scope[attr])) {
          localOpts[attr] = $scope[attr];
        }
      });

      // Treat the transcluded content (if there is any) as our node template
      var transcludedScope;
      $transclude(function(clone, scope) {
        var transcludedNodeTpl = '';
        angular.forEach(clone, function(c) {
          transcludedNodeTpl += (c.innerHTML || '').trim();
        });
        if(transcludedNodeTpl.length) {
          transcludedScope = scope;
          localOpts.nodeTpl = transcludedNodeTpl;
        }
      });

      // Give child directives an easy way to get at merged options
      ctrl.opts = function() {
        return localOpts;
      };

      // If we didn't provide twistie templates we'll be doing a fair bit of
      // extra checks for no reason. Let's just inform down stream directives
      // whether or not they need to worry about twistie non-global templates.
      var userOpts = $scope.userOptions || {};
      ctrl.hasLocalTwistieTpls = !!(
        userOpts.twistieCollapsedTpl ||
        userOpts.twistieExpandedTpl ||
        userOpts.twistieLeafTpl ||
        $scope.twistieCollapsedTpl ||
        $scope.twistieExpandedTpl ||
        $scope.twistieLeafTpl);

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

      /**
       * Get the tree node template
       *
       * @return {String} The node template
       */
      ctrl.getNodeTpl = function() {
        return localOpts.nodeTpl;
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
        ctrl.onNodeChange(node, isSelected);
      };

      ctrl.expand = function(node, isExpanded) {
        ivhTreeviewMgr.expand($scope.root, node, localOpts, isExpanded);
      };

      ctrl.isExpanded = function(node) {
        return node[localOpts.expandedAttribute];
      };

      ctrl.toggleExpanded = function(node) {
        ctrl.expand(node, !ctrl.isExpanded(node));
      };

      ctrl.isInitiallyExpanded = function(depth) {
        var expandTo = localOpts.expandToDepth === -1 ?
          Infinity : localOpts.expandToDepth;
        return depth < expandTo;
      };

      ctrl.isLeaf = function(node) {
        return ctrl.children(node).length === 0;
      };

      ctrl.getNodeTpl = function() {
        return localOpts.nodeTpl;
      };

      ctrl.onNodeClick = function(node) {
        ($scope.clickHandler || angular.noop)(node, $scope.root);
      };

      ctrl.onNodeChange = function(node, isSelected) {
        ($scope.changeHandler || angular.noop)(node, isSelected, $scope.root);
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
            'ng-class="{\'ivh-treeview-node-collapsed\': !ctrl.isExpanded(child) && !ctrl.isLeaf(child)}"',
            'ivh-treeview-node="child"',
            'ivh-treeview-depth="0">',
        '</li>',
      '</ul>'
    ].join('\n')
  };
}]);

