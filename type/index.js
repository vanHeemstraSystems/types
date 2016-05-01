//var schema =      require(__dirname+'/../schema.js'); // TO DO: provide this as a Type property
//var util =        require(__dirname+'/../util.js');   // TO DO: provide this as a Type property

var TypeAny =     require(__dirname+'/any.js');
var TypeArray =   require(__dirname+'/array.js');
var TypeBoolean = require(__dirname+'/boolean.js');
var TypeBuffer =  require(__dirname+'/buffer.js');
var TypeDate =    require(__dirname+'/date.js');
var TypeNumber =  require(__dirname+'/number.js');
var TypeObject =  require(__dirname+'/object.js');
var TypePoint =   require(__dirname+'/point.js');
var TypeString =  require(__dirname+'/string.js');
var TypeVirtual = require(__dirname+'/virtual.js');

var self = this; // set the context locally, for access protection

/**
 * Create a new Type that let users create sub-types.
 * @return {Type}
 */
function Type() {
  console.log('types type - Type called'); 
  // add key value pairs here
  // self's are not directly publicly accessible, only through their public method(s)
  // use self's here for protection from direct access
  self._error = {};  // will be set, before passing on to mapping  
  self._schema = {}; // will be set, before passing on to mapping
  self._utility = {};   // will be set, before passing on to mapping
  self._validator = {};  // will be set, before passing on to mapping  
}

Type.prototype.error = function() {
  return self._error;
}

Type.prototype.seterror = function(fnOrValue) {
  self._error = fnOrValue;
}

Type.prototype.schema = function() {
  return self._schema;
}

Type.prototype.setschema = function(fnOrValue) {
  self._schema = fnOrValue;
}

Type.prototype.utility = function() {
  return self._utility;
}

Type.prototype.setutility = function(fnOrValue) {
  self._utility = fnOrValue;
}

Type.prototype.validator = function() {
  return self._validator;
}

Type.prototype.setvalidator = function(fnOrValue) {
  self._validator = fnOrValue;
}

/**
 * Create a new TypeAny object
 * @return {TypeAny}
 */
Type.prototype.any = function() {
  return new TypeAny();
}

/**
 * Create a new TypeString object.
 * @return {TypeString}
 */
Type.prototype.string = function() {
  this._typeString = new TypeString();
  this._typeString.seterror(self.error());
  this._typeString.setutility(self.utility());
  this._typeString.setvalidator(self.validator());
  //ORIGINAL return new TypeString();
  return this._typeString;
}

/**
 * Create a new TypeNumber object.
 * @return {TypeNumber}
 */
Type.prototype.number = function() {
  this._typeNumber = new TypeNumber();
  this._typeNumber.seterror(self.error());
  this._typeNumber.setutility(self.utility());
  //ORIGINAL return new TypeNumber();
  return this._typeNumber;
}

/**
 * Create a new TypeBoolean object.
 * @return {TypeBoolean}
 */
Type.prototype.boolean = function() {
  this._typeBoolean = new TypeBoolean();
  this._typeBoolean.seterror(self.error());
  this._typeBoolean.setutility(self.utility());
  //ORIGINAL return new TypeBoolean();
  return this._typeBoolean;
}

/**
 * Create a new TypeDate object.
 * @return {TypeDate}
 */
Type.prototype.date = function() {
  this._typeDate = new TypeDate();
  this._typeDate.seterror(self.error());
  this._typeDate.setutility(self.utility());
  //ORIGINAL return new TypeDate();
  return this._typeDate; 
}

/**
 * Create a new TypeBuffer object.
 * @return {TypeBuffer}
 */
Type.prototype.buffer = function() {
  this._typeBuffer = new TypeBuffer();
  this._typeBuffer.seterror(self.error());
  this._typeBuffer.setutility(self.utility());
  //ORIGINAL return new TypeBuffer();
  return this._typeBuffer;
}

/**
 * Create a new TypePoint object.
 * @return {TypePoint}
 */
Type.prototype.point = function() {
  this._typePoint = new TypePoint();
  this._typePoint.seterror(self.error());
  this._typePoint.setutility(self.utility());
  //ORIGINAL return new TypePoint();
  return this._typePoint;
}

/**
 * Create a new TypeObject object.
 * @return {TypeObject}
 */
Type.prototype.object = function() {
  this._typeObject = new TypeObject();
  this._typeObject.seterror(self.error());
  this._typeObject.setutility(self.utility());
  //ORIGINAL return new TypeObject();
  return this._typeObject;
}

/**
 * Create a new TypeArray object.
 * @return {TypeArray}
 */
Type.prototype.array = function() {
  this._typeArray = new TypeArray()
  this._typeArray.seterror(self.error());
  this._typeArray.setschema(self.schema());
  this._typeArray.setutility(self.utility());
  //ORIGINAL return new TypeArray();
  return this._typeArray;
}

/**
 * Create a new TypeVirtual object.
 * @return {TypeVirtual}
 */
Type.prototype.virtual = function() {
  return new TypeVirtual();
}

/**
 * Create a new TypeString object to use as an id.
 * @return {TypeString}
 */
Type.prototype.id = function() {
  return new TypeString().optional();
}

/**
 * Check if the first argument is a TypeString object or not
 * @param {Object} obj The object to check against TypeString.
 * @return {boolean}
 */
Type.prototype.isString = function(obj) {
  return obj instanceof TypeString;
}

/**
 * Check if the first argument is a TypeNumber object or not
 * @param {Object} obj The object to check against TypeNumber.
 * @return {boolean}
 */
Type.prototype.isNumber = function(obj) {
  return obj instanceof TypeNumber;
}

/**
 * Check if the first argument is a TypeBoolean object or not
 * @param {Object} obj The object to check against TypeBoolean.
 * @return {boolean}
 */
Type.prototype.isBoolean = function(obj) {
  return obj instanceof TypeBoolean;
}

/**
 * Check if the first argument is a TypeDate object or not
 * @param {Object} obj The object to check against TypeDate.
 * @return {boolean}
 */
Type.prototype.isDate = function(obj) {
  return obj instanceof TypeDate;
}

/**
 * Check if the first argument is a TypeBuffer object or not
 * @param {Object} obj The object to check against TypeBuffer.
 * @return {boolean}
 */
Type.prototype.isBuffer = function(obj) {
  return obj instanceof TypeBuffer;
}

/**
 * Check if the first argument is a TypePoint object or not
 * @param {Object} obj The object to check against TypePoint.
 * @return {boolean}
 */
Type.prototype.isPoint = function(obj) {
  return obj instanceof TypePoint;
}

/**
 * Check if the first argument is a TypeObject object or not
 * @param {Object} obj The object to check against TypeObject.
 * @return {boolean}
 */
Type.prototype.isObject = function(obj) {
  return obj instanceof TypeObject;
}

/**
 * Check if the first argument is a TypeArray object or not
 * @param {Object} obj The object to check against TypeArray.
 * @return {boolean}
 */
Type.prototype.isArray = function(obj) {
  return obj instanceof TypeArray;
}

/**
 * Check if the first argument is a TypeVirtual object or not
 * @param {Object} obj The object to check against TypeVirtual.
 * @return {boolean}
 */
Type.prototype.isVirtual = function(obj) {
  return obj instanceof TypeVirtual;
}

/**
 * Check if the first argument is a TypeAny object or not
 * @param {Object} obj The object to check against TypeAny.
 * @return {boolean}
 */
Type.prototype.isAny = function(obj) {
  return obj instanceof TypeAny;
}

module.exports = Type;
