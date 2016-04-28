//var util = require(__dirname+'/../util.js');      // TO DO: provide this as a TypeBoolean property
//var Errors = require(__dirname+'/../errors.js');  // TO DO: provide this as a TypeBoolean property

var self = this; // set the context locally, for access protection

function TypeBoolean() {
  self._error = {};  // will be set, before passing on to mapping  
  self._utility = {};  // will be set, before passing on to mapping  
  this._default = undefined;
  this._validator = undefined;
  this._options = {};
}

TypeBoolean.prototype.error = function() {
  return self._error;
}

TypeBoolean.prototype.seterror = function(fnOrValue) {
  self._error = fnOrValue;
}

TypeBoolean.prototype.utility = function() {
  return self._utility;
}

TypeBoolean.prototype.setutility = function(fnOrValue) {
  self._utility = fnOrValue;
}

TypeBoolean.prototype.options = function(options) {
  //if (util.isPlainObject(options)) {
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

TypeBoolean.prototype.optional = function() {
  this._options.enforce_missing = false;
  return this;
}

TypeBoolean.prototype.required = function() {
  this._options.enforce_missing = true;
  return this;
}

TypeBoolean.prototype.allowNull = function(value) {
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

TypeBoolean.prototype.default = function(fnOrValue) {
  this._default = fnOrValue;
  return this;
}

TypeBoolean.prototype.validator = function(fn) {
  if (typeof fn === "function") {
    this._validator = fn;
  }
  return this;
}

TypeBoolean.prototype.validate = function(bool, prefix, options) {
  //ORIGINAL options = util.mergeOptions(this._options, options);
  options = self.utility().mergeOptions(this._options, options);

  //ORIGINAL if (util.validateIfUndefined(bool, prefix, "boolean", options)) return;
  if (self.utility().validateIfUndefined(bool, prefix, "boolean", options)) return;

  if ((typeof this._validator === "function") && (this._validator(bool) === false)) {
    //ORIGINAL throw new Errors.ValidationError("Validator for the field "+prefix+" returned `false`.");
    throw new self.error().ValidationError("Validator for the field "+prefix+" returned `false`.");
  }

  if (typeof bool !== "boolean") {
    if (options.enforce_type === "strict") {
      //ORIGINAL util.strictType(prefix, "boolean");
      self.utility().strictType(prefix, "boolean");
    }
    else if ((options.enforce_type === "loose") && (bool !== null)) {
      //ORIGINAL util.looseType(prefix, "boolean");
      self.utility().looseType(prefix, "boolean");
    }
  }
}

TypeBoolean.prototype._getDefaultFields = function(prefix, defaultFields, virtualFields) {
  if (this._default !== undefined) {
    defaultFields.push({
      path: prefix,
      value: this._default,
    });
  }
}

module.exports = TypeBoolean;
