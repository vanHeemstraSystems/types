//var util = require(__dirname+'/../util.js');       // TO DO: provide this as a TypeObject property
//var Errors = require(__dirname+'/../errors.js');   // TO DO: provide this as a TypeObject property

var self = this; // set the context locally, for access protection

function TypeObject() {
  self._error = {};  // will be set, before passing on to mapping  
  self._utility = {};  // will be set, before passing on to mapping  
  this._default = undefined;
  this._validator = undefined;
  this._options = {};
  this._schema = {};
}

TypeObject.prototype.error = function() {
  return self._error;
}

TypeObject.prototype.seterror = function(fnOrValue) {
  self._error = fnOrValue;
}

TypeObject.prototype.utility = function() {
  return self._utility;
}

TypeObject.prototype.setutility = function(fnOrValue) {
  self._utility = fnOrValue;
}

TypeObject.prototype._setModel = function(model) {
  this._model = model;
  return this;
}

TypeObject.prototype.options = function(options) {
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

TypeObject.prototype.optional = function() {
  this._options.enforce_missing = false;
  return this;
}

TypeObject.prototype.required = function() {
  this._options.enforce_missing = true;
  return this;
}

TypeObject.prototype.allowNull = function(value) {
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

TypeObject.prototype.allowExtra = function(allowed) {
  if (allowed === true) {
    this._options.enforce_extra = 'none';
  }
  else if (allowed === false) {
    this._options.enforce_extra = 'strict';
  }
  return this;
}

TypeObject.prototype.removeExtra = function() {
  this._options.enforce_extra = 'remove';
  return this;
}

TypeObject.prototype.schema = function(schema) {
  // Users shouldn't use the deprecated syntax with the chainable one
  // We do not parse the schema as we don't have the current prefix, options etc.
  this._schema = schema;
  return this;
}

TypeObject.prototype.setKey = function(key, schema) {
  this._schema[key] = schema;
  return this;
}

TypeObject.prototype.default = function(fnOrValue) {
  this._default = fnOrValue;
  return this;
}

TypeObject.prototype.validator = function(fn) {
  if (typeof fn === "function") {
    this._validator = fn;
  }
  return this;
}


TypeObject.prototype.validate = function(object, prefix, options) {
  var self = this;
  var localOptions = util.mergeOptions(this._options, options);

  //ORIGINAL if (util.validateIfUndefined(object, prefix, "object", localOptions)) return;
  if (self.utility().validateIfUndefined(object, prefix, "object", localOptions)) return;   // DOES THIS WORK WITH self.utility() ??

  if ((typeof self._validator === "function") && (self._validator(object) === false)) {
    //ORIGINAL throw new Errors.ValidationError("Validator for the field "+prefix+" returned `false`.");
    throw new self.error().ValidationError("Validator for the field "+prefix+" returned `false`."); // DOES THIS WORK WITH self.error() ??
  }

  if ((typeof object === 'function') && (object._query !== undefined)) {
    // We do not check ReQL terms
  }
  //ORIGINAL else if (util.isPlainObject(object) === false) {
  else if (self.utility().isPlainObject(object) === false) {  // DOES THIS WORK WITH self.utility() ??
    if (localOptions.enforce_type === "strict") {
      //ORIGINAL util.strictType(prefix, "object");
      self.utility().strictType(prefix, "object");  // DOES THIS WORK WITH self.utility() ??
    }
    else if ((localOptions.enforce_type === "loose") && (object !== null)) {
      //ORIGINAL util.looseType(prefix, "object");
      self.utility().looseType(prefix, "object");  // DOES THIS WORK WITH self.utility() ??
    }
  }
  else {
    //ORIGINAL util.loopKeys(self._schema, function(schema, key) {
    self.utility().loopKeys(self._schema, function(schema, key) {  // DOES THIS WORK WITH self.utility() ??
      schema[key].validate(object[key], prefix+"["+key+"]", options);
    });

    // We clean extra fields in validate, for a use case, see:
    // https://github.com/neumino/thinky/pull/123#issuecomment-56254682
    if (localOptions.enforce_extra === "remove") {
      //ORIGINAL util.loopKeys(object, function(object, key) {
      self.utility().loopKeys(object, function(object, key) {  // DOES THIS WORK WITH self.utility() ??
        if ((self._model === undefined || self._model._joins.hasOwnProperty(key) === false)
            && (self._schema[key] === undefined)) {
          delete object[key];
        }
      });
    }
    else if (localOptions.enforce_extra === "strict") {
      //ORIGINAL util.loopKeys(object, function(object, key) {
      self.utility().loopKeys(object, function(object, key) {  // DOES THIS WORK WITH self.utility() ??
        if ((self._model === undefined || self._model._joins.hasOwnProperty(key) === false)
            && (self._schema[key] === undefined)) {
          //ORIGINAL util.extraField(prefix, key);
          self.utility().extraField(prefix, key);  // DOES THIS WORK WITH self.utility() ??
        }
      });
    }
  }
}

TypeObject.prototype._getDefaultFields = function(prefix, defaultFields, virtualFields) {
  if (this._default !== undefined) {
    defaultFields.push({
      path: prefix,
      value: this._default,
    });
  }
  if (this._schema !== undefined) {
    //ORIGINAL util.loopKeys(this._schema, function(_schema, key) {
    self.utility().loopKeys(this._schema, function(_schema, key) {  // DOES THIS WORK WITH self.utility() ??
      if (typeof _schema[key]._getDefaultFields !== 'function') {
        console.log(_schema);
        console.log(key);
        console.log(_schema[key]);
      }
      _schema[key]._getDefaultFields(prefix.concat(key), defaultFields, virtualFields);
    })
  }
}

module.exports = TypeObject;
