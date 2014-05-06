
// Extend method informed by this article:
// http://open.blogs.nytimes.com/2013/04/02/using-ecmascript-5-objects-and-properties/?_php=true&_type=blogs&_r=0

var __hasProp = {}.hasOwnProperty;
var __extends = function(child, parent) {

	// If the prototype is frozen, that means this class is final
	// AKA, no extending
	if (Object.isFrozen(parent.prototype)) {
		throw new TypeError("Extending this class is forbidden");
	}

	// Copy static methods
	for (var key in parent) {
		if (__hasProp.call(parent, key))
			Object.defineProperty(child, key, Object.getOwnPropertyDescriptor(parent, key));
	}

	// Adding props this way allows us to avoid enumeration and overwriting!
	function ctor() {
		Object.defineProperty(this, "constructor", {
			value: child
		});
	}

	ctor.prototype = parent.prototype;
	child.prototype = new ctor();

	// Maintain link to parent prototype
	Object.defineProperty(child, "__super__", {
		value: parent.prototype
	});

	// Seal in the methods, methods that are overwritable are still overwritable
	// or Prevent them from being extendeded
	if (Object.isSealed(parent.prototype) || !Object.isExtensible(parent.prototype)) {

		// We must add any overwritable methods
		Object.getOwnPropertyNames(parent.prototype).forEach(function (key) {
			if (key !== "constructor") {

				// Add writable methods so that they can be overridden after being sealed.
				var descriptor = Object.getOwnPropertyDescriptor(this, key);
				if (descriptor.writable) {
					Object.defineProperty(child.prototype, key, descriptor);
				}
			}
		}, parent.prototype);

		// Methods can no longer be added!
		if(Object.isSealed(parent.prototype) ){
			Object.seal(child.prototype);
		}else{
			Object.preventExtensions(child.prototype);
		}

		return child;
	}

	return child;
};