
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

angular.module('ivh.treeview').directive('ivhTreeviewCheckbox', [function() {
  'use strict';
  return {
    link: function(scope, element, attrs) {
      var node = scope[attrs.ivhTreeviewCheckbox]
        , parent = scope[attrs.ivhTreeviewParent]
        , indeterminateAttr = attrs.ivhTreeviewIndeterminateAttribute
        , selectedAttr = attrs.ivhTreeviewSelectedAttribute;

      //var validateCb = function() {
      //    var isIndeterminate = node[indeterminateAttr];
      //    element.prop('indeterminate', isIndeterminate);
      //};

      var makeDeterminate = function() {
        node[indeterminateAttr] = false;
      };

      /**
       * Checkbox click handler
       *
       * Note that this fires *after* the change event
       */
      element.bind('click', function(event) {
        makeDeterminate();
      });

      /**
       * Internal event registration
       */
      scope.$on('event_ivhTreeviewSelectAll', makeDeterminate);

      scope.$watch(function() {
        return node[indeterminateAttr];
      }, function(newVal, oldVal) {
        element.prop('indeterminate', node[indeterminateAttr]);
      });

      /**
       * Watch for selected status changes
       */
      scope.$watch(function() {
        return node[selectedAttr];
      }, function(newVal, oldVal) {
        if(!angular.isUndefined(newVal)) {
          /**
           * @todo Only bother with updates if our selected status differs from
           * the parent node.
           */
          if(!node[indeterminateAttr]) {
            scope.$broadcast('event_ivhTreeviewSelectAll', node[selectedAttr]);
          }
          scope.$parent.$emit('event_ivhTreeviewValidate');
        }
      });
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
      if(!filterAttr || filterAttr === 'undefined') {
        node[visibleAttr] = true;
        return;
      }
      
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

angular.module('ivh.treeview').directive('ivhTreeviewNodeToggle', [function() {
  'use strict';
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var canToggle = scope.$eval(attrs.ivhTreeviewNodeToggle);

      var $li = element.parent();

      while($li && $li.prop('nodeName') !== 'LI') {
        $li = $li.parent();
      }

      element.bind('click', function() {
        if(!$li.hasClass('ivh-treeview-node-leaf')) {
          $li.toggleClass('ivh-treeview-node-collapsed');
        }
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
              'title="{{itm[\'' + labelAttr + '\']}}"',
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
              'ivh-treeview-indeterminate-attribute="' + indeterminateAttr + '"',
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



angular.module('ivh.treeview').filter('ivhTreeviewAsArray', function() {
  'use strict';
  return function(arr) {
    if(!angular.isArray(arr) && angular.isObject(arr)) {
      return [arr];
    }
    return arr;
  };
});

/**
 * Configurable settings for `ivh-treeview`
 *
 * @package ivh.treeview
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('ivh.treeview').provider('ivhTreeviewSettings', function() {
  'use strict';
  var settings = {
    /**
     * Collection item attribute to use for labels
     */
    labelAttribute: 'label',

    /**
     * Collection item attribute to use for child nodes
     */
    childrenAttribute: 'children',

    /**
     * Collection item attribute to use for selected state
     */
    selectedAttribute: 'selected',

    /**
     * Controls whether branches are initially expanded or collapsed
     *
     * A value of `0` means the tree will be entirely collapsd (the default
     * state) otherwise branches will be expanded up to the specified depth. Use
     * `-1` to have the tree entirely expanded.
     *
     * @todo Implement handling non-zero values
     */
    expandByDefaultDepth: 0,

    /**
     * Whether or not to use checkboxes
     *
     * If `false` the markup to support checkboxes is not included in the
     * directive.
     */
    useCheckboxes: true,

    /**
     * (internal) Collection item attribute to track intermediate states
     */
    indeterminateAttribute: '__ivhTreeviewIndeterminate',

    /**
     * (internal) Collection item attribute to track visible states
     */
    visibleAttribute: '__ivhTreeviewVisible'
  };

  this.set = function(opts) {
    angular.extend(settings, opts);
  };

  this.$get = function() {
    return {
      get: function() {
        return angular.copy(settings);
      }
    };
  };
});
