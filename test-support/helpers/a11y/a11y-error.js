function A11yError(message='accessibility error') {
  this.name = 'A11yError';
  this.message = message;
}

A11yError.prototype = Object.create(Error.prototype);

A11yError.prototype.constructor = A11yError;

A11yError.prototype.toString = function() {
  return `${this.name}: ${this.message}`;
};

export default A11yError;
