/**
 * Poulet.js v0.0.5
 * (c) 2017 Alex Toudic
 * Released under MIT License.
 **/

import { kebabCase, uniqueId } from 'lodash';
import { addClass, closest, find, forEach, forIn, getAttr, getElement, getProp, on, parents, removeClass, setProp, setStyleProp } from 'chirashi';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};



















var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var Observer = function () {
  function Observer(domElement) {
    classCallCheck(this, Observer);

    this._observer = new MutationObserver(this._update.bind(this));

    this._observer.observe(domElement, {
      childList: true,
      subtree: true
    });

    this._listeners = [];
  }

  createClass(Observer, [{
    key: 'on',
    value: function on$$1(callback) {
      this._listeners.push(callback);
    }
  }, {
    key: 'off',
    value: function off(callback) {
      this._listeners.splice(this._listeners.indexOf(callback), 1);
    }
  }, {
    key: '_update',
    value: function _update() {
      forEach(this._listeners, function (listener) {
        return listener();
      });
    }
  }]);
  return Observer;
}();

var get$1 = function (obj, key) {
  var keys = key.split('.');
  key = keys.pop();
  var n = keys.length;
  for (var i = 0; i < n; ++i) {
    obj = obj[keys[i]];
  }

  return obj[key];
};

function _copyAccessor(key, to, from) {
  Object.defineProperty(to, key, Object.getOwnPropertyDescriptor(from, key));
}

var _arrayChangingMethods = ['push', 'splice', 'unshift'];

function _defineReactive(watchers, watchKey, output, key, value) {
  watchKey += key;

  watchers[watchKey] = {};

  Object.defineProperty(output, key, {
    get: function get$$1() {
      return value;
    },
    set: function set$$1(newValue) {
      forIn(watchers[watchKey], function (key, options) {
        return options.beforeChange();
      });

      value = newValue;

      if ((typeof newValue === 'undefined' ? 'undefined' : _typeof(newValue)) === 'object') {
        forIn(newValue, _defineReactive.bind(null, watchers, watchKey + '.', output[key]));
      }

      forIn(watchers[watchKey], function (key, options) {
        return options.afterChange();
      });

      if (value instanceof Array) {
        forEach(_arrayChangingMethods, function (method) {
          value[method] = function () {
            forIn(watchers[watchKey], function (key, options) {
              if (options.deep) options.beforeChange();
            });

            var ret = Array.prototype[method].apply(this, arguments);

            forIn(watchers[watchKey], function (key, options) {
              if (options.deep) options.afterChange();
            });

            return ret;
          };
        });
      }
    }
  });

  output[key] = value;
}



var Mixins = Object.freeze({

});

function lifeCycleMerger(base, mixin) {
  if (!base) return mixin;

  if (!(base instanceof Array)) base = [base];
  if (!(mixin instanceof Array)) mixin = [mixin];

  return [].concat(toConsumableArray(base), toConsumableArray(mixin));
}

var merger = {
  mounted: lifeCycleMerger,
  beforeDestroy: lifeCycleMerger,
  default: function _default(base, mixin) {
    if ((typeof base === 'undefined' ? 'undefined' : _typeof(base)) === 'object' && (typeof mixin === 'undefined' ? 'undefined' : _typeof(mixin)) === 'object') {
      return _extends({}, mixin, base);
    }

    return base || mixin;
  },

  mixins: function mixins(base) {
    return base;
  }
};

function _mergeOptions(base, mixin) {
  forIn(mixin, function (key, value) {
    if (key in merger) {
      base[key] = merger[key](base[key], value);
    } else {
      base[key] = merger.default(base[key], value);
    }
  });
}

function _mergeMixins(options) {
  var result = _extends({}, options);

  forEach(result.mixins, function (mixin, index) {
    if (typeof mixin === 'string') {
      mixin = Mixins[mixin];
    }

    if ('mixins' in options) {
      mixin = _mergeMixins(mixin);
    }

    _mergeOptions(result, mixin);
  });

  return result;
}

var lifeCycle = ['mounted', 'beforeDestroy'];

var Component = function () {
  function Component() {
    var globals = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, Component);

    Object.assign(this, globals);
    this.$options = options;

    this.$id = this._generateId();

    this.$options = _mergeMixins(this.$options);

    this.$scope = {};

    this._bindLifeCycle();
    this._bindData();
    this._bindMethods();
  }

  createClass(Component, [{
    key: '_bindData',
    value: function _bindData() {
      var _this = this;

      this.$data = {};

      this._watchers = {};
      forIn(this.$options.data, function (key, value) {
        _defineReactive(_this._watchers, '', _this.$data, key, value);
        _copyAccessor(key, _this, _this.$data);
        _copyAccessor(key, _this.$scope, _this.$data);
      });
    }
  }, {
    key: '_bindMethods',
    value: function _bindMethods() {
      var _this2 = this;

      this.$methods = {};
      forIn(this.$options.methods, function (name, callback) {
        _this2.$methods[name] = callback.bind(_this2);
      });

      Object.assign(this, this.$methods);
      Object.assign(this.$scope, this.$methods);
    }
  }, {
    key: '_generateId',
    value: function _generateId() {
      return uniqueId('' + this.$prefix + this.$options.name + '-');
    }
  }, {
    key: '_bindLifeCycle',
    value: function _bindLifeCycle() {
      var _this3 = this;

      forEach(lifeCycle, function (method) {
        _this3[method] = function () {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          forEach(_this3.$options[method], function (callback) {
            return callback.apply(_this3, args);
          });
        };
      });
    }
  }, {
    key: '$watch',
    value: function $watch(key, callback) {
      var _this4 = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { deep: false, immediate: false };

      var watcherId = uniqueId(this.$id + '-' + key + '-');

      if (typeof callback === 'string') callback = this.$scope[callback];

      var oldValue = {
        value: null
      };

      options.beforeChange = function () {
        var old = get$1(_this4.$scope, key);

        if (old instanceof Array) {
          oldValue.value = [].concat(toConsumableArray(old));
        } else if ((typeof old === 'undefined' ? 'undefined' : _typeof(old)) === 'object') {
          oldValue.value = _extends({}, old);
        } else {
          oldValue.value = old;
        }
      };

      options.afterChange = function () {
        callback(get$1(_this4.$scope, key), oldValue.value);
      };

      if (key in this._watchers) {
        this._watchers[key][watcherId] = options;

        if (options.deep) {
          var keyRoot = key + '.';
          if (_typeof(get$1(this.$scope, key)) === 'object') {
            forIn(this._watchers, function (watchKey, watchers) {
              if (watchKey.indexOf(keyRoot) === 0) {
                _this4._watchers[watchKey][watcherId] = options;
              }
            });
          }
        }
      }

      if (options.immediate) {
        options.afterChange();
      }

      return function () {
        if (options.deep) {
          if (_typeof(get$1(_this4.$scope, key)) === 'object') {
            forIn(_this4._watchers, function (watchKey, watchers) {
              delete _this4._watchers[watchKey][watcherId];
            });
          }
        } else {
          if (key in _this4._watchers) {
            delete _this4._watchers[key][watcherId];
          }
        }
      };
    }
  }, {
    key: '$mount',
    value: function $mount(el) {
      this.$el = getElement(el);

      this.$el[this.$marker] = this.$id;

      this.mounted(el);
    }
  }, {
    key: '$destroy',
    value: function $destroy() {
      this.beforeDestroy();
    }
  }]);
  return Component;
}();

var stringRegex = /([\w-_.\s]+)/g;
var quote = /["']/g;

function stringParser(input) {
  var props = [];
  var inquote = false;
  var inobject = false;
  var leftobject = false;
  var nbQuotes = 0;

  var segments = input.split(/\s/g);
  forEach(segments, function (segment, index) {
    var quotes = segment.match(quote);
    if (!inquote && quotes) {
      inquote = true;
    }

    if (!inobject && segment.indexOf('{') !== -1) {
      inobject = true;
      leftobject = true;
    }

    if (inobject && segment.indexOf(',') === 0) {
      leftobject = true;
    }

    if (!inquote && !leftobject) {
      var variable = segment.match(stringRegex);

      if (variable) {
        variable = variable[0];

        if (isNaN(+variable)) {
          props.push(variable);
          segments[index] = segment.replace(variable, '$scope.' + variable);
        }
      }
    }

    if (quotes) nbQuotes += quotes.length;
    if (quotes && nbQuotes % 2 === 0) {
      inquote = false;
    }

    if (inobject && segment.indexOf(':') !== -1) {
      leftobject = false;
    }

    if (inobject && segment.indexOf(',') !== -1) {
      leftobject = true;
    }

    if (inobject && segment.indexOf('}') !== -1) {
      inobject = false;
    }
  });

  return { template: segments.join(' '), props: props };
}

var lifeCycle$1 = ['bind', 'update', 'unbind'];

var Directive = function () {
  function Directive() {
    var globals = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, Directive);

    Object.assign(this, globals);
    this.$options = options;

    this.$update = this.$update.bind(this);

    this.$id = this._generateId();

    this._bindLifeCycle();
  }

  createClass(Directive, [{
    key: '_generateId',
    value: function _generateId() {
      return uniqueId('' + this.$prefix + this.$options.name + '-');
    }
  }, {
    key: '_bindLifeCycle',
    value: function _bindLifeCycle() {
      var _this = this;

      forEach(lifeCycle$1, function (method) {
        _this[method] = function () {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          forEach(_this.$options[method], function (callback) {
            return callback.apply(_this, args);
          });
        };
      });
    }
  }, {
    key: '_eval',
    value: function _eval(string) {
      return (0, eval)('(function ($scope) { return ' + string + '; })')(this.$scope);
    }
  }, {
    key: '$bind',
    value: function $bind(el, option) {
      var _this2 = this;

      this.$el = getElement(el);

      this.$option = stringParser(option);

      var closests = [this.$el].concat(toConsumableArray(parents(this.$el)));
      var parent = void 0;
      var i = 0;
      while ((parent = closests[i++]) && !(this.$marker in parent)) {}

      this.$component = this.$components[parent[this.$marker]];

      if (this.bind) this.bind(el);

      this.unwatchers = [];
      if (this.$option.props.length) {
        forEach(this.$option.props, function (prop) {
          _this2.unwatchers.push(_this2.$component.$watch(prop, _this2.$update, { immediate: true }));
        });
      } else {
        this.$update();
      }
    }
  }, {
    key: '$update',
    value: function $update() {
      if (this.update) this.update(this._eval(this.$option.template));
    }
  }, {
    key: '$unbind',
    value: function $unbind() {
      forEach(this.unwatchers, function (unwatch) {
        unwatch();
      });

      if (this.unbind) this.unbind();
    }
  }, {
    key: '$scope',
    get: function get$$1() {
      return this.$component.$scope;
    }
  }]);
  return Directive;
}();

var Class = {
  bind: function bind() {
    this.currentClasses = [];
  },
  update: function update(value) {
    var newClasses = void 0;

    if (typeof value === 'string') {
      newClasses = [value];
    } else if ('length' in value) {
      newClasses = value;
    } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
      newClasses = Object.keys(value).filter(function (className) {
        return value[className];
      });
    }

    var removeClasses = this.currentClasses.filter(function (className) {
      return newClasses.indexOf(className) === -1;
    });

    if (newClasses.length) addClass.apply(undefined, [this.$el].concat(toConsumableArray(newClasses)));
    if (removeClasses.length) removeClass.apply(undefined, [this.$el].concat(toConsumableArray(removeClasses)));

    this.currentClasses = newClasses;
  }
};

var Html = {
  update: function update(innerHTML) {
    setProp(this.$el, { innerHTML: innerHTML });
  }
};

var set$1 = function (obj, key, value) {
  var keys = key.split('.');
  key = keys.pop();
  var n = keys.length;
  for (var i = 0; i < n; ++i) {
    obj = obj[keys[i]];
  }

  return obj[key] = value;
};

var Model = {
  bind: function bind(el) {
    var _this = this;

    this.type = getProp(el, 'type');

    this.inputChanged = function () {
      var newValue = void 0;
      switch (_this.type) {
        case 'checkbox':
          newValue = getProp(_this.$el, 'checked');
          break;

        default:
          newValue = getProp(_this.$el, 'value');
      }

      if (newValue === _this.currentValue) return;

      _this.currentValue = newValue;

      set$1(_this.$scope, _this.model, _this.currentValue);
    };

    this.offObj = on(el, {
      'keyup blur change': this.inputChanged
    });
  },
  update: function update(newValue) {
    if (newValue === this.currentValue) return;

    this.model = this.$option.props[0];

    this.currentValue = newValue;

    switch (this.type) {
      case 'checkbox':
        setProp(this.$el, { checked: newValue });
        break;

      case 'radio':
        var selector = this.$options.selector.slice(0, -1) + '="' + this.model + '"]';
        setProp(selector, { checked: false });
        setProp(selector + '[value="' + newValue + '"]', { checked: true });
        break;

      default:
        setProp(this.$el, { value: newValue });
    }
  },
  unbind: function unbind() {
    this.offObj.off();
  }
};

var On = {
  unbind: function unbind() {
    if (this.off) this.off();
  },
  update: function update(options) {
    if (this.off) this.off();

    on(this.$el, options);
  }
};

console.log('setStyleProp', setStyleProp);

var Show = {
  update: function update(value) {
    setStyleProp(this.$el, {
      display: value ? 'block' : 'none'
    });
  }
};

var Text = {
  update: function update(textContent) {
    setProp(this.$el, { textContent: textContent });
  }
};



var Directives = Object.freeze({
	Class: Class,
	Html: Html,
	Model: Model,
	On: On,
	Show: Show,
	Text: Text
});

var defaultsGlobals = {
  $prefix: 'p-'
};

var defaults$$1 = {
  name: 'root'
};

var Core = function (_Component) {
  inherits(Core, _Component);

  function Core() {
    var globals = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, Core);

    globals = _extends({}, defaultsGlobals, globals);
    options = _extends({}, defaults$$1, options);

    var _this = possibleConstructorReturn(this, (Core.__proto__ || Object.getPrototypeOf(Core)).call(this, globals, options));

    _this.$components = defineProperty({}, _this.$id, _this);

    _this.$directives = {};

    _this.$gobals = _extends({}, globals, options, {
      $root: _this,
      $components: _this.$components,
      $directives: _this.$directives
    });

    _this.$gobals.$marker = _this.$marker = '_' + _this.$prefix + 'id';
    _this.$directivesMarker = '_' + _this.$prefix + 'directives';

    _this._components = [];
    _this._directives = [];

    forIn(Directives, _this.directive.bind(_this));
    return _this;
  }

  createClass(Core, [{
    key: 'component',
    value: function component(name, options) {
      name = kebabCase(name);

      var selector = 'selector' in options ? options.selector : '[' + this.$prefix + name + ']';

      this._components.push({
        selector: selector,
        options: _extends({
          name: name,
          selector: selector
        }, options)
      });
    }
  }, {
    key: 'directive',
    value: function directive(name, options) {
      name = kebabCase(name);

      var selector = 'selector' in options ? options.selector : '[' + this.$prefix + name + ']';

      this._directives.push({
        selector: selector,
        options: _extends({
          name: name,
          selector: selector
        }, options)
      });
    }
  }, {
    key: '$mount',
    value: function $mount(selector) {
      get(Core.prototype.__proto__ || Object.getPrototypeOf(Core.prototype), '$mount', this).call(this, selector);

      this._observer = new Observer(this.$el);
      this._observer.on(this._domChanged.bind(this));

      this._domChanged();
    }
  }, {
    key: '_domChanged',
    value: function _domChanged() {
      this._unbindComponents();
      this._unbindDirectives();
      this._bindComponents();
      this._bindDirectives();
    }
  }, {
    key: '_unbindComponents',
    value: function _unbindComponents() {
      var _this2 = this;

      forIn(this.$components, function (id, component) {
        if (!closest(component.$el, document.body)) {
          component.$destroy();
          delete _this2.$components[id];
        }
      });
    }
  }, {
    key: '_bindComponents',
    value: function _bindComponents() {
      var _this3 = this;

      forEach(this._components, function (component) {
        forEach(find(_this3.$el, component.selector), function (el) {
          if (_this3.$marker in el) return;

          var createdComponent = new Component(_this3.$gobals, component.options);
          createdComponent.$mount(el);
          _this3.$components[createdComponent.$id] = createdComponent;
        });
      });
    }
  }, {
    key: '_unbindDirectives',
    value: function _unbindDirectives() {
      var _this4 = this;

      forIn(this.$directives, function (id, directive) {
        if (!closest(directive.$el, document.body)) {
          directive.$unbind();
          delete _this4.$directives[id];
        }
      });
    }
  }, {
    key: '_bindDirectives',
    value: function _bindDirectives() {
      var _this5 = this;

      forEach(this._directives, function (directive) {
        forEach(find(_this5.$el, directive.selector), function (el) {
          if (!(_this5.$directivesMarker in el)) {
            el[_this5.$directivesMarker] = [];
          } else if (el[_this5.$directivesMarker].indexOf(directive.options.name) !== -1) {
            return;
          }

          el[_this5.$directivesMarker].push(directive.options.name);

          var createdDirective = new Directive(_this5.$gobals, directive.options);
          createdDirective.$bind(el, getAttr(el, '' + _this5.$gobals.$prefix + directive.options.name));
          _this5.$directives[createdDirective.$id] = createdDirective;
        });
      });
    }
  }]);
  return Core;
}(Component);

var Poulet = Object.assign(Core, { get: get$1, set: set$1 });

export default Poulet;
