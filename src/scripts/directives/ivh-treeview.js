
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
 *   ivh-treeview-filter="filter:myFilterText | filter:myOtherFilterText">
 * </div>
 * ```
 *
 * @package <package-name>
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('ivh.treeview').directive('ivhTreeview', ['$compile', function($compile) {
  'use strict';
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var ivhTreeviewAttr = attrs.ivhTreeview
        , filterAttr = attrs.ivhTreeviewFilter
        , labelAttr = attrs.ivhTreeviewLabelAttribute || 'label'
        , valAttr = attrs.ivhTreeviewValueAttribute || 'value'
        , childrenAttr = attrs.ivhTreeviewChildrenAttribute || 'children'
        , selectedAttribute = attrs.ivhTreeviewSelectedAttribute || 'selected'
        , indeterminateAttribute = attrs.ivhTreeviewIndeterminateAttribute || '__ivhTreeviewIntermediate'
        , visibleAttribute = attrs.ivhTreeviewVisibleAttribute || '__ivhTreeviewVisible';
      
      var ivhTreeview = scope.$eval(ivhTreeviewAttr)
        , parent = scope.$eval(attrs.ivhTreeviewParent);
      
      if(!ivhTreeview || !ivhTreeview.length) {
        return;
      }
      
      var tpl = [
        '<ul class="ivh-treeview">',
          '<li ng-repeat="itm in ' + ivhTreeviewAttr + '"',
              'ng-class="{\'ivh-treeview-node-leaf\': !itm.'+childrenAttr+'.length}"',
              'ivh-treeview-node="itm"',
              'ivh-treeview-node-visible-attribute="' + visibleAttribute + '"',
              'ivh-treeview-node-hook="itm"', // Hook for external use
              'ivh-treeview-filter="' + filterAttr + '"',
              'ng-show="itm.' + visibleAttribute + '">',
            '<div ivh-treeview-node-hook class="ivh-treeview-node">',
              '<span ivh-treeview-node-toggle class="ivh-treeview-toggle ivh-treeview-toggle-right glyphicon glyphicon-chevron-right"></span>',
              '<span ivh-treeview-node-toggle class="ivh-treeview-toggle ivh-treeview-toggle-down glyphicon glyphicon-chevron-down"></span>',
              '<span class="ivh-treeview-toggle ivh-treeview-toggle-leaf">&#9679;</span>',
              '<input',
                'ivh-treeview-checkbox',
                'ivh-treeview-checkbox-indeterminate="itm.' + indeterminateAttribute + '"',
                'class="ivh-treeview-checkbox"',
                'type="checkbox"',
                'ng-model="itm.' + selectedAttribute + '" />',
              '<span ivh-treeview-node-toggle="true" class="ivh-treeview-node-label">',
                '{{itm.' + labelAttr + '}}',
              '</span>',
            '</div>',
            '<div',
              'ivh-treeview="itm.' + childrenAttr + '"',
              'ivh-treeview-parent="itm"',
              'ivh-treeview-filter="' + filterAttr + '"></div>',
          '</li>',
        '</ul>'
      ].join('\n');

      var $el = $compile(tpl)(scope);
      element.html('').append($el);
      
      scope.$on('event_ivhTreeviewSelectAll', function(event, isSelected) {
        angular.forEach(ivhTreeview, function(node) {
          node[selectedAttribute] = isSelected;
          node[indeterminateAttribute] = false;
        });
      });
      
      if(parent) {
        scope.$on('event_ivhTreeviewValidate', function() {
          var numNodes = ivhTreeview.length
            , numSelected = 0
            , numIndeterminate = 0;
          angular.forEach(ivhTreeview, function(node) {
            if(node[selectedAttribute]) { numSelected++; }
            if(node[indeterminateAttribute]) { numIndeterminate++; }
          });
          
          if(0 === numSelected) {
            parent[selectedAttribute] = false;
            parent[indeterminateAttribute] = !!numIndeterminate;
          } else if(numSelected === numNodes) {
            parent[selectedAttribute] = true;
            parent[indeterminateAttribute] = false;
          } else {
            parent[selectedAttribute] = false;
            parent[indeterminateAttribute] = true;
          }
          
        });
      }
    }
  };
}]);

