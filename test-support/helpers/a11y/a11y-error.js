function A11yError(element, message='accessibility error') {
  this.name = 'A11yError';
  this.element = element;
  this.message = message;
  this.stack = (new Error()).stack;
}

A11yError.prototype = Object.create(Error.prototype);

A11yError.prototype.constructor = A11yError;

A11yError.prototype.toString = function() {
  return `${this.name}: ${this.message}`;
};

export default A11yError;
