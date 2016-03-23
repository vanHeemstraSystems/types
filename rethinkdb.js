/*
 * RethinkDB
 * 
 * param: type (e.g. 'array')
 */
module.exports = function(type) {
  var type = toLowerCase(type);
  var _RethinkDB = {};
  var path = require('../libraries/path');
  var paths = require('../paths/paths');
  config = require(path.join(paths.configurations, '/configurations.js'))(type);
  var common = config.common,
  server_prefix = common.server_prefix || 'PREFIX';
  console.log(server_prefix + " - RethinkDB type required.");
  _RethinkDB.type = require('./rethinkdb/' + type + '.js');
  return _RethinkDB;
};//does not call itself
