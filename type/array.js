//var util = require(__dirname+'/../util.js');              // TO DO: provide this as a TypeArray property
//var schema =      require(__dirname+'/../schema.js');     // TO DO: provide this as a TypeArray property
//var arrayPrefix = schema.arrayPrefix;
//var Errors = require(__dirname+'/../errors.js');          // TO DO: provide this as a TypeArray property

var self = this; // set the context locally, for access protection

function TypeArray() {
  self._error = {};  // will be set, before passing on to mapping
  self._schema = {};  // will be set, before passing on to mapping
  self._utility = {};  // will be set, before passing on to mapping
  this._min = -1;
  this._max = -1;
  this._length = -1;
  this._schema = undefined;
  this._validator = undefined;
  this._options = {};
}

TypeArray.prototype.error = function() {
  return self._error;
}

TypeArray.prototype.seterror = function(fnOrValue) {
  self._error = fnOrValue;
}

TypeArray.prototype.schema = function() {
  return self._schema;
}

TypeArray.prototype.setschema = function(fnOrValue) {
  self._schema = fnOrValue;
}

TypeArray.prototype.utility = function() {
  return self._utility;
}

TypeArray.prototype.setutility = function(fnOrValue) {
  self._utility = fnOrValue;
}

TypeArray.prototype.options = function(options) {
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


TypeArray.prototype.optional = function() {
  this._options.enforce_missing = false;
  return this;
}


TypeArray.prototype.required = function() {
  this._options.enforce_missing = true;
  return this;
}


TypeArray.prototype.allowNull = function(value) {
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


TypeArray.prototype.min = function(min) {
  if (min < 0) {
    //ORIGINAL throw new Errors.ValidationError("The value for `min` must be a positive integer");
    throw new self.error().validationerror("The value for `min` must be a positive integer");
  }
  this._min = min;
  return this;
}


TypeArray.prototype.max = function(max) {
  if (max < 0) {
    //ORIGINAL throw new Errors.ValidationError("The value for `max` must be a positive integer");
    throw new self.error().validationerror("The value for `max` must be a positive integer");
  }
  this._max = max;
  return this;
}


TypeArray.prototype.length = function(length) {
  if (length < 0) {
    //throw new Errors.ValidationError("The value for `length` must be a positive integer");
    throw new self.error().validationerror("The value for `length` must be a positive integer");
  }
  this._length = length;
  return this;
}


TypeArray.prototype.schema = function(schema) { // WE ALREADY HAVE A schema FUNCTION... MANAGE THIS!
  this._schema = schema;
  return this;
}


TypeArray.prototype.default = function(fnOrValue) {
  this._default = fnOrValue;
  return this;
}


TypeArray.prototype.validator = function(fn) {
  this._validator = fn;
  return this;
}

// FIX ALL BELOW FOR self.utility() etc ......

TypeArray.prototype.validate = function(array, prefix, options) {
  var self = this;
  var localOptions = util.mergeOptions(this._options, options);

  if (util.validateIfUndefined(array, prefix, "array", localOptions)) return;

  if ((typeof self._validator === "function") && (self._validator(array) === false)) {
    throw new Errors.ValidationError("Validator for the field "+prefix+" returned `false`.");
  }

  if ((typeof array === 'function') && (array._query !== undefined)) {
    // We do not check ReQL terms
  }
  else if (Array.isArray(array) === false) {
    if (localOptions.enforce_type === "strict") {
      util.strictType(prefix, "array");
    }
    else if ((localOptions.enforce_type === "loose") && (array !== null)) {
      util.looseType(prefix, "array");
    }
  }
  else {
    if ((this._min !== -1) && (this._min > array.length)){
      throw new Errors.ValidationError("Value for "+prefix+" must have at least "+this._min+" elements.")
    }
    if ((this._max !== -1) && (this._max < array.length)){
      throw new Errors.ValidationError("Value for "+prefix+" must have at most "+this._max+" elements.")
    }
    if ((this._length !== -1) && (this._length !== array.length)){
      throw new Errors.ValidationError("Value for "+prefix+" must be an array with "+this._length+" elements.")
    }

    for(var i=0; i<array.length; i++) {
      if (array[i] === undefined) {
        throw new Errors.ValidationError("The element in the array "+prefix+" (position "+i+") cannot be `undefined`.");
      }
      if (this._schema !== undefined) {
        this._schema.validate(array[i], prefix+"["+i+"]", options);
      }
    }
  }
}


TypeArray.prototype._getDefaultFields = function(prefix, defaultFields, virtualFields) {
  if (this._default !== undefined) {
    defaultFields.push({
      path: prefix,
      value: this._default,
    });
  }
  if (this._schema !== undefined) {
    //ORIGINAL this._schema._getDefaultFields(prefix.concat(arrayPrefix), defaultFields, virtualFields);
    this._schema._getDefaultFields(prefix.concat(self.schema().arrayPrefix), defaultFields, virtualFields);
  }
}


module.exports = TypeArray;
