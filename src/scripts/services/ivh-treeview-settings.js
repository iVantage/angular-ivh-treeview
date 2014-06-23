
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
    useCheckboses: true,

    /**
     * (internal) Collection item attribute to track intermediate states
     */
    indeterminateAttribute: '__ivhTreeviewIntermediate',

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
