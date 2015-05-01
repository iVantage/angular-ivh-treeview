
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
    controllerAs: 'trvw',
    controller: ['$scope', '$element', '$attrs', '$transclude', 'ivhTreeviewOptions', 'filterFilter', function($scope, $element, $attrs, $transclude, ivhTreeviewOptions, filterFilter) {
      var ng = angular
        , trvw = this;

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

      /**
       * Get the merged global and local options
       *
       * @return {Object} the merged options
       */
      trvw.opts = function() {
        return localOpts;
      };

      // If we didn't provide twistie templates we'll be doing a fair bit of
      // extra checks for no reason. Let's just inform down stream directives
      // whether or not they need to worry about twistie non-global templates.
      var userOpts = $scope.userOptions || {};

      /**
       * Whether or not we have local twistie templates
       *
       * @private
       */
      trvw.hasLocalTwistieTpls = !!(
        userOpts.twistieCollapsedTpl ||
        userOpts.twistieExpandedTpl ||
        userOpts.twistieLeafTpl ||
        $scope.twistieCollapsedTpl ||
        $scope.twistieExpandedTpl ||
        $scope.twistieLeafTpl);

      /**
       * Get the child nodes for `node`
       *
       * Abstracts away the need to know the actual label attribute in
       * templates.
       *
       * @param {Object} node a tree node
       * @return {Array} the child nodes
       */
      trvw.children = function(node) {
        var children = node[localOpts.childrenAttribute];
        return ng.isArray(children) ? children : [];
      };

      /**
       * Get the label for `node`
       *
       * Abstracts away the need to know the actual label attribute in
       * templates.
       *
       * @param {Object} node A tree node
       * @return {String} The node label
       */
      trvw.label = function(node) {
        return node[localOpts.labelAttribute];
      };

      /**
       * Returns `true` if this treeview has a filter
       *
       * @return {Boolean} Whether on not we have a filter
       * @private
       */
      trvw.hasFilter = function() {
        return ng.isDefined($scope.filter);
      };

      /**
       * Get the treeview filter
       *
       * @return {String} The filter string
       * @private
       */
      trvw.getFilter = function() {
        return $scope.filter || '';
      };

      /**
       * Get the tree node template
       *
       * @return {String} The node template
       * @private
       */
      trvw.getNodeTpl = function() {
        return localOpts.nodeTpl;
      };

      /**
       * Returns `true` if current filter should hide `node`, false otherwise
       *
       * @param {Object} node A tree node
       * @return {Boolean} Whether or not `node` is filtered out
       */
      trvw.isVisible = function(node) {
        var filter = trvw.getFilter();
        if(!filter) {
          return true;
        }
        return !!filterFilter([node], filter).length;
      };

      /**
       * Returns `true` if we should use checkboxes, false otherwise
       *
       * @return {Boolean} Whether or not to use checkboxes
       */
      trvw.useCheckboxes = function() {
        return localOpts.useCheckboxes;
      };

      /**
       * Select or deselect `node`
       *
       * Updates parent and child nodes appropriately, `isSelected` defaults to
       * `true`.
       *
       * @param {Object} node The node to select or deselect
       * @param {Boolean} isSelected Defaults to `true`
       */
      trvw.select = function(node, isSelected) {
        ivhTreeviewMgr.select($scope.root, node, localOpts, isSelected);
        trvw.onNodeChange(node, isSelected);
      };

      /**
       * Get the selected state of `node`
       *
       * @param {Object} node The node to get the selected state of
       * @return {Boolean} `true` if `node` is selected
       */
      trvw.isSelected = function(node) {
        return node[localOpts.selectedAttribute];
      };

      /**
       * Toggle the selected state of `node`
       *
       * Updates parent and child node selected states appropriately.
       *
       * @param {Object} node The node to update
       */
      trvw.toggleSelected = function(node) {
        var isSelected = !node[localOpts.selectedAttribute];
        trvw.select(node, isSelected);
      };

      /**
       * Expand or collapse a given node
       *
       * `isExpanded` is optional and defaults to `true`.
       *
       * @param {Object} node The node to expand/collapse
       * @param {Boolean} isExpanded Whether to expand (`true`) or collapse
       */
      trvw.expand = function(node, isExpanded) {
        ivhTreeviewMgr.expand($scope.root, node, localOpts, isExpanded);
      };

      /**
       * Get the expanded state of a given node
       *
       * @param {Object} node The node to check the expanded state of
       * @return {Boolean}
       */
      trvw.isExpanded = function(node) {
        return node[localOpts.expandedAttribute];
      };

      /**
       * Toggle the expanded state of a given node
       *
       * @param {Object} node The node to toggle
       */
      trvw.toggleExpanded = function(node) {
        trvw.expand(node, !trvw.isExpanded(node));
      };

      /**
       * Whether or not nodes at `depth` should be expanded by default
       *
       * Use -1 to fully expand the tree by default.
       *
       * @param {Integer} depth The depth to expand to
       * @return {Boolean} Whether or not nodes at `depth` should be expanded
       * @private
       */
      trvw.isInitiallyExpanded = function(depth) {
        var expandTo = localOpts.expandToDepth === -1 ?
          Infinity : localOpts.expandToDepth;
        return depth < expandTo;
      };

      /**
       * Returns `true` if `node` is a leaf node
       *
       * @param {Object} node The node to check
       * @return {Boolean} `true` if `node` is a leaf
       */
      trvw.isLeaf = function(node) {
        return trvw.children(node).length === 0;
      };

      /**
       * Get the template to be used for tree nodes
       *
       * @return {String} The template
       * @private
       */
      trvw.getNodeTpl = function() {
        return localOpts.nodeTpl;
      };

      /**
       * Call the registered node click handler
       *
       * Handler will get a reference to `node` and the root of the tree.
       *
       * @param {Object} node Tree node to pass to the handler
       * @private
       */
      trvw.onNodeClick = function(node) {
        ($scope.clickHandler || angular.noop)(node, $scope.root);
      };

      /**
       * Call the registered selection change handler
       *
       * Handler will get a reference to `node`, the new selected state of
       * `node, and the root of the tree.
       *
       * @param {Object} node Tree node to pass to the handler
       * @param {Boolean} isSelected Selected state for `node`
       * @private
       */
      trvw.onNodeChange = function(node, isSelected) {
        ($scope.changeHandler || angular.noop)(node, isSelected, $scope.root);
      };
    }],
    link: function(scope, element, attrs) {
      var opts = scope.trvw.opts();

      // Allow opt-in validate on startup
      if(opts.validate) {
        ivhTreeviewMgr.validate(scope.root, opts);
      }
    },
    template: [
      '<ul class="ivh-treeview">',
        '<li ng-repeat="child in root | ivhTreeviewAsArray"',
            'ng-hide="trvw.hasFilter() && !trvw.isVisible(child)"',
            'ng-class="{\'ivh-treeview-node-collapsed\': !trvw.isExpanded(child) && !trvw.isLeaf(child)}"',
            'ivh-treeview-node="child"',
            'ivh-treeview-depth="0">',
        '</li>',
      '</ul>'
    ].join('\n')
  };
}]);

