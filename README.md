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
    useCheckboxes: true,
    expandToDepth: 0,
    indeterminateAttribute: '__ivhTreeviewIndeterminate',
    defaultSelectedState: true,
    validate: true,
    twistieExpandedTpl: '(-)',
    twistieCollapsedTpl: '(+)',
    twistieLeafTpl: 'o',
    nodeTpl: '...'
  });
});
```

### Filtering

We support filtering through the `ivh-treeview-filter` attribute, this value is
supplied to Angular's `filterFilter` and applied to each node individually.

***Demo***: [Filtering](http://jsbin.com/zitiri/edit?html,output)

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

You can also use the `ivhTreeviewOptionsProvider` to set a global default.

If you want the tree *entirely* expanded use a depth of `-1`.

***Demo***: [Expand to depth on
load](http://jsbin.com/ruxedo/edit?html,js,output)

### Default selected state

When using checkboxes you can have a default selected state of `true` or
`false`. This is only relevant if you validate your tree data using
`ivhTreeviewMgr.validate` which will assume this state by default. Use the
`ivh-treeview-default-selected-state` attribute or `defaultSelectedState`.

***Demo***: [Default selected state and validate on
startup](http://jsbin.com/pajeze/2/edit)

### Validate on Startup

`ivh.treeview` tries not to assume control of your model any more than
necessary. It does provide the ability (opt-in) to validate your tree data on
startup. Use `ivh-treeview-validate="true"` at the attribute level or set the
`validate` property in `ivhTreeviewOptionsProvider` to get this behavior.

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
  ivh-treeview-twistie-leaf-tpl="'-->'"></div>
```

Alternatively, you can pass them as part of a [full configuration
object](https://github.com/iVantage/angular-ivh-treeview#all-the-options).


***Demo***: [Custom twisties](http://jsbin.com/gizofu/edit?html,js,output)

### Tree Node Templates

##### Global Templates

Tree node templates can be set globally using the `nodeTpl`  options:

```
app.config(function(ivhTreeviewOptionsProvider) {
  ivhTreeviewOptionsProvider.set({
    nodeTpl: '<custom-template></custom-template>'
  });
});
```

##### Inline Templates

Want different node templates for different trees? This can be accomplished
using inline templates. Inline templates can be specified in any of three ways:

With the `ivh-treeview-node-tpl` attribute:

```
<div ivh-treeview="fancy.bag"
     ivh-treeview-node-tpl="variableWithTplAsString"></div>
```

As a property in the `ivh-treeview-options` object:

```
<div ivh-treeview="fancy.bag"
     ivh-treeview-options="{nodeTpl: variableWithTplAsString}"></div>
```

Or as transcluded content in the treeview directive itself:

```
<div ivh-treeview="fancy.bag">
  <scsript type="text/ng-template">
    <div title="{{trvw.label(node)}}">
      <span ivh-treeview-toggle>
        <span ivh-treeview-twistie></span>
      </span>
      <span ng-if="trvw.useCheckboxes()" ivh-treeview-checkbox>
      </span>
     <span class="ivh-treeview-node-label" ivh-treeview-toggle>
       {{trvw.label(node)}}
     </span>
     <div ivh-treeview-children></div>
   </div>
  </scsript>
</div>
```

Note the use of the ng-template script tag wrapping the rest of the transcluded
content, this wrapper is a mandatory. Also note that this form is intended to
serve as a convenient and declarative way to essentially provide a template
string to your treeview. The template itself does not (currently) have access a
transcluded scope.


##### Template Helper Directives

You have access to a number of helper directives when building your node
templates. These are mostly optional but should make your life a bit easier, not
that all support both element and attribute level usage:

- `ivh-treeview-toggle` (*attribute*) Clicking this element will expand or
  collapse the tree node if it is not a leaf.
- `ivh-treeview-twistie` (*attribute*) Display as either an "expanded" or
  "collapsed" twistie as appropriate.
- `ivh-treeview-checkbox` (*attribute*|*element*) A checkbox that is "plugged
  in" to the treeview.  It will reflect your node's selected state and update
  parents and children appropriately out of the box.
- `ivh-treeview-children` (*attribute*|*element*) The recursive step. If you
  want your tree to display more than one level of nodes you will need to place
  this some where, or have your own way of getting child nodes into the view.

#### Supported Template Scope Variables

**`node`**

A reference to the tree node itself. Note that in general you should use
controller helper methods to access node properties when possible.

**`trvw`**

A reference to the treeview controller with a number of useful properties and
helper functions:

- `trvw.select(Object node[, Boolean isSelected])` <br>
  Set the seleted state of `node` to `isSelected`. The will update parent and
  child node selected states appropriately. `isSelected` defaults to `true`.
- `trvw.isSelected(Object node) -> Boolean` <br>
  Returns `true` if `node` is selected and `false` otherwise.
- `trvw.toggleSelected(Object node)` <br>
  Toggles the selected state of `node`. This will update parent and child note
  selected states appropriately.
- `trvw.expand(Object node[, Boolean isExpanded])` <br>
  Set the expanded state of `node` to `isExpanded`, i.e. expand or collapse
  `node`. `isExpanded` defaults to `true`.
- `trvw.isExpanded(Object node) --> Boolean` <br>
  Returns `true` if `node` is expanded and `false` otherwise.
- `trvw.toggleExpanded(Object node)` <br>
  Toggle the expanded state of `node`.
- `trvw.isLeaf(Object node) --> Boolean` <br>
  Returns `true` if `node` is a leaf node in the tree and `false` otherwise.
- `trvw.label(Object node) --> String` <br>
  Returns the label attribute of `node` as determined by the `labelAttribute`
  treeview option.
- `trvw.children(Object node) --> Array` <br>
  Returns the array of children for `node`. Returns an empty array if `node` has
  no children or the `childrenAttribute` property value is not defined.
- `trvw.opts() --> Object` <br>
  Returns a merged version of the global and local options.
- `trvw.isVisible(Object node) --> Boolean` <br>
  Returns `true` if `node` should be considered visible under the current
  **filter** and `false` otherwise. Note that this only relates to treeview
  filters and does not take into account whether or not `node` can actually be
  seen as a result of expanded/collapsed parents.
- `trvw.useCheckboxes() --> Boolean` <br>
  Returns `true` if checkboxes should be used in the template and `false`
  otherwise.


### Custom onClick Handlers

Want to register a callback for whenever a tree node gets clicked? Use the
`ivh-treeview-click-handler` attribute, the passed function will get called
whenever the user clicks on a twistie or node label. Your callback will be
passed a reference to the node and the three that node belongs to.

```html
<div ng-controller="MyCtrl as fancy">
  <div
    ivh-treeview="fancy.bag"
    ivh-treeview-click-handler="fancy.awesomeCallback">
</div>
```

### Custom onChange Handlers

Want to be notified anytime a checkbox changes state as the result of a click?
Use the `ivh-treeview-change-handler` attribute to register a callback for
whenever a node checkbox changes state. Your callback will be passed a reference
to the node, the new selected status, and a reference to the entire tree the
node belongs to.

Note that programmatic changes to a node's selected state (including selection
change propagation) will not trigger this callback. It is only run for the
actual node clicked on by a user.

```html
<div ng-controller="MyCtrl as fancy">
  <div
    ivh-treeview="fancy.bag"
    ivh-treeview-change-handler="fancy.otherAwesomeCallback">
</div>
```

***Demo***: [Custom Change Handler](http://jsbin.com/hubico/edit?html,js,output)


## All the Options

If passing a configuration object is more your style than inlining everything in
the view, that's OK too.

In your fancy controller...

```javascript
this.customOpts = {
  useCheckboxes: false,
  clickHandler: this.awesomeCallback
};
```

In your view...

```html
<div
    ivh-treeview="fancy.bag"
    ivh-treeview-options="fancy.customOpts">
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

#### `ivhTreeviewMgr.expandTo(tree, node[, opts][, isExpanded])`

Expand (or collapse) all parents of `node`. This may be used to "reveal" a
nested node or to recursively collapse all parents of a node.

#### `ivhTreeviewMgr.collapse(tree, node[, opts])`

A convenience method, delegates to  `ivhTreeviewMgr.expand` with `isExpanded`
set to `false`.

#### `ivhTreeviewMgr.collapseRecursive(tree[, node[, opts]])`

A convenience method, delegates to `ivhTreeviewMgr.expandRecursive` with
`isExpanded` set to `false`,

#### `ivhTreeviewMgr.collapseParents(tree, node[, opts])`

A convenience method, delegates to `ivhTreeviewMgr.expandTo` with `isExpanded`
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


## Reporting Issues

When reporting an issue please take a moment to reproduce your setup by
modifying our [starter template](http://jsbin.com/wecafa/2/edit). Only make as
many changes as necessary to demonstrate your issue but do comment your added
code.


## Contributing

Please see our consolidated [contribution
guidelines](https://github.com/iVantage/Contribution-Guidelines).


## Release history

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
