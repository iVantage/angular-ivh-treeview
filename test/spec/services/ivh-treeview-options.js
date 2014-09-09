/*global jQuery, describe, beforeEach, afterEach, it, module, inject, expect */

describe('Service: ivhTreeviewOptions', function() {
  'use strict';

  beforeEach(module('ivh.treeview'));

  var ivhTreeviewOptions;

  beforeEach(inject(function(_ivhTreeviewOptions_) {
    ivhTreeviewOptions = _ivhTreeviewOptions_;
  }));

  it('should return a pristine copy every time', function() {
    var opts1 = ivhTreeviewOptions();
    opts1.selectedAttribute = 'blargus';

    var opts2 = ivhTreeviewOptions();
    expect(opts2.selectedAttribute).not.toEqual(opts1.selectedAttribute);
  });
});


