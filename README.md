# Angular IVH Treeview

[ ![Build Status][travis-img] ][travis-link]

> A treeview for AngularJS with filtering, checkbox support, custom templates,
> and more.

## Contents

- [Getting Started](#getting-started)
- [Example Usage](#example-usage)
- [Options](#options)
  - [Filtering](#filtering)
  - [Expanded by Default](#expanded-by-default)
  - [Default Selected State](#default-selected-state)
  - [Validate on Startup](#validate-on-startup)
  - [Twisties](#twisties)
  - [Templates and Skins](#templates-and-skins)
  - [Toggle Handlers](#toggle-handlers)
  - [Select/Deselect Handlers](#selectdeselect-handlers)
- [All the Options](#all-the-options)
- [Treeview Manager Service](#treeview-manager-service)
    - [`ivhTreeviewMgr.select(tree, node[, opts][, isSelected])`](#ivhtreeviewmgrselecttree-node-opts-isselected)
    - [`ivhTreeviewMgr.selectAll(tree[, opts][, isSelected])`](#ivhtreeviewmgrselectalltree-opts-isselected)
    - [`ivhTreeviewMgr.selectEach(tree, nodes[, opts][, isSelected])`](#ivhtreeviewmgrselecteachtree-nodes-opts-isselected)
    - [`ivhTreeviewMgr.deselect(tree, node[, opts])`](#ivhtreeviewmgrdeselecttree-node-opts)
    - [`ivhTreeviewMgr.deselectAll(tree[, opts])`](#ivhtreeviewmgrdeselectalltree-opts)
    - [`ivhTreeviewMgr.deselectEach(tree, nodes[, opts])`](#ivhtreeviewmgrdeselecteachtree-nodes-opts)
    - [`ivhTreeviewMgr.expand(tree, node[, opts][, isExpanded])`](#ivhtreeviewmgrexpandtree-node-opts-isexpanded)
    - [`ivhTreeviewMgr.expandRecursive(tree[, node[, opts][,isExpanded]])`](#ivhtreeviewmgrexpandrecursivetree-node-opts-isexpanded)
    - [`ivhTreeviewMgr.expandTo(tree, node[, opts][, isExpanded])`](#ivhtreeviewmgrexpandtotree-node-opts-isexpanded)
    - [`ivhTreeviewMgr.collapse(tree, node[, opts])`](#ivhtreeviewmgrcollapsetree-node-opts)
    - [`ivhTreeviewMgr.collapseRecursive(tree[, node[, opts]])`](#ivhtreeviewmgrcollapserecursivetree-node-opts)
    - [`ivhTreeviewMgr.collapseParents(tree, node[, opts])`](#ivhtreeviewmgrcollapseparentstree-node-opts)
    - [`ivhTreeviewMgr.validate(tree[, opts][, bias])`](#ivhtreeviewmgrvalidatetree-opts-bias)
- [Dynamic Changes](#dynamic-changes)
- [Tree Traversal](#tree-traversal)
    - [`ivhTreeviewBfs(tree[, opts][, cb])`](#ivhtreeviewbfstree-opts-cb)
- [Optimizations and Known Limitations](#optimizations-and-known-limitations)
- [Reporting Issues](#reporting-issues)
- [Contributing](#contributing)
- [Release History](#release-history)
- [License](#license)


## Getting Started

IVH Treeview can be installed with bower and npm:

```
bower install angular-ivh-treeview
# or
npm install angular-ivh-treeview
```

Once installed, include the following files in your app:

- `dist/ivh-treeview.js`
- `dist/ivh-treeview.css`
- `dist/ivh-treeview-theme-basic.css` (optional minimalist theme)

And add the `ivh.treeview` module to your main Angular module:

```javascript
angular.module('myApp', [
  'ivh.treeview'
  // other module dependencies...
]);
```

You're now ready to use the `ivh-treeview` directive, `ivhTreeviewMgr` service,
and `ivhTreeviewBfs` service.

## Example Usage

In your controller...

```javascript
app.controller('MyCtrl', function() {
  this.bag = [{
      label: 'Glasses',
      value: 'glasses',
      children: [{
        label: 'Top Hat',
        value: 'top_hat'
      },{
        label: 'Curly Mustache',
        value: 'mustachio'
      }]
  }];

  this.awesomeCallback = function(node, tree) {
    // Do something with node or tree
  };

  this.otherAwesomeCallback = function(node, isSelected, tree) {
    // Do soemthing with node or tree based on isSelected
  }
});
```

In your view...

```html
<div ng-controller="MyCtrl as fancy">
  <input type="text" ng-model="bagSearch" />

  <div
    ivh-treeview="fancy.bag"
    ivh-treeview-filter="bagSearch">
  </div>
</div>
```

## Options

IVH Treeview is pretty configurable. By default it expects your elements to have
`label` and `children` properties for node display text and child nodes
 respectively. It'll also make use of a `selected` attribute to manage selected
states. If you would like to pick out nodes by ID rather than reference it'll
also use an `id` attribute. Those attributes can all be changed, for example:

```html
<div ng-controller="MyCtrl as fancy">
  <div ivh-treeview="fancy.bag"
    ivh-treeview-id-attribute="'uuid'"
    ivh-treeview-label-attribute="'text'"
    ivh-treeview-children-attribute="'items'"
    ivh-treeview-selected-attribute="'isSelected'">
</div>
```

IVH Treeview attaches checkboxes to each item in your tree for a hierarchical
selection model. If you'd rather not have these checkboxes use
`ivh-treeview-use-checkboxes="false"`:

```html
<div ng-controller="MyCtrl as fancy">
  <div ivh-treeview="fancy.bag"
    ivh-treeview-use-checkboxes="false">
</div>
```

There's also a provider if you'd like to change the global defaults:

```javascript
app.config(function(ivhTreeviewOptionsProvider) {
  ivhTreeviewOptionsProvider.set({
    idAttribute: 'id',
    labelAttribute: 'label',
    childrenAttribute: 'children',
    selectedAttribute: 'selected',
    useCheckboxes: true,
    expandToDepth: 0,
    indeterminateAttribute: '__ivhTreeviewIndeterminate',
    expandedAttribute: '__ivhTreeviewExpanded',
    defaultSelectedState: true,
    validate: true,
    twistieExpandedTpl: '(-)',
    twistieCollapsedTpl: '(+)',
    twistieLeafTpl: 'o',
    nodeTpl: '...'
  });
});
```

Note that you can also use the `ivhTreeviewOptions` service to inspect global
options at runtime. For an explanation of each option see the comments in the
[source for ivhTreeviewOptions][trvw-opts].

```javascript
app.controller('MyCtrl', function(ivhTreeviewOptions) {
  var opts = ivhTreeviewOptions();

  // opts.idAttribute === 'id'
  // opts.labelAttribute === 'label'
  // opts.childrenAttribute === 'children'
  // opts.selectedAttribute === 'selected'
  // opts.useCheckboxes === true
  // opts.expandToDepth === 0
  // opts.indeterminateAttribute === '__ivhTreeviewIndeterminate'
  // opts.expandedAttribute === '__ivhTreeviewExpanded'
  // opts.defaultSelectedState === true
  // opts.validate === true
  // opts.twistieExpandedTpl === '(-)'
  // opts.twistieCollapsedTpl === '(+)'
  // opts.twistieLeafTpl === 'o'
  // opts.nodeTpl =(eh)= '...'
});

```


### Filtering

We support filtering through the `ivh-treeview-filter` attribute, this value is
supplied to Angular's `filterFilter` and applied to each node individually.

IVH Treeview uses `ngHide` to hide filtered out nodes. If you would like to
customize the hide/show behavior of nodes as they are filtered in and out of
view (e.g. with `ngAnimate`) you can target elements with elements with the
`.ivh-treeview-node` class:

```css
/* with e.g. keyframe animations */
.ivh-treeview-node.ng-enter {
  animation: my-enter-animation 0.5s linear;
}

.ivh-treeview-node.ng-leave {
  animation: my-leave-animation 0.5s linear;
}

/* or class based animations */
.ivh-treeview-node.ng-hide {
  transition: 0.5s linear all;
  opacity: 0;
}

/* alternatively, just strike-through filtered out nodes */
.ivh-treeview-node.ng-hide {
  display: block !important;
}

.ivh-treeview-node.ng-hide .ivh-treeview-node-label {
  color: red;
  text-decoration: line-through;
}
```

***Demo***: [Filtering](http://jsbin.com/zitiri/edit?html,output)

### Expanded by Default

If you want the tree to start out expanded to a certain depth use the
`ivh-treeview-expand-to-depth` attribute:

```html
<div ng-controller="MyCtrl as fancy">
  <div
    ivh-treeview="fancy.bag"
    ivh-treeview-expand-to-depth="2"
    ivh-treeview-use-checkboxes="false">
</div>
```

You can also use the `ivhTreeviewOptionsProvider` to set a global default.

If you want the tree *entirely* expanded use a depth of `-1`. Providing a depth
greater than your tree's maximum depth will cause the entire tree to be
initially expanded.

***Demo***: [Expand to depth on
load](http://jsbin.com/ruxedo/edit?html,js,output)

### Default Selected State

When using checkboxes you can have a default selected state of `true` or
`false`. The default selected state is used when validating your tree data with
`ivhTreeviewMgr.validate` which will assume this state if none is specified,
i.e. any node without a selected state will assume the default state.
Futhermore, when `ivhTreeviewMgr.validate` finds a node whose selected state
differs from the default it will assign the same state to each of that node's
childred, parent nodes are updated accordingly.

Use `ivh-treeview-default-selected-state` attribute or `defaultSelectedState`
option to set this property.

***Demo***: [Default selected state and validate on
startup](http://jsbin.com/pajeze/2/edit)

### Validate on Startup

`ivh.treeview` will not assume control of your model on startup if you do not
want it to. You can opt out of validation on startup by setting
`ivh-treeview-validate="false"` at the attribute level or by globally setting
the `validate` property in `ivhTreeviewOptionsProvider`.

***Demo***: [Default selected state and validate on
startup](http://jsbin.com/pajeze/2/edit)

### Twisties

The basic twisties that ship with this `ivh.treeview` are little more than ASCII
art. You're encouraged to use your own twistie templates. For example, if you've
got bootstrap on your page you might do something like this:

```javascript
ivhTreeviewOptionsProvider.set({
  twistieCollapsedTpl: '<span class="glyphicon glyphicon-chevron-right"></span>',
  twistieExpandedTpl: '<span class="glyphicon glyphicon-chevron-down"></span>',
  twistieLeafTpl: '&#9679;'
});
```

If you need different twistie templates for different treeview elements you can
assign these templates at the attribute level:

```html
<div
  ivh-treeview="fancy.bag"
  ivh-treeview-twistie-leaf-tpl="'-->'">
</div>
```

Alternatively, you can pass them as part of a [full configuration
object](https://github.com/iVantage/angular-ivh-treeview#all-the-options).


***Demo***: [Custom twisties](http://jsbin.com/gizofu/edit?html,js,output)

### Templates and Skins

IVH Treeview allows you to fully customize your tree nodes. See
[docs/templates-and-skins.md](docs/templates-and-skins.md) for demos and
details.

### Toggle Handlers

Want to register a callback for whenever a user expands or collapses a node? Use
the `ivh-treeview-on-toggle` attribute. Your expression will be evaluated with
the following local variables: `ivhNode`, the node that was toggled; `ivhTree`,
the tree it belongs to; `ivhIsExpanded`, whether or not the node is now
expanded.

```html
<div ng-controller="MyCtrl as fancy">
  <div
    ivh-treeview="fancy.bag"
    ivh-treeview-on-toggle="fancy.awesomeCallback(ivhNode, ivhIsExpanded, ivhTree)">
</div>
```

You may also supply a toggle handler as a function (rather than an angular
expression) using `ivh-treeview-options` or by setting a global `onToggle`
option. In this case the function will be passed a single object with `ivhNode`
and `ivhTree` properties.

***Demo***: [Toggle Handler](http://jsbin.com/xegari/edit)

### Select/Deselect Handlers

Want to be notified any time a checkbox changes state as the result of a click?
Use the `ivh-treeview-on-cb-change` attribute. Your expression will be evaluated
whenever a node checkbox changes state with the following local variables:
`ivhNode`, the node whose selected state changed; `ivhIsSelected`, the new
selected state of the node; and `ivhTree`, the tree `ivhNode` belongs to.

You may also supply a selected handler as a function (rather than an angular
expression) using `ivh-treeview-options` or by setting a global `onCbChange`
option. In this case the function will be passed a single object with `ivhNode`,
`ivhIsSelected`, and `ivhTree` properties.

Note that programmatic changes to a node's selected state (including selection
change propagation) will not trigger this callback. It is only run for the
actual node clicked on by a user.

```html
<div ng-controller="MyCtrl as fancy">
  <div
    ivh-treeview="fancy.bag"
    ivh-treeview-on-cb-change="fancy.otherAwesomeCallback(ivhNode, ivhIsSelected, ivhTree)">
</div>
```

***Demo***: [Select/Deselect Handler](http://jsbin.com/febexe/edit)


## All the Options

If passing a configuration object is more your style than inlining everything in
the view, that's OK too.

In your fancy controller...

```javascript
this.customOpts = {
  useCheckboxes: false,
  onToggle: this.awesomeCallback
};
```

In your view...

```html
<div
    ivh-treeview="fancy.bag"
    ivh-treeview-options="fancy.customOpts">
</div>
```

Any option that can be set with `ivhTreeviewOptionsProvider` can be overriden
here.


## Treeview Manager Service

`ivh.treeview` supplies a service, `ivhTreeviewMgr`, for interacting with your
tree data directly.

#### `ivhTreeviewMgr.select(tree, node[, opts][, isSelected])`

Select (or deselect) an item in `tree`, `node` can be either a reference to the
actual tree node or its ID.

We'll use settings registered with `ivhTreeviewOptions` by default, but you can
override any of them with the optional `opts` parameter.

`isSelected` is also optional and defaults to `true` (i.e. the node will be
selected).

When an item is selected each of its children are also selected and the
indeterminate state of each of the node's parents is validated.

***Demo***: [Programmatic select/deselect](http://jsbin.com/kotohu/edit)

#### `ivhTreeviewMgr.selectAll(tree[, opts][, isSelected])`

Like `ivhTreeviewMgr.select` except every node in `tree` is either selected or
deselected.

***Demo***: [Programmatic selectAll/deselectAll](http://jsbin.com/buhife/edit)

#### `ivhTreeviewMgr.selectEach(tree, nodes[, opts][, isSelected])`

Like `ivhTreeviewMgr.select` except an array of nodes (or node IDs) is used.
Each node in `tree` corresponding to one of the passed `nodes` will be selected
or deselected.

***Demo***: [Programmatic selectEach/deselectEach](http://jsbin.com/burigo/edit)

#### `ivhTreeviewMgr.deselect(tree, node[, opts])`

A convenience method, delegates to `ivhTreeviewMgr.select` with `isSelected` set
to `false`.

***Demo***: [Programmatic select/deselect](http://jsbin.com/kotohu/edit)

#### `ivhTreeviewMgr.deselectAll(tree[, opts])`

A convenience method, delegates to `ivhTreeviewMgr.selectAll` with `isSelected`
set to `false`.

***Demo***: [Programmatic selectAll/deselectAll](http://jsbin.com/buhife/edit)

#### `ivhTreeviewMgr.deselectEach(tree, nodes[, opts])`

A convenience method, delegates to `ivhTreeviewMgr.selectEach` with `isSelected`
set to `false`.

***Demo***: [Programmatic selectEach/deselectEach](http://jsbin.com/burigo/edit)

#### `ivhTreeviewMgr.expand(tree, node[, opts][, isExpanded])`

Expand (or collapse) a given `node` in `tree`, again `node` may be an actual
object reference or an ID.

We'll use settings registered with `ivhTreeviewOptions` by default, but you can
override any of them with the optional `opts` parameter.

By default this method will expand the node in question, you may pass `false` as
the last parameter though to collapse the node. Or, just use
`ivhTreeviewMgr.collapse`.

***Demo***: [Programmatic expand/collapse](http://jsbin.com/degofo/edit?html,js,output)

#### `ivhTreeviewMgr.expandRecursive(tree[, node[, opts][, isExpanded]])`

Expand (or collapse) `node` and all its child nodes. Note that you may omit the
`node` parameter (i.e. expand/collapse the entire tree) but only when all other
option parameters are also omitted.

***Demo***: [Programmatic recursive expand/collapse](http://jsbin.com/wugege/edit)

#### `ivhTreeviewMgr.expandTo(tree, node[, opts][, isExpanded])`

Expand (or collapse) all parents of `node`. This may be used to "reveal" a
nested node or to recursively collapse all parents of a node.

***Demo***: [Programmatic reveal/hide](http://jsbin.com/musodi/edit)

#### `ivhTreeviewMgr.collapse(tree, node[, opts])`

A convenience method, delegates to  `ivhTreeviewMgr.expand` with `isExpanded`
set to `false`.

#### `ivhTreeviewMgr.collapseRecursive(tree[, node[, opts]])`

A convenience method, delegates to `ivhTreeviewMgr.expandRecursive` with
`isExpanded` set to `false`,

***Demo***: [Programmatic recursive expand/collapse](http://jsbin.com/wugege/edit)

#### `ivhTreeviewMgr.collapseParents(tree, node[, opts])`

A convenience method, delegates to `ivhTreeviewMgr.expandTo` with `isExpanded`
set to `false`.

***Demo***: [Programmatic reveal/hide](http://jsbin.com/musodi/edit)

#### `ivhTreeviewMgr.validate(tree[, opts][, bias])`

Validate a `tree` data store, `bias` is a convenient redundancy for
`opts.defaultSelectedState`.

When validating tree data we look for the first node in each branch which has a
selected state defined that differs from `opts.defaultSelectedState` (or
`bias`). Each of that node's children are updated to match the differing node
and parent indeterminate states are updated.

***Demo***: [Programmatic select/deselect](http://jsbin.com/bexedi/edit)

## Dynamic Changes

Adding and removing tree nodes on the fly is supported. Just keep in mind that
added nodes do not automatically inherit selected states (i.e. checkbox states)
from their parent nodes. Similarly, adding new child nodes does not cause parent
nodes to automatically validate their own selected states. You will typically
want to use `ivhTreeviewMgr.validate` or `ivhTreeviewMgr.select` after adding
new nodes to your tree:

```javascript
// References to the tree, parent node, and children...
var tree = getTree()
  , parent = getParent()
  , newNodes = [{label: 'Hello'},{label: 'World'}];

// Attach new children to parent node
parent.children = newNodes;

// Force revalidate on tree given parent node's selected status
ivhTreeviewMgr.select(myTree, parent, parent.selected);
```

## Tree Traversal

The internal tree traversal service is exposed as `ivhTreeviewBfs` (bfs -->
breadth first search).

#### `ivhTreeviewBfs(tree[, opts][, cb])`

We perform a breadth first traversal of `tree` applying the function `cb` to
each node as it is reached. `cb` is passed two parameters, the node itself and
an array of parents nodes ordered nearest to farthest. If the `cb` returns
`false` traversal of that branch is stopped.

Note that even if `false` is returned each of `nodes` siblings will still be
traversed. Essentially none of `nodes` children will be added to traversal
queue. All other branches in `tree` will be traversed as normal.

In other words returning `false` tells `ivhTreeviewBfs` to go no deeper in the
current branch only.

***Demo***: [`ivhTreeviewBfs` in
action](http://jsbin.com/wofunu/1/edit?html,js,output)


## Optimizations and Known Limitations

### Performance at Scale

The default node template assumes a reasonable number of tree nodes. As your
tree grows (3k-10k+ nodes) you will likely notice a significant dip in
performance. This can be mitigated by using a custom template with a few easy
tweaks.

**Only process visible nodes** by adding an `ng-if` to the
`ivh-treeview-children` element. This small change will result in significant
performance boosts for large trees as now only the visible nodes (i.e. nodes
with all parents expanded) will be processed. This change will likely be added
to the default template in version 1.1.

**Use Angular's bind-once syntx in a custom template**. The default template
supports angular@1.2.x and so does not leverage the native double-colon syntax
to make one time bindings. By binding once where possible you can trim a large
number of watches from your trees.

## Reporting Issues and Getting Help

When reporting an issue please take a moment to reproduce your setup by
modifying our [starter template](http://jsbin.com/wecafa/2/edit). Only make as
many changes as necessary to demonstrate your issue but do comment your added
code.

Please use Stack Overflow for general questions and help with implementation.


## Contributing

Please see our consolidated [contribution
guidelines](https://github.com/iVantage/Contribution-Guidelines).


## Release History

- 2015-11-29 v1.0.2 Allow numeric ids as well ass tring ids
- 2015-09-23 v1.0.0 Use expressions rather than callbacks for change/toggle
  handlers, update default template. See MIGRATING doc for breaking changes.
- 2015-05-06 v0.10.0 Make node templates customizable
- 2015-02-10 v0.9.0 All options are set-able via attributes or config object
- 2015-01-02 v0.8.0 Add ability to expand/collapse nodes programmatically
- 2014-09-21 v0.6.0 Tree accepts nodes added on the fly
- 2014-09-09 v0.3.0 Complete refactor. Directive no longer propagates changes
  automatically on programmatic changes, use ivhTreeviewMgr.
- 2014-08-25 v0.2.0 Allow for initial expansion
- 2014-06-20 v0.1.0 Initial release


## License

[MIT license][license], copyright iVantage Health Analytics, Inc.

[license]: https://raw.github.com/iVantage/angular-ivh-treeview/master/LICENSE-MIT
[bootstrap]: http://getbootstrap.com/
[travis-img]: https://travis-ci.org/iVantage/angular-ivh-treeview.svg?branch=master
[travis-link]: https://travis-ci.org/iVantage/angular-ivh-treeview
[trvw-opts]: https://github.com/iVantage/angular-ivh-treeview/blob/master/src/scripts/services/ivh-treeview-options.js#L13-L103
