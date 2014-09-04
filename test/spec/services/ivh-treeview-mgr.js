/*global jQuery, describe, beforeEach, afterEach, it, module, inject, expect */

describe('Service: ivhTreeviewMgr', function() {
  'use strict';

  beforeEach(module('ivh.treeview'));

  var ivhTreeviewMgr;

  var tree = [{
    label: 'Stuff',
    id: 'stuff',
    children: [{
      label: 'Hats',
      id: 'hats',
      children: [{
        label: 'Fedora',
        id: 'fedora'
      },{
        label: 'Flatcap',
        id: 'flatcap'
      }]
    },{
      label: 'Bags',
      id: 'bags',
      children: [{
        label: 'Messenger',
        id: 'baseball'
      },{
        label: 'Backpack',
        id: 'backpack'
      }]
    }]
  }];

  beforeEach(inject(function(_ivhTreeviewMrg_) {
    ivhTreeviewMgr = _ivhTreeviewMrg_;
  }));

  describe('#select', function() {
    // ...
  });

  describe('#deselect', function() {
    // ...
  });

  describe('#validate', function() {
    // ...
  });

  describe('#options', function() {
    // ... different options every time
  });

});

