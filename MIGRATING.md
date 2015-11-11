
# Migrating

This document contains notes for migrating between major version numbers of
`angular-ivh-treeview`.


## Major Version 1

### Click and Change Handlers

- The `ivh-treeview-click-handler` attribute was renamed to
  `ivh-treeview-on-toggle`. Similarly, `ivh-treeview-change-handler` was renamed
  to `ivh-treeview-on-cb-change`. Similarly, you should now use `onToggle` and
  `onCbChange` rather than `clickHandler` and `changeHandler` respectively when
  configuring your tree with an options hash (#45, #55).
- The `ivh-treeview-on-toggle` and `ivh-treeview-on-cb-change` attributes now
  expect an angular expression (similar to what you might provide `ng-click`)
  rather than a simple callback. See the README for more details.

### Default Options Changes

- The `validate` option now deafults to `true`, this means trees will be
  validated by default. Set this option to `false` if you prefer the previous
  behavior.

### Node Templates

- Templates now reference the treeview controller instance as `trvw` instead of `ctrl`.
