# Angular IVH Treeview

[![Build Status](https://travis-ci.org/ivantage/angular-ivh-treeview.svg?branch=master)](https://travis-ci.org/ivantage/angular-ivh-treeview)

> A treeview for AngularJS with filtering and checkbox support.


## Example usage

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

```html
<div ng-controller="MyCtrl as fancy">
  <input type="text" ng-model="bagSearch" />

  <div
    ivh-treeview="fancy.bag"
    ivh-treeview-filter="filter:bagSearch"></div>
</div>
```


## Release history

- *soon* (2014-06-20 v0.1.0 Initial release)


## License

[MIT license](https://raw.github.com/ivantage/angular-ivh-treeview/master/LICENSE-MIT), copyright iVantage Health Analytics, Inc.
