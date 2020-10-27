/**
 * MIT License
 *
 * Copyright (c) 2018-2020 OBDA Systems
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import '@webcomponents/webcomponentsjs';
import cytoscape from 'cytoscape';
import '@material/mwc-icon';
import popper from 'cytoscape-popper';
import cola from 'cytoscape-cola';

var fails = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var descriptors = !fails(function () {
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, basedir, module) {
	return module = {
	  path: basedir,
	  exports: {},
	  require: function (path, base) {
      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
    }
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global_1 =
  // eslint-disable-next-line no-undef
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  check(typeof self == 'object' && self) ||
  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
  // eslint-disable-next-line no-new-func
  Function('return this')();

var isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var document$1 = global_1.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document$1) && isObject(document$1.createElement);

var documentCreateElement = function (it) {
  return EXISTS ? document$1.createElement(it) : {};
};

// Thank's IE8 for his funny defineProperty
var ie8DomDefine = !descriptors && !fails(function () {
  return Object.defineProperty(documentCreateElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});

var anObject = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  } return it;
};

// `ToPrimitive` abstract operation
// https://tc39.github.io/ecma262/#sec-toprimitive
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var toPrimitive = function (input, PREFERRED_STRING) {
  if (!isObject(input)) return input;
  var fn, val;
  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var nativeDefineProperty = Object.defineProperty;

// `Object.defineProperty` method
// https://tc39.github.io/ecma262/#sec-object.defineproperty
var f = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (ie8DomDefine) try {
    return nativeDefineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var objectDefineProperty = {
	f: f
};

var defineProperty = objectDefineProperty.f;

var FunctionPrototype = Function.prototype;
var FunctionPrototypeToString = FunctionPrototype.toString;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// Function instances `.name` property
// https://tc39.github.io/ecma262/#sec-function-instances-name
if (descriptors && !(NAME in FunctionPrototype)) {
  defineProperty(FunctionPrototype, NAME, {
    configurable: true,
    get: function () {
      try {
        return FunctionPrototypeToString.call(this).match(nameRE)[1];
      } catch (error) {
        return '';
      }
    }
  });
}

var isPure = false;

var createPropertyDescriptor = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var createNonEnumerableProperty = descriptors ? function (object, key, value) {
  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var setGlobal = function (key, value) {
  try {
    createNonEnumerableProperty(global_1, key, value);
  } catch (error) {
    global_1[key] = value;
  } return value;
};

var SHARED = '__core-js_shared__';
var store = global_1[SHARED] || setGlobal(SHARED, {});

var sharedStore = store;

var shared = createCommonjsModule(function (module) {
(module.exports = function (key, value) {
  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.6.5',
  mode:  'global',
  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
});
});

var hasOwnProperty = {}.hasOwnProperty;

var has = function (it, key) {
  return hasOwnProperty.call(it, key);
};

var id = 0;
var postfix = Math.random();

var uid = function (key) {
  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
};

var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
  // Chrome 38 Symbol has incorrect toString conversion
  // eslint-disable-next-line no-undef
  return !String(Symbol());
});

var useSymbolAsUid = nativeSymbol
  // eslint-disable-next-line no-undef
  && !Symbol.sham
  // eslint-disable-next-line no-undef
  && typeof Symbol.iterator == 'symbol';

var WellKnownSymbolsStore = shared('wks');
var Symbol$1 = global_1.Symbol;
var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

var wellKnownSymbol = function (name) {
  if (!has(WellKnownSymbolsStore, name)) {
    if (nativeSymbol && has(Symbol$1, name)) WellKnownSymbolsStore[name] = Symbol$1[name];
    else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

var toStringTagSupport = String(test) === '[object z]';

var functionToString = Function.toString;

// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
if (typeof sharedStore.inspectSource != 'function') {
  sharedStore.inspectSource = function (it) {
    return functionToString.call(it);
  };
}

var inspectSource = sharedStore.inspectSource;

var WeakMap$1 = global_1.WeakMap;

var nativeWeakMap = typeof WeakMap$1 === 'function' && /native code/.test(inspectSource(WeakMap$1));

var keys = shared('keys');

var sharedKey = function (key) {
  return keys[key] || (keys[key] = uid(key));
};

var hiddenKeys = {};

var WeakMap$2 = global_1.WeakMap;
var set, get, has$1;

var enforce = function (it) {
  return has$1(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (nativeWeakMap) {
  var store$1 = new WeakMap$2();
  var wmget = store$1.get;
  var wmhas = store$1.has;
  var wmset = store$1.set;
  set = function (it, metadata) {
    wmset.call(store$1, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget.call(store$1, it) || {};
  };
  has$1 = function (it) {
    return wmhas.call(store$1, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return has(it, STATE) ? it[STATE] : {};
  };
  has$1 = function (it) {
    return has(it, STATE);
  };
}

var internalState = {
  set: set,
  get: get,
  has: has$1,
  enforce: enforce,
  getterFor: getterFor
};

var redefine = createCommonjsModule(function (module) {
var getInternalState = internalState.get;
var enforceInternalState = internalState.enforce;
var TEMPLATE = String(String).split('String');

(module.exports = function (O, key, value, options) {
  var unsafe = options ? !!options.unsafe : false;
  var simple = options ? !!options.enumerable : false;
  var noTargetGet = options ? !!options.noTargetGet : false;
  if (typeof value == 'function') {
    if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
    enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
  }
  if (O === global_1) {
    if (simple) O[key] = value;
    else setGlobal(key, value);
    return;
  } else if (!unsafe) {
    delete O[key];
  } else if (!noTargetGet && O[key]) {
    simple = true;
  }
  if (simple) O[key] = value;
  else createNonEnumerableProperty(O, key, value);
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, 'toString', function toString() {
  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
});
});

var toString = {}.toString;

var classofRaw = function (it) {
  return toString.call(it).slice(8, -1);
};

var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
var classof = toStringTagSupport ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$1)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
};

// `Object.prototype.toString` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
var objectToString = toStringTagSupport ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};

// `Object.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
if (!toStringTagSupport) {
  redefine(Object.prototype, 'toString', objectToString, { unsafe: true });
}

var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
var f$1 = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : nativePropertyIsEnumerable;

var objectPropertyIsEnumerable = {
	f: f$1
};

var split = ''.split;

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var indexedObject = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
} : Object;

// `RequireObjectCoercible` abstract operation
// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
var requireObjectCoercible = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};

// toObject with fallback for non-array-like ES3 strings



var toIndexedObject = function (it) {
  return indexedObject(requireObjectCoercible(it));
};

var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
var f$2 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPrimitive(P, true);
  if (ie8DomDefine) try {
    return nativeGetOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
};

var objectGetOwnPropertyDescriptor = {
	f: f$2
};

var path = global_1;

var aFunction = function (variable) {
  return typeof variable == 'function' ? variable : undefined;
};

var getBuiltIn = function (namespace, method) {
  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace])
    : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
};

var ceil = Math.ceil;
var floor = Math.floor;

// `ToInteger` abstract operation
// https://tc39.github.io/ecma262/#sec-tointeger
var toInteger = function (argument) {
  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
};

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.github.io/ecma262/#sec-tolength
var toLength = function (argument) {
  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

var max = Math.max;
var min$1 = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
var toAbsoluteIndex = function (index, length) {
  var integer = toInteger(index);
  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
};

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var arrayIncludes = {
  // `Array.prototype.includes` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};

var indexOf = arrayIncludes.indexOf;


var objectKeysInternal = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~indexOf(result, key) || result.push(key);
  }
  return result;
};

// IE8- don't enum bug keys
var enumBugKeys = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];

var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return objectKeysInternal(O, hiddenKeys$1);
};

var objectGetOwnPropertyNames = {
	f: f$3
};

var f$4 = Object.getOwnPropertySymbols;

var objectGetOwnPropertySymbols = {
	f: f$4
};

// all object keys, includes non-enumerable and symbols
var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = objectGetOwnPropertyNames.f(anObject(it));
  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
};

var copyConstructorProperties = function (target, source) {
  var keys = ownKeys(source);
  var defineProperty = objectDefineProperty.f;
  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
  }
};

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : typeof detection == 'function' ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

var isForced_1 = isForced;

var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
*/
var _export = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global_1;
  } else if (STATIC) {
    target = global_1[TARGET] || setGlobal(TARGET, {});
  } else {
    target = (global_1[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor$1(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty === typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    // extend global
    redefine(target, key, sourceProperty, options);
  }
};

var nativePromiseConstructor = global_1.Promise;

var redefineAll = function (target, src, options) {
  for (var key in src) redefine(target, key, src[key], options);
  return target;
};

var defineProperty$1 = objectDefineProperty.f;



var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');

var setToStringTag = function (it, TAG, STATIC) {
  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG$2)) {
    defineProperty$1(it, TO_STRING_TAG$2, { configurable: true, value: TAG });
  }
};

var SPECIES = wellKnownSymbol('species');

var setSpecies = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
  var defineProperty = objectDefineProperty.f;

  if (descriptors && Constructor && !Constructor[SPECIES]) {
    defineProperty(Constructor, SPECIES, {
      configurable: true,
      get: function () { return this; }
    });
  }
};

var aFunction$1 = function (it) {
  if (typeof it != 'function') {
    throw TypeError(String(it) + ' is not a function');
  } return it;
};

var anInstance = function (it, Constructor, name) {
  if (!(it instanceof Constructor)) {
    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
  } return it;
};

var iterators = {};

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
var isArrayIteratorMethod = function (it) {
  return it !== undefined && (iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};

// optional / simple context binding
var functionBindContext = function (fn, that, length) {
  aFunction$1(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 0: return function () {
      return fn.call(that);
    };
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var ITERATOR$1 = wellKnownSymbol('iterator');

var getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR$1]
    || it['@@iterator']
    || iterators[classof(it)];
};

// call something on iterator step with safe closing on error
var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (error) {
    var returnMethod = iterator['return'];
    if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
    throw error;
  }
};

var iterate_1 = createCommonjsModule(function (module) {
var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};

var iterate = module.exports = function (iterable, fn, that, AS_ENTRIES, IS_ITERATOR) {
  var boundFunction = functionBindContext(fn, that, AS_ENTRIES ? 2 : 1);
  var iterator, iterFn, index, length, result, next, step;

  if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = toLength(iterable.length); length > index; index++) {
        result = AS_ENTRIES
          ? boundFunction(anObject(step = iterable[index])[0], step[1])
          : boundFunction(iterable[index]);
        if (result && result instanceof Result) return result;
      } return new Result(false);
    }
    iterator = iterFn.call(iterable);
  }

  next = iterator.next;
  while (!(step = next.call(iterator)).done) {
    result = callWithSafeIterationClosing(iterator, boundFunction, step.value, AS_ENTRIES);
    if (typeof result == 'object' && result && result instanceof Result) return result;
  } return new Result(false);
};

iterate.stop = function (result) {
  return new Result(true, result);
};
});

var ITERATOR$2 = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR$2] = function () {
    return this;
  };
  // eslint-disable-next-line no-throw-literal
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR$2] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};

var SPECIES$1 = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.github.io/ecma262/#sec-speciesconstructor
var speciesConstructor = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES$1]) == undefined ? defaultConstructor : aFunction$1(S);
};

var html = getBuiltIn('document', 'documentElement');

var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

var engineIsIos = /(iphone|ipod|ipad).*applewebkit/i.test(engineUserAgent);

var location = global_1.location;
var set$1 = global_1.setImmediate;
var clear = global_1.clearImmediate;
var process = global_1.process;
var MessageChannel = global_1.MessageChannel;
var Dispatch = global_1.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;

var run = function (id) {
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};

var runner = function (id) {
  return function () {
    run(id);
  };
};

var listener = function (event) {
  run(event.data);
};

var post = function (id) {
  // old engines have not location.origin
  global_1.postMessage(id + '', location.protocol + '//' + location.host);
};

// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!set$1 || !clear) {
  set$1 = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
    };
    defer(counter);
    return counter;
  };
  clear = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (classofRaw(process) == 'process') {
    defer = function (id) {
      process.nextTick(runner(id));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(runner(id));
    };
  // Browsers with MessageChannel, includes WebWorkers
  // except iOS - https://github.com/zloirock/core-js/issues/624
  } else if (MessageChannel && !engineIsIos) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = functionBindContext(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (
    global_1.addEventListener &&
    typeof postMessage == 'function' &&
    !global_1.importScripts &&
    !fails(post) &&
    location.protocol !== 'file:'
  ) {
    defer = post;
    global_1.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in documentCreateElement('script')) {
    defer = function (id) {
      html.appendChild(documentCreateElement('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(runner(id), 0);
    };
  }
}

var task = {
  set: set$1,
  clear: clear
};

var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;

var macrotask = task.set;


var MutationObserver = global_1.MutationObserver || global_1.WebKitMutationObserver;
var process$1 = global_1.process;
var Promise$1 = global_1.Promise;
var IS_NODE = classofRaw(process$1) == 'process';
// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
var queueMicrotaskDescriptor = getOwnPropertyDescriptor$2(global_1, 'queueMicrotask');
var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

var flush, head, last, notify, toggle, node, promise, then;

// modern engines have queueMicrotask method
if (!queueMicrotask) {
  flush = function () {
    var parent, fn;
    if (IS_NODE && (parent = process$1.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (error) {
        if (head) notify();
        else last = undefined;
        throw error;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (IS_NODE) {
    notify = function () {
      process$1.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
  } else if (MutationObserver && !engineIsIos) {
    toggle = true;
    node = document.createTextNode('');
    new MutationObserver(flush).observe(node, { characterData: true });
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise$1 && Promise$1.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    promise = Promise$1.resolve(undefined);
    then = promise.then;
    notify = function () {
      then.call(promise, flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global_1, flush);
    };
  }
}

var microtask = queueMicrotask || function (fn) {
  var task = { fn: fn, next: undefined };
  if (last) last.next = task;
  if (!head) {
    head = task;
    notify();
  } last = task;
};

var PromiseCapability = function (C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction$1(resolve);
  this.reject = aFunction$1(reject);
};

// 25.4.1.5 NewPromiseCapability(C)
var f$5 = function (C) {
  return new PromiseCapability(C);
};

var newPromiseCapability = {
	f: f$5
};

var promiseResolve = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

var hostReportErrors = function (a, b) {
  var console = global_1.console;
  if (console && console.error) {
    arguments.length === 1 ? console.error(a) : console.error(a, b);
  }
};

var perform = function (exec) {
  try {
    return { error: false, value: exec() };
  } catch (error) {
    return { error: true, value: error };
  }
};

var process$2 = global_1.process;
var versions = process$2 && process$2.versions;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  version = match[0] + match[1];
} else if (engineUserAgent) {
  match = engineUserAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = engineUserAgent.match(/Chrome\/(\d+)/);
    if (match) version = match[1];
  }
}

var engineV8Version = version && +version;

var task$1 = task.set;










var SPECIES$2 = wellKnownSymbol('species');
var PROMISE = 'Promise';
var getInternalState = internalState.get;
var setInternalState = internalState.set;
var getInternalPromiseState = internalState.getterFor(PROMISE);
var PromiseConstructor = nativePromiseConstructor;
var TypeError$1 = global_1.TypeError;
var document$2 = global_1.document;
var process$3 = global_1.process;
var $fetch = getBuiltIn('fetch');
var newPromiseCapability$1 = newPromiseCapability.f;
var newGenericPromiseCapability = newPromiseCapability$1;
var IS_NODE$1 = classofRaw(process$3) == 'process';
var DISPATCH_EVENT = !!(document$2 && document$2.createEvent && global_1.dispatchEvent);
var UNHANDLED_REJECTION = 'unhandledrejection';
var REJECTION_HANDLED = 'rejectionhandled';
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;
var HANDLED = 1;
var UNHANDLED = 2;
var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

var FORCED = isForced_1(PROMISE, function () {
  var GLOBAL_CORE_JS_PROMISE = inspectSource(PromiseConstructor) !== String(PromiseConstructor);
  if (!GLOBAL_CORE_JS_PROMISE) {
    // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
    // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
    // We can't detect it synchronously, so just check versions
    if (engineV8Version === 66) return true;
    // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    if (!IS_NODE$1 && typeof PromiseRejectionEvent != 'function') return true;
  }
  // We can't use @@species feature detection in V8 since it causes
  // deoptimization and performance degradation
  // https://github.com/zloirock/core-js/issues/679
  if (engineV8Version >= 51 && /native code/.test(PromiseConstructor)) return false;
  // Detect correctness of subclassing with @@species support
  var promise = PromiseConstructor.resolve(1);
  var FakePromise = function (exec) {
    exec(function () { /* empty */ }, function () { /* empty */ });
  };
  var constructor = promise.constructor = {};
  constructor[SPECIES$2] = FakePromise;
  return !(promise.then(function () { /* empty */ }) instanceof FakePromise);
});

var INCORRECT_ITERATION = FORCED || !checkCorrectnessOfIteration(function (iterable) {
  PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
});

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};

var notify$1 = function (promise, state, isReject) {
  if (state.notified) return;
  state.notified = true;
  var chain = state.reactions;
  microtask(function () {
    var value = state.value;
    var ok = state.state == FULFILLED;
    var index = 0;
    // variable length - can't use forEach
    while (chain.length > index) {
      var reaction = chain[index++];
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (state.rejection === UNHANDLED) onHandleUnhandled(promise, state);
            state.rejection = HANDLED;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // can throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError$1('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (error) {
        if (domain && !exited) domain.exit();
        reject(error);
      }
    }
    state.reactions = [];
    state.notified = false;
    if (isReject && !state.rejection) onUnhandled(promise, state);
  });
};

var dispatchEvent = function (name, promise, reason) {
  var event, handler;
  if (DISPATCH_EVENT) {
    event = document$2.createEvent('Event');
    event.promise = promise;
    event.reason = reason;
    event.initEvent(name, false, true);
    global_1.dispatchEvent(event);
  } else event = { promise: promise, reason: reason };
  if (handler = global_1['on' + name]) handler(event);
  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
};

var onUnhandled = function (promise, state) {
  task$1.call(global_1, function () {
    var value = state.value;
    var IS_UNHANDLED = isUnhandled(state);
    var result;
    if (IS_UNHANDLED) {
      result = perform(function () {
        if (IS_NODE$1) {
          process$3.emit('unhandledRejection', value, promise);
        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      state.rejection = IS_NODE$1 || isUnhandled(state) ? UNHANDLED : HANDLED;
      if (result.error) throw result.value;
    }
  });
};

var isUnhandled = function (state) {
  return state.rejection !== HANDLED && !state.parent;
};

var onHandleUnhandled = function (promise, state) {
  task$1.call(global_1, function () {
    if (IS_NODE$1) {
      process$3.emit('rejectionHandled', promise);
    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
  });
};

var bind = function (fn, promise, state, unwrap) {
  return function (value) {
    fn(promise, state, value, unwrap);
  };
};

var internalReject = function (promise, state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  state.value = value;
  state.state = REJECTED;
  notify$1(promise, state, true);
};

var internalResolve = function (promise, state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  try {
    if (promise === value) throw TypeError$1("Promise can't be resolved itself");
    var then = isThenable(value);
    if (then) {
      microtask(function () {
        var wrapper = { done: false };
        try {
          then.call(value,
            bind(internalResolve, promise, wrapper, state),
            bind(internalReject, promise, wrapper, state)
          );
        } catch (error) {
          internalReject(promise, wrapper, error, state);
        }
      });
    } else {
      state.value = value;
      state.state = FULFILLED;
      notify$1(promise, state, false);
    }
  } catch (error) {
    internalReject(promise, { done: false }, error, state);
  }
};

// constructor polyfill
if (FORCED) {
  // 25.4.3.1 Promise(executor)
  PromiseConstructor = function Promise(executor) {
    anInstance(this, PromiseConstructor, PROMISE);
    aFunction$1(executor);
    Internal.call(this);
    var state = getInternalState(this);
    try {
      executor(bind(internalResolve, this, state), bind(internalReject, this, state));
    } catch (error) {
      internalReject(this, state, error);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    setInternalState(this, {
      type: PROMISE,
      done: false,
      notified: false,
      parent: false,
      reactions: [],
      rejection: false,
      state: PENDING,
      value: undefined
    });
  };
  Internal.prototype = redefineAll(PromiseConstructor.prototype, {
    // `Promise.prototype.then` method
    // https://tc39.github.io/ecma262/#sec-promise.prototype.then
    then: function then(onFulfilled, onRejected) {
      var state = getInternalPromiseState(this);
      var reaction = newPromiseCapability$1(speciesConstructor(this, PromiseConstructor));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = IS_NODE$1 ? process$3.domain : undefined;
      state.parent = true;
      state.reactions.push(reaction);
      if (state.state != PENDING) notify$1(this, state, false);
      return reaction.promise;
    },
    // `Promise.prototype.catch` method
    // https://tc39.github.io/ecma262/#sec-promise.prototype.catch
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    var state = getInternalState(promise);
    this.promise = promise;
    this.resolve = bind(internalResolve, promise, state);
    this.reject = bind(internalReject, promise, state);
  };
  newPromiseCapability.f = newPromiseCapability$1 = function (C) {
    return C === PromiseConstructor || C === PromiseWrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };

  if ( typeof nativePromiseConstructor == 'function') {
    nativeThen = nativePromiseConstructor.prototype.then;

    // wrap native Promise#then for native async functions
    redefine(nativePromiseConstructor.prototype, 'then', function then(onFulfilled, onRejected) {
      var that = this;
      return new PromiseConstructor(function (resolve, reject) {
        nativeThen.call(that, resolve, reject);
      }).then(onFulfilled, onRejected);
    // https://github.com/zloirock/core-js/issues/640
    }, { unsafe: true });

    // wrap fetch result
    if (typeof $fetch == 'function') _export({ global: true, enumerable: true, forced: true }, {
      // eslint-disable-next-line no-unused-vars
      fetch: function fetch(input /* , init */) {
        return promiseResolve(PromiseConstructor, $fetch.apply(global_1, arguments));
      }
    });
  }
}

_export({ global: true, wrap: true, forced: FORCED }, {
  Promise: PromiseConstructor
});

setToStringTag(PromiseConstructor, PROMISE, false);
setSpecies(PROMISE);

PromiseWrapper = getBuiltIn(PROMISE);

// statics
_export({ target: PROMISE, stat: true, forced: FORCED }, {
  // `Promise.reject` method
  // https://tc39.github.io/ecma262/#sec-promise.reject
  reject: function reject(r) {
    var capability = newPromiseCapability$1(this);
    capability.reject.call(undefined, r);
    return capability.promise;
  }
});

_export({ target: PROMISE, stat: true, forced:  FORCED }, {
  // `Promise.resolve` method
  // https://tc39.github.io/ecma262/#sec-promise.resolve
  resolve: function resolve(x) {
    return promiseResolve( this, x);
  }
});

_export({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION }, {
  // `Promise.all` method
  // https://tc39.github.io/ecma262/#sec-promise.all
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability$1(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aFunction$1(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate_1(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        $promiseResolve.call(C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  },
  // `Promise.race` method
  // https://tc39.github.io/ecma262/#sec-promise.race
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability$1(C);
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aFunction$1(C.resolve);
      iterate_1(iterable, function (promise) {
        $promiseResolve.call(C, promise).then(capability.resolve, reject);
      });
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});

// Safari bug https://bugs.webkit.org/show_bug.cgi?id=200829
var NON_GENERIC = !!nativePromiseConstructor && fails(function () {
  nativePromiseConstructor.prototype['finally'].call({ then: function () { /* empty */ } }, function () { /* empty */ });
});

// `Promise.prototype.finally` method
// https://tc39.github.io/ecma262/#sec-promise.prototype.finally
_export({ target: 'Promise', proto: true, real: true, forced: NON_GENERIC }, {
  'finally': function (onFinally) {
    var C = speciesConstructor(this, getBuiltIn('Promise'));
    var isFunction = typeof onFinally == 'function';
    return this.then(
      isFunction ? function (x) {
        return promiseResolve(C, onFinally()).then(function () { return x; });
      } : onFinally,
      isFunction ? function (e) {
        return promiseResolve(C, onFinally()).then(function () { throw e; });
      } : onFinally
    );
  }
});

// patch native Promise.prototype for native async functions
if ( typeof nativePromiseConstructor == 'function' && !nativePromiseConstructor.prototype['finally']) {
  redefine(nativePromiseConstructor.prototype, 'finally', getBuiltIn('Promise').prototype['finally']);
}

var slice = [].slice;
var MSIE = /MSIE .\./.test(engineUserAgent); // <- dirty ie9- check

var wrap = function (scheduler) {
  return function (handler, timeout /* , ...arguments */) {
    var boundArgs = arguments.length > 2;
    var args = boundArgs ? slice.call(arguments, 2) : undefined;
    return scheduler(boundArgs ? function () {
      // eslint-disable-next-line no-new-func
      (typeof handler == 'function' ? handler : Function(handler)).apply(this, args);
    } : handler, timeout);
  };
};

// ie9- setTimeout & setInterval additional parameters fix
// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
_export({ global: true, bind: true, forced: MSIE }, {
  // `setTimeout` method
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
  setTimeout: wrap(global_1.setTimeout),
  // `setInterval` method
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
  setInterval: wrap(global_1.setInterval)
});

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }

  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = o[Symbol.iterator]();
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

// `IsArray` abstract operation
// https://tc39.github.io/ecma262/#sec-isarray
var isArray = Array.isArray || function isArray(arg) {
  return classofRaw(arg) == 'Array';
};

// `ToObject` abstract operation
// https://tc39.github.io/ecma262/#sec-toobject
var toObject = function (argument) {
  return Object(requireObjectCoercible(argument));
};

// `Object.keys` method
// https://tc39.github.io/ecma262/#sec-object.keys
var objectKeys = Object.keys || function keys(O) {
  return objectKeysInternal(O, enumBugKeys);
};

// `Object.defineProperties` method
// https://tc39.github.io/ecma262/#sec-object.defineproperties
var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);
  return O;
};

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    /* global ActiveXObject */
    activeXDocument = document.domain && new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.github.io/ecma262/#sec-object.create
var objectCreate = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : objectDefineProperties(result, Properties);
};

var nativeGetOwnPropertyNames = objectGetOwnPropertyNames.f;

var toString$1 = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return nativeGetOwnPropertyNames(it);
  } catch (error) {
    return windowNames.slice();
  }
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var f$6 = function getOwnPropertyNames(it) {
  return windowNames && toString$1.call(it) == '[object Window]'
    ? getWindowNames(it)
    : nativeGetOwnPropertyNames(toIndexedObject(it));
};

var objectGetOwnPropertyNamesExternal = {
	f: f$6
};

var f$7 = wellKnownSymbol;

var wellKnownSymbolWrapped = {
	f: f$7
};

var defineProperty$2 = objectDefineProperty.f;

var defineWellKnownSymbol = function (NAME) {
  var Symbol = path.Symbol || (path.Symbol = {});
  if (!has(Symbol, NAME)) defineProperty$2(Symbol, NAME, {
    value: wellKnownSymbolWrapped.f(NAME)
  });
};

var SPECIES$3 = wellKnownSymbol('species');

// `ArraySpeciesCreate` abstract operation
// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
var arraySpeciesCreate = function (originalArray, length) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES$3];
      if (C === null) C = undefined;
    }
  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
};

var push = [].push;

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
var createMethod$1 = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = indexedObject(O);
    var boundFunction = functionBindContext(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push.call(target, value); // filter
        } else if (IS_EVERY) return false;  // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

var arrayIteration = {
  // `Array.prototype.forEach` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
  forEach: createMethod$1(0),
  // `Array.prototype.map` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.map
  map: createMethod$1(1),
  // `Array.prototype.filter` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
  filter: createMethod$1(2),
  // `Array.prototype.some` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.some
  some: createMethod$1(3),
  // `Array.prototype.every` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.every
  every: createMethod$1(4),
  // `Array.prototype.find` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.find
  find: createMethod$1(5),
  // `Array.prototype.findIndex` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod$1(6)
};

var $forEach = arrayIteration.forEach;

var HIDDEN = sharedKey('hidden');
var SYMBOL = 'Symbol';
var PROTOTYPE$1 = 'prototype';
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
var setInternalState$1 = internalState.set;
var getInternalState$1 = internalState.getterFor(SYMBOL);
var ObjectPrototype = Object[PROTOTYPE$1];
var $Symbol = global_1.Symbol;
var $stringify = getBuiltIn('JSON', 'stringify');
var nativeGetOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
var nativeDefineProperty$1 = objectDefineProperty.f;
var nativeGetOwnPropertyNames$1 = objectGetOwnPropertyNamesExternal.f;
var nativePropertyIsEnumerable$1 = objectPropertyIsEnumerable.f;
var AllSymbols = shared('symbols');
var ObjectPrototypeSymbols = shared('op-symbols');
var StringToSymbolRegistry = shared('string-to-symbol-registry');
var SymbolToStringRegistry = shared('symbol-to-string-registry');
var WellKnownSymbolsStore$1 = shared('wks');
var QObject = global_1.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var USE_SETTER = !QObject || !QObject[PROTOTYPE$1] || !QObject[PROTOTYPE$1].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDescriptor = descriptors && fails(function () {
  return objectCreate(nativeDefineProperty$1({}, 'a', {
    get: function () { return nativeDefineProperty$1(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (O, P, Attributes) {
  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor$1(ObjectPrototype, P);
  if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
  nativeDefineProperty$1(O, P, Attributes);
  if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
    nativeDefineProperty$1(ObjectPrototype, P, ObjectPrototypeDescriptor);
  }
} : nativeDefineProperty$1;

var wrap$1 = function (tag, description) {
  var symbol = AllSymbols[tag] = objectCreate($Symbol[PROTOTYPE$1]);
  setInternalState$1(symbol, {
    type: SYMBOL,
    tag: tag,
    description: description
  });
  if (!descriptors) symbol.description = description;
  return symbol;
};

var isSymbol = useSymbolAsUid ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return Object(it) instanceof $Symbol;
};

var $defineProperty = function defineProperty(O, P, Attributes) {
  if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
  anObject(O);
  var key = toPrimitive(P, true);
  anObject(Attributes);
  if (has(AllSymbols, key)) {
    if (!Attributes.enumerable) {
      if (!has(O, HIDDEN)) nativeDefineProperty$1(O, HIDDEN, createPropertyDescriptor(1, {}));
      O[HIDDEN][key] = true;
    } else {
      if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
      Attributes = objectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
    } return setSymbolDescriptor(O, key, Attributes);
  } return nativeDefineProperty$1(O, key, Attributes);
};

var $defineProperties = function defineProperties(O, Properties) {
  anObject(O);
  var properties = toIndexedObject(Properties);
  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
  $forEach(keys, function (key) {
    if (!descriptors || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
  });
  return O;
};

var $create = function create(O, Properties) {
  return Properties === undefined ? objectCreate(O) : $defineProperties(objectCreate(O), Properties);
};

var $propertyIsEnumerable = function propertyIsEnumerable(V) {
  var P = toPrimitive(V, true);
  var enumerable = nativePropertyIsEnumerable$1.call(this, P);
  if (this === ObjectPrototype && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
  return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
};

var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
  var it = toIndexedObject(O);
  var key = toPrimitive(P, true);
  if (it === ObjectPrototype && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
  var descriptor = nativeGetOwnPropertyDescriptor$1(it, key);
  if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
    descriptor.enumerable = true;
  }
  return descriptor;
};

var $getOwnPropertyNames = function getOwnPropertyNames(O) {
  var names = nativeGetOwnPropertyNames$1(toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
  });
  return result;
};

var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
  var names = nativeGetOwnPropertyNames$1(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype, key))) {
      result.push(AllSymbols[key]);
    }
  });
  return result;
};

// `Symbol` constructor
// https://tc39.github.io/ecma262/#sec-symbol-constructor
if (!nativeSymbol) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
    var description = !arguments.length || arguments[0] === undefined ? undefined : String(arguments[0]);
    var tag = uid(description);
    var setter = function (value) {
      if (this === ObjectPrototype) setter.call(ObjectPrototypeSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
    };
    if (descriptors && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
    return wrap$1(tag, description);
  };

  redefine($Symbol[PROTOTYPE$1], 'toString', function toString() {
    return getInternalState$1(this).tag;
  });

  redefine($Symbol, 'withoutSetter', function (description) {
    return wrap$1(uid(description), description);
  });

  objectPropertyIsEnumerable.f = $propertyIsEnumerable;
  objectDefineProperty.f = $defineProperty;
  objectGetOwnPropertyDescriptor.f = $getOwnPropertyDescriptor;
  objectGetOwnPropertyNames.f = objectGetOwnPropertyNamesExternal.f = $getOwnPropertyNames;
  objectGetOwnPropertySymbols.f = $getOwnPropertySymbols;

  wellKnownSymbolWrapped.f = function (name) {
    return wrap$1(wellKnownSymbol(name), name);
  };

  if (descriptors) {
    // https://github.com/tc39/proposal-Symbol-description
    nativeDefineProperty$1($Symbol[PROTOTYPE$1], 'description', {
      configurable: true,
      get: function description() {
        return getInternalState$1(this).description;
      }
    });
    {
      redefine(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
    }
  }
}

_export({ global: true, wrap: true, forced: !nativeSymbol, sham: !nativeSymbol }, {
  Symbol: $Symbol
});

$forEach(objectKeys(WellKnownSymbolsStore$1), function (name) {
  defineWellKnownSymbol(name);
});

_export({ target: SYMBOL, stat: true, forced: !nativeSymbol }, {
  // `Symbol.for` method
  // https://tc39.github.io/ecma262/#sec-symbol.for
  'for': function (key) {
    var string = String(key);
    if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
    var symbol = $Symbol(string);
    StringToSymbolRegistry[string] = symbol;
    SymbolToStringRegistry[symbol] = string;
    return symbol;
  },
  // `Symbol.keyFor` method
  // https://tc39.github.io/ecma262/#sec-symbol.keyfor
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
    if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
  },
  useSetter: function () { USE_SETTER = true; },
  useSimple: function () { USE_SETTER = false; }
});

_export({ target: 'Object', stat: true, forced: !nativeSymbol, sham: !descriptors }, {
  // `Object.create` method
  // https://tc39.github.io/ecma262/#sec-object.create
  create: $create,
  // `Object.defineProperty` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperty
  defineProperty: $defineProperty,
  // `Object.defineProperties` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperties
  defineProperties: $defineProperties,
  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
});

_export({ target: 'Object', stat: true, forced: !nativeSymbol }, {
  // `Object.getOwnPropertyNames` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
  getOwnPropertyNames: $getOwnPropertyNames,
  // `Object.getOwnPropertySymbols` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertysymbols
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
_export({ target: 'Object', stat: true, forced: fails(function () { objectGetOwnPropertySymbols.f(1); }) }, {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    return objectGetOwnPropertySymbols.f(toObject(it));
  }
});

// `JSON.stringify` method behavior with symbols
// https://tc39.github.io/ecma262/#sec-json.stringify
if ($stringify) {
  var FORCED_JSON_STRINGIFY = !nativeSymbol || fails(function () {
    var symbol = $Symbol();
    // MS Edge converts symbol values to JSON as {}
    return $stringify([symbol]) != '[null]'
      // WebKit converts symbol values to JSON as null
      || $stringify({ a: symbol }) != '{}'
      // V8 throws on boxed symbols
      || $stringify(Object(symbol)) != '{}';
  });

  _export({ target: 'JSON', stat: true, forced: FORCED_JSON_STRINGIFY }, {
    // eslint-disable-next-line no-unused-vars
    stringify: function stringify(it, replacer, space) {
      var args = [it];
      var index = 1;
      var $replacer;
      while (arguments.length > index) args.push(arguments[index++]);
      $replacer = replacer;
      if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
      if (!isArray(replacer)) replacer = function (key, value) {
        if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
        if (!isSymbol(value)) return value;
      };
      args[1] = replacer;
      return $stringify.apply(null, args);
    }
  });
}

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@toprimitive
if (!$Symbol[PROTOTYPE$1][TO_PRIMITIVE]) {
  createNonEnumerableProperty($Symbol[PROTOTYPE$1], TO_PRIMITIVE, $Symbol[PROTOTYPE$1].valueOf);
}
// `Symbol.prototype[@@toStringTag]` property
// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag($Symbol, SYMBOL);

hiddenKeys[HIDDEN] = true;

// `Symbol.asyncIterator` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.asynciterator
defineWellKnownSymbol('asyncIterator');

var defineProperty$3 = objectDefineProperty.f;


var NativeSymbol = global_1.Symbol;

if (descriptors && typeof NativeSymbol == 'function' && (!('description' in NativeSymbol.prototype) ||
  // Safari 12 bug
  NativeSymbol().description !== undefined
)) {
  var EmptyStringDescriptionStore = {};
  // wrap Symbol constructor for correct work with undefined description
  var SymbolWrapper = function Symbol() {
    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : String(arguments[0]);
    var result = this instanceof SymbolWrapper
      ? new NativeSymbol(description)
      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
      : description === undefined ? NativeSymbol() : NativeSymbol(description);
    if (description === '') EmptyStringDescriptionStore[result] = true;
    return result;
  };
  copyConstructorProperties(SymbolWrapper, NativeSymbol);
  var symbolPrototype = SymbolWrapper.prototype = NativeSymbol.prototype;
  symbolPrototype.constructor = SymbolWrapper;

  var symbolToString = symbolPrototype.toString;
  var native = String(NativeSymbol('test')) == 'Symbol(test)';
  var regexp = /^Symbol\((.*)\)[^)]+$/;
  defineProperty$3(symbolPrototype, 'description', {
    configurable: true,
    get: function description() {
      var symbol = isObject(this) ? this.valueOf() : this;
      var string = symbolToString.call(symbol);
      if (has(EmptyStringDescriptionStore, symbol)) return '';
      var desc = native ? string.slice(7, -1) : string.replace(regexp, '$1');
      return desc === '' ? undefined : desc;
    }
  });

  _export({ global: true, forced: true }, {
    Symbol: SymbolWrapper
  });
}

// `Symbol.hasInstance` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.hasinstance
defineWellKnownSymbol('hasInstance');

// `Symbol.isConcatSpreadable` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.isconcatspreadable
defineWellKnownSymbol('isConcatSpreadable');

// `Symbol.iterator` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.iterator
defineWellKnownSymbol('iterator');

// `Symbol.match` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.match
defineWellKnownSymbol('match');

// `Symbol.matchAll` well-known symbol
defineWellKnownSymbol('matchAll');

// `Symbol.replace` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.replace
defineWellKnownSymbol('replace');

// `Symbol.search` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.search
defineWellKnownSymbol('search');

// `Symbol.species` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.species
defineWellKnownSymbol('species');

// `Symbol.split` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.split
defineWellKnownSymbol('split');

// `Symbol.toPrimitive` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.toprimitive
defineWellKnownSymbol('toPrimitive');

// `Symbol.toStringTag` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.tostringtag
defineWellKnownSymbol('toStringTag');

// `Symbol.unscopables` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.unscopables
defineWellKnownSymbol('unscopables');

var nativeAssign = Object.assign;
var defineProperty$4 = Object.defineProperty;

// `Object.assign` method
// https://tc39.github.io/ecma262/#sec-object.assign
var objectAssign = !nativeAssign || fails(function () {
  // should have correct order of operations (Edge bug)
  if (descriptors && nativeAssign({ b: 1 }, nativeAssign(defineProperty$4({}, 'a', {
    enumerable: true,
    get: function () {
      defineProperty$4(this, 'b', {
        value: 3,
        enumerable: false
      });
    }
  }), { b: 2 })).b !== 1) return true;
  // should work with symbols and should have deterministic property order (V8 bug)
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var symbol = Symbol();
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
  return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
  var propertyIsEnumerable = objectPropertyIsEnumerable.f;
  while (argumentsLength > index) {
    var S = indexedObject(arguments[index++]);
    var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!descriptors || propertyIsEnumerable.call(S, key)) T[key] = S[key];
    }
  } return T;
} : nativeAssign;

// `Object.assign` method
// https://tc39.github.io/ecma262/#sec-object.assign
_export({ target: 'Object', stat: true, forced: Object.assign !== objectAssign }, {
  assign: objectAssign
});

// `Object.create` method
// https://tc39.github.io/ecma262/#sec-object.create
_export({ target: 'Object', stat: true, sham: !descriptors }, {
  create: objectCreate
});

// `Object.defineProperty` method
// https://tc39.github.io/ecma262/#sec-object.defineproperty
_export({ target: 'Object', stat: true, forced: !descriptors, sham: !descriptors }, {
  defineProperty: objectDefineProperty.f
});

// `Object.defineProperties` method
// https://tc39.github.io/ecma262/#sec-object.defineproperties
_export({ target: 'Object', stat: true, forced: !descriptors, sham: !descriptors }, {
  defineProperties: objectDefineProperties
});

var propertyIsEnumerable = objectPropertyIsEnumerable.f;

// `Object.{ entries, values }` methods implementation
var createMethod$2 = function (TO_ENTRIES) {
  return function (it) {
    var O = toIndexedObject(it);
    var keys = objectKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) {
      key = keys[i++];
      if (!descriptors || propertyIsEnumerable.call(O, key)) {
        result.push(TO_ENTRIES ? [key, O[key]] : O[key]);
      }
    }
    return result;
  };
};

var objectToArray = {
  // `Object.entries` method
  // https://tc39.github.io/ecma262/#sec-object.entries
  entries: createMethod$2(true),
  // `Object.values` method
  // https://tc39.github.io/ecma262/#sec-object.values
  values: createMethod$2(false)
};

var $entries = objectToArray.entries;

// `Object.entries` method
// https://tc39.github.io/ecma262/#sec-object.entries
_export({ target: 'Object', stat: true }, {
  entries: function entries(O) {
    return $entries(O);
  }
});

var freezing = !fails(function () {
  return Object.isExtensible(Object.preventExtensions({}));
});

var internalMetadata = createCommonjsModule(function (module) {
var defineProperty = objectDefineProperty.f;



var METADATA = uid('meta');
var id = 0;

var isExtensible = Object.isExtensible || function () {
  return true;
};

var setMetadata = function (it) {
  defineProperty(it, METADATA, { value: {
    objectID: 'O' + ++id, // object ID
    weakData: {}          // weak collections IDs
  } });
};

var fastKey = function (it, create) {
  // return a primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMetadata(it);
  // return object ID
  } return it[METADATA].objectID;
};

var getWeakData = function (it, create) {
  if (!has(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMetadata(it);
  // return the store of weak collections IDs
  } return it[METADATA].weakData;
};

// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (freezing && meta.REQUIRED && isExtensible(it) && !has(it, METADATA)) setMetadata(it);
  return it;
};

var meta = module.exports = {
  REQUIRED: false,
  fastKey: fastKey,
  getWeakData: getWeakData,
  onFreeze: onFreeze
};

hiddenKeys[METADATA] = true;
});

var onFreeze = internalMetadata.onFreeze;

var nativeFreeze = Object.freeze;
var FAILS_ON_PRIMITIVES = fails(function () { nativeFreeze(1); });

// `Object.freeze` method
// https://tc39.github.io/ecma262/#sec-object.freeze
_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !freezing }, {
  freeze: function freeze(it) {
    return nativeFreeze && isObject(it) ? nativeFreeze(onFreeze(it)) : it;
  }
});

var createProperty = function (object, key, value) {
  var propertyKey = toPrimitive(key);
  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};

// `Object.fromEntries` method
// https://github.com/tc39/proposal-object-from-entries
_export({ target: 'Object', stat: true }, {
  fromEntries: function fromEntries(iterable) {
    var obj = {};
    iterate_1(iterable, function (k, v) {
      createProperty(obj, k, v);
    }, undefined, true);
    return obj;
  }
});

var nativeGetOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;


var FAILS_ON_PRIMITIVES$1 = fails(function () { nativeGetOwnPropertyDescriptor$2(1); });
var FORCED$1 = !descriptors || FAILS_ON_PRIMITIVES$1;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
_export({ target: 'Object', stat: true, forced: FORCED$1, sham: !descriptors }, {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
    return nativeGetOwnPropertyDescriptor$2(toIndexedObject(it), key);
  }
});

// `Object.getOwnPropertyDescriptors` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
_export({ target: 'Object', stat: true, sham: !descriptors }, {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIndexedObject(object);
    var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
    var keys = ownKeys(O);
    var result = {};
    var index = 0;
    var key, descriptor;
    while (keys.length > index) {
      descriptor = getOwnPropertyDescriptor(O, key = keys[index++]);
      if (descriptor !== undefined) createProperty(result, key, descriptor);
    }
    return result;
  }
});

var nativeGetOwnPropertyNames$2 = objectGetOwnPropertyNamesExternal.f;

var FAILS_ON_PRIMITIVES$2 = fails(function () { return !Object.getOwnPropertyNames(1); });

// `Object.getOwnPropertyNames` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$2 }, {
  getOwnPropertyNames: nativeGetOwnPropertyNames$2
});

var correctPrototypeGetter = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  return Object.getPrototypeOf(new F()) !== F.prototype;
});

var IE_PROTO$1 = sharedKey('IE_PROTO');
var ObjectPrototype$1 = Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.getprototypeof
var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO$1)) return O[IE_PROTO$1];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectPrototype$1 : null;
};

var FAILS_ON_PRIMITIVES$3 = fails(function () { objectGetPrototypeOf(1); });

// `Object.getPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.getprototypeof
_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$3, sham: !correctPrototypeGetter }, {
  getPrototypeOf: function getPrototypeOf(it) {
    return objectGetPrototypeOf(toObject(it));
  }
});

// `SameValue` abstract operation
// https://tc39.github.io/ecma262/#sec-samevalue
var sameValue = Object.is || function is(x, y) {
  // eslint-disable-next-line no-self-compare
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};

// `Object.is` method
// https://tc39.github.io/ecma262/#sec-object.is
_export({ target: 'Object', stat: true }, {
  is: sameValue
});

var nativeIsExtensible = Object.isExtensible;
var FAILS_ON_PRIMITIVES$4 = fails(function () { nativeIsExtensible(1); });

// `Object.isExtensible` method
// https://tc39.github.io/ecma262/#sec-object.isextensible
_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$4 }, {
  isExtensible: function isExtensible(it) {
    return isObject(it) ? nativeIsExtensible ? nativeIsExtensible(it) : true : false;
  }
});

var nativeIsFrozen = Object.isFrozen;
var FAILS_ON_PRIMITIVES$5 = fails(function () { nativeIsFrozen(1); });

// `Object.isFrozen` method
// https://tc39.github.io/ecma262/#sec-object.isfrozen
_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$5 }, {
  isFrozen: function isFrozen(it) {
    return isObject(it) ? nativeIsFrozen ? nativeIsFrozen(it) : false : true;
  }
});

var nativeIsSealed = Object.isSealed;
var FAILS_ON_PRIMITIVES$6 = fails(function () { nativeIsSealed(1); });

// `Object.isSealed` method
// https://tc39.github.io/ecma262/#sec-object.issealed
_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$6 }, {
  isSealed: function isSealed(it) {
    return isObject(it) ? nativeIsSealed ? nativeIsSealed(it) : false : true;
  }
});

var FAILS_ON_PRIMITIVES$7 = fails(function () { objectKeys(1); });

// `Object.keys` method
// https://tc39.github.io/ecma262/#sec-object.keys
_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$7 }, {
  keys: function keys(it) {
    return objectKeys(toObject(it));
  }
});

var onFreeze$1 = internalMetadata.onFreeze;



var nativePreventExtensions = Object.preventExtensions;
var FAILS_ON_PRIMITIVES$8 = fails(function () { nativePreventExtensions(1); });

// `Object.preventExtensions` method
// https://tc39.github.io/ecma262/#sec-object.preventextensions
_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$8, sham: !freezing }, {
  preventExtensions: function preventExtensions(it) {
    return nativePreventExtensions && isObject(it) ? nativePreventExtensions(onFreeze$1(it)) : it;
  }
});

var onFreeze$2 = internalMetadata.onFreeze;



var nativeSeal = Object.seal;
var FAILS_ON_PRIMITIVES$9 = fails(function () { nativeSeal(1); });

// `Object.seal` method
// https://tc39.github.io/ecma262/#sec-object.seal
_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$9, sham: !freezing }, {
  seal: function seal(it) {
    return nativeSeal && isObject(it) ? nativeSeal(onFreeze$2(it)) : it;
  }
});

var aPossiblePrototype = function (it) {
  if (!isObject(it) && it !== null) {
    throw TypeError("Can't set " + String(it) + ' as a prototype');
  } return it;
};

// `Object.setPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
    setter.call(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter.call(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);

// `Object.setPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.setprototypeof
_export({ target: 'Object', stat: true }, {
  setPrototypeOf: objectSetPrototypeOf
});

var $values = objectToArray.values;

// `Object.values` method
// https://tc39.github.io/ecma262/#sec-object.values
_export({ target: 'Object', stat: true }, {
  values: function values(O) {
    return $values(O);
  }
});

// Forced replacement object prototype accessors methods
var objectPrototypeAccessorsForced =  !fails(function () {
  var key = Math.random();
  // In FF throws only define methods
  // eslint-disable-next-line no-undef, no-useless-call
  __defineSetter__.call(null, key, function () { /* empty */ });
  delete global_1[key];
});

// `Object.prototype.__defineGetter__` method
// https://tc39.github.io/ecma262/#sec-object.prototype.__defineGetter__
if (descriptors) {
  _export({ target: 'Object', proto: true, forced: objectPrototypeAccessorsForced }, {
    __defineGetter__: function __defineGetter__(P, getter) {
      objectDefineProperty.f(toObject(this), P, { get: aFunction$1(getter), enumerable: true, configurable: true });
    }
  });
}

// `Object.prototype.__defineSetter__` method
// https://tc39.github.io/ecma262/#sec-object.prototype.__defineSetter__
if (descriptors) {
  _export({ target: 'Object', proto: true, forced: objectPrototypeAccessorsForced }, {
    __defineSetter__: function __defineSetter__(P, setter) {
      objectDefineProperty.f(toObject(this), P, { set: aFunction$1(setter), enumerable: true, configurable: true });
    }
  });
}

var getOwnPropertyDescriptor$3 = objectGetOwnPropertyDescriptor.f;

// `Object.prototype.__lookupGetter__` method
// https://tc39.github.io/ecma262/#sec-object.prototype.__lookupGetter__
if (descriptors) {
  _export({ target: 'Object', proto: true, forced: objectPrototypeAccessorsForced }, {
    __lookupGetter__: function __lookupGetter__(P) {
      var O = toObject(this);
      var key = toPrimitive(P, true);
      var desc;
      do {
        if (desc = getOwnPropertyDescriptor$3(O, key)) return desc.get;
      } while (O = objectGetPrototypeOf(O));
    }
  });
}

var getOwnPropertyDescriptor$4 = objectGetOwnPropertyDescriptor.f;

// `Object.prototype.__lookupSetter__` method
// https://tc39.github.io/ecma262/#sec-object.prototype.__lookupSetter__
if (descriptors) {
  _export({ target: 'Object', proto: true, forced: objectPrototypeAccessorsForced }, {
    __lookupSetter__: function __lookupSetter__(P) {
      var O = toObject(this);
      var key = toPrimitive(P, true);
      var desc;
      do {
        if (desc = getOwnPropertyDescriptor$4(O, key)) return desc.set;
      } while (O = objectGetPrototypeOf(O));
    }
  });
}

var slice$1 = [].slice;
var factories = {};

var construct = function (C, argsLength, args) {
  if (!(argsLength in factories)) {
    for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';
    // eslint-disable-next-line no-new-func
    factories[argsLength] = Function('C,a', 'return new C(' + list.join(',') + ')');
  } return factories[argsLength](C, args);
};

// `Function.prototype.bind` method implementation
// https://tc39.github.io/ecma262/#sec-function.prototype.bind
var functionBind = Function.bind || function bind(that /* , ...args */) {
  var fn = aFunction$1(this);
  var partArgs = slice$1.call(arguments, 1);
  var boundFunction = function bound(/* args... */) {
    var args = partArgs.concat(slice$1.call(arguments));
    return this instanceof boundFunction ? construct(fn, args.length, args) : fn.apply(that, args);
  };
  if (isObject(fn.prototype)) boundFunction.prototype = fn.prototype;
  return boundFunction;
};

// `Function.prototype.bind` method
// https://tc39.github.io/ecma262/#sec-function.prototype.bind
_export({ target: 'Function', proto: true }, {
  bind: functionBind
});

var HAS_INSTANCE = wellKnownSymbol('hasInstance');
var FunctionPrototype$1 = Function.prototype;

// `Function.prototype[@@hasInstance]` method
// https://tc39.github.io/ecma262/#sec-function.prototype-@@hasinstance
if (!(HAS_INSTANCE in FunctionPrototype$1)) {
  objectDefineProperty.f(FunctionPrototype$1, HAS_INSTANCE, { value: function (O) {
    if (typeof this != 'function' || !isObject(O)) return false;
    if (!isObject(this.prototype)) return O instanceof this;
    // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
    while (O = objectGetPrototypeOf(O)) if (this.prototype === O) return true;
    return false;
  } });
}

// `globalThis` object
// https://github.com/tc39/proposal-global
_export({ global: true }, {
  globalThis: global_1
});

// `Array.from` method implementation
// https://tc39.github.io/ecma262/#sec-array.from
var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
  var O = toObject(arrayLike);
  var C = typeof this == 'function' ? this : Array;
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var iteratorMethod = getIteratorMethod(O);
  var index = 0;
  var length, result, step, iterator, next, value;
  if (mapping) mapfn = functionBindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
    iterator = iteratorMethod.call(O);
    next = iterator.next;
    result = new C();
    for (;!(step = next.call(iterator)).done; index++) {
      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
      createProperty(result, index, value);
    }
  } else {
    length = toLength(O.length);
    result = new C(length);
    for (;length > index; index++) {
      value = mapping ? mapfn(O[index], index) : O[index];
      createProperty(result, index, value);
    }
  }
  result.length = index;
  return result;
};

var INCORRECT_ITERATION$1 = !checkCorrectnessOfIteration(function (iterable) {
  Array.from(iterable);
});

// `Array.from` method
// https://tc39.github.io/ecma262/#sec-array.from
_export({ target: 'Array', stat: true, forced: INCORRECT_ITERATION$1 }, {
  from: arrayFrom
});

// `Array.isArray` method
// https://tc39.github.io/ecma262/#sec-array.isarray
_export({ target: 'Array', stat: true }, {
  isArray: isArray
});

var ISNT_GENERIC = fails(function () {
  function F() { /* empty */ }
  return !(Array.of.call(F) instanceof F);
});

// `Array.of` method
// https://tc39.github.io/ecma262/#sec-array.of
// WebKit Array.of isn't generic
_export({ target: 'Array', stat: true, forced: ISNT_GENERIC }, {
  of: function of(/* ...args */) {
    var index = 0;
    var argumentsLength = arguments.length;
    var result = new (typeof this == 'function' ? this : Array)(argumentsLength);
    while (argumentsLength > index) createProperty(result, index, arguments[index++]);
    result.length = argumentsLength;
    return result;
  }
});

var SPECIES$4 = wellKnownSymbol('species');

var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return engineV8Version >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES$4] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};

var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

// We can't use this feature detection in V8 since it causes
// deoptimization and serious performance degradation
// https://github.com/zloirock/core-js/issues/679
var IS_CONCAT_SPREADABLE_SUPPORT = engineV8Version >= 51 || !fails(function () {
  var array = [];
  array[IS_CONCAT_SPREADABLE] = false;
  return array.concat()[0] !== array;
});

var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

var isConcatSpreadable = function (O) {
  if (!isObject(O)) return false;
  var spreadable = O[IS_CONCAT_SPREADABLE];
  return spreadable !== undefined ? !!spreadable : isArray(O);
};

var FORCED$2 = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

// `Array.prototype.concat` method
// https://tc39.github.io/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
_export({ target: 'Array', proto: true, forced: FORCED$2 }, {
  concat: function concat(arg) { // eslint-disable-line no-unused-vars
    var O = toObject(this);
    var A = arraySpeciesCreate(O, 0);
    var n = 0;
    var i, k, length, len, E;
    for (i = -1, length = arguments.length; i < length; i++) {
      E = i === -1 ? O : arguments[i];
      if (isConcatSpreadable(E)) {
        len = toLength(E.length);
        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
      } else {
        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        createProperty(A, n++, E);
      }
    }
    A.length = n;
    return A;
  }
});

var min$2 = Math.min;

// `Array.prototype.copyWithin` method implementation
// https://tc39.github.io/ecma262/#sec-array.prototype.copywithin
var arrayCopyWithin = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
  var O = toObject(this);
  var len = toLength(O.length);
  var to = toAbsoluteIndex(target, len);
  var from = toAbsoluteIndex(start, len);
  var end = arguments.length > 2 ? arguments[2] : undefined;
  var count = min$2((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
  var inc = 1;
  if (from < to && to < from + count) {
    inc = -1;
    from += count - 1;
    to += count - 1;
  }
  while (count-- > 0) {
    if (from in O) O[to] = O[from];
    else delete O[to];
    to += inc;
    from += inc;
  } return O;
};

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype$1 = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype$1[UNSCOPABLES] == undefined) {
  objectDefineProperty.f(ArrayPrototype$1, UNSCOPABLES, {
    configurable: true,
    value: objectCreate(null)
  });
}

// add a key to Array.prototype[@@unscopables]
var addToUnscopables = function (key) {
  ArrayPrototype$1[UNSCOPABLES][key] = true;
};

// `Array.prototype.copyWithin` method
// https://tc39.github.io/ecma262/#sec-array.prototype.copywithin
_export({ target: 'Array', proto: true }, {
  copyWithin: arrayCopyWithin
});

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('copyWithin');

var arrayMethodIsStrict = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call,no-throw-literal
    method.call(null, argument || function () { throw 1; }, 1);
  });
};

var defineProperty$5 = Object.defineProperty;
var cache = {};

var thrower = function (it) { throw it; };

var arrayMethodUsesToLength = function (METHOD_NAME, options) {
  if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
  if (!options) options = {};
  var method = [][METHOD_NAME];
  var ACCESSORS = has(options, 'ACCESSORS') ? options.ACCESSORS : false;
  var argument0 = has(options, 0) ? options[0] : thrower;
  var argument1 = has(options, 1) ? options[1] : undefined;

  return cache[METHOD_NAME] = !!method && !fails(function () {
    if (ACCESSORS && !descriptors) return true;
    var O = { length: -1 };

    if (ACCESSORS) defineProperty$5(O, 1, { enumerable: true, get: thrower });
    else O[1] = 1;

    method.call(O, argument0, argument1);
  });
};

var $every = arrayIteration.every;



var STRICT_METHOD = arrayMethodIsStrict('every');
var USES_TO_LENGTH = arrayMethodUsesToLength('every');

// `Array.prototype.every` method
// https://tc39.github.io/ecma262/#sec-array.prototype.every
_export({ target: 'Array', proto: true, forced: !STRICT_METHOD || !USES_TO_LENGTH }, {
  every: function every(callbackfn /* , thisArg */) {
    return $every(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// `Array.prototype.fill` method implementation
// https://tc39.github.io/ecma262/#sec-array.prototype.fill
var arrayFill = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = toLength(O.length);
  var argumentsLength = arguments.length;
  var index = toAbsoluteIndex(argumentsLength > 1 ? arguments[1] : undefined, length);
  var end = argumentsLength > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};

// `Array.prototype.fill` method
// https://tc39.github.io/ecma262/#sec-array.prototype.fill
_export({ target: 'Array', proto: true }, {
  fill: arrayFill
});

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('fill');

var $filter = arrayIteration.filter;



var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');
// Edge 14- issue
var USES_TO_LENGTH$1 = arrayMethodUsesToLength('filter');

// `Array.prototype.filter` method
// https://tc39.github.io/ecma262/#sec-array.prototype.filter
// with adding support of @@species
_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH$1 }, {
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var $find = arrayIteration.find;



var FIND = 'find';
var SKIPS_HOLES = true;

var USES_TO_LENGTH$2 = arrayMethodUsesToLength(FIND);

// Shouldn't skip holes
if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false; });

// `Array.prototype.find` method
// https://tc39.github.io/ecma262/#sec-array.prototype.find
_export({ target: 'Array', proto: true, forced: SKIPS_HOLES || !USES_TO_LENGTH$2 }, {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables(FIND);

var $findIndex = arrayIteration.findIndex;



var FIND_INDEX = 'findIndex';
var SKIPS_HOLES$1 = true;

var USES_TO_LENGTH$3 = arrayMethodUsesToLength(FIND_INDEX);

// Shouldn't skip holes
if (FIND_INDEX in []) Array(1)[FIND_INDEX](function () { SKIPS_HOLES$1 = false; });

// `Array.prototype.findIndex` method
// https://tc39.github.io/ecma262/#sec-array.prototype.findindex
_export({ target: 'Array', proto: true, forced: SKIPS_HOLES$1 || !USES_TO_LENGTH$3 }, {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $findIndex(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables(FIND_INDEX);

// `FlattenIntoArray` abstract operation
// https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray
var flattenIntoArray = function (target, original, source, sourceLen, start, depth, mapper, thisArg) {
  var targetIndex = start;
  var sourceIndex = 0;
  var mapFn = mapper ? functionBindContext(mapper, thisArg, 3) : false;
  var element;

  while (sourceIndex < sourceLen) {
    if (sourceIndex in source) {
      element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];

      if (depth > 0 && isArray(element)) {
        targetIndex = flattenIntoArray(target, original, element, toLength(element.length), targetIndex, depth - 1) - 1;
      } else {
        if (targetIndex >= 0x1FFFFFFFFFFFFF) throw TypeError('Exceed the acceptable array length');
        target[targetIndex] = element;
      }

      targetIndex++;
    }
    sourceIndex++;
  }
  return targetIndex;
};

var flattenIntoArray_1 = flattenIntoArray;

// `Array.prototype.flat` method
// https://github.com/tc39/proposal-flatMap
_export({ target: 'Array', proto: true }, {
  flat: function flat(/* depthArg = 1 */) {
    var depthArg = arguments.length ? arguments[0] : undefined;
    var O = toObject(this);
    var sourceLen = toLength(O.length);
    var A = arraySpeciesCreate(O, 0);
    A.length = flattenIntoArray_1(A, O, O, sourceLen, 0, depthArg === undefined ? 1 : toInteger(depthArg));
    return A;
  }
});

// `Array.prototype.flatMap` method
// https://github.com/tc39/proposal-flatMap
_export({ target: 'Array', proto: true }, {
  flatMap: function flatMap(callbackfn /* , thisArg */) {
    var O = toObject(this);
    var sourceLen = toLength(O.length);
    var A;
    aFunction$1(callbackfn);
    A = arraySpeciesCreate(O, 0);
    A.length = flattenIntoArray_1(A, O, O, sourceLen, 0, 1, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    return A;
  }
});

var $forEach$1 = arrayIteration.forEach;



var STRICT_METHOD$1 = arrayMethodIsStrict('forEach');
var USES_TO_LENGTH$4 = arrayMethodUsesToLength('forEach');

// `Array.prototype.forEach` method implementation
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
var arrayForEach = (!STRICT_METHOD$1 || !USES_TO_LENGTH$4) ? function forEach(callbackfn /* , thisArg */) {
  return $forEach$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
} : [].forEach;

// `Array.prototype.forEach` method
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
_export({ target: 'Array', proto: true, forced: [].forEach != arrayForEach }, {
  forEach: arrayForEach
});

var $includes = arrayIncludes.includes;



var USES_TO_LENGTH$5 = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });

// `Array.prototype.includes` method
// https://tc39.github.io/ecma262/#sec-array.prototype.includes
_export({ target: 'Array', proto: true, forced: !USES_TO_LENGTH$5 }, {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('includes');

var $indexOf = arrayIncludes.indexOf;



var nativeIndexOf = [].indexOf;

var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
var STRICT_METHOD$2 = arrayMethodIsStrict('indexOf');
var USES_TO_LENGTH$6 = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });

// `Array.prototype.indexOf` method
// https://tc39.github.io/ecma262/#sec-array.prototype.indexof
_export({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD$2 || !USES_TO_LENGTH$6 }, {
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? nativeIndexOf.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var nativeJoin = [].join;

var ES3_STRINGS = indexedObject != Object;
var STRICT_METHOD$3 = arrayMethodIsStrict('join', ',');

// `Array.prototype.join` method
// https://tc39.github.io/ecma262/#sec-array.prototype.join
_export({ target: 'Array', proto: true, forced: ES3_STRINGS || !STRICT_METHOD$3 }, {
  join: function join(separator) {
    return nativeJoin.call(toIndexedObject(this), separator === undefined ? ',' : separator);
  }
});

var min$3 = Math.min;
var nativeLastIndexOf = [].lastIndexOf;
var NEGATIVE_ZERO$1 = !!nativeLastIndexOf && 1 / [1].lastIndexOf(1, -0) < 0;
var STRICT_METHOD$4 = arrayMethodIsStrict('lastIndexOf');
// For preventing possible almost infinite loop in non-standard implementations, test the forward version of the method
var USES_TO_LENGTH$7 = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });
var FORCED$3 = NEGATIVE_ZERO$1 || !STRICT_METHOD$4 || !USES_TO_LENGTH$7;

// `Array.prototype.lastIndexOf` method implementation
// https://tc39.github.io/ecma262/#sec-array.prototype.lastindexof
var arrayLastIndexOf = FORCED$3 ? function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
  // convert -0 to +0
  if (NEGATIVE_ZERO$1) return nativeLastIndexOf.apply(this, arguments) || 0;
  var O = toIndexedObject(this);
  var length = toLength(O.length);
  var index = length - 1;
  if (arguments.length > 1) index = min$3(index, toInteger(arguments[1]));
  if (index < 0) index = length + index;
  for (;index >= 0; index--) if (index in O && O[index] === searchElement) return index || 0;
  return -1;
} : nativeLastIndexOf;

// `Array.prototype.lastIndexOf` method
// https://tc39.github.io/ecma262/#sec-array.prototype.lastindexof
_export({ target: 'Array', proto: true, forced: arrayLastIndexOf !== [].lastIndexOf }, {
  lastIndexOf: arrayLastIndexOf
});

var $map = arrayIteration.map;



var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('map');
// FF49- issue
var USES_TO_LENGTH$8 = arrayMethodUsesToLength('map');

// `Array.prototype.map` method
// https://tc39.github.io/ecma262/#sec-array.prototype.map
// with adding support of @@species
_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 || !USES_TO_LENGTH$8 }, {
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// `Array.prototype.{ reduce, reduceRight }` methods implementation
var createMethod$3 = function (IS_RIGHT) {
  return function (that, callbackfn, argumentsLength, memo) {
    aFunction$1(callbackfn);
    var O = toObject(that);
    var self = indexedObject(O);
    var length = toLength(O.length);
    var index = IS_RIGHT ? length - 1 : 0;
    var i = IS_RIGHT ? -1 : 1;
    if (argumentsLength < 2) while (true) {
      if (index in self) {
        memo = self[index];
        index += i;
        break;
      }
      index += i;
      if (IS_RIGHT ? index < 0 : length <= index) {
        throw TypeError('Reduce of empty array with no initial value');
      }
    }
    for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
      memo = callbackfn(memo, self[index], index, O);
    }
    return memo;
  };
};

var arrayReduce = {
  // `Array.prototype.reduce` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.reduce
  left: createMethod$3(false),
  // `Array.prototype.reduceRight` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
  right: createMethod$3(true)
};

var $reduce = arrayReduce.left;



var STRICT_METHOD$5 = arrayMethodIsStrict('reduce');
var USES_TO_LENGTH$9 = arrayMethodUsesToLength('reduce', { 1: 0 });

// `Array.prototype.reduce` method
// https://tc39.github.io/ecma262/#sec-array.prototype.reduce
_export({ target: 'Array', proto: true, forced: !STRICT_METHOD$5 || !USES_TO_LENGTH$9 }, {
  reduce: function reduce(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var $reduceRight = arrayReduce.right;



var STRICT_METHOD$6 = arrayMethodIsStrict('reduceRight');
// For preventing possible almost infinite loop in non-standard implementations, test the forward version of the method
var USES_TO_LENGTH$a = arrayMethodUsesToLength('reduce', { 1: 0 });

// `Array.prototype.reduceRight` method
// https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
_export({ target: 'Array', proto: true, forced: !STRICT_METHOD$6 || !USES_TO_LENGTH$a }, {
  reduceRight: function reduceRight(callbackfn /* , initialValue */) {
    return $reduceRight(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var nativeReverse = [].reverse;
var test$1 = [1, 2];

// `Array.prototype.reverse` method
// https://tc39.github.io/ecma262/#sec-array.prototype.reverse
// fix for Safari 12.0 bug
// https://bugs.webkit.org/show_bug.cgi?id=188794
_export({ target: 'Array', proto: true, forced: String(test$1) === String(test$1.reverse()) }, {
  reverse: function reverse() {
    // eslint-disable-next-line no-self-assign
    if (isArray(this)) this.length = this.length;
    return nativeReverse.call(this);
  }
});

var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport('slice');
var USES_TO_LENGTH$b = arrayMethodUsesToLength('slice', { ACCESSORS: true, 0: 0, 1: 2 });

var SPECIES$5 = wellKnownSymbol('species');
var nativeSlice = [].slice;
var max$1 = Math.max;

// `Array.prototype.slice` method
// https://tc39.github.io/ecma262/#sec-array.prototype.slice
// fallback for not array-like ES3 strings and DOM objects
_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$2 || !USES_TO_LENGTH$b }, {
  slice: function slice(start, end) {
    var O = toIndexedObject(this);
    var length = toLength(O.length);
    var k = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
    var Constructor, result, n;
    if (isArray(O)) {
      Constructor = O.constructor;
      // cross-realm fallback
      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
        Constructor = undefined;
      } else if (isObject(Constructor)) {
        Constructor = Constructor[SPECIES$5];
        if (Constructor === null) Constructor = undefined;
      }
      if (Constructor === Array || Constructor === undefined) {
        return nativeSlice.call(O, k, fin);
      }
    }
    result = new (Constructor === undefined ? Array : Constructor)(max$1(fin - k, 0));
    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
    result.length = n;
    return result;
  }
});

var $some = arrayIteration.some;



var STRICT_METHOD$7 = arrayMethodIsStrict('some');
var USES_TO_LENGTH$c = arrayMethodUsesToLength('some');

// `Array.prototype.some` method
// https://tc39.github.io/ecma262/#sec-array.prototype.some
_export({ target: 'Array', proto: true, forced: !STRICT_METHOD$7 || !USES_TO_LENGTH$c }, {
  some: function some(callbackfn /* , thisArg */) {
    return $some(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var test$2 = [];
var nativeSort = test$2.sort;

// IE8-
var FAILS_ON_UNDEFINED = fails(function () {
  test$2.sort(undefined);
});
// V8 bug
var FAILS_ON_NULL = fails(function () {
  test$2.sort(null);
});
// Old WebKit
var STRICT_METHOD$8 = arrayMethodIsStrict('sort');

var FORCED$4 = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || !STRICT_METHOD$8;

// `Array.prototype.sort` method
// https://tc39.github.io/ecma262/#sec-array.prototype.sort
_export({ target: 'Array', proto: true, forced: FORCED$4 }, {
  sort: function sort(comparefn) {
    return comparefn === undefined
      ? nativeSort.call(toObject(this))
      : nativeSort.call(toObject(this), aFunction$1(comparefn));
  }
});

var HAS_SPECIES_SUPPORT$3 = arrayMethodHasSpeciesSupport('splice');
var USES_TO_LENGTH$d = arrayMethodUsesToLength('splice', { ACCESSORS: true, 0: 0, 1: 2 });

var max$2 = Math.max;
var min$4 = Math.min;
var MAX_SAFE_INTEGER$1 = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

// `Array.prototype.splice` method
// https://tc39.github.io/ecma262/#sec-array.prototype.splice
// with adding support of @@species
_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$3 || !USES_TO_LENGTH$d }, {
  splice: function splice(start, deleteCount /* , ...items */) {
    var O = toObject(this);
    var len = toLength(O.length);
    var actualStart = toAbsoluteIndex(start, len);
    var argumentsLength = arguments.length;
    var insertCount, actualDeleteCount, A, k, from, to;
    if (argumentsLength === 0) {
      insertCount = actualDeleteCount = 0;
    } else if (argumentsLength === 1) {
      insertCount = 0;
      actualDeleteCount = len - actualStart;
    } else {
      insertCount = argumentsLength - 2;
      actualDeleteCount = min$4(max$2(toInteger(deleteCount), 0), len - actualStart);
    }
    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER$1) {
      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
    }
    A = arraySpeciesCreate(O, actualDeleteCount);
    for (k = 0; k < actualDeleteCount; k++) {
      from = actualStart + k;
      if (from in O) createProperty(A, k, O[from]);
    }
    A.length = actualDeleteCount;
    if (insertCount < actualDeleteCount) {
      for (k = actualStart; k < len - actualDeleteCount; k++) {
        from = k + actualDeleteCount;
        to = k + insertCount;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
    } else if (insertCount > actualDeleteCount) {
      for (k = len - actualDeleteCount; k > actualStart; k--) {
        from = k + actualDeleteCount - 1;
        to = k + insertCount - 1;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
    }
    for (k = 0; k < insertCount; k++) {
      O[k + actualStart] = arguments[k + 2];
    }
    O.length = len - actualDeleteCount + insertCount;
    return A;
  }
});

// `Array[@@species]` getter
// https://tc39.github.io/ecma262/#sec-get-array-@@species
setSpecies('Array');

// this method was added to unscopables after implementation
// in popular engines, so it's moved to a separate module


addToUnscopables('flat');

// this method was added to unscopables after implementation
// in popular engines, so it's moved to a separate module


addToUnscopables('flatMap');

var ITERATOR$3 = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

var returnThis = function () { return this; };

// `%IteratorPrototype%` object
// https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

if (IteratorPrototype == undefined) IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
if ( !has(IteratorPrototype, ITERATOR$3)) {
  createNonEnumerableProperty(IteratorPrototype, ITERATOR$3, returnThis);
}

var iteratorsCore = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};

var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





var returnThis$1 = function () { return this; };

var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(1, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
  iterators[TO_STRING_TAG] = returnThis$1;
  return IteratorConstructor;
};

var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR$4 = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis$2 = function () { return this; };

var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR$4]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS$1 && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (IteratorPrototype$2 !== Object.prototype && CurrentIteratorPrototype.next) {
      if ( objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype$2) {
        if (objectSetPrototypeOf) {
          objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype$2);
        } else if (typeof CurrentIteratorPrototype[ITERATOR$4] != 'function') {
          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR$4, returnThis$2);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
    }
  }

  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    INCORRECT_VALUES_NAME = true;
    defaultIterator = function values() { return nativeIterator.call(this); };
  }

  // define iterator
  if ( IterablePrototype[ITERATOR$4] !== defaultIterator) {
    createNonEnumerableProperty(IterablePrototype, ITERATOR$4, defaultIterator);
  }
  iterators[NAME] = defaultIterator;

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        redefine(IterablePrototype, KEY, methods[KEY]);
      }
    } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME }, methods);
  }

  return methods;
};

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState$2 = internalState.set;
var getInternalState$2 = internalState.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.github.io/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.github.io/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.github.io/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.github.io/ecma262/#sec-createarrayiterator
var es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState$2(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState$2(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return { value: undefined, done: true };
  }
  if (kind == 'keys') return { value: index, done: false };
  if (kind == 'values') return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
// https://tc39.github.io/ecma262/#sec-createmappedargumentsobject
iterators.Arguments = iterators.Array;

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

var fromCharCode = String.fromCharCode;
var nativeFromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
var INCORRECT_LENGTH = !!nativeFromCodePoint && nativeFromCodePoint.length != 1;

// `String.fromCodePoint` method
// https://tc39.github.io/ecma262/#sec-string.fromcodepoint
_export({ target: 'String', stat: true, forced: INCORRECT_LENGTH }, {
  fromCodePoint: function fromCodePoint(x) { // eslint-disable-line no-unused-vars
    var elements = [];
    var length = arguments.length;
    var i = 0;
    var code;
    while (length > i) {
      code = +arguments[i++];
      if (toAbsoluteIndex(code, 0x10FFFF) !== code) throw RangeError(code + ' is not a valid code point');
      elements.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xD800, code % 0x400 + 0xDC00)
      );
    } return elements.join('');
  }
});

// `String.raw` method
// https://tc39.github.io/ecma262/#sec-string.raw
_export({ target: 'String', stat: true }, {
  raw: function raw(template) {
    var rawTemplate = toIndexedObject(template.raw);
    var literalSegments = toLength(rawTemplate.length);
    var argumentsLength = arguments.length;
    var elements = [];
    var i = 0;
    while (literalSegments > i) {
      elements.push(String(rawTemplate[i++]));
      if (i < argumentsLength) elements.push(String(arguments[i]));
    } return elements.join('');
  }
});

// `String.prototype.{ codePointAt, at }` methods implementation
var createMethod$4 = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = String(requireObjectCoercible($this));
    var position = toInteger(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = S.charCodeAt(position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING ? S.charAt(position) : first
        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

var stringMultibyte = {
  // `String.prototype.codePointAt` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod$4(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod$4(true)
};

var codeAt = stringMultibyte.codeAt;

// `String.prototype.codePointAt` method
// https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
_export({ target: 'String', proto: true }, {
  codePointAt: function codePointAt(pos) {
    return codeAt(this, pos);
  }
});

var MATCH = wellKnownSymbol('match');

// `IsRegExp` abstract operation
// https://tc39.github.io/ecma262/#sec-isregexp
var isRegexp = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
};

var notARegexp = function (it) {
  if (isRegexp(it)) {
    throw TypeError("The method doesn't accept regular expressions");
  } return it;
};

var MATCH$1 = wellKnownSymbol('match');

var correctIsRegexpLogic = function (METHOD_NAME) {
  var regexp = /./;
  try {
    '/./'[METHOD_NAME](regexp);
  } catch (e) {
    try {
      regexp[MATCH$1] = false;
      return '/./'[METHOD_NAME](regexp);
    } catch (f) { /* empty */ }
  } return false;
};

var getOwnPropertyDescriptor$5 = objectGetOwnPropertyDescriptor.f;






var nativeEndsWith = ''.endsWith;
var min$5 = Math.min;

var CORRECT_IS_REGEXP_LOGIC = correctIsRegexpLogic('endsWith');
// https://github.com/zloirock/core-js/pull/702
var MDN_POLYFILL_BUG =  !CORRECT_IS_REGEXP_LOGIC && !!function () {
  var descriptor = getOwnPropertyDescriptor$5(String.prototype, 'endsWith');
  return descriptor && !descriptor.writable;
}();

// `String.prototype.endsWith` method
// https://tc39.github.io/ecma262/#sec-string.prototype.endswith
_export({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
  endsWith: function endsWith(searchString /* , endPosition = @length */) {
    var that = String(requireObjectCoercible(this));
    notARegexp(searchString);
    var endPosition = arguments.length > 1 ? arguments[1] : undefined;
    var len = toLength(that.length);
    var end = endPosition === undefined ? len : min$5(toLength(endPosition), len);
    var search = String(searchString);
    return nativeEndsWith
      ? nativeEndsWith.call(that, search, end)
      : that.slice(end - search.length, end) === search;
  }
});

// `String.prototype.includes` method
// https://tc39.github.io/ecma262/#sec-string.prototype.includes
_export({ target: 'String', proto: true, forced: !correctIsRegexpLogic('includes') }, {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~String(requireObjectCoercible(this))
      .indexOf(notARegexp(searchString), arguments.length > 1 ? arguments[1] : undefined);
  }
});

// `RegExp.prototype.flags` getter implementation
// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
var regexpFlags = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

// babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
// so we use an intermediate function.
function RE(s, f) {
  return RegExp(s, f);
}

var UNSUPPORTED_Y = fails(function () {
  // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
  var re = RE('a', 'y');
  re.lastIndex = 2;
  return re.exec('abcd') != null;
});

var BROKEN_CARET = fails(function () {
  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
  var re = RE('^r', 'gy');
  re.lastIndex = 2;
  return re.exec('str') != null;
});

var regexpStickyHelpers = {
	UNSUPPORTED_Y: UNSUPPORTED_Y,
	BROKEN_CARET: BROKEN_CARET
};

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();

var UNSUPPORTED_Y$1 = regexpStickyHelpers.UNSUPPORTED_Y || regexpStickyHelpers.BROKEN_CARET;

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;
    var sticky = UNSUPPORTED_Y$1 && re.sticky;
    var flags = regexpFlags.call(re);
    var source = re.source;
    var charsAdded = 0;
    var strCopy = str;

    if (sticky) {
      flags = flags.replace('y', '');
      if (flags.indexOf('g') === -1) {
        flags += 'g';
      }

      strCopy = String(str).slice(re.lastIndex);
      // Support anchored sticky behavior.
      if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== '\n')) {
        source = '(?: ' + source + ')';
        strCopy = ' ' + strCopy;
        charsAdded++;
      }
      // ^(? + rx + ) is needed, in combination with some str slicing, to
      // simulate the 'y' flag.
      reCopy = new RegExp('^(?:' + source + ')', flags);
    }

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

    match = nativeExec.call(sticky ? reCopy : re, strCopy);

    if (sticky) {
      if (match) {
        match.input = match.input.slice(charsAdded);
        match[0] = match[0].slice(charsAdded);
        match.index = re.lastIndex;
        re.lastIndex += match[0].length;
      } else re.lastIndex = 0;
    } else if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

var regexpExec = patchedExec;

_export({ target: 'RegExp', proto: true, forced: /./.exec !== regexpExec }, {
  exec: regexpExec
});

// TODO: Remove from `core-js@4` since it's moved to entry points







var SPECIES$6 = wellKnownSymbol('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

// IE <= 11 replaces $0 with the whole match, as if it was $&
// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
var REPLACE_KEEPS_$0 = (function () {
  return 'a'.replace(/./, '$0') === '$0';
})();

var REPLACE = wellKnownSymbol('replace');
// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
  if (/./[REPLACE]) {
    return /./[REPLACE]('a', '$0') === '';
  }
  return false;
})();

// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
// Weex JS has frozen built-in prototypes, so use try / catch wrapper
var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
});

var fixRegexpWellKnownSymbolLogic = function (KEY, length, exec, sham) {
  var SYMBOL = wellKnownSymbol(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;

    if (KEY === 'split') {
      // We can't use real regex here since it causes deoptimization
      // and serious performance degradation in V8
      // https://github.com/zloirock/core-js/issues/306
      re = {};
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES$6] = function () { return re; };
      re.flags = '';
      re[SYMBOL] = /./[SYMBOL];
    }

    re.exec = function () { execCalled = true; return null; };

    re[SYMBOL]('');
    return !execCalled;
  });

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !(
      REPLACE_SUPPORTS_NAMED_GROUPS &&
      REPLACE_KEEPS_$0 &&
      !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
    )) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
      if (regexp.exec === regexpExec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          // The native String method already delegates to @@method (this
          // polyfilled function), leasing to infinite recursion.
          // We avoid it by directly calling the native @@method method.
          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
        }
        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
      }
      return { done: false };
    }, {
      REPLACE_KEEPS_$0: REPLACE_KEEPS_$0,
      REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
    });
    var stringMethod = methods[0];
    var regexMethod = methods[1];

    redefine(String.prototype, KEY, stringMethod);
    redefine(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return regexMethod.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return regexMethod.call(string, this); }
    );
  }

  if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], 'sham', true);
};

var charAt = stringMultibyte.charAt;

// `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
var advanceStringIndex = function (S, index, unicode) {
  return index + (unicode ? charAt(S, index).length : 1);
};

// `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
var regexpExecAbstract = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }

  if (classofRaw(R) !== 'RegExp') {
    throw TypeError('RegExp#exec called on incompatible receiver');
  }

  return regexpExec.call(R, S);
};

// @@match logic
fixRegexpWellKnownSymbolLogic('match', 1, function (MATCH, nativeMatch, maybeCallNative) {
  return [
    // `String.prototype.match` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = requireObjectCoercible(this);
      var matcher = regexp == undefined ? undefined : regexp[MATCH];
      return matcher !== undefined ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
    },
    // `RegExp.prototype[@@match]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
    function (regexp) {
      var res = maybeCallNative(nativeMatch, regexp, this);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);

      if (!rx.global) return regexpExecAbstract(rx, S);

      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;
      while ((result = regexpExecAbstract(rx, S)) !== null) {
        var matchStr = String(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        n++;
      }
      return n === 0 ? null : A;
    }
  ];
});

var MATCH_ALL = wellKnownSymbol('matchAll');
var REGEXP_STRING = 'RegExp String';
var REGEXP_STRING_ITERATOR = REGEXP_STRING + ' Iterator';
var setInternalState$3 = internalState.set;
var getInternalState$3 = internalState.getterFor(REGEXP_STRING_ITERATOR);
var RegExpPrototype = RegExp.prototype;
var regExpBuiltinExec = RegExpPrototype.exec;
var nativeMatchAll = ''.matchAll;

var WORKS_WITH_NON_GLOBAL_REGEX = !!nativeMatchAll && !fails(function () {
  'a'.matchAll(/./);
});

var regExpExec = function (R, S) {
  var exec = R.exec;
  var result;
  if (typeof exec == 'function') {
    result = exec.call(R, S);
    if (typeof result != 'object') throw TypeError('Incorrect exec result');
    return result;
  } return regExpBuiltinExec.call(R, S);
};

// eslint-disable-next-line max-len
var $RegExpStringIterator = createIteratorConstructor(function RegExpStringIterator(regexp, string, global, fullUnicode) {
  setInternalState$3(this, {
    type: REGEXP_STRING_ITERATOR,
    regexp: regexp,
    string: string,
    global: global,
    unicode: fullUnicode,
    done: false
  });
}, REGEXP_STRING, function next() {
  var state = getInternalState$3(this);
  if (state.done) return { value: undefined, done: true };
  var R = state.regexp;
  var S = state.string;
  var match = regExpExec(R, S);
  if (match === null) return { value: undefined, done: state.done = true };
  if (state.global) {
    if (String(match[0]) == '') R.lastIndex = advanceStringIndex(S, toLength(R.lastIndex), state.unicode);
    return { value: match, done: false };
  }
  state.done = true;
  return { value: match, done: false };
});

var $matchAll = function (string) {
  var R = anObject(this);
  var S = String(string);
  var C, flagsValue, flags, matcher, global, fullUnicode;
  C = speciesConstructor(R, RegExp);
  flagsValue = R.flags;
  if (flagsValue === undefined && R instanceof RegExp && !('flags' in RegExpPrototype)) {
    flagsValue = regexpFlags.call(R);
  }
  flags = flagsValue === undefined ? '' : String(flagsValue);
  matcher = new C(C === RegExp ? R.source : R, flags);
  global = !!~flags.indexOf('g');
  fullUnicode = !!~flags.indexOf('u');
  matcher.lastIndex = toLength(R.lastIndex);
  return new $RegExpStringIterator(matcher, S, global, fullUnicode);
};

// `String.prototype.matchAll` method
// https://github.com/tc39/proposal-string-matchall
_export({ target: 'String', proto: true, forced: WORKS_WITH_NON_GLOBAL_REGEX }, {
  matchAll: function matchAll(regexp) {
    var O = requireObjectCoercible(this);
    var flags, S, matcher, rx;
    if (regexp != null) {
      if (isRegexp(regexp)) {
        flags = String(requireObjectCoercible('flags' in RegExpPrototype
          ? regexp.flags
          : regexpFlags.call(regexp)
        ));
        if (!~flags.indexOf('g')) throw TypeError('`.matchAll` does not allow non-global regexes');
      }
      if (WORKS_WITH_NON_GLOBAL_REGEX) return nativeMatchAll.apply(O, arguments);
      matcher = regexp[MATCH_ALL];
      if (matcher === undefined && isPure && classofRaw(regexp) == 'RegExp') matcher = $matchAll;
      if (matcher != null) return aFunction$1(matcher).call(regexp, O);
    } else if (WORKS_WITH_NON_GLOBAL_REGEX) return nativeMatchAll.apply(O, arguments);
    S = String(O);
    rx = new RegExp(regexp, 'g');
    return  rx[MATCH_ALL](S);
  }
});

 MATCH_ALL in RegExpPrototype || createNonEnumerableProperty(RegExpPrototype, MATCH_ALL, $matchAll);

// `String.prototype.repeat` method implementation
// https://tc39.github.io/ecma262/#sec-string.prototype.repeat
var stringRepeat = ''.repeat || function repeat(count) {
  var str = String(requireObjectCoercible(this));
  var result = '';
  var n = toInteger(count);
  if (n < 0 || n == Infinity) throw RangeError('Wrong number of repetitions');
  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) result += str;
  return result;
};

// https://github.com/tc39/proposal-string-pad-start-end




var ceil$1 = Math.ceil;

// `String.prototype.{ padStart, padEnd }` methods implementation
var createMethod$5 = function (IS_END) {
  return function ($this, maxLength, fillString) {
    var S = String(requireObjectCoercible($this));
    var stringLength = S.length;
    var fillStr = fillString === undefined ? ' ' : String(fillString);
    var intMaxLength = toLength(maxLength);
    var fillLen, stringFiller;
    if (intMaxLength <= stringLength || fillStr == '') return S;
    fillLen = intMaxLength - stringLength;
    stringFiller = stringRepeat.call(fillStr, ceil$1(fillLen / fillStr.length));
    if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
    return IS_END ? S + stringFiller : stringFiller + S;
  };
};

var stringPad = {
  // `String.prototype.padStart` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.padstart
  start: createMethod$5(false),
  // `String.prototype.padEnd` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.padend
  end: createMethod$5(true)
};

// https://github.com/zloirock/core-js/issues/280


// eslint-disable-next-line unicorn/no-unsafe-regex
var stringPadWebkitBug = /Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(engineUserAgent);

var $padEnd = stringPad.end;


// `String.prototype.padEnd` method
// https://tc39.github.io/ecma262/#sec-string.prototype.padend
_export({ target: 'String', proto: true, forced: stringPadWebkitBug }, {
  padEnd: function padEnd(maxLength /* , fillString = ' ' */) {
    return $padEnd(this, maxLength, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var $padStart = stringPad.start;


// `String.prototype.padStart` method
// https://tc39.github.io/ecma262/#sec-string.prototype.padstart
_export({ target: 'String', proto: true, forced: stringPadWebkitBug }, {
  padStart: function padStart(maxLength /* , fillString = ' ' */) {
    return $padStart(this, maxLength, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// `String.prototype.repeat` method
// https://tc39.github.io/ecma262/#sec-string.prototype.repeat
_export({ target: 'String', proto: true }, {
  repeat: stringRepeat
});

var max$3 = Math.max;
var min$6 = Math.min;
var floor$1 = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
fixRegexpWellKnownSymbolLogic('replace', 2, function (REPLACE, nativeReplace, maybeCallNative, reason) {
  var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = reason.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE;
  var REPLACE_KEEPS_$0 = reason.REPLACE_KEEPS_$0;
  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

  return [
    // `String.prototype.replace` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = requireObjectCoercible(this);
      var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
      return replacer !== undefined
        ? replacer.call(searchValue, O, replaceValue)
        : nativeReplace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      if (
        (!REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE && REPLACE_KEEPS_$0) ||
        (typeof replaceValue === 'string' && replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1)
      ) {
        var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
        if (res.done) return res.value;
      }

      var rx = anObject(regexp);
      var S = String(this);

      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);

      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regexpExecAbstract(rx, S);
        if (result === null) break;

        results.push(result);
        if (!global) break;

        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }

      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];

        var matched = String(result[0]);
        var position = max$3(min$6(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];

  // https://tc39.github.io/ecma262/#sec-getsubstitution
  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return nativeReplace.call(replacement, symbols, function (match, ch) {
      var capture;
      switch (ch.charAt(0)) {
        case '$': return '$';
        case '&': return matched;
        case '`': return str.slice(0, position);
        case "'": return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default: // \d\d?
          var n = +ch;
          if (n === 0) return match;
          if (n > m) {
            var f = floor$1(n / 10);
            if (f === 0) return match;
            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
            return match;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  }
});

// @@search logic
fixRegexpWellKnownSymbolLogic('search', 1, function (SEARCH, nativeSearch, maybeCallNative) {
  return [
    // `String.prototype.search` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.search
    function search(regexp) {
      var O = requireObjectCoercible(this);
      var searcher = regexp == undefined ? undefined : regexp[SEARCH];
      return searcher !== undefined ? searcher.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
    },
    // `RegExp.prototype[@@search]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@search
    function (regexp) {
      var res = maybeCallNative(nativeSearch, regexp, this);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);

      var previousLastIndex = rx.lastIndex;
      if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
      var result = regexpExecAbstract(rx, S);
      if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
      return result === null ? -1 : result.index;
    }
  ];
});

var arrayPush = [].push;
var min$7 = Math.min;
var MAX_UINT32 = 0xFFFFFFFF;

// babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
var SUPPORTS_Y = !fails(function () { return !RegExp(MAX_UINT32, 'y'); });

// @@split logic
fixRegexpWellKnownSymbolLogic('split', 2, function (SPLIT, nativeSplit, maybeCallNative) {
  var internalSplit;
  if (
    'abbc'.split(/(b)*/)[1] == 'c' ||
    'test'.split(/(?:)/, -1).length != 4 ||
    'ab'.split(/(?:ab)*/).length != 2 ||
    '.'.split(/(.?)(.?)/).length != 4 ||
    '.'.split(/()()/).length > 1 ||
    ''.split(/.?/).length
  ) {
    // based on es5-shim implementation, need to rework it
    internalSplit = function (separator, limit) {
      var string = String(requireObjectCoercible(this));
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (separator === undefined) return [string];
      // If `separator` is not a regex, use native split
      if (!isRegexp(separator)) {
        return nativeSplit.call(string, separator, lim);
      }
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var match, lastIndex, lastLength;
      while (match = regexpExec.call(separatorCopy, string)) {
        lastIndex = separatorCopy.lastIndex;
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1));
          lastLength = match[0].length;
          lastLastIndex = lastIndex;
          if (output.length >= lim) break;
        }
        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
      }
      if (lastLastIndex === string.length) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output.length > lim ? output.slice(0, lim) : output;
    };
  // Chakra, V8
  } else if ('0'.split(undefined, 0).length) {
    internalSplit = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
    };
  } else internalSplit = nativeSplit;

  return [
    // `String.prototype.split` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.split
    function split(separator, limit) {
      var O = requireObjectCoercible(this);
      var splitter = separator == undefined ? undefined : separator[SPLIT];
      return splitter !== undefined
        ? splitter.call(separator, O, limit)
        : internalSplit.call(String(O), separator, limit);
    },
    // `RegExp.prototype[@@split]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
    //
    // NOTE: This cannot be properly polyfilled in engines that don't support
    // the 'y' flag.
    function (regexp, limit) {
      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== nativeSplit);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var C = speciesConstructor(rx, RegExp);

      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? 'i' : '') +
                  (rx.multiline ? 'm' : '') +
                  (rx.unicode ? 'u' : '') +
                  (SUPPORTS_Y ? 'y' : 'g');

      // ^(? + rx + ) is needed, in combination with some S slicing, to
      // simulate the 'y' flag.
      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0) return regexpExecAbstract(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];
      while (q < S.length) {
        splitter.lastIndex = SUPPORTS_Y ? q : 0;
        var z = regexpExecAbstract(splitter, SUPPORTS_Y ? S : S.slice(q));
        var e;
        if (
          z === null ||
          (e = min$7(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
        ) {
          q = advanceStringIndex(S, q, unicodeMatching);
        } else {
          A.push(S.slice(p, q));
          if (A.length === lim) return A;
          for (var i = 1; i <= z.length - 1; i++) {
            A.push(z[i]);
            if (A.length === lim) return A;
          }
          q = p = e;
        }
      }
      A.push(S.slice(p));
      return A;
    }
  ];
}, !SUPPORTS_Y);

var getOwnPropertyDescriptor$6 = objectGetOwnPropertyDescriptor.f;






var nativeStartsWith = ''.startsWith;
var min$8 = Math.min;

var CORRECT_IS_REGEXP_LOGIC$1 = correctIsRegexpLogic('startsWith');
// https://github.com/zloirock/core-js/pull/702
var MDN_POLYFILL_BUG$1 =  !CORRECT_IS_REGEXP_LOGIC$1 && !!function () {
  var descriptor = getOwnPropertyDescriptor$6(String.prototype, 'startsWith');
  return descriptor && !descriptor.writable;
}();

// `String.prototype.startsWith` method
// https://tc39.github.io/ecma262/#sec-string.prototype.startswith
_export({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG$1 && !CORRECT_IS_REGEXP_LOGIC$1 }, {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = String(requireObjectCoercible(this));
    notARegexp(searchString);
    var index = toLength(min$8(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = String(searchString);
    return nativeStartsWith
      ? nativeStartsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});

// a string of all valid unicode whitespaces
// eslint-disable-next-line max-len
var whitespaces = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

var whitespace = '[' + whitespaces + ']';
var ltrim = RegExp('^' + whitespace + whitespace + '*');
var rtrim = RegExp(whitespace + whitespace + '*$');

// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
var createMethod$6 = function (TYPE) {
  return function ($this) {
    var string = String(requireObjectCoercible($this));
    if (TYPE & 1) string = string.replace(ltrim, '');
    if (TYPE & 2) string = string.replace(rtrim, '');
    return string;
  };
};

var stringTrim = {
  // `String.prototype.{ trimLeft, trimStart }` methods
  // https://tc39.github.io/ecma262/#sec-string.prototype.trimstart
  start: createMethod$6(1),
  // `String.prototype.{ trimRight, trimEnd }` methods
  // https://tc39.github.io/ecma262/#sec-string.prototype.trimend
  end: createMethod$6(2),
  // `String.prototype.trim` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.trim
  trim: createMethod$6(3)
};

var non = '\u200B\u0085\u180E';

// check that a method works with the correct list
// of whitespaces and has a correct name
var stringTrimForced = function (METHOD_NAME) {
  return fails(function () {
    return !!whitespaces[METHOD_NAME]() || non[METHOD_NAME]() != non || whitespaces[METHOD_NAME].name !== METHOD_NAME;
  });
};

var $trim = stringTrim.trim;


// `String.prototype.trim` method
// https://tc39.github.io/ecma262/#sec-string.prototype.trim
_export({ target: 'String', proto: true, forced: stringTrimForced('trim') }, {
  trim: function trim() {
    return $trim(this);
  }
});

var $trimStart = stringTrim.start;


var FORCED$5 = stringTrimForced('trimStart');

var trimStart = FORCED$5 ? function trimStart() {
  return $trimStart(this);
} : ''.trimStart;

// `String.prototype.{ trimStart, trimLeft }` methods
// https://github.com/tc39/ecmascript-string-left-right-trim
_export({ target: 'String', proto: true, forced: FORCED$5 }, {
  trimStart: trimStart,
  trimLeft: trimStart
});

var $trimEnd = stringTrim.end;


var FORCED$6 = stringTrimForced('trimEnd');

var trimEnd = FORCED$6 ? function trimEnd() {
  return $trimEnd(this);
} : ''.trimEnd;

// `String.prototype.{ trimEnd, trimRight }` methods
// https://github.com/tc39/ecmascript-string-left-right-trim
_export({ target: 'String', proto: true, forced: FORCED$6 }, {
  trimEnd: trimEnd,
  trimRight: trimEnd
});

var charAt$1 = stringMultibyte.charAt;



var STRING_ITERATOR = 'String Iterator';
var setInternalState$4 = internalState.set;
var getInternalState$4 = internalState.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState$4(this, {
    type: STRING_ITERATOR,
    string: String(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState$4(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = charAt$1(string, index);
  state.index += point.length;
  return { value: point, done: false };
});

var quot = /"/g;

// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
// https://tc39.github.io/ecma262/#sec-createhtml
var createHtml = function (string, tag, attribute, value) {
  var S = String(requireObjectCoercible(string));
  var p1 = '<' + tag;
  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};

// check the existence of a method, lowercase
// of a tag and escaping quotes in arguments
var stringHtmlForced = function (METHOD_NAME) {
  return fails(function () {
    var test = ''[METHOD_NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  });
};

// `String.prototype.anchor` method
// https://tc39.github.io/ecma262/#sec-string.prototype.anchor
_export({ target: 'String', proto: true, forced: stringHtmlForced('anchor') }, {
  anchor: function anchor(name) {
    return createHtml(this, 'a', 'name', name);
  }
});

// `String.prototype.big` method
// https://tc39.github.io/ecma262/#sec-string.prototype.big
_export({ target: 'String', proto: true, forced: stringHtmlForced('big') }, {
  big: function big() {
    return createHtml(this, 'big', '', '');
  }
});

// `String.prototype.blink` method
// https://tc39.github.io/ecma262/#sec-string.prototype.blink
_export({ target: 'String', proto: true, forced: stringHtmlForced('blink') }, {
  blink: function blink() {
    return createHtml(this, 'blink', '', '');
  }
});

// `String.prototype.bold` method
// https://tc39.github.io/ecma262/#sec-string.prototype.bold
_export({ target: 'String', proto: true, forced: stringHtmlForced('bold') }, {
  bold: function bold() {
    return createHtml(this, 'b', '', '');
  }
});

// `String.prototype.fixed` method
// https://tc39.github.io/ecma262/#sec-string.prototype.fixed
_export({ target: 'String', proto: true, forced: stringHtmlForced('fixed') }, {
  fixed: function fixed() {
    return createHtml(this, 'tt', '', '');
  }
});

// `String.prototype.fontcolor` method
// https://tc39.github.io/ecma262/#sec-string.prototype.fontcolor
_export({ target: 'String', proto: true, forced: stringHtmlForced('fontcolor') }, {
  fontcolor: function fontcolor(color) {
    return createHtml(this, 'font', 'color', color);
  }
});

// `String.prototype.fontsize` method
// https://tc39.github.io/ecma262/#sec-string.prototype.fontsize
_export({ target: 'String', proto: true, forced: stringHtmlForced('fontsize') }, {
  fontsize: function fontsize(size) {
    return createHtml(this, 'font', 'size', size);
  }
});

// `String.prototype.italics` method
// https://tc39.github.io/ecma262/#sec-string.prototype.italics
_export({ target: 'String', proto: true, forced: stringHtmlForced('italics') }, {
  italics: function italics() {
    return createHtml(this, 'i', '', '');
  }
});

// `String.prototype.link` method
// https://tc39.github.io/ecma262/#sec-string.prototype.link
_export({ target: 'String', proto: true, forced: stringHtmlForced('link') }, {
  link: function link(url) {
    return createHtml(this, 'a', 'href', url);
  }
});

// `String.prototype.small` method
// https://tc39.github.io/ecma262/#sec-string.prototype.small
_export({ target: 'String', proto: true, forced: stringHtmlForced('small') }, {
  small: function small() {
    return createHtml(this, 'small', '', '');
  }
});

// `String.prototype.strike` method
// https://tc39.github.io/ecma262/#sec-string.prototype.strike
_export({ target: 'String', proto: true, forced: stringHtmlForced('strike') }, {
  strike: function strike() {
    return createHtml(this, 'strike', '', '');
  }
});

// `String.prototype.sub` method
// https://tc39.github.io/ecma262/#sec-string.prototype.sub
_export({ target: 'String', proto: true, forced: stringHtmlForced('sub') }, {
  sub: function sub() {
    return createHtml(this, 'sub', '', '');
  }
});

// `String.prototype.sup` method
// https://tc39.github.io/ecma262/#sec-string.prototype.sup
_export({ target: 'String', proto: true, forced: stringHtmlForced('sup') }, {
  sup: function sup() {
    return createHtml(this, 'sup', '', '');
  }
});

// makes subclassing work correct for wrapped built-ins
var inheritIfRequired = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    // it can work only with native `setPrototypeOf`
    objectSetPrototypeOf &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    typeof (NewTarget = dummy.constructor) == 'function' &&
    NewTarget !== Wrapper &&
    isObject(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) objectSetPrototypeOf($this, NewTargetPrototype);
  return $this;
};

var defineProperty$6 = objectDefineProperty.f;
var getOwnPropertyNames = objectGetOwnPropertyNames.f;





var setInternalState$5 = internalState.set;



var MATCH$2 = wellKnownSymbol('match');
var NativeRegExp = global_1.RegExp;
var RegExpPrototype$1 = NativeRegExp.prototype;
var re1 = /a/g;
var re2 = /a/g;

// "new" should create a new object, old webkit bug
var CORRECT_NEW = new NativeRegExp(re1) !== re1;

var UNSUPPORTED_Y$2 = regexpStickyHelpers.UNSUPPORTED_Y;

var FORCED$7 = descriptors && isForced_1('RegExp', (!CORRECT_NEW || UNSUPPORTED_Y$2 || fails(function () {
  re2[MATCH$2] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, 'i') != '/a/i';
})));

// `RegExp` constructor
// https://tc39.github.io/ecma262/#sec-regexp-constructor
if (FORCED$7) {
  var RegExpWrapper = function RegExp(pattern, flags) {
    var thisIsRegExp = this instanceof RegExpWrapper;
    var patternIsRegExp = isRegexp(pattern);
    var flagsAreUndefined = flags === undefined;
    var sticky;

    if (!thisIsRegExp && patternIsRegExp && pattern.constructor === RegExpWrapper && flagsAreUndefined) {
      return pattern;
    }

    if (CORRECT_NEW) {
      if (patternIsRegExp && !flagsAreUndefined) pattern = pattern.source;
    } else if (pattern instanceof RegExpWrapper) {
      if (flagsAreUndefined) flags = regexpFlags.call(pattern);
      pattern = pattern.source;
    }

    if (UNSUPPORTED_Y$2) {
      sticky = !!flags && flags.indexOf('y') > -1;
      if (sticky) flags = flags.replace(/y/g, '');
    }

    var result = inheritIfRequired(
      CORRECT_NEW ? new NativeRegExp(pattern, flags) : NativeRegExp(pattern, flags),
      thisIsRegExp ? this : RegExpPrototype$1,
      RegExpWrapper
    );

    if (UNSUPPORTED_Y$2 && sticky) setInternalState$5(result, { sticky: sticky });

    return result;
  };
  var proxy = function (key) {
    key in RegExpWrapper || defineProperty$6(RegExpWrapper, key, {
      configurable: true,
      get: function () { return NativeRegExp[key]; },
      set: function (it) { NativeRegExp[key] = it; }
    });
  };
  var keys$1 = getOwnPropertyNames(NativeRegExp);
  var index = 0;
  while (keys$1.length > index) proxy(keys$1[index++]);
  RegExpPrototype$1.constructor = RegExpWrapper;
  RegExpWrapper.prototype = RegExpPrototype$1;
  redefine(global_1, 'RegExp', RegExpWrapper);
}

// https://tc39.github.io/ecma262/#sec-get-regexp-@@species
setSpecies('RegExp');

var UNSUPPORTED_Y$3 = regexpStickyHelpers.UNSUPPORTED_Y;

// `RegExp.prototype.flags` getter
// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
if (descriptors && (/./g.flags != 'g' || UNSUPPORTED_Y$3)) {
  objectDefineProperty.f(RegExp.prototype, 'flags', {
    configurable: true,
    get: regexpFlags
  });
}

var UNSUPPORTED_Y$4 = regexpStickyHelpers.UNSUPPORTED_Y;
var defineProperty$7 = objectDefineProperty.f;
var getInternalState$5 = internalState.get;
var RegExpPrototype$2 = RegExp.prototype;

// `RegExp.prototype.sticky` getter
if (descriptors && UNSUPPORTED_Y$4) {
  defineProperty$7(RegExp.prototype, 'sticky', {
    configurable: true,
    get: function () {
      if (this === RegExpPrototype$2) return undefined;
      // We can't use InternalStateModule.getterFor because
      // we don't add metadata for regexps created by a literal.
      if (this instanceof RegExp) {
        return !!getInternalState$5(this).sticky;
      }
      throw TypeError('Incompatible receiver, RegExp required');
    }
  });
}

// TODO: Remove from `core-js@4` since it's moved to entry points




var DELEGATES_TO_EXEC = function () {
  var execCalled = false;
  var re = /[ac]/;
  re.exec = function () {
    execCalled = true;
    return /./.exec.apply(this, arguments);
  };
  return re.test('abc') === true && execCalled;
}();

var nativeTest = /./.test;

_export({ target: 'RegExp', proto: true, forced: !DELEGATES_TO_EXEC }, {
  test: function (str) {
    if (typeof this.exec !== 'function') {
      return nativeTest.call(this, str);
    }
    var result = this.exec(str);
    if (result !== null && !isObject(result)) {
      throw new Error('RegExp exec method returned something other than an Object or null');
    }
    return !!result;
  }
});

var TO_STRING = 'toString';
var RegExpPrototype$3 = RegExp.prototype;
var nativeToString = RegExpPrototype$3[TO_STRING];

var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
// FF44- RegExp#toString has a wrong name
var INCORRECT_NAME = nativeToString.name != TO_STRING;

// `RegExp.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring
if (NOT_GENERIC || INCORRECT_NAME) {
  redefine(RegExp.prototype, TO_STRING, function toString() {
    var R = anObject(this);
    var p = String(R.source);
    var rf = R.flags;
    var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype$3) ? regexpFlags.call(R) : rf);
    return '/' + p + '/' + f;
  }, { unsafe: true });
}

var trim = stringTrim.trim;


var $parseInt = global_1.parseInt;
var hex = /^[+-]?0[Xx]/;
var FORCED$8 = $parseInt(whitespaces + '08') !== 8 || $parseInt(whitespaces + '0x16') !== 22;

// `parseInt` method
// https://tc39.github.io/ecma262/#sec-parseint-string-radix
var numberParseInt = FORCED$8 ? function parseInt(string, radix) {
  var S = trim(String(string));
  return $parseInt(S, (radix >>> 0) || (hex.test(S) ? 16 : 10));
} : $parseInt;

// `parseInt` method
// https://tc39.github.io/ecma262/#sec-parseint-string-radix
_export({ global: true, forced: parseInt != numberParseInt }, {
  parseInt: numberParseInt
});

var trim$1 = stringTrim.trim;


var $parseFloat = global_1.parseFloat;
var FORCED$9 = 1 / $parseFloat(whitespaces + '-0') !== -Infinity;

// `parseFloat` method
// https://tc39.github.io/ecma262/#sec-parsefloat-string
var numberParseFloat = FORCED$9 ? function parseFloat(string) {
  var trimmedString = trim$1(String(string));
  var result = $parseFloat(trimmedString);
  return result === 0 && trimmedString.charAt(0) == '-' ? -0 : result;
} : $parseFloat;

// `parseFloat` method
// https://tc39.github.io/ecma262/#sec-parsefloat-string
_export({ global: true, forced: parseFloat != numberParseFloat }, {
  parseFloat: numberParseFloat
});

var getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;
var getOwnPropertyDescriptor$7 = objectGetOwnPropertyDescriptor.f;
var defineProperty$8 = objectDefineProperty.f;
var trim$2 = stringTrim.trim;

var NUMBER = 'Number';
var NativeNumber = global_1[NUMBER];
var NumberPrototype = NativeNumber.prototype;

// Opera ~12 has broken Object#toString
var BROKEN_CLASSOF = classofRaw(objectCreate(NumberPrototype)) == NUMBER;

// `ToNumber` abstract operation
// https://tc39.github.io/ecma262/#sec-tonumber
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  var first, third, radix, maxCode, digits, length, index, code;
  if (typeof it == 'string' && it.length > 2) {
    it = trim$2(it);
    first = it.charCodeAt(0);
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal of /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal of /^0o[0-7]+$/i
        default: return +it;
      }
      digits = it.slice(2);
      length = digits.length;
      for (index = 0; index < length; index++) {
        code = digits.charCodeAt(index);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

// `Number` constructor
// https://tc39.github.io/ecma262/#sec-number-constructor
if (isForced_1(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
  var NumberWrapper = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var dummy = this;
    return dummy instanceof NumberWrapper
      // check on 1..constructor(foo) case
      && (BROKEN_CLASSOF ? fails(function () { NumberPrototype.valueOf.call(dummy); }) : classofRaw(dummy) != NUMBER)
        ? inheritIfRequired(new NativeNumber(toNumber(it)), dummy, NumberWrapper) : toNumber(it);
  };
  for (var keys$2 = descriptors ? getOwnPropertyNames$1(NativeNumber) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES2015 (in case, if modules with ES2015 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys$2.length > j; j++) {
    if (has(NativeNumber, key = keys$2[j]) && !has(NumberWrapper, key)) {
      defineProperty$8(NumberWrapper, key, getOwnPropertyDescriptor$7(NativeNumber, key));
    }
  }
  NumberWrapper.prototype = NumberPrototype;
  NumberPrototype.constructor = NumberWrapper;
  redefine(global_1, NUMBER, NumberWrapper);
}

// `Number.EPSILON` constant
// https://tc39.github.io/ecma262/#sec-number.epsilon
_export({ target: 'Number', stat: true }, {
  EPSILON: Math.pow(2, -52)
});

var globalIsFinite = global_1.isFinite;

// `Number.isFinite` method
// https://tc39.github.io/ecma262/#sec-number.isfinite
var numberIsFinite = Number.isFinite || function isFinite(it) {
  return typeof it == 'number' && globalIsFinite(it);
};

// `Number.isFinite` method
// https://tc39.github.io/ecma262/#sec-number.isfinite
_export({ target: 'Number', stat: true }, { isFinite: numberIsFinite });

var floor$2 = Math.floor;

// `Number.isInteger` method implementation
// https://tc39.github.io/ecma262/#sec-number.isinteger
var isInteger = function isInteger(it) {
  return !isObject(it) && isFinite(it) && floor$2(it) === it;
};

// `Number.isInteger` method
// https://tc39.github.io/ecma262/#sec-number.isinteger
_export({ target: 'Number', stat: true }, {
  isInteger: isInteger
});

// `Number.isNaN` method
// https://tc39.github.io/ecma262/#sec-number.isnan
_export({ target: 'Number', stat: true }, {
  isNaN: function isNaN(number) {
    // eslint-disable-next-line no-self-compare
    return number != number;
  }
});

var abs = Math.abs;

// `Number.isSafeInteger` method
// https://tc39.github.io/ecma262/#sec-number.issafeinteger
_export({ target: 'Number', stat: true }, {
  isSafeInteger: function isSafeInteger(number) {
    return isInteger(number) && abs(number) <= 0x1FFFFFFFFFFFFF;
  }
});

// `Number.MAX_SAFE_INTEGER` constant
// https://tc39.github.io/ecma262/#sec-number.max_safe_integer
_export({ target: 'Number', stat: true }, {
  MAX_SAFE_INTEGER: 0x1FFFFFFFFFFFFF
});

// `Number.MIN_SAFE_INTEGER` constant
// https://tc39.github.io/ecma262/#sec-number.min_safe_integer
_export({ target: 'Number', stat: true }, {
  MIN_SAFE_INTEGER: -0x1FFFFFFFFFFFFF
});

// `Number.parseFloat` method
// https://tc39.github.io/ecma262/#sec-number.parseFloat
_export({ target: 'Number', stat: true, forced: Number.parseFloat != numberParseFloat }, {
  parseFloat: numberParseFloat
});

// `Number.parseInt` method
// https://tc39.github.io/ecma262/#sec-number.parseint
_export({ target: 'Number', stat: true, forced: Number.parseInt != numberParseInt }, {
  parseInt: numberParseInt
});

// `thisNumberValue` abstract operation
// https://tc39.github.io/ecma262/#sec-thisnumbervalue
var thisNumberValue = function (value) {
  if (typeof value != 'number' && classofRaw(value) != 'Number') {
    throw TypeError('Incorrect invocation');
  }
  return +value;
};

var nativeToFixed = 1.0.toFixed;
var floor$3 = Math.floor;

var pow = function (x, n, acc) {
  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
};

var log = function (x) {
  var n = 0;
  var x2 = x;
  while (x2 >= 4096) {
    n += 12;
    x2 /= 4096;
  }
  while (x2 >= 2) {
    n += 1;
    x2 /= 2;
  } return n;
};

var FORCED$a = nativeToFixed && (
  0.00008.toFixed(3) !== '0.000' ||
  0.9.toFixed(0) !== '1' ||
  1.255.toFixed(2) !== '1.25' ||
  1000000000000000128.0.toFixed(0) !== '1000000000000000128'
) || !fails(function () {
  // V8 ~ Android 4.3-
  nativeToFixed.call({});
});

// `Number.prototype.toFixed` method
// https://tc39.github.io/ecma262/#sec-number.prototype.tofixed
_export({ target: 'Number', proto: true, forced: FORCED$a }, {
  // eslint-disable-next-line max-statements
  toFixed: function toFixed(fractionDigits) {
    var number = thisNumberValue(this);
    var fractDigits = toInteger(fractionDigits);
    var data = [0, 0, 0, 0, 0, 0];
    var sign = '';
    var result = '0';
    var e, z, j, k;

    var multiply = function (n, c) {
      var index = -1;
      var c2 = c;
      while (++index < 6) {
        c2 += n * data[index];
        data[index] = c2 % 1e7;
        c2 = floor$3(c2 / 1e7);
      }
    };

    var divide = function (n) {
      var index = 6;
      var c = 0;
      while (--index >= 0) {
        c += data[index];
        data[index] = floor$3(c / n);
        c = (c % n) * 1e7;
      }
    };

    var dataToString = function () {
      var index = 6;
      var s = '';
      while (--index >= 0) {
        if (s !== '' || index === 0 || data[index] !== 0) {
          var t = String(data[index]);
          s = s === '' ? t : s + stringRepeat.call('0', 7 - t.length) + t;
        }
      } return s;
    };

    if (fractDigits < 0 || fractDigits > 20) throw RangeError('Incorrect fraction digits');
    // eslint-disable-next-line no-self-compare
    if (number != number) return 'NaN';
    if (number <= -1e21 || number >= 1e21) return String(number);
    if (number < 0) {
      sign = '-';
      number = -number;
    }
    if (number > 1e-21) {
      e = log(number * pow(2, 69, 1)) - 69;
      z = e < 0 ? number * pow(2, -e, 1) : number / pow(2, e, 1);
      z *= 0x10000000000000;
      e = 52 - e;
      if (e > 0) {
        multiply(0, z);
        j = fractDigits;
        while (j >= 7) {
          multiply(1e7, 0);
          j -= 7;
        }
        multiply(pow(10, j, 1), 0);
        j = e - 1;
        while (j >= 23) {
          divide(1 << 23);
          j -= 23;
        }
        divide(1 << j);
        multiply(1, 1);
        divide(2);
        result = dataToString();
      } else {
        multiply(0, z);
        multiply(1 << -e, 0);
        result = dataToString() + stringRepeat.call('0', fractDigits);
      }
    }
    if (fractDigits > 0) {
      k = result.length;
      result = sign + (k <= fractDigits
        ? '0.' + stringRepeat.call('0', fractDigits - k) + result
        : result.slice(0, k - fractDigits) + '.' + result.slice(k - fractDigits));
    } else {
      result = sign + result;
    } return result;
  }
});

var nativeToPrecision = 1.0.toPrecision;

var FORCED$b = fails(function () {
  // IE7-
  return nativeToPrecision.call(1, undefined) !== '1';
}) || !fails(function () {
  // V8 ~ Android 4.3-
  nativeToPrecision.call({});
});

// `Number.prototype.toPrecision` method
// https://tc39.github.io/ecma262/#sec-number.prototype.toprecision
_export({ target: 'Number', proto: true, forced: FORCED$b }, {
  toPrecision: function toPrecision(precision) {
    return precision === undefined
      ? nativeToPrecision.call(thisNumberValue(this))
      : nativeToPrecision.call(thisNumberValue(this), precision);
  }
});

var log$1 = Math.log;

// `Math.log1p` method implementation
// https://tc39.github.io/ecma262/#sec-math.log1p
var mathLog1p = Math.log1p || function log1p(x) {
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : log$1(1 + x);
};

var nativeAcosh = Math.acosh;
var log$2 = Math.log;
var sqrt = Math.sqrt;
var LN2 = Math.LN2;

var FORCED$c = !nativeAcosh
  // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
  || Math.floor(nativeAcosh(Number.MAX_VALUE)) != 710
  // Tor Browser bug: Math.acosh(Infinity) -> NaN
  || nativeAcosh(Infinity) != Infinity;

// `Math.acosh` method
// https://tc39.github.io/ecma262/#sec-math.acosh
_export({ target: 'Math', stat: true, forced: FORCED$c }, {
  acosh: function acosh(x) {
    return (x = +x) < 1 ? NaN : x > 94906265.62425156
      ? log$2(x) + LN2
      : mathLog1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});

var nativeAsinh = Math.asinh;
var log$3 = Math.log;
var sqrt$1 = Math.sqrt;

function asinh(x) {
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : log$3(x + sqrt$1(x * x + 1));
}

// `Math.asinh` method
// https://tc39.github.io/ecma262/#sec-math.asinh
// Tor Browser bug: Math.asinh(0) -> -0
_export({ target: 'Math', stat: true, forced: !(nativeAsinh && 1 / nativeAsinh(0) > 0) }, {
  asinh: asinh
});

var nativeAtanh = Math.atanh;
var log$4 = Math.log;

// `Math.atanh` method
// https://tc39.github.io/ecma262/#sec-math.atanh
// Tor Browser bug: Math.atanh(-0) -> 0
_export({ target: 'Math', stat: true, forced: !(nativeAtanh && 1 / nativeAtanh(-0) < 0) }, {
  atanh: function atanh(x) {
    return (x = +x) == 0 ? x : log$4((1 + x) / (1 - x)) / 2;
  }
});

// `Math.sign` method implementation
// https://tc39.github.io/ecma262/#sec-math.sign
var mathSign = Math.sign || function sign(x) {
  // eslint-disable-next-line no-self-compare
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};

var abs$1 = Math.abs;
var pow$1 = Math.pow;

// `Math.cbrt` method
// https://tc39.github.io/ecma262/#sec-math.cbrt
_export({ target: 'Math', stat: true }, {
  cbrt: function cbrt(x) {
    return mathSign(x = +x) * pow$1(abs$1(x), 1 / 3);
  }
});

var floor$4 = Math.floor;
var log$5 = Math.log;
var LOG2E = Math.LOG2E;

// `Math.clz32` method
// https://tc39.github.io/ecma262/#sec-math.clz32
_export({ target: 'Math', stat: true }, {
  clz32: function clz32(x) {
    return (x >>>= 0) ? 31 - floor$4(log$5(x + 0.5) * LOG2E) : 32;
  }
});

var nativeExpm1 = Math.expm1;
var exp = Math.exp;

// `Math.expm1` method implementation
// https://tc39.github.io/ecma262/#sec-math.expm1
var mathExpm1 = (!nativeExpm1
  // Old FF bug
  || nativeExpm1(10) > 22025.465794806719 || nativeExpm1(10) < 22025.4657948067165168
  // Tor Browser bug
  || nativeExpm1(-2e-17) != -2e-17
) ? function expm1(x) {
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : exp(x) - 1;
} : nativeExpm1;

var nativeCosh = Math.cosh;
var abs$2 = Math.abs;
var E = Math.E;

// `Math.cosh` method
// https://tc39.github.io/ecma262/#sec-math.cosh
_export({ target: 'Math', stat: true, forced: !nativeCosh || nativeCosh(710) === Infinity }, {
  cosh: function cosh(x) {
    var t = mathExpm1(abs$2(x) - 1) + 1;
    return (t + 1 / (t * E * E)) * (E / 2);
  }
});

// `Math.expm1` method
// https://tc39.github.io/ecma262/#sec-math.expm1
_export({ target: 'Math', stat: true, forced: mathExpm1 != Math.expm1 }, { expm1: mathExpm1 });

var abs$3 = Math.abs;
var pow$2 = Math.pow;
var EPSILON = pow$2(2, -52);
var EPSILON32 = pow$2(2, -23);
var MAX32 = pow$2(2, 127) * (2 - EPSILON32);
var MIN32 = pow$2(2, -126);

var roundTiesToEven = function (n) {
  return n + 1 / EPSILON - 1 / EPSILON;
};

// `Math.fround` method implementation
// https://tc39.github.io/ecma262/#sec-math.fround
var mathFround = Math.fround || function fround(x) {
  var $abs = abs$3(x);
  var $sign = mathSign(x);
  var a, result;
  if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
  a = (1 + EPSILON32 / EPSILON) * $abs;
  result = a - (a - $abs);
  // eslint-disable-next-line no-self-compare
  if (result > MAX32 || result != result) return $sign * Infinity;
  return $sign * result;
};

// `Math.fround` method
// https://tc39.github.io/ecma262/#sec-math.fround
_export({ target: 'Math', stat: true }, { fround: mathFround });

var $hypot = Math.hypot;
var abs$4 = Math.abs;
var sqrt$2 = Math.sqrt;

// Chrome 77 bug
// https://bugs.chromium.org/p/v8/issues/detail?id=9546
var BUGGY = !!$hypot && $hypot(Infinity, NaN) !== Infinity;

// `Math.hypot` method
// https://tc39.github.io/ecma262/#sec-math.hypot
_export({ target: 'Math', stat: true, forced: BUGGY }, {
  hypot: function hypot(value1, value2) { // eslint-disable-line no-unused-vars
    var sum = 0;
    var i = 0;
    var aLen = arguments.length;
    var larg = 0;
    var arg, div;
    while (i < aLen) {
      arg = abs$4(arguments[i++]);
      if (larg < arg) {
        div = larg / arg;
        sum = sum * div * div + 1;
        larg = arg;
      } else if (arg > 0) {
        div = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * sqrt$2(sum);
  }
});

var nativeImul = Math.imul;

var FORCED$d = fails(function () {
  return nativeImul(0xFFFFFFFF, 5) != -5 || nativeImul.length != 2;
});

// `Math.imul` method
// https://tc39.github.io/ecma262/#sec-math.imul
// some WebKit versions fails with big numbers, some has wrong arity
_export({ target: 'Math', stat: true, forced: FORCED$d }, {
  imul: function imul(x, y) {
    var UINT16 = 0xFFFF;
    var xn = +x;
    var yn = +y;
    var xl = UINT16 & xn;
    var yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});

var log$6 = Math.log;
var LOG10E = Math.LOG10E;

// `Math.log10` method
// https://tc39.github.io/ecma262/#sec-math.log10
_export({ target: 'Math', stat: true }, {
  log10: function log10(x) {
    return log$6(x) * LOG10E;
  }
});

// `Math.log1p` method
// https://tc39.github.io/ecma262/#sec-math.log1p
_export({ target: 'Math', stat: true }, { log1p: mathLog1p });

var log$7 = Math.log;
var LN2$1 = Math.LN2;

// `Math.log2` method
// https://tc39.github.io/ecma262/#sec-math.log2
_export({ target: 'Math', stat: true }, {
  log2: function log2(x) {
    return log$7(x) / LN2$1;
  }
});

// `Math.sign` method
// https://tc39.github.io/ecma262/#sec-math.sign
_export({ target: 'Math', stat: true }, {
  sign: mathSign
});

var abs$5 = Math.abs;
var exp$1 = Math.exp;
var E$1 = Math.E;

var FORCED$e = fails(function () {
  return Math.sinh(-2e-17) != -2e-17;
});

// `Math.sinh` method
// https://tc39.github.io/ecma262/#sec-math.sinh
// V8 near Chromium 38 has a problem with very small numbers
_export({ target: 'Math', stat: true, forced: FORCED$e }, {
  sinh: function sinh(x) {
    return abs$5(x = +x) < 1 ? (mathExpm1(x) - mathExpm1(-x)) / 2 : (exp$1(x - 1) - exp$1(-x - 1)) * (E$1 / 2);
  }
});

var exp$2 = Math.exp;

// `Math.tanh` method
// https://tc39.github.io/ecma262/#sec-math.tanh
_export({ target: 'Math', stat: true }, {
  tanh: function tanh(x) {
    var a = mathExpm1(x = +x);
    var b = mathExpm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp$2(x) + exp$2(-x));
  }
});

// Math[@@toStringTag] property
// https://tc39.github.io/ecma262/#sec-math-@@tostringtag
setToStringTag(Math, 'Math', true);

var ceil$2 = Math.ceil;
var floor$5 = Math.floor;

// `Math.trunc` method
// https://tc39.github.io/ecma262/#sec-math.trunc
_export({ target: 'Math', stat: true }, {
  trunc: function trunc(it) {
    return (it > 0 ? floor$5 : ceil$2)(it);
  }
});

// `Date.now` method
// https://tc39.github.io/ecma262/#sec-date.now
_export({ target: 'Date', stat: true }, {
  now: function now() {
    return new Date().getTime();
  }
});

var FORCED$f = fails(function () {
  return new Date(NaN).toJSON() !== null
    || Date.prototype.toJSON.call({ toISOString: function () { return 1; } }) !== 1;
});

// `Date.prototype.toJSON` method
// https://tc39.github.io/ecma262/#sec-date.prototype.tojson
_export({ target: 'Date', proto: true, forced: FORCED$f }, {
  // eslint-disable-next-line no-unused-vars
  toJSON: function toJSON(key) {
    var O = toObject(this);
    var pv = toPrimitive(O);
    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
  }
});

var padStart = stringPad.start;

var abs$6 = Math.abs;
var DatePrototype = Date.prototype;
var getTime = DatePrototype.getTime;
var nativeDateToISOString = DatePrototype.toISOString;

// `Date.prototype.toISOString` method implementation
// https://tc39.github.io/ecma262/#sec-date.prototype.toisostring
// PhantomJS / old WebKit fails here:
var dateToIsoString = (fails(function () {
  return nativeDateToISOString.call(new Date(-5e13 - 1)) != '0385-07-25T07:06:39.999Z';
}) || !fails(function () {
  nativeDateToISOString.call(new Date(NaN));
})) ? function toISOString() {
  if (!isFinite(getTime.call(this))) throw RangeError('Invalid time value');
  var date = this;
  var year = date.getUTCFullYear();
  var milliseconds = date.getUTCMilliseconds();
  var sign = year < 0 ? '-' : year > 9999 ? '+' : '';
  return sign + padStart(abs$6(year), sign ? 6 : 4, 0) +
    '-' + padStart(date.getUTCMonth() + 1, 2, 0) +
    '-' + padStart(date.getUTCDate(), 2, 0) +
    'T' + padStart(date.getUTCHours(), 2, 0) +
    ':' + padStart(date.getUTCMinutes(), 2, 0) +
    ':' + padStart(date.getUTCSeconds(), 2, 0) +
    '.' + padStart(milliseconds, 3, 0) +
    'Z';
} : nativeDateToISOString;

// `Date.prototype.toISOString` method
// https://tc39.github.io/ecma262/#sec-date.prototype.toisostring
// PhantomJS / old WebKit has a broken implementations
_export({ target: 'Date', proto: true, forced: Date.prototype.toISOString !== dateToIsoString }, {
  toISOString: dateToIsoString
});

var DatePrototype$1 = Date.prototype;
var INVALID_DATE = 'Invalid Date';
var TO_STRING$1 = 'toString';
var nativeDateToString = DatePrototype$1[TO_STRING$1];
var getTime$1 = DatePrototype$1.getTime;

// `Date.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-date.prototype.tostring
if (new Date(NaN) + '' != INVALID_DATE) {
  redefine(DatePrototype$1, TO_STRING$1, function toString() {
    var value = getTime$1.call(this);
    // eslint-disable-next-line no-self-compare
    return value === value ? nativeDateToString.call(this) : INVALID_DATE;
  });
}

var dateToPrimitive = function (hint) {
  if (hint !== 'string' && hint !== 'number' && hint !== 'default') {
    throw TypeError('Incorrect hint');
  } return toPrimitive(anObject(this), hint !== 'number');
};

var TO_PRIMITIVE$1 = wellKnownSymbol('toPrimitive');
var DatePrototype$2 = Date.prototype;

// `Date.prototype[@@toPrimitive]` method
// https://tc39.github.io/ecma262/#sec-date.prototype-@@toprimitive
if (!(TO_PRIMITIVE$1 in DatePrototype$2)) {
  createNonEnumerableProperty(DatePrototype$2, TO_PRIMITIVE$1, dateToPrimitive);
}

var $stringify$1 = getBuiltIn('JSON', 'stringify');
var re = /[\uD800-\uDFFF]/g;
var low = /^[\uD800-\uDBFF]$/;
var hi = /^[\uDC00-\uDFFF]$/;

var fix = function (match, offset, string) {
  var prev = string.charAt(offset - 1);
  var next = string.charAt(offset + 1);
  if ((low.test(match) && !hi.test(next)) || (hi.test(match) && !low.test(prev))) {
    return '\\u' + match.charCodeAt(0).toString(16);
  } return match;
};

var FORCED$g = fails(function () {
  return $stringify$1('\uDF06\uD834') !== '"\\udf06\\ud834"'
    || $stringify$1('\uDEAD') !== '"\\udead"';
});

if ($stringify$1) {
  // https://github.com/tc39/proposal-well-formed-stringify
  _export({ target: 'JSON', stat: true, forced: FORCED$g }, {
    // eslint-disable-next-line no-unused-vars
    stringify: function stringify(it, replacer, space) {
      var result = $stringify$1.apply(null, arguments);
      return typeof result == 'string' ? result.replace(re, fix) : result;
    }
  });
}

// JSON[@@toStringTag] property
// https://tc39.github.io/ecma262/#sec-json-@@tostringtag
setToStringTag(global_1.JSON, 'JSON', true);

// `Promise.allSettled` method
// https://github.com/tc39/proposal-promise-allSettled
_export({ target: 'Promise', stat: true }, {
  allSettled: function allSettled(iterable) {
    var C = this;
    var capability = newPromiseCapability.f(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var promiseResolve = aFunction$1(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate_1(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        promiseResolve.call(C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = { status: 'fulfilled', value: value };
          --remaining || resolve(values);
        }, function (e) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = { status: 'rejected', reason: e };
          --remaining || resolve(values);
        });
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});

var collection = function (CONSTRUCTOR_NAME, wrapper, common) {
  var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
  var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
  var ADDER = IS_MAP ? 'set' : 'add';
  var NativeConstructor = global_1[CONSTRUCTOR_NAME];
  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
  var Constructor = NativeConstructor;
  var exported = {};

  var fixMethod = function (KEY) {
    var nativeMethod = NativePrototype[KEY];
    redefine(NativePrototype, KEY,
      KEY == 'add' ? function add(value) {
        nativeMethod.call(this, value === 0 ? 0 : value);
        return this;
      } : KEY == 'delete' ? function (key) {
        return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
      } : KEY == 'get' ? function get(key) {
        return IS_WEAK && !isObject(key) ? undefined : nativeMethod.call(this, key === 0 ? 0 : key);
      } : KEY == 'has' ? function has(key) {
        return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
      } : function set(key, value) {
        nativeMethod.call(this, key === 0 ? 0 : key, value);
        return this;
      }
    );
  };

  // eslint-disable-next-line max-len
  if (isForced_1(CONSTRUCTOR_NAME, typeof NativeConstructor != 'function' || !(IS_WEAK || NativePrototype.forEach && !fails(function () {
    new NativeConstructor().entries().next();
  })))) {
    // create collection constructor
    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
    internalMetadata.REQUIRED = true;
  } else if (isForced_1(CONSTRUCTOR_NAME, true)) {
    var instance = new Constructor();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    // eslint-disable-next-line no-new
    var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (iterable) { new NativeConstructor(iterable); });
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new NativeConstructor();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });

    if (!ACCEPT_ITERABLES) {
      Constructor = wrapper(function (dummy, iterable) {
        anInstance(dummy, Constructor, CONSTRUCTOR_NAME);
        var that = inheritIfRequired(new NativeConstructor(), dummy, Constructor);
        if (iterable != undefined) iterate_1(iterable, that[ADDER], that, IS_MAP);
        return that;
      });
      Constructor.prototype = NativePrototype;
      NativePrototype.constructor = Constructor;
    }

    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }

    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

    // weak collections should not contains .clear method
    if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
  }

  exported[CONSTRUCTOR_NAME] = Constructor;
  _export({ global: true, forced: Constructor != NativeConstructor }, exported);

  setToStringTag(Constructor, CONSTRUCTOR_NAME);

  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

  return Constructor;
};

var defineProperty$9 = objectDefineProperty.f;








var fastKey = internalMetadata.fastKey;


var setInternalState$6 = internalState.set;
var internalStateGetterFor = internalState.getterFor;

var collectionStrong = {
  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, CONSTRUCTOR_NAME);
      setInternalState$6(that, {
        type: CONSTRUCTOR_NAME,
        index: objectCreate(null),
        first: undefined,
        last: undefined,
        size: 0
      });
      if (!descriptors) that.size = 0;
      if (iterable != undefined) iterate_1(iterable, that[ADDER], that, IS_MAP);
    });

    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

    var define = function (that, key, value) {
      var state = getInternalState(that);
      var entry = getEntry(that, key);
      var previous, index;
      // change existing entry
      if (entry) {
        entry.value = value;
      // create new entry
      } else {
        state.last = entry = {
          index: index = fastKey(key, true),
          key: key,
          value: value,
          previous: previous = state.last,
          next: undefined,
          removed: false
        };
        if (!state.first) state.first = entry;
        if (previous) previous.next = entry;
        if (descriptors) state.size++;
        else that.size++;
        // add to index
        if (index !== 'F') state.index[index] = entry;
      } return that;
    };

    var getEntry = function (that, key) {
      var state = getInternalState(that);
      // fast case
      var index = fastKey(key);
      var entry;
      if (index !== 'F') return state.index[index];
      // frozen object case
      for (entry = state.first; entry; entry = entry.next) {
        if (entry.key == key) return entry;
      }
    };

    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        var that = this;
        var state = getInternalState(that);
        var data = state.index;
        var entry = state.first;
        while (entry) {
          entry.removed = true;
          if (entry.previous) entry.previous = entry.previous.next = undefined;
          delete data[entry.index];
          entry = entry.next;
        }
        state.first = state.last = undefined;
        if (descriptors) state.size = 0;
        else that.size = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = this;
        var state = getInternalState(that);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.next;
          var prev = entry.previous;
          delete state.index[entry.index];
          entry.removed = true;
          if (prev) prev.next = next;
          if (next) next.previous = prev;
          if (state.first == entry) state.first = next;
          if (state.last == entry) state.last = prev;
          if (descriptors) state.size--;
          else that.size--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        var state = getInternalState(this);
        var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.next : state.first) {
          boundFunction(entry.value, entry.key, this);
          // revert to the last existing entry
          while (entry && entry.removed) entry = entry.previous;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(this, key);
      }
    });

    redefineAll(C.prototype, IS_MAP ? {
      // 23.1.3.6 Map.prototype.get(key)
      get: function get(key) {
        var entry = getEntry(this, key);
        return entry && entry.value;
      },
      // 23.1.3.9 Map.prototype.set(key, value)
      set: function set(key, value) {
        return define(this, key === 0 ? 0 : key, value);
      }
    } : {
      // 23.2.3.1 Set.prototype.add(value)
      add: function add(value) {
        return define(this, value = value === 0 ? 0 : value, value);
      }
    });
    if (descriptors) defineProperty$9(C.prototype, 'size', {
      get: function () {
        return getInternalState(this).size;
      }
    });
    return C;
  },
  setStrong: function (C, CONSTRUCTOR_NAME, IS_MAP) {
    var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
    var getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME);
    var getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME);
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    defineIterator(C, CONSTRUCTOR_NAME, function (iterated, kind) {
      setInternalState$6(this, {
        type: ITERATOR_NAME,
        target: iterated,
        state: getInternalCollectionState(iterated),
        kind: kind,
        last: undefined
      });
    }, function () {
      var state = getInternalIteratorState(this);
      var kind = state.kind;
      var entry = state.last;
      // revert to the last existing entry
      while (entry && entry.removed) entry = entry.previous;
      // get next entry
      if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
        // or finish the iteration
        state.target = undefined;
        return { value: undefined, done: true };
      }
      // return step by kind
      if (kind == 'keys') return { value: entry.key, done: false };
      if (kind == 'values') return { value: entry.value, done: false };
      return { value: [entry.key, entry.value], done: false };
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(CONSTRUCTOR_NAME);
  }
};

// `Map` constructor
// https://tc39.github.io/ecma262/#sec-map-objects
var es_map = collection('Map', function (init) {
  return function Map() { return init(this, arguments.length ? arguments[0] : undefined); };
}, collectionStrong);

// `Set` constructor
// https://tc39.github.io/ecma262/#sec-set-objects
var es_set = collection('Set', function (init) {
  return function Set() { return init(this, arguments.length ? arguments[0] : undefined); };
}, collectionStrong);

var getWeakData = internalMetadata.getWeakData;








var setInternalState$7 = internalState.set;
var internalStateGetterFor$1 = internalState.getterFor;
var find = arrayIteration.find;
var findIndex = arrayIteration.findIndex;
var id$1 = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function (store) {
  return store.frozen || (store.frozen = new UncaughtFrozenStore());
};

var UncaughtFrozenStore = function () {
  this.entries = [];
};

var findUncaughtFrozen = function (store, key) {
  return find(store.entries, function (it) {
    return it[0] === key;
  });
};

UncaughtFrozenStore.prototype = {
  get: function (key) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) return entry[1];
  },
  has: function (key) {
    return !!findUncaughtFrozen(this, key);
  },
  set: function (key, value) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) entry[1] = value;
    else this.entries.push([key, value]);
  },
  'delete': function (key) {
    var index = findIndex(this.entries, function (it) {
      return it[0] === key;
    });
    if (~index) this.entries.splice(index, 1);
    return !!~index;
  }
};

var collectionWeak = {
  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, CONSTRUCTOR_NAME);
      setInternalState$7(that, {
        type: CONSTRUCTOR_NAME,
        id: id$1++,
        frozen: undefined
      });
      if (iterable != undefined) iterate_1(iterable, that[ADDER], that, IS_MAP);
    });

    var getInternalState = internalStateGetterFor$1(CONSTRUCTOR_NAME);

    var define = function (that, key, value) {
      var state = getInternalState(that);
      var data = getWeakData(anObject(key), true);
      if (data === true) uncaughtFrozenStore(state).set(key, value);
      else data[state.id] = value;
      return that;
    };

    redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function (key) {
        var state = getInternalState(this);
        if (!isObject(key)) return false;
        var data = getWeakData(key);
        if (data === true) return uncaughtFrozenStore(state)['delete'](key);
        return data && has(data, state.id) && delete data[state.id];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has$1(key) {
        var state = getInternalState(this);
        if (!isObject(key)) return false;
        var data = getWeakData(key);
        if (data === true) return uncaughtFrozenStore(state).has(key);
        return data && has(data, state.id);
      }
    });

    redefineAll(C.prototype, IS_MAP ? {
      // 23.3.3.3 WeakMap.prototype.get(key)
      get: function get(key) {
        var state = getInternalState(this);
        if (isObject(key)) {
          var data = getWeakData(key);
          if (data === true) return uncaughtFrozenStore(state).get(key);
          return data ? data[state.id] : undefined;
        }
      },
      // 23.3.3.5 WeakMap.prototype.set(key, value)
      set: function set(key, value) {
        return define(this, key, value);
      }
    } : {
      // 23.4.3.1 WeakSet.prototype.add(value)
      add: function add(value) {
        return define(this, value, true);
      }
    });

    return C;
  }
};

var es_weakMap = createCommonjsModule(function (module) {






var enforceIternalState = internalState.enforce;


var IS_IE11 = !global_1.ActiveXObject && 'ActiveXObject' in global_1;
var isExtensible = Object.isExtensible;
var InternalWeakMap;

var wrapper = function (init) {
  return function WeakMap() {
    return init(this, arguments.length ? arguments[0] : undefined);
  };
};

// `WeakMap` constructor
// https://tc39.github.io/ecma262/#sec-weakmap-constructor
var $WeakMap = module.exports = collection('WeakMap', wrapper, collectionWeak);

// IE11 WeakMap frozen keys fix
// We can't use feature detection because it crash some old IE builds
// https://github.com/zloirock/core-js/issues/485
if (nativeWeakMap && IS_IE11) {
  InternalWeakMap = collectionWeak.getConstructor(wrapper, 'WeakMap', true);
  internalMetadata.REQUIRED = true;
  var WeakMapPrototype = $WeakMap.prototype;
  var nativeDelete = WeakMapPrototype['delete'];
  var nativeHas = WeakMapPrototype.has;
  var nativeGet = WeakMapPrototype.get;
  var nativeSet = WeakMapPrototype.set;
  redefineAll(WeakMapPrototype, {
    'delete': function (key) {
      if (isObject(key) && !isExtensible(key)) {
        var state = enforceIternalState(this);
        if (!state.frozen) state.frozen = new InternalWeakMap();
        return nativeDelete.call(this, key) || state.frozen['delete'](key);
      } return nativeDelete.call(this, key);
    },
    has: function has(key) {
      if (isObject(key) && !isExtensible(key)) {
        var state = enforceIternalState(this);
        if (!state.frozen) state.frozen = new InternalWeakMap();
        return nativeHas.call(this, key) || state.frozen.has(key);
      } return nativeHas.call(this, key);
    },
    get: function get(key) {
      if (isObject(key) && !isExtensible(key)) {
        var state = enforceIternalState(this);
        if (!state.frozen) state.frozen = new InternalWeakMap();
        return nativeHas.call(this, key) ? nativeGet.call(this, key) : state.frozen.get(key);
      } return nativeGet.call(this, key);
    },
    set: function set(key, value) {
      if (isObject(key) && !isExtensible(key)) {
        var state = enforceIternalState(this);
        if (!state.frozen) state.frozen = new InternalWeakMap();
        nativeHas.call(this, key) ? nativeSet.call(this, key, value) : state.frozen.set(key, value);
      } else nativeSet.call(this, key, value);
      return this;
    }
  });
}
});

// `WeakSet` constructor
// https://tc39.github.io/ecma262/#sec-weakset-constructor
collection('WeakSet', function (init) {
  return function WeakSet() { return init(this, arguments.length ? arguments[0] : undefined); };
}, collectionWeak);

var arrayBufferNative = typeof ArrayBuffer !== 'undefined' && typeof DataView !== 'undefined';

// `ToIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-toindex
var toIndex = function (it) {
  if (it === undefined) return 0;
  var number = toInteger(it);
  var length = toLength(number);
  if (number !== length) throw RangeError('Wrong length or index');
  return length;
};

// IEEE754 conversions based on https://github.com/feross/ieee754
// eslint-disable-next-line no-shadow-restricted-names
var Infinity$1 = 1 / 0;
var abs$7 = Math.abs;
var pow$3 = Math.pow;
var floor$6 = Math.floor;
var log$8 = Math.log;
var LN2$2 = Math.LN2;

var pack = function (number, mantissaLength, bytes) {
  var buffer = new Array(bytes);
  var exponentLength = bytes * 8 - mantissaLength - 1;
  var eMax = (1 << exponentLength) - 1;
  var eBias = eMax >> 1;
  var rt = mantissaLength === 23 ? pow$3(2, -24) - pow$3(2, -77) : 0;
  var sign = number < 0 || number === 0 && 1 / number < 0 ? 1 : 0;
  var index = 0;
  var exponent, mantissa, c;
  number = abs$7(number);
  // eslint-disable-next-line no-self-compare
  if (number != number || number === Infinity$1) {
    // eslint-disable-next-line no-self-compare
    mantissa = number != number ? 1 : 0;
    exponent = eMax;
  } else {
    exponent = floor$6(log$8(number) / LN2$2);
    if (number * (c = pow$3(2, -exponent)) < 1) {
      exponent--;
      c *= 2;
    }
    if (exponent + eBias >= 1) {
      number += rt / c;
    } else {
      number += rt * pow$3(2, 1 - eBias);
    }
    if (number * c >= 2) {
      exponent++;
      c /= 2;
    }
    if (exponent + eBias >= eMax) {
      mantissa = 0;
      exponent = eMax;
    } else if (exponent + eBias >= 1) {
      mantissa = (number * c - 1) * pow$3(2, mantissaLength);
      exponent = exponent + eBias;
    } else {
      mantissa = number * pow$3(2, eBias - 1) * pow$3(2, mantissaLength);
      exponent = 0;
    }
  }
  for (; mantissaLength >= 8; buffer[index++] = mantissa & 255, mantissa /= 256, mantissaLength -= 8);
  exponent = exponent << mantissaLength | mantissa;
  exponentLength += mantissaLength;
  for (; exponentLength > 0; buffer[index++] = exponent & 255, exponent /= 256, exponentLength -= 8);
  buffer[--index] |= sign * 128;
  return buffer;
};

var unpack = function (buffer, mantissaLength) {
  var bytes = buffer.length;
  var exponentLength = bytes * 8 - mantissaLength - 1;
  var eMax = (1 << exponentLength) - 1;
  var eBias = eMax >> 1;
  var nBits = exponentLength - 7;
  var index = bytes - 1;
  var sign = buffer[index--];
  var exponent = sign & 127;
  var mantissa;
  sign >>= 7;
  for (; nBits > 0; exponent = exponent * 256 + buffer[index], index--, nBits -= 8);
  mantissa = exponent & (1 << -nBits) - 1;
  exponent >>= -nBits;
  nBits += mantissaLength;
  for (; nBits > 0; mantissa = mantissa * 256 + buffer[index], index--, nBits -= 8);
  if (exponent === 0) {
    exponent = 1 - eBias;
  } else if (exponent === eMax) {
    return mantissa ? NaN : sign ? -Infinity$1 : Infinity$1;
  } else {
    mantissa = mantissa + pow$3(2, mantissaLength);
    exponent = exponent - eBias;
  } return (sign ? -1 : 1) * mantissa * pow$3(2, exponent - mantissaLength);
};

var ieee754 = {
  pack: pack,
  unpack: unpack
};

var getOwnPropertyNames$2 = objectGetOwnPropertyNames.f;
var defineProperty$a = objectDefineProperty.f;




var getInternalState$6 = internalState.get;
var setInternalState$8 = internalState.set;
var ARRAY_BUFFER = 'ArrayBuffer';
var DATA_VIEW = 'DataView';
var PROTOTYPE$2 = 'prototype';
var WRONG_LENGTH = 'Wrong length';
var WRONG_INDEX = 'Wrong index';
var NativeArrayBuffer = global_1[ARRAY_BUFFER];
var $ArrayBuffer = NativeArrayBuffer;
var $DataView = global_1[DATA_VIEW];
var $DataViewPrototype = $DataView && $DataView[PROTOTYPE$2];
var ObjectPrototype$2 = Object.prototype;
var RangeError$1 = global_1.RangeError;

var packIEEE754 = ieee754.pack;
var unpackIEEE754 = ieee754.unpack;

var packInt8 = function (number) {
  return [number & 0xFF];
};

var packInt16 = function (number) {
  return [number & 0xFF, number >> 8 & 0xFF];
};

var packInt32 = function (number) {
  return [number & 0xFF, number >> 8 & 0xFF, number >> 16 & 0xFF, number >> 24 & 0xFF];
};

var unpackInt32 = function (buffer) {
  return buffer[3] << 24 | buffer[2] << 16 | buffer[1] << 8 | buffer[0];
};

var packFloat32 = function (number) {
  return packIEEE754(number, 23, 4);
};

var packFloat64 = function (number) {
  return packIEEE754(number, 52, 8);
};

var addGetter = function (Constructor, key) {
  defineProperty$a(Constructor[PROTOTYPE$2], key, { get: function () { return getInternalState$6(this)[key]; } });
};

var get$1 = function (view, count, index, isLittleEndian) {
  var intIndex = toIndex(index);
  var store = getInternalState$6(view);
  if (intIndex + count > store.byteLength) throw RangeError$1(WRONG_INDEX);
  var bytes = getInternalState$6(store.buffer).bytes;
  var start = intIndex + store.byteOffset;
  var pack = bytes.slice(start, start + count);
  return isLittleEndian ? pack : pack.reverse();
};

var set$2 = function (view, count, index, conversion, value, isLittleEndian) {
  var intIndex = toIndex(index);
  var store = getInternalState$6(view);
  if (intIndex + count > store.byteLength) throw RangeError$1(WRONG_INDEX);
  var bytes = getInternalState$6(store.buffer).bytes;
  var start = intIndex + store.byteOffset;
  var pack = conversion(+value);
  for (var i = 0; i < count; i++) bytes[start + i] = pack[isLittleEndian ? i : count - i - 1];
};

if (!arrayBufferNative) {
  $ArrayBuffer = function ArrayBuffer(length) {
    anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
    var byteLength = toIndex(length);
    setInternalState$8(this, {
      bytes: arrayFill.call(new Array(byteLength), 0),
      byteLength: byteLength
    });
    if (!descriptors) this.byteLength = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength) {
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = getInternalState$6(buffer).byteLength;
    var offset = toInteger(byteOffset);
    if (offset < 0 || offset > bufferLength) throw RangeError$1('Wrong offset');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if (offset + byteLength > bufferLength) throw RangeError$1(WRONG_LENGTH);
    setInternalState$8(this, {
      buffer: buffer,
      byteLength: byteLength,
      byteOffset: offset
    });
    if (!descriptors) {
      this.buffer = buffer;
      this.byteLength = byteLength;
      this.byteOffset = offset;
    }
  };

  if (descriptors) {
    addGetter($ArrayBuffer, 'byteLength');
    addGetter($DataView, 'buffer');
    addGetter($DataView, 'byteLength');
    addGetter($DataView, 'byteOffset');
  }

  redefineAll($DataView[PROTOTYPE$2], {
    getInt8: function getInt8(byteOffset) {
      return get$1(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset) {
      return get$1(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /* , littleEndian */) {
      var bytes = get$1(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /* , littleEndian */) {
      var bytes = get$1(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /* , littleEndian */) {
      return unpackInt32(get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined));
    },
    getUint32: function getUint32(byteOffset /* , littleEndian */) {
      return unpackInt32(get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined)) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 23);
    },
    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get$1(this, 8, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 52);
    },
    setInt8: function setInt8(byteOffset, value) {
      set$2(this, 1, byteOffset, packInt8, value);
    },
    setUint8: function setUint8(byteOffset, value) {
      set$2(this, 1, byteOffset, packInt8, value);
    },
    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
      set$2(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
      set$2(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
      set$2(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
      set$2(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
      set$2(this, 4, byteOffset, packFloat32, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
      set$2(this, 8, byteOffset, packFloat64, value, arguments.length > 2 ? arguments[2] : undefined);
    }
  });
} else {
  if (!fails(function () {
    NativeArrayBuffer(1);
  }) || !fails(function () {
    new NativeArrayBuffer(-1); // eslint-disable-line no-new
  }) || fails(function () {
    new NativeArrayBuffer(); // eslint-disable-line no-new
    new NativeArrayBuffer(1.5); // eslint-disable-line no-new
    new NativeArrayBuffer(NaN); // eslint-disable-line no-new
    return NativeArrayBuffer.name != ARRAY_BUFFER;
  })) {
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance(this, $ArrayBuffer);
      return new NativeArrayBuffer(toIndex(length));
    };
    var ArrayBufferPrototype = $ArrayBuffer[PROTOTYPE$2] = NativeArrayBuffer[PROTOTYPE$2];
    for (var keys$3 = getOwnPropertyNames$2(NativeArrayBuffer), j$1 = 0, key$1; keys$3.length > j$1;) {
      if (!((key$1 = keys$3[j$1++]) in $ArrayBuffer)) {
        createNonEnumerableProperty($ArrayBuffer, key$1, NativeArrayBuffer[key$1]);
      }
    }
    ArrayBufferPrototype.constructor = $ArrayBuffer;
  }

  // WebKit bug - the same parent prototype for typed arrays and data view
  if (objectSetPrototypeOf && objectGetPrototypeOf($DataViewPrototype) !== ObjectPrototype$2) {
    objectSetPrototypeOf($DataViewPrototype, ObjectPrototype$2);
  }

  // iOS Safari 7.x bug
  var testView = new $DataView(new $ArrayBuffer(2));
  var nativeSetInt8 = $DataViewPrototype.setInt8;
  testView.setInt8(0, 2147483648);
  testView.setInt8(1, 2147483649);
  if (testView.getInt8(0) || !testView.getInt8(1)) redefineAll($DataViewPrototype, {
    setInt8: function setInt8(byteOffset, value) {
      nativeSetInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value) {
      nativeSetInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, { unsafe: true });
}

setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);

var arrayBuffer = {
  ArrayBuffer: $ArrayBuffer,
  DataView: $DataView
};

var ARRAY_BUFFER$1 = 'ArrayBuffer';
var ArrayBuffer$1 = arrayBuffer[ARRAY_BUFFER$1];
var NativeArrayBuffer$1 = global_1[ARRAY_BUFFER$1];

// `ArrayBuffer` constructor
// https://tc39.github.io/ecma262/#sec-arraybuffer-constructor
_export({ global: true, forced: NativeArrayBuffer$1 !== ArrayBuffer$1 }, {
  ArrayBuffer: ArrayBuffer$1
});

setSpecies(ARRAY_BUFFER$1);

var defineProperty$b = objectDefineProperty.f;





var Int8Array$1 = global_1.Int8Array;
var Int8ArrayPrototype = Int8Array$1 && Int8Array$1.prototype;
var Uint8ClampedArray = global_1.Uint8ClampedArray;
var Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype;
var TypedArray = Int8Array$1 && objectGetPrototypeOf(Int8Array$1);
var TypedArrayPrototype = Int8ArrayPrototype && objectGetPrototypeOf(Int8ArrayPrototype);
var ObjectPrototype$3 = Object.prototype;
var isPrototypeOf = ObjectPrototype$3.isPrototypeOf;

var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
var TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG');
// Fixing native typed arrays in Opera Presto crashes the browser, see #595
var NATIVE_ARRAY_BUFFER_VIEWS = arrayBufferNative && !!objectSetPrototypeOf && classof(global_1.opera) !== 'Opera';
var TYPED_ARRAY_TAG_REQIRED = false;
var NAME$1;

var TypedArrayConstructorsList = {
  Int8Array: 1,
  Uint8Array: 1,
  Uint8ClampedArray: 1,
  Int16Array: 2,
  Uint16Array: 2,
  Int32Array: 4,
  Uint32Array: 4,
  Float32Array: 4,
  Float64Array: 8
};

var isView = function isView(it) {
  var klass = classof(it);
  return klass === 'DataView' || has(TypedArrayConstructorsList, klass);
};

var isTypedArray = function (it) {
  return isObject(it) && has(TypedArrayConstructorsList, classof(it));
};

var aTypedArray = function (it) {
  if (isTypedArray(it)) return it;
  throw TypeError('Target is not a typed array');
};

var aTypedArrayConstructor = function (C) {
  if (objectSetPrototypeOf) {
    if (isPrototypeOf.call(TypedArray, C)) return C;
  } else for (var ARRAY in TypedArrayConstructorsList) if (has(TypedArrayConstructorsList, NAME$1)) {
    var TypedArrayConstructor = global_1[ARRAY];
    if (TypedArrayConstructor && (C === TypedArrayConstructor || isPrototypeOf.call(TypedArrayConstructor, C))) {
      return C;
    }
  } throw TypeError('Target is not a typed array constructor');
};

var exportTypedArrayMethod = function (KEY, property, forced) {
  if (!descriptors) return;
  if (forced) for (var ARRAY in TypedArrayConstructorsList) {
    var TypedArrayConstructor = global_1[ARRAY];
    if (TypedArrayConstructor && has(TypedArrayConstructor.prototype, KEY)) {
      delete TypedArrayConstructor.prototype[KEY];
    }
  }
  if (!TypedArrayPrototype[KEY] || forced) {
    redefine(TypedArrayPrototype, KEY, forced ? property
      : NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY] || property);
  }
};

var exportTypedArrayStaticMethod = function (KEY, property, forced) {
  var ARRAY, TypedArrayConstructor;
  if (!descriptors) return;
  if (objectSetPrototypeOf) {
    if (forced) for (ARRAY in TypedArrayConstructorsList) {
      TypedArrayConstructor = global_1[ARRAY];
      if (TypedArrayConstructor && has(TypedArrayConstructor, KEY)) {
        delete TypedArrayConstructor[KEY];
      }
    }
    if (!TypedArray[KEY] || forced) {
      // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
      try {
        return redefine(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && Int8Array$1[KEY] || property);
      } catch (error) { /* empty */ }
    } else return;
  }
  for (ARRAY in TypedArrayConstructorsList) {
    TypedArrayConstructor = global_1[ARRAY];
    if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
      redefine(TypedArrayConstructor, KEY, property);
    }
  }
};

for (NAME$1 in TypedArrayConstructorsList) {
  if (!global_1[NAME$1]) NATIVE_ARRAY_BUFFER_VIEWS = false;
}

// WebKit bug - typed arrays constructors prototype is Object.prototype
if (!NATIVE_ARRAY_BUFFER_VIEWS || typeof TypedArray != 'function' || TypedArray === Function.prototype) {
  // eslint-disable-next-line no-shadow
  TypedArray = function TypedArray() {
    throw TypeError('Incorrect invocation');
  };
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME$1 in TypedArrayConstructorsList) {
    if (global_1[NAME$1]) objectSetPrototypeOf(global_1[NAME$1], TypedArray);
  }
}

if (!NATIVE_ARRAY_BUFFER_VIEWS || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype$3) {
  TypedArrayPrototype = TypedArray.prototype;
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME$1 in TypedArrayConstructorsList) {
    if (global_1[NAME$1]) objectSetPrototypeOf(global_1[NAME$1].prototype, TypedArrayPrototype);
  }
}

// WebKit bug - one more object in Uint8ClampedArray prototype chain
if (NATIVE_ARRAY_BUFFER_VIEWS && objectGetPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
  objectSetPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
}

if (descriptors && !has(TypedArrayPrototype, TO_STRING_TAG$3)) {
  TYPED_ARRAY_TAG_REQIRED = true;
  defineProperty$b(TypedArrayPrototype, TO_STRING_TAG$3, { get: function () {
    return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined;
  } });
  for (NAME$1 in TypedArrayConstructorsList) if (global_1[NAME$1]) {
    createNonEnumerableProperty(global_1[NAME$1], TYPED_ARRAY_TAG, NAME$1);
  }
}

var arrayBufferViewCore = {
  NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
  TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQIRED && TYPED_ARRAY_TAG,
  aTypedArray: aTypedArray,
  aTypedArrayConstructor: aTypedArrayConstructor,
  exportTypedArrayMethod: exportTypedArrayMethod,
  exportTypedArrayStaticMethod: exportTypedArrayStaticMethod,
  isView: isView,
  isTypedArray: isTypedArray,
  TypedArray: TypedArray,
  TypedArrayPrototype: TypedArrayPrototype
};

var NATIVE_ARRAY_BUFFER_VIEWS$1 = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;

// `ArrayBuffer.isView` method
// https://tc39.github.io/ecma262/#sec-arraybuffer.isview
_export({ target: 'ArrayBuffer', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS$1 }, {
  isView: arrayBufferViewCore.isView
});

var ArrayBuffer$2 = arrayBuffer.ArrayBuffer;
var DataView$1 = arrayBuffer.DataView;
var nativeArrayBufferSlice = ArrayBuffer$2.prototype.slice;

var INCORRECT_SLICE = fails(function () {
  return !new ArrayBuffer$2(2).slice(1, undefined).byteLength;
});

// `ArrayBuffer.prototype.slice` method
// https://tc39.github.io/ecma262/#sec-arraybuffer.prototype.slice
_export({ target: 'ArrayBuffer', proto: true, unsafe: true, forced: INCORRECT_SLICE }, {
  slice: function slice(start, end) {
    if (nativeArrayBufferSlice !== undefined && end === undefined) {
      return nativeArrayBufferSlice.call(anObject(this), start); // FF fix
    }
    var length = anObject(this).byteLength;
    var first = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    var result = new (speciesConstructor(this, ArrayBuffer$2))(toLength(fin - first));
    var viewSource = new DataView$1(this);
    var viewTarget = new DataView$1(result);
    var index = 0;
    while (first < fin) {
      viewTarget.setUint8(index++, viewSource.getUint8(first++));
    } return result;
  }
});

// `DataView` constructor
// https://tc39.github.io/ecma262/#sec-dataview-constructor
_export({ global: true, forced: !arrayBufferNative }, {
  DataView: arrayBuffer.DataView
});

/* eslint-disable no-new */



var NATIVE_ARRAY_BUFFER_VIEWS$2 = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;

var ArrayBuffer$3 = global_1.ArrayBuffer;
var Int8Array$2 = global_1.Int8Array;

var typedArrayConstructorsRequireWrappers = !NATIVE_ARRAY_BUFFER_VIEWS$2 || !fails(function () {
  Int8Array$2(1);
}) || !fails(function () {
  new Int8Array$2(-1);
}) || !checkCorrectnessOfIteration(function (iterable) {
  new Int8Array$2();
  new Int8Array$2(null);
  new Int8Array$2(1.5);
  new Int8Array$2(iterable);
}, true) || fails(function () {
  // Safari (11+) bug - a reason why even Safari 13 should load a typed array polyfill
  return new Int8Array$2(new ArrayBuffer$3(2), 1, undefined).length !== 1;
});

var toPositiveInteger = function (it) {
  var result = toInteger(it);
  if (result < 0) throw RangeError("The argument can't be less than 0");
  return result;
};

var toOffset = function (it, BYTES) {
  var offset = toPositiveInteger(it);
  if (offset % BYTES) throw RangeError('Wrong offset');
  return offset;
};

var aTypedArrayConstructor$1 = arrayBufferViewCore.aTypedArrayConstructor;

var typedArrayFrom = function from(source /* , mapfn, thisArg */) {
  var O = toObject(source);
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var iteratorMethod = getIteratorMethod(O);
  var i, length, result, step, iterator, next;
  if (iteratorMethod != undefined && !isArrayIteratorMethod(iteratorMethod)) {
    iterator = iteratorMethod.call(O);
    next = iterator.next;
    O = [];
    while (!(step = next.call(iterator)).done) {
      O.push(step.value);
    }
  }
  if (mapping && argumentsLength > 2) {
    mapfn = functionBindContext(mapfn, arguments[2], 2);
  }
  length = toLength(O.length);
  result = new (aTypedArrayConstructor$1(this))(length);
  for (i = 0; length > i; i++) {
    result[i] = mapping ? mapfn(O[i], i) : O[i];
  }
  return result;
};

var typedArrayConstructor = createCommonjsModule(function (module) {


















var getOwnPropertyNames = objectGetOwnPropertyNames.f;

var forEach = arrayIteration.forEach;






var getInternalState = internalState.get;
var setInternalState = internalState.set;
var nativeDefineProperty = objectDefineProperty.f;
var nativeGetOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
var round = Math.round;
var RangeError = global_1.RangeError;
var ArrayBuffer = arrayBuffer.ArrayBuffer;
var DataView = arrayBuffer.DataView;
var NATIVE_ARRAY_BUFFER_VIEWS = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;
var TYPED_ARRAY_TAG = arrayBufferViewCore.TYPED_ARRAY_TAG;
var TypedArray = arrayBufferViewCore.TypedArray;
var TypedArrayPrototype = arrayBufferViewCore.TypedArrayPrototype;
var aTypedArrayConstructor = arrayBufferViewCore.aTypedArrayConstructor;
var isTypedArray = arrayBufferViewCore.isTypedArray;
var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
var WRONG_LENGTH = 'Wrong length';

var fromList = function (C, list) {
  var index = 0;
  var length = list.length;
  var result = new (aTypedArrayConstructor(C))(length);
  while (length > index) result[index] = list[index++];
  return result;
};

var addGetter = function (it, key) {
  nativeDefineProperty(it, key, { get: function () {
    return getInternalState(this)[key];
  } });
};

var isArrayBuffer = function (it) {
  var klass;
  return it instanceof ArrayBuffer || (klass = classof(it)) == 'ArrayBuffer' || klass == 'SharedArrayBuffer';
};

var isTypedArrayIndex = function (target, key) {
  return isTypedArray(target)
    && typeof key != 'symbol'
    && key in target
    && String(+key) == String(key);
};

var wrappedGetOwnPropertyDescriptor = function getOwnPropertyDescriptor(target, key) {
  return isTypedArrayIndex(target, key = toPrimitive(key, true))
    ? createPropertyDescriptor(2, target[key])
    : nativeGetOwnPropertyDescriptor(target, key);
};

var wrappedDefineProperty = function defineProperty(target, key, descriptor) {
  if (isTypedArrayIndex(target, key = toPrimitive(key, true))
    && isObject(descriptor)
    && has(descriptor, 'value')
    && !has(descriptor, 'get')
    && !has(descriptor, 'set')
    // TODO: add validation descriptor w/o calling accessors
    && !descriptor.configurable
    && (!has(descriptor, 'writable') || descriptor.writable)
    && (!has(descriptor, 'enumerable') || descriptor.enumerable)
  ) {
    target[key] = descriptor.value;
    return target;
  } return nativeDefineProperty(target, key, descriptor);
};

if (descriptors) {
  if (!NATIVE_ARRAY_BUFFER_VIEWS) {
    objectGetOwnPropertyDescriptor.f = wrappedGetOwnPropertyDescriptor;
    objectDefineProperty.f = wrappedDefineProperty;
    addGetter(TypedArrayPrototype, 'buffer');
    addGetter(TypedArrayPrototype, 'byteOffset');
    addGetter(TypedArrayPrototype, 'byteLength');
    addGetter(TypedArrayPrototype, 'length');
  }

  _export({ target: 'Object', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS }, {
    getOwnPropertyDescriptor: wrappedGetOwnPropertyDescriptor,
    defineProperty: wrappedDefineProperty
  });

  module.exports = function (TYPE, wrapper, CLAMPED) {
    var BYTES = TYPE.match(/\d+$/)[0] / 8;
    var CONSTRUCTOR_NAME = TYPE + (CLAMPED ? 'Clamped' : '') + 'Array';
    var GETTER = 'get' + TYPE;
    var SETTER = 'set' + TYPE;
    var NativeTypedArrayConstructor = global_1[CONSTRUCTOR_NAME];
    var TypedArrayConstructor = NativeTypedArrayConstructor;
    var TypedArrayConstructorPrototype = TypedArrayConstructor && TypedArrayConstructor.prototype;
    var exported = {};

    var getter = function (that, index) {
      var data = getInternalState(that);
      return data.view[GETTER](index * BYTES + data.byteOffset, true);
    };

    var setter = function (that, index, value) {
      var data = getInternalState(that);
      if (CLAMPED) value = (value = round(value)) < 0 ? 0 : value > 0xFF ? 0xFF : value & 0xFF;
      data.view[SETTER](index * BYTES + data.byteOffset, value, true);
    };

    var addElement = function (that, index) {
      nativeDefineProperty(that, index, {
        get: function () {
          return getter(this, index);
        },
        set: function (value) {
          return setter(this, index, value);
        },
        enumerable: true
      });
    };

    if (!NATIVE_ARRAY_BUFFER_VIEWS) {
      TypedArrayConstructor = wrapper(function (that, data, offset, $length) {
        anInstance(that, TypedArrayConstructor, CONSTRUCTOR_NAME);
        var index = 0;
        var byteOffset = 0;
        var buffer, byteLength, length;
        if (!isObject(data)) {
          length = toIndex(data);
          byteLength = length * BYTES;
          buffer = new ArrayBuffer(byteLength);
        } else if (isArrayBuffer(data)) {
          buffer = data;
          byteOffset = toOffset(offset, BYTES);
          var $len = data.byteLength;
          if ($length === undefined) {
            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
            byteLength = $len - byteOffset;
            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if (byteLength + byteOffset > $len) throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if (isTypedArray(data)) {
          return fromList(TypedArrayConstructor, data);
        } else {
          return typedArrayFrom.call(TypedArrayConstructor, data);
        }
        setInternalState(that, {
          buffer: buffer,
          byteOffset: byteOffset,
          byteLength: byteLength,
          length: length,
          view: new DataView(buffer)
        });
        while (index < length) addElement(that, index++);
      });

      if (objectSetPrototypeOf) objectSetPrototypeOf(TypedArrayConstructor, TypedArray);
      TypedArrayConstructorPrototype = TypedArrayConstructor.prototype = objectCreate(TypedArrayPrototype);
    } else if (typedArrayConstructorsRequireWrappers) {
      TypedArrayConstructor = wrapper(function (dummy, data, typedArrayOffset, $length) {
        anInstance(dummy, TypedArrayConstructor, CONSTRUCTOR_NAME);
        return inheritIfRequired(function () {
          if (!isObject(data)) return new NativeTypedArrayConstructor(toIndex(data));
          if (isArrayBuffer(data)) return $length !== undefined
            ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES), $length)
            : typedArrayOffset !== undefined
              ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES))
              : new NativeTypedArrayConstructor(data);
          if (isTypedArray(data)) return fromList(TypedArrayConstructor, data);
          return typedArrayFrom.call(TypedArrayConstructor, data);
        }(), dummy, TypedArrayConstructor);
      });

      if (objectSetPrototypeOf) objectSetPrototypeOf(TypedArrayConstructor, TypedArray);
      forEach(getOwnPropertyNames(NativeTypedArrayConstructor), function (key) {
        if (!(key in TypedArrayConstructor)) {
          createNonEnumerableProperty(TypedArrayConstructor, key, NativeTypedArrayConstructor[key]);
        }
      });
      TypedArrayConstructor.prototype = TypedArrayConstructorPrototype;
    }

    if (TypedArrayConstructorPrototype.constructor !== TypedArrayConstructor) {
      createNonEnumerableProperty(TypedArrayConstructorPrototype, 'constructor', TypedArrayConstructor);
    }

    if (TYPED_ARRAY_TAG) {
      createNonEnumerableProperty(TypedArrayConstructorPrototype, TYPED_ARRAY_TAG, CONSTRUCTOR_NAME);
    }

    exported[CONSTRUCTOR_NAME] = TypedArrayConstructor;

    _export({
      global: true, forced: TypedArrayConstructor != NativeTypedArrayConstructor, sham: !NATIVE_ARRAY_BUFFER_VIEWS
    }, exported);

    if (!(BYTES_PER_ELEMENT in TypedArrayConstructor)) {
      createNonEnumerableProperty(TypedArrayConstructor, BYTES_PER_ELEMENT, BYTES);
    }

    if (!(BYTES_PER_ELEMENT in TypedArrayConstructorPrototype)) {
      createNonEnumerableProperty(TypedArrayConstructorPrototype, BYTES_PER_ELEMENT, BYTES);
    }

    setSpecies(CONSTRUCTOR_NAME);
  };
} else module.exports = function () { /* empty */ };
});

// `Int8Array` constructor
// https://tc39.github.io/ecma262/#sec-typedarray-objects
typedArrayConstructor('Int8', function (init) {
  return function Int8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

// `Uint8Array` constructor
// https://tc39.github.io/ecma262/#sec-typedarray-objects
typedArrayConstructor('Uint8', function (init) {
  return function Uint8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

// `Uint8ClampedArray` constructor
// https://tc39.github.io/ecma262/#sec-typedarray-objects
typedArrayConstructor('Uint8', function (init) {
  return function Uint8ClampedArray(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
}, true);

// `Int16Array` constructor
// https://tc39.github.io/ecma262/#sec-typedarray-objects
typedArrayConstructor('Int16', function (init) {
  return function Int16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

// `Uint16Array` constructor
// https://tc39.github.io/ecma262/#sec-typedarray-objects
typedArrayConstructor('Uint16', function (init) {
  return function Uint16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

// `Int32Array` constructor
// https://tc39.github.io/ecma262/#sec-typedarray-objects
typedArrayConstructor('Int32', function (init) {
  return function Int32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

// `Uint32Array` constructor
// https://tc39.github.io/ecma262/#sec-typedarray-objects
typedArrayConstructor('Uint32', function (init) {
  return function Uint32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

// `Float32Array` constructor
// https://tc39.github.io/ecma262/#sec-typedarray-objects
typedArrayConstructor('Float32', function (init) {
  return function Float32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

// `Float64Array` constructor
// https://tc39.github.io/ecma262/#sec-typedarray-objects
typedArrayConstructor('Float64', function (init) {
  return function Float64Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

var exportTypedArrayStaticMethod$1 = arrayBufferViewCore.exportTypedArrayStaticMethod;


// `%TypedArray%.from` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.from
exportTypedArrayStaticMethod$1('from', typedArrayFrom, typedArrayConstructorsRequireWrappers);

var aTypedArrayConstructor$2 = arrayBufferViewCore.aTypedArrayConstructor;
var exportTypedArrayStaticMethod$2 = arrayBufferViewCore.exportTypedArrayStaticMethod;

// `%TypedArray%.of` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.of
exportTypedArrayStaticMethod$2('of', function of(/* ...items */) {
  var index = 0;
  var length = arguments.length;
  var result = new (aTypedArrayConstructor$2(this))(length);
  while (length > index) result[index] = arguments[index++];
  return result;
}, typedArrayConstructorsRequireWrappers);

var aTypedArray$1 = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$1 = arrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.copyWithin` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.copywithin
exportTypedArrayMethod$1('copyWithin', function copyWithin(target, start /* , end */) {
  return arrayCopyWithin.call(aTypedArray$1(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
});

var $every$1 = arrayIteration.every;

var aTypedArray$2 = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$2 = arrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.every` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.every
exportTypedArrayMethod$2('every', function every(callbackfn /* , thisArg */) {
  return $every$1(aTypedArray$2(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
});

var aTypedArray$3 = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$3 = arrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.fill` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.fill
// eslint-disable-next-line no-unused-vars
exportTypedArrayMethod$3('fill', function fill(value /* , start, end */) {
  return arrayFill.apply(aTypedArray$3(this), arguments);
});

var $filter$1 = arrayIteration.filter;


var aTypedArray$4 = arrayBufferViewCore.aTypedArray;
var aTypedArrayConstructor$3 = arrayBufferViewCore.aTypedArrayConstructor;
var exportTypedArrayMethod$4 = arrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.filter` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.filter
exportTypedArrayMethod$4('filter', function filter(callbackfn /* , thisArg */) {
  var list = $filter$1(aTypedArray$4(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  var C = speciesConstructor(this, this.constructor);
  var index = 0;
  var length = list.length;
  var result = new (aTypedArrayConstructor$3(C))(length);
  while (length > index) result[index] = list[index++];
  return result;
});

var $find$1 = arrayIteration.find;

var aTypedArray$5 = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$5 = arrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.find` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.find
exportTypedArrayMethod$5('find', function find(predicate /* , thisArg */) {
  return $find$1(aTypedArray$5(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
});

var $findIndex$1 = arrayIteration.findIndex;

var aTypedArray$6 = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$6 = arrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.findIndex` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.findindex
exportTypedArrayMethod$6('findIndex', function findIndex(predicate /* , thisArg */) {
  return $findIndex$1(aTypedArray$6(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
});

var $forEach$2 = arrayIteration.forEach;

var aTypedArray$7 = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$7 = arrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.forEach` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.foreach
exportTypedArrayMethod$7('forEach', function forEach(callbackfn /* , thisArg */) {
  $forEach$2(aTypedArray$7(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
});

var $includes$1 = arrayIncludes.includes;

var aTypedArray$8 = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$8 = arrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.includes` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.includes
exportTypedArrayMethod$8('includes', function includes(searchElement /* , fromIndex */) {
  return $includes$1(aTypedArray$8(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
});

var $indexOf$1 = arrayIncludes.indexOf;

var aTypedArray$9 = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$9 = arrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.indexOf` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.indexof
exportTypedArrayMethod$9('indexOf', function indexOf(searchElement /* , fromIndex */) {
  return $indexOf$1(aTypedArray$9(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
});

var ITERATOR$5 = wellKnownSymbol('iterator');
var Uint8Array = global_1.Uint8Array;
var arrayValues = es_array_iterator.values;
var arrayKeys = es_array_iterator.keys;
var arrayEntries = es_array_iterator.entries;
var aTypedArray$a = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$a = arrayBufferViewCore.exportTypedArrayMethod;
var nativeTypedArrayIterator = Uint8Array && Uint8Array.prototype[ITERATOR$5];

var CORRECT_ITER_NAME = !!nativeTypedArrayIterator
  && (nativeTypedArrayIterator.name == 'values' || nativeTypedArrayIterator.name == undefined);

var typedArrayValues = function values() {
  return arrayValues.call(aTypedArray$a(this));
};

// `%TypedArray%.prototype.entries` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.entries
exportTypedArrayMethod$a('entries', function entries() {
  return arrayEntries.call(aTypedArray$a(this));
});
// `%TypedArray%.prototype.keys` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.keys
exportTypedArrayMethod$a('keys', function keys() {
  return arrayKeys.call(aTypedArray$a(this));
});
// `%TypedArray%.prototype.values` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.values
exportTypedArrayMethod$a('values', typedArrayValues, !CORRECT_ITER_NAME);
// `%TypedArray%.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype-@@iterator
exportTypedArrayMethod$a(ITERATOR$5, typedArrayValues, !CORRECT_ITER_NAME);

var aTypedArray$b = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$b = arrayBufferViewCore.exportTypedArrayMethod;
var $join = [].join;

// `%TypedArray%.prototype.join` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.join
// eslint-disable-next-line no-unused-vars
exportTypedArrayMethod$b('join', function join(separator) {
  return $join.apply(aTypedArray$b(this), arguments);
});

var aTypedArray$c = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$c = arrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.lastIndexOf` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.lastindexof
// eslint-disable-next-line no-unused-vars
exportTypedArrayMethod$c('lastIndexOf', function lastIndexOf(searchElement /* , fromIndex */) {
  return arrayLastIndexOf.apply(aTypedArray$c(this), arguments);
});

var $map$1 = arrayIteration.map;


var aTypedArray$d = arrayBufferViewCore.aTypedArray;
var aTypedArrayConstructor$4 = arrayBufferViewCore.aTypedArrayConstructor;
var exportTypedArrayMethod$d = arrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.map` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.map
exportTypedArrayMethod$d('map', function map(mapfn /* , thisArg */) {
  return $map$1(aTypedArray$d(this), mapfn, arguments.length > 1 ? arguments[1] : undefined, function (O, length) {
    return new (aTypedArrayConstructor$4(speciesConstructor(O, O.constructor)))(length);
  });
});

var $reduce$1 = arrayReduce.left;

var aTypedArray$e = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$e = arrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.reduce` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reduce
exportTypedArrayMethod$e('reduce', function reduce(callbackfn /* , initialValue */) {
  return $reduce$1(aTypedArray$e(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
});

var $reduceRight$1 = arrayReduce.right;

var aTypedArray$f = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$f = arrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.reduceRicht` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reduceright
exportTypedArrayMethod$f('reduceRight', function reduceRight(callbackfn /* , initialValue */) {
  return $reduceRight$1(aTypedArray$f(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
});

var aTypedArray$g = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$g = arrayBufferViewCore.exportTypedArrayMethod;
var floor$7 = Math.floor;

// `%TypedArray%.prototype.reverse` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reverse
exportTypedArrayMethod$g('reverse', function reverse() {
  var that = this;
  var length = aTypedArray$g(that).length;
  var middle = floor$7(length / 2);
  var index = 0;
  var value;
  while (index < middle) {
    value = that[index];
    that[index++] = that[--length];
    that[length] = value;
  } return that;
});

var aTypedArray$h = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$h = arrayBufferViewCore.exportTypedArrayMethod;

var FORCED$h = fails(function () {
  // eslint-disable-next-line no-undef
  new Int8Array(1).set({});
});

// `%TypedArray%.prototype.set` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.set
exportTypedArrayMethod$h('set', function set(arrayLike /* , offset */) {
  aTypedArray$h(this);
  var offset = toOffset(arguments.length > 1 ? arguments[1] : undefined, 1);
  var length = this.length;
  var src = toObject(arrayLike);
  var len = toLength(src.length);
  var index = 0;
  if (len + offset > length) throw RangeError('Wrong length');
  while (index < len) this[offset + index] = src[index++];
}, FORCED$h);

var aTypedArray$i = arrayBufferViewCore.aTypedArray;
var aTypedArrayConstructor$5 = arrayBufferViewCore.aTypedArrayConstructor;
var exportTypedArrayMethod$i = arrayBufferViewCore.exportTypedArrayMethod;
var $slice = [].slice;

var FORCED$i = fails(function () {
  // eslint-disable-next-line no-undef
  new Int8Array(1).slice();
});

// `%TypedArray%.prototype.slice` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.slice
exportTypedArrayMethod$i('slice', function slice(start, end) {
  var list = $slice.call(aTypedArray$i(this), start, end);
  var C = speciesConstructor(this, this.constructor);
  var index = 0;
  var length = list.length;
  var result = new (aTypedArrayConstructor$5(C))(length);
  while (length > index) result[index] = list[index++];
  return result;
}, FORCED$i);

var $some$1 = arrayIteration.some;

var aTypedArray$j = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$j = arrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.some` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.some
exportTypedArrayMethod$j('some', function some(callbackfn /* , thisArg */) {
  return $some$1(aTypedArray$j(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
});

var aTypedArray$k = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$k = arrayBufferViewCore.exportTypedArrayMethod;
var $sort = [].sort;

// `%TypedArray%.prototype.sort` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.sort
exportTypedArrayMethod$k('sort', function sort(comparefn) {
  return $sort.call(aTypedArray$k(this), comparefn);
});

var aTypedArray$l = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$l = arrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.subarray` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.subarray
exportTypedArrayMethod$l('subarray', function subarray(begin, end) {
  var O = aTypedArray$l(this);
  var length = O.length;
  var beginIndex = toAbsoluteIndex(begin, length);
  return new (speciesConstructor(O, O.constructor))(
    O.buffer,
    O.byteOffset + beginIndex * O.BYTES_PER_ELEMENT,
    toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - beginIndex)
  );
});

var Int8Array$3 = global_1.Int8Array;
var aTypedArray$m = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$m = arrayBufferViewCore.exportTypedArrayMethod;
var $toLocaleString = [].toLocaleString;
var $slice$1 = [].slice;

// iOS Safari 6.x fails here
var TO_LOCALE_STRING_BUG = !!Int8Array$3 && fails(function () {
  $toLocaleString.call(new Int8Array$3(1));
});

var FORCED$j = fails(function () {
  return [1, 2].toLocaleString() != new Int8Array$3([1, 2]).toLocaleString();
}) || !fails(function () {
  Int8Array$3.prototype.toLocaleString.call([1, 2]);
});

// `%TypedArray%.prototype.toLocaleString` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.tolocalestring
exportTypedArrayMethod$m('toLocaleString', function toLocaleString() {
  return $toLocaleString.apply(TO_LOCALE_STRING_BUG ? $slice$1.call(aTypedArray$m(this)) : aTypedArray$m(this), arguments);
}, FORCED$j);

var exportTypedArrayMethod$n = arrayBufferViewCore.exportTypedArrayMethod;



var Uint8Array$1 = global_1.Uint8Array;
var Uint8ArrayPrototype = Uint8Array$1 && Uint8Array$1.prototype || {};
var arrayToString = [].toString;
var arrayJoin = [].join;

if (fails(function () { arrayToString.call({}); })) {
  arrayToString = function toString() {
    return arrayJoin.call(this);
  };
}

var IS_NOT_ARRAY_METHOD = Uint8ArrayPrototype.toString != arrayToString;

// `%TypedArray%.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.tostring
exportTypedArrayMethod$n('toString', arrayToString, IS_NOT_ARRAY_METHOD);

var nativeApply = getBuiltIn('Reflect', 'apply');
var functionApply = Function.apply;

// MS Edge argumentsList argument is optional
var OPTIONAL_ARGUMENTS_LIST = !fails(function () {
  nativeApply(function () { /* empty */ });
});

// `Reflect.apply` method
// https://tc39.github.io/ecma262/#sec-reflect.apply
_export({ target: 'Reflect', stat: true, forced: OPTIONAL_ARGUMENTS_LIST }, {
  apply: function apply(target, thisArgument, argumentsList) {
    aFunction$1(target);
    anObject(argumentsList);
    return nativeApply
      ? nativeApply(target, thisArgument, argumentsList)
      : functionApply.call(target, thisArgument, argumentsList);
  }
});

var nativeConstruct = getBuiltIn('Reflect', 'construct');

// `Reflect.construct` method
// https://tc39.github.io/ecma262/#sec-reflect.construct
// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function () {
  function F() { /* empty */ }
  return !(nativeConstruct(function () { /* empty */ }, [], F) instanceof F);
});
var ARGS_BUG = !fails(function () {
  nativeConstruct(function () { /* empty */ });
});
var FORCED$k = NEW_TARGET_BUG || ARGS_BUG;

_export({ target: 'Reflect', stat: true, forced: FORCED$k, sham: FORCED$k }, {
  construct: function construct(Target, args /* , newTarget */) {
    aFunction$1(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aFunction$1(arguments[2]);
    if (ARGS_BUG && !NEW_TARGET_BUG) return nativeConstruct(Target, args, newTarget);
    if (Target == newTarget) {
      // w/o altered newTarget, optimization for 0-4 arguments
      switch (args.length) {
        case 0: return new Target();
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (functionBind.apply(Target, $args))();
    }
    // with altered newTarget, not support built-in constructors
    var proto = newTarget.prototype;
    var instance = objectCreate(isObject(proto) ? proto : Object.prototype);
    var result = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
var ERROR_INSTEAD_OF_FALSE = fails(function () {
  // eslint-disable-next-line no-undef
  Reflect.defineProperty(objectDefineProperty.f({}, 1, { value: 1 }), 1, { value: 2 });
});

// `Reflect.defineProperty` method
// https://tc39.github.io/ecma262/#sec-reflect.defineproperty
_export({ target: 'Reflect', stat: true, forced: ERROR_INSTEAD_OF_FALSE, sham: !descriptors }, {
  defineProperty: function defineProperty(target, propertyKey, attributes) {
    anObject(target);
    var key = toPrimitive(propertyKey, true);
    anObject(attributes);
    try {
      objectDefineProperty.f(target, key, attributes);
      return true;
    } catch (error) {
      return false;
    }
  }
});

var getOwnPropertyDescriptor$8 = objectGetOwnPropertyDescriptor.f;

// `Reflect.deleteProperty` method
// https://tc39.github.io/ecma262/#sec-reflect.deleteproperty
_export({ target: 'Reflect', stat: true }, {
  deleteProperty: function deleteProperty(target, propertyKey) {
    var descriptor = getOwnPropertyDescriptor$8(anObject(target), propertyKey);
    return descriptor && !descriptor.configurable ? false : delete target[propertyKey];
  }
});

// `Reflect.get` method
// https://tc39.github.io/ecma262/#sec-reflect.get
function get$2(target, propertyKey /* , receiver */) {
  var receiver = arguments.length < 3 ? target : arguments[2];
  var descriptor, prototype;
  if (anObject(target) === receiver) return target[propertyKey];
  if (descriptor = objectGetOwnPropertyDescriptor.f(target, propertyKey)) return has(descriptor, 'value')
    ? descriptor.value
    : descriptor.get === undefined
      ? undefined
      : descriptor.get.call(receiver);
  if (isObject(prototype = objectGetPrototypeOf(target))) return get$2(prototype, propertyKey, receiver);
}

_export({ target: 'Reflect', stat: true }, {
  get: get$2
});

// `Reflect.getOwnPropertyDescriptor` method
// https://tc39.github.io/ecma262/#sec-reflect.getownpropertydescriptor
_export({ target: 'Reflect', stat: true, sham: !descriptors }, {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
    return objectGetOwnPropertyDescriptor.f(anObject(target), propertyKey);
  }
});

// `Reflect.getPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-reflect.getprototypeof
_export({ target: 'Reflect', stat: true, sham: !correctPrototypeGetter }, {
  getPrototypeOf: function getPrototypeOf(target) {
    return objectGetPrototypeOf(anObject(target));
  }
});

// `Reflect.has` method
// https://tc39.github.io/ecma262/#sec-reflect.has
_export({ target: 'Reflect', stat: true }, {
  has: function has(target, propertyKey) {
    return propertyKey in target;
  }
});

var objectIsExtensible = Object.isExtensible;

// `Reflect.isExtensible` method
// https://tc39.github.io/ecma262/#sec-reflect.isextensible
_export({ target: 'Reflect', stat: true }, {
  isExtensible: function isExtensible(target) {
    anObject(target);
    return objectIsExtensible ? objectIsExtensible(target) : true;
  }
});

// `Reflect.ownKeys` method
// https://tc39.github.io/ecma262/#sec-reflect.ownkeys
_export({ target: 'Reflect', stat: true }, {
  ownKeys: ownKeys
});

// `Reflect.preventExtensions` method
// https://tc39.github.io/ecma262/#sec-reflect.preventextensions
_export({ target: 'Reflect', stat: true, sham: !freezing }, {
  preventExtensions: function preventExtensions(target) {
    anObject(target);
    try {
      var objectPreventExtensions = getBuiltIn('Object', 'preventExtensions');
      if (objectPreventExtensions) objectPreventExtensions(target);
      return true;
    } catch (error) {
      return false;
    }
  }
});

// `Reflect.set` method
// https://tc39.github.io/ecma262/#sec-reflect.set
function set$3(target, propertyKey, V /* , receiver */) {
  var receiver = arguments.length < 4 ? target : arguments[3];
  var ownDescriptor = objectGetOwnPropertyDescriptor.f(anObject(target), propertyKey);
  var existingDescriptor, prototype;
  if (!ownDescriptor) {
    if (isObject(prototype = objectGetPrototypeOf(target))) {
      return set$3(prototype, propertyKey, V, receiver);
    }
    ownDescriptor = createPropertyDescriptor(0);
  }
  if (has(ownDescriptor, 'value')) {
    if (ownDescriptor.writable === false || !isObject(receiver)) return false;
    if (existingDescriptor = objectGetOwnPropertyDescriptor.f(receiver, propertyKey)) {
      if (existingDescriptor.get || existingDescriptor.set || existingDescriptor.writable === false) return false;
      existingDescriptor.value = V;
      objectDefineProperty.f(receiver, propertyKey, existingDescriptor);
    } else objectDefineProperty.f(receiver, propertyKey, createPropertyDescriptor(0, V));
    return true;
  }
  return ownDescriptor.set === undefined ? false : (ownDescriptor.set.call(receiver, V), true);
}

// MS Edge 17-18 Reflect.set allows setting the property to object
// with non-writable property on the prototype
var MS_EDGE_BUG = fails(function () {
  var object = objectDefineProperty.f({}, 'a', { configurable: true });
  // eslint-disable-next-line no-undef
  return Reflect.set(objectGetPrototypeOf(object), 'a', 1, object) !== false;
});

_export({ target: 'Reflect', stat: true, forced: MS_EDGE_BUG }, {
  set: set$3
});

// `Reflect.setPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-reflect.setprototypeof
if (objectSetPrototypeOf) _export({ target: 'Reflect', stat: true }, {
  setPrototypeOf: function setPrototypeOf(target, proto) {
    anObject(target);
    aPossiblePrototype(proto);
    try {
      objectSetPrototypeOf(target, proto);
      return true;
    } catch (error) {
      return false;
    }
  }
});

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
var domIterables = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};

for (var COLLECTION_NAME in domIterables) {
  var Collection = global_1[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  // some Chrome versions have non-configurable methods on DOMTokenList
  if (CollectionPrototype && CollectionPrototype.forEach !== arrayForEach) try {
    createNonEnumerableProperty(CollectionPrototype, 'forEach', arrayForEach);
  } catch (error) {
    CollectionPrototype.forEach = arrayForEach;
  }
}

var ITERATOR$6 = wellKnownSymbol('iterator');
var TO_STRING_TAG$4 = wellKnownSymbol('toStringTag');
var ArrayValues = es_array_iterator.values;

for (var COLLECTION_NAME$1 in domIterables) {
  var Collection$1 = global_1[COLLECTION_NAME$1];
  var CollectionPrototype$1 = Collection$1 && Collection$1.prototype;
  if (CollectionPrototype$1) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype$1[ITERATOR$6] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype$1, ITERATOR$6, ArrayValues);
    } catch (error) {
      CollectionPrototype$1[ITERATOR$6] = ArrayValues;
    }
    if (!CollectionPrototype$1[TO_STRING_TAG$4]) {
      createNonEnumerableProperty(CollectionPrototype$1, TO_STRING_TAG$4, COLLECTION_NAME$1);
    }
    if (domIterables[COLLECTION_NAME$1]) for (var METHOD_NAME in es_array_iterator) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype$1[METHOD_NAME] !== es_array_iterator[METHOD_NAME]) try {
        createNonEnumerableProperty(CollectionPrototype$1, METHOD_NAME, es_array_iterator[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype$1[METHOD_NAME] = es_array_iterator[METHOD_NAME];
      }
    }
  }
}

var FORCED$l = !global_1.setImmediate || !global_1.clearImmediate;

// http://w3c.github.io/setImmediate/
_export({ global: true, bind: true, enumerable: true, forced: FORCED$l }, {
  // `setImmediate` method
  // http://w3c.github.io/setImmediate/#si-setImmediate
  setImmediate: task.set,
  // `clearImmediate` method
  // http://w3c.github.io/setImmediate/#si-clearImmediate
  clearImmediate: task.clear
});

var process$4 = global_1.process;
var isNode = classofRaw(process$4) == 'process';

// `queueMicrotask` method
// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-queuemicrotask
_export({ global: true, enumerable: true, noTargetGet: true }, {
  queueMicrotask: function queueMicrotask(fn) {
    var domain = isNode && process$4.domain;
    microtask(domain ? domain.bind(fn) : fn);
  }
});

var ITERATOR$7 = wellKnownSymbol('iterator');

var nativeUrl = !fails(function () {
  var url = new URL('b?a=1&b=2&c=3', 'http://a');
  var searchParams = url.searchParams;
  var result = '';
  url.pathname = 'c%20d';
  searchParams.forEach(function (value, key) {
    searchParams['delete']('b');
    result += key + value;
  });
  return (isPure && !url.toJSON)
    || !searchParams.sort
    || url.href !== 'http://a/c%20d?a=1&c=3'
    || searchParams.get('c') !== '3'
    || String(new URLSearchParams('?a=1')) !== 'a=1'
    || !searchParams[ITERATOR$7]
    // throws in Edge
    || new URL('https://a@b').username !== 'a'
    || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
    // not punycoded in Edge
    || new URL('http://тест').host !== 'xn--e1aybc'
    // not escaped in Chrome 62-
    || new URL('http://a#б').hash !== '#%D0%B1'
    // fails in Chrome 66-
    || result !== 'a1c3'
    // throws in Safari
    || new URL('http://x', undefined).host !== 'x';
});

// based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js
var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
var base = 36;
var tMin = 1;
var tMax = 26;
var skew = 38;
var damp = 700;
var initialBias = 72;
var initialN = 128; // 0x80
var delimiter = '-'; // '\x2D'
var regexNonASCII = /[^\0-\u007E]/; // non-ASCII chars
var regexSeparators = /[.\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
var OVERFLOW_ERROR = 'Overflow: input needs wider integers to process';
var baseMinusTMin = base - tMin;
var floor$8 = Math.floor;
var stringFromCharCode = String.fromCharCode;

/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 */
var ucs2decode = function (string) {
  var output = [];
  var counter = 0;
  var length = string.length;
  while (counter < length) {
    var value = string.charCodeAt(counter++);
    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
      // It's a high surrogate, and there is a next character.
      var extra = string.charCodeAt(counter++);
      if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
        output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
      } else {
        // It's an unmatched surrogate; only append this code unit, in case the
        // next code unit is the high surrogate of a surrogate pair.
        output.push(value);
        counter--;
      }
    } else {
      output.push(value);
    }
  }
  return output;
};

/**
 * Converts a digit/integer into a basic code point.
 */
var digitToBasic = function (digit) {
  //  0..25 map to ASCII a..z or A..Z
  // 26..35 map to ASCII 0..9
  return digit + 22 + 75 * (digit < 26);
};

/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 */
var adapt = function (delta, numPoints, firstTime) {
  var k = 0;
  delta = firstTime ? floor$8(delta / damp) : delta >> 1;
  delta += floor$8(delta / numPoints);
  for (; delta > baseMinusTMin * tMax >> 1; k += base) {
    delta = floor$8(delta / baseMinusTMin);
  }
  return floor$8(k + (baseMinusTMin + 1) * delta / (delta + skew));
};

/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 */
// eslint-disable-next-line  max-statements
var encode = function (input) {
  var output = [];

  // Convert the input in UCS-2 to an array of Unicode code points.
  input = ucs2decode(input);

  // Cache the length.
  var inputLength = input.length;

  // Initialize the state.
  var n = initialN;
  var delta = 0;
  var bias = initialBias;
  var i, currentValue;

  // Handle the basic code points.
  for (i = 0; i < input.length; i++) {
    currentValue = input[i];
    if (currentValue < 0x80) {
      output.push(stringFromCharCode(currentValue));
    }
  }

  var basicLength = output.length; // number of basic code points.
  var handledCPCount = basicLength; // number of code points that have been handled;

  // Finish the basic string with a delimiter unless it's empty.
  if (basicLength) {
    output.push(delimiter);
  }

  // Main encoding loop:
  while (handledCPCount < inputLength) {
    // All non-basic code points < n have been handled already. Find the next larger one:
    var m = maxInt;
    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue >= n && currentValue < m) {
        m = currentValue;
      }
    }

    // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.
    var handledCPCountPlusOne = handledCPCount + 1;
    if (m - n > floor$8((maxInt - delta) / handledCPCountPlusOne)) {
      throw RangeError(OVERFLOW_ERROR);
    }

    delta += (m - n) * handledCPCountPlusOne;
    n = m;

    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue < n && ++delta > maxInt) {
        throw RangeError(OVERFLOW_ERROR);
      }
      if (currentValue == n) {
        // Represent delta as a generalized variable-length integer.
        var q = delta;
        for (var k = base; /* no condition */; k += base) {
          var t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
          if (q < t) break;
          var qMinusT = q - t;
          var baseMinusT = base - t;
          output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT)));
          q = floor$8(qMinusT / baseMinusT);
        }

        output.push(stringFromCharCode(digitToBasic(q)));
        bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
        delta = 0;
        ++handledCPCount;
      }
    }

    ++delta;
    ++n;
  }
  return output.join('');
};

var stringPunycodeToAscii = function (input) {
  var encoded = [];
  var labels = input.toLowerCase().replace(regexSeparators, '\u002E').split('.');
  var i, label;
  for (i = 0; i < labels.length; i++) {
    label = labels[i];
    encoded.push(regexNonASCII.test(label) ? 'xn--' + encode(label) : label);
  }
  return encoded.join('.');
};

var getIterator = function (it) {
  var iteratorMethod = getIteratorMethod(it);
  if (typeof iteratorMethod != 'function') {
    throw TypeError(String(it) + ' is not iterable');
  } return anObject(iteratorMethod.call(it));
};

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`





















var $fetch$1 = getBuiltIn('fetch');
var Headers = getBuiltIn('Headers');
var ITERATOR$8 = wellKnownSymbol('iterator');
var URL_SEARCH_PARAMS = 'URLSearchParams';
var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
var setInternalState$9 = internalState.set;
var getInternalParamsState = internalState.getterFor(URL_SEARCH_PARAMS);
var getInternalIteratorState = internalState.getterFor(URL_SEARCH_PARAMS_ITERATOR);

var plus = /\+/g;
var sequences = Array(4);

var percentSequence = function (bytes) {
  return sequences[bytes - 1] || (sequences[bytes - 1] = RegExp('((?:%[\\da-f]{2}){' + bytes + '})', 'gi'));
};

var percentDecode = function (sequence) {
  try {
    return decodeURIComponent(sequence);
  } catch (error) {
    return sequence;
  }
};

var deserialize = function (it) {
  var result = it.replace(plus, ' ');
  var bytes = 4;
  try {
    return decodeURIComponent(result);
  } catch (error) {
    while (bytes) {
      result = result.replace(percentSequence(bytes--), percentDecode);
    }
    return result;
  }
};

var find$1 = /[!'()~]|%20/g;

var replace = {
  '!': '%21',
  "'": '%27',
  '(': '%28',
  ')': '%29',
  '~': '%7E',
  '%20': '+'
};

var replacer = function (match) {
  return replace[match];
};

var serialize = function (it) {
  return encodeURIComponent(it).replace(find$1, replacer);
};

var parseSearchParams = function (result, query) {
  if (query) {
    var attributes = query.split('&');
    var index = 0;
    var attribute, entry;
    while (index < attributes.length) {
      attribute = attributes[index++];
      if (attribute.length) {
        entry = attribute.split('=');
        result.push({
          key: deserialize(entry.shift()),
          value: deserialize(entry.join('='))
        });
      }
    }
  }
};

var updateSearchParams = function (query) {
  this.entries.length = 0;
  parseSearchParams(this.entries, query);
};

var validateArgumentsLength = function (passed, required) {
  if (passed < required) throw TypeError('Not enough arguments');
};

var URLSearchParamsIterator = createIteratorConstructor(function Iterator(params, kind) {
  setInternalState$9(this, {
    type: URL_SEARCH_PARAMS_ITERATOR,
    iterator: getIterator(getInternalParamsState(params).entries),
    kind: kind
  });
}, 'Iterator', function next() {
  var state = getInternalIteratorState(this);
  var kind = state.kind;
  var step = state.iterator.next();
  var entry = step.value;
  if (!step.done) {
    step.value = kind === 'keys' ? entry.key : kind === 'values' ? entry.value : [entry.key, entry.value];
  } return step;
});

// `URLSearchParams` constructor
// https://url.spec.whatwg.org/#interface-urlsearchparams
var URLSearchParamsConstructor = function URLSearchParams(/* init */) {
  anInstance(this, URLSearchParamsConstructor, URL_SEARCH_PARAMS);
  var init = arguments.length > 0 ? arguments[0] : undefined;
  var that = this;
  var entries = [];
  var iteratorMethod, iterator, next, step, entryIterator, entryNext, first, second, key;

  setInternalState$9(that, {
    type: URL_SEARCH_PARAMS,
    entries: entries,
    updateURL: function () { /* empty */ },
    updateSearchParams: updateSearchParams
  });

  if (init !== undefined) {
    if (isObject(init)) {
      iteratorMethod = getIteratorMethod(init);
      if (typeof iteratorMethod === 'function') {
        iterator = iteratorMethod.call(init);
        next = iterator.next;
        while (!(step = next.call(iterator)).done) {
          entryIterator = getIterator(anObject(step.value));
          entryNext = entryIterator.next;
          if (
            (first = entryNext.call(entryIterator)).done ||
            (second = entryNext.call(entryIterator)).done ||
            !entryNext.call(entryIterator).done
          ) throw TypeError('Expected sequence with length 2');
          entries.push({ key: first.value + '', value: second.value + '' });
        }
      } else for (key in init) if (has(init, key)) entries.push({ key: key, value: init[key] + '' });
    } else {
      parseSearchParams(entries, typeof init === 'string' ? init.charAt(0) === '?' ? init.slice(1) : init : init + '');
    }
  }
};

var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;

redefineAll(URLSearchParamsPrototype, {
  // `URLSearchParams.prototype.appent` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-append
  append: function append(name, value) {
    validateArgumentsLength(arguments.length, 2);
    var state = getInternalParamsState(this);
    state.entries.push({ key: name + '', value: value + '' });
    state.updateURL();
  },
  // `URLSearchParams.prototype.delete` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
  'delete': function (name) {
    validateArgumentsLength(arguments.length, 1);
    var state = getInternalParamsState(this);
    var entries = state.entries;
    var key = name + '';
    var index = 0;
    while (index < entries.length) {
      if (entries[index].key === key) entries.splice(index, 1);
      else index++;
    }
    state.updateURL();
  },
  // `URLSearchParams.prototype.get` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-get
  get: function get(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = name + '';
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) return entries[index].value;
    }
    return null;
  },
  // `URLSearchParams.prototype.getAll` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
  getAll: function getAll(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = name + '';
    var result = [];
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) result.push(entries[index].value);
    }
    return result;
  },
  // `URLSearchParams.prototype.has` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-has
  has: function has(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = name + '';
    var index = 0;
    while (index < entries.length) {
      if (entries[index++].key === key) return true;
    }
    return false;
  },
  // `URLSearchParams.prototype.set` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-set
  set: function set(name, value) {
    validateArgumentsLength(arguments.length, 1);
    var state = getInternalParamsState(this);
    var entries = state.entries;
    var found = false;
    var key = name + '';
    var val = value + '';
    var index = 0;
    var entry;
    for (; index < entries.length; index++) {
      entry = entries[index];
      if (entry.key === key) {
        if (found) entries.splice(index--, 1);
        else {
          found = true;
          entry.value = val;
        }
      }
    }
    if (!found) entries.push({ key: key, value: val });
    state.updateURL();
  },
  // `URLSearchParams.prototype.sort` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
  sort: function sort() {
    var state = getInternalParamsState(this);
    var entries = state.entries;
    // Array#sort is not stable in some engines
    var slice = entries.slice();
    var entry, entriesIndex, sliceIndex;
    entries.length = 0;
    for (sliceIndex = 0; sliceIndex < slice.length; sliceIndex++) {
      entry = slice[sliceIndex];
      for (entriesIndex = 0; entriesIndex < sliceIndex; entriesIndex++) {
        if (entries[entriesIndex].key > entry.key) {
          entries.splice(entriesIndex, 0, entry);
          break;
        }
      }
      if (entriesIndex === sliceIndex) entries.push(entry);
    }
    state.updateURL();
  },
  // `URLSearchParams.prototype.forEach` method
  forEach: function forEach(callback /* , thisArg */) {
    var entries = getInternalParamsState(this).entries;
    var boundFunction = functionBindContext(callback, arguments.length > 1 ? arguments[1] : undefined, 3);
    var index = 0;
    var entry;
    while (index < entries.length) {
      entry = entries[index++];
      boundFunction(entry.value, entry.key, this);
    }
  },
  // `URLSearchParams.prototype.keys` method
  keys: function keys() {
    return new URLSearchParamsIterator(this, 'keys');
  },
  // `URLSearchParams.prototype.values` method
  values: function values() {
    return new URLSearchParamsIterator(this, 'values');
  },
  // `URLSearchParams.prototype.entries` method
  entries: function entries() {
    return new URLSearchParamsIterator(this, 'entries');
  }
}, { enumerable: true });

// `URLSearchParams.prototype[@@iterator]` method
redefine(URLSearchParamsPrototype, ITERATOR$8, URLSearchParamsPrototype.entries);

// `URLSearchParams.prototype.toString` method
// https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
redefine(URLSearchParamsPrototype, 'toString', function toString() {
  var entries = getInternalParamsState(this).entries;
  var result = [];
  var index = 0;
  var entry;
  while (index < entries.length) {
    entry = entries[index++];
    result.push(serialize(entry.key) + '=' + serialize(entry.value));
  } return result.join('&');
}, { enumerable: true });

setToStringTag(URLSearchParamsConstructor, URL_SEARCH_PARAMS);

_export({ global: true, forced: !nativeUrl }, {
  URLSearchParams: URLSearchParamsConstructor
});

// Wrap `fetch` for correct work with polyfilled `URLSearchParams`
// https://github.com/zloirock/core-js/issues/674
if (!nativeUrl && typeof $fetch$1 == 'function' && typeof Headers == 'function') {
  _export({ global: true, enumerable: true, forced: true }, {
    fetch: function fetch(input /* , init */) {
      var args = [input];
      var init, body, headers;
      if (arguments.length > 1) {
        init = arguments[1];
        if (isObject(init)) {
          body = init.body;
          if (classof(body) === URL_SEARCH_PARAMS) {
            headers = init.headers ? new Headers(init.headers) : new Headers();
            if (!headers.has('content-type')) {
              headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
            }
            init = objectCreate(init, {
              body: createPropertyDescriptor(0, String(body)),
              headers: createPropertyDescriptor(0, headers)
            });
          }
        }
        args.push(init);
      } return $fetch$1.apply(this, args);
    }
  });
}

var web_urlSearchParams = {
  URLSearchParams: URLSearchParamsConstructor,
  getState: getInternalParamsState
};

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`











var codeAt$1 = stringMultibyte.codeAt;





var NativeURL = global_1.URL;
var URLSearchParams$1 = web_urlSearchParams.URLSearchParams;
var getInternalSearchParamsState = web_urlSearchParams.getState;
var setInternalState$a = internalState.set;
var getInternalURLState = internalState.getterFor('URL');
var floor$9 = Math.floor;
var pow$4 = Math.pow;

var INVALID_AUTHORITY = 'Invalid authority';
var INVALID_SCHEME = 'Invalid scheme';
var INVALID_HOST = 'Invalid host';
var INVALID_PORT = 'Invalid port';

var ALPHA = /[A-Za-z]/;
var ALPHANUMERIC = /[\d+-.A-Za-z]/;
var DIGIT = /\d/;
var HEX_START = /^(0x|0X)/;
var OCT = /^[0-7]+$/;
var DEC = /^\d+$/;
var HEX = /^[\dA-Fa-f]+$/;
// eslint-disable-next-line no-control-regex
var FORBIDDEN_HOST_CODE_POINT = /[\u0000\u0009\u000A\u000D #%/:?@[\\]]/;
// eslint-disable-next-line no-control-regex
var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT = /[\u0000\u0009\u000A\u000D #/:?@[\\]]/;
// eslint-disable-next-line no-control-regex
var LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE = /^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g;
// eslint-disable-next-line no-control-regex
var TAB_AND_NEW_LINE = /[\u0009\u000A\u000D]/g;
var EOF;

var parseHost = function (url, input) {
  var result, codePoints, index;
  if (input.charAt(0) == '[') {
    if (input.charAt(input.length - 1) != ']') return INVALID_HOST;
    result = parseIPv6(input.slice(1, -1));
    if (!result) return INVALID_HOST;
    url.host = result;
  // opaque host
  } else if (!isSpecial(url)) {
    if (FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT.test(input)) return INVALID_HOST;
    result = '';
    codePoints = arrayFrom(input);
    for (index = 0; index < codePoints.length; index++) {
      result += percentEncode(codePoints[index], C0ControlPercentEncodeSet);
    }
    url.host = result;
  } else {
    input = stringPunycodeToAscii(input);
    if (FORBIDDEN_HOST_CODE_POINT.test(input)) return INVALID_HOST;
    result = parseIPv4(input);
    if (result === null) return INVALID_HOST;
    url.host = result;
  }
};

var parseIPv4 = function (input) {
  var parts = input.split('.');
  var partsLength, numbers, index, part, radix, number, ipv4;
  if (parts.length && parts[parts.length - 1] == '') {
    parts.pop();
  }
  partsLength = parts.length;
  if (partsLength > 4) return input;
  numbers = [];
  for (index = 0; index < partsLength; index++) {
    part = parts[index];
    if (part == '') return input;
    radix = 10;
    if (part.length > 1 && part.charAt(0) == '0') {
      radix = HEX_START.test(part) ? 16 : 8;
      part = part.slice(radix == 8 ? 1 : 2);
    }
    if (part === '') {
      number = 0;
    } else {
      if (!(radix == 10 ? DEC : radix == 8 ? OCT : HEX).test(part)) return input;
      number = parseInt(part, radix);
    }
    numbers.push(number);
  }
  for (index = 0; index < partsLength; index++) {
    number = numbers[index];
    if (index == partsLength - 1) {
      if (number >= pow$4(256, 5 - partsLength)) return null;
    } else if (number > 255) return null;
  }
  ipv4 = numbers.pop();
  for (index = 0; index < numbers.length; index++) {
    ipv4 += numbers[index] * pow$4(256, 3 - index);
  }
  return ipv4;
};

// eslint-disable-next-line max-statements
var parseIPv6 = function (input) {
  var address = [0, 0, 0, 0, 0, 0, 0, 0];
  var pieceIndex = 0;
  var compress = null;
  var pointer = 0;
  var value, length, numbersSeen, ipv4Piece, number, swaps, swap;

  var char = function () {
    return input.charAt(pointer);
  };

  if (char() == ':') {
    if (input.charAt(1) != ':') return;
    pointer += 2;
    pieceIndex++;
    compress = pieceIndex;
  }
  while (char()) {
    if (pieceIndex == 8) return;
    if (char() == ':') {
      if (compress !== null) return;
      pointer++;
      pieceIndex++;
      compress = pieceIndex;
      continue;
    }
    value = length = 0;
    while (length < 4 && HEX.test(char())) {
      value = value * 16 + parseInt(char(), 16);
      pointer++;
      length++;
    }
    if (char() == '.') {
      if (length == 0) return;
      pointer -= length;
      if (pieceIndex > 6) return;
      numbersSeen = 0;
      while (char()) {
        ipv4Piece = null;
        if (numbersSeen > 0) {
          if (char() == '.' && numbersSeen < 4) pointer++;
          else return;
        }
        if (!DIGIT.test(char())) return;
        while (DIGIT.test(char())) {
          number = parseInt(char(), 10);
          if (ipv4Piece === null) ipv4Piece = number;
          else if (ipv4Piece == 0) return;
          else ipv4Piece = ipv4Piece * 10 + number;
          if (ipv4Piece > 255) return;
          pointer++;
        }
        address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
        numbersSeen++;
        if (numbersSeen == 2 || numbersSeen == 4) pieceIndex++;
      }
      if (numbersSeen != 4) return;
      break;
    } else if (char() == ':') {
      pointer++;
      if (!char()) return;
    } else if (char()) return;
    address[pieceIndex++] = value;
  }
  if (compress !== null) {
    swaps = pieceIndex - compress;
    pieceIndex = 7;
    while (pieceIndex != 0 && swaps > 0) {
      swap = address[pieceIndex];
      address[pieceIndex--] = address[compress + swaps - 1];
      address[compress + --swaps] = swap;
    }
  } else if (pieceIndex != 8) return;
  return address;
};

var findLongestZeroSequence = function (ipv6) {
  var maxIndex = null;
  var maxLength = 1;
  var currStart = null;
  var currLength = 0;
  var index = 0;
  for (; index < 8; index++) {
    if (ipv6[index] !== 0) {
      if (currLength > maxLength) {
        maxIndex = currStart;
        maxLength = currLength;
      }
      currStart = null;
      currLength = 0;
    } else {
      if (currStart === null) currStart = index;
      ++currLength;
    }
  }
  if (currLength > maxLength) {
    maxIndex = currStart;
    maxLength = currLength;
  }
  return maxIndex;
};

var serializeHost = function (host) {
  var result, index, compress, ignore0;
  // ipv4
  if (typeof host == 'number') {
    result = [];
    for (index = 0; index < 4; index++) {
      result.unshift(host % 256);
      host = floor$9(host / 256);
    } return result.join('.');
  // ipv6
  } else if (typeof host == 'object') {
    result = '';
    compress = findLongestZeroSequence(host);
    for (index = 0; index < 8; index++) {
      if (ignore0 && host[index] === 0) continue;
      if (ignore0) ignore0 = false;
      if (compress === index) {
        result += index ? ':' : '::';
        ignore0 = true;
      } else {
        result += host[index].toString(16);
        if (index < 7) result += ':';
      }
    }
    return '[' + result + ']';
  } return host;
};

var C0ControlPercentEncodeSet = {};
var fragmentPercentEncodeSet = objectAssign({}, C0ControlPercentEncodeSet, {
  ' ': 1, '"': 1, '<': 1, '>': 1, '`': 1
});
var pathPercentEncodeSet = objectAssign({}, fragmentPercentEncodeSet, {
  '#': 1, '?': 1, '{': 1, '}': 1
});
var userinfoPercentEncodeSet = objectAssign({}, pathPercentEncodeSet, {
  '/': 1, ':': 1, ';': 1, '=': 1, '@': 1, '[': 1, '\\': 1, ']': 1, '^': 1, '|': 1
});

var percentEncode = function (char, set) {
  var code = codeAt$1(char, 0);
  return code > 0x20 && code < 0x7F && !has(set, char) ? char : encodeURIComponent(char);
};

var specialSchemes = {
  ftp: 21,
  file: null,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443
};

var isSpecial = function (url) {
  return has(specialSchemes, url.scheme);
};

var includesCredentials = function (url) {
  return url.username != '' || url.password != '';
};

var cannotHaveUsernamePasswordPort = function (url) {
  return !url.host || url.cannotBeABaseURL || url.scheme == 'file';
};

var isWindowsDriveLetter = function (string, normalized) {
  var second;
  return string.length == 2 && ALPHA.test(string.charAt(0))
    && ((second = string.charAt(1)) == ':' || (!normalized && second == '|'));
};

var startsWithWindowsDriveLetter = function (string) {
  var third;
  return string.length > 1 && isWindowsDriveLetter(string.slice(0, 2)) && (
    string.length == 2 ||
    ((third = string.charAt(2)) === '/' || third === '\\' || third === '?' || third === '#')
  );
};

var shortenURLsPath = function (url) {
  var path = url.path;
  var pathSize = path.length;
  if (pathSize && (url.scheme != 'file' || pathSize != 1 || !isWindowsDriveLetter(path[0], true))) {
    path.pop();
  }
};

var isSingleDot = function (segment) {
  return segment === '.' || segment.toLowerCase() === '%2e';
};

var isDoubleDot = function (segment) {
  segment = segment.toLowerCase();
  return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
};

// States:
var SCHEME_START = {};
var SCHEME = {};
var NO_SCHEME = {};
var SPECIAL_RELATIVE_OR_AUTHORITY = {};
var PATH_OR_AUTHORITY = {};
var RELATIVE = {};
var RELATIVE_SLASH = {};
var SPECIAL_AUTHORITY_SLASHES = {};
var SPECIAL_AUTHORITY_IGNORE_SLASHES = {};
var AUTHORITY = {};
var HOST = {};
var HOSTNAME = {};
var PORT = {};
var FILE = {};
var FILE_SLASH = {};
var FILE_HOST = {};
var PATH_START = {};
var PATH = {};
var CANNOT_BE_A_BASE_URL_PATH = {};
var QUERY = {};
var FRAGMENT = {};

// eslint-disable-next-line max-statements
var parseURL = function (url, input, stateOverride, base) {
  var state = stateOverride || SCHEME_START;
  var pointer = 0;
  var buffer = '';
  var seenAt = false;
  var seenBracket = false;
  var seenPasswordToken = false;
  var codePoints, char, bufferCodePoints, failure;

  if (!stateOverride) {
    url.scheme = '';
    url.username = '';
    url.password = '';
    url.host = null;
    url.port = null;
    url.path = [];
    url.query = null;
    url.fragment = null;
    url.cannotBeABaseURL = false;
    input = input.replace(LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE, '');
  }

  input = input.replace(TAB_AND_NEW_LINE, '');

  codePoints = arrayFrom(input);

  while (pointer <= codePoints.length) {
    char = codePoints[pointer];
    switch (state) {
      case SCHEME_START:
        if (char && ALPHA.test(char)) {
          buffer += char.toLowerCase();
          state = SCHEME;
        } else if (!stateOverride) {
          state = NO_SCHEME;
          continue;
        } else return INVALID_SCHEME;
        break;

      case SCHEME:
        if (char && (ALPHANUMERIC.test(char) || char == '+' || char == '-' || char == '.')) {
          buffer += char.toLowerCase();
        } else if (char == ':') {
          if (stateOverride && (
            (isSpecial(url) != has(specialSchemes, buffer)) ||
            (buffer == 'file' && (includesCredentials(url) || url.port !== null)) ||
            (url.scheme == 'file' && !url.host)
          )) return;
          url.scheme = buffer;
          if (stateOverride) {
            if (isSpecial(url) && specialSchemes[url.scheme] == url.port) url.port = null;
            return;
          }
          buffer = '';
          if (url.scheme == 'file') {
            state = FILE;
          } else if (isSpecial(url) && base && base.scheme == url.scheme) {
            state = SPECIAL_RELATIVE_OR_AUTHORITY;
          } else if (isSpecial(url)) {
            state = SPECIAL_AUTHORITY_SLASHES;
          } else if (codePoints[pointer + 1] == '/') {
            state = PATH_OR_AUTHORITY;
            pointer++;
          } else {
            url.cannotBeABaseURL = true;
            url.path.push('');
            state = CANNOT_BE_A_BASE_URL_PATH;
          }
        } else if (!stateOverride) {
          buffer = '';
          state = NO_SCHEME;
          pointer = 0;
          continue;
        } else return INVALID_SCHEME;
        break;

      case NO_SCHEME:
        if (!base || (base.cannotBeABaseURL && char != '#')) return INVALID_SCHEME;
        if (base.cannotBeABaseURL && char == '#') {
          url.scheme = base.scheme;
          url.path = base.path.slice();
          url.query = base.query;
          url.fragment = '';
          url.cannotBeABaseURL = true;
          state = FRAGMENT;
          break;
        }
        state = base.scheme == 'file' ? FILE : RELATIVE;
        continue;

      case SPECIAL_RELATIVE_OR_AUTHORITY:
        if (char == '/' && codePoints[pointer + 1] == '/') {
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          pointer++;
        } else {
          state = RELATIVE;
          continue;
        } break;

      case PATH_OR_AUTHORITY:
        if (char == '/') {
          state = AUTHORITY;
          break;
        } else {
          state = PATH;
          continue;
        }

      case RELATIVE:
        url.scheme = base.scheme;
        if (char == EOF) {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = base.query;
        } else if (char == '/' || (char == '\\' && isSpecial(url))) {
          state = RELATIVE_SLASH;
        } else if (char == '?') {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = '';
          state = QUERY;
        } else if (char == '#') {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = base.query;
          url.fragment = '';
          state = FRAGMENT;
        } else {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.path.pop();
          state = PATH;
          continue;
        } break;

      case RELATIVE_SLASH:
        if (isSpecial(url) && (char == '/' || char == '\\')) {
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
        } else if (char == '/') {
          state = AUTHORITY;
        } else {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          state = PATH;
          continue;
        } break;

      case SPECIAL_AUTHORITY_SLASHES:
        state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
        if (char != '/' || buffer.charAt(pointer + 1) != '/') continue;
        pointer++;
        break;

      case SPECIAL_AUTHORITY_IGNORE_SLASHES:
        if (char != '/' && char != '\\') {
          state = AUTHORITY;
          continue;
        } break;

      case AUTHORITY:
        if (char == '@') {
          if (seenAt) buffer = '%40' + buffer;
          seenAt = true;
          bufferCodePoints = arrayFrom(buffer);
          for (var i = 0; i < bufferCodePoints.length; i++) {
            var codePoint = bufferCodePoints[i];
            if (codePoint == ':' && !seenPasswordToken) {
              seenPasswordToken = true;
              continue;
            }
            var encodedCodePoints = percentEncode(codePoint, userinfoPercentEncodeSet);
            if (seenPasswordToken) url.password += encodedCodePoints;
            else url.username += encodedCodePoints;
          }
          buffer = '';
        } else if (
          char == EOF || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isSpecial(url))
        ) {
          if (seenAt && buffer == '') return INVALID_AUTHORITY;
          pointer -= arrayFrom(buffer).length + 1;
          buffer = '';
          state = HOST;
        } else buffer += char;
        break;

      case HOST:
      case HOSTNAME:
        if (stateOverride && url.scheme == 'file') {
          state = FILE_HOST;
          continue;
        } else if (char == ':' && !seenBracket) {
          if (buffer == '') return INVALID_HOST;
          failure = parseHost(url, buffer);
          if (failure) return failure;
          buffer = '';
          state = PORT;
          if (stateOverride == HOSTNAME) return;
        } else if (
          char == EOF || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isSpecial(url))
        ) {
          if (isSpecial(url) && buffer == '') return INVALID_HOST;
          if (stateOverride && buffer == '' && (includesCredentials(url) || url.port !== null)) return;
          failure = parseHost(url, buffer);
          if (failure) return failure;
          buffer = '';
          state = PATH_START;
          if (stateOverride) return;
          continue;
        } else {
          if (char == '[') seenBracket = true;
          else if (char == ']') seenBracket = false;
          buffer += char;
        } break;

      case PORT:
        if (DIGIT.test(char)) {
          buffer += char;
        } else if (
          char == EOF || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isSpecial(url)) ||
          stateOverride
        ) {
          if (buffer != '') {
            var port = parseInt(buffer, 10);
            if (port > 0xFFFF) return INVALID_PORT;
            url.port = (isSpecial(url) && port === specialSchemes[url.scheme]) ? null : port;
            buffer = '';
          }
          if (stateOverride) return;
          state = PATH_START;
          continue;
        } else return INVALID_PORT;
        break;

      case FILE:
        url.scheme = 'file';
        if (char == '/' || char == '\\') state = FILE_SLASH;
        else if (base && base.scheme == 'file') {
          if (char == EOF) {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = base.query;
          } else if (char == '?') {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = '';
            state = QUERY;
          } else if (char == '#') {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = base.query;
            url.fragment = '';
            state = FRAGMENT;
          } else {
            if (!startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
              url.host = base.host;
              url.path = base.path.slice();
              shortenURLsPath(url);
            }
            state = PATH;
            continue;
          }
        } else {
          state = PATH;
          continue;
        } break;

      case FILE_SLASH:
        if (char == '/' || char == '\\') {
          state = FILE_HOST;
          break;
        }
        if (base && base.scheme == 'file' && !startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
          if (isWindowsDriveLetter(base.path[0], true)) url.path.push(base.path[0]);
          else url.host = base.host;
        }
        state = PATH;
        continue;

      case FILE_HOST:
        if (char == EOF || char == '/' || char == '\\' || char == '?' || char == '#') {
          if (!stateOverride && isWindowsDriveLetter(buffer)) {
            state = PATH;
          } else if (buffer == '') {
            url.host = '';
            if (stateOverride) return;
            state = PATH_START;
          } else {
            failure = parseHost(url, buffer);
            if (failure) return failure;
            if (url.host == 'localhost') url.host = '';
            if (stateOverride) return;
            buffer = '';
            state = PATH_START;
          } continue;
        } else buffer += char;
        break;

      case PATH_START:
        if (isSpecial(url)) {
          state = PATH;
          if (char != '/' && char != '\\') continue;
        } else if (!stateOverride && char == '?') {
          url.query = '';
          state = QUERY;
        } else if (!stateOverride && char == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (char != EOF) {
          state = PATH;
          if (char != '/') continue;
        } break;

      case PATH:
        if (
          char == EOF || char == '/' ||
          (char == '\\' && isSpecial(url)) ||
          (!stateOverride && (char == '?' || char == '#'))
        ) {
          if (isDoubleDot(buffer)) {
            shortenURLsPath(url);
            if (char != '/' && !(char == '\\' && isSpecial(url))) {
              url.path.push('');
            }
          } else if (isSingleDot(buffer)) {
            if (char != '/' && !(char == '\\' && isSpecial(url))) {
              url.path.push('');
            }
          } else {
            if (url.scheme == 'file' && !url.path.length && isWindowsDriveLetter(buffer)) {
              if (url.host) url.host = '';
              buffer = buffer.charAt(0) + ':'; // normalize windows drive letter
            }
            url.path.push(buffer);
          }
          buffer = '';
          if (url.scheme == 'file' && (char == EOF || char == '?' || char == '#')) {
            while (url.path.length > 1 && url.path[0] === '') {
              url.path.shift();
            }
          }
          if (char == '?') {
            url.query = '';
            state = QUERY;
          } else if (char == '#') {
            url.fragment = '';
            state = FRAGMENT;
          }
        } else {
          buffer += percentEncode(char, pathPercentEncodeSet);
        } break;

      case CANNOT_BE_A_BASE_URL_PATH:
        if (char == '?') {
          url.query = '';
          state = QUERY;
        } else if (char == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (char != EOF) {
          url.path[0] += percentEncode(char, C0ControlPercentEncodeSet);
        } break;

      case QUERY:
        if (!stateOverride && char == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (char != EOF) {
          if (char == "'" && isSpecial(url)) url.query += '%27';
          else if (char == '#') url.query += '%23';
          else url.query += percentEncode(char, C0ControlPercentEncodeSet);
        } break;

      case FRAGMENT:
        if (char != EOF) url.fragment += percentEncode(char, fragmentPercentEncodeSet);
        break;
    }

    pointer++;
  }
};

// `URL` constructor
// https://url.spec.whatwg.org/#url-class
var URLConstructor = function URL(url /* , base */) {
  var that = anInstance(this, URLConstructor, 'URL');
  var base = arguments.length > 1 ? arguments[1] : undefined;
  var urlString = String(url);
  var state = setInternalState$a(that, { type: 'URL' });
  var baseState, failure;
  if (base !== undefined) {
    if (base instanceof URLConstructor) baseState = getInternalURLState(base);
    else {
      failure = parseURL(baseState = {}, String(base));
      if (failure) throw TypeError(failure);
    }
  }
  failure = parseURL(state, urlString, null, baseState);
  if (failure) throw TypeError(failure);
  var searchParams = state.searchParams = new URLSearchParams$1();
  var searchParamsState = getInternalSearchParamsState(searchParams);
  searchParamsState.updateSearchParams(state.query);
  searchParamsState.updateURL = function () {
    state.query = String(searchParams) || null;
  };
  if (!descriptors) {
    that.href = serializeURL.call(that);
    that.origin = getOrigin.call(that);
    that.protocol = getProtocol.call(that);
    that.username = getUsername.call(that);
    that.password = getPassword.call(that);
    that.host = getHost.call(that);
    that.hostname = getHostname.call(that);
    that.port = getPort.call(that);
    that.pathname = getPathname.call(that);
    that.search = getSearch.call(that);
    that.searchParams = getSearchParams.call(that);
    that.hash = getHash.call(that);
  }
};

var URLPrototype = URLConstructor.prototype;

var serializeURL = function () {
  var url = getInternalURLState(this);
  var scheme = url.scheme;
  var username = url.username;
  var password = url.password;
  var host = url.host;
  var port = url.port;
  var path = url.path;
  var query = url.query;
  var fragment = url.fragment;
  var output = scheme + ':';
  if (host !== null) {
    output += '//';
    if (includesCredentials(url)) {
      output += username + (password ? ':' + password : '') + '@';
    }
    output += serializeHost(host);
    if (port !== null) output += ':' + port;
  } else if (scheme == 'file') output += '//';
  output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
  if (query !== null) output += '?' + query;
  if (fragment !== null) output += '#' + fragment;
  return output;
};

var getOrigin = function () {
  var url = getInternalURLState(this);
  var scheme = url.scheme;
  var port = url.port;
  if (scheme == 'blob') try {
    return new URL(scheme.path[0]).origin;
  } catch (error) {
    return 'null';
  }
  if (scheme == 'file' || !isSpecial(url)) return 'null';
  return scheme + '://' + serializeHost(url.host) + (port !== null ? ':' + port : '');
};

var getProtocol = function () {
  return getInternalURLState(this).scheme + ':';
};

var getUsername = function () {
  return getInternalURLState(this).username;
};

var getPassword = function () {
  return getInternalURLState(this).password;
};

var getHost = function () {
  var url = getInternalURLState(this);
  var host = url.host;
  var port = url.port;
  return host === null ? ''
    : port === null ? serializeHost(host)
    : serializeHost(host) + ':' + port;
};

var getHostname = function () {
  var host = getInternalURLState(this).host;
  return host === null ? '' : serializeHost(host);
};

var getPort = function () {
  var port = getInternalURLState(this).port;
  return port === null ? '' : String(port);
};

var getPathname = function () {
  var url = getInternalURLState(this);
  var path = url.path;
  return url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
};

var getSearch = function () {
  var query = getInternalURLState(this).query;
  return query ? '?' + query : '';
};

var getSearchParams = function () {
  return getInternalURLState(this).searchParams;
};

var getHash = function () {
  var fragment = getInternalURLState(this).fragment;
  return fragment ? '#' + fragment : '';
};

var accessorDescriptor = function (getter, setter) {
  return { get: getter, set: setter, configurable: true, enumerable: true };
};

if (descriptors) {
  objectDefineProperties(URLPrototype, {
    // `URL.prototype.href` accessors pair
    // https://url.spec.whatwg.org/#dom-url-href
    href: accessorDescriptor(serializeURL, function (href) {
      var url = getInternalURLState(this);
      var urlString = String(href);
      var failure = parseURL(url, urlString);
      if (failure) throw TypeError(failure);
      getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
    }),
    // `URL.prototype.origin` getter
    // https://url.spec.whatwg.org/#dom-url-origin
    origin: accessorDescriptor(getOrigin),
    // `URL.prototype.protocol` accessors pair
    // https://url.spec.whatwg.org/#dom-url-protocol
    protocol: accessorDescriptor(getProtocol, function (protocol) {
      var url = getInternalURLState(this);
      parseURL(url, String(protocol) + ':', SCHEME_START);
    }),
    // `URL.prototype.username` accessors pair
    // https://url.spec.whatwg.org/#dom-url-username
    username: accessorDescriptor(getUsername, function (username) {
      var url = getInternalURLState(this);
      var codePoints = arrayFrom(String(username));
      if (cannotHaveUsernamePasswordPort(url)) return;
      url.username = '';
      for (var i = 0; i < codePoints.length; i++) {
        url.username += percentEncode(codePoints[i], userinfoPercentEncodeSet);
      }
    }),
    // `URL.prototype.password` accessors pair
    // https://url.spec.whatwg.org/#dom-url-password
    password: accessorDescriptor(getPassword, function (password) {
      var url = getInternalURLState(this);
      var codePoints = arrayFrom(String(password));
      if (cannotHaveUsernamePasswordPort(url)) return;
      url.password = '';
      for (var i = 0; i < codePoints.length; i++) {
        url.password += percentEncode(codePoints[i], userinfoPercentEncodeSet);
      }
    }),
    // `URL.prototype.host` accessors pair
    // https://url.spec.whatwg.org/#dom-url-host
    host: accessorDescriptor(getHost, function (host) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      parseURL(url, String(host), HOST);
    }),
    // `URL.prototype.hostname` accessors pair
    // https://url.spec.whatwg.org/#dom-url-hostname
    hostname: accessorDescriptor(getHostname, function (hostname) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      parseURL(url, String(hostname), HOSTNAME);
    }),
    // `URL.prototype.port` accessors pair
    // https://url.spec.whatwg.org/#dom-url-port
    port: accessorDescriptor(getPort, function (port) {
      var url = getInternalURLState(this);
      if (cannotHaveUsernamePasswordPort(url)) return;
      port = String(port);
      if (port == '') url.port = null;
      else parseURL(url, port, PORT);
    }),
    // `URL.prototype.pathname` accessors pair
    // https://url.spec.whatwg.org/#dom-url-pathname
    pathname: accessorDescriptor(getPathname, function (pathname) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      url.path = [];
      parseURL(url, pathname + '', PATH_START);
    }),
    // `URL.prototype.search` accessors pair
    // https://url.spec.whatwg.org/#dom-url-search
    search: accessorDescriptor(getSearch, function (search) {
      var url = getInternalURLState(this);
      search = String(search);
      if (search == '') {
        url.query = null;
      } else {
        if ('?' == search.charAt(0)) search = search.slice(1);
        url.query = '';
        parseURL(url, search, QUERY);
      }
      getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
    }),
    // `URL.prototype.searchParams` getter
    // https://url.spec.whatwg.org/#dom-url-searchparams
    searchParams: accessorDescriptor(getSearchParams),
    // `URL.prototype.hash` accessors pair
    // https://url.spec.whatwg.org/#dom-url-hash
    hash: accessorDescriptor(getHash, function (hash) {
      var url = getInternalURLState(this);
      hash = String(hash);
      if (hash == '') {
        url.fragment = null;
        return;
      }
      if ('#' == hash.charAt(0)) hash = hash.slice(1);
      url.fragment = '';
      parseURL(url, hash, FRAGMENT);
    })
  });
}

// `URL.prototype.toJSON` method
// https://url.spec.whatwg.org/#dom-url-tojson
redefine(URLPrototype, 'toJSON', function toJSON() {
  return serializeURL.call(this);
}, { enumerable: true });

// `URL.prototype.toString` method
// https://url.spec.whatwg.org/#URL-stringification-behavior
redefine(URLPrototype, 'toString', function toString() {
  return serializeURL.call(this);
}, { enumerable: true });

if (NativeURL) {
  var nativeCreateObjectURL = NativeURL.createObjectURL;
  var nativeRevokeObjectURL = NativeURL.revokeObjectURL;
  // `URL.createObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
  // eslint-disable-next-line no-unused-vars
  if (nativeCreateObjectURL) redefine(URLConstructor, 'createObjectURL', function createObjectURL(blob) {
    return nativeCreateObjectURL.apply(NativeURL, arguments);
  });
  // `URL.revokeObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
  // eslint-disable-next-line no-unused-vars
  if (nativeRevokeObjectURL) redefine(URLConstructor, 'revokeObjectURL', function revokeObjectURL(url) {
    return nativeRevokeObjectURL.apply(NativeURL, arguments);
  });
}

setToStringTag(URLConstructor, 'URL');

_export({ global: true, forced: !nativeUrl, sham: !descriptors }, {
  URL: URLConstructor
});

// `URL.prototype.toJSON` method
// https://url.spec.whatwg.org/#dom-url-tojson
_export({ target: 'URL', proto: true, enumerable: true }, {
  toJSON: function toJSON() {
    return URL.prototype.toString.call(this);
  }
});

var runtime_1 = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined$1; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined$1) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined$1;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined$1;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined$1;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined$1, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined$1;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined$1;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined$1;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined$1;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined$1;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   module.exports 
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}
});

/**
 * @property {string} name - diagram's name
 * @property {string | number} id - diagram's identifier
 * @property {cytoscape} cy - cytoscape headless instance for managing elements
 */

var Diagram = /*#__PURE__*/function () {
  /**
   * @param {string} name
   * @param {string | number} id
   * @param {JSON} elements - JSON representation of cytoscape elements @see [cytoscpae-eles](https://js.cytoscape.org/#notation/elements-json)
   */
  function Diagram(name, id) {
    var elements = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    _classCallCheck(this, Diagram);

    this.name = name;
    this.id = id;
    this.cy = cytoscape();
    if (elements) this.addElems(elements);
  }
  /**
   * Add a collection of nodes and edges to the diagram
   * @param {JSON} elems - JSON representation of cytoscape elements @see [cytoscpae-eles](https://js.cytoscape.org/#notation/elements-json)
   */


  _createClass(Diagram, [{
    key: "addElems",
    value: function addElems(elems) {
      this.cy.add(elems);
    }
    /**
     * Getter
     * @returns {JSON} - nodes in JSON
     */

  }, {
    key: "nodes",
    get: function get() {
      return this.cy.nodes().jsons();
    }
    /**
     * Getter
     * @returns {JSON} - edges in JSON
     */

  }, {
    key: "edges",
    get: function get() {
      return this.cy.edges().jsons();
    }
  }]);

  return Diagram;
}();

/**
 * Class representing a namespace
 * @property {string[]} prefixes - array of prefixes
 * @property {string} value - namespace lexical form
 * @property {boolean} standard - bool saying if the namespace is standard or user defined
 */
var Namespace = /*#__PURE__*/function () {
  /**
   * @param {string[]} prefixes - array of prefixes
   * @param {string} value - namespace lexical form
   * @param {boolean} standard - bool saying if the namespace is standard or user defined
   */
  function Namespace(prefixes, value) {
    var standard = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    _classCallCheck(this, Namespace);

    this.prefixes = prefixes || [''];
    this.value = value;
    this.standard = standard;
  }
  /**
   * Wether the namespace is standard (`true`) or user defined (`false`)
   * @returns {boolean}
   */


  _createClass(Namespace, [{
    key: "isStandard",
    value: function isStandard() {
      return this.standard;
    }
  }]);

  return Namespace;
}();

var Ontology = /*#__PURE__*/function () {
  /**
   *
   * @param {string} name
   * @param {string} version
   * @param {Namespace[]} namespaces
   * @param {Diagram[]} diagrams
   */
  function Ontology(name, version) {
    var namespaces = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var diagrams = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

    _classCallCheck(this, Ontology);

    this.name = name;
    this.version = version;
    this.namespaces = namespaces;
    this.diagrams = diagrams;
  } // @param {Iri} iri


  _createClass(Ontology, [{
    key: "addIri",
    value: function addIri(iri) {
      this.namespaces.push(iri);
    }
  }, {
    key: "getIriFromValue",
    value: function getIriFromValue(value) {
      var _iterator = _createForOfIteratorHelper(this.namespaces),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var iri = _step.value;
          if (iri.value == value) return iri;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "getIriFromPrefix",
    value: function getIriFromPrefix(prefix) {
      var _iterator2 = _createForOfIteratorHelper(this.namespaces),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var iri = _step2.value;
          if (iri.prefixes && iri.prefixes.includes(prefix)) return iri;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }, {
    key: "destructureIri",
    value: function destructureIri(iri) {
      var result = {
        namespace: '',
        prefix: '',
        rem_chars: ''
      };

      var _iterator3 = _createForOfIteratorHelper(this.namespaces),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var namespace = _step3.value;

          // if iri contains namespace or namespace without last separator
          if (iri.search(namespace.value) != -1) {
            result.namespace = namespace.value;
            result.prefix = namespace.prefixes[0];
            result.rem_chars = iri.slice(namespace.value.length);
            break;
          } //else if (iri.search(namespace.value.slice(0, -1)) != -1) {
          //result.namespace = namespace.value
          //result.prefix = namespace.prefixes[0]
          //result.rem_chars = iri.slice(namespace.value.length - 1)
          //break;
          //}

        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      return result;
    } // @param {Diagram} diagram

  }, {
    key: "addDiagram",
    value: function addDiagram(diagram) {
      this.diagrams.push(diagram);
    }
    /**
     * @param {string|number} index the id or the name of the diagram
     * @returns {Diagram} The diagram object
     */

  }, {
    key: "getDiagram",
    value: function getDiagram(index) {
      if (index < 0 || index > this.diagrams.length) return;
      if (this.diagrams[index]) return this.diagrams[index];

      var _iterator4 = _createForOfIteratorHelper(this.diagrams),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var diagram = _step4.value;
          if (diagram.name.toLowerCase() === index.toLowerCase()) return diagram;
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
    /**
     * Get an element in the ontology by id, searching in every diagram
     * @param {string} elem_id - The `id` of the elem to retrieve
     * @param {boolean} json - if `true` return plain json, if `false` return cytoscape node. Default `true`
     * @returns {any} The cytoscape object or the plain json representation depending on `json` parameter.
     */

  }, {
    key: "getElem",
    value: function getElem(elem_id) {
      var json = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var _iterator5 = _createForOfIteratorHelper(this.diagrams),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var diagram = _step5.value;
          var node = diagram.cy.$id(elem_id);
          if (node && node.length > 0) return json ? node.json() : node;
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }

      return false;
    }
    /**
     * Retrieve an entity by its IRI.
     * @param {string} iri - The IRI in full or prefixed form.
     * i.e. : `grapholscape:world` or `https://examples/grapholscape/world`
     * @returns {JSON} The plain json representation of the entity.
     */

  }, {
    key: "getEntity",
    value: function getEntity(iri) {
      return this.getEntities().find(function (i) {
        return i.data.iri.full_iri === iri || i.data.iri.prefix + i.data.iri.remaining_chars === iri;
      });
    }
    /**
     * Retrieve all occurrences of an entity by its IRI.
     * @param {string} iri - The IRI in full or prefixed form.
     * i.e. : `grapholscape:world` or `https://examples/grapholscape/world`
     * @returns {JSON} The plain json representation of the entity.
     */

  }, {
    key: "getOccurrences",
    value: function getOccurrences(iri) {
      return this.getEntities().filter(function (i) {
        return i.data.iri.full_iri === iri || i.data.iri.prefix + i.data.iri.remaining_chars === iri;
      });
    }
    /**
     * Get an element in the ontology by its id and its diagram id
     * @param {string} elem_id - The id of the element to retrieve
     * @param {string } diagram_id - the id of the diagram containing the element
     * @param {boolean} json - if true return plain json, if false return cytoscape node. Default true.
     */

  }, {
    key: "getElemByDiagramAndId",
    value: function getElemByDiagramAndId(elem_id, diagram_id) {
      var json = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var diagram = this.getDiagram(diagram_id);

      if (diagram) {
        var node = diagram.cy.$("[id_xml = \"".concat(elem_id, "\"]")) || diagram.cy.$id(elem_id);
        if (node.length > 0) return json ? node.json() : node;
      }

      return false;
    }
    /**
     * Get the entities in the ontology
     * @param {boolean} json  - if true return plain json, if false return cytoscape collection. Default true.
     * @returns {JSON | any}
     *    - if `json` = `true` : array of JSONs with entities
     *    - if `json` = `false` : [cytoscape collection](https://js.cytoscape.org/#collection)
     */

  }, {
    key: "getEntities",
    value: function getEntities() {
      var json = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var predicates = cytoscape().collection();
      this.diagrams.forEach(function (diagram) {
        predicates = predicates.union(diagram.cy.$('.predicate'));
      });
      predicates = predicates.sort(function (a, b) {
        return a.data('displayed_name').localeCompare(b.data('displayed_name'));
      });
      return json ? predicates.jsons() : predicates;
    }
  }]);

  return Ontology;
}();

// TO DO: export everything and import in parser.js
// Funzioni che ritornano il primo figlio o il fratello successivo di un dato nodo
// Ignorano quindi tutti gli elementi di tipo diverso da 1
// cioè gli attributi, gli spazi vuoti ecc...
function getFirstChild(node) {
  if (node == null || node.firstChild == null) {
    return null;
  }

  node = node.firstChild;

  if (node.nodeType !== 1) {
    node = getNextSibling(node);
  }

  return node;
}
function getNextSibling(node) {
  if (node == null || node.nextSibling == null) {
    return null;
  }

  node = node.nextSibling;

  while (node.nodeType !== 1) {
    if (node.nextSibling == null) {
      return null;
    }

    node = node.nextSibling;
  }

  return node;
}
function isPredicate(node) {
  switch (node.getAttribute('type')) {
    case 'concept':
    case 'attribute':
    case 'role':
    case 'individual':
      return true;
  }

  return false;
} // Date le posizioni di source, target e del breakpoint,
// la funzione calcola i due parametri peso e distanza del breakpoint e li restituisce

function getDistanceWeight(target, source, point) {
  // Esprimiamo le coordinate di point traslando l'origine sul source:
  // point['0'] corrisponde alla coordinata x del punto, point['1'] è l'ordinata
  var breakpoint = [];
  breakpoint['x'] = point['x'] - source['x'];
  breakpoint['y'] = point['y'] - source['y'];
  var delta = [];
  delta['x'] = target['x'] - source['x'];
  delta['y'] = target['y'] - source['y'];
  var intersectpoint = [];
  var angolar_coeff; // Se delta['x'] è nullo : source e target sono sulla stessa ascissa
  // la retta che li congiunge è verticale e pertanto non esprimibile come y = mx + q
  // Sappiamo però automaticamente che la retta perpendicolare è del tipo y = c
  // quindi l'intersect point avrà X = 0 e Y = breakpoint['y']

  if (delta['x'] == 0) {
    intersectpoint['x'] = 0;
    intersectpoint['y'] = breakpoint['y'];
  } else if (delta['y'] == 0) {
    intersectpoint['x'] = breakpoint['x'];
    intersectpoint['y'] = 0;
    angolar_coeff = 0;
  } else {
    angolar_coeff = delta['y'] / delta['x']; // quindi prendendo il source come origine, la retta che unisce source e target è data da:
    // R: y = angolar_coeff * x
    // La retta che interseca perpendicolarmente R e che passa per point è data da :
    // T: y = - x / angolar_coeff + quote
    // dobbiamo calcolare quote imponendo che point faccia parte della retta T, quindi calcoliamo:
    // quote = breakpoint_y + (breakpoint_x/angolar_coeff)

    var quote = breakpoint['y'] + breakpoint['x'] / angolar_coeff; // Adesso mettiamo a sistema le due rette T ed R (che sono perpendicolari) e risolvendo il sistema
    // otteniamo che il punto di intersezione tra le due ha le coordinate:
    // intersectpoint_x = (quote * angolar_coeff) / ((angolar_coeff ^ 2) + 1)
    // intersectpoint_y = intersectpoint_x * angolar_coeff

    intersectpoint['x'] = quote * angolar_coeff / (Math.pow(angolar_coeff, 2) + 1);
    intersectpoint['y'] = intersectpoint['x'] * angolar_coeff;
  } // Adesso calcoliamo la distanza tra source e target


  var dist_source_target = Math.sqrt(Math.pow(delta['x'], 2) + Math.pow(delta['y'], 2)); // Adesso calcoliamo la distanza tra interscetpoint e source
  // NOTA: le coordinate di intersectpoint sono calcolate traslando l'origine sul source, quindi usando il teorema di pitagora non sottraiamo le coordinate di source perchè sono nulle in questo sistema di riferimento
  // NOTA 2: la distanza che otteniamo è un valore assoluto, è quindi indipendente dal sistema di riferimento e possiamo usarla direttamente per calcolare il peso

  var dist_inter_source = Math.sqrt(Math.pow(intersectpoint['x'], 2) + Math.pow(intersectpoint['y'], 2)); // Il peso lo calcolo come percentuale dividendo la distanza dell'intersectpoint dal source per la distanza tra source e target

  var point_weight = dist_inter_source / dist_source_target; // Dobbiamo stabilire se il peso è positivo o negativo
  // Se la X dell' intersectpoint è compresta tra quella del source e quella del target, allora il peso è positivo
  // se la X del target è maggiore della X del source e la X dell'intersectpoint è minore di quella del source, allora il peso è negativo

  if (delta['x'] > 0 && intersectpoint['x'] < 0) {
    point_weight = -point_weight;
  }

  if (delta['x'] < 0 && intersectpoint['x'] > 0) {
    point_weight = -point_weight;
  } // Calcolo la distanza tra point e intersectpoint (sono entrambi espressi rispetto a source, ma per la distanza non ci interessa)


  var point_distance = Math.sqrt(Math.pow(intersectpoint['x'] - breakpoint['x'], 2) + Math.pow(intersectpoint['y'] - breakpoint['y'], 2)); // Dobbiamo stabilire se prendere la point_distance positiva o negativa
  // La regola è che, andando dal source al target sulla retta che li
  // congiunge, se il breakpoint si trova alla mia sinistra, la distanza
  // è negativa, se invece è alla mia destra è positiva
  // questo si traduce nel valutare una diseguaglianza (Y ><= M*X ? dove Y e X sono le coordinate del breakpoint) e la scelta dipende dal quadrante in cui si trova il target.
  // [Stiamo considerando le coordinate relative al source]
  // [Quindi delta['x'] e delta['y'] sono proprio le coordinate del target]
  // RICORDA: in cytoscape il verso crescente dell'asse Y è verso il
  // basso, quindi occorre fare attenzione al verso delle diseguaglianze
  // Target con X negativa => il breakpoint si trova a sinitra della
  // retta quando si trova al di sotto della retta

  if (delta['x'] < 0 && breakpoint['y'] > angolar_coeff * breakpoint['x']) {
    point_distance = -point_distance;
  } // Target con X positiva => il breakpoint si trova a sinistra dela
  // retta quando si trova al di sopra della retta


  if (delta['x'] > 0 && breakpoint['y'] < angolar_coeff * breakpoint['x']) {
    point_distance = -point_distance;
  } // SOURCE CON STESSA X DEL TARGET
  // se il target ha una Y maggiore del source (deltaY>0),
  // allora sto guardando verso il basso, quindi il punto sarà a
  // sinistra quando la sua X sarà positiva


  if (delta['x'] == 0 && delta['y'] > 0 && breakpoint['x'] > 0) {
    point_distance = -point_distance;
  } // Se invece guardo verso l'alto (target con Y<0), allora il nodo è a
  // sinistra della retta quando ha la X negativa


  if (delta['x'] == 0 && delta['y'] < 0 && breakpoint['x'] < 0) {
    point_distance = -point_distance;
  }

  return [point_distance, point_weight];
} // Funzione che decide se spostare un endpoint sul bordo del nodo (source o target) o meno
// Facciamo quest'operazione per tutti gli archi che presentano degli endpoint
// non al centro del nodo (source o target), in questi casi le
// opzioni sono 2:
//   1: l'arco parte (o arriva) in diagonale, in questo caso l'endpoint lo lasciamo al centro del nodo
//   2: l'arco arriva perpendicolarmente al bordo del nodo (source o target), in questo caso
//      vediamo se il breakpoint successivo (o precedente nel caso del target), ha la stessa X o la stessa Y
//      del nodo in questione.
//      Valutando poi la coordinata che non risulta uguale a quella del nodo, spostiamo l'endpoint sul bordo del
//      nodo in direzione del breakpoint successivo (o precedente).
// Se lasciassimo intatti gli endpoint non centrati, cytoscape farebbe entrare la freccia nel nodo,
// Traslando sul bordo l'endpoint in direzione del breakpoint successivo (nel caso di source) o precedente
// (nel caso di target), cytoscape farà corrispondere la punta della freccia sul bordo del nodo e
// sarà quindi visibile

function getNewEndpoint(end_point, node, break_point) {
  // Calcoliamo le coordinate relative al nodo source (o target)
  var endpoint = [];
  endpoint['x'] = end_point['x'] - node.position('x');
  endpoint['y'] = end_point['y'] - node.position('y');
  if (endpoint['x'] == 0 && endpoint['y'] == 0) return endpoint;
  var breakpoint = [];
  breakpoint['x'] = break_point['x'] - node.position('x');
  breakpoint['y'] = break_point['y'] - node.position('y'); // Se l'endpoint non è centrato nel nodo ma ha la X uguale al breakpoint successivo (o precedente)
  // Allora l'arco parte (o arriva) perpendicolarmente dall'alto o dal basso

  if (endpoint['x'] == breakpoint['x']) {
    // Se il breakpoint si trova più in basso (Ricorda: asse Y al contrario in cytoscape!),
    // allora spostiamo sul bordo inferiore l'endpoint
    if (breakpoint['y'] > 0) {
      endpoint['y'] = node.data('height') / 2;
      return endpoint;
    } // Se invece il breakpoint è più in alto del nodo, allora spostiamo l'endpoint sul bordo superiore
    else if (breakpoint['y'] < 0) {
        endpoint['y'] = -node.data('height') / 2;
        return endpoint;
      }
  } // Se invece ad essere uguale è la Y, l'arco arriva da destra o da sinistra, facciamo gli stessi passaggi appena fatti
  else if (endpoint['y'] == breakpoint['y']) {
      if (breakpoint['x'] > 0) {
        endpoint['x'] = node.data('width') / 2;
        return endpoint;
      } else if (breakpoint['x'] < 0) {
        endpoint['x'] = -node.data('width') / 2;
        return endpoint;
      }
    }

  return endpoint;
}

var warnings = new Set();
function getOntologyInfo(xmlDocument) {
  var xml_ontology_tag = xmlDocument.getElementsByTagName('ontology')[0];
  var ontology_name = xml_ontology_tag.getElementsByTagName('name')[0].textContent;
  var ontology_version = '';

  if (xml_ontology_tag.getElementsByTagName('version')[0]) {
    ontology_version = xml_ontology_tag.getElementsByTagName('version')[0].textContent;
  } else {
    ontology_version = 'Undefined';
  }

  return {
    name: ontology_name,
    version: ontology_version,
    languages: ['']
  };
}
function getIriPrefixesDictionary(xmlDocument) {
  var result = [];

  if (xmlDocument.getElementsByTagName('IRI_prefixes_nodes_dict').length === 0) {
    // for old graphol files
    result.push({
      prefix: [''],
      value: xmlDocument.getElementsByTagName('iri')[0].textContent,
      standard: false
    });
  } else {
    var iri_prefixes;
    var iri_value, is_standard, prefixes, properties;
    var iris = xmlDocument.getElementsByTagName('iri'); // Foreach iri create a Iri object

    var _iterator = _createForOfIteratorHelper(iris),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var iri = _step.value;
        iri_value = iri.getAttribute('iri_value');
        is_standard = false;
        prefixes = iri.getElementsByTagName('prefix');
        iri_prefixes = [];

        var _iterator2 = _createForOfIteratorHelper(prefixes),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var prefix = _step2.value;
            iri_prefixes.push(prefix.getAttribute('prefix_value'));
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        if (iri_prefixes.length == 0) iri_prefixes.push(''); // check if it's a standard iri

        properties = iri.getElementsByTagName('property');

        var _iterator3 = _createForOfIteratorHelper(properties),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var property = _step3.value;
            is_standard = property.getAttribute('property_value') == 'Standard_IRI';
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        result.push({
          prefixes: iri_prefixes,
          value: iri_value,
          standard: is_standard
        });
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }

  return result;
}
function getIri(element, ontology) {
  var iri_infos = {};
  var label = element.getElementsByTagName('label')[0];
  if (!label) return undefined;
  label = label.textContent.replace(/\n/g, '');
  var splitted_label = label.split(':'); // if no ':' in label, then use empty prefix

  var node_prefix_iri = splitted_label.length > 1 ? splitted_label[0] : '';
  var namespace, rem_chars; // facets

  if (node_prefix_iri.search(/"[\w]+"\^\^[\w]+:/) != -1) {
    rem_chars = label;
    namespace = '';
    node_prefix_iri = node_prefix_iri.slice(node_prefix_iri.lastIndexOf('^') + 1, node_prefix_iri.lastIndexOf(':') + 1);
  } else {
    rem_chars = splitted_label.length > 1 ? label.slice(label.indexOf(':') + 1) : label;
    namespace = ontology.getIriFromPrefix(node_prefix_iri);

    if (!namespace && isPredicate(element)) {
      this.warnings.add("The prefix \"".concat(node_prefix_iri, "\" is not associated to any namespace"));
    }

    namespace = namespace ? namespace.value : '';
  }

  iri_infos.remaining_chars = rem_chars;
  iri_infos.prefix = node_prefix_iri.length > 0 ? node_prefix_iri + ':' : node_prefix_iri;
  iri_infos.full_iri = namespace + rem_chars;
  return iri_infos;
}
function getLabel(element) {
  if (element.getElementsByTagName('label')[0]) // language undefined for v2 = ''
    return {
      '': element.getElementsByTagName('label')[0].textContent
    };else return undefined;
}
function getPredicateInfo(element, xmlDocument) {
  var result = {};
  var label_no_break = element.getElementsByTagName('label')[0].textContent.replace(/\n/g, '');
  var type = element.getAttribute('type');
  var description, start_body_index, end_body_index; // for searching predicates' description in graphol v2

  var xmlPredicates = xmlDocument.getElementsByTagName('predicate');

  var _iterator4 = _createForOfIteratorHelper(xmlPredicates),
      _step4;

  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var predicateXml = _step4.value;

      if (label_no_break === predicateXml.getAttribute('name') && type === predicateXml.getAttribute('type')) {
        description = predicateXml.getElementsByTagName('description')[0].textContent;
        description = description.replace(/font-size:0pt/g, '');
        start_body_index = description.indexOf('<p');
        end_body_index = description.indexOf('</body');
        if (description) result.description = {
          '': [description.slice(start_body_index, end_body_index)]
        }; // Impostazione delle funzionalità dei nodi di tipo role o attribute

        if (type === 'attribute' || type === 'role') {
          result.functional = parseInt(predicateXml.getElementsByTagName('functional')[0].textContent);
        }

        if (type === 'role') {
          result.inverseFunctional = parseInt(predicateXml.getElementsByTagName('inverseFunctional')[0].textContent);
          result.asymmetric = parseInt(predicateXml.getElementsByTagName('asymmetric')[0].textContent);
          result.irreflexive = parseInt(predicateXml.getElementsByTagName('irreflexive')[0].textContent);
          result.reflexive = parseInt(predicateXml.getElementsByTagName('reflexive')[0].textContent);
          result.symmetric = parseInt(predicateXml.getElementsByTagName('symmetric')[0].textContent);
          result.transitive = parseInt(predicateXml.getElementsByTagName('transitive')[0].textContent);
        }

        break;
      }
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }

  return result;
}

var Graphol2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  warnings: warnings,
  getOntologyInfo: getOntologyInfo,
  getIriPrefixesDictionary: getIriPrefixesDictionary,
  getIri: getIri,
  getLabel: getLabel,
  getPredicateInfo: getPredicateInfo
});

var warnings$1 = new Set();
function getOntologyInfo$1(xmlDocument) {
  var project = xmlDocument.getElementsByTagName('project')[0];
  var ontology_languages = xmlDocument.getElementsByTagName('languages')[0].children;
  var iri = getTag(xmlDocument, 'ontology').getAttribute('iri');
  var iri_elem = getIriElem(iri, xmlDocument);
  return {
    name: project.getAttribute('name'),
    version: project.getAttribute('version'),
    iri: iri,
    languages: _toConsumableArray(ontology_languages).map(function (lang) {
      return lang.textContent;
    }),
    default_language: getTag(xmlDocument, 'ontology').getAttribute('lang'),
    other_infos: getIriAnnotations(iri_elem)
  };
}
function getIriPrefixesDictionary$1(xmlDocument) {
  var result = [];
  var prefixes = getTag(xmlDocument, 'prefixes').children;

  var _iterator = _createForOfIteratorHelper(prefixes),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var p = _step.value;
      result.push({
        prefixes: [getTagText(p, 'value')],
        value: getTagText(p, 'namespace'),
        standard: false
      });
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return result;
}
function getIri$1(element, ontology) {
  var iri_infos = {};
  var node_iri = getTagText(element, 'iri') || '';

  if (node_iri) {
    iri_infos.full_iri = node_iri; // prefix

    var destructured_iri = ontology.destructureIri(node_iri);

    if (destructured_iri.namespace) {
      iri_infos.prefix = destructured_iri.prefix.length > 0 ? destructured_iri.prefix + ':' : destructured_iri.prefix;
      iri_infos.remaining_chars = destructured_iri.rem_chars;
    } else {
      this.warnings.add("Namespace not found for [".concat(node_iri, "]. The prefix \"undefined\" has been assigned"));
      iri_infos.prefix = 'undefined:';
      iri_infos.remaining_chars = node_iri;
    }
  }

  return iri_infos;
}
function getLabel$1(element, ontology, xmlDocument) {
  var constructors_labels = {
    'union': 'or',
    'intersection': 'and',
    'role-chain': 'chain',
    'role-inverse': 'inv',
    'complement': 'not',
    'datatype-restriction': 'data',
    'enumeration': 'oneOf',
    'has-key': 'key'
  }; // Facets' label must be in the form: [constraining-facet-iri^^"value"] to be compliant to Graphol-V2

  if (element.getAttribute('type') === 'facet') {
    var constraining_facet = ontology.destructureIri(getTagText(element, 'constrainingFacet'));
    constraining_facet = constraining_facet.prefix + ':' + constraining_facet.rem_chars;
    var value = getTagText(element, 'lexicalForm'); // unused to be compliant to Graphol-V2
    //let datatype = ontology.destructureIri(getTagText(element, 'datatype'))
    //datatype = datatype.prefix + ':' + datatype.rem_chars

    return constraining_facet + '^^"' + value + '"';
  }

  var label = getTagText(element, 'label');
  if (label) return label;
  var iri = getTagText(element, 'iri'); // constructors node do not have any iri

  if (!iri) {
    return constructors_labels[element.getAttribute('type')];
  } // build prefixed iri to be used in some cases


  var destructured_iri = ontology.destructureIri(iri);
  var name = destructured_iri.rem_chars || iri;
  var prefix = destructured_iri.prefix || 'undefined';
  var prefixed_iri = prefix + ':' + name; // datatypes always have prefixed iri as label

  if (element.getAttribute('type') == 'value-domain') {
    return prefixed_iri;
  }

  var iri_xml_elem = getIriElem(element, xmlDocument);

  if (!iri_xml_elem) {
    return iri == name ? iri : prefixed_iri;
  }

  var label_property_iri = ontology.getIriFromPrefix('rdfs').value + 'label';
  var annotations = getTag(iri_xml_elem, 'annotations');
  var labels = {};

  if (annotations) {
    var _iterator2 = _createForOfIteratorHelper(annotations.children),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var annotation = _step2.value;

        if (getTagText(annotation, 'property') == label_property_iri) {
          // add label for a given language only if it doesn't already exist
          labels[getTagText(annotation, 'language')] = labels[getTagText(annotation, 'language')] || getTagText(annotation, 'lexicalForm');
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  } // if no label annotation, then use prefixed label


  return Object.keys(labels).length ? labels : prefixed_iri;
}
function getPredicateInfo$1(element, xmlDocument) {
  var result = {};
  var actual_iri_elem = getIriElem(element, xmlDocument);
  result = getIriAnnotations(actual_iri_elem);

  if (actual_iri_elem && actual_iri_elem.children) {
    var _iterator3 = _createForOfIteratorHelper(actual_iri_elem.children),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var property = _step3.value;

        if (property.tagName != 'value' && property.tagName != 'annotations') {
          result[property.tagName] = parseInt(property.textContent) || 0;
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
  }

  return result;
}

function getIriAnnotations(iri) {
  var result = {};
  result.description = {};
  result.annotations = {};
  var annotations = getTag(iri, 'annotations');
  var language, annotation_kind, lexicalForm;

  if (annotations) {
    var _iterator4 = _createForOfIteratorHelper(annotations.children),
        _step4;

    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var annotation = _step4.value;
        annotation_kind = getRemainingChars(getTagText(annotation, 'property'));
        language = getTagText(annotation, 'language');
        lexicalForm = getTagText(annotation, 'lexicalForm');

        if (annotation_kind == 'comment') {
          if (!result.description[language]) result.description[language] = []; // for comments allow multiple comments for same language

          result.description[language].push(lexicalForm);
        } else {
          if (!result.annotations[annotation_kind]) result.annotations[annotation_kind] = {}; // take only one annotation for each language

          if (!result.annotations[annotation_kind][language]) result.annotations[annotation_kind][language] = lexicalForm;
        }
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
  }

  return result;
}
/**
 * Retrieve the xml tag element in a xml root element
 * @param {*} root root element to search the tag in
 * @param {string} tagName the name of the tag to search
 * @param {*} n in case of more instances, retrieve the n-th. Default: 0 (the first one)
 */


function getTag(root, tagName) {
  var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  if (root && root.getElementsByTagName(tagName[n])) return root.getElementsByTagName(tagName)[n];
}
/**
 * Retrieve the text inside a given tag in a xml root element
 * @param {*} root root element to search the tag in
 * @param {string} tagName the name of the tag to search
 * @param {*} n in case of more instances, retrieve the n-th. Default: 0 (the first one)
 */

function getTagText(root, tagName) {
  var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  if (root && root.getElementsByTagName(tagName)[n]) return root.getElementsByTagName(tagName)[n].textContent;
}

function getIriElem(node, xmlDocument) {
  var node_iri = null;
  if (typeof node === 'string') node_iri = node;else node_iri = getTagText(node, 'iri');
  if (!node_iri) return null;
  var iris = xmlDocument.getElementsByTagName('iris')[0].children;

  var _iterator5 = _createForOfIteratorHelper(iris),
      _step5;

  try {
    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
      var iri = _step5.value;

      if (node_iri == getTagText(iri, 'value')) {
        return iri;
      }
    }
  } catch (err) {
    _iterator5.e(err);
  } finally {
    _iterator5.f();
  }

  return null;
}

function getRemainingChars(iri) {
  var rem_chars = iri.slice(iri.lastIndexOf('#') + 1); // if rem_chars has no '#' then use '/' as separator

  if (rem_chars.length == iri.length) {
    rem_chars = iri.slice(iri.lastIndexOf('/') + 1);
  }

  return rem_chars;
}

var Graphol3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  warnings: warnings$1,
  getOntologyInfo: getOntologyInfo$1,
  getIriPrefixesDictionary: getIriPrefixesDictionary$1,
  getIri: getIri$1,
  getLabel: getLabel$1,
  getPredicateInfo: getPredicateInfo$1,
  getTag: getTag,
  getTagText: getTagText
});

var GrapholParser = /*#__PURE__*/function () {
  function GrapholParser(xmlString) {
    _classCallCheck(this, GrapholParser);

    this.xmlDocument = xmlString instanceof XMLDocument ? xmlString : new DOMParser().parseFromString(xmlString, 'text/xml');
    this.graphol_ver = this.xmlDocument.getElementsByTagName('graphol')[0].getAttribute('version') || -1;
    if (this.graphol_ver == 2 || this.graphol_ver == -1) this.graphol = Graphol2;else if (this.graphol_ver == 3) this.graphol = Graphol3;else throw new Error("Graphol version [".concat(this.graphol_ver, "] not supported"));
  }

  _createClass(GrapholParser, [{
    key: "parseGraphol",
    value: function parseGraphol() {
      var _this = this;

      var ontology_info = this.graphol.getOntologyInfo(this.xmlDocument);
      this.ontology = new Ontology(ontology_info.name, ontology_info.version);
      this.ontology.languages = ontology_info.languages || [];
      this.ontology.default_language = ontology_info.default_language || ontology_info.languages[0];

      if (ontology_info.other_infos) {
        this.ontology.annotations = ontology_info.other_infos.annotations;
        this.ontology.description = ontology_info.other_infos.description;
      } // Create iri and add them to ontology.namespaces
      //let iri_list = this.xmlDocument.getElementsByTagName('iri')


      var dictionary = this.graphol.getIriPrefixesDictionary(this.xmlDocument);
      dictionary.forEach(function (iri) {
        _this.ontology.addIri(new Namespace(iri.prefixes, iri.value, iri.standard));
      });
      var i, k, nodes, edges, cnt, array_json_elems, diagram, node;
      var diagrams = this.xmlDocument.getElementsByTagName('diagram');

      for (i = 0; i < diagrams.length; i++) {
        diagram = new Diagram(diagrams[i].getAttribute('name'), i);
        this.ontology.addDiagram(diagram);
        array_json_elems = [];
        nodes = diagrams[i].getElementsByTagName('node');
        edges = diagrams[i].getElementsByTagName('edge');
        cnt = 0; // Create JSON for each node to be added to the collection

        for (k = 0; k < nodes.length; k++) {
          node = this.getBasicNodeInfos(nodes[k], i);
          node.data.iri = this.graphol.getIri(nodes[k], this.ontology);
          node.data.label = this.graphol.getLabel(nodes[k], this.ontology, this.xmlDocument); // label should be an object { language : label },
          // if it's a string then it has no language, assign default language

          if (typeof node.data.label === "string") {
            var aux_label = node.data.label;
            node.data.label = {};
            node.data.label[this.ontology.default_language] = aux_label;
          }

          if (node.data.label) {
            // try to apply default language as displayed name
            if (node.data.label[this.ontology.default_language]) node.data.displayed_name = node.data.label[this.ontology.default_language];else {
              // otherwise pick the first language available
              var _iterator = _createForOfIteratorHelper(this.ontology.languages),
                  _step;

              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  var lang = _step.value;

                  if (node.data.label[lang]) {
                    node.data.displayed_name = node.data.label[lang];
                    break;
                  }
                } // in case of no languages defined for labels

              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }

              if (!node.data.displayed_name) {
                node.data.displayed_name = node.data.label[Object.keys(node.data.label)[0]];
              }
            }
          }

          if (isPredicate(nodes[k])) {
            (function () {
              var predicate_infos = _this.graphol.getPredicateInfo(nodes[k], _this.xmlDocument, _this.ontology);

              if (predicate_infos) {
                Object.keys(predicate_infos).forEach(function (info) {
                  node.data[info] = predicate_infos[info];
                });
              }
            })();
          }

          array_json_elems.push(node); // add fake nodes when necessary
          // for property assertion, facets or for
          // both functional and inverseFunctional ObjectProperties

          if (array_json_elems[cnt].data.type === 'property-assertion' || array_json_elems[cnt].data.type === 'facet' || array_json_elems[cnt].data.functional && array_json_elems[cnt].data.inverseFunctional) {
            this.addFakeNodes(array_json_elems);
            cnt += array_json_elems.length - cnt;
          } else {
            cnt++;
          }
        }

        diagram.addElems(array_json_elems);
        array_json_elems = [];

        for (k = 0; k < edges.length; k++) {
          array_json_elems.push(this.EdgeXmlToJson(edges[k], i));
        }

        diagram.addElems(array_json_elems);
      }

      if (i == 0) {
        throw new Error("The selected .graphol file has no defined diagram");
      }

      this.getIdentityForNeutralNodes();
      this.warnings = _toConsumableArray(this.graphol.warnings);

      if (this.warnings.length > 10) {
        var length = this.warnings.length;
        this.warnings = this.warnings.slice(0, 9);
        this.warnings.push("...".concat(length - 10, " warnings not shown"));
      }

      this.warnings.forEach(function (w) {
        return console.warn(w);
      });
      return this.ontology;
    }
  }, {
    key: "getBasicNodeInfos",
    value: function getBasicNodeInfos(element, diagram_id) {
      var nodo = {
        data: {
          id_xml: element.getAttribute('id'),
          diagram_id: diagram_id,
          id: element.getAttribute('id') + '_' + diagram_id,
          fillColor: element.getAttribute('color'),
          type: element.getAttribute('type')
        },
        position: {},
        classes: element.getAttribute('type')
      }; // Parsing the <geometry> child node of node

      var geometry = element.getElementsByTagName('geometry')[0];
      nodo.data.width = parseInt(geometry.getAttribute('width'));
      nodo.data.height = parseInt(geometry.getAttribute('height')); // Gli individual hanno dimensioni negative nel file graphol

      if (nodo.data.width < 0) {
        nodo.data.width = -nodo.data.width;
      } // Gli individual hanno dimensioni negative nel file graphol


      if (nodo.data.height < 0) {
        nodo.data.height = -nodo.data.height;
      } // L'altezza dei facet è nulla nel file graphol, la impostiamo a 40


      if (nodo.data.type === 'facet') {
        nodo.data.height = 40;
      }

      nodo.position.x = parseInt(geometry.getAttribute('x'));
      nodo.position.y = parseInt(geometry.getAttribute('y'));

      switch (nodo.data.type) {
        case 'concept':
        case 'domain-restriction':
          nodo.data.shape = 'rectangle';
          nodo.data.identity = 'concept';
          break;

        case 'range-restriction':
          nodo.data.shape = 'rectangle';
          nodo.data.identity = 'neutral';
          break;

        case 'role':
          nodo.data.shape = 'diamond';
          nodo.data.identity = 'role';
          break;

        case 'attribute':
          nodo.data.shape = 'ellipse';
          nodo.data.identity = 'attribute';
          break;

        case 'union':
        case 'disjoint-union':
        case 'complement':
        case 'intersection':
        case 'enumeration':
        case 'has-key':
          nodo.data.shape = 'hexagon';
          nodo.data.identity = 'neutral';
          break;

        case 'role-inverse':
        case 'role-chain':
          nodo.data.shape = 'hexagon';
          nodo.data.identity = 'role';

          if (nodo.data.type === 'role-chain') {
            if (element.getAttribute('inputs') !== '') {
              nodo.data.inputs = element.getAttribute('inputs').split(',');
            }
          }

          break;

        case 'datatype-restriction':
          nodo.data.shape = 'hexagon';
          nodo.data.identity = 'value_domain';
          break;

        case 'value-domain':
          nodo.data.shape = 'roundrectangle';
          nodo.data.identity = 'value_domain';
          break;

        case 'property-assertion':
          nodo.data.shape = 'roundrectangle';
          nodo.data.identity = 'neutral';
          nodo.data.inputs = element.getAttribute('inputs').split(',');
          break;

        case 'literal':
        case 'individual':
          nodo.data.shape = 'octagon';
          nodo.data.identity = nodo.data.type == 'individual' ? 'individual' : 'value';
          break;

        case 'facet':
          nodo.data.shape = 'polygon';
          nodo.data.shape_points = '-0.9 -1 1 -1 0.9 1 -1 1';
          nodo.data.fillColor = '#ffffff';
          nodo.data.identity = 'facet';
          break;

        default:
          console.error('tipo di nodo sconosciuto');
          console.log(nodo);
          break;
      }

      var label = element.getElementsByTagName('label')[0]; // apply label position and font size

      if (label != null) {
        nodo.data.labelXpos = parseInt(label.getAttribute('x')) - nodo.position.x + 1;
        nodo.data.labelYpos = parseInt(label.getAttribute('y')) - nodo.position.y + (nodo.data.height + 2) / 2 + parseInt(label.getAttribute('height')) / 4;
        nodo.data.fontSize = parseInt(label.getAttribute('size')) || 12;
      }

      if (isPredicate(element)) nodo.classes += ' predicate';
      return nodo;
    }
  }, {
    key: "EdgeXmlToJson",
    value: function EdgeXmlToJson(arco, diagram_id) {
      var k;
      var edge = {
        data: {
          target: arco.getAttribute('target') + '_' + diagram_id,
          source: arco.getAttribute('source') + '_' + diagram_id,
          id: arco.getAttribute('id') + '_' + diagram_id,
          id_xml: arco.getAttribute('id'),
          diagram_id: diagram_id,
          type: arco.getAttribute('type'),
          breakpoints: []
        }
      };
      if (edge.data.type.toLowerCase() == 'membership') edge.data.displayed_name = 'instance Of';else if (edge.data.type.toLowerCase() == 'same' || edge.data.type.toLowerCase() == 'different') edge.data.displayed_name = edge.data.type.toLowerCase(); // Prendiamo i nodi source e target

      var source = this.ontology.getDiagram(diagram_id).cy.$id(edge.data.source);
      var target = this.ontology.getDiagram(diagram_id).cy.$id(edge.data.target); // Impostiamo le label numeriche per gli archi che entrano nei role-chain
      // I role-chain hanno un campo <input> con una lista di id di archi all'interno
      // che sono gli archi che entrano, l'ordine nella sequenza stabilisce la label
      // numerica che deve avere l'arco
      // Quindi se l'arco che stiamo aggiungendo ha come target un nodo role-chain,
      // Cerchiamo l'id dell'arco negli inputs del role-chain e se lo troviamo impostiamo
      // la target_label in base alla posizione nella sequenza

      if (target.data('type') === 'role-chain' || target.data('type') === 'property-assertion') {
        for (k = 0; k < target.data('inputs').length; k++) {
          if (target.data('inputs')[k] === edge.data.id_xml) {
            edge.data.target_label = k + 1;
            break;
          }
        }
      } // info = <POINT>
      // Processiamo i breakpoints dell'arco
      // NOTA: ogni arco ha sempre almeno 2 breakpoints, cioè gli endpoints


      var point = getFirstChild(arco);
      var breakpoints = [];
      var segment_weights = [];
      var segment_distances = [];
      var j;
      var count = 0;

      for (j = 0; j < arco.childNodes.length; j++) {
        // Ignoriamo spazi vuoti, e altri figli di tipo diverso da 1
        if (arco.childNodes[j].nodeType != 1) {
          continue;
        }

        breakpoints[count] = {
          'x': parseInt(point.getAttribute('x')),
          'y': parseInt(point.getAttribute('y'))
        }; //breakpoints[count].push(parseInt(point.getAttribute('x')))
        //breakpoints[count].push(parseInt(point.getAttribute('y')))

        if (getNextSibling(point) != null) {
          point = getNextSibling(point); // Se il breakpoint in questione non è il primo
          // e non è l'ultimo, visto che ha un fratello,
          // allora calcoliamo peso e distanza per questo breakpoint
          // [Il primo e l'ultimo breakpoint sono gli endpoint e non hanno peso e distanza]

          if (count > 0) {
            var aux = getDistanceWeight(target.position(), source.position(), breakpoints[count]);
            segment_distances.push(aux[0]);
            segment_weights.push(aux[1]);
          }

          count++;
        } else {
          break;
        }
      } // Se ci sono almeno 3 breakpoints, allora impostiamo gli array delle distanze e dei pesi


      if (count > 1) {
        edge.data.breakpoints = breakpoints.slice(1, count);
        edge.data.segment_distances = segment_distances;
        edge.data.segment_weights = segment_weights;
      } // Calcoliamo gli endpoints sul source e sul target
      // Se non sono centrati sul nodo vanno spostati sul bordo del nodo


      var source_endpoint = [];
      source_endpoint['x'] = breakpoints[0]['x'];
      source_endpoint['y'] = breakpoints[0]['y'];
      source_endpoint = getNewEndpoint(source_endpoint, source, breakpoints[1]); // Impostiamo l'endpoint solo se è diverso da zero
      // perchè di default l'endpoint è impostato a (0,0) relativamente al nodo di riferimento

      if (source_endpoint['x'] != 0 || source_endpoint['y'] != 0) {
        edge.data.source_endpoint = [];
        edge.data.source_endpoint.push(source_endpoint['x']);
        edge.data.source_endpoint.push(source_endpoint['y']);
      } // Facciamo la stessa cosa per il target


      var target_endpoint = [];
      target_endpoint['x'] = breakpoints[breakpoints.length - 1]['x'];
      target_endpoint['y'] = breakpoints[breakpoints.length - 1]['y'];
      target_endpoint = getNewEndpoint(target_endpoint, target, breakpoints[breakpoints.length - 2]);

      if (target_endpoint['x'] != 0 || target_endpoint['y'] != 0) {
        edge.data.target_endpoint = [];
        edge.data.target_endpoint.push(target_endpoint['x']);
        edge.data.target_endpoint.push(target_endpoint['y']);
      }

      return edge;
    }
  }, {
    key: "addFakeNodes",
    value: function addFakeNodes(array_json_nodes) {
      var nodo = array_json_nodes[array_json_nodes.length - 1];

      if (nodo.data.type === 'facet') {
        // Se il nodo è di tipo facet inseriamo i ritorni a capo nella label
        // e la trasliamo verso il basso di una quantità pari all'altezza del nodo
        nodo.data.displayed_name = nodo.data.displayed_name.replace('^^', '\n\n');
        nodo.data.labelYpos = nodo.data.height; // Creating the top rhomboid for the grey background

        var top_rhomboid = {
          selectable: false,
          data: {
            height: nodo.data.height,
            width: nodo.data.width,
            shape: 'polygon',
            shape_points: '-0.9 -1 1 -1 0.95 0 -0.95 0',
            diagram_id: nodo.data.diagram_id,
            parent_node_id: nodo.data.id,
            type: nodo.data.type
          },
          position: {
            x: nodo.position.x,
            y: nodo.position.y
          },
          classes: 'fake-top-rhomboid'
        };
        var bottom_rhomboid = {
          selectable: false,
          data: {
            height: nodo.data.height,
            width: nodo.data.width,
            shape: 'polygon',
            shape_points: '-0.95 0 0.95 0 0.9 1 -1 1',
            diagram_id: nodo.data.diagram_id,
            parent_node_id: nodo.data.id,
            type: nodo.data.type
          },
          position: {
            x: nodo.position.x,
            y: nodo.position.y
          }
        };
        array_json_nodes[array_json_nodes.length - 1] = top_rhomboid;
        array_json_nodes.push(bottom_rhomboid);
        array_json_nodes.push(nodo);
        return;
      }

      if (nodo.data.functional === 1 && nodo.data.inverseFunctional === 1) {
        // Creating "fake" nodes for the double style border effect
        var triangle_right = {
          selectable: false,
          data: {
            height: nodo.data.height,
            width: nodo.data.width,
            fillColor: "#000",
            shape: 'polygon',
            shape_points: '0 -1 1 0 0 1',
            diagram_id: nodo.data.diagram_id,
            type: nodo.data.type
          },
          position: {
            x: nodo.position.x,
            y: nodo.position.y
          },
          classes: 'fake-triangle fake-triangle-right'
        };
        var triangle_left = {
          selectable: false,
          data: {
            height: nodo.data.height,
            width: nodo.data.width + 2,
            fillColor: '#fcfcfc',
            shape: 'polygon',
            shape_points: '0 -1 -1 0 0 1',
            diagram_id: nodo.data.diagram_id,
            type: nodo.data.type
          },
          position: {
            x: nodo.position.x,
            y: nodo.position.y
          },
          classes: 'fake-triangle'
        }; //var old_labelXpos = nodo.data.labelXpos
        //var old_labelYpos = nodo.data.labelYpos

        nodo.data.height -= 8;
        nodo.data.width -= 10; // If the node is both functional and inverse functional,
        // we added the double style border and changed the node height and width.
        // The label position is function of node's height and width so we adjust it
        // now after those changes.

        if (nodo.data.displayed_name != null) {
          nodo.data.labelYpos -= 4;
        }

        array_json_nodes[array_json_nodes.length - 1] = triangle_left;
        array_json_nodes.push(triangle_right);
        array_json_nodes.push(nodo);
      }

      if (nodo.data.type === 'property-assertion') {
        var circle1 = {
          selectable: false,
          classes: 'no_overlay',
          data: {
            height: nodo.data.height,
            width: nodo.data.height,
            shape: 'ellipse',
            diagram_id: nodo.data.diagram_id,
            fillColor: '#fff',
            parent_node_id: nodo.data.id,
            type: nodo.data.type
          },
          position: {
            x: nodo.position.x - (nodo.data.width - nodo.data.height) / 2,
            y: nodo.position.y
          }
        };
        var circle2 = {
          selectable: false,
          classes: 'no_overlay',
          data: {
            height: nodo.data.height,
            width: nodo.data.height,
            shape: 'ellipse',
            diagram_id: nodo.data.diagram_id,
            fillColor: '#fff',
            parent_node_id: nodo.data.id,
            type: nodo.data.type
          },
          position: {
            x: nodo.position.x + (nodo.data.width - nodo.data.height) / 2,
            y: nodo.position.y
          }
        };
        var back_rectangle = {
          data: {
            selectable: false,
            height: nodo.data.height,
            width: nodo.data.width - nodo.data.height,
            shape: 'rectangle',
            diagram_id: nodo.data.diagram_id,
            fillColor: '#fff',
            parent_node_id: nodo.data.id,
            type: nodo.data.type
          },
          position: nodo.position
        };
        nodo.data.height -= 1;
        nodo.data.width = nodo.data.width - nodo.data.height;
        nodo.data.shape = 'rectangle';
        nodo.classes = 'property-assertion no_border';
        array_json_nodes[array_json_nodes.length - 1] = back_rectangle;
        array_json_nodes.push(circle1);
        array_json_nodes.push(circle2);
        array_json_nodes.push(nodo);
      }
    }
  }, {
    key: "getIdentityForNeutralNodes",
    value: function getIdentityForNeutralNodes() {
      this.ontology.diagrams.forEach(function (diagram) {
        diagram.cy.nodes('[identity = "neutral"]').forEach(function (node) {
          node.data('identity', findIdentity(node));
        });
      }); // Recursively traverse first input node and return his identity
      // if he is neutral => recursive step

      function findIdentity(node) {
        var first_input_node = node.incomers('[type = "input"]').sources();
        var identity = first_input_node.data('identity');

        if (identity === 'neutral') {
          return findIdentity(first_input_node);
        } else {
          switch (node.data('type')) {
            case 'range-restriction':
              if (identity === 'role') {
                return 'concept';
              } else if (identity === 'attribute') {
                return 'value_domain';
              } else {
                return identity;
              }

            case 'enumeration':
              if (identity === 'individual') {
                return 'concept';
              } else {
                return identity;
              }

            default:
              return identity;
          }
        }
      }
    }
  }]);

  return GrapholParser;
}();

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * True if the custom elements polyfill is in use.
 */
var isCEPolyfill = typeof window !== 'undefined' && window.customElements != null && window.customElements.polyfillWrapFlushCallback !== undefined;
/**
 * Removes nodes, starting from `start` (inclusive) to `end` (exclusive), from
 * `container`.
 */

var removeNodes = function removeNodes(container, start) {
  var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  while (start !== end) {
    var n = start.nextSibling;
    container.removeChild(start);
    start = n;
  }
};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * An expression marker with embedded unique key to avoid collision with
 * possible text in templates.
 */
var marker = "{{lit-".concat(String(Math.random()).slice(2), "}}");
/**
 * An expression marker used text-positions, multi-binding attributes, and
 * attributes with markup-like text values.
 */

var nodeMarker = "<!--".concat(marker, "-->");
var markerRegex = new RegExp("".concat(marker, "|").concat(nodeMarker));
/**
 * Suffix appended to all bound attribute names.
 */

var boundAttributeSuffix = '$lit$';
/**
 * An updatable Template that tracks the location of dynamic parts.
 */

var Template = function Template(result, element) {
  _classCallCheck(this, Template);

  this.parts = [];
  this.element = element;
  var nodesToRemove = [];
  var stack = []; // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null

  var walker = document.createTreeWalker(element.content, 133
  /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
  , null, false); // Keeps track of the last index associated with a part. We try to delete
  // unnecessary nodes, but we never want to associate two different parts
  // to the same index. They must have a constant node between.

  var lastPartIndex = 0;
  var index = -1;
  var partIndex = 0;
  var strings = result.strings,
      length = result.values.length;

  while (partIndex < length) {
    var node = walker.nextNode();

    if (node === null) {
      // We've exhausted the content inside a nested template element.
      // Because we still have parts (the outer for-loop), we know:
      // - There is a template in the stack
      // - The walker will find a nextNode outside the template
      walker.currentNode = stack.pop();
      continue;
    }

    index++;

    if (node.nodeType === 1
    /* Node.ELEMENT_NODE */
    ) {
        if (node.hasAttributes()) {
          var attributes = node.attributes;
          var _length = attributes.length; // Per
          // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
          // attributes are not guaranteed to be returned in document order.
          // In particular, Edge/IE can return them out of order, so we cannot
          // assume a correspondence between part index and attribute index.

          var count = 0;

          for (var i = 0; i < _length; i++) {
            if (endsWith(attributes[i].name, boundAttributeSuffix)) {
              count++;
            }
          }

          while (count-- > 0) {
            // Get the template literal section leading up to the first
            // expression in this attribute
            var stringForPart = strings[partIndex]; // Find the attribute name

            var name = lastAttributeNameRegex.exec(stringForPart)[2]; // Find the corresponding attribute
            // All bound attributes have had a suffix added in
            // TemplateResult#getHTML to opt out of special attribute
            // handling. To look up the attribute value we also need to add
            // the suffix.

            var attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
            var attributeValue = node.getAttribute(attributeLookupName);
            node.removeAttribute(attributeLookupName);
            var statics = attributeValue.split(markerRegex);
            this.parts.push({
              type: 'attribute',
              index: index,
              name: name,
              strings: statics
            });
            partIndex += statics.length - 1;
          }
        }

        if (node.tagName === 'TEMPLATE') {
          stack.push(node);
          walker.currentNode = node.content;
        }
      } else if (node.nodeType === 3
    /* Node.TEXT_NODE */
    ) {
        var data = node.data;

        if (data.indexOf(marker) >= 0) {
          var parent = node.parentNode;

          var _strings = data.split(markerRegex);

          var lastIndex = _strings.length - 1; // Generate a new text node for each literal section
          // These nodes are also used as the markers for node parts

          for (var _i = 0; _i < lastIndex; _i++) {
            var insert = void 0;
            var s = _strings[_i];

            if (s === '') {
              insert = createMarker();
            } else {
              var match = lastAttributeNameRegex.exec(s);

              if (match !== null && endsWith(match[2], boundAttributeSuffix)) {
                s = s.slice(0, match.index) + match[1] + match[2].slice(0, -boundAttributeSuffix.length) + match[3];
              }

              insert = document.createTextNode(s);
            }

            parent.insertBefore(insert, node);
            this.parts.push({
              type: 'node',
              index: ++index
            });
          } // If there's no text, we must insert a comment to mark our place.
          // Else, we can trust it will stick around after cloning.


          if (_strings[lastIndex] === '') {
            parent.insertBefore(createMarker(), node);
            nodesToRemove.push(node);
          } else {
            node.data = _strings[lastIndex];
          } // We have a part for each match found


          partIndex += lastIndex;
        }
      } else if (node.nodeType === 8
    /* Node.COMMENT_NODE */
    ) {
        if (node.data === marker) {
          var _parent = node.parentNode; // Add a new marker node to be the startNode of the Part if any of
          // the following are true:
          //  * We don't have a previousSibling
          //  * The previousSibling is already the start of a previous part

          if (node.previousSibling === null || index === lastPartIndex) {
            index++;

            _parent.insertBefore(createMarker(), node);
          }

          lastPartIndex = index;
          this.parts.push({
            type: 'node',
            index: index
          }); // If we don't have a nextSibling, keep this node so we have an end.
          // Else, we can remove it to save future costs.

          if (node.nextSibling === null) {
            node.data = '';
          } else {
            nodesToRemove.push(node);
            index--;
          }

          partIndex++;
        } else {
          var _i2 = -1;

          while ((_i2 = node.data.indexOf(marker, _i2 + 1)) !== -1) {
            // Comment node has a binding marker inside, make an inactive part
            // The binding won't work, but subsequent bindings will
            // TODO (justinfagnani): consider whether it's even worth it to
            // make bindings in comments work
            this.parts.push({
              type: 'node',
              index: -1
            });
            partIndex++;
          }
        }
      }
  } // Remove text binding nodes after the walk to not disturb the TreeWalker


  for (var _i3 = 0, _nodesToRemove = nodesToRemove; _i3 < _nodesToRemove.length; _i3++) {
    var n = _nodesToRemove[_i3];
    n.parentNode.removeChild(n);
  }
};

var endsWith = function endsWith(str, suffix) {
  var index = str.length - suffix.length;
  return index >= 0 && str.slice(index) === suffix;
};

var isTemplatePartActive = function isTemplatePartActive(part) {
  return part.index !== -1;
}; // Allows `document.createComment('')` to be renamed for a
// small manual size-savings.

var createMarker = function createMarker() {
  return document.createComment('');
};
/**
 * This regex extracts the attribute name preceding an attribute-position
 * expression. It does this by matching the syntax allowed for attributes
 * against the string literal directly preceding the expression, assuming that
 * the expression is in an attribute-value position.
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#elements-attributes
 *
 * " \x09\x0a\x0c\x0d" are HTML space characters:
 * https://www.w3.org/TR/html5/infrastructure.html#space-characters
 *
 * "\0-\x1F\x7F-\x9F" are Unicode control characters, which includes every
 * space character except " ".
 *
 * So an attribute is:
 *  * The name: any character except a control character, space character, ('),
 *    ("), ">", "=", or "/"
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */

var lastAttributeNameRegex = // eslint-disable-next-line no-control-regex
/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;

var walkerNodeFilter = 133
/* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
;
/**
 * Removes the list of nodes from a Template safely. In addition to removing
 * nodes from the Template, the Template part indices are updated to match
 * the mutated Template DOM.
 *
 * As the template is walked the removal state is tracked and
 * part indices are adjusted as needed.
 *
 * div
 *   div#1 (remove) <-- start removing (removing node is div#1)
 *     div
 *       div#2 (remove)  <-- continue removing (removing node is still div#1)
 *         div
 * div <-- stop removing since previous sibling is the removing node (div#1,
 * removed 4 nodes)
 */

function removeNodesFromTemplate(template, nodesToRemove) {
  var content = template.element.content,
      parts = template.parts;
  var walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
  var partIndex = nextActiveIndexInTemplateParts(parts);
  var part = parts[partIndex];
  var nodeIndex = -1;
  var removeCount = 0;
  var nodesToRemoveInTemplate = [];
  var currentRemovingNode = null;

  while (walker.nextNode()) {
    nodeIndex++;
    var node = walker.currentNode; // End removal if stepped past the removing node

    if (node.previousSibling === currentRemovingNode) {
      currentRemovingNode = null;
    } // A node to remove was found in the template


    if (nodesToRemove.has(node)) {
      nodesToRemoveInTemplate.push(node); // Track node we're removing

      if (currentRemovingNode === null) {
        currentRemovingNode = node;
      }
    } // When removing, increment count by which to adjust subsequent part indices


    if (currentRemovingNode !== null) {
      removeCount++;
    }

    while (part !== undefined && part.index === nodeIndex) {
      // If part is in a removed node deactivate it by setting index to -1 or
      // adjust the index as needed.
      part.index = currentRemovingNode !== null ? -1 : part.index - removeCount; // go to the next active part.

      partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
      part = parts[partIndex];
    }
  }

  nodesToRemoveInTemplate.forEach(function (n) {
    return n.parentNode.removeChild(n);
  });
}

var countNodes = function countNodes(node) {
  var count = node.nodeType === 11
  /* Node.DOCUMENT_FRAGMENT_NODE */
  ? 0 : 1;
  var walker = document.createTreeWalker(node, walkerNodeFilter, null, false);

  while (walker.nextNode()) {
    count++;
  }

  return count;
};

var nextActiveIndexInTemplateParts = function nextActiveIndexInTemplateParts(parts) {
  var startIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

  for (var i = startIndex + 1; i < parts.length; i++) {
    var part = parts[i];

    if (isTemplatePartActive(part)) {
      return i;
    }
  }

  return -1;
};
/**
 * Inserts the given node into the Template, optionally before the given
 * refNode. In addition to inserting the node into the Template, the Template
 * part indices are updated to match the mutated Template DOM.
 */


function insertNodeIntoTemplate(template, node) {
  var refNode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var content = template.element.content,
      parts = template.parts; // If there's no refNode, then put node at end of template.
  // No part indices need to be shifted in this case.

  if (refNode === null || refNode === undefined) {
    content.appendChild(node);
    return;
  }

  var walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
  var partIndex = nextActiveIndexInTemplateParts(parts);
  var insertCount = 0;
  var walkerIndex = -1;

  while (walker.nextNode()) {
    walkerIndex++;
    var walkerNode = walker.currentNode;

    if (walkerNode === refNode) {
      insertCount = countNodes(node);
      refNode.parentNode.insertBefore(node, refNode);
    }

    while (partIndex !== -1 && parts[partIndex].index === walkerIndex) {
      // If we've inserted the node, simply adjust all subsequent parts
      if (insertCount > 0) {
        while (partIndex !== -1) {
          parts[partIndex].index += insertCount;
          partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
        }

        return;
      }

      partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
    }
  }
}

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
var directives = new WeakMap();
var isDirective = function isDirective(o) {
  return typeof o === 'function' && directives.has(o);
};

/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * A sentinel value that signals that a value was handled by a directive and
 * should not be written to the DOM.
 */
var noChange = {};
/**
 * A sentinel value that signals a NodePart to fully clear its content.
 */

var nothing = {};

/**
 * An instance of a `Template` that can be attached to the DOM and updated
 * with new values.
 */

var TemplateInstance = /*#__PURE__*/function () {
  function TemplateInstance(template, processor, options) {
    _classCallCheck(this, TemplateInstance);

    this.__parts = [];
    this.template = template;
    this.processor = processor;
    this.options = options;
  }

  _createClass(TemplateInstance, [{
    key: "update",
    value: function update(values) {
      var i = 0;

      var _iterator = _createForOfIteratorHelper(this.__parts),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var part = _step.value;

          if (part !== undefined) {
            part.setValue(values[i]);
          }

          i++;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      var _iterator2 = _createForOfIteratorHelper(this.__parts),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _part = _step2.value;

          if (_part !== undefined) {
            _part.commit();
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }, {
    key: "_clone",
    value: function _clone() {
      // There are a number of steps in the lifecycle of a template instance's
      // DOM fragment:
      //  1. Clone - create the instance fragment
      //  2. Adopt - adopt into the main document
      //  3. Process - find part markers and create parts
      //  4. Upgrade - upgrade custom elements
      //  5. Update - set node, attribute, property, etc., values
      //  6. Connect - connect to the document. Optional and outside of this
      //     method.
      //
      // We have a few constraints on the ordering of these steps:
      //  * We need to upgrade before updating, so that property values will pass
      //    through any property setters.
      //  * We would like to process before upgrading so that we're sure that the
      //    cloned fragment is inert and not disturbed by self-modifying DOM.
      //  * We want custom elements to upgrade even in disconnected fragments.
      //
      // Given these constraints, with full custom elements support we would
      // prefer the order: Clone, Process, Adopt, Upgrade, Update, Connect
      //
      // But Safari does not implement CustomElementRegistry#upgrade, so we
      // can not implement that order and still have upgrade-before-update and
      // upgrade disconnected fragments. So we instead sacrifice the
      // process-before-upgrade constraint, since in Custom Elements v1 elements
      // must not modify their light DOM in the constructor. We still have issues
      // when co-existing with CEv0 elements like Polymer 1, and with polyfills
      // that don't strictly adhere to the no-modification rule because shadow
      // DOM, which may be created in the constructor, is emulated by being placed
      // in the light DOM.
      //
      // The resulting order is on native is: Clone, Adopt, Upgrade, Process,
      // Update, Connect. document.importNode() performs Clone, Adopt, and Upgrade
      // in one step.
      //
      // The Custom Elements v1 polyfill supports upgrade(), so the order when
      // polyfilled is the more ideal: Clone, Process, Adopt, Upgrade, Update,
      // Connect.
      var fragment = isCEPolyfill ? this.template.element.content.cloneNode(true) : document.importNode(this.template.element.content, true);
      var stack = [];
      var parts = this.template.parts; // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null

      var walker = document.createTreeWalker(fragment, 133
      /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
      , null, false);
      var partIndex = 0;
      var nodeIndex = 0;
      var part;
      var node = walker.nextNode(); // Loop through all the nodes and parts of a template

      while (partIndex < parts.length) {
        part = parts[partIndex];

        if (!isTemplatePartActive(part)) {
          this.__parts.push(undefined);

          partIndex++;
          continue;
        } // Progress the tree walker until we find our next part's node.
        // Note that multiple parts may share the same node (attribute parts
        // on a single element), so this loop may not run at all.


        while (nodeIndex < part.index) {
          nodeIndex++;

          if (node.nodeName === 'TEMPLATE') {
            stack.push(node);
            walker.currentNode = node.content;
          }

          if ((node = walker.nextNode()) === null) {
            // We've exhausted the content inside a nested template element.
            // Because we still have parts (the outer for-loop), we know:
            // - There is a template in the stack
            // - The walker will find a nextNode outside the template
            walker.currentNode = stack.pop();
            node = walker.nextNode();
          }
        } // We've arrived at our part's node.


        if (part.type === 'node') {
          var _part2 = this.processor.handleTextExpression(this.options);

          _part2.insertAfterNode(node.previousSibling);

          this.__parts.push(_part2);
        } else {
          var _this$__parts;

          (_this$__parts = this.__parts).push.apply(_this$__parts, _toConsumableArray(this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options)));
        }

        partIndex++;
      }

      if (isCEPolyfill) {
        document.adoptNode(fragment);
        customElements.upgrade(fragment);
      }

      return fragment;
    }
  }]);

  return TemplateInstance;
}();

var commentMarker = " ".concat(marker, " ");
/**
 * The return type of `html`, which holds a Template and the values from
 * interpolated expressions.
 */

var TemplateResult = /*#__PURE__*/function () {
  function TemplateResult(strings, values, type, processor) {
    _classCallCheck(this, TemplateResult);

    this.strings = strings;
    this.values = values;
    this.type = type;
    this.processor = processor;
  }
  /**
   * Returns a string of HTML used to create a `<template>` element.
   */


  _createClass(TemplateResult, [{
    key: "getHTML",
    value: function getHTML() {
      var l = this.strings.length - 1;
      var html = '';
      var isCommentBinding = false;

      for (var i = 0; i < l; i++) {
        var s = this.strings[i]; // For each binding we want to determine the kind of marker to insert
        // into the template source before it's parsed by the browser's HTML
        // parser. The marker type is based on whether the expression is in an
        // attribute, text, or comment position.
        //   * For node-position bindings we insert a comment with the marker
        //     sentinel as its text content, like <!--{{lit-guid}}-->.
        //   * For attribute bindings we insert just the marker sentinel for the
        //     first binding, so that we support unquoted attribute bindings.
        //     Subsequent bindings can use a comment marker because multi-binding
        //     attributes must be quoted.
        //   * For comment bindings we insert just the marker sentinel so we don't
        //     close the comment.
        //
        // The following code scans the template source, but is *not* an HTML
        // parser. We don't need to track the tree structure of the HTML, only
        // whether a binding is inside a comment, and if not, if it appears to be
        // the first binding in an attribute.

        var commentOpen = s.lastIndexOf('<!--'); // We're in comment position if we have a comment open with no following
        // comment close. Because <-- can appear in an attribute value there can
        // be false positives.

        isCommentBinding = (commentOpen > -1 || isCommentBinding) && s.indexOf('-->', commentOpen + 1) === -1; // Check to see if we have an attribute-like sequence preceding the
        // expression. This can match "name=value" like structures in text,
        // comments, and attribute values, so there can be false-positives.

        var attributeMatch = lastAttributeNameRegex.exec(s);

        if (attributeMatch === null) {
          // We're only in this branch if we don't have a attribute-like
          // preceding sequence. For comments, this guards against unusual
          // attribute values like <div foo="<!--${'bar'}">. Cases like
          // <!-- foo=${'bar'}--> are handled correctly in the attribute branch
          // below.
          html += s + (isCommentBinding ? commentMarker : nodeMarker);
        } else {
          // For attributes we use just a marker sentinel, and also append a
          // $lit$ suffix to the name to opt-out of attribute-specific parsing
          // that IE and Edge do for style and certain SVG attributes.
          html += s.substr(0, attributeMatch.index) + attributeMatch[1] + attributeMatch[2] + boundAttributeSuffix + attributeMatch[3] + marker;
        }
      }

      html += this.strings[l];
      return html;
    }
  }, {
    key: "getTemplateElement",
    value: function getTemplateElement() {
      var template = document.createElement('template');
      template.innerHTML = this.getHTML();
      return template;
    }
  }]);

  return TemplateResult;
}();

var isPrimitive = function isPrimitive(value) {
  return value === null || !(_typeof(value) === 'object' || typeof value === 'function');
};
var isIterable = function isIterable(value) {
  return Array.isArray(value) || // eslint-disable-next-line @typescript-eslint/no-explicit-any
  !!(value && value[Symbol.iterator]);
};
/**
 * Writes attribute values to the DOM for a group of AttributeParts bound to a
 * single attribute. The value is only set once even if there are multiple parts
 * for an attribute.
 */

var AttributeCommitter = /*#__PURE__*/function () {
  function AttributeCommitter(element, name, strings) {
    _classCallCheck(this, AttributeCommitter);

    this.dirty = true;
    this.element = element;
    this.name = name;
    this.strings = strings;
    this.parts = [];

    for (var i = 0; i < strings.length - 1; i++) {
      this.parts[i] = this._createPart();
    }
  }
  /**
   * Creates a single part. Override this to create a differnt type of part.
   */


  _createClass(AttributeCommitter, [{
    key: "_createPart",
    value: function _createPart() {
      return new AttributePart(this);
    }
  }, {
    key: "_getValue",
    value: function _getValue() {
      var strings = this.strings;
      var l = strings.length - 1;
      var text = '';

      for (var i = 0; i < l; i++) {
        text += strings[i];
        var part = this.parts[i];

        if (part !== undefined) {
          var v = part.value;

          if (isPrimitive(v) || !isIterable(v)) {
            text += typeof v === 'string' ? v : String(v);
          } else {
            var _iterator = _createForOfIteratorHelper(v),
                _step;

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                var t = _step.value;
                text += typeof t === 'string' ? t : String(t);
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
          }
        }
      }

      text += strings[l];
      return text;
    }
  }, {
    key: "commit",
    value: function commit() {
      if (this.dirty) {
        this.dirty = false;
        this.element.setAttribute(this.name, this._getValue());
      }
    }
  }]);

  return AttributeCommitter;
}();
/**
 * A Part that controls all or part of an attribute value.
 */

var AttributePart = /*#__PURE__*/function () {
  function AttributePart(committer) {
    _classCallCheck(this, AttributePart);

    this.value = undefined;
    this.committer = committer;
  }

  _createClass(AttributePart, [{
    key: "setValue",
    value: function setValue(value) {
      if (value !== noChange && (!isPrimitive(value) || value !== this.value)) {
        this.value = value; // If the value is a not a directive, dirty the committer so that it'll
        // call setAttribute. If the value is a directive, it'll dirty the
        // committer if it calls setValue().

        if (!isDirective(value)) {
          this.committer.dirty = true;
        }
      }
    }
  }, {
    key: "commit",
    value: function commit() {
      while (isDirective(this.value)) {
        var directive = this.value;
        this.value = noChange;
        directive(this);
      }

      if (this.value === noChange) {
        return;
      }

      this.committer.commit();
    }
  }]);

  return AttributePart;
}();
/**
 * A Part that controls a location within a Node tree. Like a Range, NodePart
 * has start and end locations and can set and update the Nodes between those
 * locations.
 *
 * NodeParts support several value types: primitives, Nodes, TemplateResults,
 * as well as arrays and iterables of those types.
 */

var NodePart = /*#__PURE__*/function () {
  function NodePart(options) {
    _classCallCheck(this, NodePart);

    this.value = undefined;
    this.__pendingValue = undefined;
    this.options = options;
  }
  /**
   * Appends this part into a container.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  _createClass(NodePart, [{
    key: "appendInto",
    value: function appendInto(container) {
      this.startNode = container.appendChild(createMarker());
      this.endNode = container.appendChild(createMarker());
    }
    /**
     * Inserts this part after the `ref` node (between `ref` and `ref`'s next
     * sibling). Both `ref` and its next sibling must be static, unchanging nodes
     * such as those that appear in a literal section of a template.
     *
     * This part must be empty, as its contents are not automatically moved.
     */

  }, {
    key: "insertAfterNode",
    value: function insertAfterNode(ref) {
      this.startNode = ref;
      this.endNode = ref.nextSibling;
    }
    /**
     * Appends this part into a parent part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */

  }, {
    key: "appendIntoPart",
    value: function appendIntoPart(part) {
      part.__insert(this.startNode = createMarker());

      part.__insert(this.endNode = createMarker());
    }
    /**
     * Inserts this part after the `ref` part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */

  }, {
    key: "insertAfterPart",
    value: function insertAfterPart(ref) {
      ref.__insert(this.startNode = createMarker());

      this.endNode = ref.endNode;
      ref.endNode = this.startNode;
    }
  }, {
    key: "setValue",
    value: function setValue(value) {
      this.__pendingValue = value;
    }
  }, {
    key: "commit",
    value: function commit() {
      if (this.startNode.parentNode === null) {
        return;
      }

      while (isDirective(this.__pendingValue)) {
        var directive = this.__pendingValue;
        this.__pendingValue = noChange;
        directive(this);
      }

      var value = this.__pendingValue;

      if (value === noChange) {
        return;
      }

      if (isPrimitive(value)) {
        if (value !== this.value) {
          this.__commitText(value);
        }
      } else if (value instanceof TemplateResult) {
        this.__commitTemplateResult(value);
      } else if (value instanceof Node) {
        this.__commitNode(value);
      } else if (isIterable(value)) {
        this.__commitIterable(value);
      } else if (value === nothing) {
        this.value = nothing;
        this.clear();
      } else {
        // Fallback, will render the string representation
        this.__commitText(value);
      }
    }
  }, {
    key: "__insert",
    value: function __insert(node) {
      this.endNode.parentNode.insertBefore(node, this.endNode);
    }
  }, {
    key: "__commitNode",
    value: function __commitNode(value) {
      if (this.value === value) {
        return;
      }

      this.clear();

      this.__insert(value);

      this.value = value;
    }
  }, {
    key: "__commitText",
    value: function __commitText(value) {
      var node = this.startNode.nextSibling;
      value = value == null ? '' : value; // If `value` isn't already a string, we explicitly convert it here in case
      // it can't be implicitly converted - i.e. it's a symbol.

      var valueAsString = typeof value === 'string' ? value : String(value);

      if (node === this.endNode.previousSibling && node.nodeType === 3
      /* Node.TEXT_NODE */
      ) {
          // If we only have a single text node between the markers, we can just
          // set its value, rather than replacing it.
          // TODO(justinfagnani): Can we just check if this.value is primitive?
          node.data = valueAsString;
        } else {
        this.__commitNode(document.createTextNode(valueAsString));
      }

      this.value = value;
    }
  }, {
    key: "__commitTemplateResult",
    value: function __commitTemplateResult(value) {
      var template = this.options.templateFactory(value);

      if (this.value instanceof TemplateInstance && this.value.template === template) {
        this.value.update(value.values);
      } else {
        // Make sure we propagate the template processor from the TemplateResult
        // so that we use its syntax extension, etc. The template factory comes
        // from the render function options so that it can control template
        // caching and preprocessing.
        var instance = new TemplateInstance(template, value.processor, this.options);

        var fragment = instance._clone();

        instance.update(value.values);

        this.__commitNode(fragment);

        this.value = instance;
      }
    }
  }, {
    key: "__commitIterable",
    value: function __commitIterable(value) {
      // For an Iterable, we create a new InstancePart per item, then set its
      // value to the item. This is a little bit of overhead for every item in
      // an Iterable, but it lets us recurse easily and efficiently update Arrays
      // of TemplateResults that will be commonly returned from expressions like:
      // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
      // If _value is an array, then the previous render was of an
      // iterable and _value will contain the NodeParts from the previous
      // render. If _value is not an array, clear this part and make a new
      // array for NodeParts.
      if (!Array.isArray(this.value)) {
        this.value = [];
        this.clear();
      } // Lets us keep track of how many items we stamped so we can clear leftover
      // items from a previous render


      var itemParts = this.value;
      var partIndex = 0;
      var itemPart;

      var _iterator2 = _createForOfIteratorHelper(value),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var item = _step2.value;
          // Try to reuse an existing part
          itemPart = itemParts[partIndex]; // If no existing part, create a new one

          if (itemPart === undefined) {
            itemPart = new NodePart(this.options);
            itemParts.push(itemPart);

            if (partIndex === 0) {
              itemPart.appendIntoPart(this);
            } else {
              itemPart.insertAfterPart(itemParts[partIndex - 1]);
            }
          }

          itemPart.setValue(item);
          itemPart.commit();
          partIndex++;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      if (partIndex < itemParts.length) {
        // Truncate the parts array so _value reflects the current state
        itemParts.length = partIndex;
        this.clear(itemPart && itemPart.endNode);
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      var startNode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.startNode;
      removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
    }
  }]);

  return NodePart;
}();
/**
 * Implements a boolean attribute, roughly as defined in the HTML
 * specification.
 *
 * If the value is truthy, then the attribute is present with a value of
 * ''. If the value is falsey, the attribute is removed.
 */

var BooleanAttributePart = /*#__PURE__*/function () {
  function BooleanAttributePart(element, name, strings) {
    _classCallCheck(this, BooleanAttributePart);

    this.value = undefined;
    this.__pendingValue = undefined;

    if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
      throw new Error('Boolean attributes can only contain a single expression');
    }

    this.element = element;
    this.name = name;
    this.strings = strings;
  }

  _createClass(BooleanAttributePart, [{
    key: "setValue",
    value: function setValue(value) {
      this.__pendingValue = value;
    }
  }, {
    key: "commit",
    value: function commit() {
      while (isDirective(this.__pendingValue)) {
        var directive = this.__pendingValue;
        this.__pendingValue = noChange;
        directive(this);
      }

      if (this.__pendingValue === noChange) {
        return;
      }

      var value = !!this.__pendingValue;

      if (this.value !== value) {
        if (value) {
          this.element.setAttribute(this.name, '');
        } else {
          this.element.removeAttribute(this.name);
        }

        this.value = value;
      }

      this.__pendingValue = noChange;
    }
  }]);

  return BooleanAttributePart;
}();
/**
 * Sets attribute values for PropertyParts, so that the value is only set once
 * even if there are multiple parts for a property.
 *
 * If an expression controls the whole property value, then the value is simply
 * assigned to the property under control. If there are string literals or
 * multiple expressions, then the strings are expressions are interpolated into
 * a string first.
 */

var PropertyCommitter = /*#__PURE__*/function (_AttributeCommitter) {
  _inherits(PropertyCommitter, _AttributeCommitter);

  var _super = _createSuper(PropertyCommitter);

  function PropertyCommitter(element, name, strings) {
    var _this;

    _classCallCheck(this, PropertyCommitter);

    _this = _super.call(this, element, name, strings);
    _this.single = strings.length === 2 && strings[0] === '' && strings[1] === '';
    return _this;
  }

  _createClass(PropertyCommitter, [{
    key: "_createPart",
    value: function _createPart() {
      return new PropertyPart(this);
    }
  }, {
    key: "_getValue",
    value: function _getValue() {
      if (this.single) {
        return this.parts[0].value;
      }

      return _get(_getPrototypeOf(PropertyCommitter.prototype), "_getValue", this).call(this);
    }
  }, {
    key: "commit",
    value: function commit() {
      if (this.dirty) {
        this.dirty = false; // eslint-disable-next-line @typescript-eslint/no-explicit-any

        this.element[this.name] = this._getValue();
      }
    }
  }]);

  return PropertyCommitter;
}(AttributeCommitter);
var PropertyPart = /*#__PURE__*/function (_AttributePart) {
  _inherits(PropertyPart, _AttributePart);

  var _super2 = _createSuper(PropertyPart);

  function PropertyPart() {
    _classCallCheck(this, PropertyPart);

    return _super2.apply(this, arguments);
  }

  return PropertyPart;
}(AttributePart); // Detect event listener options support. If the `capture` property is read
// from the options object, then options are supported. If not, then the third
// argument to add/removeEventListener is interpreted as the boolean capture
// value so we should only pass the `capture` property.

var eventOptionsSupported = false; // Wrap into an IIFE because MS Edge <= v41 does not support having try/catch
// blocks right into the body of a module

(function () {
  try {
    var options = {
      get capture() {
        eventOptionsSupported = true;
        return false;
      }

    }; // eslint-disable-next-line @typescript-eslint/no-explicit-any

    window.addEventListener('test', options, options); // eslint-disable-next-line @typescript-eslint/no-explicit-any

    window.removeEventListener('test', options, options);
  } catch (_e) {// event options not supported
  }
})();

var EventPart = /*#__PURE__*/function () {
  function EventPart(element, eventName, eventContext) {
    var _this2 = this;

    _classCallCheck(this, EventPart);

    this.value = undefined;
    this.__pendingValue = undefined;
    this.element = element;
    this.eventName = eventName;
    this.eventContext = eventContext;

    this.__boundHandleEvent = function (e) {
      return _this2.handleEvent(e);
    };
  }

  _createClass(EventPart, [{
    key: "setValue",
    value: function setValue(value) {
      this.__pendingValue = value;
    }
  }, {
    key: "commit",
    value: function commit() {
      while (isDirective(this.__pendingValue)) {
        var directive = this.__pendingValue;
        this.__pendingValue = noChange;
        directive(this);
      }

      if (this.__pendingValue === noChange) {
        return;
      }

      var newListener = this.__pendingValue;
      var oldListener = this.value;
      var shouldRemoveListener = newListener == null || oldListener != null && (newListener.capture !== oldListener.capture || newListener.once !== oldListener.once || newListener.passive !== oldListener.passive);
      var shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);

      if (shouldRemoveListener) {
        this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options);
      }

      if (shouldAddListener) {
        this.__options = getOptions(newListener);
        this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options);
      }

      this.value = newListener;
      this.__pendingValue = noChange;
    }
  }, {
    key: "handleEvent",
    value: function handleEvent(event) {
      if (typeof this.value === 'function') {
        this.value.call(this.eventContext || this.element, event);
      } else {
        this.value.handleEvent(event);
      }
    }
  }]);

  return EventPart;
}(); // We copy options because of the inconsistent behavior of browsers when reading
// the third argument of add/removeEventListener. IE11 doesn't support options
// at all. Chrome 41 only reads `capture` if the argument is an object.

var getOptions = function getOptions(o) {
  return o && (eventOptionsSupported ? {
    capture: o.capture,
    passive: o.passive,
    once: o.once
  } : o.capture);
};

/**
 * The default TemplateFactory which caches Templates keyed on
 * result.type and result.strings.
 */

function templateFactory(result) {
  var templateCache = templateCaches.get(result.type);

  if (templateCache === undefined) {
    templateCache = {
      stringsArray: new WeakMap(),
      keyString: new Map()
    };
    templateCaches.set(result.type, templateCache);
  }

  var template = templateCache.stringsArray.get(result.strings);

  if (template !== undefined) {
    return template;
  } // If the TemplateStringsArray is new, generate a key from the strings
  // This key is shared between all templates with identical content


  var key = result.strings.join(marker); // Check if we already have a Template for this key

  template = templateCache.keyString.get(key);

  if (template === undefined) {
    // If we have not seen this key before, create a new Template
    template = new Template(result, result.getTemplateElement()); // Cache the Template for this key

    templateCache.keyString.set(key, template);
  } // Cache all future queries for this TemplateStringsArray


  templateCache.stringsArray.set(result.strings, template);
  return template;
}
var templateCaches = new Map();

var parts = new WeakMap();
/**
 * Renders a template result or other value to a container.
 *
 * To update a container with new values, reevaluate the template literal and
 * call `render` with the new result.
 *
 * @param result Any value renderable by NodePart - typically a TemplateResult
 *     created by evaluating a template tag like `html` or `svg`.
 * @param container A DOM parent to render to. The entire contents are either
 *     replaced, or efficiently updated if the same result type was previous
 *     rendered there.
 * @param options RenderOptions for the entire render tree rendered to this
 *     container. Render options must *not* change between renders to the same
 *     container, as those changes will not effect previously rendered DOM.
 */

var render = function render(result, container, options) {
  var part = parts.get(container);

  if (part === undefined) {
    removeNodes(container, container.firstChild);
    parts.set(container, part = new NodePart(Object.assign({
      templateFactory: templateFactory
    }, options)));
    part.appendInto(container);
  }

  part.setValue(result);
  part.commit();
};

/**
 * Creates Parts when a template is instantiated.
 */

var DefaultTemplateProcessor = /*#__PURE__*/function () {
  function DefaultTemplateProcessor() {
    _classCallCheck(this, DefaultTemplateProcessor);
  }

  _createClass(DefaultTemplateProcessor, [{
    key: "handleAttributeExpressions",

    /**
     * Create parts for an attribute-position binding, given the event, attribute
     * name, and string literals.
     *
     * @param element The element containing the binding
     * @param name  The attribute name
     * @param strings The string literals. There are always at least two strings,
     *   event for fully-controlled bindings with a single expression.
     */
    value: function handleAttributeExpressions(element, name, strings, options) {
      var prefix = name[0];

      if (prefix === '.') {
        var _committer = new PropertyCommitter(element, name.slice(1), strings);

        return _committer.parts;
      }

      if (prefix === '@') {
        return [new EventPart(element, name.slice(1), options.eventContext)];
      }

      if (prefix === '?') {
        return [new BooleanAttributePart(element, name.slice(1), strings)];
      }

      var committer = new AttributeCommitter(element, name, strings);
      return committer.parts;
    }
    /**
     * Create parts for a text-position binding.
     * @param templateFactory
     */

  }, {
    key: "handleTextExpression",
    value: function handleTextExpression(options) {
      return new NodePart(options);
    }
  }]);

  return DefaultTemplateProcessor;
}();
var defaultTemplateProcessor = new DefaultTemplateProcessor();

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// This line will be used in regexes to search for lit-html usage.
// TODO(justinfagnani): inject version number at build time

if (typeof window !== 'undefined') {
  (window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.2.1');
}
/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 */


var html$1 = function html(strings) {
  for (var _len = arguments.length, values = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    values[_key - 1] = arguments[_key];
  }

  return new TemplateResult(strings, values, 'html', defaultTemplateProcessor);
};

var getTemplateCacheKey = function getTemplateCacheKey(type, scopeName) {
  return "".concat(type, "--").concat(scopeName);
};

var compatibleShadyCSSVersion = true;

if (typeof window.ShadyCSS === 'undefined') {
  compatibleShadyCSSVersion = false;
} else if (typeof window.ShadyCSS.prepareTemplateDom === 'undefined') {
  console.warn("Incompatible ShadyCSS version detected. " + "Please update to at least @webcomponents/webcomponentsjs@2.0.2 and " + "@webcomponents/shadycss@1.3.1.");
  compatibleShadyCSSVersion = false;
}
/**
 * Template factory which scopes template DOM using ShadyCSS.
 * @param scopeName {string}
 */


var shadyTemplateFactory = function shadyTemplateFactory(scopeName) {
  return function (result) {
    var cacheKey = getTemplateCacheKey(result.type, scopeName);
    var templateCache = templateCaches.get(cacheKey);

    if (templateCache === undefined) {
      templateCache = {
        stringsArray: new WeakMap(),
        keyString: new Map()
      };
      templateCaches.set(cacheKey, templateCache);
    }

    var template = templateCache.stringsArray.get(result.strings);

    if (template !== undefined) {
      return template;
    }

    var key = result.strings.join(marker);
    template = templateCache.keyString.get(key);

    if (template === undefined) {
      var element = result.getTemplateElement();

      if (compatibleShadyCSSVersion) {
        window.ShadyCSS.prepareTemplateDom(element, scopeName);
      }

      template = new Template(result, element);
      templateCache.keyString.set(key, template);
    }

    templateCache.stringsArray.set(result.strings, template);
    return template;
  };
};

var TEMPLATE_TYPES = ['html', 'svg'];
/**
 * Removes all style elements from Templates for the given scopeName.
 */

var removeStylesFromLitTemplates = function removeStylesFromLitTemplates(scopeName) {
  TEMPLATE_TYPES.forEach(function (type) {
    var templates = templateCaches.get(getTemplateCacheKey(type, scopeName));

    if (templates !== undefined) {
      templates.keyString.forEach(function (template) {
        var content = template.element.content; // IE 11 doesn't support the iterable param Set constructor

        var styles = new Set();
        Array.from(content.querySelectorAll('style')).forEach(function (s) {
          styles.add(s);
        });
        removeNodesFromTemplate(template, styles);
      });
    }
  });
};

var shadyRenderSet = new Set();
/**
 * For the given scope name, ensures that ShadyCSS style scoping is performed.
 * This is done just once per scope name so the fragment and template cannot
 * be modified.
 * (1) extracts styles from the rendered fragment and hands them to ShadyCSS
 * to be scoped and appended to the document
 * (2) removes style elements from all lit-html Templates for this scope name.
 *
 * Note, <style> elements can only be placed into templates for the
 * initial rendering of the scope. If <style> elements are included in templates
 * dynamically rendered to the scope (after the first scope render), they will
 * not be scoped and the <style> will be left in the template and rendered
 * output.
 */

var prepareTemplateStyles = function prepareTemplateStyles(scopeName, renderedDOM, template) {
  shadyRenderSet.add(scopeName); // If `renderedDOM` is stamped from a Template, then we need to edit that
  // Template's underlying template element. Otherwise, we create one here
  // to give to ShadyCSS, which still requires one while scoping.

  var templateElement = !!template ? template.element : document.createElement('template'); // Move styles out of rendered DOM and store.

  var styles = renderedDOM.querySelectorAll('style');
  var length = styles.length; // If there are no styles, skip unnecessary work

  if (length === 0) {
    // Ensure prepareTemplateStyles is called to support adding
    // styles via `prepareAdoptedCssText` since that requires that
    // `prepareTemplateStyles` is called.
    //
    // ShadyCSS will only update styles containing @apply in the template
    // given to `prepareTemplateStyles`. If no lit Template was given,
    // ShadyCSS will not be able to update uses of @apply in any relevant
    // template. However, this is not a problem because we only create the
    // template for the purpose of supporting `prepareAdoptedCssText`,
    // which doesn't support @apply at all.
    window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
    return;
  }

  var condensedStyle = document.createElement('style'); // Collect styles into a single style. This helps us make sure ShadyCSS
  // manipulations will not prevent us from being able to fix up template
  // part indices.
  // NOTE: collecting styles is inefficient for browsers but ShadyCSS
  // currently does this anyway. When it does not, this should be changed.

  for (var i = 0; i < length; i++) {
    var _style = styles[i];

    _style.parentNode.removeChild(_style);

    condensedStyle.textContent += _style.textContent;
  } // Remove styles from nested templates in this scope.


  removeStylesFromLitTemplates(scopeName); // And then put the condensed style into the "root" template passed in as
  // `template`.

  var content = templateElement.content;

  if (!!template) {
    insertNodeIntoTemplate(template, condensedStyle, content.firstChild);
  } else {
    content.insertBefore(condensedStyle, content.firstChild);
  } // Note, it's important that ShadyCSS gets the template that `lit-html`
  // will actually render so that it can update the style inside when
  // needed (e.g. @apply native Shadow DOM case).


  window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
  var style = content.querySelector('style');

  if (window.ShadyCSS.nativeShadow && style !== null) {
    // When in native Shadow DOM, ensure the style created by ShadyCSS is
    // included in initially rendered output (`renderedDOM`).
    renderedDOM.insertBefore(style.cloneNode(true), renderedDOM.firstChild);
  } else if (!!template) {
    // When no style is left in the template, parts will be broken as a
    // result. To fix this, we put back the style node ShadyCSS removed
    // and then tell lit to remove that node from the template.
    // There can be no style in the template in 2 cases (1) when Shady DOM
    // is in use, ShadyCSS removes all styles, (2) when native Shadow DOM
    // is in use ShadyCSS removes the style if it contains no content.
    // NOTE, ShadyCSS creates its own style so we can safely add/remove
    // `condensedStyle` here.
    content.insertBefore(condensedStyle, content.firstChild);
    var removes = new Set();
    removes.add(condensedStyle);
    removeNodesFromTemplate(template, removes);
  }
};
/**
 * Extension to the standard `render` method which supports rendering
 * to ShadowRoots when the ShadyDOM (https://github.com/webcomponents/shadydom)
 * and ShadyCSS (https://github.com/webcomponents/shadycss) polyfills are used
 * or when the webcomponentsjs
 * (https://github.com/webcomponents/webcomponentsjs) polyfill is used.
 *
 * Adds a `scopeName` option which is used to scope element DOM and stylesheets
 * when native ShadowDOM is unavailable. The `scopeName` will be added to
 * the class attribute of all rendered DOM. In addition, any style elements will
 * be automatically re-written with this `scopeName` selector and moved out
 * of the rendered DOM and into the document `<head>`.
 *
 * It is common to use this render method in conjunction with a custom element
 * which renders a shadowRoot. When this is done, typically the element's
 * `localName` should be used as the `scopeName`.
 *
 * In addition to DOM scoping, ShadyCSS also supports a basic shim for css
 * custom properties (needed only on older browsers like IE11) and a shim for
 * a deprecated feature called `@apply` that supports applying a set of css
 * custom properties to a given location.
 *
 * Usage considerations:
 *
 * * Part values in `<style>` elements are only applied the first time a given
 * `scopeName` renders. Subsequent changes to parts in style elements will have
 * no effect. Because of this, parts in style elements should only be used for
 * values that will never change, for example parts that set scope-wide theme
 * values or parts which render shared style elements.
 *
 * * Note, due to a limitation of the ShadyDOM polyfill, rendering in a
 * custom element's `constructor` is not supported. Instead rendering should
 * either done asynchronously, for example at microtask timing (for example
 * `Promise.resolve()`), or be deferred until the first time the element's
 * `connectedCallback` runs.
 *
 * Usage considerations when using shimmed custom properties or `@apply`:
 *
 * * Whenever any dynamic changes are made which affect
 * css custom properties, `ShadyCSS.styleElement(element)` must be called
 * to update the element. There are two cases when this is needed:
 * (1) the element is connected to a new parent, (2) a class is added to the
 * element that causes it to match different custom properties.
 * To address the first case when rendering a custom element, `styleElement`
 * should be called in the element's `connectedCallback`.
 *
 * * Shimmed custom properties may only be defined either for an entire
 * shadowRoot (for example, in a `:host` rule) or via a rule that directly
 * matches an element with a shadowRoot. In other words, instead of flowing from
 * parent to child as do native css custom properties, shimmed custom properties
 * flow only from shadowRoots to nested shadowRoots.
 *
 * * When using `@apply` mixing css shorthand property names with
 * non-shorthand names (for example `border` and `border-width`) is not
 * supported.
 */


var render$1 = function render$1(result, container, options) {
  if (!options || _typeof(options) !== 'object' || !options.scopeName) {
    throw new Error('The `scopeName` option is required.');
  }

  var scopeName = options.scopeName;
  var hasRendered = parts.has(container);
  var needsScoping = compatibleShadyCSSVersion && container.nodeType === 11
  /* Node.DOCUMENT_FRAGMENT_NODE */
  && !!container.host; // Handle first render to a scope specially...

  var firstScopeRender = needsScoping && !shadyRenderSet.has(scopeName); // On first scope render, render into a fragment; this cannot be a single
  // fragment that is reused since nested renders can occur synchronously.

  var renderContainer = firstScopeRender ? document.createDocumentFragment() : container;
  render(result, renderContainer, Object.assign({
    templateFactory: shadyTemplateFactory(scopeName)
  }, options)); // When performing first scope render,
  // (1) We've rendered into a fragment so that there's a chance to
  // `prepareTemplateStyles` before sub-elements hit the DOM
  // (which might cause them to render based on a common pattern of
  // rendering in a custom element's `connectedCallback`);
  // (2) Scope the template with ShadyCSS one time only for this scope.
  // (3) Render the fragment into the container and make sure the
  // container knows its `part` is the one we just rendered. This ensures
  // DOM will be re-used on subsequent renders.

  if (firstScopeRender) {
    var part = parts.get(renderContainer);
    parts["delete"](renderContainer); // ShadyCSS might have style sheets (e.g. from `prepareAdoptedCssText`)
    // that should apply to `renderContainer` even if the rendered value is
    // not a TemplateInstance. However, it will only insert scoped styles
    // into the document if `prepareTemplateStyles` has already been called
    // for the given scope name.

    var template = part.value instanceof TemplateInstance ? part.value.template : undefined;
    prepareTemplateStyles(scopeName, renderContainer, template);
    removeNodes(container, container.firstChild);
    container.appendChild(renderContainer);
    parts.set(container, part);
  } // After elements have hit the DOM, update styling if this is the
  // initial render to this container.
  // This is needed whenever dynamic changes are made so it would be
  // safest to do every render; however, this would regress performance
  // so we leave it up to the user to call `ShadyCSS.styleElement`
  // for dynamic changes.


  if (!hasRendered && needsScoping) {
    window.ShadyCSS.styleElement(container.host);
  }
};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
var _a;
/**
 * When using Closure Compiler, JSCompiler_renameProperty(property, object) is
 * replaced at compile time by the munged name for object[property]. We cannot
 * alias this function, so we have to use a small shim that has the same
 * behavior when not compiling.
 */


window.JSCompiler_renameProperty = function (prop, _obj) {
  return prop;
};

var defaultConverter = {
  toAttribute: function toAttribute(value, type) {
    switch (type) {
      case Boolean:
        return value ? '' : null;

      case Object:
      case Array:
        // if the value is `null` or `undefined` pass this through
        // to allow removing/no change behavior.
        return value == null ? value : JSON.stringify(value);
    }

    return value;
  },
  fromAttribute: function fromAttribute(value, type) {
    switch (type) {
      case Boolean:
        return value !== null;

      case Number:
        return value === null ? null : Number(value);

      case Object:
      case Array:
        return JSON.parse(value);
    }

    return value;
  }
};
/**
 * Change function that returns true if `value` is different from `oldValue`.
 * This method is used as the default for a property's `hasChanged` function.
 */

var notEqual = function notEqual(value, old) {
  // This ensures (old==NaN, value==NaN) always returns false
  return old !== value && (old === old || value === value);
};
var defaultPropertyDeclaration = {
  attribute: true,
  type: String,
  converter: defaultConverter,
  reflect: false,
  hasChanged: notEqual
};
var STATE_HAS_UPDATED = 1;
var STATE_UPDATE_REQUESTED = 1 << 2;
var STATE_IS_REFLECTING_TO_ATTRIBUTE = 1 << 3;
var STATE_IS_REFLECTING_TO_PROPERTY = 1 << 4;
/**
 * The Closure JS Compiler doesn't currently have good support for static
 * property semantics where "this" is dynamic (e.g.
 * https://github.com/google/closure-compiler/issues/3177 and others) so we use
 * this hack to bypass any rewriting by the compiler.
 */

var finalized = 'finalized';
/**
 * Base element class which manages element properties and attributes. When
 * properties change, the `update` method is asynchronously called. This method
 * should be supplied by subclassers to render updates as desired.
 */

var UpdatingElement = /*#__PURE__*/function (_HTMLElement) {
  _inherits(UpdatingElement, _HTMLElement);

  var _super = _createSuper(UpdatingElement);

  function UpdatingElement() {
    var _this;

    _classCallCheck(this, UpdatingElement);

    _this = _super.call(this);
    _this._updateState = 0;
    _this._instanceProperties = undefined; // Initialize to an unresolved Promise so we can make sure the element has
    // connected before first update.

    _this._updatePromise = new Promise(function (res) {
      return _this._enableUpdatingResolver = res;
    });
    /**
     * Map with keys for any properties that have changed since the last
     * update cycle with previous values.
     */

    _this._changedProperties = new Map();
    /**
     * Map with keys of properties that should be reflected when updated.
     */

    _this._reflectingProperties = undefined;

    _this.initialize();

    return _this;
  }
  /**
   * Returns a list of attributes corresponding to the registered properties.
   * @nocollapse
   */


  _createClass(UpdatingElement, [{
    key: "initialize",

    /**
     * Performs element initialization. By default captures any pre-set values for
     * registered properties.
     */
    value: function initialize() {
      this._saveInstanceProperties(); // ensures first update will be caught by an early access of
      // `updateComplete`


      this._requestUpdate();
    }
    /**
     * Fixes any properties set on the instance before upgrade time.
     * Otherwise these would shadow the accessor and break these properties.
     * The properties are stored in a Map which is played back after the
     * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
     * (<=41), properties created for native platform properties like (`id` or
     * `name`) may not have default values set in the element constructor. On
     * these browsers native properties appear on instances and therefore their
     * default value will overwrite any element default (e.g. if the element sets
     * this.id = 'id' in the constructor, the 'id' will become '' since this is
     * the native platform default).
     */

  }, {
    key: "_saveInstanceProperties",
    value: function _saveInstanceProperties() {
      var _this2 = this;

      // Use forEach so this works even if for/of loops are compiled to for loops
      // expecting arrays
      this.constructor._classProperties.forEach(function (_v, p) {
        if (_this2.hasOwnProperty(p)) {
          var value = _this2[p];
          delete _this2[p];

          if (!_this2._instanceProperties) {
            _this2._instanceProperties = new Map();
          }

          _this2._instanceProperties.set(p, value);
        }
      });
    }
    /**
     * Applies previously saved instance properties.
     */

  }, {
    key: "_applyInstanceProperties",
    value: function _applyInstanceProperties() {
      var _this3 = this;

      // Use forEach so this works even if for/of loops are compiled to for loops
      // expecting arrays
      // tslint:disable-next-line:no-any
      this._instanceProperties.forEach(function (v, p) {
        return _this3[p] = v;
      });

      this._instanceProperties = undefined;
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      // Ensure first connection completes an update. Updates cannot complete
      // before connection.
      this.enableUpdating();
    }
  }, {
    key: "enableUpdating",
    value: function enableUpdating() {
      if (this._enableUpdatingResolver !== undefined) {
        this._enableUpdatingResolver();

        this._enableUpdatingResolver = undefined;
      }
    }
    /**
     * Allows for `super.disconnectedCallback()` in extensions while
     * reserving the possibility of making non-breaking feature additions
     * when disconnecting at some point in the future.
     */

  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {}
    /**
     * Synchronizes property values when attributes change.
     */

  }, {
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(name, old, value) {
      if (old !== value) {
        this._attributeToProperty(name, value);
      }
    }
  }, {
    key: "_propertyToAttribute",
    value: function _propertyToAttribute(name, value) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultPropertyDeclaration;
      var ctor = this.constructor;

      var attr = ctor._attributeNameForProperty(name, options);

      if (attr !== undefined) {
        var attrValue = ctor._propertyValueToAttribute(value, options); // an undefined value does not change the attribute.


        if (attrValue === undefined) {
          return;
        } // Track if the property is being reflected to avoid
        // setting the property again via `attributeChangedCallback`. Note:
        // 1. this takes advantage of the fact that the callback is synchronous.
        // 2. will behave incorrectly if multiple attributes are in the reaction
        // stack at time of calling. However, since we process attributes
        // in `update` this should not be possible (or an extreme corner case
        // that we'd like to discover).
        // mark state reflecting


        this._updateState = this._updateState | STATE_IS_REFLECTING_TO_ATTRIBUTE;

        if (attrValue == null) {
          this.removeAttribute(attr);
        } else {
          this.setAttribute(attr, attrValue);
        } // mark state not reflecting


        this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_ATTRIBUTE;
      }
    }
  }, {
    key: "_attributeToProperty",
    value: function _attributeToProperty(name, value) {
      // Use tracking info to avoid deserializing attribute value if it was
      // just set from a property setter.
      if (this._updateState & STATE_IS_REFLECTING_TO_ATTRIBUTE) {
        return;
      }

      var ctor = this.constructor; // Note, hint this as an `AttributeMap` so closure clearly understands
      // the type; it has issues with tracking types through statics
      // tslint:disable-next-line:no-unnecessary-type-assertion

      var propName = ctor._attributeToPropertyMap.get(name);

      if (propName !== undefined) {
        var options = ctor.getPropertyOptions(propName); // mark state reflecting

        this._updateState = this._updateState | STATE_IS_REFLECTING_TO_PROPERTY;
        this[propName] = // tslint:disable-next-line:no-any
        ctor._propertyValueFromAttribute(value, options); // mark state not reflecting

        this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_PROPERTY;
      }
    }
    /**
     * This private version of `requestUpdate` does not access or return the
     * `updateComplete` promise. This promise can be overridden and is therefore
     * not free to access.
     */

  }, {
    key: "_requestUpdate",
    value: function _requestUpdate(name, oldValue) {
      var shouldRequestUpdate = true; // If we have a property key, perform property update steps.

      if (name !== undefined) {
        var ctor = this.constructor;
        var options = ctor.getPropertyOptions(name);

        if (ctor._valueHasChanged(this[name], oldValue, options.hasChanged)) {
          if (!this._changedProperties.has(name)) {
            this._changedProperties.set(name, oldValue);
          } // Add to reflecting properties set.
          // Note, it's important that every change has a chance to add the
          // property to `_reflectingProperties`. This ensures setting
          // attribute + property reflects correctly.


          if (options.reflect === true && !(this._updateState & STATE_IS_REFLECTING_TO_PROPERTY)) {
            if (this._reflectingProperties === undefined) {
              this._reflectingProperties = new Map();
            }

            this._reflectingProperties.set(name, options);
          }
        } else {
          // Abort the request if the property should not be considered changed.
          shouldRequestUpdate = false;
        }
      }

      if (!this._hasRequestedUpdate && shouldRequestUpdate) {
        this._updatePromise = this._enqueueUpdate();
      }
    }
    /**
     * Requests an update which is processed asynchronously. This should
     * be called when an element should update based on some state not triggered
     * by setting a property. In this case, pass no arguments. It should also be
     * called when manually implementing a property setter. In this case, pass the
     * property `name` and `oldValue` to ensure that any configured property
     * options are honored. Returns the `updateComplete` Promise which is resolved
     * when the update completes.
     *
     * @param name {PropertyKey} (optional) name of requesting property
     * @param oldValue {any} (optional) old value of requesting property
     * @returns {Promise} A Promise that is resolved when the update completes.
     */

  }, {
    key: "requestUpdate",
    value: function requestUpdate(name, oldValue) {
      this._requestUpdate(name, oldValue);

      return this.updateComplete;
    }
    /**
     * Sets up the element to asynchronously update.
     */

  }, {
    key: "_enqueueUpdate",
    value: function () {
      var _enqueueUpdate2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this._updateState = this._updateState | STATE_UPDATE_REQUESTED;
                _context.prev = 1;
                _context.next = 4;
                return this._updatePromise;

              case 4:
                _context.next = 8;
                break;

              case 6:
                _context.prev = 6;
                _context.t0 = _context["catch"](1);

              case 8:
                result = this.performUpdate(); // If `performUpdate` returns a Promise, we await it. This is done to
                // enable coordinating updates with a scheduler. Note, the result is
                // checked to avoid delaying an additional microtask unless we need to.

                if (!(result != null)) {
                  _context.next = 12;
                  break;
                }

                _context.next = 12;
                return result;

              case 12:
                return _context.abrupt("return", !this._hasRequestedUpdate);

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[1, 6]]);
      }));

      function _enqueueUpdate() {
        return _enqueueUpdate2.apply(this, arguments);
      }

      return _enqueueUpdate;
    }()
  }, {
    key: "performUpdate",

    /**
     * Performs an element update. Note, if an exception is thrown during the
     * update, `firstUpdated` and `updated` will not be called.
     *
     * You can override this method to change the timing of updates. If this
     * method is overridden, `super.performUpdate()` must be called.
     *
     * For instance, to schedule updates to occur just before the next frame:
     *
     * ```
     * protected async performUpdate(): Promise<unknown> {
     *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
     *   super.performUpdate();
     * }
     * ```
     */
    value: function performUpdate() {
      // Mixin instance properties once, if they exist.
      if (this._instanceProperties) {
        this._applyInstanceProperties();
      }

      var shouldUpdate = false;
      var changedProperties = this._changedProperties;

      try {
        shouldUpdate = this.shouldUpdate(changedProperties);

        if (shouldUpdate) {
          this.update(changedProperties);
        } else {
          this._markUpdated();
        }
      } catch (e) {
        // Prevent `firstUpdated` and `updated` from running when there's an
        // update exception.
        shouldUpdate = false; // Ensure element can accept additional updates after an exception.

        this._markUpdated();

        throw e;
      }

      if (shouldUpdate) {
        if (!(this._updateState & STATE_HAS_UPDATED)) {
          this._updateState = this._updateState | STATE_HAS_UPDATED;
          this.firstUpdated(changedProperties);
        }

        this.updated(changedProperties);
      }
    }
  }, {
    key: "_markUpdated",
    value: function _markUpdated() {
      this._changedProperties = new Map();
      this._updateState = this._updateState & ~STATE_UPDATE_REQUESTED;
    }
    /**
     * Returns a Promise that resolves when the element has completed updating.
     * The Promise value is a boolean that is `true` if the element completed the
     * update without triggering another update. The Promise result is `false` if
     * a property was set inside `updated()`. If the Promise is rejected, an
     * exception was thrown during the update.
     *
     * To await additional asynchronous work, override the `_getUpdateComplete`
     * method. For example, it is sometimes useful to await a rendered element
     * before fulfilling this Promise. To do this, first await
     * `super._getUpdateComplete()`, then any subsequent state.
     *
     * @returns {Promise} The Promise returns a boolean that indicates if the
     * update resolved without triggering another update.
     */

  }, {
    key: "_getUpdateComplete",

    /**
     * Override point for the `updateComplete` promise.
     *
     * It is not safe to override the `updateComplete` getter directly due to a
     * limitation in TypeScript which means it is not possible to call a
     * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
     * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
     * This method should be overridden instead. For example:
     *
     *   class MyElement extends LitElement {
     *     async _getUpdateComplete() {
     *       await super._getUpdateComplete();
     *       await this._myChild.updateComplete;
     *     }
     *   }
     */
    value: function _getUpdateComplete() {
      return this._updatePromise;
    }
    /**
     * Controls whether or not `update` should be called when the element requests
     * an update. By default, this method always returns `true`, but this can be
     * customized to control when to update.
     *
     * @param _changedProperties Map of changed properties with old values
     */

  }, {
    key: "shouldUpdate",
    value: function shouldUpdate(_changedProperties) {
      return true;
    }
    /**
     * Updates the element. This method reflects property values to attributes.
     * It can be overridden to render and keep updated element DOM.
     * Setting properties inside this method will *not* trigger
     * another update.
     *
     * @param _changedProperties Map of changed properties with old values
     */

  }, {
    key: "update",
    value: function update(_changedProperties) {
      var _this4 = this;

      if (this._reflectingProperties !== undefined && this._reflectingProperties.size > 0) {
        // Use forEach so this works even if for/of loops are compiled to for
        // loops expecting arrays
        this._reflectingProperties.forEach(function (v, k) {
          return _this4._propertyToAttribute(k, _this4[k], v);
        });

        this._reflectingProperties = undefined;
      }

      this._markUpdated();
    }
    /**
     * Invoked whenever the element is updated. Implement to perform
     * post-updating tasks via DOM APIs, for example, focusing an element.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * @param _changedProperties Map of changed properties with old values
     */

  }, {
    key: "updated",
    value: function updated(_changedProperties) {}
    /**
     * Invoked when the element is first updated. Implement to perform one time
     * work on the element after update.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * @param _changedProperties Map of changed properties with old values
     */

  }, {
    key: "firstUpdated",
    value: function firstUpdated(_changedProperties) {}
  }, {
    key: "_hasRequestedUpdate",
    get: function get() {
      return this._updateState & STATE_UPDATE_REQUESTED;
    }
  }, {
    key: "hasUpdated",
    get: function get() {
      return this._updateState & STATE_HAS_UPDATED;
    }
  }, {
    key: "updateComplete",
    get: function get() {
      return this._getUpdateComplete();
    }
  }], [{
    key: "_ensureClassProperties",

    /**
     * Ensures the private `_classProperties` property metadata is created.
     * In addition to `finalize` this is also called in `createProperty` to
     * ensure the `@property` decorator can add property metadata.
     */

    /** @nocollapse */
    value: function _ensureClassProperties() {
      var _this5 = this;

      // ensure private storage for property declarations.
      if (!this.hasOwnProperty(JSCompiler_renameProperty('_classProperties', this))) {
        this._classProperties = new Map(); // NOTE: Workaround IE11 not supporting Map constructor argument.

        var superProperties = Object.getPrototypeOf(this)._classProperties;

        if (superProperties !== undefined) {
          superProperties.forEach(function (v, k) {
            return _this5._classProperties.set(k, v);
          });
        }
      }
    }
    /**
     * Creates a property accessor on the element prototype if one does not exist
     * and stores a PropertyDeclaration for the property with the given options.
     * The property setter calls the property's `hasChanged` property option
     * or uses a strict identity check to determine whether or not to request
     * an update.
     *
     * This method may be overridden to customize properties; however,
     * when doing so, it's important to call `super.createProperty` to ensure
     * the property is setup correctly. This method calls
     * `getPropertyDescriptor` internally to get a descriptor to install.
     * To customize what properties do when they are get or set, override
     * `getPropertyDescriptor`. To customize the options for a property,
     * implement `createProperty` like this:
     *
     * static createProperty(name, options) {
     *   options = Object.assign(options, {myOption: true});
     *   super.createProperty(name, options);
     * }
     *
     * @nocollapse
     */

  }, {
    key: "createProperty",
    value: function createProperty(name) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultPropertyDeclaration;

      // Note, since this can be called by the `@property` decorator which
      // is called before `finalize`, we ensure storage exists for property
      // metadata.
      this._ensureClassProperties();

      this._classProperties.set(name, options); // Do not generate an accessor if the prototype already has one, since
      // it would be lost otherwise and that would never be the user's intention;
      // Instead, we expect users to call `requestUpdate` themselves from
      // user-defined accessors. Note that if the super has an accessor we will
      // still overwrite it


      if (options.noAccessor || this.prototype.hasOwnProperty(name)) {
        return;
      }

      var key = _typeof(name) === 'symbol' ? Symbol() : "__".concat(name);
      var descriptor = this.getPropertyDescriptor(name, key, options);

      if (descriptor !== undefined) {
        Object.defineProperty(this.prototype, name, descriptor);
      }
    }
    /**
     * Returns a property descriptor to be defined on the given named property.
     * If no descriptor is returned, the property will not become an accessor.
     * For example,
     *
     *   class MyElement extends LitElement {
     *     static getPropertyDescriptor(name, key, options) {
     *       const defaultDescriptor =
     *           super.getPropertyDescriptor(name, key, options);
     *       const setter = defaultDescriptor.set;
     *       return {
     *         get: defaultDescriptor.get,
     *         set(value) {
     *           setter.call(this, value);
     *           // custom action.
     *         },
     *         configurable: true,
     *         enumerable: true
     *       }
     *     }
     *   }
     *
     * @nocollapse
     */

  }, {
    key: "getPropertyDescriptor",
    value: function getPropertyDescriptor(name, key, _options) {
      return {
        // tslint:disable-next-line:no-any no symbol in index
        get: function get() {
          return this[key];
        },
        set: function set(value) {
          var oldValue = this[name];
          this[key] = value;

          this._requestUpdate(name, oldValue);
        },
        configurable: true,
        enumerable: true
      };
    }
    /**
     * Returns the property options associated with the given property.
     * These options are defined with a PropertyDeclaration via the `properties`
     * object or the `@property` decorator and are registered in
     * `createProperty(...)`.
     *
     * Note, this method should be considered "final" and not overridden. To
     * customize the options for a given property, override `createProperty`.
     *
     * @nocollapse
     * @final
     */

  }, {
    key: "getPropertyOptions",
    value: function getPropertyOptions(name) {
      return this._classProperties && this._classProperties.get(name) || defaultPropertyDeclaration;
    }
    /**
     * Creates property accessors for registered properties and ensures
     * any superclasses are also finalized.
     * @nocollapse
     */

  }, {
    key: "finalize",
    value: function finalize() {
      // finalize any superclasses
      var superCtor = Object.getPrototypeOf(this);

      if (!superCtor.hasOwnProperty(finalized)) {
        superCtor.finalize();
      }

      this[finalized] = true;

      this._ensureClassProperties(); // initialize Map populated in observedAttributes


      this._attributeToPropertyMap = new Map(); // make any properties
      // Note, only process "own" properties since this element will inherit
      // any properties defined on the superClass, and finalization ensures
      // the entire prototype chain is finalized.

      if (this.hasOwnProperty(JSCompiler_renameProperty('properties', this))) {
        var props = this.properties; // support symbols in properties (IE11 does not support this)

        var propKeys = [].concat(_toConsumableArray(Object.getOwnPropertyNames(props)), _toConsumableArray(typeof Object.getOwnPropertySymbols === 'function' ? Object.getOwnPropertySymbols(props) : [])); // This for/of is ok because propKeys is an array

        var _iterator = _createForOfIteratorHelper(propKeys),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var p = _step.value;
            // note, use of `any` is due to TypeSript lack of support for symbol in
            // index types
            // tslint:disable-next-line:no-any no symbol in index
            this.createProperty(p, props[p]);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }
    /**
     * Returns the property name for the given attribute `name`.
     * @nocollapse
     */

  }, {
    key: "_attributeNameForProperty",
    value: function _attributeNameForProperty(name, options) {
      var attribute = options.attribute;
      return attribute === false ? undefined : typeof attribute === 'string' ? attribute : typeof name === 'string' ? name.toLowerCase() : undefined;
    }
    /**
     * Returns true if a property should request an update.
     * Called when a property value is set and uses the `hasChanged`
     * option for the property if present or a strict identity check.
     * @nocollapse
     */

  }, {
    key: "_valueHasChanged",
    value: function _valueHasChanged(value, old) {
      var hasChanged = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : notEqual;
      return hasChanged(value, old);
    }
    /**
     * Returns the property value for the given attribute value.
     * Called via the `attributeChangedCallback` and uses the property's
     * `converter` or `converter.fromAttribute` property option.
     * @nocollapse
     */

  }, {
    key: "_propertyValueFromAttribute",
    value: function _propertyValueFromAttribute(value, options) {
      var type = options.type;
      var converter = options.converter || defaultConverter;
      var fromAttribute = typeof converter === 'function' ? converter : converter.fromAttribute;
      return fromAttribute ? fromAttribute(value, type) : value;
    }
    /**
     * Returns the attribute value for the given property value. If this
     * returns undefined, the property will *not* be reflected to an attribute.
     * If this returns null, the attribute will be removed, otherwise the
     * attribute will be set to the value.
     * This uses the property's `reflect` and `type.toAttribute` property options.
     * @nocollapse
     */

  }, {
    key: "_propertyValueToAttribute",
    value: function _propertyValueToAttribute(value, options) {
      if (options.reflect === undefined) {
        return;
      }

      var type = options.type;
      var converter = options.converter;
      var toAttribute = converter && converter.toAttribute || defaultConverter.toAttribute;
      return toAttribute(value, type);
    }
  }, {
    key: "observedAttributes",
    get: function get() {
      var _this6 = this;

      // note: piggy backing on this to ensure we're finalized.
      this.finalize();
      var attributes = []; // Use forEach so this works even if for/of loops are compiled to for loops
      // expecting arrays

      this._classProperties.forEach(function (v, p) {
        var attr = _this6._attributeNameForProperty(p, v);

        if (attr !== undefined) {
          _this6._attributeToPropertyMap.set(attr, p);

          attributes.push(attr);
        }
      });

      return attributes;
    }
  }]);

  return UpdatingElement;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement));
_a = finalized;
/**
 * Marks class as having finished creating properties.
 */

UpdatingElement[_a] = true;

/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
var supportsAdoptingStyleSheets = 'adoptedStyleSheets' in Document.prototype && 'replace' in CSSStyleSheet.prototype;
var constructionToken = Symbol();
var CSSResult = /*#__PURE__*/function () {
  function CSSResult(cssText, safeToken) {
    _classCallCheck(this, CSSResult);

    if (safeToken !== constructionToken) {
      throw new Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
    }

    this.cssText = cssText;
  } // Note, this is a getter so that it's lazy. In practice, this means
  // stylesheets are not created until the first element instance is made.


  _createClass(CSSResult, [{
    key: "toString",
    value: function toString() {
      return this.cssText;
    }
  }, {
    key: "styleSheet",
    get: function get() {
      if (this._styleSheet === undefined) {
        // Note, if `adoptedStyleSheets` is supported then we assume CSSStyleSheet
        // is constructable.
        if (supportsAdoptingStyleSheets) {
          this._styleSheet = new CSSStyleSheet();

          this._styleSheet.replaceSync(this.cssText);
        } else {
          this._styleSheet = null;
        }
      }

      return this._styleSheet;
    }
  }]);

  return CSSResult;
}();

var textFromCSSResult = function textFromCSSResult(value) {
  if (value instanceof CSSResult) {
    return value.cssText;
  } else if (typeof value === 'number') {
    return value;
  } else {
    throw new Error("Value passed to 'css' function must be a 'css' function result: ".concat(value, ". Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security."));
  }
};
/**
 * Template tag which which can be used with LitElement's `style` property to
 * set element styles. For security reasons, only literal string values may be
 * used. To incorporate non-literal values `unsafeCSS` may be used inside a
 * template string part.
 */


var css = function css(strings) {
  for (var _len = arguments.length, values = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    values[_key - 1] = arguments[_key];
  }

  var cssText = values.reduce(function (acc, v, idx) {
    return acc + textFromCSSResult(v) + strings[idx + 1];
  }, strings[0]);
  return new CSSResult(cssText, constructionToken);
};

// This line will be used in regexes to search for LitElement usage.
// TODO(justinfagnani): inject version number at build time

(window['litElementVersions'] || (window['litElementVersions'] = [])).push('2.3.1');
/**
 * Sentinal value used to avoid calling lit-html's render function when
 * subclasses do not implement `render`
 */

var renderNotImplemented = {};
var LitElement = /*#__PURE__*/function (_UpdatingElement) {
  _inherits(LitElement, _UpdatingElement);

  var _super = _createSuper(LitElement);

  function LitElement() {
    _classCallCheck(this, LitElement);

    return _super.apply(this, arguments);
  }

  _createClass(LitElement, [{
    key: "initialize",

    /**
     * Performs element initialization. By default this calls `createRenderRoot`
     * to create the element `renderRoot` node and captures any pre-set values for
     * registered properties.
     */
    value: function initialize() {
      _get(_getPrototypeOf(LitElement.prototype), "initialize", this).call(this);

      this.constructor._getUniqueStyles();

      this.renderRoot = this.createRenderRoot(); // Note, if renderRoot is not a shadowRoot, styles would/could apply to the
      // element's getRootNode(). While this could be done, we're choosing not to
      // support this now since it would require different logic around de-duping.

      if (window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot) {
        this.adoptStyles();
      }
    }
    /**
     * Returns the node into which the element should render and by default
     * creates and returns an open shadowRoot. Implement to customize where the
     * element's DOM is rendered. For example, to render into the element's
     * childNodes, return `this`.
     * @returns {Element|DocumentFragment} Returns a node into which to render.
     */

  }, {
    key: "createRenderRoot",
    value: function createRenderRoot() {
      return this.attachShadow({
        mode: 'open'
      });
    }
    /**
     * Applies styling to the element shadowRoot using the `static get styles`
     * property. Styling will apply using `shadowRoot.adoptedStyleSheets` where
     * available and will fallback otherwise. When Shadow DOM is polyfilled,
     * ShadyCSS scopes styles and adds them to the document. When Shadow DOM
     * is available but `adoptedStyleSheets` is not, styles are appended to the
     * end of the `shadowRoot` to [mimic spec
     * behavior](https://wicg.github.io/construct-stylesheets/#using-constructed-stylesheets).
     */

  }, {
    key: "adoptStyles",
    value: function adoptStyles() {
      var styles = this.constructor._styles;

      if (styles.length === 0) {
        return;
      } // There are three separate cases here based on Shadow DOM support.
      // (1) shadowRoot polyfilled: use ShadyCSS
      // (2) shadowRoot.adoptedStyleSheets available: use it.
      // (3) shadowRoot.adoptedStyleSheets polyfilled: append styles after
      // rendering


      if (window.ShadyCSS !== undefined && !window.ShadyCSS.nativeShadow) {
        window.ShadyCSS.ScopingShim.prepareAdoptedCssText(styles.map(function (s) {
          return s.cssText;
        }), this.localName);
      } else if (supportsAdoptingStyleSheets) {
        this.renderRoot.adoptedStyleSheets = styles.map(function (s) {
          return s.styleSheet;
        });
      } else {
        // This must be done after rendering so the actual style insertion is done
        // in `update`.
        this._needsShimAdoptedStyleSheets = true;
      }
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      _get(_getPrototypeOf(LitElement.prototype), "connectedCallback", this).call(this); // Note, first update/render handles styleElement so we only call this if
      // connected after first update.


      if (this.hasUpdated && window.ShadyCSS !== undefined) {
        window.ShadyCSS.styleElement(this);
      }
    }
    /**
     * Updates the element. This method reflects property values to attributes
     * and calls `render` to render DOM via lit-html. Setting properties inside
     * this method will *not* trigger another update.
     * @param _changedProperties Map of changed properties with old values
     */

  }, {
    key: "update",
    value: function update(changedProperties) {
      var _this = this;

      // Setting properties in `render` should not trigger an update. Since
      // updates are allowed after super.update, it's important to call `render`
      // before that.
      var templateResult = this.render();

      _get(_getPrototypeOf(LitElement.prototype), "update", this).call(this, changedProperties); // If render is not implemented by the component, don't call lit-html render


      if (templateResult !== renderNotImplemented) {
        this.constructor.render(templateResult, this.renderRoot, {
          scopeName: this.localName,
          eventContext: this
        });
      } // When native Shadow DOM is used but adoptedStyles are not supported,
      // insert styling after rendering to ensure adoptedStyles have highest
      // priority.


      if (this._needsShimAdoptedStyleSheets) {
        this._needsShimAdoptedStyleSheets = false;

        this.constructor._styles.forEach(function (s) {
          var style = document.createElement('style');
          style.textContent = s.cssText;

          _this.renderRoot.appendChild(style);
        });
      }
    }
    /**
     * Invoked on each update to perform rendering tasks. This method may return
     * any value renderable by lit-html's NodePart - typically a TemplateResult.
     * Setting properties inside this method will *not* trigger the element to
     * update.
     */

  }, {
    key: "render",
    value: function render() {
      return renderNotImplemented;
    }
  }], [{
    key: "getStyles",

    /**
     * Return the array of styles to apply to the element.
     * Override this method to integrate into a style management system.
     *
     * @nocollapse
     */
    value: function getStyles() {
      return this.styles;
    }
    /** @nocollapse */

  }, {
    key: "_getUniqueStyles",
    value: function _getUniqueStyles() {
      // Only gather styles once per class
      if (this.hasOwnProperty(JSCompiler_renameProperty('_styles', this))) {
        return;
      } // Take care not to call `this.getStyles()` multiple times since this
      // generates new CSSResults each time.
      // TODO(sorvell): Since we do not cache CSSResults by input, any
      // shared styles will generate new stylesheet objects, which is wasteful.
      // This should be addressed when a browser ships constructable
      // stylesheets.


      var userStyles = this.getStyles();

      if (userStyles === undefined) {
        this._styles = [];
      } else if (Array.isArray(userStyles)) {
        // De-duplicate styles preserving the _last_ instance in the set.
        // This is a performance optimization to avoid duplicated styles that can
        // occur especially when composing via subclassing.
        // The last item is kept to try to preserve the cascade order with the
        // assumption that it's most important that last added styles override
        // previous styles.
        var addStyles = function addStyles(styles, set) {
          return styles.reduceRight(function (set, s) {
            return (// Note: On IE set.add() does not return the set
              Array.isArray(s) ? addStyles(s, set) : (set.add(s), set)
            );
          }, set);
        }; // Array.from does not work on Set in IE, otherwise return
        // Array.from(addStyles(userStyles, new Set<CSSResult>())).reverse()


        var set = addStyles(userStyles, new Set());
        var styles = [];
        set.forEach(function (v) {
          return styles.unshift(v);
        });
        this._styles = styles;
      } else {
        this._styles = [userStyles];
      }
    }
  }]);

  return LitElement;
}(UpdatingElement);
/**
 * Ensure this class is marked as `finalized` as an optimization ensuring
 * it will not needlessly try to `finalize`.
 *
 * Note this property name is a string to prevent breaking Closure JS Compiler
 * optimizations. See updating-element.ts for more information.
 */

LitElement['finalized'] = true;
/**
 * Render method used to render the value to the element's DOM.
 * @param result The value to render.
 * @param container Node into which to render.
 * @param options Element name.
 * @nocollapse
 */

LitElement.render = render$1;

function _templateObject96() {
  var data = _taggedTemplateLiteral(["#422D53"]);

  _templateObject96 = function _templateObject96() {
    return data;
  };

  return data;
}

function _templateObject95() {
  var data = _taggedTemplateLiteral(["#9875b7"]);

  _templateObject95 = function _templateObject95() {
    return data;
  };

  return data;
}

function _templateObject94() {
  var data = _taggedTemplateLiteral(["#423500"]);

  _templateObject94 = function _templateObject94() {
    return data;
  };

  return data;
}

function _templateObject93() {
  var data = _taggedTemplateLiteral(["#b28f00"]);

  _templateObject93 = function _templateObject93() {
    return data;
  };

  return data;
}

function _templateObject92() {
  var data = _taggedTemplateLiteral(["#4B7900"]);

  _templateObject92 = function _templateObject92() {
    return data;
  };

  return data;
}

function _templateObject91() {
  var data = _taggedTemplateLiteral(["#C7DAAD"]);

  _templateObject91 = function _templateObject91() {
    return data;
  };

  return data;
}

function _templateObject90() {
  var data = _taggedTemplateLiteral(["#7fb3d2"]);

  _templateObject90 = function _templateObject90() {
    return data;
  };

  return data;
}

function _templateObject89() {
  var data = _taggedTemplateLiteral(["#043954"]);

  _templateObject89 = function _templateObject89() {
    return data;
  };

  return data;
}

function _templateObject88() {
  var data = _taggedTemplateLiteral(["#a0a0a0"]);

  _templateObject88 = function _templateObject88() {
    return data;
  };

  return data;
}

function _templateObject87() {
  var data = _taggedTemplateLiteral(["#a0a0a0"]);

  _templateObject87 = function _templateObject87() {
    return data;
  };

  return data;
}

function _templateObject86() {
  var data = _taggedTemplateLiteral(["#010101"]);

  _templateObject86 = function _templateObject86() {
    return data;
  };

  return data;
}

function _templateObject85() {
  var data = _taggedTemplateLiteral(["#a0a0a0"]);

  _templateObject85 = function _templateObject85() {
    return data;
  };

  return data;
}

function _templateObject84() {
  var data = _taggedTemplateLiteral(["#a0a0a0"]);

  _templateObject84 = function _templateObject84() {
    return data;
  };

  return data;
}

function _templateObject83() {
  var data = _taggedTemplateLiteral(["#181c22"]);

  _templateObject83 = function _templateObject83() {
    return data;
  };

  return data;
}

function _templateObject82() {
  var data = _taggedTemplateLiteral(["#fff"]);

  _templateObject82 = function _templateObject82() {
    return data;
  };

  return data;
}

function _templateObject81() {
  var data = _taggedTemplateLiteral(["#cc3b3b"]);

  _templateObject81 = function _templateObject81() {
    return data;
  };

  return data;
}

function _templateObject80() {
  var data = _taggedTemplateLiteral(["rgba(255, 255, 255, 0.25)"]);

  _templateObject80 = function _templateObject80() {
    return data;
  };

  return data;
}

function _templateObject79() {
  var data = _taggedTemplateLiteral(["#a0a0a0"]);

  _templateObject79 = function _templateObject79() {
    return data;
  };

  return data;
}

function _templateObject78() {
  var data = _taggedTemplateLiteral(["#0099e6"]);

  _templateObject78 = function _templateObject78() {
    return data;
  };

  return data;
}

function _templateObject77() {
  var data = _taggedTemplateLiteral(["#222831"]);

  _templateObject77 = function _templateObject77() {
    return data;
  };

  return data;
}

function _templateObject76() {
  var data = _taggedTemplateLiteral(["#72c1f5"]);

  _templateObject76 = function _templateObject76() {
    return data;
  };

  return data;
}

function _templateObject75() {
  var data = _taggedTemplateLiteral(["#a0a0a0"]);

  _templateObject75 = function _templateObject75() {
    return data;
  };

  return data;
}

function _templateObject74() {
  var data = _taggedTemplateLiteral(["#1a1a1a"]);

  _templateObject74 = function _templateObject74() {
    return data;
  };

  return data;
}

function _templateObject73() {
  var data = _taggedTemplateLiteral(["#a0a0a0"]);

  _templateObject73 = function _templateObject73() {
    return data;
  };

  return data;
}

function _templateObject72() {
  var data = _taggedTemplateLiteral(["#222831"]);

  _templateObject72 = function _templateObject72() {
    return data;
  };

  return data;
}

function _templateObject71() {
  var data = _taggedTemplateLiteral(["#9875b7"]);

  _templateObject71 = function _templateObject71() {
    return data;
  };

  return data;
}

function _templateObject70() {
  var data = _taggedTemplateLiteral(["#666"]);

  _templateObject70 = function _templateObject70() {
    return data;
  };

  return data;
}

function _templateObject69() {
  var data = _taggedTemplateLiteral(["#B08D00"]);

  _templateObject69 = function _templateObject69() {
    return data;
  };

  return data;
}

function _templateObject68() {
  var data = _taggedTemplateLiteral(["#666"]);

  _templateObject68 = function _templateObject68() {
    return data;
  };

  return data;
}

function _templateObject67() {
  var data = _taggedTemplateLiteral(["#4B7900"]);

  _templateObject67 = function _templateObject67() {
    return data;
  };

  return data;
}

function _templateObject66() {
  var data = _taggedTemplateLiteral(["#666"]);

  _templateObject66 = function _templateObject66() {
    return data;
  };

  return data;
}

function _templateObject65() {
  var data = _taggedTemplateLiteral(["#065A85"]);

  _templateObject65 = function _templateObject65() {
    return data;
  };

  return data;
}

function _templateObject64() {
  var data = _taggedTemplateLiteral(["#666"]);

  _templateObject64 = function _templateObject64() {
    return data;
  };

  return data;
}

function _templateObject63() {
  var data = _taggedTemplateLiteral(["#fcfcfc"]);

  _templateObject63 = function _templateObject63() {
    return data;
  };

  return data;
}

function _templateObject62() {
  var data = _taggedTemplateLiteral(["#fcfcfc"]);

  _templateObject62 = function _templateObject62() {
    return data;
  };

  return data;
}

function _templateObject61() {
  var data = _taggedTemplateLiteral(["#000"]);

  _templateObject61 = function _templateObject61() {
    return data;
  };

  return data;
}

function _templateObject60() {
  var data = _taggedTemplateLiteral(["#333"]);

  _templateObject60 = function _templateObject60() {
    return data;
  };

  return data;
}

function _templateObject59() {
  var data = _taggedTemplateLiteral(["#fff"]);

  _templateObject59 = function _templateObject59() {
    return data;
  };

  return data;
}

function _templateObject58() {
  var data = _taggedTemplateLiteral(["#333"]);

  _templateObject58 = function _templateObject58() {
    return data;
  };

  return data;
}

function _templateObject57() {
  var data = _taggedTemplateLiteral(["#fff"]);

  _templateObject57 = function _templateObject57() {
    return data;
  };

  return data;
}

function _templateObject56() {
  var data = _taggedTemplateLiteral(["#cc3b3b"]);

  _templateObject56 = function _templateObject56() {
    return data;
  };

  return data;
}

function _templateObject55() {
  var data = _taggedTemplateLiteral(["rgba(255, 255, 255, 0.5)"]);

  _templateObject55 = function _templateObject55() {
    return data;
  };

  return data;
}

function _templateObject54() {
  var data = _taggedTemplateLiteral(["#fff"]);

  _templateObject54 = function _templateObject54() {
    return data;
  };

  return data;
}

function _templateObject53() {
  var data = _taggedTemplateLiteral(["#0099e6"]);

  _templateObject53 = function _templateObject53() {
    return data;
  };

  return data;
}

function _templateObject52() {
  var data = _taggedTemplateLiteral(["#333"]);

  _templateObject52 = function _templateObject52() {
    return data;
  };

  return data;
}

function _templateObject51() {
  var data = _taggedTemplateLiteral(["#99ddff"]);

  _templateObject51 = function _templateObject51() {
    return data;
  };

  return data;
}

function _templateObject50() {
  var data = _taggedTemplateLiteral(["#fff"]);

  _templateObject50 = function _templateObject50() {
    return data;
  };

  return data;
}

function _templateObject49() {
  var data = _taggedTemplateLiteral(["#1a1a1a"]);

  _templateObject49 = function _templateObject49() {
    return data;
  };

  return data;
}

function _templateObject48() {
  var data = _taggedTemplateLiteral(["#fff"]);

  _templateObject48 = function _templateObject48() {
    return data;
  };

  return data;
}

function _templateObject47() {
  var data = _taggedTemplateLiteral(["#333"]);

  _templateObject47 = function _templateObject47() {
    return data;
  };

  return data;
}

function _templateObject46() {
  var data = _taggedTemplateLiteral(["#fcfcfc"]);

  _templateObject46 = function _templateObject46() {
    return data;
  };

  return data;
}

function _templateObject45() {
  var data = _taggedTemplateLiteral(["#000"]);

  _templateObject45 = function _templateObject45() {
    return data;
  };

  return data;
}

function _templateObject44() {
  var data = _taggedTemplateLiteral(["#000"]);

  _templateObject44 = function _templateObject44() {
    return data;
  };

  return data;
}

function _templateObject43() {
  var data = _taggedTemplateLiteral(["#000"]);

  _templateObject43 = function _templateObject43() {
    return data;
  };

  return data;
}

function _templateObject42() {
  var data = _taggedTemplateLiteral(["#fcfcfc"]);

  _templateObject42 = function _templateObject42() {
    return data;
  };

  return data;
}

function _templateObject41() {
  var data = _taggedTemplateLiteral(["#000"]);

  _templateObject41 = function _templateObject41() {
    return data;
  };

  return data;
}

function _templateObject40() {
  var data = _taggedTemplateLiteral(["#fafafa"]);

  _templateObject40 = function _templateObject40() {
    return data;
  };

  return data;
}

function _templateObject39() {
  var data = _taggedTemplateLiteral(["#fff"]);

  _templateObject39 = function _templateObject39() {
    return data;
  };

  return data;
}

function _templateObject38() {
  var data = _taggedTemplateLiteral(["#cc3b3b"]);

  _templateObject38 = function _templateObject38() {
    return data;
  };

  return data;
}

function _templateObject37() {
  var data = _taggedTemplateLiteral(["rgba(0,0,0,0.2)"]);

  _templateObject37 = function _templateObject37() {
    return data;
  };

  return data;
}

function _templateObject36() {
  var data = _taggedTemplateLiteral(["#fff"]);

  _templateObject36 = function _templateObject36() {
    return data;
  };

  return data;
}

function _templateObject35() {
  var data = _taggedTemplateLiteral(["#2c6187"]);

  _templateObject35 = function _templateObject35() {
    return data;
  };

  return data;
}

function _templateObject34() {
  var data = _taggedTemplateLiteral(["#fff"]);

  _templateObject34 = function _templateObject34() {
    return data;
  };

  return data;
}

function _templateObject33() {
  var data = _taggedTemplateLiteral(["rgb(81,149,199)"]);

  _templateObject33 = function _templateObject33() {
    return data;
  };

  return data;
}

function _templateObject32() {
  var data = _taggedTemplateLiteral(["#888"]);

  _templateObject32 = function _templateObject32() {
    return data;
  };

  return data;
}

function _templateObject31() {
  var data = _taggedTemplateLiteral(["#e6e6e6"]);

  _templateObject31 = function _templateObject31() {
    return data;
  };

  return data;
}

function _templateObject30() {
  var data = _taggedTemplateLiteral(["#666"]);

  _templateObject30 = function _templateObject30() {
    return data;
  };

  return data;
}

function _templateObject29() {
  var data = _taggedTemplateLiteral(["#fff"]);

  _templateObject29 = function _templateObject29() {
    return data;
  };

  return data;
}

function _templateObject28() {
  var data = _taggedTemplateLiteral(["#9875b7"]);

  _templateObject28 = function _templateObject28() {
    return data;
  };

  return data;
}

function _templateObject27() {
  var data = _taggedTemplateLiteral(["#d3b3ef"]);

  _templateObject27 = function _templateObject27() {
    return data;
  };

  return data;
}

function _templateObject26() {
  var data = _taggedTemplateLiteral(["#B08D00"]);

  _templateObject26 = function _templateObject26() {
    return data;
  };

  return data;
}

function _templateObject25() {
  var data = _taggedTemplateLiteral(["#F9F3A6"]);

  _templateObject25 = function _templateObject25() {
    return data;
  };

  return data;
}

function _templateObject24() {
  var data = _taggedTemplateLiteral(["#4B7900"]);

  _templateObject24 = function _templateObject24() {
    return data;
  };

  return data;
}

function _templateObject23() {
  var data = _taggedTemplateLiteral(["#C7DAAD"]);

  _templateObject23 = function _templateObject23() {
    return data;
  };

  return data;
}

function _templateObject22() {
  var data = _taggedTemplateLiteral(["#065A85"]);

  _templateObject22 = function _templateObject22() {
    return data;
  };

  return data;
}

function _templateObject21() {
  var data = _taggedTemplateLiteral(["#AACDE1"]);

  _templateObject21 = function _templateObject21() {
    return data;
  };

  return data;
}

function _templateObject20() {
  var data = _taggedTemplateLiteral(["#fcfcfc"]);

  _templateObject20 = function _templateObject20() {
    return data;
  };

  return data;
}

function _templateObject19() {
  var data = _taggedTemplateLiteral(["#000"]);

  _templateObject19 = function _templateObject19() {
    return data;
  };

  return data;
}

function _templateObject18() {
  var data = _taggedTemplateLiteral(["#000"]);

  _templateObject18 = function _templateObject18() {
    return data;
  };

  return data;
}

function _templateObject17() {
  var data = _taggedTemplateLiteral(["#000"]);

  _templateObject17 = function _templateObject17() {
    return data;
  };

  return data;
}

function _templateObject16() {
  var data = _taggedTemplateLiteral(["#fcfcfc"]);

  _templateObject16 = function _templateObject16() {
    return data;
  };

  return data;
}

function _templateObject15() {
  var data = _taggedTemplateLiteral(["#000"]);

  _templateObject15 = function _templateObject15() {
    return data;
  };

  return data;
}

function _templateObject14() {
  var data = _taggedTemplateLiteral(["#fafafa"]);

  _templateObject14 = function _templateObject14() {
    return data;
  };

  return data;
}

function _templateObject13() {
  var data = _taggedTemplateLiteral(["#fff"]);

  _templateObject13 = function _templateObject13() {
    return data;
  };

  return data;
}

function _templateObject12() {
  var data = _taggedTemplateLiteral(["#D39F0A"]);

  _templateObject12 = function _templateObject12() {
    return data;
  };

  return data;
}

function _templateObject11() {
  var data = _taggedTemplateLiteral(["#fff"]);

  _templateObject11 = function _templateObject11() {
    return data;
  };

  return data;
}

function _templateObject10() {
  var data = _taggedTemplateLiteral(["#cc3b3b"]);

  _templateObject10 = function _templateObject10() {
    return data;
  };

  return data;
}

function _templateObject9() {
  var data = _taggedTemplateLiteral(["rgba(0,0,0,0.2)"]);

  _templateObject9 = function _templateObject9() {
    return data;
  };

  return data;
}

function _templateObject8() {
  var data = _taggedTemplateLiteral(["#fff"]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  var data = _taggedTemplateLiteral(["#2c6187"]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral(["#fff"]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral(["rgb(81,149,199)"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["#888"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["#e6e6e6"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["#666"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["#fff"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}
var gscape = {
  // primary colors
  primary: css(_templateObject()),
  on_primary: css(_templateObject2()),
  primary_dark: css(_templateObject3()),
  on_primary_dark: css(_templateObject4()),
  // secondary colors
  secondary: css(_templateObject5()),
  on_secondary: css(_templateObject6()),
  secondary_dark: css(_templateObject7()),
  on_secondary_dark: css(_templateObject8()),
  // misc
  shadows: css(_templateObject9()),
  error: css(_templateObject10()),
  on_error: css(_templateObject11()),
  warning: css(_templateObject12()),
  on_warning: css(_templateObject13()),
  // graph colors
  background: css(_templateObject14()),
  edge: css(_templateObject15()),
  node_bg: css(_templateObject16()),
  node_bg_contrast: css(_templateObject17()),
  node_border: css(_templateObject18()),
  label_color: css(_templateObject19()),
  label_color_contrast: css(_templateObject20()),
  role: css(_templateObject21()),
  role_dark: css(_templateObject22()),
  attribute: css(_templateObject23()),
  attribute_dark: css(_templateObject24()),
  concept: css(_templateObject25()),
  concept_dark: css(_templateObject26()),
  individual: css(_templateObject27()),
  individual_dark: css(_templateObject28())
};
var classic = {
  // primary colors
  primary: css(_templateObject29()),
  on_primary: css(_templateObject30()),
  primary_dark: css(_templateObject31()),
  on_primary_dark: css(_templateObject32()),
  // secondary colors
  secondary: css(_templateObject33()),
  on_secondary: css(_templateObject34()),
  secondary_dark: css(_templateObject35()),
  on_secondary_dark: css(_templateObject36()),
  // misc
  shadows: css(_templateObject37()),
  error: css(_templateObject38()),
  on_error: css(_templateObject39()),
  background: css(_templateObject40()),
  edge: css(_templateObject41()),
  node_bg: css(_templateObject42()),
  node_bg_contrast: css(_templateObject43()),
  node_border: css(_templateObject44()),
  label_color: css(_templateObject45()),
  label_color_contrast: css(_templateObject46())
};
var dark_old = {
  primary: css(_templateObject47()),
  on_primary: css(_templateObject48()),
  primary_dark: css(_templateObject49()),
  on_primary_dark: css(_templateObject50()),
  secondary: css(_templateObject51()),
  on_secondary: css(_templateObject52()),
  secondary_dark: css(_templateObject53()),
  on_secondary_dark: css(_templateObject54()),
  shadows: css(_templateObject55()),
  error: css(_templateObject56()),
  on_error: css(_templateObject57()),
  // graph colors
  background: css(_templateObject58()),
  edge: css(_templateObject59()),
  node_bg: css(_templateObject60()),
  node_bg_contrast: css(_templateObject61()),
  node_border: css(_templateObject62()),
  label_color: css(_templateObject63()),
  role: css(_templateObject64()),
  role_dark: css(_templateObject65()),
  attribute: css(_templateObject66()),
  attribute_dark: css(_templateObject67()),
  concept: css(_templateObject68()),
  concept_dark: css(_templateObject69()),
  individual: css(_templateObject70()),
  individual_dark: css(_templateObject71())
};
var dark = {
  primary: css(_templateObject72()),
  on_primary: css(_templateObject73()),
  primary_dark: css(_templateObject74()),
  on_primary_dark: css(_templateObject75()),
  secondary: css(_templateObject76()),
  on_secondary: css(_templateObject77()),
  secondary_dark: css(_templateObject78()),
  on_secondary_dark: css(_templateObject79()),
  shadows: css(_templateObject80()),
  error: css(_templateObject81()),
  on_error: css(_templateObject82()),
  // graph colors
  background: css(_templateObject83()),
  edge: css(_templateObject84()),
  node_bg: css(_templateObject85()),
  node_bg_contrast: css(_templateObject86()),
  node_border: css(_templateObject87()),
  label_color: css(_templateObject88()),
  role: css(_templateObject89()),
  role_dark: css(_templateObject90()),
  attribute_dark: css(_templateObject91()),
  attribute: css(_templateObject92()),
  concept_dark: css(_templateObject93()),
  concept: css(_templateObject94()),
  individual_dark: css(_templateObject95()),
  individual: css(_templateObject96())
};

var themes = /*#__PURE__*/Object.freeze({
  __proto__: null,
  gscape: gscape,
  classic: classic,
  dark_old: dark_old,
  dark: dark
});

function _templateObject2$1() {
  var data = _taggedTemplateLiteral([""]);

  _templateObject2$1 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject$1() {
  var data = _taggedTemplateLiteral(["\n      :host, .gscape-panel{\n        font-family : \"Open Sans\",\"Helvetica Neue\",Helvetica,sans-serif;\n        display: block;\n        position: absolute;\n        color: var(--theme-gscape-on-primary, ", ");\n        background-color:var(--theme-gscape-primary, ", ");\n        box-shadow: 0 2px 4px 0 var(--theme-gscape-shadows, ", ");\n        border-radius: 8px;\n        transition: opacity 0.2s;\n        scrollbar-width: thin;\n      }\n\n      :host(:hover){\n        box-shadow: 0 4px 8px 0 var(--theme-gscape-shadows, ", ");\n      }\n\n      .hide {\n        display:none;\n      }\n\n      .widget-body {\n        width: 100%;\n        max-height:450px;\n        border-top:solid 1px var(--theme-gscape-shadows, ", ");\n        border-bottom-left-radius: inherit;\n        border-bottom-right-radius: inherit;\n        overflow:auto;\n        scrollbar-width: inherit;\n      }\n\n      .gscape-panel {\n        position: absolute;\n        bottom: 40px;\n        width: auto;\n        padding:10px;\n        overflow: unset;\n        border: none;\n      }\n\n      .gscape-panel::after {\n        content: \"\";\n        position: absolute;\n        top: 100%;\n        left: 16px;\n        margin-left: -8px;\n        border-width: 8px;\n        border-style: solid;\n        border-color: #ddd transparent transparent transparent;\n      }\n\n      .gscape-panel-title{\n        font-weight: bold;\n        text-align: center;\n        margin-bottom: 10px;\n      }\n\n      .widget-body .section:last-of-type {\n        margin-bottom: 12px;\n      }\n\n      .widget-body .section-header {\n        text-align: center;\n        font-weight: bold;\n        border-bottom: solid 1px var(--theme-gscape-shadows, ", ");\n        color: var(--theme-gscape-secondary, ", ");\n        width: 85%;\n        margin: auto;\n        margin-bottom: 10px;\n        padding-bottom: 5px;\n      }\n\n      .description {\n        margin-bottom: 20px;\n      }\n\n      .description:last-of-type {\n        margin-bottom: 0;\n      }\n\n      .description .language {\n        min-width: 50px;\n        display: inline-block;\n        font-weight: bold;\n        color: var(--theme-gscape-secondary, ", ");\n        margin: 5px;\n      }\n\n      .section { padding: 10px; }\n\n      .details_table{\n        border-spacing: 0;\n      }\n\n      .details_table th {\n        color: var(--theme-gscape-secondary, ", ");\n        border-right: solid 1px var(--theme-gscape-shadows, ", ");\n        font-weight: bold;\n        text-align:left;\n        min-width: 50px;\n      }\n\n      .details_table th, td {\n        padding:5px 8px;\n        white-space: nowrap;\n      }\n\n      .highlight:hover {\n        color: var(--theme-gscape-on-secondary, ", ");\n        background-color:var(--theme-gscape-secondary, ", ");\n      }\n\n      /* width */\n      ::-webkit-scrollbar {\n        width: 5px;\n        height: 5px;\n      }\n\n      /* Track */\n      ::-webkit-scrollbar-track {\n        background: #f0f0f0;\n      }\n\n      /* Handle */\n      ::-webkit-scrollbar-thumb {\n        background: #cdcdcd;\n      }\n\n      /* Handle on hover */\n      ::-webkit-scrollbar-thumb:hover {\n        background: #888;\n      }\n\n      .clickable {\n        font-weight:bold;\n        text-decoration: underline;\n      }\n\n      .clickable:hover {\n        cursor:pointer;\n        color: var(--theme-gscape-secondary-dark, ", ");\n      }\n\n    "]);

  _templateObject$1 = function _templateObject() {
    return data;
  };

  return data;
}

var GscapeWidget = /*#__PURE__*/function (_LitElement) {
  _inherits(GscapeWidget, _LitElement);

  var _super = _createSuper(GscapeWidget);

  _createClass(GscapeWidget, null, [{
    key: "properties",
    get: function get() {
      return {
        isEnabled: {
          type: Boolean
        },
        hiddenDefault: {
          type: Boolean
        }
      };
    }
  }, {
    key: "styles",
    get: function get() {
      var colors = gscape;
      return [[css(_templateObject$1(), colors.on_primary, colors.primary, colors.shadows, colors.shadows, colors.shadows, colors.shadows, colors.secondary, colors.secondary, colors.secondary, colors.shadows, colors.on_secondary, colors.secondary, colors.secondary_dark)], colors];
    }
  }]);

  function GscapeWidget() {
    var _this;

    _classCallCheck(this, GscapeWidget);

    _this = _super.call(this);
    _this.draggable = false;
    _this.collapsible = false;
    _this.isEnabled = true;
    _this._hiddenDefault = false;

    _this.onselectstart = function () {
    };

    _this.onToggleBody = function () {};

    return _this;
  }

  _createClass(GscapeWidget, [{
    key: "render",
    value: function render() {
      return html$1(_templateObject2$1());
    }
  }, {
    key: "toggleBody",
    value: function toggleBody() {
      if (this.collapsible) {
        if (this.header) {
          this.header.toggleIcon();
        }

        if (this.body) this.body.classList.toggle('hide');
        this.onToggleBody();
      }
    }
  }, {
    key: "collapseBody",
    value: function collapseBody() {
      if (this.collapsible) {
        if (this.header && !this.isCollapsed) this.header.toggleIcon();
        if (this.body) this.body.classList.add('hide');
      }
    }
  }, {
    key: "showBody",
    value: function showBody() {
      if (this.collapsible) {
        if (this.header && this.isCollapsed) this.header.toggleIcon();
        if (this.body) this.body.classList.remove('hide');
      }
    }
  }, {
    key: "firstUpdated",
    value: function firstUpdated() {
      this.header = this.shadowRoot.querySelector('gscape-head');
      this.body = this.shadowRoot.querySelector('.widget-body');

      if (this.collapsible) {
        this.addEventListener('toggle-widget-body', this.toggleBody);
      }

      if (this.draggable) this.makeDraggable();
    }
  }, {
    key: "makeDraggable",
    value: function makeDraggable() {
      var pos1 = 0;
      var pos2 = 0;
      var pos3 = 0;
      var pos4 = 0;
      var elmnt = this;
      var drag_handler = this.shadowRoot.querySelector('.drag-handler');
      if (drag_handler) drag_handler.onmousedown = dragMouseDown;else console.log("No .drag-handler elem for a ".concat(this.constructor.name, " draggable instance"));

      function dragMouseDown(e) {
        e = e || window.event; // get the mouse cursor position at startup:

        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement; // call a function whenever the cursor moves:

        document.onmousemove = elementDrag;
      }

      function elementDrag(e) {
        e = e || window.event; // calculate the new cursor position:

        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY; // set the element's new position:

        elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
        elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';
      }

      function closeDragElement() {
        /* stop moving when mouse button is released: */
        document.onmouseup = null;
        document.onmousemove = null;
      }
    }
  }, {
    key: "show",
    value: function show() {
      if (this.isEnabled) this.style.display = 'initial';
    }
  }, {
    key: "hide",
    value: function hide() {
      this.style.display = 'none';
    }
  }, {
    key: "enable",
    value: function enable() {
      this.isEnabled = true;
      if (!this.hiddenDefault) this.show();
    }
  }, {
    key: "disable",
    value: function disable() {
      this.isEnabled = false;
      this.hide();
    }
  }, {
    key: "blur",
    value: function blur() {
      this.collapseBody();
    }
  }, {
    key: "isVisible",
    get: function get() {
      return this.style.display !== 'none' ? true : false;
    }
  }, {
    key: "hiddenDefault",
    set: function set(value) {
      this._hiddenDefault = value;
      value ? this.hide() : this.show();
      this.requestUpdate();
    },
    get: function get() {
      return this._hiddenDefault;
    }
  }, {
    key: "isCollapsed",
    get: function get() {
      if (this.body) return this.body.classList.contains('hide');else return true;
    }
  }]);

  return GscapeWidget;
}(LitElement); //customElements.define('gscape-widget', GscapeWidget)

function _templateObject2$2() {
  var data = _taggedTemplateLiteral(["\n      :host {\n        display:flex;\n        display: flex;\n        align-items: center;\n        justify-content: space-between;\n        padding: var(--header-padding, 8px);\n      }\n\n      .head-btn {\n        color:var(--theme-gscape-on-primary, ", ");\n        right:0;\n        padding: var(--btn-padding, 0 0 0 5px);\n        cursor:pointer;\n      }\n\n      .head-btn:hover{\n        color:var(--theme-gscape-secondary, ", ");\n      }\n\n      .head-title {\n        padding: var(--title-padding, 0 5px 0 0);\n        box-sizing: border-box;\n        font-weight:bold;\n        cursor:grab;\n        width: var(--title-width, '');\n        text-align: var(--title-text-align, '')\n      }\n    "]);

  _templateObject2$2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject$2() {
  var data = _taggedTemplateLiteral(["\n      <div class=\"head-title\"> ", " </div>\n      <slot></slot>\n      <mwc-icon class=\"head-btn\" @click=\"", "\">\n        ", "\n      </mwc-icon>\n    "]);

  _templateObject$2 = function _templateObject() {
    return data;
  };

  return data;
}

var GscapeHeader = /*#__PURE__*/function (_GscapeWidget) {
  _inherits(GscapeHeader, _GscapeWidget);

  var _super = _createSuper(GscapeHeader);

  _createClass(GscapeHeader, null, [{
    key: "properties",
    get: function get() {
      return {
        title: {
          type: String
        },
        initial_icon: {
          type: String
        },
        secondary_icon: {
          type: String
        },
        icon: {
          type: String
        }
      };
    }
  }]);

  function GscapeHeader() {
    var _this;

    _classCallCheck(this, GscapeHeader);

    _this = _super.call(this);
    _this.title = 'header';
    _this.initial_icon = 'arrow_drop_down';
    _this.secondary_icon = 'arrow_drop_up';
    _this.icon = _this.initial_icon;

    _this.onClick = function () {};

    return _this;
  }

  _createClass(GscapeHeader, [{
    key: "render",
    value: function render() {
      return html$1(_templateObject$2(), this.title, this.iconClickHandler, this.icon);
    }
  }, {
    key: "iconClickHandler",
    value: function iconClickHandler() {
      this.onClick();
      this.toggleBody();
    }
  }, {
    key: "toggleBody",
    value: function toggleBody() {
      var e = new CustomEvent('toggle-widget-body', {
        bubbles: true,
        composed: true
      });
      this.dispatchEvent(e);
    }
  }, {
    key: "invertIcons",
    value: function invertIcons() {
      var _ref = [this.secondary_icon, this.initial_icon];
      this.initial_icon = _ref[0];
      this.secondary_icon = _ref[1];
      this.toggleIcon();
    }
  }, {
    key: "toggleIcon",
    value: function toggleIcon() {
      this.icon = this.icon == this.initial_icon ? this.secondary_icon : this.initial_icon;
    }
  }], [{
    key: "styles",
    get: function get() {
      // we don't need super.styles, just the colors from default imported theme
      var colors = _get(_getPrototypeOf(GscapeHeader), "styles", this)[1];

      return css(_templateObject2$2(), colors.on_primary, colors.secondary);
    }
  }]);

  return GscapeHeader;
}(GscapeWidget);
customElements.define('gscape-head', GscapeHeader);

function _templateObject3$1() {
  var data = _taggedTemplateLiteral(["\n        <div\n          @click=\"", "\"\n          name=\"", "\"\n          diagram-id=\"", "\"\n          class=\"diagram-item highlight ", "\"\n        >\n          ", "\n        </div>\n        "]);

  _templateObject3$1 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2$3() {
  var data = _taggedTemplateLiteral(["\n      <gscape-head title=\"", "\"\n        class=\"drag-handler\"></gscape-head>\n\n      <div class=\"widget-body hide\">\n        ", "\n      </div>\n    "]);

  _templateObject2$3 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject$3() {
  var data = _taggedTemplateLiteral(["\n        :host {\n          top: 10px;\n          left: 10px;\n        }\n\n        .diagram-item {\n          cursor:pointer;\n          padding:5px 10px;\n        }\n\n        .diagram-item:last-of-type {\n          border-radius: inherit;\n        }\n\n        .selected {\n          background-color: var(--theme-gscape-primary-dark, ", ");\n          color: var(--theme-gscape-on-primary-dark, ", ");\n          font-weight: bold;\n        }\n      "]);

  _templateObject$3 = function _templateObject() {
    return data;
  };

  return data;
}

var GscapeDiagramSelector = /*#__PURE__*/function (_GscapeWidget) {
  _inherits(GscapeDiagramSelector, _GscapeWidget);

  var _super = _createSuper(GscapeDiagramSelector);

  _createClass(GscapeDiagramSelector, null, [{
    key: "properties",
    get: function get() {
      return [_get(_getPrototypeOf(GscapeDiagramSelector), "properties", this), {
        actual_diagram_id: String
      }];
    }
  }, {
    key: "styles",
    get: function get() {
      var super_styles = _get(_getPrototypeOf(GscapeDiagramSelector), "styles", this);

      var colors = super_styles[1];
      return [super_styles[0], css(_templateObject$3(), colors.primary_dark, colors.on_primary_dark)];
    }
  }]);

  function GscapeDiagramSelector(diagrams) {
    var _this;

    _classCallCheck(this, GscapeDiagramSelector);

    _this = _super.call(this);
    _this.draggable = true;
    _this.collapsible = true;
    _this.diagrams = diagrams;
    _this.actual_diagram_id = null;
    _this.default_title = 'Select a Diagram';
    _this._onDiagramChange = null;
    return _this;
  }

  _createClass(GscapeDiagramSelector, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return html$1(_templateObject2$3(), this.default_title, this.diagrams.map(function (diagram, id) {
        return html$1(_templateObject3$1(), _this2.changeDiagram, diagram.name, id, id == _this2.actual_diagram_id ? "selected" : "", diagram.name);
      }));
    }
  }, {
    key: "changeDiagram",
    value: function changeDiagram(e) {
      if (this.shadowRoot.querySelector('.selected')) this.shadowRoot.querySelector('.selected').classList.remove('selected');
      e.target.classList.add('selected');
      var diagram_id = e.target.getAttribute('diagram-id');
      this.toggleBody();
      this.actual_diagram_id = diagram_id;

      this._onDiagramChange(diagram_id);
    }
  }, {
    key: "onDiagramChange",
    set: function set(f) {
      this._onDiagramChange = f;
    }
  }, {
    key: "actual_diagram_id",
    set: function set(diagram_id) {
      this._actual_diagram_id = diagram_id;
      if (diagram_id != null) this.header.title = this.diagrams[diagram_id].name;
      this.requestUpdate();
    },
    get: function get() {
      return this._actual_diagram_id;
    }
  }, {
    key: "actual_diagram",
    get: function get() {
      return this._actual_diagram;
    }
  }]);

  return GscapeDiagramSelector;
}(GscapeWidget);
customElements.define('gscape-diagram-selector', GscapeDiagramSelector);

function _templateObject5$1() {
  var data = _taggedTemplateLiteral(["\n                <div class=\"sub-row highlight\"\n                  diagram_id=\"", "\"\n                  node_id=\"", "\"\n                  @click=\"", "\"\n                >\n                  - ", " - ", "\n                </div>\n              "]);

  _templateObject5$1 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4$1() {
  var data = _taggedTemplateLiteral(["\n          <div>\n            <div\n              id=\"", "\"\n              class=\"row highlight\"\n              type=\"", "\"\n              label = \"", "\"\n            >\n              <span><mwc-icon @click='", "'>keyboard_arrow_right</mwc-icon></span>\n              <span>", "</span>\n              <div class=\"row-label\" @click='", "'>", "</div>\n            </div>\n\n            <div class=\"sub-rows-wrapper hide\">\n            ", "\n            </div>\n          </div>\n        "]);

  _templateObject4$1 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3$2() {
  var data = _taggedTemplateLiteral(["\n      <gscape-head title=\"Explorer\" class=\"drag-handler\">\n        <input\n          type=\"text\"\n          autocomplete=\"off\"\n          @keyup=\"", "\"\n          placeholder=\"Search Entities\"\n        />\n      </gscape-head>\n\n      <div class=\"widget-body hide\">\n      ", "\n      </div>\n    "]);

  _templateObject3$2 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2$4() {
  var data = _taggedTemplateLiteral(["\n        <div class=\"type-img type-img-", "\">", "<div>\n      "]);

  _templateObject2$4 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject$4() {
  var data = _taggedTemplateLiteral(["\n        :host {\n          left:50%;\n          top:10px;\n          min-width:340px;\n          max-width:450px;\n          transform: translate(-50%, 0);\n        }\n\n        .widget-body {\n          overflow:auto;\n        }\n\n        .row{\n          line-height: 0;\n          display: flex;\n          align-items: center;\n          padding:4px 0;\n        }\n\n        .row-label{\n          padding-left:5px;\n          cursor:pointer;\n          width:100%;\n          white-space: nowrap;\n        }\n\n        mwc-icon:hover{\n          color: var(--theme-gscape-primary, ", ");\n          cursor:pointer;\n        }\n\n        .type-img{\n          width: 20px;\n          height: 20px;\n          text-align: center;\n          line-height: 20px;\n        }\n\n        .type-img-A{\n          background-color: var(--theme-graph-attribute, ", ");\n          color: var(--theme-graph-attribute-dark, ", ");\n          border: solid 1px var(--theme-graph-attribute-dark, ", ");\n        }\n\n        .type-img-R{\n          background-color: var(--theme-graph-role, ", ");\n          color: var(--theme-graph-role-dark, ", ");\n          border: solid 1px var(--theme-graph-role-dark, ", ");\n        }\n\n        .type-img-C{\n          background-color: var(--theme-graph-concept, ", ");\n          color: var(--theme-graph-concept-dark, ", ");\n          border: solid 1px var(--theme-graph-concept-dark, ", ");\n        }\n\n        .type-img-I{\n          background-color: var(--theme-graph-individual, ", ");\n          color: var(--theme-graph-individual-dark, ", ");\n          border: solid 1px var(--theme-graph-individual-dark, ", ");\n        }\n\n        .sub-row{\n          background-color: var(--theme-gscape-primary-dark, ", ");\n          padding: 4px 0 4px 34px;\n          cursor: pointer;\n        }\n\n        .sub-rows-wrapper{\n          padding: 2px 0;\n        }\n\n        .add-shadow{\n          box-shadow: 0 2px 2px 0 var(--theme-gscape-shadows, ", ");\n        }\n\n        gscape-head input {\n          position:absolute;\n          left: 30%;\n          width: 50%;\n          padding: 0;\n          line-height:22px;\n          box-sizing: border-box;\n          background-color: var(--theme-gscape-primary, ", ");\n          border:none;\n          border-bottom: 1px solid var(--theme-gscape-shadows, ", ");\n          transition: all .35s ease-in-out;\n          color:inherit;\n        }\n\n        gscape-head input:focus {\n          border-color: var(--theme-gscape-secondary, ", ");\n          left:0;\n          margin: 0px 8px;\n          width:80%;\n        }\n      "]);

  _templateObject$4 = function _templateObject() {
    return data;
  };

  return data;
}

var GscapeExplorer = /*#__PURE__*/function (_GscapeWidget) {
  _inherits(GscapeExplorer, _GscapeWidget);

  var _super = _createSuper(GscapeExplorer);

  _createClass(GscapeExplorer, null, [{
    key: "properties",
    get: function get() {
      return [_get(_getPrototypeOf(GscapeExplorer), "properties", this), {
        predicates: Object
      }];
    }
  }, {
    key: "styles",
    get: function get() {
      var super_styles = _get(_getPrototypeOf(GscapeExplorer), "styles", this);

      var colors = super_styles[1];
      return [super_styles[0], css(_templateObject$4(), colors.primary, colors.attribute, colors.attribute_dark, colors.attribute_dark, colors.role, colors.role_dark, colors.role_dark, colors.concept, colors.concept_dark, colors.concept_dark, colors.individual, colors.individual_dark, colors.individual_dark, colors.primary_dark, colors.shadows, colors.primary, colors.shadows, colors.secondary)];
    }
  }]);

  function GscapeExplorer(predicates, diagrams) {
    var _this;

    _classCallCheck(this, GscapeExplorer);

    _this = _super.call(this);
    _this.draggable = true;
    _this.collapsible = true;
    _this.diagrams = diagrams;
    _this.predicates = predicates;
    _this.onEntitySelect = {};
    _this.onNodeNavigation = {};
    return _this;
  }

  _createClass(GscapeExplorer, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      function getTypeImg(type) {
        var letter = type.charAt(0).toUpperCase();
        return html$1(_templateObject2$4(), letter, letter);
      }

      return html$1(_templateObject3$2(), this.search, Object.keys(this.predicates).map(function (key) {
        var predicate = _this2.predicates[key];
        return html$1(_templateObject4$1(), predicate.subrows[0].id, predicate.type, predicate.label, _this2.toggleSubRows, getTypeImg(predicate.type), _this2.handleEntitySelection, predicate.label, predicate.subrows.map(function (predicate_instance) {
          return html$1(_templateObject5$1(), predicate_instance.diagram.id, predicate_instance.id, _this2.handleNodeSelection, predicate_instance.diagram.name, predicate_instance.id_xml);
        }));
      }));
    }
  }, {
    key: "toggleSubRows",
    value: function toggleSubRows(e) {
      var row_wrapper = e.target.parentNode.parentNode.parentNode;
      row_wrapper.querySelector('.sub-rows-wrapper').classList.toggle('hide');
      e.target.innerHTML = e.target.innerHTML == 'keyboard_arrow_right' ? 'keyboard_arrow_down' : 'keyboard_arrow_right';
      var row = row_wrapper.querySelector('.row');
      row.classList.toggle('add-shadow');
    }
  }, {
    key: "search",
    value: function search(e) {
      if (e.keyCode == 27) {
        e.target.blur();
      }

      var value = e.target.value.toLowerCase();
      if (value === '') this.collapseBody();else this.showBody();
      var rows = this.shadowRoot.querySelectorAll('.row');
      rows.forEach(function (row) {
        value.split(' ').forEach(function (word) {
          if (row.getAttribute('label').toLowerCase().indexOf(word) > -1 || row.getAttribute('type').toLowerCase().indexOf(word) > -1) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
      e.target.focus();
    }
  }, {
    key: "handleEntitySelection",
    value: function handleEntitySelection(e) {
      var entity_id = e.target.parentNode.getAttribute('id');
      this.onEntitySelect(entity_id, true);
    }
  }, {
    key: "handleNodeSelection",
    value: function handleNodeSelection(e) {
      this.collapseBody();
      var node_id = e.target.getAttribute('node_id');
      this.onNodeNavigation(node_id);
    } // override

  }, {
    key: "blur",
    value: function blur() {
      _get(_getPrototypeOf(GscapeExplorer.prototype), "blur", this).call(this);

      this.shadowRoot.querySelector('input').blur();
    }
  }, {
    key: "predicates",
    get: function get() {
      return this._predicates;
    },
    set: function set(predicates) {
      function getSubRowsObject(predicate) {
        return {
          id: predicate.id,
          id_xml: predicate.id_xml,
          diagram: {
            id: predicate.diagram_id,
            name: this.diagrams[predicate.diagram_id].name
          }
        };
      }

      var getSubRowsObjectBound = getSubRowsObject.bind(this);
      var dictionary = [];
      predicates.forEach(function (predicate) {
        var label = predicate.displayed_name.replace(/\r?\n|\r/g, '');
        var key = label.concat(predicate.type);

        if (!(key in dictionary)) {
          dictionary[key] = {
            type: predicate.type,
            label: label,
            subrows: []
          };
        }

        dictionary[key].subrows.push(getSubRowsObjectBound(predicate));
      });
      this._predicates = dictionary;
    }
  }]);

  return GscapeExplorer;
}(GscapeWidget);
customElements.define('gscape-explorer', GscapeExplorer);

function _templateObject9$1() {
  var data = _taggedTemplateLiteral([""]);

  _templateObject9$1 = function _templateObject9() {
    return data;
  };

  return data;
}

function _templateObject8$1() {
  var data = _taggedTemplateLiteral(["<span class=\"language\">", "</span>"]);

  _templateObject8$1 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7$1() {
  var data = _taggedTemplateLiteral(["\n            <div class=\"description\" lang=\"", "\">\n              ", "\n              <span class=\"descr-text\"></span>\n            </div>\n          "]);

  _templateObject7$1 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6$1() {
  var data = _taggedTemplateLiteral(["\n      <div class=\"section\">\n        <div class=\"section-header\"> Description </div>\n        ", "\n      </div>\n    "]);

  _templateObject6$1 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5$2() {
  var data = _taggedTemplateLiteral(["<th rowspan=\"3\">", "</th>"]);

  _templateObject5$2 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4$2() {
  var data = _taggedTemplateLiteral(["\n                  <tr>\n                    ", "\n                    <td class=\"language\">", "</td>\n                    <td>", "</td>\n                  </tr>\n                "]);

  _templateObject4$2 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3$3() {
  var data = _taggedTemplateLiteral(["\n            <tbody class=\"annotation-row\">\n              ", "\n            </tbody>\n          "]);

  _templateObject3$3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2$5() {
  var data = _taggedTemplateLiteral(["\n      <div class=\"section\">\n        <div class=\"section-header\">Annotations</div>\n        <table class=\"details_table annotations\">\n        ", "\n        </table>\n      </div>\n    "]);

  _templateObject2$5 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject$5() {
  var data = _taggedTemplateLiteral(["\n    ", "\n\n  ", "\n  "]);

  _templateObject$5 = function _templateObject() {
    return data;
  };

  return data;
}
var annotationsTemplate = (function (entity) {
  return html$1(_templateObject$5(), entity.annotations && Object.keys(entity.annotations).length > 0 ? html$1(_templateObject2$5(), Object.keys(entity.annotations).map(function (kind) {
    var annotation = entity.annotations[kind];
    return html$1(_templateObject3$3(), Object.keys(annotation).map(function (language, count) {
      return html$1(_templateObject4$2(), count == 0 ? html$1(_templateObject5$2(), kind.charAt(0).toUpperCase() + kind.slice(1)) : '', language, annotation[language]);
    }));
  })) : '', entity.description && Object.keys(entity.description).length > 0 ? html$1(_templateObject6$1(), Object.keys(entity.description).map(function (language) {
    return html$1(_templateObject7$1(), language, language != '' ? html$1(_templateObject8$1(), language) : '');
  })) : html$1(_templateObject9$1()));
});

function _templateObject3$4() {
  var data = _taggedTemplateLiteral(["\n            <tr>\n              <th>", "</th>\n              <td node_id=\"", "\" class=\"clickable\" @click=\"", "\">", "</td>\n            </tr>\n          "]);

  _templateObject3$4 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2$6() {
  var data = _taggedTemplateLiteral(["\n      <table class=\"details_table\">\n        <tbody>\n        ", "\n        </tbody>\n      </table>\n    "]);

  _templateObject2$6 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject$6() {
  var data = _taggedTemplateLiteral(["", ""]);

  _templateObject$6 = function _templateObject() {
    return data;
  };

  return data;
}
var entityOccurrencesTemplate = (function (occurrences, onNodeNavigation) {
  return html$1(_templateObject$6(), occurrences && occurrences.length > 0 ? html$1(_templateObject2$6(), occurrences.map(function (occurrence) {
    return html$1(_templateObject3$4(), occurrence.diagram_name, occurrence.id, onNodeNavigation, occurrence.id_xml);
  })) : '');
});

function _templateObject8$2() {
  var data = _taggedTemplateLiteral([""]);

  _templateObject8$2 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7$2() {
  var data = _taggedTemplateLiteral([""]);

  _templateObject7$2 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6$2() {
  var data = _taggedTemplateLiteral(["<span class=\"chip\">&#10003; ", "</span>"]);

  _templateObject6$2 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5$3() {
  var data = _taggedTemplateLiteral([""]);

  _templateObject5$3 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4$3() {
  var data = _taggedTemplateLiteral(["\n                <tr>\n                  <th>IRI</th>\n                  <td>", "</td>\n                </tr>\n                "]);

  _templateObject4$3 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3$5() {
  var data = _taggedTemplateLiteral(["\n            <div class=\"section\">\n              <table class=\"details_table\">\n                <tr>\n                  <th>Name</th>\n                  <td class=\"wiki\" @click=\"", "\">", "</td>\n                </tr>\n                <tr>\n                  <th>Type</th>\n                  <td>", "</td>\n                </tr>\n                ", "\n              </table>\n            </div>\n\n            <div class=\"chips-wrapper\">\n              ", "\n            </div>\n\n            ", "\n          "]);

  _templateObject3$5 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2$7() {
  var data = _taggedTemplateLiteral(["\n      <gscape-head title=\"Entity Details\" class=\"drag-handler\"></gscape-head>\n      <div class=\"widget-body\">\n        ", "\n      </div>\n    "]);

  _templateObject2$7 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject$7() {
  var data = _taggedTemplateLiteral(["\n        :host {\n          top:10px;\n          right:62px;\n          width:400px;\n        }\n\n        .chips-wrapper {\n          padding: 0 10px;\n        }\n\n        .descr-header {\n          text-align: center;\n          padding: 12px;\n          font-weight: bold;\n          border-bottom: solid 1px var(--theme-gscape-shadows, ", ");\n          color: var(--theme-gscape-secondary, ", ");\n          width: 85%;\n          margin: auto;\n        }\n\n        gscape-head {\n          --title-text-align: center;\n          --title-width: 100%;\n        }\n\n        .chip {\n          display: inline-block;\n          margin: 4px;\n          padding: 3px 8px;\n          border-radius: 32px;\n          border: 1px solid var(--theme-gscape-secondary, ", ");\n          color: var(--theme-gscape-secondary, ", ");\n          font-size: 13px;\n        }\n\n        .language {\n          text-align: center;\n          font-size: 14px;\n        }\n\n        tbody:nth-child(n+2)::before {\n          content: '';\n          display: table-row;\n          height: 20px;\n        }\n      "]);

  _templateObject$7 = function _templateObject() {
    return data;
  };

  return data;
}

var GscapeEntityDetails = /*#__PURE__*/function (_GscapeWidget) {
  _inherits(GscapeEntityDetails, _GscapeWidget);

  var _super = _createSuper(GscapeEntityDetails);

  _createClass(GscapeEntityDetails, null, [{
    key: "properties",
    get: function get() {
      return [_get(_getPrototypeOf(GscapeEntityDetails), "properties", this), {
        entity: {
          type: Object
        }
      }];
    }
  }, {
    key: "styles",
    get: function get() {
      var super_styles = _get(_getPrototypeOf(GscapeEntityDetails), "styles", this);

      var colors = super_styles[1];
      return [super_styles[0], css(_templateObject$7(), colors.shadows, colors.secondary, colors.secondary, colors.secondary)];
    }
  }]);

  function GscapeEntityDetails() {
    var _this;

    _classCallCheck(this, GscapeEntityDetails);

    _this = _super.call(this);
    _this.draggable = true;
    _this.collapsible = true;
    _this.hiddenDefault = true;
    _this._entity = null;
    _this.properties = {
      functional: 'Functional',
      inverseFunctional: 'Inverse Functional',
      symmetric: 'Symmetric',
      asymmetric: 'Asymmetric',
      reflexive: 'Reflexive',
      irreflexive: 'Irreflexive',
      transitive: 'Transitive'
    };
    _this.onNodeNavigation = {};
    return _this;
  }

  _createClass(GscapeEntityDetails, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return html$1(_templateObject2$7(), this.entity ? html$1(_templateObject3$5(), this.wikiClickHandler, this.entity.iri.remaining_chars, this.entity.type, this.entity.type != 'individual' ? html$1(_templateObject4$3(), this.entity.iri.full_iri) : html$1(_templateObject5$3()), Object.keys(this.properties).map(function (property) {
        return _this2.entity[property] ? html$1(_templateObject6$2(), _this2.properties[property]) : html$1(_templateObject7$2());
      }), annotationsTemplate(this.entity)) : html$1(_templateObject8$2()));
    }
  }, {
    key: "wikiClickHandler",
    value: function wikiClickHandler(e) {
      if (this._onWikiClick) this._onWikiClick(this.entity.iri.full_iri);
    }
  }, {
    key: "updated",
    value: function updated() {
      if (this.entity && this.entity.description) this.renderDescription(this.entity.description);

      if (this._onWikiClick) {
        this.shadowRoot.querySelectorAll('.wiki').forEach(function (el) {
          el.classList.add('clickable');
        });
      }
    }
  }, {
    key: "renderDescription",
    value: function renderDescription(description) {
      var _this3 = this;

      var descr_container;
      var text;
      Object.keys(description).forEach(function (language) {
        text = '';
        descr_container = _this3.shadowRoot.querySelector("[lang = \"".concat(language, "\"] > .descr-text"));
        description[language].forEach(function (comment, i) {
          i > 0 ? text += '<p>' + comment.replace(/(href=.)\/predicate\//g, '$1/documentation/predicate/') + '</p>' : text += comment.replace(/(href=.)\/predicate\//g, '$1/documentation/predicate/');
        });
        descr_container.innerHTML = text;
      });
    }
  }, {
    key: "handleNodeSelection",
    value: function handleNodeSelection(e) {
      var node_id = e.target.getAttribute('node_id');
      this.onNodeNavigation(node_id);
    }
  }, {
    key: "firstUpdated",
    value: function firstUpdated() {
      _get(_getPrototypeOf(GscapeEntityDetails.prototype), "firstUpdated", this).call(this);

      this.header.invertIcons();
    } // override

  }, {
    key: "blur",
    value: function blur() {
      this.hide();
    }
  }, {
    key: "onWikiClick",
    set: function set(foo) {
      this._onWikiClick = foo;
    }
  }, {
    key: "entity",
    set: function set(entity) {
      var oldval = this.entity;
      this._entity = entity;

      switch (this._entity.type) {
        case 'concept':
          this._entity.type = 'Class';
          break;

        case 'role':
          this._entity.type = 'Object Property';
          break;

        case 'attribute':
          this._entity.type = 'Data Property';
          break;
      }

      this.requestUpdate('entity', oldval);
    },
    get: function get() {
      return this._entity;
    }
  }]);

  return GscapeEntityDetails;
}(GscapeWidget);
customElements.define('gscape-entity-details', GscapeEntityDetails);

function _templateObject2$8() {
  var data = _taggedTemplateLiteral(["\n      <div\n        class=\"btn\"\n        ?active = \"", "\"\n        @click=\"", "\"\n        title=\"", "\">\n\n        <mwc-icon>", "</mwc-icon>\n      </div>\n    "]);

  _templateObject2$8 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject$8() {
  var data = _taggedTemplateLiteral(["\n\n        mwc-icon {\n          font-size: var(--gscape-button-font-size, 24px)\n        }\n\n        .btn {\n          padding:5px;\n          line-height:0;\n          cursor: pointer;\n        }\n\n        .btn:hover {\n          color: var(--theme-gscape-secondary, ", ");\n        }\n\n        .btn[active] {\n          color: var(--theme-gscape-secondary, ", ");\n        }\n      "]);

  _templateObject$8 = function _templateObject() {
    return data;
  };

  return data;
}

var GscapeButton = /*#__PURE__*/function (_GscapeWidget) {
  _inherits(GscapeButton, _GscapeWidget);

  var _super = _createSuper(GscapeButton);

  _createClass(GscapeButton, null, [{
    key: "properties",
    get: function get() {
      return {
        icon: {
          type: String
        },
        active: {
          type: Boolean
        }
      };
    }
  }, {
    key: "styles",
    get: function get() {
      var super_styles = _get(_getPrototypeOf(GscapeButton), "styles", this);

      var colors = super_styles[1];
      return [super_styles[0], css(_templateObject$8(), colors.secondary, colors.secondary)];
    }
  }]);

  function GscapeButton(icon, alt_icon) {
    var _this;

    var draggable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    _classCallCheck(this, GscapeButton);

    _this = _super.call(this);
    _this.draggable = draggable;
    _this.icon = icon;
    _this.alternate_icon = alt_icon || icon;
    _this.onClick = null;
    _this.highlight = false;
    _this.active = false;
    return _this;
  }

  _createClass(GscapeButton, [{
    key: "render",
    value: function render() {
      return html$1(_templateObject2$8(), this.active, this.clickHandler, this.icon, this.icon);
    }
  }, {
    key: "clickHandler",
    value: function clickHandler() {
      if (this.highlight) this.active = !this.active;
      this.toggleIcon();

      this._onClick();
    }
  }, {
    key: "toggleIcon",
    value: function toggleIcon() {
      var aux = this._icon;
      this.icon = this._alternate_icon;
      this.alternate_icon = aux;
    }
  }, {
    key: "firstUpdated",
    value: function firstUpdated() {
      _get(_getPrototypeOf(GscapeButton.prototype), "firstUpdated", this).call(this);

      this.shadowRoot.querySelector('mwc-icon').onselectstart = function () {
        return false;
      };
    }
  }, {
    key: "icon",
    set: function set(icon) {
      var oldval = this._icon;
      this._icon = icon;
      this.requestUpdate('icon', oldval);
    },
    get: function get() {
      return this._icon;
    }
  }, {
    key: "alternate_icon",
    set: function set(icon) {
      var oldval = this._alternate_icon;
      this._alternate_icon = icon;
      this.requestUpdate('alternative_icon', oldval);
    }
  }, {
    key: "onClick",
    set: function set(f) {
      this._onClick = f;
    }
  }]);

  return GscapeButton;
}(GscapeWidget);
customElements.define('gscape-button', GscapeButton);

function _templateObject5$4() {
  var data = _taggedTemplateLiteral(["<span class=\"toggle-label\">", "</span>"]);

  _templateObject5$4 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4$4() {
  var data = _taggedTemplateLiteral([""]);

  _templateObject4$4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3$6() {
  var data = _taggedTemplateLiteral([""]);

  _templateObject3$6 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2$9() {
  var data = _taggedTemplateLiteral(["\n    <div class=\"toggle-container\">\n      ", "\n      <label class=\"toggle-wrap\">\n        <input id=\"", "\" type=\"checkbox\"\n          ?checked=\"", "\"\n          ?disabled=\"", "\"\n          @click=\"", "\"\n        />\n        <span class=\"toggle\"></span>\n      </label>\n      ", "\n    </div>\n    "]);

  _templateObject2$9 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject$9() {
  var data = _taggedTemplateLiteral(["\n        :host {\n          display: flex;\n        }\n\n        .toggle-container {\n          white-space: nowrap;\n          display: flex;\n          align-items: center;\n        }\n\n        .toggle-wrap {\n          width: 33px;\n          height: 19px;\n          display: inline-block;\n          position: relative;\n        }\n\n        .toggle {\n          position: absolute;\n          cursor: pointer;\n          top: 0;\n          left: 0;\n          right: 0;\n          bottom: 0;\n          background-color: #ccc;\n          transition: checked 0.2s;\n          border-radius: 19px;\n        }\n\n        .toggle::before {\n          position: absolute;\n          content: \"\";\n          height: 11px;\n          width: 11px;\n          left: 4px;\n          bottom: 4px;\n          background-color: var(--theme-gscape-primary, ", ");\n          transition: .1s;\n          border-radius: 20px;\n        }\n\n        .toggle-wrap input {\n          display:none;\n        }\n\n        .toggle-wrap input:checked + .toggle {\n          background-color: var(--theme-gscape-secondary, ", ");\n        }\n\n        .toggle-wrap input:checked + .toggle::before {\n          -webkit-transform: translateX(14px);\n          -ms-transform: translateX(14px);\n          transform: translateX(14px);\n        }\n\n        .toggle-wrap input:disabled + .toggle {\n          opacity:0.25;\n        }\n\n        .toggle-label {\n          margin: 0 15px;\n        }\n      "]);

  _templateObject$9 = function _templateObject() {
    return data;
  };

  return data;
}

var GscapeToggle = /*#__PURE__*/function (_GscapeWidget) {
  _inherits(GscapeToggle, _GscapeWidget);

  var _super = _createSuper(GscapeToggle);

  _createClass(GscapeToggle, null, [{
    key: "properties",
    get: function get() {
      return {
        state: {
          type: Boolean
        },
        disabled: {
          type: Boolean
        },
        label: {
          type: String
        },
        key: {
          type: String
        },
        checked: {
          type: Boolean
        }
      };
    }
  }, {
    key: "styles",
    get: function get() {
      var super_styles = _get(_getPrototypeOf(GscapeToggle), "styles", this);

      var colors = super_styles[1];
      return css(_templateObject$9(), colors.primary, colors.secondary);
    }
  }]);

  function GscapeToggle(key, state, disabled, label, onToggle) {
    var _this;

    var inverse_mode = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

    _classCallCheck(this, GscapeToggle);

    _this = _super.call(this);
    _this.key = key || ''; // always set inverse before state

    _this.inverse = inverse_mode;
    _this.state = state || false;
    _this.disabled = disabled || false;
    _this.onToggle = onToggle || {};
    _this.label = label || '';
    _this.label_pos = 'left';
    return _this;
  }

  _createClass(GscapeToggle, [{
    key: "render",
    value: function render() {
      return html$1(_templateObject2$9(), this.label_pos == 'left' ? this.label_span : html$1(_templateObject3$6()), this.key, this.checked, this.disabled, this.clickHandler, this.label_pos == 'right' ? this.label_span : html$1(_templateObject4$4()));
    }
  }, {
    key: "clickHandler",
    value: function clickHandler(e) {
      this.state = !this.state;
      this.onToggle(e);
    }
  }, {
    key: "updated",
    value: function updated(a) {
      // force toggle to change its visual state
      // this should be unnecessary: see issue
      this.shadowRoot.querySelector("#".concat(this.key)).checked = this.checked;
    }
  }, {
    key: "state",
    set: function set(state) {
      this._state = state;
      this.checked = this.inverse ? !state : state; // trying to force an update, doesn't work
      //this.requestUpdate('checked', old_checked_val)
    },
    get: function get() {
      return this._state;
    }
  }, {
    key: "label_span",
    get: function get() {
      return html$1(_templateObject5$4(), this.label);
    }
  }]);

  return GscapeToggle;
}(GscapeWidget);
customElements.define('gscape-toggle', GscapeToggle);

function _templateObject3$7() {
  var data = _taggedTemplateLiteral(["\n              ", "\n            "]);

  _templateObject3$7 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2$a() {
  var data = _taggedTemplateLiteral(["\n      ", "\n\n      <div class=\"widget-body hide gscape-panel\">\n        <div class=\"gscape-panel-title\">Filters</div>\n\n        <div class=\"filters-wrapper\">\n          ", "\n        </div>\n      </div>\n    "]);

  _templateObject2$a = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject$a() {
  var data = _taggedTemplateLiteral(["\n        :host {\n          bottom:10px;\n          left:10px;\n        }\n\n        gscape-button{\n          position: static;\n        }\n\n        gscape-toggle {\n          padding: 8px;\n        }\n\n        gscape-toggle[first]{\n          justify-content: center;\n          border-bottom: 1px solid #ccc;\n          margin-bottom: 10px;\n          padding: 10px;\n        }\n      "]);

  _templateObject$a = function _templateObject() {
    return data;
  };

  return data;
}

var GscapeFilters = /*#__PURE__*/function (_GscapeWidget) {
  _inherits(GscapeFilters, _GscapeWidget);

  var _super = _createSuper(GscapeFilters);

  _createClass(GscapeFilters, null, [{
    key: "properties",
    get: function get() {
      return {
        filters: {
          type: Object,
          hasChanged: function hasChanged(newVal, oldVal) {
            if (!oldVal) return true;
            Object.keys(newVal).map(function (key) {
              if (newVal[key].active != oldVal[key].active || newVal[key].disabled != oldVal[key].disabled) return true;
            });
            return false;
          }
        }
      };
    }
  }, {
    key: "styles",
    get: function get() {
      var super_styles = _get(_getPrototypeOf(GscapeFilters), "styles", this);

      var colors = super_styles[1];
      return [super_styles[0], css(_templateObject$a())];
    }
  }]);

  function GscapeFilters(filters) {
    var _this;

    _classCallCheck(this, GscapeFilters);

    _this = _super.call(this);
    _this.collapsible = true;
    _this.filters = filters;
    _this.btn = new GscapeButton('filter_list');
    _this.btn.onClick = _this.toggleBody.bind(_assertThisInitialized(_this));
    _this.btn.active = false;

    _this.onFilterOn = function () {};

    _this.onFilterOff = function () {};

    return _this;
  }

  _createClass(GscapeFilters, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return html$1(_templateObject2$a(), this.btn, Object.keys(this.filters).map(function (key) {
        var filter = _this2.filters[key];
        var toggle = {};
        /**
         * filter toggles work in inverse mode
         *  checked => filter not active
         *  unchecked => filter active
         *
         * we invert the visual behaviour of a toggle passing the last flag setted to true
         * the active boolean will represent the filter state, not the visual state.
         */

        if (key == 'all') {
          toggle = new GscapeToggle(key, filter.active, filter.disabled, filter.label, _this2.toggleFilter.bind(_this2));
          toggle.setAttribute('first', 'true');
        } else {
          toggle = new GscapeToggle(key, filter.active, filter.disabled, filter.label, _this2.toggleFilter.bind(_this2), true);
        }

        toggle.label_pos = 'right';
        return html$1(_templateObject3$7(), toggle);
      }));
    }
  }, {
    key: "toggleFilter",
    value: function toggleFilter(e) {
      var toggle = e.target;
      if (toggle.id == 'all') toggle.checked ? this.onFilterOn(toggle.id) : this.onFilterOff(toggle.id);else !toggle.checked ? this.onFilterOn(toggle.id) : this.onFilterOff(toggle.id);
    }
  }, {
    key: "updateTogglesState",
    value: function updateTogglesState() {
      var _this3 = this;

      var toggles = this.shadowRoot.querySelectorAll("gscape-toggle");
      var is_activated = false;
      toggles.forEach(function (toggle) {
        toggle.state = _this3.filters[toggle.key].active;
        toggle.disabled = _this3.filters[toggle.key].disabled;
        if (toggle.state) is_activated = true;
      });
      this.btn.active = is_activated;
      this.btn.requestUpdate();
    }
  }]);

  return GscapeFilters;
}(GscapeWidget);
customElements.define('gscape-filters', GscapeFilters);

function _templateObject3$8() {
  var data = _taggedTemplateLiteral(["\n                    <tr>\n                      <th>", "</th>\n                      <td>", "</td>\n                    </tr>\n                  "]);

  _templateObject3$8 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2$b() {
  var data = _taggedTemplateLiteral(["\n      ", "\n\n      <div class=\"widget-body hide gscape-panel\">\n        <div class=\"gscape-panel-title\">Ontology Info</div>\n\n        <div class=\"wrapper\">\n\n          <div class=\"section\">\n            <table class=\"details_table\">\n              <tr>\n                <th>Name</th>\n                <td>", "</td>\n              </tr>\n              <tr>\n                <th>Version</th>\n                <td>", "</td>\n              </tr>\n            </table>\n          </div>\n\n          ", "\n\n          <div class=\"section\">\n            <div class=\"section-header\">IRI Prefixes Dictionary</div>\n            <table class=\"iri-dict details_table\">\n              ", "\n            </table>\n          </div>\n        </div>\n      </div>\n    "]);

  _templateObject2$b = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject$b() {
  var data = _taggedTemplateLiteral(["\n        :host {\n          bottom:10px;\n          left:52px;\n        }\n\n        .gscape-panel {\n          padding-right: 0;\n        }\n\n        gscape-button {\n          position: static;\n        }\n\n        .iri-dict th.table-header{\n          text-align: center;\n          padding: 12px;\n          font-weight: bold;\n          border-right: 0;\n          color: var(--theme-gscape-on-primary, ", ");\n        }\n\n        .iri-dict th {\n          color: var(--theme-gscape-on-primary, ", ");\n          border-right: solid 1px var(--theme-gscape-shadows, ", ");\n          text-align: left;\n          font-weight: normal;\n        }\n\n        .wrapper {\n          overflow-y: auto;\n          scrollbar-width: inherit;\n          max-height: 420px;\n          overflow-x: hidden;\n          padding-right: 10px;\n        }\n\n        .section {\n          padding-left: 0;\n          padding-right: 0;\n        }\n      "]);

  _templateObject$b = function _templateObject() {
    return data;
  };

  return data;
}

var GscapeOntologyInfo = /*#__PURE__*/function (_GscapeWidget) {
  _inherits(GscapeOntologyInfo, _GscapeWidget);

  var _super = _createSuper(GscapeOntologyInfo);

  _createClass(GscapeOntologyInfo, null, [{
    key: "styles",
    get: function get() {
      var super_styles = _get(_getPrototypeOf(GscapeOntologyInfo), "styles", this);

      var colors = super_styles[1];
      return [super_styles[0], css(_templateObject$b(), colors.on_primary, colors.on_primary, colors.shadows)];
    }
  }]);

  function GscapeOntologyInfo(ontology) {
    var _this;

    _classCallCheck(this, GscapeOntologyInfo);

    _this = _super.call(this);
    _this.collapsible = true;
    _this.ontology = ontology;
    _this.btn = new GscapeButton('info_outline');
    _this.btn.onClick = _this.toggleBody.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(GscapeOntologyInfo, [{
    key: "render",
    value: function render() {
      return html$1(_templateObject2$b(), this.btn, this.ontology.name, this.ontology.version, annotationsTemplate(this.ontology), _toConsumableArray(this.ontology.namespaces).map(function (iri) {
        if (!iri.isStandard()) {
          return html$1(_templateObject3$8(), iri.prefixes[0], iri.value);
        }
      }));
    }
  }, {
    key: "updated",
    value: function updated() {
      var _this2 = this;

      if (this.ontology.description) {
        var descr_container;
        var text;
        Object.keys(this.ontology.description).forEach(function (language) {
          text = '';
          descr_container = _this2.shadowRoot.querySelector("[lang = \"".concat(language, "\"] > .descr-text"));

          _this2.ontology.description[language].forEach(function (comment, i) {
            i > 0 ? text += '<p>' + comment.replace(/(href=.)\/predicate\//g, '$1/documentation/predicate/') + '</p>' : text += comment.replace(/(href=.)\/predicate\//g, '$1/documentation/predicate/');
          });

          descr_container.innerHTML = text;
        });
      }
    }
  }]);

  return GscapeOntologyInfo;
}(GscapeWidget);
customElements.define('gscape-ontology-info', GscapeOntologyInfo);

function _templateObject2$c() {
  var data = _taggedTemplateLiteral(["\n      <div class=\"widget-body\">\n        <div class=\"owl-text\"></div>\n      </div>\n      <gscape-head title=\"Owl Translation\"></gscape-head>\n    "]);

  _templateObject2$c = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject$c() {
  var data = _taggedTemplateLiteral(["\n        :host {\n          left:50%;\n          bottom:10px;\n          transform: translate(-50%, 0);\n        }\n\n        gscape-head {\n          --title-text-align: center;\n          --title-width: 100%;\n        }\n\n        .widget-body {\n          margin:0;\n          border-top: none;\n          border-bottom: 1px solid var(--theme-gscape-shadows, ", ");\n          border-bottom-left-radius:0;\n          border-bottom-right-radius:0;\n        }\n\n        .owl-text {\n          padding: 15px 10px;\n          font-family: \"Lucida Console\", Monaco, monospace;\n          overflow: auto;\n          white-space: nowrap;\n          line-height: 1.5;\n        }\n\n        .owl_concept{\n          color: #b58900;\n        }\n\n        .owl_role{\n          color: #268bd2;\n        }\n\n        .owl_attribute{\n          color: #859900;\n        }\n\n        .owl_value-domain{\n          color: #2aa198;\n        }\n\n        .owl_individual{\n          color: #6c71c4;\n        }\n\n        .owl_value {\n          color: #d33682;\n        }\n\n        .axiom_predicate_prefix{\n          color:#cb4b16;\n        }\n\n        .owl_error {\n          color: var(--theme-gscape-error, ", ");\n        }\n\n        .axiom_predefinite_obj {\n          color: #00c0a0;\n        }\n\n      "]);

  _templateObject$c = function _templateObject() {
    return data;
  };

  return data;
}

var GscapeOwlTranslator = /*#__PURE__*/function (_GscapeWidget) {
  _inherits(GscapeOwlTranslator, _GscapeWidget);

  var _super = _createSuper(GscapeOwlTranslator);

  _createClass(GscapeOwlTranslator, null, [{
    key: "properties",
    get: function get() {
      return {
        owl_text: String
      };
    }
  }, {
    key: "styles",
    get: function get() {
      var super_styles = _get(_getPrototypeOf(GscapeOwlTranslator), "styles", this);

      var colors = super_styles[1];
      return [_get(_getPrototypeOf(GscapeOwlTranslator), "styles", this)[0], css(_templateObject$c(), colors.shadows, colors.error)];
    }
  }]);

  function GscapeOwlTranslator() {
    var _this;

    _classCallCheck(this, GscapeOwlTranslator);

    _this = _super.call(this);
    _this.collapsible = true;
    _this.hiddenDefault = true;
    _this.owl_text = '';
    return _this;
  }

  _createClass(GscapeOwlTranslator, [{
    key: "render",
    value: function render() {
      return html$1(_templateObject2$c());
    }
  }, {
    key: "updated",
    value: function updated() {
      this.shadowRoot.querySelector('.owl-text').innerHTML = this.owl_text;
    } // override

  }, {
    key: "blur",
    value: function blur() {
      this.hide();
    }
  }]);

  return GscapeOwlTranslator;
}(GscapeWidget);
customElements.define('gscape-owl-translator', GscapeOwlTranslator);

function _templateObject2$d() {
  var data = _taggedTemplateLiteral(["\n      ", "\n      <div id=\"hr\"></div>\n      ", "\n    "]);

  _templateObject2$d = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject$d() {
  var data = _taggedTemplateLiteral(["\n        :host {\n          position: absolute;\n          bottom:52px;\n          right:10px;\n        }\n\n        gscape-button{\n          position: static;\n          box-shadow: initial;\n        }\n\n        #hr {\n          height:1px;\n          width:90%;\n          margin: 2px auto 0 auto;\n          background-color: var(--theme-gscape-shadows, ", ")\n        }\n\n      "]);

  _templateObject$d = function _templateObject() {
    return data;
  };

  return data;
}

var GscapeZoomTools = /*#__PURE__*/function (_GscapeWidget) {
  _inherits(GscapeZoomTools, _GscapeWidget);

  var _super = _createSuper(GscapeZoomTools);

  _createClass(GscapeZoomTools, null, [{
    key: "styles",
    get: function get() {
      var super_styles = _get(_getPrototypeOf(GscapeZoomTools), "styles", this);

      var colors = super_styles[1];
      return [super_styles[0], css(_templateObject$d(), colors.shadows)];
    }
  }]);

  function GscapeZoomTools() {
    var _this;

    _classCallCheck(this, GscapeZoomTools);

    _this = _super.call(this);
    _this.btn_plus = new GscapeButton('add');
    _this.btn_minus = new GscapeButton('remove');
    _this._onZoomIn = null;
    _this._onZoomOut = null;
    return _this;
  }

  _createClass(GscapeZoomTools, [{
    key: "render",
    value: function render() {
      return html$1(_templateObject2$d(), this.btn_plus, this.btn_minus);
    }
  }, {
    key: "onZoomIn",
    set: function set(f) {
      this._onZoomIn = f;
      this.btn_plus.onClick = this._onZoomIn;
    }
  }, {
    key: "onZoomOut",
    set: function set(f) {
      this._onZoomOut = f;
      this.btn_minus.onClick = this._onZoomOut;
    }
  }]);

  return GscapeZoomTools;
}(GscapeWidget);
customElements.define('gscape-zoom-tools', GscapeZoomTools);

function getGraphStyle(theme) {
  return [{
    selector: 'node',
    style: {
      'height': 'data(height)',
      'width': 'data(width)',
      'background-color': theme.node_bg,
      'shape': 'data(shape)',
      'border-width': 1,
      'border-color': theme.node_border,
      'border-style': 'solid',
      'font-size': 12,
      'color': theme.label_color
    }
  }, {
    selector: '[fontSize]',
    style: {
      'font-size': 'data(fontSize)'
    }
  }, {
    selector: 'node[displayed_name]',
    style: {
      'label': 'data(displayed_name)',
      'text-margin-x': 'data(labelXpos)',
      'text-margin-y': 'data(labelYpos)',
      'text-wrap': 'wrap',
      'min-zoomed-font-size': '5px'
    }
  }, {
    selector: 'edge',
    style: {
      'width': 2,
      'line-color': theme.edge,
      'target-arrow-color': theme.edge,
      'source-arrow-color': theme.edge,
      'curve-style': 'bezier',
      'arrow-scale': 1.3,
      'color': theme.label_color
    }
  }, {
    selector: 'edge[type = "inclusion"], [type = "membership"], edge.inclusion',
    style: {
      'line-style': 'solid',
      'target-arrow-shape': 'triangle',
      'target-arrow-fill': 'filled'
    }
  }, {
    selector: 'edge.hierarchy',
    style: {
      'width': 6,
      'target-arrow-fill': 'hollow'
    }
  }, {
    selector: 'edge.disjoint',
    style: {
      'target-arrow-fill': 'filled'
    }
  }, {
    selector: 'edge[type = "input"]',
    style: {
      'line-style': 'dashed',
      'target-arrow-shape': 'diamond',
      'target-arrow-fill': 'hollow'
    }
  }, {
    selector: 'edge[type = "easy_input"]',
    style: {
      'line-style': 'solid'
    }
  }, {
    selector: 'edge[type = "equivalence"]',
    style: {
      'line-style': 'solid',
      'source-arrow-shape': 'triangle',
      'source-arrow-fill': 'filled',
      'target-arrow-shape': 'triangle',
      'target-arrow-fill': 'filled'
    }
  }, {
    selector: '[segment_distances]',
    style: {
      'curve-style': 'segments',
      'segment-distances': 'data(segment_distances)',
      'segment-weights': 'data(segment_weights)',
      'edge-distances': 'node-position'
    }
  }, {
    selector: ':loop',
    style: {
      'control-point-step-size': 'data(control_point_step_size)',
      'control-point-weight': 0.5
    }
  }, {
    selector: '[source_endpoint]',
    style: {
      'source-endpoint': 'data(source_endpoint)'
    }
  }, {
    selector: '[target_endpoint]',
    style: {
      'target-endpoint': 'data(target_endpoint)'
    }
  }, {
    selector: '[?functional][!inverseFunctional]',
    style: {
      'border-width': 5,
      'border-color': theme.node_border,
      'border-style': 'double'
    }
  }, {
    selector: '[?inverseFunctional][!functional]',
    style: {
      'border-width': 4,
      'border-color': theme.node_border,
      'border-style': 'solid'
    }
  }, {
    selector: 'edge[displayed_name]',
    style: {
      'label': 'data(displayed_name)',
      'font-size': 10,
      'text-rotation': 'autorotate',
      'text-margin-y': -10
    }
  }, {
    selector: '[target_label]',
    style: {
      'target-label': 'data(target_label)'
    }
  }, {
    selector: '[source_label]',
    style: {
      'source-label': 'data(source_label)'
    }
  }, {
    selector: '[source_label],[target_label]',
    style: {
      'font-size': 15,
      'target-text-offset': 20
    }
  }, {
    selector: 'edge[displayed_name],[source_label],[target_label],[text_background]',
    style: {
      'text-background-color': theme.background,
      'text-background-opacity': 1,
      'text-background-shape': 'roundrectangle',
      'text-background-padding': 2
    }
  }, {
    selector: '[shape_points]',
    style: {
      'shape-polygon-points': 'data(shape_points)'
    }
  }, {
    selector: '.filtered',
    style: {
      'display': 'none'
    }
  }, {
    selector: '.facet',
    style: {
      'background-opacity': 0
    }
  }, {
    selector: '.hidden',
    style: {
      'visibility': 'hidden'
    }
  }, {
    selector: '.no_border',
    style: {
      'border-width': 0
    }
  }, {
    selector: '.no_overlay',
    style: {
      'overlay-opacity': 0,
      'overlay-padding': 0
    }
  }, {
    selector: '.concept',
    style: {
      'background-color': theme.concept,
      'border-color': theme.concept_dark
    }
  }, {
    selector: '.role, .fake-triangle',
    style: {
      'background-color': theme.role,
      'border-color': theme.role_dark
    }
  }, {
    selector: '.attribute',
    style: {
      'background-color': theme.attribute,
      'border-color': theme.attribute_dark,
      'text-background-color': theme.background,
      'text-background-opacity': 1
    }
  }, {
    selector: 'edge.role',
    style: {
      'line-color': theme.role_dark,
      'source-arrow-color': theme.role_dark,
      'target-arrow-color': theme.role_dark,
      'target-arrow-shape': 'square',
      'target-arrow-fill': 'filled',
      'source-arrow-shape': 'square',
      'source-arrow-fill': 'hollow'
    }
  }, {
    selector: 'edge.range',
    style: {
      'target-arrow-shape': 'square',
      'target-arrow-fill': 'filled',
      'source-arrow-shape': 'none'
    }
  }, {
    selector: 'edge.domain',
    style: {
      'target-arrow-shape': 'square',
      'target-arrow-fill': 'hollow',
      'source-arrow-shape': 'none'
    }
  }, {
    selector: 'edge.attribute',
    style: {
      'line-color': theme.attribute_dark,
      'source-arrow-shape': 'none',
      'target-arrow-shape': 'none'
    }
  }, {
    selector: '.bubble',
    style: {
      'text-margin-x': 0,
      'text-margin-y': 0,
      'text-valign': 'center',
      'text-halign': 'center',
      'shape': 'ellipse',
      'height': 'data(width)'
    }
  }, {
    selector: '.individual',
    style: {
      'background-color': theme.individual,
      'border-color': theme.individual_dark
    }
  }, {
    selector: '[type = "range-restriction"], [type = "disjoint-union"]',
    style: {
      'background-color': theme.node_bg_contrast
    }
  }, {
    selector: '.float:locked',
    style: {
      'border-color': theme.secondary,
      'border-width': '4px'
    }
  }, {
    // the right border part of functional && inverseFunctional roles
    selector: '.fake-triangle-right',
    style: {
      'background-color': theme.role_dark || 'black'
    }
  }, {
    selector: '[shape = "hexagon"],[type = "value-domain"], .facet',
    style: {
      'color': theme.node_bg_contrast
    }
  }, //-----------------------------------------------------------
  // selected selector always last
  {
    selector: ':selected',
    style: {
      'overlay-color': theme.secondary,
      'overlay-opacity': 0.2,
      'z-index': '100'
    }
  }];
}

var GrapholscapeRenderer = /*#__PURE__*/function () {
  function GrapholscapeRenderer() {
    var _this = this;

    var container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    _classCallCheck(this, GrapholscapeRenderer);

    this.actual_diagram = null;
    var cy_container = document.createElement('div');
    cy_container.style.width = '100%';
    cy_container.style.height = '100%';
    cy_container.style.position = 'relative';
    if (container) container.insertBefore(cy_container, container.firstChild);
    this.cy = cytoscape({
      container: cy_container,
      autoungrabify: true,
      wheelSensitivity: 0.4,
      maxZoom: 2.5,
      minZoom: 0.02,
      layout: {
        name: 'preset'
      }
    });
    this.cy.on('select', 'node', function (e) {
      var type = e.target.data('type');

      switch (type) {
        case 'intersection':
        case 'union':
        case 'disjoint-union':
          e.target.neighborhood().select();
          break;
      }

      e.target.select();

      _this.onNodeSelection(e.target.data('id_xml'), e.target.data('diagram_id'));
    });
    this.cy.on('select', 'edge', function (e) {
      _this.onEdgeSelection(e.target.data('id_xml'), e.target.data('diagram_id'));
    });
    this.cy.on('tap', function (evt) {
      if (evt.target === _this.cy) {
        _this.onBackgroundClick();
      }
    });
    this.cy.on('mouseover', '*', function (e) {
      _this.cy.container().style.cursor = 'pointer';
    });
    this.cy.on('mouseout', '*', function (e) {
      _this.cy.container().style.cursor = 'inherit';
    });
  }

  _createClass(GrapholscapeRenderer, [{
    key: "mount",
    value: function mount(container) {
      //container.insertBefore(this.cy.container(), container.firstChild)
      // force refresh
      this.cy.container().style.display = 'block'; //container.setAttribute('id', 'cy')
      //this.cy.mount(container)
    }
  }, {
    key: "unmount",
    value: function unmount() {
      this.cy.container().style.display = 'none'; //this.cy.container().parentElement.removeChild(this.cy.container())
      //this.cy.unmount()
    }
  }, {
    key: "centerOnNode",
    value: function centerOnNode(node_id, zoom) {
      var node = this.cy.getElementById(node_id);

      if (node) {
        this.centerOnPosition(node.position('x'), node.position('y'), zoom);
        this.cy.$(':selected').unselect();
        node.select();
      }
    }
  }, {
    key: "centerOnPosition",
    value: function centerOnPosition(x_pos, y_pos) {
      var zoom = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.cy.zoom();
      this.cy.reset();
      var offset_x = this.cy.width() / 2;
      var offset_y = this.cy.height() / 2;
      x_pos -= offset_x;
      y_pos -= offset_y;
      this.cy.pan({
        x: -x_pos,
        y: -y_pos
      });
      this.cy.zoom({
        level: zoom,
        renderedPosition: {
          x: offset_x,
          y: offset_y
        }
      });
    }
  }, {
    key: "centerOnRenderedPosition",
    value: function centerOnRenderedPosition(x_pos, y_pos) {
      var zoom = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.cy.zoom();
      this.cy.viewport({
        zoom: zoom,
        pan: {
          x: x_pos,
          y: y_pos
        }
      });
    }
  }, {
    key: "resetView",
    value: function resetView() {
      this.cy.fit();
    }
  }, {
    key: "drawDiagram",
    value: function drawDiagram(diagram) {
      this.cy.remove('*');
      this.cy.add(diagram.nodes);
      this.cy.add(diagram.edges);
      this.cy.fit();
      this.actual_diagram = diagram.id;
    }
  }, {
    key: "zoomIn",
    value: function zoomIn() {
      this.cy.zoom({
        level: this.cy.zoom() + 0.08,
        renderedPosition: {
          x: this.cy.width() / 2,
          y: this.cy.height() / 2
        }
      });
    }
  }, {
    key: "zoomOut",
    value: function zoomOut() {
      this.cy.zoom({
        level: this.cy.zoom() - 0.08,
        renderedPosition: {
          x: this.cy.width() / 2,
          y: this.cy.height() / 2
        }
      });
    }
  }, {
    key: "filter",
    value: function filter(_filter, cy_instance) {
      var _this2 = this;

      var cy = cy_instance || this.cy;
      var selector = "".concat(_filter.selector, ", .").concat(_filter["class"]);
      cy.$(selector).forEach(function (element) {
        _this2.filterElem(element, _filter["class"], cy);
      });
    }
  }, {
    key: "filterElem",
    value: function filterElem(element, filter_class, cy_instance) {
      var _this3 = this;

      var cy = cy_instance || this.cy;
      element.addClass('filtered ' + filter_class); // Filter fake nodes!

      cy.nodes("[parent_node_id = \"".concat(element.id(), "\"]")).addClass('filtered ' + filter_class); // ARCHI IN USCITA
      //var selector = `[source = "${element.data('id')}"]`

      element.outgoers('edge').forEach(function (e) {
        var neighbour = e.target(); // if inclusion[IN] + equivalence[IN] + all[OUT] == 0 => filter!!

        var number_edges_in_out = getNumberEdgesInOut(neighbour);

        if (!e.target().hasClass('filtered') && (number_edges_in_out <= 0 || e.data('type') === 'input')) {
          _this3.filterElem(e.target(), filter_class, cy);
        }
      }); // ARCHI IN ENTRATA

      element.incomers('edge').forEach(function (e) {
        var neighbour = e.source(); // if Isa[IN] + equivalence[IN] + all[OUT] == 0 => filter!!

        var number_edges_in_out = getNumberEdgesInOut(neighbour);

        if (!e.source().hasClass('filtered') && number_edges_in_out === 0) {
          _this3.filterElem(e.source(), filter_class, cy);
        }
      });

      function getNumberEdgesInOut(neighbour) {
        var count = neighbour.outgoers('edge').size() + neighbour.incomers('edge[type != "input"]').size();
        neighbour.outgoers().forEach(function (e) {
          if (e.target().hasClass('filtered')) {
            count--;
          }
        });
        neighbour.incomers('[type != "input"]').forEach(function (e) {
          if (e.source().hasClass('filtered')) {
            count--;
          }
        });
        return count;
      }
    }
  }, {
    key: "unfilter",
    value: function unfilter(filter, cy_instance) {
      var selector = "".concat(filter.selector, ", .").concat(filter["class"]);
      var cy = cy_instance || this.cy;
      cy.$(selector).removeClass('filtered');
      cy.$(selector).removeClass(filter["class"]);
    }
  }, {
    key: "setTheme",
    value: function setTheme(theme) {
      this.theme = theme;
      this.cy.style(getGraphStyle(theme));
    }
  }, {
    key: "getActualPosition",
    value: function getActualPosition() {
      return {
        x: this.cy.pan().x,
        y: this.cy.pan().y,
        zoom: this.cy.zoom()
      };
    }
  }]);

  return GrapholscapeRenderer;
}();

var LiteGscapeRenderer = /*#__PURE__*/function (_GrapholscapeRenderer) {
  _inherits(LiteGscapeRenderer, _GrapholscapeRenderer);

  var _super = _createSuper(LiteGscapeRenderer);

  function LiteGscapeRenderer(container) {
    _classCallCheck(this, LiteGscapeRenderer);

    return _super.call(this, container);
  }

  _createClass(LiteGscapeRenderer, [{
    key: "drawDiagram",
    value: function drawDiagram(diagram) {
      _get(_getPrototypeOf(LiteGscapeRenderer.prototype), "drawDiagram", this).call(this, diagram);

      this.cy.autoungrabify(false);
      this.cy.nodes().lock();
      this.cy.nodes('.repositioned').unlock();
      var layout = this.cy.$('.repositioned').closedNeighborhood().closedNeighborhood().layout({
        name: 'cola',
        randomize: false,
        fit: false,
        refresh: 3,
        maxSimulationTime: 8000,
        convergenceThreshold: 0.0000001
      });
      layout.run();
    }
  }]);

  return LiteGscapeRenderer;
}(GrapholscapeRenderer);

var FloatingGscapeRenderer = /*#__PURE__*/function (_GrapholscapeRenderer) {
  _inherits(FloatingGscapeRenderer, _GrapholscapeRenderer);

  var _super = _createSuper(FloatingGscapeRenderer);

  function FloatingGscapeRenderer(container) {
    var _this;

    _classCallCheck(this, FloatingGscapeRenderer);

    _this = _super.call(this, container);
    _this.cy.style.textureOnViewport = true;

    _this.cy.autoungrabify(false);

    _this.layoutStopped = false;
    _this.dragAndPin = false;

    _this.cy.on('grab', function (e) {
      e.target.data('old_pos', JSON.stringify(e.target.position()));
    });

    _this.cy.on('free', function (e) {
      var actual_pos = JSON.stringify(e.target.position());

      if (_this.dragAndPin && e.target.data('old_pos') !== actual_pos) {
        _this.lockNode(e.target);
      }

      e.target.removeData('old_pos');
    });

    return _this;
  }

  _createClass(FloatingGscapeRenderer, [{
    key: "drawDiagram",
    value: function drawDiagram(diagram) {
      this.clearPoppers();

      _get(_getPrototypeOf(FloatingGscapeRenderer.prototype), "drawDiagram", this).call(this, diagram);

      this.cy.nodes().addClass('float');
      this.main_layout = this.layout(); // apply layout on those not locked

      this.main_layout.run();
    }
  }, {
    key: "centerOnNode",
    value: function centerOnNode(node_id, zoom) {
      var _this2 = this;

      var node = this.cy.$id(node_id);

      if (node) {
        this.cy.$(':selected').unselect();

        if (node.data('type') == 'role') {
          var elems = node.connectedNodes();
          setTimeout(function () {
            return _this2.cy.fit(elems);
          }, 300);
          node.select();
          elems.select();
        } else {
          setTimeout(function () {
            return _this2.centerOnPosition(node.position('x'), node.position('y'), zoom);
          }, 300);
          node.select();
        }
      }
    }
  }, {
    key: "layout",
    value: function layout() {
      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ':unlocked';
      return this.cy.$(selector).layout(this.layout_settings);
    }
  }, {
    key: "unlockNode",
    value: function unlockNode(node) {
      node.unlockButton.destroy();
      node.unlock();
    }
  }, {
    key: "lockNode",
    value: function lockNode(node) {
      var _this3 = this;

      node.lock();
      var unlockButton = node.popper({
        content: function content() {
          var dimension = node.data('width') / 9 * _this3.cy.zoom();

          var div = document.createElement('div');
          div.style.background = node.style('border-color');
          div.style.borderRadius = '100%';
          div.style.padding = '5px';
          div.style.color = _this3.theme.on_secondary;
          div.style.cursor = 'pointer';
          div.setAttribute('title', 'Unlock Node');
          div.innerHTML = "<mwc-icon>lock_open</mwc_icon>";
          setStyle(dimension, div);

          div.onclick = function () {
            return _this3.unlockNode(node);
          };

          document.body.appendChild(div);
          return div;
        } //popper: {} // my popper options here

      });
      node.unlockButton = unlockButton;

      var update = function update() {
        var dimension = node.data('width') / 9 * _this3.cy.zoom();

        setStyle(dimension, unlockButton.popper);
        unlockButton.scheduleUpdate();
      };

      node.on('position', update);
      this.cy.on('pan zoom resize', update);

      function setStyle(dim, div) {
        var icon = div.querySelector('mwc-icon');

        if (dim > 2) {
          if (dim < 8) {
            icon.style.display = 'none';
          } else {
            icon.style.display = 'inline';
            icon.style.fontSize = dim + 'px';
          }

          div.style.width = dim + 'px';
          div.style.height = dim + 'px';
          div.style.display = 'flex';
        } else {
          icon.style.display = 'none';
          div.style.display = 'none';
        }
      }
    }
  }, {
    key: "clearPoppers",
    value: function clearPoppers() {
      this.cy.nodes().each(function (node) {
        if (node.unlockButton) node.unlockButton.destroy();
      });
    }
  }, {
    key: "unmount",
    value: function unmount() {
      _get(_getPrototypeOf(FloatingGscapeRenderer.prototype), "unmount", this).call(this);

      this.clearPoppers();
    }
  }, {
    key: "layout_settings",
    get: function get() {
      return {
        name: 'cola',
        avoidOverlap: true,
        edgeLength: function edgeLength(edge) {
          if (edge.hasClass('role')) {
            return 300 + edge.data('displayed_name').length * 4;
          } else if (edge.target().data('type') == 'attribute' || edge.source().data('type') == 'attribute') return 150;else return 250;
        },
        fit: false,
        infinite: !this.layoutStopped,
        handleDisconnected: true,
        // if true, avoids disconnected components from overlapping
        convergenceThreshold: 0.000000001
      };
    }
  }, {
    key: "layoutStopped",
    set: function set(isStopped) {
      this._layoutStopped = isStopped;

      if (this.main_layout) {
        this.main_layout.options.infinite = !isStopped;
        isStopped ? this.main_layout.stop() : this.main_layout.run();
      }
    },
    get: function get() {
      return this._layoutStopped;
    }
  }, {
    key: "dragAndPin",
    set: function set(active) {
      var _this4 = this;

      this._dragAndPin = active;
      if (!active) this.cy.$(':locked').each(function (node) {
        return _this4.unlockNode(node);
      });
    },
    get: function get() {
      return this._dragAndPin;
    }
  }]);

  return FloatingGscapeRenderer;
}(GrapholscapeRenderer);

function _templateObject$e() {
  var data = _taggedTemplateLiteral(["<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n  viewBox=\"0 0 12 12\" fill=\"currentColor\" xml:space=\"preserve\">\n<path id=\"path847\" d=\"M5.4,11.9c-1.4-0.1-2.7-0.8-3.8-1.8c-0.8-0.8-1.3-1.8-1.6-3C0.1,6.8,0.1,6.7,0.1,6c0-0.7,0-0.8,0.1-1.1\n c0.3-1.2,0.8-2.3,1.7-3.1C2.3,1.3,2.7,1,3.3,0.7c1.7-0.9,3.8-0.9,5.5,0c2.4,1.3,3.6,3.9,3.1,6.5c-0.6,2.6-2.8,4.5-5.5,4.7\n C5.8,12,5.8,12,5.4,11.9L5.4,11.9z M6.5,10.5c0.2-0.1,0.3-0.1,0.8-0.7c0.3-0.3,1.2-1.2,2-1.9c1.1-1.1,1.3-1.4,1.4-1.5\n c0.2-0.4,0.2-0.7,0-1.1c-0.1-0.2-0.2-0.3-1-1.1c-1-1-1.1-1-1.6-1c-0.5,0-0.5,0-1.9,1.4C5.5,5.2,5,5.8,5,5.8c0,0,0.2,0.3,0.5,0.6\n L6,6.9l1-1l1-1l0.5,0.5l0.5,0.5L7.6,7.4L6,8.9L4.5,7.4L2.9,5.8L5,3.7c1.1-1.1,2.1-2.1,2.1-2.1c0-0.1-1-1-1-1c0,0-1,1-2.3,2.2\n c-2,2-2.3,2.3-2.3,2.4C1.3,5.5,1.3,5.7,1.3,6c0.1,0.4,0,0.4,2.1,2.4c1.1,1.1,1.9,1.9,2,2C5.7,10.6,6.1,10.6,6.5,10.5z\"/>\n</svg>"]);

  _templateObject$e = function _templateObject() {
    return data;
  };

  return data;
}
var graphol = html$1(_templateObject$e());

function _templateObject4$5() {
  var data = _taggedTemplateLiteral(["<mwc-icon>", "</mwc-icon>"]);

  _templateObject4$5 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3$9() {
  var data = _taggedTemplateLiteral(["\n        <div\n          @click=\"", "\"\n          mode=\"", "\"\n          class=\"renderer-item ", "\"\n        >\n        ", "\n        <span>", "</span>\n        </div>\n        "]);

  _templateObject3$9 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2$e() {
  var data = _taggedTemplateLiteral(["\n      <div class=\"widget-body hide\">\n        ", "\n      </div>\n\n      <gscape-head title=", "></gscape-head>\n    "]);

  _templateObject2$e = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject$f() {
  var data = _taggedTemplateLiteral(["\n        :host {\n          bottom:10px;\n          left: 136px;\n        }\n\n        .renderer-item {\n          cursor:pointer;\n          padding:5px 10px;\n          display: flex;\n          align-items: center;\n        }\n\n        .renderer-item:hover {\n          color: var(--theme-gscape-on-secondary, ", ");\n          background-color:var(--theme-gscape-secondary, ", ");\n        }\n\n        .renderer-item:first-of-type {\n          border-top-left-radius: inherit;\n          border-top-right-radius: inherit;\n        }\n\n        .selected {\n          background-color: var(--theme-gscape-primary-dark, ", ");\n          color: var(--theme-gscape-on-primary-dark, ", ");\n          font-weight: bold;\n        }\n\n        .widget-body {\n          margin:0;\n          border-top: none;\n          border-bottom: 1px solid var(--theme-gscape-shadows, ", ");\n          border-radius: inherit;\n          border-bottom-left-radius:0;\n          border-bottom-right-radius:0;\n        }\n\n        gscape-head {\n          --header-padding: 5px 8px;\n        }\n\n        mwc-icon {\n          padding-right:8px;\n        }\n\n        svg {\n          height: 20px;\n          width: auto;\n          padding: 2px;\n          margin-right:8px;\n        }\n      "]);

  _templateObject$f = function _templateObject() {
    return data;
  };

  return data;
}

var GscapeRenderSelector = /*#__PURE__*/function (_GscapeWidget) {
  _inherits(GscapeRenderSelector, _GscapeWidget);

  var _super = _createSuper(GscapeRenderSelector);

  _createClass(GscapeRenderSelector, null, [{
    key: "properties",
    get: function get() {
      return {
        actual_mode: {
          type: String
        }
      };
    }
  }, {
    key: "styles",
    get: function get() {
      var super_styles = _get(_getPrototypeOf(GscapeRenderSelector), "styles", this);

      var colors = super_styles[1];
      return [super_styles[0], css(_templateObject$f(), colors.on_secondary, colors.secondary, colors.primary_dark, colors.on_primary_dark, colors.shadows)];
    }
  }]);

  function GscapeRenderSelector(renderers) {
    var _this;

    _classCallCheck(this, GscapeRenderSelector);

    _this = _super.call(this);
    _this.collapsible = true;
    _this.renderers = renderers;
    _this.dict = {
      "default": {
        name: "Graphol",
        icon: ""
      },
      lite: {
        name: "Graphol-Lite",
        icon: 'flash_on'
      },
      "float": {
        name: "Floaty",
        icon: "bubble_chart"
      }
    };
    _this.actual_mode = 'default';
    _this._onRendererChange = {};
    return _this;
  }

  _createClass(GscapeRenderSelector, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return html$1(_templateObject2$e(), Object.keys(this.renderers).map(function (mode) {
        return html$1(_templateObject3$9(), _this2.changeRenderer, mode, mode == _this2.actual_mode ? "selected" : "", mode == 'default' ? graphol : html$1(_templateObject4$5(), _this2.dict[mode].icon), _this2.dict[mode].name);
      }), this.dict[this.actual_mode].name);
    }
  }, {
    key: "changeRenderer",
    value: function changeRenderer(e) {
      if (this.shadowRoot.querySelector('.selected')) this.shadowRoot.querySelector('.selected').classList.remove('selected');
      var target = e.currentTarget;
      target.classList.add('selected');
      var mode = target.getAttribute('mode');
      this.header.title = this.dict[mode].name;
      this.actual_mode = mode;

      this._onRendererChange(mode);
    }
  }, {
    key: "firstUpdated",
    value: function firstUpdated() {
      _get(_getPrototypeOf(GscapeRenderSelector.prototype), "firstUpdated", this).call(this); // invert header's dropdown icon behaviour


      this.header.invertIcons();
    }
  }, {
    key: "onRendererChange",
    set: function set(f) {
      this._onRendererChange = f;
    }
  }]);

  return GscapeRenderSelector;
}(GscapeWidget);
customElements.define('gscape-render-selection', GscapeRenderSelector);

function _templateObject2$f() {
  var data = _taggedTemplateLiteral(["\n      <!-- in case of body\n      <div class=\"widget-body hide\">\n      </div>\n      <gscape-head title=\"Layout Settings\" collapsed=\"true\" class=\"drag-handler\">\n        <span>\n          ", "\n          ", "\n        </span>\n      </gscape-head>\n      -->\n\n      <div class=\"wrapper\">\n        <span class=\"title\">Layout Settings</span>\n        <span class=\"toggles-wrapper\">\n          ", "\n          ", "\n        </span>\n      </div>\n\n    "]);

  _templateObject2$f = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject$g() {
  var data = _taggedTemplateLiteral(["\n        :host {\n          left: 50%;\n          bottom: 10px;\n          transform: translate(-50%, 0);\n        }\n\n        gscape-head span {\n          display: flex;\n        }\n\n        .widget-body {\n          margin:0;\n          border-top: none;\n          border-bottom: 1px solid var(--theme-gscape-shadows, ", ");\n          border-radius: inherit;\n          border-bottom-left-radius:0;\n          border-bottom-right-radius:0;\n        }\n\n        gscape-head {\n          --header-padding: 5px 8px;\n          --title-padding: 0 30px 0 0;\n          --btn-padding: 0 0 0 10px;\n        }\n\n        gscape-toggle {\n          margin-left: 50px;\n        }\n\n        .wrapper {\n          display:flex;\n          align-items: center;\n          justify-content: space-between;\n          padding: 8px;\n        }\n\n        .title {\n          padding: 0 5px 0 0;\n          font-weight:bold;\n        }\n\n        .toggles-wrapper {\n          display: flex;\n        }\n      "]);

  _templateObject$g = function _templateObject() {
    return data;
  };

  return data;
}

var GscapeLayoutSettings = /*#__PURE__*/function (_GscapeWidget) {
  _inherits(GscapeLayoutSettings, _GscapeWidget);

  var _super = _createSuper(GscapeLayoutSettings);

  _createClass(GscapeLayoutSettings, null, [{
    key: "properties",
    get: function get() {
      return {};
    }
  }, {
    key: "styles",
    get: function get() {
      var super_styles = _get(_getPrototypeOf(GscapeLayoutSettings), "styles", this);

      var colors = super_styles[1];
      return [super_styles[0], css(_templateObject$g(), colors.shadows)];
    }
  }]);

  function GscapeLayoutSettings() {
    var _this;

    _classCallCheck(this, GscapeLayoutSettings);

    _this = _super.call(this);
    _this.collapsible = false;
    _this.onLayoutRunToggle = {};
    _this.onDragAndPinToggle = {};
    return _this;
  }

  _createClass(GscapeLayoutSettings, [{
    key: "render",
    value: function render() {
      return html$1(_templateObject2$f(), new GscapeToggle('layout-run', true, false, 'Layout Running', this.onLayoutRunToggle), new GscapeToggle('layout-pin', false, false, 'Drag and Pin', this.onDragAndPinToggle), new GscapeToggle('layout-run', true, false, 'Layout Running', this.onLayoutRunToggle), new GscapeToggle('layout-pin', false, false, 'Drag and Pin', this.onDragAndPinToggle));
    }
  }]);

  return GscapeLayoutSettings;
}(GscapeWidget);
customElements.define('gscape-layout-settings', GscapeLayoutSettings);

function _templateObject$h() {
  var data = _taggedTemplateLiteral(["<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<svg version=\"1.1\" id=\"Livello_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\t viewBox=\"0 0 1024 792.6\" style=\"enable-background:new 0 0 1024 792.6;\" xml:space=\"preserve\">\n<style type=\"text/css\">\n\t.st0{fill:url(#SVGID_1_);}\n\t.st1{fill:#FFFFFF;}\n\t.st2{enable-background:new    ;}\n\t.st3{fill:url(#SVGID_2_);}\n</style>\n<g>\n\t<g id=\"Logo\">\n\n\t\t\t<radialGradient id=\"SVGID_1_\" cx=\"502.1\" cy=\"894.61\" r=\"662.91\" gradientTransform=\"matrix(1 0 0 1 12.76 -283.3)\" gradientUnits=\"userSpaceOnUse\">\n\t\t\t<stop  offset=\"0\" style=\"stop-color:#5B86E5\"/>\n\t\t\t<stop  offset=\"0.34\" style=\"stop-color:#509CE2\"/>\n\t\t\t<stop  offset=\"1\" style=\"stop-color:#36D1DC\"/>\n\t\t</radialGradient>\n\t\t<path class=\"st0\" d=\"M512,506c-138.1,0-250-111.9-250-250c0-66.3,26.3-129.9,73.2-176.8c97.6-97.6,256-97.6,353.6,0\n\t\t\ts97.6,256,0,353.6C642,479.8,578.3,506.2,512,506z\"/>\n\t\t<path class=\"st1\" d=\"M512,11.9c134.8,0,244.1,109.3,244.1,244.2c0,98.1-58.7,186.6-149.1,224.8c-124.2,52.5-267.4-5.7-319.9-129.9\n\t\t\tS292.8,83.6,417,31.1C447.1,18.4,479.4,11.9,512,11.9 M512,0C370.6,0,256,114.6,256,256s114.6,256,256,256s256-114.6,256-256\n\t\t\tS653.4,0,512,0z\"/>\n\t\t<path class=\"st1\" d=\"M513.6,432c-12.4,0-24.4-4.9-33.1-13.7L344.1,282c-18.3-18.3-18.3-48,0-66.3L513.6,46.2l40.3,40.3\n\t\t\tL391.6,248.8l122,122l122-122L594.7,208l-81.2,81.1l-40.3-40.3l88.3-88.3c18.3-18.3,48-18.3,66.3,0l55.2,55.2\n\t\t\tc18.3,18.3,18.3,48,0,66.3L546.7,418.3C537.9,427.1,526,432,513.6,432z\"/>\n\t\t<g class=\"st2\">\n\t\t\t<path d=\"M83,594.8c5.3,0,10.2,0.3,14.7,0.8s8.9,1.3,13.1,2.2c4.2,1,8.2,2.1,12.1,3.5s7.9,2.9,11.9,4.5v12.6\n\t\t\t\tc-3.2-2-6.5-3.9-10.1-5.7s-7.4-3.3-11.6-4.7c-4.1-1.3-8.6-2.4-13.3-3.2c-4.7-0.8-9.8-1.2-15.3-1.2c-11.1,0-20.8,1.2-29.1,3.5\n\t\t\t\ts-15.2,5.7-20.6,10c-5.5,4.3-9.6,9.6-12.4,15.8c-2.7,6.2-4.1,13.2-4.1,21c0,7.3,1.3,14,4,20.1s6.8,11.4,12.2,15.8\n\t\t\t\tc5.5,4.4,12.3,7.9,20.5,10.4s17.8,3.7,28.9,3.7c4.3,0,8.6-0.2,12.9-0.5c4.2-0.3,8.3-0.8,12-1.3c3.8-0.5,7.2-1.1,10.3-1.7\n\t\t\t\tc3.1-0.6,5.7-1.3,7.9-2V664H80.7v-9.7h56.9v50.3c-4.1,1.4-8.3,2.7-12.4,3.8c-4.2,1.1-8.5,2-13,2.8c-4.5,0.7-9.1,1.3-13.9,1.7\n\t\t\t\ts-9.8,0.6-15.1,0.6c-10.8,0-20.7-1.2-30-3.6c-9.2-2.4-17.2-6.1-23.9-11s-12-11.1-15.9-18.5c-3.8-7.4-5.7-16.2-5.7-26.2\n\t\t\t\tc0-6.7,0.9-12.8,2.7-18.3s4.3-10.5,7.5-14.9s7.2-8.3,11.7-11.5c4.6-3.3,9.7-6,15.2-8.1c5.6-2.1,11.6-3.7,18-4.8\n\t\t\t\tC69.3,595.3,76,594.8,83,594.8z\"/>\n\t\t\t<path d=\"M181.2,662.2v48.9h-10.4V596.8h56.9c8.7,0,16.2,0.7,22.4,2c6.2,1.4,11.3,3.4,15.3,6.2c4,2.7,6.9,6.2,8.7,10.3\n\t\t\t\tc1.8,4.1,2.7,8.9,2.7,14.4c0,8.5-2.2,15.4-6.7,20.5s-11.7,8.6-21.7,10.5l39,50.4h-13.1l-36.9-49.3c-1.6,0.1-3.1,0.2-4.7,0.2\n\t\t\t\tc-1.6,0.1-3.3,0.1-5,0.1L181.2,662.2L181.2,662.2z M266.1,629.7c0-4.9-0.9-8.8-2.6-11.9c-1.7-3-4.5-5.4-8.4-7s-9-2.8-15.3-3.4\n\t\t\t\tc-6.3-0.6-14-0.9-23.2-0.9h-35.5v45.9h35.1c9.2,0,16.9-0.3,23.2-0.8s11.5-1.6,15.4-3.2c3.9-1.6,6.8-3.9,8.5-6.9\n\t\t\t\tC265.3,638.6,266.1,634.6,266.1,629.7z\"/>\n\t\t\t<path d=\"M417.4,711.2L401.7,681h-77.6l-15.7,30.2H297l59.8-114.3H369l59.8,114.3H417.4z M362.9,606.9l-33.8,64.6h67.5\n\t\t\t\tL362.9,606.9z\"/>\n\t\t\t<path d=\"M562.8,632c0,5.7-0.9,10.8-2.8,15.1c-1.9,4.4-4.8,8.1-8.8,11.1s-9.1,5.3-15.4,6.8c-6.3,1.5-13.9,2.3-22.8,2.3h-51.3v43.9\n\t\t\t\th-10.4V596.8H513c8.9,0,16.5,0.8,22.8,2.3s11.4,3.8,15.4,6.7s6.9,6.6,8.8,11C561.8,621.2,562.8,626.2,562.8,632z M552.1,632\n\t\t\t\tc0-5.4-0.9-9.8-2.7-13.1s-4.6-5.9-8.3-7.7s-8.5-3-14.2-3.6s-12.6-0.9-20.4-0.9h-44.7v50.9h44.7c3.1,0,6.3,0,9.8,0\n\t\t\t\ts6.9-0.1,10.3-0.5c3.4-0.4,6.6-1,9.7-1.9s5.8-2.3,8.2-4.2s4.2-4.4,5.7-7.4C551.4,640.5,552.1,636.6,552.1,632z\"/>\n\t\t\t<path d=\"M703.6,711.2v-55.6H601.2v55.6h-10.4V596.8h10.4v49.3h102.4v-49.3H714v114.3h-10.4V711.2z\"/>\n\t\t\t<path d=\"M889.7,654.1c0,10.3-1.9,19.1-5.6,26.6c-3.7,7.5-8.8,13.6-15.3,18.5s-14.1,8.4-23,10.8s-18.3,3.5-28.5,3.5\n\t\t\t\tc-10.3,0-19.8-1.2-28.7-3.5s-16.6-5.9-23.1-10.8c-6.5-4.9-11.7-11-15.4-18.5s-5.6-16.3-5.6-26.6c0-6.8,0.9-13,2.6-18.6\n\t\t\t\tc1.7-5.6,4.1-10.6,7.2-15c3.1-4.4,6.9-8.2,11.3-11.4c4.4-3.2,9.3-5.9,14.7-8s11.2-3.7,17.4-4.7s12.7-1.5,19.5-1.5\n\t\t\t\tc10.2,0,19.7,1.2,28.5,3.5s16.5,5.9,23,10.8c6.5,4.9,11.6,11,15.3,18.5C887.8,635,889.7,643.8,889.7,654.1z M879,654.1\n\t\t\t\tc0-8.1-1.3-15.3-4-21.5c-2.6-6.2-6.5-11.4-11.7-15.7c-5.2-4.2-11.6-7.5-19.3-9.7s-16.6-3.3-26.8-3.3s-19.1,1.1-26.9,3.3\n\t\t\t\tc-7.7,2.2-14.2,5.5-19.4,9.7s-9.2,9.5-11.8,15.7s-4,13.4-4,21.3c0,8.1,1.3,15.3,4,21.5s6.6,11.4,11.8,15.7\n\t\t\t\tc5.2,4.2,11.7,7.5,19.4,9.7s16.7,3.3,26.9,3.3s19.1-1.1,26.8-3.3s14.1-5.4,19.3-9.7c5.2-4.2,9.1-9.5,11.7-15.7\n\t\t\t\tC877.7,669.3,879,662.2,879,654.1z\"/>\n\t\t\t<path d=\"M920.2,711.2V596.8h10.4v104.6h83.5v9.7h-93.9V711.2z\"/>\n\t\t</g>\n\n\t\t\t<radialGradient id=\"SVGID_2_\" cx=\"513.05\" cy=\"1101.48\" r=\"466.86\" gradientTransform=\"matrix(1 0 0 1 0 -286)\" gradientUnits=\"userSpaceOnUse\">\n\t\t\t<stop  offset=\"0\" style=\"stop-color:#5B86E5\"/>\n\t\t\t<stop  offset=\"0.34\" style=\"stop-color:#509CE2\"/>\n\t\t\t<stop  offset=\"1\" style=\"stop-color:#36D1DC\"/>\n\t\t</radialGradient>\n\t\t<path class=\"st3\" d=\"M389.9,700.8h244.3c16.8,0,30.4,13.6,30.4,30.4v27.4c0,16.8-13.6,30.4-30.4,30.4H389.9\n\t\t\tc-16.8,0-30.4-13.6-30.4-30.4v-27.4C359.4,714.4,373,700.8,389.9,700.8L389.9,700.8L389.9,700.8z\"/>\n\t\t<path class=\"st1\" d=\"M634.2,704.3c14.8,0,26.8,12,26.8,26.9v27.4c0,14.8-12,26.9-26.9,26.9l0,0H389.9c-14.8,0-26.9-12-26.9-26.9\n\t\t\tv-27.4c0-14.8,12-26.9,26.9-26.9l0,0H634.2 M634.2,697.2H389.9c-18.8,0-34,15.2-34,34v27.4c0,18.8,15.2,34,34,34h244.3\n\t\t\tc18.8,0,34-15.2,34-34v-27.4C668.2,712.4,652.9,697.2,634.2,697.2L634.2,697.2z\"/>\n\t\t<g class=\"st2\">\n\t\t\t<path class=\"st1\" d=\"M385,764.8c-3.7-0.9-6.6-2-8.6-3.3l3-4c2.1,1.2,4.7,2.2,7.8,3c3.1,0.8,6.4,1.2,9.8,1.2\n\t\t\t\tc4.5,0,7.9-0.5,10.1-1.6c2.2-1.1,3.3-2.6,3.3-4.5c0-1.4-0.6-2.4-1.8-3.2c-1.2-0.8-2.7-1.4-4.5-1.8c-1.8-0.4-4.2-0.8-7.3-1.2\n\t\t\t\tc-4-0.6-7.3-1.1-9.7-1.7c-2.5-0.6-4.5-1.6-6.3-3c-1.7-1.4-2.6-3.4-2.6-5.9c0-3.1,1.7-5.7,5.2-7.7c3.5-2,8.3-3,14.4-3\n\t\t\t\tc3.2,0,6.4,0.3,9.6,1c3.2,0.6,5.9,1.5,7.9,2.5l-2.9,4c-4.1-2.1-9-3.2-14.6-3.2c-4.3,0-7.5,0.6-9.7,1.7c-2.2,1.1-3.3,2.6-3.3,4.5\n\t\t\t\tc0,1.4,0.6,2.6,1.8,3.4c1.2,0.9,2.8,1.5,4.6,1.9c1.8,0.4,4.3,0.8,7.6,1.2c4,0.6,7.1,1.1,9.5,1.7c2.4,0.6,4.4,1.5,6.1,2.9\n\t\t\t\ts2.5,3.3,2.5,5.7c0,3.3-1.8,5.9-5.4,7.8c-3.6,1.9-8.6,2.9-15.1,2.9C392.6,766.1,388.7,765.7,385,764.8z\"/>\n\t\t\t<path class=\"st1\" d=\"M436.9,763.7c-3.9-1.6-6.9-3.9-9.1-6.8c-2.2-2.9-3.3-6.2-3.3-9.8c0-3.6,1.1-6.9,3.3-9.8\n\t\t\t\tc2.2-2.9,5.2-5.1,9.1-6.7c3.9-1.6,8.3-2.4,13.2-2.4c4.3,0,8.1,0.6,11.5,1.9c3.4,1.3,6,3.1,8,5.5l-5,2.6c-1.6-1.8-3.7-3.2-6.2-4.2\n\t\t\t\tc-2.5-0.9-5.3-1.4-8.2-1.4c-3.6,0-6.8,0.6-9.7,1.8c-2.9,1.2-5.1,2.9-6.7,5.1s-2.4,4.8-2.4,7.6c0,2.9,0.8,5.4,2.4,7.6\n\t\t\t\tc1.6,2.2,3.8,3.9,6.7,5.1c2.9,1.2,6.1,1.8,9.7,1.8c3,0,5.7-0.4,8.2-1.3c2.5-0.9,4.6-2.3,6.2-4.1l5,2.6c-2,2.4-4.6,4.2-8,5.5\n\t\t\t\tc-3.4,1.3-7.2,1.9-11.4,1.9C445.1,766.1,440.7,765.3,436.9,763.7z\"/>\n\t\t\t<path class=\"st1\" d=\"M514.9,731.8c3.5,2.4,5.2,6,5.2,10.8v23.1h-6.4v-5.8c-1.5,1.9-3.7,3.5-6.7,4.5c-2.9,1.1-6.4,1.6-10.4,1.6\n\t\t\t\tc-5.5,0-9.9-1-13.2-3c-3.3-2-4.9-4.6-4.9-7.9c0-3.2,1.5-5.7,4.6-7.7c3.1-1.9,7.9-2.9,14.6-2.9h15.8v-2.3c0-3.2-1.2-5.7-3.6-7.3\n\t\t\t\tc-2.4-1.7-5.9-2.5-10.5-2.5c-3.1,0-6.2,0.4-9.1,1.2c-2.9,0.8-5.4,1.9-7.5,3.2l-3-3.8c2.5-1.6,5.5-2.9,9.1-3.7\n\t\t\t\tc3.5-0.9,7.2-1.3,11.1-1.3C506.5,728.1,511.5,729.3,514.9,731.8z M507.4,760.2c2.7-1.3,4.7-3.2,6-5.6v-6.1h-15.6\n\t\t\t\tc-8.5,0-12.7,2.2-12.7,6.7c0,2.2,1.1,3.9,3.3,5.1c2.2,1.3,5.3,1.9,9.3,1.9C501.4,762.1,504.7,761.5,507.4,760.2z\"/>\n\t\t\t<path class=\"st1\" d=\"M576.6,730.5c3.8,1.6,6.7,3.8,8.9,6.7c2.1,2.9,3.2,6.2,3.2,9.9c0,3.7-1.1,7.1-3.2,9.9\n\t\t\t\tc-2.1,2.9-5.1,5.1-8.8,6.7c-3.7,1.6-8,2.4-12.7,2.4c-4,0-7.7-0.6-10.9-1.9c-3.2-1.3-5.9-3.1-8-5.5v20.8h-6.7v-51.1h6.4v7.4\n\t\t\t\tc2-2.5,4.7-4.4,8-5.7s7-2,11.2-2C568.6,728.1,572.8,728.9,576.6,730.5z M572.9,759.8c2.8-1.2,5.1-2.9,6.7-5.1\n\t\t\t\tc1.6-2.2,2.4-4.8,2.4-7.6s-0.8-5.4-2.4-7.6c-1.6-2.2-3.8-3.9-6.7-5.1c-2.8-1.2-6-1.8-9.4-1.8c-3.5,0-6.7,0.6-9.5,1.8\n\t\t\t\tc-2.8,1.2-5,2.9-6.6,5.1s-2.4,4.7-2.4,7.6s0.8,5.4,2.4,7.6c1.6,2.2,3.8,3.9,6.6,5.1s6,1.8,9.5,1.8\n\t\t\t\tC566.9,761.6,570.1,761,572.9,759.8z\"/>\n\t\t\t<path class=\"st1\" d=\"M645.6,748.6h-41.5c0.4,3.9,2.4,7,5.9,9.4c3.6,2.4,8.1,3.6,13.6,3.6c3.1,0,5.9-0.4,8.5-1.2\n\t\t\t\tc2.6-0.8,4.8-2,6.7-3.7l3.8,3.3c-2.2,2-5,3.5-8.3,4.5c-3.3,1-6.9,1.6-10.9,1.6c-5.1,0-9.6-0.8-13.6-2.5c-3.9-1.6-7-3.9-9.2-6.8\n\t\t\t\tc-2.2-2.9-3.3-6.2-3.3-9.8c0-3.6,1.1-6.9,3.2-9.8c2.1-2.9,5-5.1,8.7-6.7c3.7-1.6,7.8-2.4,12.4-2.4c4.6,0,8.7,0.8,12.4,2.4\n\t\t\t\tc3.7,1.6,6.5,3.8,8.6,6.7c2.1,2.9,3.1,6.1,3.1,9.8L645.6,748.6z M609.6,735.9c-3.2,2.3-5.1,5.3-5.5,9h35.2\n\t\t\t\tc-0.4-3.7-2.3-6.7-5.5-9c-3.2-2.3-7.3-3.4-12.1-3.4C616.8,732.5,612.8,733.6,609.6,735.9z\"/>\n\t\t</g>\n\t</g>\n</g>\n</svg>"]);

  _templateObject$h = function _templateObject() {
    return data;
  };

  return data;
}
var grapholscape = html$1(_templateObject$h());

function _templateObject10$1() {
  var data = _taggedTemplateLiteral([""]);

  _templateObject10$1 = function _templateObject10() {
    return data;
  };

  return data;
}

function _templateObject9$2() {
  var data = _taggedTemplateLiteral(["\n                ", "\n              "]);

  _templateObject9$2 = function _templateObject9() {
    return data;
  };

  return data;
}

function _templateObject8$3() {
  var data = _taggedTemplateLiteral([""]);

  _templateObject8$3 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7$3() {
  var data = _taggedTemplateLiteral(["<option value=\"", "\" ?selected=", ">", "</option>"]);

  _templateObject7$3 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6$3() {
  var data = _taggedTemplateLiteral(["\n                <div class=\"setting_obj\">\n                  <select area=\"", "\" id=\"", "\" @change=\"", "\">\n                    ", "\n                  </select>\n                </div>\n              "]);

  _templateObject6$3 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5$5() {
  var data = _taggedTemplateLiteral(["\n            <div class=\"setting\">\n              <div class=\"title-wrap\">\n                <div class=\"setting-title\">", "</div>\n                <div class=\"setting-label\">", "</div>\n              </div>\n            ", "\n\n            ", "\n            </div>\n          "]);

  _templateObject5$5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4$6() {
  var data = _taggedTemplateLiteral(["\n          <div class=\"area\">\n            <div class=\"area-title\">", "</div>\n\n        ", "\n        </div>\n        "]);

  _templateObject4$6 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3$a() {
  var data = _taggedTemplateLiteral([""]);

  _templateObject3$a = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2$g() {
  var data = _taggedTemplateLiteral(["\n      ", "\n\n      <div class=\"widget-body hide gscape-panel\">\n        <div class=\"gscape-panel-title\">Settings</div>\n\n        <div class=\"settings-wrapper\">\n\n      ", "\n\n        <div class=\"area\">\n          <div class=\"area-title\">About</div>\n          <div id=\"logo\">\n            ", "\n          </div>\n\n          <div id=\"version\">\n            <span>Version: </span>\n            <span>", "</span>\n          </div>\n        </div>\n      </div>\n    "]);

  _templateObject2$g = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject$i() {
  var data = _taggedTemplateLiteral(["\n        :host {\n          bottom:10px;\n          left: 94px;\n          padding-right:0;\n        }\n\n        gscape-button {\n          position: static;\n        }\n\n        .gscape-panel {\n          padding-right: 0;\n        }\n\n        .settings-wrapper {\n          overflow-y: auto;\n          scrollbar-width: inherit;\n          max-height: 420px;\n          overflow-x: hidden;\n          white-space: nowrap;\n          padding-right: 20px;\n        }\n\n        .area {\n          margin-bottom: 30px;\n        }\n\n        .area:last-of-type {\n          margin-bottom: 0;\n        }\n\n        .area-title {\n          font-weight: bold;\n          margin-bottom: 5px;\n          font-size: 105%;\n        }\n\n        .setting {\n          padding: 10px;\n          display: flex;\n          justify-content: space-between;\n          align-items: center;\n        }\n\n        .title-wrap {\n          margin-right: 50px;\n        }\n\n        .setting-label {\n          font-size : 12px;\n          opacity: 0.7;\n        }\n\n        #logo {\n          text-align:center;\n        }\n\n        #logo svg {\n          width: 40%;\n          height: auto;\n          margin: 20px 0;\n        }\n\n        #version {\n          text-align: center;\n          font-size: 14px;\n        }\n      "]);

  _templateObject$i = function _templateObject() {
    return data;
  };

  return data;
}

var GscapeSettings = /*#__PURE__*/function (_GscapeWidget) {
  _inherits(GscapeSettings, _GscapeWidget);

  var _super = _createSuper(GscapeSettings);

  _createClass(GscapeSettings, null, [{
    key: "styles",
    get: function get() {
      var super_styles = _get(_getPrototypeOf(GscapeSettings), "styles", this);

      var colors = super_styles[1];
      return [super_styles[0], css(_templateObject$i())];
    }
  }]);

  function GscapeSettings(settings) {
    var _this;

    _classCallCheck(this, GscapeSettings);

    _this = _super.call(this);
    _this.collapsible = true;
    _this.settings = settings;
    _this.btn = new GscapeButton('settings');
    _this.btn.onClick = _this.toggleBody.bind(_assertThisInitialized(_this));
    _this.callbacks = {};
    return _this;
  }

  _createClass(GscapeSettings, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return html$1(_templateObject2$g(), this.btn, Object.keys(this.settings).map(function (area_entry) {
        if (area_entry == 'default') return html$1(_templateObject3$a());
        var area = _this2.settings[area_entry];
        return html$1(_templateObject4$6(), capitalizeFirstLetter(area_entry), Object.keys(area).map(function (setting_entry) {
          var setting = area[setting_entry];
          return html$1(_templateObject5$5(), setting.title, setting.label, setting.type == 'list' ? html$1(_templateObject6$3(), area_entry, setting_entry, _this2.onListChange, setting.list.map(function (option) {
            if (option.value == '') return;
            var selected = option.value == setting.selected;
            return html$1(_templateObject7$3(), option.value, selected, option.label);
          })) : html$1(_templateObject8$3()), setting.type == 'boolean' ? html$1(_templateObject9$2(), new GscapeToggle(setting_entry, setting.enabled, false, '', _this2.onToggleChange.bind(_this2))) : html$1(_templateObject10$1()));
        }));
      }), grapholscape, "1.1.0");

      function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
    }
  }, {
    key: "onListChange",
    value: function onListChange(e) {
      var selection = e.target;
      var area = selection.getAttribute('area');
      this.settings[area][selection.id].selected = selection.value;
      this.callbacks[selection.id](selection.value);
    }
  }, {
    key: "onToggleChange",
    value: function onToggleChange(e) {
      var toggle = e.target;
      this.settings.widgets[toggle.id].enabled = toggle.checked;
      toggle.checked ? this.callbacks.widgetEnable(toggle.id) : this.callbacks.widgetDisable(toggle.id);
    }
  }, {
    key: "onEntityNameSelection",
    set: function set(foo) {
      this.callbacks.entity_name = foo;
    }
  }, {
    key: "onLanguageSelection",
    set: function set(foo) {
      this.callbacks.language = foo;
    }
  }, {
    key: "onThemeSelection",
    set: function set(foo) {
      this.callbacks.theme = foo;
    }
  }, {
    key: "onWidgetEnabled",
    set: function set(foo) {
      this.callbacks.widgetEnable = foo;
    }
  }, {
    key: "onWidgetDisabled",
    set: function set(foo) {
      this.callbacks.widgetDisable = foo;
    }
  }]);

  return GscapeSettings;
}(GscapeWidget);
customElements.define('gscape-settings', GscapeSettings);

function _templateObject2$h() {
  var data = _taggedTemplateLiteral(["<div class=\"loader\"></div>"]);

  _templateObject2$h = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject$j() {
  var data = _taggedTemplateLiteral(["\n      .loader {\n        border: 3px solid ", ";\n        border-radius: 50%;\n        border-top: 3px solid ", ";\n        width: 30px;\n        height: 30px;\n        -webkit-animation: spin 1s linear infinite; /* Safari */\n        animation: spin 1s linear infinite;\n        box-sizing: border-box;\n        position:absolute;\n        top:50%;\n        left: 50%;\n        margin-top: -15px;\n        margin-left: -15px;\n      }\n\n      /* Safari */\n      @-webkit-keyframes spin {\n        0% { -webkit-transform: rotate(0deg); }\n        100% { -webkit-transform: rotate(360deg); }\n      }\n\n      @keyframes spin {\n        0% { transform: rotate(0deg); }\n        100% { transform: rotate(360deg); }\n      }\n    "]);

  _templateObject$j = function _templateObject() {
    return data;
  };

  return data;
}

var GscapeSpinner = /*#__PURE__*/function (_LitElement) {
  _inherits(GscapeSpinner, _LitElement);

  var _super = _createSuper(GscapeSpinner);

  _createClass(GscapeSpinner, null, [{
    key: "styles",
    get: function get() {
      return css(_templateObject$j(), gscape.shadows, gscape.secondary);
    }
  }]);

  function GscapeSpinner() {
    _classCallCheck(this, GscapeSpinner);

    return _super.call(this);
  }

  _createClass(GscapeSpinner, [{
    key: "render",
    value: function render() {
      return html$1(_templateObject2$h());
    }
  }, {
    key: "hide",
    value: function hide() {
      this.style.display = 'none';
    }
  }, {
    key: "show",
    value: function show() {
      this.style.display = 'initial';
    }
  }]);

  return GscapeSpinner;
}(LitElement);
customElements.define('gscape-spinner', GscapeSpinner);

function _templateObject3$b() {
  var data = _taggedTemplateLiteral(["<p>", "</p>"]);

  _templateObject3$b = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2$i() {
  var data = _taggedTemplateLiteral(["\n    <gscape-head\n      title=\"", "\"\n      icon=\"close\"\n      class=\"", " drag-handler\">\n    </gscape-head>\n    <div class=\"widget-body ", "\">\n      ", "\n    </div>\n    "]);

  _templateObject2$i = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject$k() {
  var data = _taggedTemplateLiteral(["\n        :host {\n          top: 30%;\n          left: 50%;\n          max-width: 500px;\n          transform: translate(-50%, 0);\n        }\n\n        .widget-body {\n          padding : 10px;\n          width: initial;\n        }\n\n        .widget-body.error {\n          background : var(--theme-gscape-error, ", ");\n          color : var(--theme-gscape-on-error, ", ");\n        }\n\n        gscape-head {\n          --title-text-align : center;\n          --title-width : 100%;\n        }\n\n        gscape-head.error {\n          color : var(--theme-gscape-error, ", ");\n        }\n\n        gscape-head.warning {\n          color : var(--theme-gscape-warning, ", ");\n        }\n      "]);

  _templateObject$k = function _templateObject() {
    return data;
  };

  return data;
}

var GscapeDialog = /*#__PURE__*/function (_GscapeWidget) {
  _inherits(GscapeDialog, _GscapeWidget);

  var _super = _createSuper(GscapeDialog);

  _createClass(GscapeDialog, null, [{
    key: "properties",
    get: function get() {
      return {
        text: {
          type: Array
        },
        type: {
          type: String
        }
      };
    }
  }, {
    key: "styles",
    get: function get() {
      var super_styles = _get(_getPrototypeOf(GscapeDialog), "styles", this);

      var colors = super_styles[1];
      return [super_styles[0], css(_templateObject$k(), colors.error, colors.on_error, colors.error, colors.warning)];
    }
  }]);

  function GscapeDialog() {
    var _this;

    _classCallCheck(this, GscapeDialog);

    _this = _super.call(this);
    _this.draggable = true;
    _this.text = [];
    _this.type = 'error';
    return _this;
  }

  _createClass(GscapeDialog, [{
    key: "render",
    value: function render() {
      return html$1(_templateObject2$i(), this.type, this.type.toLowerCase(), this.type.toLowerCase(), this.text.map(function (text) {
        return html$1(_templateObject3$b(), text);
      }));
    } // override

  }, {
    key: "show",
    value: function show(type, message) {
      _get(_getPrototypeOf(GscapeDialog.prototype), "show", this).call(this);

      this.type = type;
      if (typeof message == 'string') this.text = [message];else this.text = message;
    }
  }, {
    key: "clickHandler",
    value: function clickHandler() {
      this.hide();

      this._onClick();
    }
  }, {
    key: "firstUpdated",
    value: function firstUpdated() {
      _get(_getPrototypeOf(GscapeDialog.prototype), "firstUpdated", this).call(this);

      this.hide();
      this.header.onClick = this.hide.bind(this);
    }
  }]);

  return GscapeDialog;
}(GscapeWidget);
customElements.define('gscape-dialog', GscapeDialog);

function _templateObject2$j() {
  var data = _taggedTemplateLiteral(["\n      <gscape-head title=\"Entity Occurrences\" class=\"drag-handler\"></gscape-head>\n      <div class=\"widget-body\">\n        ", "\n      </div>\n    "]);

  _templateObject2$j = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject$l() {
  var data = _taggedTemplateLiteral(["\n        :host {\n          top:50%;\n          transform: translate(0, -50%);\n          left:10px;\n        }\n\n        .widget-body {\n          max-height: 250px;\n        }\n\n        gscape-head {\n          --title-text-align: center;\n          --title-width: 100%;\n        }\n\n        .details_table {\n          margin:5px 0;\n        }\n      "]);

  _templateObject$l = function _templateObject() {
    return data;
  };

  return data;
}

var GscapeEntityOccurrences = /*#__PURE__*/function (_GscapeWidget) {
  _inherits(GscapeEntityOccurrences, _GscapeWidget);

  var _super = _createSuper(GscapeEntityOccurrences);

  _createClass(GscapeEntityOccurrences, null, [{
    key: "properties",
    get: function get() {
      return {
        occurrences: {
          type: Array
        }
      };
    }
  }, {
    key: "styles",
    get: function get() {
      var super_styles = _get(_getPrototypeOf(GscapeEntityOccurrences), "styles", this);

      var colors = super_styles[1];
      return [super_styles[0], css(_templateObject$l())];
    }
  }]);

  function GscapeEntityOccurrences() {
    var _this;

    _classCallCheck(this, GscapeEntityOccurrences);

    _this = _super.call(this);
    _this.draggable = true;
    _this.collapsible = true;
    _this.occurrences = [];
    _this.hiddenDefault = true;
    _this.onNodeNavigation = {};
    return _this;
  }

  _createClass(GscapeEntityOccurrences, [{
    key: "render",
    value: function render() {
      return html$1(_templateObject2$j(), entityOccurrencesTemplate(this.occurrences, this.handleNodeSelection));
    }
  }, {
    key: "handleNodeSelection",
    value: function handleNodeSelection(e) {
      var node_id = e.target.getAttribute('node_id');
      this.onNodeNavigation(node_id);
    }
  }, {
    key: "firstUpdated",
    value: function firstUpdated() {
      _get(_getPrototypeOf(GscapeEntityOccurrences.prototype), "firstUpdated", this).call(this);

      this.header.invertIcons();
    } //override

  }, {
    key: "blur",
    value: function blur() {
      this.hide();
    }
  }]);

  return GscapeEntityOccurrences;
}(GscapeWidget);
customElements.define('gscape-entity-occurrences', GscapeEntityOccurrences);

var GrapholscapeView = /*#__PURE__*/function () {
  function GrapholscapeView(container) {
    _classCallCheck(this, GrapholscapeView);

    this.container = container;
    this.graph_container = document.createElement('div');
    this.graph_container.style.width = '100%';
    this.graph_container.style.height = '100%';
    this.graph_container.style.position = 'relative';
    this.container.appendChild(this.graph_container);
    this.onEdgeSelection = {};
    this.onNodeSelection = {}; // this.filters = config.widgets.filters.filter_list

    this.renderers = {
      "default": new GrapholscapeRenderer(this.graph_container),
      lite: new LiteGscapeRenderer(this.graph_container),
      "float": new FloatingGscapeRenderer(this.graph_container)
    };
    this.setRenderer(this.renderers["default"]);
    this.container.requestFullscreen = this.container.requestFullscreen || this.container.mozRequestFullscreen || // Mozilla
    this.container.mozRequestFullScreen || // Mozilla older API use uppercase 'S'.
    this.container.webkitRequestFullscreen || // Webkit
    this.container.msRequestFullscreen; // IE

    document.cancelFullscreen = document.exitFullscreen || document.cancelFullscreen || document.mozCancelFullScreen || document.webkitCancelFullScreen || document.msExitFullscreen;
    this.spinner = new GscapeSpinner();
    this.container.appendChild(this.spinner);
    this.dialog = new GscapeDialog();
    this.container.appendChild(this.dialog);
  }

  _createClass(GrapholscapeView, [{
    key: "createUi",
    value: function createUi(ontology, diagrams, predicates, settings) {
      var _this = this;

      this.settings = settings;
      this.filters = this.settings.widgets.filters.filter_list;
      this.widgets = new Map();
      this.diagram_selector = new GscapeDiagramSelector(diagrams);
      this.diagram_selector.onDiagramChange = this.onDiagramChange;
      this.widgets.set('diagram_selector', this.diagram_selector);
      this.explorer = new GscapeExplorer(predicates, diagrams);
      this.explorer.onEntitySelect = this.onEntitySelection;
      this.explorer.onNodeNavigation = this.onNodeNavigation;
      this.widgets.set('explorer', this.explorer);
      this.entity_details = new GscapeEntityDetails();
      this.entity_details.onNodeNavigation = this.onNodeNavigation;
      this.widgets.set('details', this.entity_details);
      this.occurrences_list = new GscapeEntityOccurrences();
      this.occurrences_list.onNodeNavigation = this.onNodeNavigation;
      this.widgets.set('occurrences_list', this.occurrences_list);
      var btn_fullscreen = new GscapeButton('fullscreen', 'fullscreen_exit');
      btn_fullscreen.style.top = '10px';
      btn_fullscreen.style.right = '10px';
      btn_fullscreen.onClick = this.toggleFullscreen.bind(this);
      this.widgets.set('btn_fullscreen', btn_fullscreen);
      var btn_reset = new GscapeButton('filter_center_focus');
      btn_reset.style.bottom = '10px';
      btn_reset.style.right = '10px';
      btn_reset.onClick = this.resetView.bind(this);
      this.widgets.set('btn_reset', btn_reset);
      this.filters_widget = new GscapeFilters(this.filters);
      this.filters_widget.onFilterOn = this.filter.bind(this);
      this.filters_widget.onFilterOff = this.unfilter.bind(this);
      this.widgets.set('filters', this.filters_widget);
      this.ontology_info = new GscapeOntologyInfo(ontology);
      this.widgets.set('ontology_info', this.ontology_info);
      this.owl_translator = new GscapeOwlTranslator();
      this.widgets.set('owl_translator', this.owl_translator);
      var zoom_widget = new GscapeZoomTools();
      zoom_widget.onZoomIn = this.zoomIn.bind(this);
      zoom_widget.onZoomOut = this.zoomOut.bind(this);
      this.widgets.set('zoom_widget', zoom_widget);
      this.renderer_selector = new GscapeRenderSelector(this.renderers);
      this.renderer_selector.onRendererChange = this.changeRenderingMode.bind(this);
      this.widgets.set('simplifications', this.renderer_selector);
      this.layout_settings = new GscapeLayoutSettings();

      this.layout_settings.onLayoutRunToggle = function () {
        return _this.renderer.layoutStopped = !_this.renderer.layoutStopped;
      };

      this.layout_settings.onDragAndPinToggle = function () {
        return _this.renderer.dragAndPin = !_this.renderer.dragAndPin;
      };

      this.layout_settings.hide();
      this.widgets.set('layout_settings', this.layout_settings); // settings

      this.settings_widget = new GscapeSettings(this.settings);
      this.settings_widget.onEntityNameSelection = this.onEntityNameTypeChange.bind(this);
      this.settings_widget.onLanguageSelection = this.onLanguageChange.bind(this);
      this.settings_widget.onThemeSelection = this.onThemeSelection.bind(this);
      this.settings_widget.onWidgetEnabled = this.onWidgetEnabled.bind(this);
      this.settings_widget.onWidgetDisabled = this.onWidgetDisabled.bind(this);
      this.widgets.set('settings_widget', this.settings_widget);
      Object.keys(this.renderers).forEach(function (renderer) {
        return _this.registerEvents(_this.renderers[renderer]);
      }); // disable widget that are disabled in settings

      for (var widget_name in this.settings.widgets) {
        if (!this.settings.widgets[widget_name].enabled) this.onWidgetDisabled(widget_name);
      }

      this.widgets.forEach(function (widget, key) {
        _this.container.appendChild(widget);

        switch (key) {
          case 'filters':
          case 'ontology_info':
          case 'settings_widget':
          case 'simplifications':
            widget.onToggleBody = function () {
              return _this.blurAll(widget);
            };

            break;
        }
      });
      if (this.settings.rendering.theme.selected != 'custom') this.setTheme(themes[this.settings.rendering.theme.selected]);
    }
  }, {
    key: "registerEvents",
    value: function registerEvents(renderer) {
      renderer.onEdgeSelection = this.onEdgeSelection;
      renderer.onNodeSelection = this.onNodeSelection;
      renderer.onBackgroundClick = this.blurAll.bind(this);
    }
  }, {
    key: "drawDiagram",
    value: function drawDiagram(diagramViewData) {
      this.diagram_selector.actual_diagram_id = diagramViewData.id;
      this.renderer.drawDiagram(diagramViewData); // check if any filter is active and if yes, apply them

      if (this.filters.all.active) {
        this.filter('all');
      } else {
        this.applyActiveFilters();
      }
    }
  }, {
    key: "applyActiveFilters",
    value: function applyActiveFilters() {
      var _this2 = this;

      Object.keys(this.filters).map(function (key) {
        if (_this2.filters[key].active) _this2.renderer.filter(_this2.filters[key]);
      });
    }
  }, {
    key: "filter",
    value: function filter(type) {
      this.filters[type].active = true;
      this.onFilterToggle(type);
    }
  }, {
    key: "unfilter",
    value: function unfilter(type) {
      this.filters[type].active = false;
      this.onFilterToggle(type);
    }
  }, {
    key: "onFilterToggle",
    value: function onFilterToggle(type) {
      var _this3 = this;

      if (type == 'attributes') {
        this.filters.value_domain.disabled = this.filters.attributes.active;
      } // if 'all' is toggled, it affect all other filters


      if (type == 'all') {
        Object.keys(this.filters).map(function (key) {
          if (key != 'all' && !_this3.filters[key].disbaled) {
            _this3.filters[key].active = _this3.filters.all.active;
            /**
             * if the actual filter is value-domain it means it's not disabled (see previous if condition)
             * but when filter all is active, filter value-domain must be disabled, let's disable it
             */

            if (key == 'value_domain') _this3.filters[key].disabled = _this3.filters.all.active;

            _this3.executeFilter(key);
          }
        });
      } else if (!this.filters[type].active && this.filters.all.active) {
        // if one filter get deactivated while the 'all' filter is active
        // then make the 'all' toggle deactivated
        this.filters.all.active = false;
      }
      /**
       * force the value_domain filter to stay disabled
       * (activating the attributes filter may able the value_domain filter
       *  which must stay always disabled in simplified visualization)
       */


      if (this.renderer_selector.actual_mode !== 'default') {
        this.filters.value_domain.disabled = true;
      }

      this.executeFilter(type);
      this.widgets.get('filters').updateTogglesState();
    }
  }, {
    key: "executeFilter",
    value: function executeFilter(type) {
      if (this.filters[type].active) {
        this.renderer.filter(this.filters[type]);
      } else {
        this.renderer.unfilter(this.filters[type]); // Re-Apply other active filters to resolve ambiguity

        this.applyActiveFilters();
      }
    }
  }, {
    key: "zoomIn",
    value: function zoomIn() {
      this.renderer.zoomIn();
    }
  }, {
    key: "zoomOut",
    value: function zoomOut() {
      this.renderer.zoomOut();
    }
  }, {
    key: "resetView",
    value: function resetView() {
      this.renderer.resetView();
    }
  }, {
    key: "centerOnNode",
    value: function centerOnNode(nodeViewData, zoom) {
      this.renderer.centerOnNode(nodeViewData.id, zoom);
    }
  }, {
    key: "showDetails",
    value: function showDetails(entityViewData) {
      var unselect = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      this.entity_details.entity = entityViewData;
      this.showWidget('details');
      if (unselect) this.renderer.cy.$(':selected').unselect();
    }
  }, {
    key: "showOccurrences",
    value: function showOccurrences(occurrences) {
      var unselect = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      this.occurrences_list.occurrences = occurrences;
      this.showWidget('occurrences_list');
      if (unselect) this.renderer.cy.$(':selected').unselect();
    }
  }, {
    key: "showOwlTranslation",
    value: function showOwlTranslation(text) {
      if (this.renderer_selector.actual_mode == 'default') {
        this.owl_translator.owl_text = text;
        this.showWidget('owl_translator');
      }
    }
  }, {
    key: "toggleFullscreen",
    value: function toggleFullscreen() {
      var c = this.container;

      if (this.isFullscreen()) {
        document.cancelFullscreen();
      } else {
        c.requestFullscreen();
      }
    }
  }, {
    key: "isFullscreen",
    value: function isFullscreen() {
      return document.fullScreenElement || document.mozFullScreenElement || // Mozilla
      document.webkitFullscreenElement || // Webkit
      document.msFullscreenElement; // IE
    }
  }, {
    key: "blurAll",
    value: function blurAll(widgtet_to_skip) {
      this.widgets.forEach(function (widget) {
        if (!Object.is(widget, widgtet_to_skip)) widget.blur();
      });
    }
  }, {
    key: "setRenderer",
    value: function setRenderer(renderer) {
      for (name in this.renderers) {
        if (this.renderers[name]) this.renderers[name].unmount();
      }

      renderer.mount(this.graph_container);
      this.renderer = renderer;
    }
  }, {
    key: "changeRenderingMode",
    value: function changeRenderingMode(mode) {
      var _this4 = this;

      var remember_position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      if (!remember_position) this.resetView();
      var actual_position = this.renderer.getActualPosition();
      var old_renderer = this.renderer;
      this.setRenderer(this.renderers[mode]);

      switch (mode) {
        case 'float':
        case 'lite':
          {
            Object.keys(this.filters).map(function (key) {
              if (key != 'all' && key != 'attributes' && key != 'individuals') {
                // disable all unnecessary filters
                _this4.filters[key].disabled = true;
              }
            });
            break;
          }

        case 'default':
          {
            Object.keys(this.filters).map(function (key) {
              if (key != 'all' && key != 'attributes' && key != 'individuals') {
                // enable filters that may have been disabled by lite mode
                _this4.filters[key].disabled = false;
                if (key == 'value_domain' && _this4.filters.attributes.active) _this4.filters.value_domain.disabled = true;
              }
            });
            break;
          }
      }

      this.onRenderingModeChange(mode, actual_position);

      if (mode == 'float') {
        this.showWidget('layout_settings');
      } else {
        if (old_renderer == this.renderers["float"]) {
          /**when coming from float mode, always ignore actual position
           * ---
           * WHY TIMEOUT?
           * versions >3.2.22 of cytoscape.js apparently have glitches
           * in large graphs in floaty mode.
           * In cytoscape 3.2.22 mount and unmount are not available so the
           * mount and unmount for grapholscape renderers are based on style.display.
           * This means that at this time, cytoscape inner container has zero
           * for width and height and this prevent it to perform the fit().
           * After awhile dimensions get a value and the fit() works again.
           * */
          setTimeout(function () {
            return _this4.resetView();
          }, 250); //this.resetView()
        }

        this.hideWidget('layout_settings');
      }

      this.filters_widget.requestUpdate();
      this.blurAll();
    }
  }, {
    key: "setViewPort",
    value: function setViewPort(state) {
      this.renderer.centerOnRenderedPosition(state.x, state.y, state.zoom);
    }
  }, {
    key: "updateEntitiesList",
    value: function updateEntitiesList(entitiesViewData) {
      this.explorer.predicates = entitiesViewData;
      this.explorer.requestUpdate();
    }
  }, {
    key: "onThemeSelection",
    value: function onThemeSelection(theme_name) {
      theme_name == 'custom' ? this.setTheme(this.custom_theme) : this.setTheme(themes[theme_name]);
    }
  }, {
    key: "setTheme",
    value: function setTheme(theme) {
      var _this5 = this;

      // update theme with custom variables "--theme-gscape-[var]" values
      var theme_aux = {};
      var prefix = '--theme-gscape-';
      Object.keys(theme).map(function (key) {
        var css_key = prefix + key.replace(/_/g, '-'); // normalize theme using plain strings

        var color = typeof theme[key] == 'string' ? theme[key] : theme[key].cssText;

        _this5.container.style.setProperty(css_key, color);

        theme_aux[key] = color;
      });
      this.graph_container.style.background = theme.background; // Apply theme to graph

      Object.keys(this.renderers).map(function (key) {
        _this5.renderers[key].setTheme(theme_aux);
      });
    }
  }, {
    key: "setCustomTheme",
    value: function setCustomTheme(new_theme) {
      var _this6 = this;

      this.custom_theme = JSON.parse(JSON.stringify(gscape));
      Object.keys(new_theme).forEach(function (color) {
        if (_this6.custom_theme[color]) {
          _this6.custom_theme[color] = new_theme[color];
        }
      });
      this.setTheme(this.custom_theme);
    }
  }, {
    key: "showWidget",
    value: function showWidget(widget_name) {
      this.widgets.get(widget_name).show();
    }
  }, {
    key: "hideWidget",
    value: function hideWidget(widget_name) {
      this.widgets.get(widget_name).hide();
    }
  }, {
    key: "onWidgetEnabled",
    value: function onWidgetEnabled(widget_name) {
      this.widgets.get(widget_name).enable();
    }
  }, {
    key: "onWidgetDisabled",
    value: function onWidgetDisabled(widget_name) {
      this.widgets.get(widget_name).disable();
    }
  }, {
    key: "showDialog",
    value: function showDialog(type, message) {
      this.dialog.show(type, message);
    }
  }, {
    key: "actual_diagram_id",
    get: function get() {
      return this.diagram_selector.actual_diagram_id;
    }
  }, {
    key: "onWikiClick",
    set: function set(callback) {
      this.entity_details.onWikiClick = callback;
    }
  }]);

  return GrapholscapeView;
}();

var OwlTranslator = /*#__PURE__*/function () {
  function OwlTranslator() {
    _classCallCheck(this, OwlTranslator);
  }

  _createClass(OwlTranslator, [{
    key: "edgeToOwlString",
    value: function edgeToOwlString(edge) {
      var source = edge.source();
      var target = edge.target();
      var malformed = '<span class="owl_error">Malformed Axiom</span>';
      var missing_operand = '<span class="owl_error">Missing Operand</span>';

      switch (edge.data('type')) {
        case 'inclusion':
          if (source.data('identity') == 'concept' && target.data('identity') == 'concept') {
            if (source.data('type') == 'domain-restriction' && source.data('displayed_name') != 'self' && target.data('displayed_name') != 'self') {
              return propertyDomain(this, edge);
            } else if (source.data('type') == 'range-restriction' && source.data('displayed_name') != 'self' && target.data('displayed_name') != 'self') {
              return propertyRange(this, edge);
            } else if (target.data('type') == 'complement' || source.data('type') == 'complement') {
              return disjointClasses(this, edge.connectedNodes());
            }

            return subClassOf(this, edge);
          } else if (source.data('identity') == 'role' && target.data('identity') == 'role') {
            if (target.data('type') == 'complement') {
              return disjointTypeProperties(this, edge);
            }

            return subTypePropertyOf(this, edge);
          } else if (source.data('identity') == 'value_domain' && target.data('identity') == 'value_domain') {
            return propertyRange(this, edge);
          } else if (source.data('identity') == 'attribute' && target.data('identity') == 'attribute') {
            if (target.data('type') == 'complement') {
              return disjointTypeProperties(this, edge);
            } else {
              return subTypePropertyOf(this, edge);
            }
          } else {
            return malformed;
          }

        case 'equivalence':
          if (source.data('identity') == 'concept' && target.data('identity') == 'concept') {
            return equivalentClasses(this, edge);
          } else if (source.data('identity') == 'role' && target.data('identity') == 'role') {
            if (source.data('type') == 'role-inverse' || target.data('type') == 'role-inverse') {
              return inverseObjectProperties(this, edge);
            } else {
              return equivalentTypeProperties(this, edge);
            }
          } else if (source.data('identity') == 'attribute' && target.data('identity') == 'attribute') {
            return equivalentTypeProperties(this, edge);
          } else {
            return malformed;
          }

        case 'membership':
          if (target.data('identity') == 'concept') {
            return classAssertion(this, edge);
          } else {
            return propertyAssertion(this, edge);
          }
      }

      function propertyAssertion(self, edge) {
        var axiom_type = 'Object';
        var owl_string;

        if (edge.target().data('identity') == 'attribute') {
          axiom_type = 'Data';
        }

        owl_string = axiom_type + 'PropertyAssertion(' + self.nodeToOwlString(edge.target()) + ' ';

        if (edge.source().data('type') == 'property-assertion') {
          var property_node = edge.source();
          property_node.incomers('[type = "input"]').sources().forEach(function (input) {
            owl_string += self.nodeToOwlString(input) + ' ';
          });
          owl_string = owl_string.slice(0, owl_string.length - 1);
        } else {
          owl_string += self.nodeToOwlString(edge.source());
        }

        return owl_string + ')';
      }

      function classAssertion(self, edge) {
        return 'ClassAssertion(' + self.nodeToOwlString(edge.source()) + ' ' + self.nodeToOwlString(edge.target()) + ')';
      }

      function inverseObjectProperties(self, edge) {
        var complement_input;
        var input;

        if (edge.source().data('type') == 'role-inverse') {
          input = edge.target();
          complement_input = edge.source().incomers('[type = "input"]').sources().first();
        } else {
          input = edge.source();
          complement_input = edge.target().incomers('[type = "input"]').sources().first();
        }

        if (!complement_input.length) {
          return missing_operand;
        }

        return 'InverseObjectProperties(' + self.nodeToOwlString(input) + ' ' + self.nodeToOwlString(complement_input) + ')';
      }

      function equivalentClasses(self, edge) {
        return 'EquivalentClasses(' + self.nodeToOwlString(edge.source()) + ' ' + self.nodeToOwlString(edge.target()) + ')';
      }

      function equivalentTypeProperties(self, edge) {
        var axiom_type;

        if (edge.source().data('idenity') == 'role') {
          axiom_type = 'Object';
        } else {
          axiom_type = 'Data';
        }

        return 'Equivalent' + axiom_type + 'Properties(' + self.nodeToOwlString(edge.source()) + ' ' + self.nodeToOwlString(edge.target()) + ')';
      }

      function subClassOf(self, edge) {
        return 'SubClassOf(' + self.nodeToOwlString(edge.source()) + ' ' + self.nodeToOwlString(edge.target()) + ')';
      }

      function subTypePropertyOf(self, edge) {
        var axiom_type;

        if (edge.target().data('identity') == 'role') {
          axiom_type = 'Object';
        } else if (edge.target().data('type') == 'attribute') {
          axiom_type = 'Data';
        } else {
          return null;
        }

        return 'Sub' + axiom_type + 'PropertyOf(' + self.nodeToOwlString(edge.source()) + ' ' + self.nodeToOwlString(edge.target()) + ')';
      }

      function propertyDomain(self, edge) {
        var node = edge.source().incomers('[type = "input"]').sources();

        if (node.size() > 1) {
          return subClassOf(self, edge);
        }

        if (node.data('type') == 'role') {
          return 'ObjectPropertyDomain(' + self.nodeToOwlString(node) + ' ' + self.nodeToOwlString(edge.target()) + ')';
        } else if (node.data('type') == 'attribute') {
          return 'DataPropertyDomain(' + self.nodeToOwlString(node) + ' ' + self.nodeToOwlString(edge.target()) + ')';
        }
      }

      function propertyRange(self, edge) {
        var node = edge.source().incomers('[type = "input"]').sources();

        if (node.size() > 1) {
          return subClassOf(self, edge);
        }

        if (node.data('type') == 'role') {
          return 'ObjectPropertyRange(' + self.nodeToOwlString(node) + ' ' + self.nodeToOwlString(edge.target()) + ')';
        } else if (node.data('type') == 'attribute') {
          return 'DataPropertyRange(' + self.nodeToOwlString(node) + ' ' + self.nodeToOwlString(edge.target()) + ')';
        }
      }

      function disjointClasses(self, inputs) {
        var owl_string = 'DisjointClasses(';
        inputs.forEach(function (input) {
          if (input.data('type') == 'complement') {
            input = input.incomers('[type = "input"]').source();
          }

          owl_string += self.nodeToOwlString(input) + ' ';
        });
        owl_string = owl_string.slice(0, owl_string.length - 1);
        owl_string += ')';
        return owl_string;
      }

      function disjointTypeProperties(self, edge) {
        var axiom_type, owl_string;

        if (edge.target().data('identity') == 'role') {
          axiom_type = 'Object';
        } else if (edge.target().data('identity') == 'attribute') {
          axiom_type = 'Data';
        } else {
          return null;
        }

        owl_string = 'Disjoint' + axiom_type + 'Properties(';
        edge.connectedNodes().forEach(function (node) {
          if (node.data('type') == 'complement') {
            node = node.incomers('[type = "input"]').source();
          }

          owl_string += self.nodeToOwlString(node) + ' ';
        });
        owl_string = owl_string.slice(0, owl_string.length - 1);
        return owl_string + ')';
      }
    }
  }, {
    key: "nodeToOwlString",
    value: function nodeToOwlString(node, from_node) {
      var owl_thing = '<span class="axiom_predicate_prefix">owl:</span><span class="axiom_predefinite_obj">Thing</span>';
      var rdfs_literal = '<span class="axiom_predicate_prefix">rdfs:</span><span class="axiom_predefinite_obj">Literal</span>';
      var missing_operand = '<span class="owl_error">Missing Operand</span>';
      var not_defined = 'Undefined';
      var from_node_flag = from_node || null;

      if (from_node_flag && (node.hasClass('predicate') || node.data('type') == 'value-domain')) {
        var owl_predicate = '<span class="axiom_predicate_prefix">' + node.data('iri').prefix + '</span><span class="owl_' + node.data('type') + '">' + node.data('iri').remaining_chars + '</span>';
        var owl_type;

        switch (node.data('type')) {
          case 'concept':
            owl_type = 'Class';
            return 'Declaration(' + owl_type + '(' + owl_predicate + '))';

          case 'role':
            owl_type = 'ObjectProperty';
            var owl_string = 'Declaration(' + owl_type + '(' + owl_predicate + '))';

            if (node.data('functional')) {
              owl_string += '<br/>Functional' + owl_type + '(' + owl_predicate + ')';
            }

            if (node.data('inverseFunctional')) {
              owl_string += '<br/>InverseFunctional' + owl_type + '(' + owl_predicate + ')';
            }

            if (node.data('asymmetric')) {
              owl_string += '<br />Asymmetric' + owl_type + '(' + owl_predicate + ')';
            }

            if (node.data('irreflexive')) {
              owl_string += '<br/>Irreflexive' + owl_type + '(' + owl_predicate + ')';
            }

            if (node.data('reflexive')) {
              owl_string += '<br/>Reflexive' + owl_type + '(' + owl_predicate + ')';
            }

            if (node.data('symmetric')) {
              owl_string += '<br/>Symmetric' + owl_type + '(' + owl_predicate + ')';
            }

            if (node.data('transitive')) {
              owl_string += '<br/>Transitive' + owl_type + '(' + owl_predicate + ')';
            }

            return owl_string;

          case 'attribute':
            owl_type = 'DataProperty';
            var owl_string = 'Declaration(' + owl_type + '(' + owl_predicate + '))';

            if (node.data('functional')) {
              owl_string += '<br/>Functional' + owl_type + '(' + owl_predicate + '))';
            }

            return owl_string;

          case 'individual':
            if (node.data('iri').remaining_chars.search(/"[\w]+"\^\^[\w]+:/) != -1) {
              var value = node.data('iri').remaining_chars.split('^^')[0];
              var datatype = node.data('iri').remaining_chars.split(':')[1];
              owl_predicate = '<span class="owl_value">' + value + '</span>^^' + '<span class="axiom_predicate_prefix">' + node.data('iri').prefix + '</span>' + '<span class="owl_value-domain">' + datatype + '</span>';
            }

            owl_type = 'NamedIndividual';
            return 'Declaration(' + owl_type + '(' + owl_predicate + '))';

          case 'value-domain':
            owl_type = 'Datatype';
            return 'Declaration(' + owl_type + '(' + owl_predicate + '))';
        }
      }

      switch (node.data('type')) {
        case 'individual':
          if (node.data('iri').remaining_chars.search(/"[\w]+"\^\^[\w]+:/) != -1) {
            var value = node.data('iri').remaining_chars.split('^^')[0];
            var datatype = node.data('iri').remaining_chars.split(':')[1];
            return '<span class="owl_value">' + value + '</span>^^' + '<span class="axiom_predicate_prefix">' + node.data('iri').prefix + '</span>' + '<span class="owl_value-domain">' + datatype + '</span>';
          }

        case 'concept':
        case 'role':
        case 'value-domain':
        case 'attribute':
        case 'individual':
          return '<span class="axiom_predicate_prefix">' + node.data('iri').prefix + '</span><span class="owl_' + node.data('type') + '">' + node.data('iri').remaining_chars + '</span>';

        case 'facet':
          var rem_chars = node.data('displayed_name').replace(/\n/g, '^').split('^^');
          rem_chars[0] = rem_chars[0].slice(4);
          return '<span class="axiom_predicate_prefix">xsd:</span><span class="owl_value-domain">' + rem_chars[0] + '</span><span class="owl_value">' + rem_chars[1] + '</span>';

        case 'domain-restriction':
        case 'range-restriction':
          var input_edges = node.connectedEdges('edge[target = "' + node.id() + '"][type = "input"]');
          var input_first;
          var input_other;

          if (!input_edges.length) {
            return missing_operand;
          }

          input_edges.forEach(function (e) {
            if (e.source().data('type') == 'role' || e.source().data('type') == 'attribute') {
              input_first = e.source();
            }

            if (e.source().data('type') != 'role' && e.source().data('type') != 'attribute') {
              input_other = e.source();
            }
          });

          if (input_first) {
            if (input_first.data('type') == 'attribute' && node.data('type') == 'range-restriction') {
              return not_defined;
            }

            if (node.data('displayed_name') == 'exists') {
              return someValuesFrom(this, input_first, input_other, node.data('type'));
            } else if (node.data('displayed_name') == 'forall') {
              return allValuesFrom(this, input_first, input_other, node.data('type'));
            } else if (node.data('displayed_name').search(/\(([-]|[\d]+),([-]|[\d]+)\)/) != -1) {
              var cardinality = node.data('displayed_name').replace(/\(|\)/g, '').split(/,/);
              return minMaxExactCardinality(this, input_first, input_other, cardinality, node.data('type'));
            } else if (node.data('displayed_name') == 'self') {
              return hasSelf(this, input_first, node.data('type'));
            }
          } else return missing_operand;

        case 'role-inverse':
          var input = node.incomers('[type = "input"]').sources();

          if (!input.length) {
            return missing_operand;
          }

          return objectInverseOf(this, input);

        case 'role-chain':
          if (!node.data('inputs')) {
            return missing_operand;
          }

          return objectPropertyChain(this, node.incomers('[type = "input"]').sources());

        case 'union':
        case 'intersection':
        case 'complement':
        case 'enumeration':
        case 'disjoint-union':
          var inputs = node.incomers('[type = "input"]').sources();

          if (!inputs.length) {
            return missing_operand;
          }

          var axiom_type = 'Object';

          if (node.data('identity') != 'concept' && node.data('identity') != 'role') {
            axiom_type = 'Data';
          }

          if (node.data('type') == 'disjoint-union') {
            if (!from_node_flag) {
              return logicalConstructors(this, inputs, 'union', axiom_type);
            } else {
              return logicalConstructors(this, inputs, 'union', axiom_type) + '<br />' + disjointClasses(this, inputs);
            }
          }

          return logicalConstructors(this, inputs, node.data('type'), axiom_type);

        case 'datatype-restriction':
          inputs = node.incomers('[type = "input"]').sources();

          if (!inputs.length) {
            return missing_operand;
          }

          return datatypeRestriction(this, inputs);

        case 'property-assertion':
          return not_defined;

        case 'has-key':
          inputs = node.incomers('[type = "input"]');
          if (!inputs.length || inputs.length < 2) return missing_operand;
          return hasKey(this, inputs.sources());
      }

      function someValuesFrom(self, first, other, restr_type) {
        var axiom_type, owl_string;

        if (first.data('type') == 'role') {
          axiom_type = 'Object';
        }

        if (first.data('type') == 'attribute') {
          axiom_type = 'Data';
        }

        owl_string = axiom_type + 'SomeValuesFrom('; // if the node is a range-restriction, put the inverse of the role

        if (restr_type == 'range-restriction') {
          owl_string += objectInverseOf(self, first);
        } else {
          owl_string += self.nodeToOwlString(first);
        }

        if (!other && axiom_type == 'Object') {
          return owl_string += ' ' + owl_thing + ')';
        }

        if (!other && axiom_type == 'Data') {
          return owl_string += ' ' + rdfs_literal + ')';
        }

        return owl_string += ' ' + self.nodeToOwlString(other) + ')';
      }

      function allValuesFrom(self, first, other, restr_type) {
        var axiom_type, owl_string;

        if (first.data('type') == 'role') {
          axiom_type = 'Object';
        }

        if (first.data('type') == 'attribute') {
          axiom_type = 'Data';
        }

        owl_string = axiom_type + 'AllValuesFrom('; // if the node is a range-restriction, put the inverse of the role

        if (restr_type == 'range-restriction') {
          owl_string += objectInverseOf(self, first);
        } else {
          owl_string += self.nodeToOwlString(first);
        }

        if (!other && axiom_type == 'Object') {
          return owl_string += ' ' + owl_thing + ')';
        }

        if (!other && axiom_type == 'Data') {
          return owl_string += ' ' + rdfs_literal + ')';
        }

        return owl_string += ' ' + self.nodeToOwlString(other) + ')';
      }

      function minMaxExactCardinality(self, first, other, cardinality, restr_type) {
        var axiom_type;

        if (first.data('type') == 'role') {
          axiom_type = 'Object';
        }

        if (first.data('type') == 'attribute') {
          axiom_type = 'Data';
        }

        if (cardinality[0] == '-') {
          if (restr_type == 'range-restriction') {
            if (!other) {
              return axiom_type + 'MaxCardinality(' + cardinality[1] + ' ' + objectInverseOf(self, first) + ')';
            } else {
              return axiom_type + 'MaxCardinality(' + cardinality[1] + ' ' + objectInverseOf(self, first) + ' ' + self.nodeToOwlString(other) + ')';
            }
          } else {
            if (!other) {
              return axiom_type + 'MaxCardinality(' + cardinality[1] + ' ' + self.nodeToOwlString(first) + ')';
            } else {
              return axiom_type + 'MaxCardinality(' + cardinality[1] + ' ' + self.nodeToOwlString(first) + ' ' + self.nodeToOwlString(other) + ')';
            }
          }
        }

        if (cardinality[1] == '-') {
          if (restr_type == 'range-restriction') {
            if (!other) {
              return axiom_type + 'MinCardinality(' + cardinality[0] + ' ' + objectInverseOf(self, first) + ')';
            } else {
              return axiom_type + 'MinCardinality(' + cardinality[0] + ' ' + objectInverseOf(self, first) + ' ' + self.nodeToOwlString(other) + ')';
            }
          } else {
            if (!other) {
              return axiom_type + 'MinCardinality(' + cardinality[0] + ' ' + self.nodeToOwlString(first) + ')';
            } else {
              return axiom_type + 'MinCardinality(' + cardinality[0] + ' ' + self.nodeToOwlString(first) + ' ' + self.nodeToOwlString(other) + ')';
            }
          }
        }

        if (cardinality[0] != '-' && cardinality[1] != '-') {
          var min = [];
          var max = [];
          min.push(cardinality[0]);
          min.push('-');
          max.push('-');
          max.push(cardinality[1]);
          return axiom_type + 'IntersectionOf(' + minMaxExactCardinality(self, first, other, min, restr_type) + ' ' + minMaxExactCardinality(self, first, other, max, restr_type) + ')';
        }
      }

      function objectInverseOf(self, node) {
        return 'ObjectInverseOf(' + self.nodeToOwlString(node) + ')';
      }

      function objectPropertyChain(self, inputs) {
        var owl_string = 'ObjectPropertyChain(';
        inputs.forEach(function (input) {
          owl_string += self.nodeToOwlString(input) + ' ';
        });
        owl_string = owl_string.slice(0, owl_string.length - 1);
        owl_string += ')';
        return owl_string;
      }

      function hasKey(self, inputs) {
        var class_node = inputs.filter('[identity = "concept"]');
        var owl_string = 'HasKey(' + self.nodeToOwlString(class_node) + ' ';
        inputs.forEach(function (input) {
          if (input.id() != class_node.id()) {
            owl_string += self.nodeToOwlString(input) + ' ';
          }
        });
        owl_string = owl_string.slice(0, owl_string.length - 1) + ')';
        return owl_string;
      }

      function logicalConstructors(self, inputs, constructor_name, axiom_type) {
        var owl_string;

        if (constructor_name == 'enumeration') {
          constructor_name = 'One';
        } else // Capitalize first char
          {
            constructor_name = constructor_name.charAt(0).toUpperCase() + constructor_name.slice(1);
          }

        owl_string = axiom_type + constructor_name + 'Of(';
        inputs.forEach(function (input) {
          owl_string += self.nodeToOwlString(input) + ' ';
        });
        owl_string = owl_string.slice(0, owl_string.length - 1);
        owl_string += ')';
        return owl_string;
      }

      function disjointClasses(self, inputs) {
        var owl_string = 'DisjointClasses(';
        inputs.forEach(function (input) {
          owl_string += self.nodeToOwlString(input) + ' ';
        });
        owl_string = owl_string.slice(0, owl_string.length - 1);
        owl_string += ')';
        return owl_string;
      }

      function datatypeRestriction(self, inputs) {
        var owl_string = 'DatatypeRestriction(';
        var value_domain = inputs.filter('[type = "value-domain"]').first();
        owl_string += self.nodeToOwlString(value_domain) + ' ';
        inputs.forEach(function (input) {
          if (input.data('type') == 'facet') {
            owl_string += self.nodeToOwlString(input) + '^^';
            owl_string += self.nodeToOwlString(value_domain) + ' ';
          }
        });
        owl_string = owl_string.slice(0, owl_string.length - 1);
        owl_string += ')';
        return owl_string;
      }

      function hasSelf(self, input, restr_type) {
        // if the restriction is on the range, put the inverse of node
        if (restr_type == 'range-restriction') {
          return 'ObjectHasSelf(' + objectInverseOf(self, input) + ')';
        }

        return 'ObjectHasSelf(' + self.nodeToOwlString(input) + ')';
      }
    }
  }]);

  return OwlTranslator;
}();

function computeSimplifiedOntologies(ontology) {
  var aux_renderer = new GrapholscapeRenderer(null);
  var lite_ontology = new Ontology(ontology.name, ontology.version);
  var float_ontology = new Ontology(ontology.name, ontology.version);
  var new_ontologies = {
    lite: lite_ontology,
    "float": float_ontology
  };
  return new Promise(function (resolve, reject) {
    try {
      window.setTimeout(function () {
        ontology.diagrams.forEach(function (diagram) {
          var lite_diagram = new Diagram(diagram.name, diagram.id);
          var float_diagram = new Diagram(diagram.name, diagram.id);
          lite_diagram.addElems(simplifyDiagramLite(diagram.nodes, diagram.edges));
          lite_ontology.addDiagram(lite_diagram);
          float_diagram.addElems(simplifyDiagramFloat(lite_diagram.nodes, lite_diagram.edges));
          float_ontology.addDiagram(float_diagram);
        });
        resolve(new_ontologies);
      }, 1);
    } catch (e) {
      reject(e);
    }
  }); // ----------------------------------

  function simplifyDiagramLite(nodes, edges) {
    var cy = cytoscape();
    cy.add(nodes);
    cy.add(edges);
    filterByCriterion(cy, function (node) {
      switch (node.data('type')) {
        case 'complement':
        case 'value-domain':
        case 'role-chain':
        case 'enumeration':
          return true;

        case 'domain-restriction':
        case 'range-restriction':
          if (node.data('displayed_name') == 'forall') return true;else return false;
      }
    });
    filterByCriterion(cy, isQualifiedRestriction);
    filterByCriterion(cy, isExistentialWithCardinality);
    filterByCriterion(cy, inputEdgesBetweenRestrictions);
    cy.remove('.filtered');
    simplifyDomainAndRange(cy);
    simplifyComplexHierarchies(cy);
    simplifyUnions(cy);
    simplifyIntersections(cy);
    simplifyRoleInverse(cy);
    return cy.$('*');
  }

  function simplifyDomainAndRange(cy) {
    var eles = cy.$('*'); // select domain and range restrictions
    // type start with 'domain' or 'range'

    var selector = "[type ^= \"domain\"],[type ^= \"range\"]";
    eles.filter(selector).forEach(function (restriction) {
      var input_edge = getInputEdgeFromPropertyToRestriction(restriction);
      var new_edge = null;
      var type = restriction.data('type') == 'domain-restriction' ? 'domain' : 'range';
      restriction.connectedEdges('[type != "input"]').forEach(function (edgeToRestriction, i) {
        new_edge = createRoleEdge(edgeToRestriction, input_edge, type, i);

        if (new_edge) {
          cy.add(new_edge);
          cy.remove(edgeToRestriction);
        }
      });
      aux_renderer.filterElem(restriction, '', cy);
      cy.remove('.filtered');
    });
    cy.remove('.filtered');

    function getInputEdgeFromPropertyToRestriction(restriction_node) {
      var e = null;
      restriction_node.incomers('[type = "input"]').forEach(function (edge) {
        if (edge.source().data('type') == 'role' || edge.source().data('type') == 'attribute') {
          e = edge;
        }
      });
      return e;
    }

    function createRoleEdge(edgeToRestriction, edgeFromProperty, type, i) {
      var edges = [];
      var new_edge = null;
      /**
       * if the actual edge is between two existential, remove it and filter the other existential
       */

      if ((edgeToRestriction.source().data('type') == 'domain-restriction' || edgeToRestriction.source().data('type') == 'range-restriction') && (edgeToRestriction.target().data('type') == 'domain-restriction' || edgeToRestriction.target().data('type') == 'range-restriction')) {
        cy.remove(edgeToRestriction);
        return new_edge;
      }

      if (edgeToRestriction.target().data('id') !== edgeFromProperty.target().data('id')) {
        edges.push(reverseEdge(edgeToRestriction));
      } else {
        edges.push(edgeToRestriction.json());
      } // move attribute on restriction node position


      if (edgeFromProperty.source().data('type') == "attribute") {
        edgeFromProperty.source().position(edgeFromProperty.target().position());
        new_edge = edges[0];
        new_edge.data.target = edgeFromProperty.source().id();
        new_edge.data.id += '_' + i;
      } else {
        // concatenation only if the input is not an attribute
        edges.push(reverseEdge(edgeFromProperty));
        new_edge = createConcatenatedEdge(edges, cy, edges[0].data.id + '_' + i);
      } // add the type of input to the restriction as a class of the new edge
      // role or attribute, used in the stylesheet to assign different colors


      new_edge.classes += "".concat(edgeFromProperty.source().data('type'), " ").concat(type);
      new_edge.data.type = 'default';
      return new_edge;
    }
  }

  function reverseEdge(edge) {
    var new_edge = edge.json();
    var source_aux = edge.source().id();
    new_edge.data.source = edge.target().id();
    new_edge.data.target = source_aux;
    var endpoint_aux = edge.data('source_endpoint');
    new_edge.data.source_endpoint = edge.data('target_endpoint');
    new_edge.data.target_endpoint = endpoint_aux;
    new_edge.data.breakpoints = edge.data('breakpoints').reverse();

    if (edge.data('segment_distances')) {
      new_edge.data.segment_distances = [];
      new_edge.data.segment_weights = [];
      new_edge.data.breakpoints.forEach(function (breakpoint) {
        var aux = getDistanceWeight(edge.source().position(), edge.target().position(), breakpoint);
        new_edge.data.segment_distances.push(aux[0]);
        new_edge.data.segment_weights.push(aux[1]);
      });
    }

    return new_edge;
  }
  /**
   * @param {array} edges - array of edges in json format
   * @param {cytoscape} cy
   * @param {string} id - the id to assign to the new edge
   */


  function createConcatenatedEdge(edges, cy, id) {
    var source = edges[0].data.source;
    var target = edges[edges.length - 1].data.target;
    var segment_distances = [];
    var segment_weights = [];
    var breakpoints = [];
    var aux = undefined;
    edges.forEach(function (edge, i, array) {
      if (edge.data.breakpoints) {
        breakpoints = breakpoints.concat(edge.data.breakpoints);
        edge.data.breakpoints.forEach(function (breakpoint) {
          aux = getDistanceWeight(cy.getElementById(target).position(), cy.getElementById(source).position(), breakpoint);
          segment_distances.push(aux[0]);
          segment_weights.push(aux[1]);
        });
      } // add target position as new breakpoint


      if (i < array.length - 1) {
        aux = getDistanceWeight(cy.getElementById(target).position(), cy.getElementById(source).position(), cy.getElementById(edge.data.target).position());
        segment_distances.push(aux[0]);
        segment_weights.push(aux[1]);
        breakpoints.push(cy.getElementById(edge.data.target).position());
      }
    });
    var new_edge = edges[0];
    new_edge.data.id = id;
    new_edge.data.source = source;
    new_edge.data.target = target;
    new_edge.data.target_endpoint = edges[edges.length - 1].data.target_endpoint;
    new_edge.data.type = 'inclusion';
    new_edge.data.segment_distances = segment_distances;
    new_edge.data.segment_weights = segment_weights;
    new_edge.data.breakpoints = breakpoints;
    return new_edge;
  } // filter nodes if the criterion function return true
  // criterion must be a function returning a boolean value for a given a node


  function filterByCriterion(cy_instance, criterion) {
    var cy = cy_instance;
    cy.$('*').forEach(function (node) {
      if (criterion(node)) {
        aux_renderer.filterElem(node, '', cy);
      }
    });
  }

  function isQualifiedRestriction(node) {
    if ((node.data('type') == 'domain-restriction' || node.data('type') == 'range-restriction') && node.data('displayed_name') == 'exists') {
      return node.incomers('edge[type = "input"]').size() > 1 ? true : false;
    }

    return false;
  }

  function inputEdgesBetweenRestrictions(node) {
    var outcome = false;

    if (node.data('type') == 'domain-restriction' || node.data('type') == 'range-restriction') {
      node.incomers('edge[type = "input"]').forEach(function (edge) {
        if (edge.source().data('type').endsWith('restriction')) {
          outcome = true;
        }
      });
    }

    return outcome;
  }

  function isExistentialWithCardinality(node) {
    if ((node.data('type') == 'domain-restriction' || node.data('type') == 'range-restriction') && node.data('displayed_name').search(/[0-9]/g) >= 0) {
      return true;
    }

    return false;
  }

  function isComplexHierarchy(node) {
    if (node.data('type') != 'union' && node.data('type') != 'disjoint-union' && node.data('type') != 'intersection') return false;
    var outcome = false;
    node.incomers('[type *= "input"]').forEach(function (input) {
      if (input.source().data('type') != 'concept') {
        outcome = true;
      }
    });
    return outcome;
  }

  function simplifyUnions(cy) {
    var eles = cy.$('*');
    eles.filter('[type $= "union"]').forEach(function (union) {
      makeDummyPoint(union);
      union.incomers('edge[type = "input"]').data('type', 'easy_input');
      cy.remove(union.incomers('edge[type = "inclusion"]')); // process equivalence edges

      union.connectedEdges('edge[type = "equivalence"]').forEach(function (edge) {
        edge.data('type', 'inclusion');
        edge.data('target_label', 'C');

        if (edge.source().id() != union.id()) {
          var reversed_edge = reverseEdge(edge);
          cy.remove(edge);
          cy.add(reversed_edge);
        }
      }); // process inclusion edges

      union.outgoers('edge[type = "inclusion"]').forEach(function (inclusion) {
        inclusion.addClass('hierarchy');
        if (union.data('type') == 'disjoint-union') inclusion.addClass('disjoint');
      });
      if (union.data('label')) union.data('label', '');
      replicateAttributes(union); // replicate role tipization on input classes

      replicateRoleTypizations(union); // if the union has not any connected non-input edges, then remove it

      if (union.connectedEdges('[type !*= "input"]').size() == 0) cy.remove(union);
    });
  }

  function makeDummyPoint(node) {
    node.data('width', 0.1);
    node.data('height', 0.1);
    node.addClass('dummy');
  }

  function simplifyIntersections(cytoscape_instance) {
    var cy = cytoscape_instance;
    cy.$('node[type = "intersection"]').forEach(function (and) {
      replicateAttributes(and);
      replicateRoleTypizations(and); // if there are no incoming inclusions or equivalence and no equivalences connected,
      // remove the intersection

      if (and.incomers('edge[type !*= "input"]').size() == 0 && and.connectedEdges('edge[type = "equivalence"]').size() == 0) {
        aux_renderer.filterElem(and, '', cy);
      } else {
        // process incoming inclusion
        and.incomers('edge[type !*= "input"]').forEach(function (edge) {
          /**
           * create a new ISA edge for each input class
           * the new edge will be a concatenation:
           *  - ISA towards the 'and' node + input edge
           *
           * the input edge must be reversed
           * In case of equivalence edge, we only consider the
           * isa towards the 'and' node and discard the other direction
           */
          and.incomers('edge[type = "input"]').forEach(function (input, i) {
            /**
             * if the edge is an equivalence, we must consider it as an
             * incoming edge in any case and ignore the opposite direction.
             * so if the edge is outgoing from the intersection, we reverse it
             */
            var edges = [];

            if (edge.source().id() == and.id()) {
              edges.push(reverseEdge(edge));
            } else edges.push(edge.json());

            var new_id = "".concat(edge.id(), "_").concat(i);
            edges.push(reverseEdge(input));
            var new_isa = createConcatenatedEdge(edges, cy, new_id);
            cy.remove(edge);
            cy.add(new_isa);
          });
        });
        cy.remove(and);
      }
    });
  }

  function replicateRoleTypizations(constructor) {
    var cy = constructor.cy(); // replicate role tipization on input classes

    constructor.connectedEdges('edge.role').forEach(function (role_edge) {
      constructor.incomers('[type *= "input"]').forEach(function (input, i) {
        var new_id = "".concat(role_edge.id(), "_").concat(i);
        var new_edge = {};
        var edges = [];
        /**
         * if the connected non input edge is only one (the one we are processing)
         * then the new edge will be the concatenation of the input edge + role edge
         */

        if (constructor.connectedEdges('[type !*= "input"]').size() <= 1) {
          edges.push(input.json());
          edges.push(role_edge.json());
          new_edge = createConcatenatedEdge(edges, cy, new_id);
          new_edge.data.type = 'default';
          new_edge.classes = role_edge.json().classes;
        } else {
          /**
           * Otherwise the constructor node will not be deleted and the new role edges can't
           * pass over the constructor node. We then just properly change the source/target
           * of the role edge. In this way the resulting edges will go from the last
           * breakpoint of the original role edge towards the input classes of the constructor
          */
          new_edge = role_edge.json();
          new_edge.data.id = new_id;
          var target = undefined;
          var source = undefined;
          target = role_edge.target();
          source = input.source();
          new_edge.data.source = input.source().id(); // Keep the original role edge breakpoints

          var segment_distances = [];
          var segment_weights = [];
          new_edge.data.breakpoints.forEach(function (breakpoint) {
            var aux = getDistanceWeight(target.position(), source.position(), breakpoint);
            segment_distances.push(aux[0]);
            segment_weights.push(aux[1]);
          });
          new_edge.data.segment_distances = segment_distances;
          new_edge.data.segment_weights = segment_weights;
        }

        cy.add(new_edge);
      });
      cy.remove(role_edge);
    });
  }

  function simplifyComplexHierarchies(cytoscape_instance) {
    var cy = cytoscape_instance;
    cy.nodes('[type = "intersection"],[type = "union"],[type = "disjoint-union"]').forEach(function (node) {
      if (isComplexHierarchy(node)) {
        replicateAttributes(node);
        aux_renderer.filterElem(node, '', cy);
      }
    });
    cy.remove('.filtered');
  }

  function replicateAttributes(node) {
    var cy = node.cy();
    var all_classes = getAllInputs(node);
    var all_attributes = node.neighborhood('[type = "attribute"]');
    var all_inclusion_attributes = cy.collection();
    all_classes.forEach(function (concept, i) {
      all_attributes.forEach(function (attribute, j) {
        addAttribute(concept, i, attribute, 'attribute');
      });
    });
    cy.remove(all_attributes);
    aux_renderer.filterElem(all_inclusion_attributes, '', cy);

    function addAttribute(target, i, attribute, edge_classes) {
      var new_attribute = attribute.json();
      new_attribute.position = target.position();
      new_attribute.data.id += '_' + i + '_' + target.id();
      new_attribute.classes += ' repositioned'; //attribute.addClass('repositioned')

      cy.add(new_attribute);
      var edge = {
        data: {
          id: new_attribute.data.id + '_edge',
          target: new_attribute.data.id,
          source: target.id()
        },
        classes: edge_classes
      };
      cy.add(edge); // recursively add new attributes connected to replicated attributes by inclusions

      if (!target.hasClass('repositioned')) {
        attribute.neighborhood('[type = "attribute"]').forEach(function (inclusion_attribute, j) {
          if (all_attributes.contains(inclusion_attribute)) {
            return;
          }

          addAttribute(cy.$id(new_attribute.data.id), j, inclusion_attribute, 'inclusion');
          all_inclusion_attributes = all_inclusion_attributes.union(inclusion_attribute);
        });
      }
    }

    function getAllInputs(node) {
      var all_classes = node.cy().collection();
      var input_edges = node.incomers('edge[type *= "input"]');
      all_classes = all_classes.union(input_edges.sources('[type = "concept"]'));
      input_edges.sources('[type != "concept"]').forEach(function (constructor) {
        all_classes = all_classes.union(getAllInputs(constructor));
        constructor.addClass('attr_replicated');
      });
      return all_classes;
    }
  }

  function simplifyRoleInverse(cytoscape_instance) {
    var cy = cytoscape_instance;
    cy.nodes('[type = "role-inverse"]').forEach(function (role_inverse) {
      var new_edges_count = 0; // the input role is only one

      var input_edge = role_inverse.incomers('[type *= "input"]'); // for each other edge connected, create a concatenated edge
      // the edge is directed towards the input_role

      role_inverse.connectedEdges('[type !*= "input"]').forEach(function (edge, i) {
        var edges = []; // if the edge is outgoing from the role-inverse node, then we need to reverse it

        if (edge.source().id() == role_inverse.id()) {
          edges.push(reverseEdge(edge));
        } else {
          edges.push(edge.json());
        } // the input edge must always be reversed


        edges.push(reverseEdge(input_edge));
        var new_id = input_edge.id() + '_' + i;
        var new_edge = createConcatenatedEdge(edges, cy, new_id);
        new_edge.data.type = 'inclusion';
        new_edge.classes = 'inverse-of';
        cy.add(new_edge);
        cy.remove(edge);
        new_edges_count += 1;
      });

      if (new_edges_count > 1) {
        cy.remove(input_edge);
        makeDummyPoint(role_inverse);
        role_inverse.data('label', 'inverse Of');
        role_inverse.data('labelXpos', 0);
        role_inverse.data('labelYpos', 0);
        role_inverse.data('text_background', true);
      } else {
        if (input_edge.source()) input_edge.source().connectedEdges('edge.inverse-of').data('displayed_name', 'inverse Of');
        cy.remove(role_inverse);
      }
    });
  } // -------- FLOAT ----------


  function simplifyDiagramFloat(nodes, edges) {
    var cy = cytoscape();
    cy.add(nodes);
    cy.add(edges);
    simplifyRolesFloat(cy);
    simplifyHierarchiesFloat(cy);
    simplifyAttributesFloat(cy);
    cy.edges().removeData('segment_distances');
    cy.edges().removeData('segment_weights');
    cy.edges().removeData('target_endpoint');
    cy.edges().removeData('source_endpoint');
    cy.$('[type = "concept"]').addClass('bubble');
    return cy.$('*');
  }

  function simplifyRolesFloat(cy) {
    var eles = cy.$('[type = "role"]');
    eles.forEach(function (role) {
      var edges = role.incomers('edge.role');
      var domains = edges.filter('.domain');
      var range_nodes = edges.filter('.range').sources();
      domains.forEach(function (domain) {
        range_nodes.forEach(function (target, i) {
          var new_edge = {
            data: {
              id: domain.id() + '-' + i,
              id_xml: domain.target().data('id_xml'),
              diagram_id: domain.target().data('diagram_id'),
              source: domain.source().id(),
              target: target.id(),
              type: domain.target().data('type'),
              iri: domain.target().data('iri'),
              displayed_name: domain.target().data('displayed_name'),
              label: domain.target().data('label'),
              description: domain.target().data('description'),
              functional: domain.target().data('functional'),
              inverseFunctional: domain.target().data('inverseFunctional'),
              asymmetric: domain.target().data('asymmetric'),
              irreflexive: domain.target().data('irreflexive'),
              reflexive: domain.target().data('reflexive'),
              symmetric: domain.target().data('symmetric'),
              transitive: domain.target().data('transitive')
            },
            classes: 'role predicate'
          };
          cy.add(new_edge);

          if (cy.getElementById(new_edge.data.id).isLoop()) {
            var loop_edge = cy.getElementById(new_edge.data.id);
            loop_edge.data('control_point_step_size', target.data('width'));
          }
        });
      });
      cy.remove(role);
    });
  }

  function simplifyHierarchiesFloat(cy) {
    cy.$('.dummy').forEach(function (dummy) {
      dummy.neighborhood('node').forEach(function (neighbor) {
        neighbor.position(dummy.position());
      });
      dummy.data('width', 35);
      dummy.addClass('bubble');
    });
  }

  function simplifyAttributesFloat(cy) {
    cy.$('[type = "attribute"]').forEach(function (attribute) {
      attribute.neighborhood('node').forEach(function (neighbor) {
        attribute.position(neighbor.position());
      });
    });
  }
}

const preferences={entity_name:{type:"list",title:"Entities Name",label:"Select the type of name to display on entities",selected:"label",list:[{value:"label",label:"Label"},{value:"prefixed",label:"Prefixed IRI"},{value:"full",label:"Full IRI"}]},language:{type:"list",title:"Language",label:"Select the preferred language",selected:"",list:[]}};const rendering={theme:{type:"list",title:"Themes",label:"Select a theme",selected:"gscape",list:[{value:"gscape",label:"Light"},{value:"dark",label:"Dark"},{value:"classic",label:"Graphol"}]}};const widgets={explorer:{title:"Ontology Explorer",type:"boolean",enabled:true,label:"Enable Ontology Explorer widget"},details:{type:"boolean",title:"Entity Details",enabled:true,label:"Enable Entity Details widget"},owl_translator:{type:"boolean",title:"OWL Translator",enabled:true,label:"Enable Owl Translation widget"},filters:{type:"boolean",title:"Filters",enabled:true,label:"Enable Filters widget",filter_list:{all:{selector:"#undefined",label:"Filter All",active:false,disabled:false,"class":"undefined"},attributes:{selector:"[type = \"attribute\"]",label:"Attributes",active:false,disabled:false,"class":"filterattributes"},value_domain:{selector:"[type = \"value-domain\"]",label:"Value Domain",active:false,disabled:false,"class":"filtervaluedomains"},individuals:{selector:"[type = \"individual\"]",label:"Individuals",active:false,disabled:false,"class":"filterindividuals"},universal_quantifier:{selector:"[type $= \"-restriction\"][displayed_name = \"forall\"]",label:"Universal Quantifier",active:false,disabled:false,"class":"filterforall"},not:{selector:"[type = \"complement\"]",label:"Not",active:false,disabled:false,"class":"filtercomplements"}}},simplifications:{type:"boolean",title:"Simplifications",enabled:true,label:"Allow ontology simplification widget"},occurrences_list:{type:"boolean",title:"Entity Occurrences",enabled:true,label:"Enable entity occurrences list widget"}};var config = {preferences:preferences,rendering:rendering,widgets:widgets};

var default_config = /*#__PURE__*/Object.freeze({
  __proto__: null,
  preferences: preferences,
  rendering: rendering,
  widgets: widgets,
  'default': config
});

var GrapholscapeController = /*#__PURE__*/function () {
  function GrapholscapeController(ontology) {
    var _this = this;

    var view = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var custom_config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    _classCallCheck(this, GrapholscapeController);

    this.view = view;
    this._ontology = ontology;
    this.config = JSON.parse(JSON.stringify(default_config)); //create copy

    if (custom_config) this.setConfig(custom_config); // update default config, if passed
    // set language

    this.config.preferences.language.list = ontology.languages.map(function (lang) {
      return {
        "label": lang,
        "value": lang
      };
    });
    this.default_language = ontology.default_language; // if not selected in config, select default

    var selected_language = this.config.preferences.language.selected;
    if (selected_language == '') this.config.preferences.language.selected = this.default_language;else {
      // if language is not supported by ontology, add it in the list
      // only for consistency : user defined it so he wants to see it
      if (!ontology.languages.includes(selected_language)) this.config.preferences.language.list.push({
        "label": selected_language + ' - unsupported',
        "value": selected_language
      });
    }
    this.ontologies = {
      "default": ontology,
      lite: null,
      "float": null
    };
    this.owl_translator = new OwlTranslator();
    this.actualMode = 'default';
    this.SimplifiedOntologyPromise = computeSimplifiedOntologies(ontology).then(function (result) {
      _this.ontologies.lite = result.lite;
      _this.ontologies["float"] = result["float"];
    })["catch"](function (reason) {
      console.log(reason);
    });
    if (this.config.preferences.entity_name.selected != preferences.entity_name.selected) this.onEntityNameTypeChange(this.config.preferences.entity_name.selected);
    if (this.config.preferences.language.selected != preferences.language.selected) this.onLanguageChange(this.config.preferences.language.selected);
  }
  /**
   * Initialize controller
   *  - bind all event listener for the view
   *  - create all widgets with actual config and ontology infos
   */


  _createClass(GrapholscapeController, [{
    key: "init",
    value: function init() {
      var _this2 = this;

      var diagramsModelData = this.ontology.diagrams;
      var entitiesModelData = this.ontology.getEntities();
      var diagramsViewData = diagramsModelData.map(function (diagram) {
        return _this2.diagramModelToViewData(diagram);
      });
      var entitiesViewData = entitiesModelData.map(function (entity) {
        return _this2.entityModelToViewData(entity);
      });
      var ontologyViewData = {
        name: this.ontology.name,
        version: this.ontology.version,
        namespaces: this.ontology.namespaces,
        annotations: this.ontology.annotations,
        description: this.ontology.description
      }; // event handlers

      this.view.onDiagramChange = this.onDiagramChange.bind(this);
      this.view.onNodeNavigation = this.onNodeNavigation.bind(this);
      this.view.onEntitySelection = this.onEntitySelection.bind(this);
      this.view.onNodeSelection = this.onNodeSelection.bind(this);
      this.view.onBackgroundClick = this.onBackgroundClick.bind(this);
      this.view.onEdgeSelection = this.onEdgeSelection.bind(this);
      this.view.onRenderingModeChange = this.onRenderingModeChange.bind(this);
      this.view.onEntityNameTypeChange = this.onEntityNameTypeChange.bind(this);
      this.view.onLanguageChange = this.onLanguageChange.bind(this);
      this.view.createUi(ontologyViewData, diagramsViewData, entitiesViewData, this.config);
    }
    /**
     * Event handler for clicks on empty area of the graph.
     * It collapse all widgets' body.
     */

  }, {
    key: "onBackgroundClick",
    value: function onBackgroundClick() {
      this.view.blurAll();
    }
    /**
     * Activate one of the defined filters.
     * @param {String} type - one of `all`, `attributes`, `value-domain`, `individuals`, `universal`, `not`
     */

  }, {
    key: "filter",
    value: function filter(type) {
      this.view.filter(type);
    }
    /*
     * Event handler for the click on a node in the explorer widget.
     * Focus on the node and show its details
     * @param {String} node_id - the id of the node to navigate to
     */

  }, {
    key: "onNodeNavigation",
    value: function onNodeNavigation(node_id) {
      var node = this.ontology.getElem(node_id);
      this.centerOnNode(node, 1.5);
      this.showDetails(node);
    }
    /*
     * Event handler for a digram change.
     * @param {string} diagram_index The index of the diagram to display
     */

  }, {
    key: "onDiagramChange",
    value: function onDiagramChange(diagram_index) {
      var diagram = this.ontology.getDiagram(diagram_index);
      this.showDiagram(diagram);
    }
    /**
     * Display a diagram on the screen.
     * @param {JSON | string | number} diagramModelData The diagram retrieved from model, its name or it's id
     */

  }, {
    key: "showDiagram",
    value: function showDiagram(diagramModelData) {
      if (typeof diagramModelData == 'string' || typeof diagramModelData == 'number') {
        diagramModelData = this.ontology.getDiagram(diagramModelData);
      }

      if (!diagramModelData) this.view.showDialog('error', "Diagram not existing");
      var diagramViewData = this.diagramModelToViewData(diagramModelData);
      this.view.drawDiagram(diagramViewData);
    }
    /*
     * Event Handler for an entity selection.
     * @param {String} entity_id - The Id of the selected entity
     * @param {Boolean} unselect - Flag for unselecting elements on graph
     */

  }, {
    key: "onEntitySelection",
    value: function onEntitySelection(entity_id, unselect) {
      var entity = this.ontology.getElem(entity_id);
      this.showDetails(entity, unselect);
    }
    /**
     * Show to the user the details of an entity.
     * @param {JSON} entityModelData The entity retrieved from model.
     * @param {Boolean} unselect - Flag for unselecting elements on graph. Default `false`.
     */

  }, {
    key: "showDetails",
    value: function showDetails(entityModelData) {
      var _this3 = this;

      var unselect = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (this.config.widgets.details.enabled || this.config.widgets.occurrences_list.enabled) {
        var entityViewData = this.entityModelToViewData(entityModelData); // retrieve all occurrences and construct a list of pairs { elem_id , diagram_id }

        entityViewData.occurrences = this.ontology.getOccurrences(entityViewData.iri.full_iri).map(function (elem) {
          return {
            id: elem.data.id,
            id_xml: elem.data.id_xml,
            diagram_id: elem.data.diagram_id,
            diagram_name: _this3.ontology.getDiagram(elem.data.diagram_id).name
          };
        });
        if (this.config.widgets.details.enabled) this.view.showDetails(entityViewData, unselect);
        if (this.config.widgets.occurrences_list.enabled) this.view.showOccurrences(entityViewData.occurrences, unselect);
      }
    }
  }, {
    key: "onEdgeSelection",
    value: function onEdgeSelection(edge_id, diagram_id) {
      /*
       * To be refactored.
       * Owl Translator uses cytoscape representation for navigating the graph.
       * We need then the node as a cytoscape object and not as plain json.
       */
      var edge_cy = this.ontology.getElemByDiagramAndId(edge_id, diagram_id, false);
      if (edge_cy) this.showOwlTranslation(edge_cy);
      this.view.hideWidget('details');
      this.view.hideWidget('occurrences_list'); // show details on roles in float mode

      if (this.actualMode == 'float') {
        var edge = this.ontology.getElemByDiagramAndId(edge_id, diagram_id);

        if (edge.classes.includes('predicate')) {
          this.showDetails(edge, false);
        }
      }
    }
    /*
     * Event handler for a node selection on the graph.
     * Show the details and owl translation if the node is an entity, hide it otherwise.
     * @param {String} node_id - The id of the node to center on
     * @param {string} diagram_id - The id of the diagram containing the element
     */

  }, {
    key: "onNodeSelection",
    value: function onNodeSelection(node_id, diagram_id) {
      var node = this.ontology.getElemByDiagramAndId(node_id, diagram_id);

      if (!node) {
        console.error('Unable to find the node with {id= ' + node_id + '} in the ontology');
        return;
      }

      if (node.classes.includes('predicate')) {
        this.showDetails(node, false);
      } else {
        this.view.hideWidget('details');
        this.view.hideWidget('occurrences_list');
      }
      /*
       * To be refactored.
       * Owl Translator uses cytoscape representation for navigating the graph.
       * We need then the node as a cytoscape object and not as plain json.
       */


      var node_cy = this.ontology.getElemByDiagramAndId(node_id, diagram_id, false);
      this.showOwlTranslation(node_cy);
    }
    /**
     * Focus on a single node and zoom on it.
     * If necessary it also display the diagram containing the node.
     * @param {JSON} nodeModelData - The node retrieved from model
     * @param {Number} zoom - The zoom level to apply
     */

  }, {
    key: "centerOnNode",
    value: function centerOnNode(nodeModelData, zoom) {
      if (this.view.actual_diagram_id != nodeModelData.data.diagram_id) {
        var diagram = this.ontology.getDiagram(nodeModelData.data.diagram_id);
        this.showDiagram(diagram);
      }

      var nodeViewData = {
        id: nodeModelData.data.id,
        position: nodeModelData.position
      };
      this.view.centerOnNode(nodeViewData, zoom);
    }
    /**
     * Get OWL translation from a node and give the result to the view.
     * To be refactored.
     * @param {object} elem - Cytoscape representation of a node or a edge
     */

  }, {
    key: "showOwlTranslation",
    value: function showOwlTranslation(elem) {
      if (this.config.widgets.owl_translator.enabled) {
        var owl_text = null;
        if (elem.isNode()) owl_text = this.owl_translator.nodeToOwlString(elem, true);else if (elem.isEdge()) owl_text = this.owl_translator.edgeToOwlString(elem);
        this.view.showOwlTranslation(owl_text);
      }
    }
  }, {
    key: "onRenderingModeChange",
    value: function onRenderingModeChange(mode, state) {
      var _this4 = this;

      this.actualMode = mode;

      switch (mode) {
        case 'lite':
        case 'float':
          {
            this.SimplifiedOntologyPromise.then(function () {
              if (_this4.actualMode === mode) {
                _this4.ontology = _this4.ontologies[mode];

                _this4.updateGraphView(state);

                _this4.updateEntitiesList();
              }
            });
            break;
          }

        case 'default':
          {
            this.ontology = this.ontologies["default"];
            this.updateGraphView(state);
            this.updateEntitiesList();
            break;
          }
      }
    }
    /**
     * Change the rendering mode.
     * @param {string} mode - the rendering/simplifation mode to activate: `graphol`, `lite`, or `float`
     * @param {boolean} keep_viewport_state - if `false`, viewport will fit on diagram.
     * Set it `true` if you don't want the viewport state to change.
     * In case of no diagram displayed yet, it will be forced to `false`.
     * Default: `true`.
     *
     * > Note: in case of activation or deactivation of the `float` mode, this value will be ignored.
     */

  }, {
    key: "changeRenderingMode",
    value: function changeRenderingMode(mode) {
      var keep_viewport_state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      this.view.changeRenderingMode(mode, keep_viewport_state);
      this.view.widgets.get('simplifications').actual_mode = mode;
    }
    /**
     * Redraw actual diagram and set viewport state. If state is not passed, viewport is not changed.
     * @param {object} state - object representation of **rendered position** in [cytoscape format](https://js.cytoscape.org/#notation/position).
     *
     * > Example: { x: 0, y: 0, zoom: 1} - initial state
     */

  }, {
    key: "updateGraphView",
    value: function updateGraphView(state) {
      this.onDiagramChange(this.view.actual_diagram_id);
      if (state) this.view.setViewPort(state);
    }
    /**
     * Update the entities list in the ontology explorer widget
     */

  }, {
    key: "updateEntitiesList",
    value: function updateEntitiesList() {
      var _this5 = this;

      var entitiesViewData = this.ontology.getEntities().map(function (entity) {
        return _this5.entityModelToViewData(entity);
      });
      this.view.updateEntitiesList(entitiesViewData);
    }
    /*
     * Set the kind of displayed name for entities.
     * Then refresh diagram and entities list
     * @param {string} - type accepted values: `label` | `full` | `prefixed`
     */

  }, {
    key: "onEntityNameTypeChange",
    value: function onEntityNameTypeChange(type) {
      var _this6 = this;

      this.SimplifiedOntologyPromise.then(function () {
        Object.keys(_this6.ontologies).forEach(function (key) {
          var entities = _this6.ontologies[key].getEntities(false); // get cytoscape nodes


          switch (type) {
            case 'label':
              entities.forEach(function (entity) {
                if (entity.data('label')[_this6.language]) entity.data('displayed_name', entity.data('label')[_this6.language]);else if (entity.data('label')[_this6.default_language]) entity.data('displayed_name', entity.data('label')[_this6.default_language]);else {
                  var first_label_key = Object.keys(entity.data('label'))[0];
                  entity.data('displayed_name', entity.data('label')[first_label_key]);
                }
              });
              break;

            case 'full':
              entities.forEach(function (entity) {
                entity.data('displayed_name', entity.data('iri').full_iri);
              });
              break;

            case 'prefixed':
              entities.forEach(function (entity) {
                var prefixed_iri = entity.data('iri').prefix + entity.data('iri').remaining_chars;
                entity.data('displayed_name', prefixed_iri);
              });
              break;
          }
        });

        _this6.updateGraphView(_this6.view.renderer.getActualPosition());

        _this6.updateEntitiesList();
      });
    }
    /*
     * Update selected language in config and set displayed names accordingly
     * Then refresh diagram and entities list
     * @param {string} - language
     */

  }, {
    key: "onLanguageChange",
    value: function onLanguageChange(language) {
      this.config.preferences.language.selected = language; // update displayed names (if label is selected then update the label language)

      this.onEntityNameTypeChange(this.config.preferences.entity_name.selected);
    }
  }, {
    key: "setConfig",
    value: function setConfig(new_config) {
      var _this7 = this;

      Object.keys(new_config).forEach(function (entry) {
        // if custom theme
        if (entry == 'theme' && _typeof(new_config[entry]) == 'object') {
          _this7.view.setCustomTheme(new_config[entry]);

          _this7.config.rendering.theme.list.push({
            value: 'custom',
            label: 'Custom'
          });

          _this7.config.rendering.theme.selected = 'custom';
          return; // continue to next entry and skip next for
        }

        for (var area in _this7.config) {
          try {
            var setting = _this7.config[area][entry];

            if (setting) {
              // apply custom settings only if they match type and are defined in lists
              if (setting.type == 'boolean' && typeof new_config[entry] == 'boolean') _this7.config[area][entry].enabled = new_config[entry];else if (_this7.config[area][entry].list.map(function (elm) {
                return elm.value;
              }).includes(new_config[entry])) _this7.config[area][entry].selected = new_config[entry];
            }
          } catch (e) {}
        }
      });
    }
  }, {
    key: "entityModelToViewData",
    value: function entityModelToViewData(entityModelData) {
      var language_variant_properties = ["label"];

      for (var _i = 0, _language_variant_pro = language_variant_properties; _i < _language_variant_pro.length; _i++) {
        var property = _language_variant_pro[_i];

        if (entityModelData.data[property]) {
          if (entityModelData.data[property][this.language]) language_variant_properties[property] = entityModelData.data[property][this.language];else if (entityModelData.data[property][this.default_language]) {
            language_variant_properties[property] = entityModelData.data[property][this.default_language];
          } else {
            var _iterator = _createForOfIteratorHelper(this.languagesList),
                _step;

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                var lang = _step.value;

                if (entityModelData.data[property][lang]) {
                  language_variant_properties[property] = entityModelData.data[property][lang];
                  break;
                }
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
          }
        }
      }

      var entityViewData = {
        id: entityModelData.data.id,
        id_xml: entityModelData.data.id_xml,
        diagram_id: entityModelData.data.diagram_id,
        label: language_variant_properties.label,
        displayed_name: entityModelData.data.displayed_name,
        type: entityModelData.data.type,
        iri: entityModelData.data.iri,
        description: entityModelData.data.description,
        annotations: entityModelData.data.annotations,
        functional: entityModelData.data.functional,
        inverseFunctional: entityModelData.data.inverseFunctional,
        asymmetric: entityModelData.data.asymmetric,
        irreflexive: entityModelData.data.irreflexive,
        reflexive: entityModelData.data.reflexive,
        symmetric: entityModelData.data.symmetric,
        transitive: entityModelData.data.transitive
      };
      return JSON.parse(JSON.stringify(entityViewData));
    }
  }, {
    key: "diagramModelToViewData",
    value: function diagramModelToViewData(diagramModelData) {
      var diagramViewData = {
        name: diagramModelData.name,
        id: diagramModelData.id,
        nodes: diagramModelData.nodes,
        edges: diagramModelData.edges
      };
      return JSON.parse(JSON.stringify(diagramViewData));
    }
  }, {
    key: "ontology",
    set: function set(ontology) {
      this._ontology = ontology;
    },
    get: function get() {
      return this._ontology;
    }
    /**
     * Setter.
     * Set the callback function for wiki redirection given an IRI
     * @param {Function} callback - the function to call when redirecting to a wiki page.
     * The callback will receive the IRI.
     */

  }, {
    key: "onWikiClick",
    set: function set(callback) {
      this._onWikiClick = callback;
      this.view.onWikiClick = callback;
    },
    get: function get() {
      return this._onWikiClick;
    }
    /**
     * Getter
     * @returns {string} - selected language
     */

  }, {
    key: "language",
    get: function get() {
      return this.config.preferences.language.selected;
    }
    /**
     * Getter
     * @returns {Array} - languages defined in the ontology
     */

  }, {
    key: "languagesList",
    get: function get() {
      return this.config.preferences.language.list.map(function (lang) {
        return lang.value;
      });
    }
    /**
     * Getter
     * @returns {Diagram} - the diagram displayed
     */

  }, {
    key: "actual_diagram",
    get: function get() {
      return this.ontology.getDiagram(this.view.actual_diagram_id);
    }
  }]);

  return GrapholscapeController;
}();

cytoscape.use(popper);
cytoscape.use(cola);

var GrapholScape = /*#__PURE__*/function () {
  function GrapholScape(file) {
    var _this = this;

    var container = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    _classCallCheck(this, GrapholScape);

    this.readGraphol(file).then(function (result) {
      _this._ontology = result;
    })["catch"](function (error) {
      console.error(error);
    });

    if (container) {
      return this.init(container, config);
    }
  }

  _createClass(GrapholScape, [{
    key: "init",
    value: function init(container) {
      var _this2 = this;

      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.view = new GrapholscapeView(container);
      return new Promise(function (resolve, reject) {
        _this2.readFilePromise.then(function () {
          _this2.controller = new GrapholscapeController(_this2._ontology, _this2.view, config);

          _this2.controller.init();

          resolve(_this2.controller);
        })["catch"](function (reason) {
          _this2.view.showDialog(reason.name, reason.message);

          reject(reason);
        })["finally"](function () {
          return _this2.view.spinner.hide();
        });
      });
    }
  }, {
    key: "readGraphol",
    value: function readGraphol(file) {
      this.readFilePromise = new Promise(function (resolve, reject) {
        var result = null;

        if (_typeof(file) === 'object') {
          var reader = new FileReader();

          reader.onloadend = function () {
            try {
              result = getResult(reader.result);
            } catch (error) {
              reject(error);
            }

            resolve(result);
          };

          reader.readAsText(file);
          setTimeout(function () {
            reject('Error: timeout expired');
          }, 10000);
        } else if (typeof file === 'string') {
          result = getResult(file);
          resolve(result);
        } else {
          reject('Err: Grapholscape needs a Graphol File or the corresponding string to be initialized');
        }
      });
      return this.readFilePromise;

      function getResult(file) {
        var graphol_parser = new GrapholParser(file);
        return graphol_parser.parseGraphol();
      }
    }
  }]);

  return GrapholScape;
}();

export default GrapholScape;
