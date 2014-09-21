
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
    restrict: 'A',
    scope: {
      node: '=ivhTreeviewCheckbox'
    },
    require: '^ivhTreeview',
    link: function(scope, element, attrs, ctrl) {
      var node = scope.node
        , opts = ctrl.opts()
        , indeterminateAttr = opts.indeterminateAttribute
        , selectedAttr = opts.selectedAttribute;

      // Set initial selected state of this checkbox
      scope.isSelected = node[selectedAttr];

      // Local access to the parent controller
      scope.ctrl = ctrl;

      // Update the checkbox when the node's selected status changes
      scope.$watch(function() {
        return node[selectedAttr];
      }, function(newVal, oldVal) {
        scope.isSelected = newVal;
      });

      // Update the checkbox when the node's indeterminate status changes
      scope.$watch(function() {
        return node[indeterminateAttr];
      }, function(newVal, oldVal) {
        element.find('input').prop('indeterminate', newVal);
      });
    },
    template: [
      '<input type="checkbox"',
        'ng-model="isSelected"',
        'ng-change="ctrl.select(node, isSelected)" />'
    ].join('\n')
  };
}]);


/**
 * Treeview tree node directive
 *
 * @private
 * @package ivh.treeview
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('ivh.treeview').directive('ivhTreeviewNode', ['ivhTreeviewCompiler', 'ivhTreeviewOptions', function(ivhTreeviewCompiler, ivhTreeviewOptions) {
  'use strict';
  return {
    restrict: 'A',
    scope: {
      node: '=ivhTreeviewNode',
      depth: '=ivhTreeviewDepth'
    },
    require: '^ivhTreeview',
    compile: function(tElement) {
      return ivhTreeviewCompiler
        .compile(tElement, function(scope, element, attrs, ctrl) {
          var node = scope.node
            , children = scope.children = ctrl.children(node);

          scope.ctrl = ctrl;
          scope.childDepth = scope.depth + 1;

          if(!ctrl.isExpanded(scope.depth)) {
            element.addClass('ivh-treeview-node-collapsed');
          }

          element.attr('title', ctrl.label(node));

          var watcher = scope.$watch(function() {
            return children.length > 0;
          }, function(newVal) {
            if(newVal) {
              element.removeClass('ivh-treeview-node-leaf');
            } else {
              element.addClass('ivh-treeview-node-leaf');
            }
            // watcher();
          });
        });
    },
    template: [
      '<div>',
        '<div>',
          '<span ivh-treeview-toggle="node">',
            '<span class="ivh-treeview-twistie">',
              '<span class="ivh-treeview-twistie-expanded">',
                ivhTreeviewOptions().twistieExpandedTpl,
              '</span>',
              '<span class="ivh-treeview-twistie-collapsed">',
                ivhTreeviewOptions().twistieCollapsedTpl,
              '</span>',
              '<span class="ivh-treeview-twistie-leaf">',
                ivhTreeviewOptions().twistieLeafTpl,
              '</span>',
            '</span>',
          '</span>',
          '<span ng-if="ctrl.useCheckboxes()"',
              'ivh-treeview-checkbox="node">',
          '</span>',
          '<span class="ivh-treeview-node-label" ivh-treeview-toggle>',
            '{{ctrl.label(node)}}',
          '</span>',
        '</div>',
        '<ul ng-if="children.length" class="ivh-treeview">',
          '<li ng-repeat="child in children"',
              'ng-hide="ctrl.hasFilter() && !ctrl.isVisible(child)"',
              'ivh-treeview-node="child"',
              'ivh-treeview-depth="childDepth">',
          '</li>',
        '</ul>',
      '</div>'
    ].join('\n')
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

angular.module('ivh.treeview').directive('ivhTreeviewToggle', [function() {
  'use strict';
  return {
    restrict: 'A',
    require: '^ivhTreeview',
    link: function(scope, element, attrs, ctrl) {
      var node = scope.node
        , children = ctrl.children(node);

      /**
       * @todo Allow opt out of updates if we don't want the extra watchers
       */
      // if(!children.length) {
      //   return;
      // }

      element.addClass('ivh-treeview-toggle');

      var $li = element.parent();

      while($li && $li.prop('nodeName') !== 'LI') {
        $li = $li.parent();
      }

      element.bind('click', function() {
        if(ctrl.children(node).length) {
          $li.toggleClass('ivh-treeview-node-collapsed');
        } else {
          $li.removeClass('ivh-treeview-node-collapsed');
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
 * Treeview tree node directive
 *
 * Thanks to http://stackoverflow.com/questions/14430655/recursion-in-angular-directives
 *
 * @private
 * @package ivh.treeview
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('ivh.treeview').factory('ivhTreeviewCompiler', ['$compile', function($compile){
  'use strict';
  return {
    /**
     * Manually compiles the element, fixing the recursion loop.
     * @param {Object} element The angular element or template
     * @param {Function} link [optional] A post-link function, or an object with function(s) registered via pre and post properties.
     * @returns An object containing the linking functions.
     */
    compile: function(element, link){
      // Normalize the link parameter
      if(angular.isFunction(link)){
        link = { post: link };
      }

      // Break the recursion loop by removing the contents
      var contents = element.contents().remove();
      var compiledContents;
      return {
        pre: (link && link.pre) ? link.pre : null,
        /**
         * Compiles and re-adds the contents
         */
        post: function(scope, element){
          // Compile the contents
          if(!compiledContents){
            compiledContents = $compile(contents);
          }
          // Re-add the compiled contents to the element
          compiledContents(scope, function(clone){
            element.append(clone);
          });

          // Call the post-linking function, if any
          if(link && link.post){
            link.post.apply(null, arguments);
          }
        }
      };
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

      if(0 === numSelected && 0 === numIndeterminate) {
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

      return exports;
    };

    /**
     * Select or deselect each of the passed items
     *
     * Eventually it would be nice if this did something more intelligent than
     * just calling `select` on each item in the array...
     *
     * @param {Object|Array} tree The tree data
     * @param {Array} nodes The array of nodes or node ids
     * @param {Object} opts [optional] Default options overrides
     * @param {Boolean} isSelected [optional] Whether or not to select items
     * @return {Object} Returns the ivhTreeviewMgr instance for chaining
     */
    exports.selectEach = function(tree, nodes, opts, isSelected) {
      /**
       * @todo Surely we can do something better than this...
       */
      ng.forEach(nodes, function(node) {
        exports.select(tree, node, opts, isSelected);
      });
      return exports;
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
     * Deselect each of the passed items
     *
     * Delegates to `ivhTreeviewMgr.selectEach` with `isSelected` set to
     * `false`.
     *
     * @param {Object|Array} tree The tree data
     * @param {Array} nodes The array of nodes or node ids
     * @param {Object} opts [optional] Default options overrides
     * @return {Object} Returns the ivhTreeviewMgr instance for chaining
     */
    exports.deselectEach = function(tree, nodes, opts) {
      return exports.selectEach(tree, nodes, opts, false);
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

      return exports;
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
     * Whether or not directive should validate treestore on startup
     *
     * Must opt-in.
     */
    validate: false,

    /**
     * (internal) Collection item attribute to track intermediate states
     */
    indeterminateAttribute: '__ivhTreeviewIndeterminate',

    /**
     * Default selected state when validating
     */
    defaultSelectedState: true,

    /**
     * Template for expanded twisties
     */
    twistieExpandedTpl: '(-)',

    /**
     * Template for collapsed twisties
     */
    twistieCollapsedTpl: '(+)',

    /**
     * Template for leaf twisties (i.e. no children)
     */
    twistieLeafTpl: 'o'

  };

  /**
   * Update global options
   *
   * @param {Object} opts options object to override defaults with
   */
  this.set = function(opts) {
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
