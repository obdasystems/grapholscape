var assert 			= require('assert');
var grapholscape 	= require('../dist/grapholscape.js')
var cleanup 		= require('jsdom-global')()


describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});

describe('GrapholScape', function() {
  describe('new grapholscape', function() {
  	container = document.createElement('div');
  	console.log(new grapholscape(null, container, null));
    it('should return -1 when the value is not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});