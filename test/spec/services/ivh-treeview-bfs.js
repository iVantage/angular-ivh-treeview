/*global jQuery, describe, beforeEach, afterEach, it, module, inject, expect */

describe('Service: ivhTreeviewBfs', function() {
  'use strict';

  beforeEach(module('ivh.treeview'));

  var ivhTreeviewBfs;

  var tree
    , nodes
    , stuff
    , hats
    , fedora
    , flatcap
    , bags
    , messenger
    , backpack;

  beforeEach(inject(function(_ivhTreeviewBfs_) {
    ivhTreeviewBfs = _ivhTreeviewBfs_;
  }));

  beforeEach(function() {
    tree = [{
      label: 'Stuff',
      id: 'stuff',
      children: [{
        label: 'Hats',
        id: 'hats',
        children: [{
          label: 'Fedora',
          id: 'fedora'
        }, {
          label: 'Flatcap',
          id: 'flatcap'
        }]
      }, {
        label: 'Bags',
        id: 'bags',
        children: [{
          label: 'Messenger',
          id: 'messenger'
        }, {
          label: 'Backpack',
          id: 'backpack'
        }]
      }]
    }];

    stuff = tree[0];
    hats = stuff.children[0];
    bags = stuff.children[1];
    fedora = hats.children[0];
    flatcap = hats.children[1];
    messenger = bags.children[0];
    backpack = bags.children[1];

    nodes = [hats, bags, fedora, flatcap, messenger, backpack];
  });

  it('should perform a breadth first traversal of the tree', function() {
    var visited = [];
    ivhTreeviewBfs(tree, function(node, parents) {
      visited.push(node.id);
    });
    expect(visited).toEqual([
      'stuff',
      'hats',
      'bags',
      'fedora',
      'flatcap',
      'messenger',
      'backpack'
    ]);
  });

  it('should stop traversal if false is returned', function() {
    var visited = [];
    ivhTreeviewBfs(tree, function(node, parents) {
      visited.push(node.id);
      return node.id !== 'hats';
    });
    expect(visited).toEqual([
      'stuff',
      'hats',
      'bags',
      'messenger',
      'backpack'
    ]);
  });

  it('should build up a list of ancestors', function() {
    var hatsParents = []
      , backpackParents = [];
    ivhTreeviewBfs(tree, function(node, parents) {
      if(node.id === 'hats') {
        parents.forEach(function(n) {
          hatsParents.push(n.id);
        });
      }
      if(node.id === 'backpack') {
        parents.forEach(function(n) {
          backpackParents.push(n.id);
        });
      }
    });
    expect(hatsParents).toEqual(['stuff']);
    expect(backpackParents[0]).toEqual('bags');
    expect(backpackParents[1]).toEqual('stuff');
  });
});


