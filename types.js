/*
 * types.js
 *
 * input: input - an Object
 *
 * output: resolve - a Promise
 */
module.exports = function() {
  console.log('types - called');
  var _Me = {};
  var path = require('../libraries/path');
  var paths = require('../paths/paths'); 
  var promise = require(path.join(paths.libraries, '/promise.js'));
  var _type = require(__dirname+'/type.js'); // change this into a function that returns a Promise
  var join = promise.join;
  return new promise(function(resolve) {
    join(_type(), function(type) {
      _Me.type = type;
    }); // eof join
    console.log('types - resolve(_Me): ', _Me);
    resolve(_Me);
  }) // eof promise
  .catch(function(error) {
    console.log('types - error: ', error);
  }) // eof catch
  .finally(function() {
    console.log('types - finally');
  }); // eof finally
} // eof module