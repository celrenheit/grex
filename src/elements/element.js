var _ = require('lodash');

/*
* Abstract Element class
*/
module.exports = (function() {
  // Graph Elements are currently Vertex or Edge
  function Element(gremlin, identifier) {
    this._id = null;
    this.identifier = identifier;

    Object.defineProperty(this, "gremlin", {
      value: gremlin,
      enumerable: false,
      writable: false
    });
  }

  // Keep track of a temporary transaction id for each element
  Object.defineProperty(Element.prototype, "identifier", {
    value: null,
    enumerable: false,
    writable: true
  });

  Element.prototype.getProperties = function() {
    var o = {};

    _.each(this, function(property, propertyName) {
      o[propertyName] = this[propertyName];
    }, this);

    this.gremlin.line(this.identifier + '.getProperties()');

    return o;
  };

  Element.prototype.setProperty = function(key, value) {
    this[key] = value;

    this.gremlin.line(this.identifier + ".setProperty('"+key+"','"+value+"')");

    return this;
  };

  Element.prototype.setProperties = function(properties) {
    _.each(properties, function(value, key) {
      this[key] = value;
    }, this);

    var line = this.identifier +'.setProperties('+ this.gremlin.stringifyArgument(properties) +')';

    this.gremlin.line(line);

    return this;
  };

  /**
   * Titan specific method
   *
   * Use this instead of setProperty() when setting the value of an indexed
   * property.
   *
   * @param {String} key
   * @param {Object} value
   */
  Element.prototype.addProperty = function(key, value) {
    this[key] = value;
    this.gremlin.line(this.identifier + ".addProperty('"+key+"','"+value+"')");

    return this;
  };

  /**
   * Titan specific method
   *
   * Use this instead of setProperties() when setting the values of indexed
   * properties.
   *
   * @param {Object} properties
   */
  Element.prototype.addProperties = function(properties) {
    _.each(properties, function(value, key) {
      this[key] = value;
    }, this);

    var line = this.identifier +'.addProperties('+ this.gremlin.stringifyArgument(properties) +')';

    this.gremlin.line(line);


    return this;
  };

  Element.prototype.remove = function() {
    var line = this.identifier +'.remove()';
    this.gremlin.line(line);
  };

  return Element;

})();
