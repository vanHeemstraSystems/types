//var util = require(__dirname+'/../util.js');       // TO DO: provide this as a TypeNumber property
//var Errors = require(__dirname+'/../errors.js');   // TO DO: provide this as a TypeNumber property

var self = this; // set the context locally, for access protection

function TypeNumber() {
  self._error = {};  // will be set, before passing on to mapping  
  self._utility = {};  // will be set, before passing on to mapping
  this._min = -1;
  this._max = -1;
  this._integer = false;
  this._default = undefined;
  this._validator = undefined;
  this._options = {};
}

TypeNumber.prototype.error = function() {
  return self._error;
}

TypeNumber.prototype.seterror = function(fnOrValue) {
  self._error = fnOrValue;
}

TypeNumber.prototype.utility = function() {
  return self._utility;
}

TypeNumber.prototype.setutility = function(fnOrValue) {
  self._utility = fnOrValue;
}

TypeNumber.prototype.options = function(options) {
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

TypeNumber.prototype.optional = function() {
  this._options.enforce_missing = false;
  return this;
}

TypeNumber.prototype.required = function() {
  this._options.enforce_missing = true;
  return this;
}

TypeNumber.prototype.allowNull = function(value) {
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

TypeNumber.prototype.min = function(min) {
  if (min < 0) {
    //ORIGINAL throw new Errors.ValidationError("The value for `min` must be a positive integer");
    throw new self.error().ValidationError("The value for `min` must be a positive integer");
  }
  this._min = min;
  return this;
}

TypeNumber.prototype.max = function(max) {
  if (max < 0) {
    //ORIGINAL throw new Errors.ValidationError("The value for `max` must be a positive integer");
    throw new self.error().ValidationError("The value for `max` must be a positive integer");
  }
  this._max = max;
  return this;
}

TypeNumber.prototype.integer = function() {
  this._integer = true;
  return this;
}

TypeNumber.prototype.default = function(fnOrValue) {
  this._default = fnOrValue;
  return this;
}

TypeNumber.prototype.validator = function(fn) {
  if (typeof fn === "function") {
    this._validator = fn;
  }
  return this;
}

TypeNumber.prototype.validate = function(number, prefix, options) {
  //ORIGINAL options = util.mergeOptions(this._options, options);
  options = self.utility().mergeOptions(this._options, options);

  //ORIGINAL if (util.validateIfUndefined(number, prefix, "number", options)) return;
  if (self.utility.validateIfUndefined(number, prefix, "number", options)) return;

  if ((typeof this._validator === "function") && (this._validator(number) === false)) {
    //ORIGINAL throw new Errors.ValidationError("Validator for the field "+prefix+" returned `false`.");
    throw new self.error().ValidationError("Validator for the field "+prefix+" returned `false`.");
  }

  if(typeof number === 'string'){
    var numericString = parseFloat(number);
    if(!isNaN(numericString)){
      number = numericString;
    }
  }

  if ((typeof number === 'function') && (number._query !== undefined)) {
    // We do not check ReQL terms
  }
  else if ((typeof number !== "number") || (isFinite(number) === false)) {
    if (options.enforce_type === "strict") {
      //ORIGINAL util.strictType(prefix, "finite number");
      self.utility().strictType(prefix, "finite number");
    }
    else if ((options.enforce_type === "loose") && (number !== null)) {
      //ORIGINAL util.looseType(prefix, "finite number");
      self.utility().looseType(prefix, "finite number");
    }
  }
  else {
    if ((this._min !== -1) && (this._min > number)){
      //ORIGINAL throw new Errors.ValidationError("Value for "+prefix+" must be greater than "+this._min+".")
      throw new self.error().ValidationError("Value for "+prefix+" must be greater than "+this._min+".")
    }
    if ((this._max !== -1) && (this._max < number)){
      //ORIGINAL throw new Errors.ValidationError("Value for "+prefix+" must be less than "+this._max+".")
      throw new self.error().ValidationError("Value for "+prefix+" must be less than "+this._max+".")
    }
    if ((this._integer === true) && (number%1 !== 0)){
      //ORIGINAL throw new Errors.ValidationError("Value for "+prefix+" must be an integer.")
      throw new self.error().ValidationError("Value for "+prefix+" must be an integer.")
    }
  }
}

TypeNumber.prototype._getDefaultFields = function(prefix, defaultFields, virtualFields) {
  if (this._default !== undefined) {
    defaultFields.push({
      path: prefix,
      value: this._default,
    });
  }
}

module.exports = TypeNumber;
