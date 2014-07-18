
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

angular.module('ivh.treeview').directive('ivhTreeview', ['$compile', '$filter', 'ivhTreeviewSettings', function($compile, $filter, ivhTreeviewSettings) {
  'use strict';
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {

      var settings = ivhTreeviewSettings.get()
        , ivhTreeviewAttr = attrs.ivhTreeview
        , filterAttr = attrs.ivhTreeviewFilter
        , labelAttr = scope.$eval(attrs.ivhTreeviewLabelAttribute) || settings.labelAttribute
        , childrenAttr = scope.$eval(attrs.ivhTreeviewChildrenAttribute) || settings.childrenAttribute
        , selectedAttr = scope.$eval(attrs.ivhTreeviewSelectedAttribute) || settings.selectedAttribute
        , indeterminateAttr = attrs.ivhTreeviewIndeterminateAttribute || settings.indeterminateAttribute
        , visibleAttr = attrs.ivhTreeviewVisibleAttribute || settings.visibleAttribute
        , useCheckboxes = angular.isDefined(attrs.ivhTreeviewUseCheckboxes) ? scope.$eval(attrs.ivhTreeviewUseCheckboxes) : settings.useCheckboxes
        , asArray = $filter('ivhTreeviewAsArray');

      var getTreeview = function() {
        return asArray(scope.$eval(ivhTreeviewAttr));
      };

      var getParent = function() {
        return scope[attrs.ivhTreeviewParent];
      };

      var tplCheckbox = [
        '<input',
          'ivh-treeview-checkbox="itm"',
          'ivh-treeview-indeterminate-attribute="' + indeterminateAttr + '"',
          'ivh-treeview-selected-attribute="' + selectedAttr + '"',
          'ivh-treeview-parent="' + attrs.ivhTreeviewParent + '"',
          'class="ivh-treeview-checkbox"',
          'type="checkbox"',
          'ng-model="itm[\'' + selectedAttr + '\']" />',
      ].join('\n');

      var tpl = [
        '<ul class="ivh-treeview">',
          '<li ng-repeat="itm in ' + ivhTreeviewAttr + ' | ivhTreeviewAsArray"',
              /**
               * @todo check settings.expandByDefaultDepth
               */
              'ng-class="{\'ivh-treeview-node-leaf\': !itm[\''+childrenAttr+'\'].length, \'ivh-treeview-node-collapsed\': itm[\''+childrenAttr+'\'].length}"',
              'ivh-treeview-node="itm"',
              'ivh-treeview-node-visible-attribute="' + visibleAttr + '"',
              'ivh-treeview-node-selected-attribute="' + selectedAttr + '"',
              'ivh-treeview-node-hook="itm"', // Hook for external use
              'ivh-treeview-filter="' + filterAttr + '"',
              'ng-show="itm.' + visibleAttr + '">',
            '<div ivh-treeview-node-hook class="ivh-treeview-node">',
              '<span ivh-treeview-node-toggle class="ivh-treeview-toggle ivh-treeview-toggle-right glyphicon glyphicon-chevron-right"></span>',
              '<span ivh-treeview-node-toggle class="ivh-treeview-toggle ivh-treeview-toggle-down glyphicon glyphicon-chevron-down"></span>',
              '<span class="ivh-treeview-toggle ivh-treeview-toggle-leaf">&#9679;</span>',
              useCheckboxes ? tplCheckbox : '',
              '<span ivh-treeview-node-toggle="true" class="ivh-treeview-node-label">',
                '{{itm.' + labelAttr + '}}',
              '</span>',
            '</div>',
            '<div',
              'ivh-treeview="itm[\'' + childrenAttr + '\']"',
              'ivh-treeview-parent="itm"',
              filterAttr ? 'ivh-treeview-filter="' + filterAttr + '"' : '',
              'ivh-treeview-label-attribute="' + labelAttr + '"',
              'ivh-treeview-children-attribute="' + childrenAttr + '"',
              'ivh-treeview-selected-attribute="' + selectedAttr + '"',
              'ivh-treeview-visible-attribute="' + visibleAttr + '"',
              'ivh-treeview-use-checkboxes="' + useCheckboxes + '"',
              '></div>',
          '</li>',
        '</ul>'
      ].join('\n');

      var link = function() {
        var ivhTreeview = getTreeview();
        if(ivhTreeview && ivhTreeview.length) {
          var $el = $compile(tpl)(scope);
          element.html('').append($el);
        }
      };

      scope.$watch(attrs.ivhTreeview, link);

      scope.$on('event_ivhTreeviewSelectAll', function(event, isSelected) {
        var ivhTreeview = getTreeview()
          , parent = getParent();

        angular.forEach(ivhTreeview, function(node) {
          node[selectedAttr] = isSelected;
          node[indeterminateAttr] = false;
        });

        if(parent) {
          parent[selectedAttr] = isSelected;
          parent[indeterminateAttr] = false;
        }
      });

      scope.$on('event_ivhTreeviewValidate', function() {
        var ivhTreeview = getTreeview()
          , parent = getParent()
          , numNodes = ivhTreeview.length
          , numSelected = 0
          , numIndeterminate = 0;

        if(!ivhTreeview || !ivhTreeview.length || !parent) {
          return;
        }

        angular.forEach(ivhTreeview, function(node) {
          if(node[selectedAttr]) { numSelected++; }
          if(node[indeterminateAttr]) { numIndeterminate++; }
        });

        if(0 === numSelected) {
          parent[selectedAttr] = false;
          parent[indeterminateAttr] = !!numIndeterminate;
        } else if(numSelected === numNodes) {
          parent[selectedAttr] = true;
          parent[indeterminateAttr] = false;
        } else {
          parent[selectedAttr] = false;
          parent[indeterminateAttr] = true;
        }

      });
    }
  };
}]);

