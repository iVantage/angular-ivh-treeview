
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

angular.module('ivh.treeview').directive('ivhTreeview', ['$compile', '$filter', 'ivhTreeviewOptions', function($compile, $filter, ivhTreeviewOptions) {
  'use strict';
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {

      var settings = ivhTreeviewOptions()
        , ivhTreeviewAttr = attrs.ivhTreeview
        , filterAttr = attrs.ivhTreeviewFilter
        , depth = scope.$eval(attrs.ivhTreeviewDepth) || 0
        , expandToDepth = scope.$eval(attrs.ivhTreeviewExpandToDepth) || 0
        , labelAttr = scope.$eval(attrs.ivhTreeviewLabelAttribute) || settings.labelAttribute
        , childrenAttr = scope.$eval(attrs.ivhTreeviewChildrenAttribute) || settings.childrenAttribute
        , selectedAttr = scope.$eval(attrs.ivhTreeviewSelectedAttribute) || settings.selectedAttribute
        , indeterminateAttr = attrs.ivhTreeviewIndeterminateAttribute || settings.indeterminateAttribute
        , visibleAttr = attrs.ivhTreeviewVisibleAttribute || settings.visibleAttribute
        , useCheckboxes = angular.isDefined(attrs.ivhTreeviewUseCheckboxes) ? scope.$eval(attrs.ivhTreeviewUseCheckboxes) : settings.useCheckboxes
        , asArray = $filter('ivhTreeviewAsArray');

      expandToDepth = expandToDepth === -1 ? Infinity : expandToDepth;

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
               * @todo check settings.expandToDepth
               */
              'title="{{itm[\'' + labelAttr + '\']}}"',
              'ng-class="{' +
                '\'ivh-treeview-node-leaf\': !itm[\''+childrenAttr+'\'].length' +
                (expandToDepth <= depth ? ', \'ivh-treeview-node-collapsed\': itm[\''+childrenAttr+'\'].length > 1' : '') +
              '}"',
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
              'ivh-treeview-depth="' + (1+depth) + '"',
              'ivh-treeview-expand-to-depth="' + expandToDepth + '"',
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
 * Breadth first searching for treeview data stores
 *
 * @package ivh.treeview
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('ivh.treeview').factory('ivhTreeviewBfs', ['ivhTreeviewOptions', function(ivhTreeviewOptions) {
  'use strict';

  var ng = angular;

  /**
   * Breadth first search of `tree`
   *
   * `opts` is optional and may override settings from `ivhTreeviewOptions.options`.
   * The callback `cb` will be invoked on each node in the tree as we traverse,
   * if it returns `false` traversal of that branch will not continue. The
   * callback is given the current node as the first parameter and the node
   * ancestors, from closest to farthest, as an array in the second parameter.
   *
   * @param {Array|Object} tree The tree data
   * @param {Object} opts [optional] Settings overrides
   * @param {Function} cb [optional] Callback to run against each node
   */
  return function(tree, opts, cb) {
    if(arguments.length === 2 && ng.isFunction(opts)) {
      cb = opts;
      opts = {};
    }
    opts = angular.extend({}, ivhTreeviewOptions(), opts);
    cb = cb || ng.noop;

    var queue = []
      , childAttr = opts.childrenAttribute
      , next, node, parents, ix, numChildren;

    if(ng.isArray(tree)) {
      ng.forEach(tree, function(n) {
        // node and parents
        queue.push([n, []]);
      });
      next = queue.shift();
    } else {
      // node and parents
      next = [tree, []];
    }

    while(next) {
      node = next[0];
      parents = next[1];
      // cb might return `undefined` so we have to actually check for equality
      // against `false`
      if(cb(node, parents) !== false) {
        if(node[childAttr] && ng.isArray(node[childAttr])) {
          numChildren = node[childAttr].length;
          for(ix = 0; ix < numChildren; ix++) {
            queue.push([node[childAttr][ix], [node].concat(parents)]);
          }
        }
      }
      next = queue.shift();
    }
  };
}]);


/**
 * Manager for treeview data stores
 *
 * Used to assist treeview operations, e.g. selecting or validating a tree-like
 * collection.
 *
 * @package ivh.treeview
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('ivh.treeview')
  .factory('ivhTreeviewMgr', ['ivhTreeviewOptions', 'ivhTreeviewBfs', function(ivhTreeviewOptions, ivhTreeviewBfs) {
    'use strict';
    
    var ng = angular
      , options = ivhTreeviewOptions()
      , exports = {};

    // The make* methods and validateParent need to be bound to an options
    // object
    var makeDeselected = function(node) {
      node[this.selectedAttribute] = false;
      node[this.indeterminateAttribute] = false;
    };

    var makeSelected = function(node) {
      node[this.selectedAttribute] = true;
      node[this.indeterminateAttribute] = false;
    };

    var validateParent = function(node) {
      var children = node[this.childrenAttribute]
        , selectedAttr = this.selectedAttribute
        , indeterminateAttr = this.indeterminateAttribute
        , numSelected = 0
        , numIndeterminate = 0;
      ng.forEach(children, function(n, ix) {
        if(n[selectedAttr]) {
          numSelected++;
        } else {
          if(n[indeterminateAttr]) {
            numIndeterminate++;
          }
        }
      });

      if(0 === numSelected) {
        node[selectedAttr] = false;
        node[indeterminateAttr] = false;
      } else if(numSelected === children.length) {
        node[selectedAttr] = true;
        node[indeterminateAttr] = false;
      } else {
        node[selectedAttr] = false;
        node[indeterminateAttr] = true;
      }
    };

    /**
     * Select (or deselect) a tree node
     *
     * This method will update the rest of the tree to account for your change.
     *
     * You may alternatively pass an id as `node`, in which case the tree will
     * be searched for your item.
     *
     * @param {Object|Array} tree The tree data
     * @param {Object|String} node The node (or id) to (de)select
     * @param {Object} opts [optional] Options to override default options with
     * @param {Boolean} isSelected [optional] Whether or not to select `node`, defaults to `true`
     * @return {Object} Returns the ivhTreeviewMgr instance for chaining
     */
    exports.select = function(tree, node, opts, isSelected) {
      if(arguments.length > 2) {
        if(typeof opts === 'boolean') {
          isSelected = opts;
          opts = {};
        }
      }
      opts = ng.extend({}, options, opts);
      isSelected = ng.isDefined(isSelected) ? isSelected : true;

      var useId = angular.isString(node)
        , proceed = true
        , idAttr = opts.idAttribute;

      ivhTreeviewBfs(tree, opts, function(n, p) {
        var isNode = proceed && (useId ?
          node === n[idAttr] :
          node === n);
        
        if(isNode) {
          // I've been looking for you all my life
          proceed = false;

          var cb = isSelected ?
            makeSelected.bind(opts) :
            makeDeselected.bind(opts);

          ivhTreeviewBfs(n, opts, cb);
          ng.forEach(p, validateParent.bind(opts));
        }

        return proceed;
      });

      return exports;
    };

    /**
     * Select all nodes in a tree
     *
     * `opts` will default to an empty object, `isSelected` defaults to `true`.
     *
     * @param {Object|Array} tree The tree data
     * @param {Object} opts [optional] Default options overrides
     * @param {Boolean} isSelected [optional] Whether or not to select items
     * @return {Object} Returns the ivhTreeviewMgr instance for chaining
     */
    exports.selectAll = function(tree, opts, isSelected) {
      if(arguments.length > 1) {
        if(typeof opts === 'boolean') {
          isSelected = opts;
          opts = {};
        }
      }

      opts = ng.extend({}, options, opts);
      isSelected = ng.isDefined(isSelected) ? isSelected : true;

      var selectedAttr = opts.selectedAttribute
        , indeterminateAttr = opts.indeterminateAttribute;

      ivhTreeviewBfs(tree, opts, function(node) {
        node[selectedAttr] = isSelected;
        node[indeterminateAttr] = false;
      });
    };

    /**
     * Deselect a tree node
     *
     * Delegates to `ivhTreeviewMgr.select` with `isSelected` set to `false`.
     *
     * @param {Object|Array} tree The tree data
     * @param {Object|String} node The node (or id) to (de)select
     * @param {Object} opts [optional] Options to override default options with
     * @return {Object} Returns the ivhTreeviewMgr instance for chaining
     */
    exports.deselect = function(tree, node, opts) {
      return exports.select(tree, node, opts, false);
    };

    /**
     * Deselect all nodes in a tree
     *
     * Delegates to `ivhTreeviewMgr.selectAll` with `isSelected` set to `false`.
     *
     * @param {Object|Array} tree The tree data
     * @param {Object} opts [optional] Default options overrides
     * @return {Object} Returns the ivhTreeviewMgr instance for chaining
     */
    exports.deselectAll = function(tree, opts) {
      return exports.selectAll(tree, opts, false);
    };

    /**
     * Validate tree for parent/child selection consistency
     *
     * Assumes `bias` as default selected state. The first element with
     * `node.select !== bias` will be assumed correct. For example, if `bias` is
     * `true` (the default) we'll traverse the tree until we come to an
     * unselected node at which point we stop and deselect each of that node's
     * children (and their children, etc.).
     *
     * Indeterminate states will also be resolved.
     *
     * @param {Object|Array} tree The tree data
     * @param {Object} opts [optional] Options to override default options with
     * @param {Boolean} bias [optional] Default selected state
     * @return {Object} Returns the ivhTreeviewMgr instance for chaining
     */
    exports.validate = function(tree, opts, bias) {
      if(arguments.length > 1) {
        if(typeof opts === 'boolean') {
          bias = opts;
          opts = {};
        }
      }
      opts = ng.extend({}, options, opts);
      bias = ng.isDefined(bias) ? bias : opts.defaultSelectedState;

      var selectedAttr = opts.selectedAttribute
        , indeterminateAttr = opts.indeterminateAttribute;
      
      ivhTreeviewBfs(tree, opts, function(node, parents) {
        if(ng.isDefined(node[selectedAttr]) && node[selectedAttr] !== bias) {
          exports.select(tree, node, opts, !bias);
          return false;
        } else {
          node[selectedAttr] = bias;
          node[indeterminateAttr] = false;
        }
      });
    };

    return exports;
  }
]);


/**
 * Global options for ivhTreeview
 *
 * @package ivh.treeview
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('ivh.treeview').provider('ivhTreeviewOptions', function() {
  'use strict';

  var options = {
    /**
     * ID attribute
     *
     * For selecting nodes by identifier rather than reference
     */
    idAttribute: 'id',

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
     */
    expandToDepth: 0,

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
    visibleAttribute: '__ivhTreeviewVisible',

    /**
     * Default selected state when validating
     */
    defaultSelectedState: true
  };

  /**
   * Update global options
   *
   * @param {Object} opts options object to override defaults with
   */
  this.update = function(opts) {
    angular.extend(options, opts);
  };

  this.$get = function() {
    /**
     * Get a copy of the global options
     *
     * @return {Object} The options object
     */
    return function() {
      return angular.copy(options);
    };
  };
});
