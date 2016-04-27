/*
 * types.js
 */
var TypesType = require(__dirname+'/type.js');

/**
 * Create a new Types that let users create sub-types.
 * @return {Types}
 */
function Types() { }

/**
 * Create a new TypesType object.
 * @return {TypesType}
 */
Types.prototype.type = function() {
  return new TypesType();
}

module.exports = Types;
