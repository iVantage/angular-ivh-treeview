
/**
 * The iVantage Treeview module
 *
 * @package ivh.treeview
 */

angular.module('ivh.treeview', []);


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


/**
 * Treeview tree node directive
 *
 * Handles filtering.
 *
 * @private
 * @package ivh.treeview
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('ivh.treeview').directive('ivhTreeviewNode', ['$compile', function($compile) {
  'use strict';
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var nodeAttr = attrs.ivhTreeviewNode
        , filterAttr = attrs.ivhTreeviewFilter
        , visibleAttr = attrs.ivhTreeviewNodeVisibleAttribute
        , node = scope.$eval(attrs.ivhTreeviewNode);
      
      // Nothing to do if we don't have a filter
      if(!filterAttr || filterAttr === 'undefined') { return; }
      
      var map = Array.prototype.map || function(fn) {
        var mapped = [];
        angular.forEach(this, function(item) {
          mapped.push(fn(item));
        });
        return mapped;
      };
      
      var filters = map.call(filterAttr.split('|'), function(filterStr) {
        var parts = filterStr.split(':');
        return parts;
      });
      
      var filterVars = [];
      angular.forEach(filters, function(f) {
        Array.prototype.push.apply(filterVars, f.slice(1));
      });
      
      var filterString = '[' + nodeAttr + '] | ' + filterAttr;
      var applyFilters = function() {
        var filtered = scope.$eval(filterString);
        node[visibleAttr] = filtered.length > 0;
      };
      
      angular.forEach(filterVars, function(f) {
        scope.$watch(f, applyFilters);
      });
    }
  };
}]);


/**
 * Toggle logic for treeview nodes
 *
 * Handles expand/collapse on click. Does nothing for leaf nodes.
 *
 * @private
 * @package ivh.treeview
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('ivh.treeview').directive('ivhTreeviewNodeToggle', ['$timeout', function($timeout) {
  'use strict';
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var canToggle = scope.$eval(attrs.ivhTreeviewNodeToggle);

      var $li = element.parent();

      while($li && $li.prop('nodeName') !== 'LI') {
        $li = $li.parent();
      }

      $timeout(function() {
        if($li.hasClass('ivh-treeview-node-leaf')) {
          return;
        }
        element.bind('click', function() {
          $li.toggleClass('ivh-treeview-node-collapsed');
        });
      });
    }
  };
}]);


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

