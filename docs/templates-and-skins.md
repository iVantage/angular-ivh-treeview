
## Contents

- [Basic Skins](#basic-skins)
  - [Tree Layout](#tree-layout)
- [Global Templates](#global-templates)
- [Inline Templates](#inline-templates)
- [Template Helper Directives](#template-helper-directives)
- [Supported Template Scope Variables](#supported-template-scope-variables)


### Skins

Custom node templates are most likely overkill for style tweaks. Making the look
and feel of your tree match the rest of your application can often be
accomplished with a bit of css and your own twisties. IVH Treeview ships with
only minimal styling and you are encouraged to apply your own styles.

#### Tree Layout

Using the default template your tree will have the following general layout to
aid in styling:

```
ul.ivh-treeview
  li.ivh-treeview-node[?.ivh-treeview-node-collapsed][?.ivh-treeview-node-leaf]

    <!-- begin node template -->

    .ivh-treeview-node-content
      .ivh-treeview-twistie-wrapper
        .ivh-treeview-twistie
          [?.ivh-treeview-twistie-collapsed]
          [?.ivh-treeview-twistie-expanded]
          [?.ivh-treeview-twistie-leaf]
      .ivh-treeview-checkbox-wrapper
        .ivh-treeview-checkbox
      .ivh-treeview-node-label
      ul.ivh-treeview
        [... more nodes]

  [... more nodes]
```

Where `ivh-treeview-node-collapsed` and the various twistie classnames are
conditionally applied as appropriate.

The top level `li` for a given node is give the classname
`ivh-treeview-node-leaf` when it is a leaf node.

### Global Templates

Tree node templates can be set globally using the `nodeTpl`  options:

```
app.config(function(ivhTreeviewOptionsProvider) {
  ivhTreeviewOptionsProvider.set({
    nodeTpl: '<custom-template></custom-template>'
  });
});
```

### Inline Templates

Want different node templates for different trees? This can be accomplished
using inline templates. Inline templates can be specified in any of three ways:

With the `ivh-treeview-node-tpl` attribute:

```
<div ivh-treeview="fancy.bag"
     ivh-treeview-node-tpl="variableWithTplAsString"></div>
```

***Demo***: [Custom templates: inline](http://jsbin.com/fokunu/edit)

As a property in the `ivh-treeview-options` object:

```
<div ivh-treeview="fancy.bag"
     ivh-treeview-options="{nodeTpl: variableWithTplAsString}"></div>
```

Or as transcluded content in the treeview directive itself:

```
<div ivh-treeview="fancy.bag">
  <script type="text/ng-template">
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
  </script>
</div>
```

***Demo***: [Custom templates: transcluded](http://jsbin.com/jaqosi/edit)

Note the use of the ng-template script tag wrapping the rest of the transcluded
content, this wrapper is a mandatory. Also note that this form is intended to
serve as a convenient and declarative way to essentially provide a template
string to your treeview. The template itself does not (currently) have access a
transcluded scope.


### Template Helper Directives

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

**`depth`**

The depth of the current node in the tree. The root node will be at depth `0`,
its children will be at depth `1`, etc.

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
- `trvw.root() --> Array|Object` <br>
  Returns the tree root as handed to `ivh-treeview`.
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

