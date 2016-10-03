'use strict';

describe('jm-np.version module', function() {
  beforeEach(module('jm-np.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
