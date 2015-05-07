
/**
 * Treeview twistie directive
 *
 * @private
 * @package ivh.treeview
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('ivh.treeview').directive('ivhTreeviewTwistie', ['$compile', 'ivhTreeviewOptions', function($compile, ivhTreeviewOptions) {
  'use strict';

  var globalOpts = ivhTreeviewOptions();

  return {
    restrict: 'A',
    require: '^ivhTreeview',
    template: [
      '<span class="ivh-treeview-twistie">',
        '<span class="ivh-treeview-twistie-collapsed">',
          globalOpts.twistieCollapsedTpl,
        '</span>',
        '<span class="ivh-treeview-twistie-expanded">',
          globalOpts.twistieExpandedTpl,
        '</span>',
        '<span class="ivh-treeview-twistie-leaf">',
          globalOpts.twistieLeafTpl,
        '</span>',
      '</span>'
    ].join('\n'),
    link: function(scope, element, attrs, trvw) {

      if(!trvw.hasLocalTwistieTpls) {
        return;
      }

      var opts = trvw.opts()
        , $twistieContainers = element
          .children().eq(0) // Template root
          .children(); // The twistie spans

      angular.forEach([
        // Should be in the same order as elements in template
        'twistieCollapsedTpl',
        'twistieExpandedTpl',
        'twistieLeafTpl'
      ], function(tplKey, ix) {
        var tpl = opts[tplKey]
          , tplGlobal = globalOpts[tplKey];

        // Do nothing if we don't have a new template
        if(!tpl || tpl === tplGlobal) {
          return;
        }

        // Super gross, the template must actually be an html string, we won't
        // try too hard to enforce this, just don't shoot yourself in the foot
        // too badly and everything will be alright.
        if(tpl.substr(0, 1) !== '<' || tpl.substr(-1, 1) !== '>') {
          tpl = '<span>' + tpl + '</span>';
        }

        var $el = $compile(tpl)(scope)
          , $container = $twistieContainers.eq(ix);

        // Clean out global template and append the new one
        $container.html('').append($el);
      });

    }
  };
}]);
