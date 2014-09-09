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
    twistieExpandedTpl: '(-)',
    twistieCollapsedTpl: '(+)',
    twistieLeafTpl: 'o'
  });
});
```

### Expanded by default

If you want to tree to start out expanded to a certain depth use the
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

## Release history

- 2014-08-25 v0.2.0 Allow for initial expansion
- 2014-06-20 v0.1.0 Initial release


## License

[MIT license][license], copyright iVantage Health Analytics, Inc.

[license]: https://raw.github.com/iVantage/angular-ivh-treeview/master/LICENSE-MIT 
[bootstrap]: http://getbootstrap.com/
[travis-img]: https://travis-ci.org/iVantage/angular-ivh-treeview.svg?branch=master
[travis-link]: https://travis-ci.org/iVantage/angular-ivh-treeview
