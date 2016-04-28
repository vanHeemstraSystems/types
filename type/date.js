//var util = require(__dirname+'/../util.js');      // TO DO: provide this as a TypeDate property
//var Errors = require(__dirname+'/../errors.js');  // TO DO: provide this as a TypeDate property

var self = this; // set the context locally, for access protection

function TypeDate() {
  self._error = {};  // will be set, before passing on to mapping  
  self._utility = {};  // will be set, before passing on to mapping
  this._min = undefined;
  this._max = undefined;
  this._validator = undefined;
  this._options = {};
}

TypeDate.prototype.error = function() {
  return self._error;
}

TypeDate.prototype.seterror = function(fnOrValue) {
  self._error = fnOrValue;
}

TypeDate.prototype.utility = function() {
  return self._utility;
}

TypeDate.prototype.setutility = function(fnOrValue) {
  self._utility = fnOrValue;
}

TypeDate.prototype.options = function(options) {
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

TypeDate.prototype.optional = function() {
  this._options.enforce_missing = false;
  return this;
}

TypeDate.prototype.required = function() {
  this._options.enforce_missing = true;
  return this;
}

TypeDate.prototype.allowNull = function(value) {
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

TypeDate.prototype.min = function(min) {
  this._min = min;
  return this;
}

TypeDate.prototype.max = function(max) {
  this._max = max;
  return this;
}

TypeDate.prototype.default = function(fnOrValue) {
  this._default = fnOrValue;
  return this;
}

TypeDate.prototype.validator = function(fn) {
  if (typeof fn === "function") {
    this._validator = fn;
  }
  return this;
}

TypeDate.prototype.validate = function(date, prefix, options) {
  //ORIGINAL options = util.mergeOptions(this._options, options);
  options = self.utility().mergeOptions(this._options, options);

  //ORIGINAL if (util.validateIfUndefined(date, prefix, "date", options)) return;
  if (self.utility().validateIfUndefined(date, prefix, "date", options)) return;

  if ((typeof this._validator === "function") && (this._validator(date) === false)) {
    //ORIGINAL throw new Errors.ValidationError("Validator for the field "+prefix+" returned `false`.");
    throw new self.error().ValidationError("Validator for the field "+prefix+" returned `false`.");
  }

  var jsDate;
  //ORIGINAL if (util.isPlainObject(date) && (date["$reql_type$"] === "TIME")) {
  if (self.utility().isPlainObject(date) && (date["$reql_type$"] === "TIME")) {
    if (date.epoch_time === undefined) {
      //ORIGINAL util.pseudoTypeError("date", "epoch_time", prefix);
      self.utility().pseudoTypeError("date", "epoch_time", prefix);
    }
    else if (date.timezone === undefined) {
      //ORIGINAL util.pseudoTypeError("date", "timezone", prefix);
      self.utility().pseudoTypeError("date", "timezone", prefix);
    }

    jsDate = new Date(0);
    jsDate.setUTCSeconds(date.epoch_time)
  }
  else if ((typeof date === 'function') && (date._query !== undefined)) {
    // TOIMPROVE -- we currently just check if it's a term from the driver
    // We suppose for now that this is enough and we don't throw an error
  }
  else if (typeof date === 'string' || typeof date === 'number') {
    var numericDate = parseInt(date, 10);
    if(!isNaN(numericDate)){
      date = numericDate;
    }
    jsDate = new Date(date);
    if (jsDate.getTime() !== jsDate.getTime()) {
      if (options.enforce_type === "strict") {
        //ORIGINAL util.strictType(prefix, "date or a valid string");
        self.utility().strictType(prefix, "date or a valid string");
      }
      else if (options.enforce_type !== "none") {
        //ORIGINAL util.looseType(prefix, "date or a valid string");
        self.utility().looseType(prefix, "date or a valid string");
      }
    }
  }
  else if ((date instanceof Date) === false) { // We have a non valid date
    if (options.enforce_type === "strict") {
      //ORIGINAL util.strictType(prefix, "date");
      self.utility().strictType(prefix, "date");
    }
    else if ((options.enforce_type === "loose") && (date !== null)) {
      //ORIGINAL util.looseType(prefix, "date");
      self.utility().looseType(prefix, "date");
    }
  }
  else {
    jsDate = date;
  }

  // We check for min/max only if we could create a javascript date from the value
  if (jsDate !== undefined) {
    if ((this._min instanceof Date) && (this._min > jsDate)){
      //ORIGINAL throw new Errors.ValidationError("Value for "+prefix+" must be after "+this._min+".")
      throw new self.error().ValidationError("Value for "+prefix+" must be after "+this._min+".")
    }
    if ((this._max instanceof Date) && (this._max < jsDate)){
      //ORIGINAL throw new Errors.ValidationError("Value for "+prefix+" must be before "+this._max+".")
      throw new self.error().ValidationError("Value for "+prefix+" must be before "+this._max+".")
    }
  }
}

TypeDate.prototype._getDefaultFields = function(prefix, defaultFields, virtualFields) {
  if (this._default !== undefined) {
    defaultFields.push({
      path: prefix,
      value: this._default,
    });
  }
}

module.exports = TypeDate;
