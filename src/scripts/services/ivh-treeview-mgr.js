
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

    var findNode = function(tree, node, opts, cb) {
      var useId = isId(node)
        , proceed = true
        , idAttr = opts.idAttribute;

      // Our return values
      var foundNode = null
        , foundParents = [];

      ivhTreeviewBfs(tree, opts, function(n, p) {
        var isNode = proceed && (useId ?
          node === n[idAttr] :
          node === n);

        if(isNode) {
          // I've been looking for you all my life
          proceed = false;
          foundNode = n;
          foundParents = p;
        }

        return proceed;
      });

      return cb(foundNode, foundParents);
    };

    var isId = function(val) {
      return ng.isString(val) || ng.isNumber(val);
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

      var useId = isId(node)
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

          if (opts.disableCheckboxSelectionPropagation) {
            cb(n);
          } else {
            ivhTreeviewBfs(n, opts, cb);
            ng.forEach(p, validateParent.bind(opts));
          }
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
      if(!tree) {
        // Guard against uninitialized trees
        return exports;
      }

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

    /**
     * Expand/collapse a given tree node
     *
     * `node` may be either an actual tree node object or a node id.
     *
     * `opts` may override any of the defaults set by `ivhTreeviewOptions`.
     *
     * @param {Object|Array} tree The tree data
     * @param {Object|String} node The node (or id) to expand/collapse
     * @param {Object} opts [optional] Options to override default options with
     * @param {Boolean} isExpanded [optional] Whether or not to expand `node`, defaults to `true`
     * @return {Object} Returns the ivhTreeviewMgr instance for chaining
     */
    exports.expand = function(tree, node, opts, isExpanded) {
      if(arguments.length > 2) {
        if(typeof opts === 'boolean') {
          isExpanded = opts;
          opts = {};
        }
      }
      opts = ng.extend({}, options, opts);
      isExpanded = ng.isDefined(isExpanded) ? isExpanded : true;

      var useId = isId(node)
        , expandedAttr = opts.expandedAttribute;

      if(!useId) {
        // No need to do any searching if we already have the node in hand
        node[expandedAttr] = isExpanded;
        return exports;
      }

      return findNode(tree, node, opts, function(n, p) {
        n[expandedAttr] = isExpanded;
        return exports;
      });
    };

    /**
     * Expand/collapse a given tree node and its children
     *
     * `node` may be either an actual tree node object or a node id. You may
     * leave off `node` entirely to expand/collapse the entire tree, however, if
     * you specify a value for `opts` or `isExpanded` you must provide a value
     * for `node`.
     *
     * `opts` may override any of the defaults set by `ivhTreeviewOptions`.
     *
     * @param {Object|Array} tree The tree data
     * @param {Object|String} node [optional*] The node (or id) to expand/collapse recursively
     * @param {Object} opts [optional] Options to override default options with
     * @param {Boolean} isExpanded [optional] Whether or not to expand `node`, defaults to `true`
     * @return {Object} Returns the ivhTreeviewMgr instance for chaining
     */
    exports.expandRecursive = function(tree, node, opts, isExpanded) {
      if(arguments.length > 2) {
        if(typeof opts === 'boolean') {
          isExpanded = opts;
          opts = {};
        }
      }
      node = ng.isDefined(node) ? node : tree;
      opts = ng.extend({}, options, opts);
      isExpanded = ng.isDefined(isExpanded) ? isExpanded : true;

      var useId = isId(node)
        , expandedAttr = opts.expandedAttribute
        , branch;

      // If we have an ID first resolve it to an actual node in the tree
      if(useId) {
        findNode(tree, node, opts, function(n, p) {
          branch = n;
        });
      } else {
        branch = node;
      }

      if(branch) {
        ivhTreeviewBfs(branch, opts, function(n, p) {
          n[expandedAttr] = isExpanded;
        });
      }

      return exports;
    };

    /**
     * Collapse a given tree node
     *
     * Delegates to `exports.expand` with `isExpanded` set to `false`.
     *
     * @param {Object|Array} tree The tree data
     * @param {Object|String} node The node (or id) to collapse
     * @param {Object} opts [optional] Options to override default options with
     * @return {Object} Returns the ivhTreeviewMgr instance for chaining
     */
    exports.collapse = function(tree, node, opts) {
      return exports.expand(tree, node, opts, false);
    };

    /**
     * Collapse a given tree node and its children
     *
     * Delegates to `exports.expandRecursive` with `isExpanded` set to `false`.
     *
     * @param {Object|Array} tree The tree data
     * @param {Object|String} node The node (or id) to expand/collapse recursively
     * @param {Object} opts [optional] Options to override default options with
     * @return {Object} Returns the ivhTreeviewMgr instance for chaining
     */
    exports.collapseRecursive = function(tree, node, opts, isExpanded) {
      return exports.expandRecursive(tree, node, opts, false);
    };

    /**
     * Expand[/collapse] all parents of a given node, i.e. "reveal" the node
     *
     * @param {Object|Array} tree The tree data
     * @param {Object|String} node The node (or id) to expand to
     * @param {Object} opts [optional] Options to override default options with
     * @param {Boolean} isExpanded [optional] Whether or not to expand parent nodes
     * @return {Object} Returns the ivhTreeviewMgr instance for chaining
     */
    exports.expandTo = function(tree, node, opts, isExpanded) {
      if(arguments.length > 2) {
        if(typeof opts === 'boolean') {
          isExpanded = opts;
          opts = {};
        }
      }
      opts = ng.extend({}, options, opts);
      isExpanded = ng.isDefined(isExpanded) ? isExpanded : true;

      var expandedAttr = opts.expandedAttribute;

      var expandCollapseNode = function(n) {
        n[expandedAttr] = isExpanded;
      };

      // Even if wer were given the actual node and not its ID we must still
      // traverse the tree to find that node's parents.
      return findNode(tree, node, opts, function(n, p) {
        ng.forEach(p, expandCollapseNode);
        return exports;
      });
    };

    /**
     * Collapse all parents of a give node
     *
     * Delegates to `exports.expandTo` with `isExpanded` set to `false`.
     *
     * @param {Object|Array} tree The tree data
     * @param {Object|String} node The node (or id) to expand to
     * @param {Object} opts [optional] Options to override default options with
     * @return {Object} Returns the ivhTreeviewMgr instance for chaining
     */
    exports.collapseParents = function(tree, node, opts) {
      return exports.expandTo(tree, node, opts, false);
    };

    return exports;
  }
]);
