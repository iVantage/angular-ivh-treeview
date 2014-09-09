
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
