# Angular IVH Treeview

[ ![Build Status][travis-img] ][travis-link]

> A treeview for AngularJS with filtering and checkbox support.

## Example usage

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
    ivh-treeview-filter="bagSearch"></div>
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
    useCheckboses: true,
    expandToDepth: 0,
    indeterminateAttribute: '__ivhTreeviewIndeterminate',
    defaultSelectedState: true,
    validate: true,
    twistieExpandedTpl: '(-)',
    twistieCollapsedTpl: '(+)',
    twistieLeafTpl: 'o'
  });
});
```

### Filtering

We support filtering through the `ivh-treeview-filter` attribute, this value is
supplied to Angular's `filterFilter` and applied to each node individually.

### Expanded by default

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

You can also sue the `ivhTreeviewOptionsProvider` to set a global default.

If you want the tree *entirely* expanded use a depth of `-1`.

### Default selected state

When using checkboxes you can have a default selected state of `true` or
`false`. This is only relevant if you validate your tree data using
`ivhTreeviewMgr.validate` which will assume this state by default. Use the
`ivh-treeview-default-selected-state` attribute or `defaultSelectedState`.

### Validate on Startup

`ivh.treeview` tries not to assume control of your model any more than
necessary. It does provide the ability (opt-in) to validate your tree data on
startup. Use `ivh-treeview-validate="true"` at the attribute level or set the
`validate` property in `ivhTreeviewOptionsProvider` to get this behavior.

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

### Custom onClick Handlers

Want to register a callback for whenever a tree node gets clicked? Use the
`ivh-treeview-click-handler` attribute, the passed function will get called
whenver the user clicks on a twistie or node label:

```html
<div ng-controller="MyCtrl as fancy">
  <div
    ivh-treeview="fancy.bag"
    ivh-treeview-click-handler="fancy.awesomeCallback">
</div>
```

### Custom onChange Handlers

Want to be notified anytime a checkbox changes state? Use the
`ivh-treeview-change-handler` attribute to register a callback for whenever a
node checkbox changes state. Your callback will be passed a reference to the
node, the new selected status, and a reference to the entire tree the node
belongs to.

```html
<div ng-controller="MyCtrl as fancy">
  <div
    ivh-treeview="fancy.bag"
    ivh-treeview-change-handler="fancy.otherAwesomeCallback">
</div>
```

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

#### `ivhTreeviewMgr.selectAll(tree[, opts][, isSelected])`

Like `ivhTreeviewMgr.select` except every node in `tree` is either selected or
deselected.

#### `ivhTreeviewMgr.selectEach(tree, nodes[, opts][, isSelected])`

Like `ivhTreeviewMgr.select` except an array of nodes (or node IDs) is used.
Each node in `tree` corresponding to one of the passed `nodes` will be selected
or deselected.

#### `ivhTreeviewMgr.deselect(tree, node[, opts])`

A convenience method, delegates to `ivhTreeviewMgr.select` with `isSelected` set
to `false`.

#### `ivhTreeviewMgr.deselectAll(tree[, opts])`

A convenience method, delegates to `ivhTreeviewMgr.selectAll` with `isSelected`
set to `false`.

#### `ivhTreeviewMgr.deselectEach(tree, nodes[, opts])`

A convenience method, delegates to `ivhTreeviewMgr.selectEach` with `isSelected`
set to `false`.

#### `ivhTreeviewMgr.validate(tree[, opts][, bias])`

Validate a `tree` data store, `bias` is a convenient redundancy for
`opts.defaultSelectedState`.

When validating tree data we look for the first node in each branch which has a
selected state defined that differs from `opts.defaultSelectedState` (or
`bias`). Each of that node's children are updated to match the differing node
and parent indeterminate states are updated.

## Dynamic Changes

Adding and removing tree nodes on the fly is supported. Just keep in mind that
added nodes do not automatically inherit selected states (i.e. checkbox states)
from their parent nodes. Similarly, adding new child nodes does not cause parent
nodes to automatically validate their own selected states. You will typically
want to use `ivhTreeviewMgr.validate` or `ivhTreeviewMgr.select` after adding
new nodes to your tree:

```
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

We preform a breadth first traversal of `tree` applying the function `cb` to
each node as it is reached. `cb` is passed two parameters, the node itself and
an array of parents nodes ordered nearest to farthest. If the `cb` returns
`false` traversal of that branch is stopped.

## Release history

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
