
/**
 * Configurable settings for `ivh-treeview`
 *
 * @package ivh.treeview
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('ivh.treeview').provider('ivhTreeviewSettings', function() {
  'use strict';
  var settings = {
    labelAttribute: 'label',
    childrenAttribute: 'children',
    selectedAttribute: 'selected',
    indeterminateAttribute: '__ivhTreeviewIntermediate',
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
