//var util = require(__dirname+'/../util.js');       // TO DO: provide this as a TypeBuffer property
//var Errors = require(__dirname+'/../errors.js');   // TO DO: provide this as a TypeBuffer property

var self = this; // set the context locally, for access protection

function TypeBuffer() {
  self._error = {};  // will be set, before passing on to mapping  
  self._utility = {};  // will be set, before passing on to mapping  
  this._default = undefined;
  this._options = {};
  this._validator = undefined;
}

TypeBuffer.prototype.error = function() {
  return self._error;
}

TypeBuffer.prototype.seterror = function(fnOrValue) {
  self._error = fnOrValue;
}

TypeBuffer.prototype.utility = function() {
  return self._utility;
}

TypeBuffer.prototype.setutility = function(fnOrValue) {
  self._utility = fnOrValue;
}

TypeBuffer.prototype.options = function(options) {
  //ORIGINAL if (util.isPlainObject(options)) {
  if (self.utility().isPlainObject(options)) {
    if (options.enforce_missing != null) {
      this._options.enforce_missing =  options.enforce_missing
    }
    if (options.enforce_type != null) {
      this._options.enforce_type = options.enforce_type;
    }
    if (options.enforce_extra != null) {
      this._options.enforce_extra = options.enforce_extra
    }
  }
  return this;
}

TypeBuffer.prototype.optional = function() {
  this._options.enforce_missing = false;
  return this;
}

TypeBuffer.prototype.required = function() {
  this._options.enforce_missing = true;
  return this;
}

TypeBuffer.prototype.allowNull = function(value) {
  if (this._options.enforce_type === 'strict') {
    if (value === true) {
      this._options.enforce_type = 'loose'
    }
    // else a no-op, strict -> strict
  }
  else if (this._options.enforce_type !== 'none') {
    // The value is loose or undefined
    if (value === true) {
      this._options.enforce_type = 'loose'
    }
    else {
      // The default value is loose, so if we call allowNull(false), it becomes strict
      this._options.enforce_type = 'strict'
    }
  }
  // else no op, type.any() is the same as type.any().allowNull(<bool>)
  return this;
}

TypeBuffer.prototype.default = function(fnOrValue) {
  this._default = fnOrValue;
  return this;
}

TypeBuffer.prototype.validator = function(fn) {
  if (typeof fn === "function") {
    this._validator = fn;
  }
  return this;
}

TypeBuffer.prototype.validate = function(buffer, prefix, options) {
  //ORIGINAL options = util.mergeOptions(this._options, options);
  options = self.utility().mergeOptions(this._options, options);

  //ORIGINAL if (util.validateIfUndefined(buffer, prefix, "buffer", options)) return;
  if (self.utility().validateIfUndefined(buffer, prefix, "buffer", options)) return;

  if ((typeof this._validator === "function") && (this._validator(buffer) === false)) {
    //ORIGINAL throw new Errors.ValidationError("Validator for the field "+prefix+" returned `false`.");
    throw new self.error().ValidationError("Validator for the field "+prefix+" returned `false`.");
  }

  //ORIGINAL if (util.isPlainObject(buffer) && (buffer["$reql_type$"] === "BINARY")) {
  if (self.utility().isPlainObject(buffer) && (buffer["$reql_type$"] === "BINARY")) {
    if (buffer.data === undefined) {
      //ORIGINAL util.pseudoTypeError("binary", "data", prefix);
      self.utility().pseudoTypeError("binary", "data", prefix);
    }
  }
  else if ((typeof buffer === 'function') && (buffer._query !== undefined)) {
    // TOIMPROvE -- we currently just check if it's a term from the driver
    // We suppose for now that this is enough and we don't throw an error
  }
  else if ((buffer instanceof Buffer) === false)  { // We don't have a buffer
    if (options.enforce_type === "strict") {
      //ORIGINAL util.strictType(prefix, "buffer");
      self.utility().strictType(prefix, "buffer");
    }
    else if ((options.enforce_type === "loose") && (buffer !== null)) {
      //ORIGINAL util.looseType(prefix, "buffer");
      self.utility().looseType(prefix, "buffer");
    }
  }
}

TypeBuffer.prototype._getDefaultFields = function(prefix, defaultFields, virtualFields) {
  if (this._default !== undefined) {
    defaultFields.push({
      path: prefix,
      value: this._default,
    });
  }
}

module.exports = TypeBuffer;
