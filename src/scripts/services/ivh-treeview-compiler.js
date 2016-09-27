
/**
 * Compile helper for treeview nodes
 *
 * Defers compilation until after linking parents. Otherwise our treeview
 * compilation process would recurse indefinitely.
 *
 * Thanks to http://stackoverflow.com/questions/14430655/recursion-in-angular-directives
 *
 * @private
 * @package ivh.treeview
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('ivh.treeview').factory('ivhTreeviewCompiler', ['$compile', function($compile) {
  'use strict';
  return {
    /**
     * Manually compiles the element, fixing the recursion loop.
     * @param {Object} element The angular element or template
     * @param {Function} link [optional] A post-link function, or an object with function(s) registered via pre and post properties.
     * @returns An object containing the linking functions.
     */
    compile: function(element, link) {
      // Normalize the link parameter
      if(angular.isFunction(link)) {
        link = { post: link };
      }

      var compiledContents;
      var transcludedNodeScope;
      return {
        pre: (link && link.pre) ? link.pre : null,
        /**
         * Compiles and re-adds the contents
         */
        post: function(scope, element, attrs, trvw) {
          // Compile our template
          if(!compiledContents) {
            compiledContents = $compile(trvw.getNodeTpl());
            transcludedNodeScope = trvw.getTranscludedNodeScope();
          }

          // the new node scope will prototypically inherit from the transcluded scope
          // and it's parent will be the current treeview-node scope
          var nodeScope = scope.$new(false, transcludedNodeScope);

          // Add the compiled template
          compiledContents(nodeScope, function(clone) {
            element.append(clone);
          });

          // Call the post-linking function, if any
          if(link && link.post) {
            link.post.apply(null, arguments);
          }
        }
      };
    }
  };
}]);
