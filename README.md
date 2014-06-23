# Angular IVH Treeview

[![Build Status][travis-img]][travis-link]

> A treeview for AngularJS with filtering and checkbox support.

Default styles depend on [Bootstrap 3][bootstrap].

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
    ivh-treeview-filter="filter:bagSearch"></div>
</div>
```

## Options

IVH Treeview is pretty configurable. By default it expects your elements to have
`label` and `children` properties for node display text and child nodes
respectively. It'll also make use of a `selected` attribute to manage selected
states. Those attributes can all be changed:

```html
<div ng-controller="MyCtrl as fancy">
  <div
    ivh-treeview="fancy.bag"
    ivh-treeview-label-attribute="'text'"
    ivh-treeview-children-attribute="'items'"
    ivh-treeview-selected-attribute="'isSelected'">
</div>
```

IVH Treeview attaches checkboxes to each item in your tree for hierarchical
selection model. If you'd rather not have these checkboxes use
`ivh-treeview-use-checkboxes="false"`:

```html
<div ng-controller="MyCtrl as fancy">
  <div
    ivh-treeview="fancy.bag"
    ivh-treeview-use-checkboxes="false">
</div>
```

There's also a provider if you'd like to change the global defaults:

```javascript
app.config(function(ivhTreeviewSettingsProvider) {
  ivhTreeviewSettingsProvider.set({
    labelAttribute: 'text',
    childrenAttribute: 'items',
    selectedAttribute: 'isSelected',
    useCheckboses: false
  });
});
```


## Release history

- *soon* (2014-06-20 v0.1.0 Initial release)


## License

[MIT license][license], copyright iVantage Health Analytics, Inc.

[license]: https://raw.github.com/ivantage/angular-ivh-treeview/master/LICENSE-MIT 
[bootstrap]: http://getbootstrap.com/
[travis-img]: https://travis-ci.org/ivantage/angular-ivh-treeview.svg?branch=master
[travis-link]: https://travis-ci.org/ivantage/angular-ivh-treeview
