/*! @sentry/browser & @sentry/tracing 7.51.1 (c9f66ed) | https://github.com/getsentry/sentry-javascript */
export var Sentry = (function (exports) {

    /**
     * This is a shim for the Replay integration.
     * It is needed in order for the CDN bundles to continue working when users add/remove replay
     * from it, without changing their config. This is necessary for the loader mechanism.
     */
    class ReplayShim  {
      /**
       * @inheritDoc
       */
       static __initStatic() {this.id = 'Replay';}
  
      /**
       * @inheritDoc
       */
       __init() {this.name = ReplayShim.id;}
  
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
       constructor(_options) {ReplayShim.prototype.__init.call(this);
        // eslint-disable-next-line no-console
        console.error('You are using new Replay() even though this bundle does not include replay.');
      }
  
      /** jsdoc */
       setupOnce() {
        // noop
      }
  
      /** jsdoc */
       start() {
        // noop
      }
  
      /** jsdoc */
       stop() {
        // noop
      }
  
      /** jsdoc */
       flush() {
        // noop
      }
    } ReplayShim.__initStatic();
  
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const objectToString = Object.prototype.toString;
  
    /**
     * Checks whether given value's type is one of a few Error or Error-like
     * {@link isError}.
     *
     * @param wat A value to be checked.
     * @returns A boolean representing the result.
     */
    function isError(wat) {
      switch (objectToString.call(wat)) {
        case '[object Error]':
        case '[object Exception]':
        case '[object DOMException]':
          return true;
        default:
          return isInstanceOf(wat, Error);
      }
    }
    /**
     * Checks whether given value is an instance of the given built-in class.
     *
     * @param wat The value to be checked
     * @param className
     * @returns A boolean representing the result.
     */
    function isBuiltin(wat, className) {
      return objectToString.call(wat) === `[object ${className}]`;
    }
  
    /**
     * Checks whether given value's type is ErrorEvent
     * {@link isErrorEvent}.
     *
     * @param wat A value to be checked.
     * @returns A boolean representing the result.
     */
    function isErrorEvent$1(wat) {
      return isBuiltin(wat, 'ErrorEvent');
    }
  
    /**
     * Checks whether given value's type is DOMError
     * {@link isDOMError}.
     *
     * @param wat A value to be checked.
     * @returns A boolean representing the result.
     */
    function isDOMError(wat) {
      return isBuiltin(wat, 'DOMError');
    }
  
    /**
     * Checks whether given value's type is DOMException
     * {@link isDOMException}.
     *
     * @param wat A value to be checked.
     * @returns A boolean representing the result.
     */
    function isDOMException(wat) {
      return isBuiltin(wat, 'DOMException');
    }
  
    /**
     * Checks whether given value's type is a string
     * {@link isString}.
     *
     * @param wat A value to be checked.
     * @returns A boolean representing the result.
     */
    function isString(wat) {
      return isBuiltin(wat, 'String');
    }
  
    /**
     * Checks whether given value is a primitive (undefined, null, number, boolean, string, bigint, symbol)
     * {@link isPrimitive}.
     *
     * @param wat A value to be checked.
     * @returns A boolean representing the result.
     */
    function isPrimitive(wat) {
      return wat === null || (typeof wat !== 'object' && typeof wat !== 'function');
    }
  
    /**
     * Checks whether given value's type is an object literal
     * {@link isPlainObject}.
     *
     * @param wat A value to be checked.
     * @returns A boolean representing the result.
     */
    function isPlainObject(wat) {
      return isBuiltin(wat, 'Object');
    }
  
    /**
     * Checks whether given value's type is an Event instance
     * {@link isEvent}.
     *
     * @param wat A value to be checked.
     * @returns A boolean representing the result.
     */
    function isEvent(wat) {
      return typeof Event !== 'undefined' && isInstanceOf(wat, Event);
    }
  
    /**
     * Checks whether given value's type is an Element instance
     * {@link isElement}.
     *
     * @param wat A value to be checked.
     * @returns A boolean representing the result.
     */
    function isElement(wat) {
      return typeof Element !== 'undefined' && isInstanceOf(wat, Element);
    }
  
    /**
     * Checks whether given value's type is an regexp
     * {@link isRegExp}.
     *
     * @param wat A value to be checked.
     * @returns A boolean representing the result.
     */
    function isRegExp(wat) {
      return isBuiltin(wat, 'RegExp');
    }
  
    /**
     * Checks whether given value has a then function.
     * @param wat A value to be checked.
     */
    function isThenable(wat) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return Boolean(wat && wat.then && typeof wat.then === 'function');
    }
  
    /**
     * Checks whether given value's type is a SyntheticEvent
     * {@link isSyntheticEvent}.
     *
     * @param wat A value to be checked.
     * @returns A boolean representing the result.
     */
    function isSyntheticEvent(wat) {
      return isPlainObject(wat) && 'nativeEvent' in wat && 'preventDefault' in wat && 'stopPropagation' in wat;
    }
  
    /**
     * Checks whether given value is NaN
     * {@link isNaN}.
     *
     * @param wat A value to be checked.
     * @returns A boolean representing the result.
     */
    function isNaN$1(wat) {
      return typeof wat === 'number' && wat !== wat;
    }
  
    /**
     * Checks whether given value's type is an instance of provided constructor.
     * {@link isInstanceOf}.
     *
     * @param wat A value to be checked.
     * @param base A constructor to be used in a check.
     * @returns A boolean representing the result.
     */
    function isInstanceOf(wat, base) {
      try {
        return wat instanceof base;
      } catch (_e) {
        return false;
      }
    }
  
    /** Internal global with common properties and Sentry extensions  */
  
    // The code below for 'isGlobalObj' and 'GLOBAL_OBJ' was copied from core-js before modification
    // https://github.com/zloirock/core-js/blob/1b944df55282cdc99c90db5f49eb0b6eda2cc0a3/packages/core-js/internals/global.js
    // core-js has the following licence:
    //
    // Copyright (c) 2014-2022 Denis Pushkarev
    //
    // Permission is hereby granted, free of charge, to any person obtaining a copy
    // of this software and associated documentation files (the "Software"), to deal
    // in the Software without restriction, including without limitation the rights
    // to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    // copies of the Software, and to permit persons to whom the Software is
    // furnished to do so, subject to the following conditions:
    //
    // The above copyright notice and this permission notice shall be included in
    // all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    // AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    // LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    // OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    // THE SOFTWARE.
  
    /** Returns 'obj' if it's the global object, otherwise returns undefined */
    function isGlobalObj(obj) {
      return obj && obj.Math == Math ? obj : undefined;
    }
  
    /** Get's the global object for the current JavaScript runtime */
    const GLOBAL_OBJ =
      (typeof globalThis == 'object' && isGlobalObj(globalThis)) ||
      // eslint-disable-next-line no-restricted-globals
      (typeof window == 'object' && isGlobalObj(window)) ||
      (typeof self == 'object' && isGlobalObj(self)) ||
      (typeof global == 'object' && isGlobalObj(global)) ||
      (function () {
        return this;
      })() ||
      {};
  
    /**
     * @deprecated Use GLOBAL_OBJ instead or WINDOW from @sentry/browser. This will be removed in v8
     */
    function getGlobalObject() {
      return GLOBAL_OBJ ;
    }
  
    /**
     * Returns a global singleton contained in the global `__SENTRY__` object.
     *
     * If the singleton doesn't already exist in `__SENTRY__`, it will be created using the given factory
     * function and added to the `__SENTRY__` object.
     *
     * @param name name of the global singleton on __SENTRY__
     * @param creator creator Factory function to create the singleton if it doesn't already exist on `__SENTRY__`
     * @param obj (Optional) The global object on which to look for `__SENTRY__`, if not `GLOBAL_OBJ`'s return value
     * @returns the singleton
     */
    function getGlobalSingleton(name, creator, obj) {
      const gbl = (obj || GLOBAL_OBJ) ;
      const __SENTRY__ = (gbl.__SENTRY__ = gbl.__SENTRY__ || {});
      const singleton = __SENTRY__[name] || (__SENTRY__[name] = creator());
      return singleton;
    }
  
    // eslint-disable-next-line deprecation/deprecation
    const WINDOW$6 = getGlobalObject();
  
    const DEFAULT_MAX_STRING_LENGTH = 80;
  
    /**
     * Given a child DOM element, returns a query-selector statement describing that
     * and its ancestors
     * e.g. [HTMLElement] => body > div > input#foo.btn[name=baz]
     * @returns generated DOM path
     */
    function htmlTreeAsString(
      elem,
      options = {},
    ) {
  
      // try/catch both:
      // - accessing event.target (see getsentry/raven-js#838, #768)
      // - `htmlTreeAsString` because it's complex, and just accessing the DOM incorrectly
      // - can throw an exception in some circumstances.
      try {
        let currentElem = elem ;
        const MAX_TRAVERSE_HEIGHT = 5;
        const out = [];
        let height = 0;
        let len = 0;
        const separator = ' > ';
        const sepLength = separator.length;
        let nextStr;
        const keyAttrs = Array.isArray(options) ? options : options.keyAttrs;
        const maxStringLength = (!Array.isArray(options) && options.maxStringLength) || DEFAULT_MAX_STRING_LENGTH;
  
        while (currentElem && height++ < MAX_TRAVERSE_HEIGHT) {
          nextStr = _htmlElementAsString(currentElem, keyAttrs);
          // bail out if
          // - nextStr is the 'html' element
          // - the length of the string that would be created exceeds maxStringLength
          //   (ignore this limit if we are on the first iteration)
          if (nextStr === 'html' || (height > 1 && len + out.length * sepLength + nextStr.length >= maxStringLength)) {
            break;
          }
  
          out.push(nextStr);
  
          len += nextStr.length;
          currentElem = currentElem.parentNode;
        }
  
        return out.reverse().join(separator);
      } catch (_oO) {
        return '<unknown>';
      }
    }
  
    /**
     * Returns a simple, query-selector representation of a DOM element
     * e.g. [HTMLElement] => input#foo.btn[name=baz]
     * @returns generated DOM path
     */
    function _htmlElementAsString(el, keyAttrs) {
      const elem = el
  
    ;
  
      const out = [];
      let className;
      let classes;
      let key;
      let attr;
      let i;
  
      if (!elem || !elem.tagName) {
        return '';
      }
  
      out.push(elem.tagName.toLowerCase());
  
      // Pairs of attribute keys defined in `serializeAttribute` and their values on element.
      const keyAttrPairs =
        keyAttrs && keyAttrs.length
          ? keyAttrs.filter(keyAttr => elem.getAttribute(keyAttr)).map(keyAttr => [keyAttr, elem.getAttribute(keyAttr)])
          : null;
  
      if (keyAttrPairs && keyAttrPairs.length) {
        keyAttrPairs.forEach(keyAttrPair => {
          out.push(`[${keyAttrPair[0]}="${keyAttrPair[1]}"]`);
        });
      } else {
        if (elem.id) {
          out.push(`#${elem.id}`);
        }
  
        // eslint-disable-next-line prefer-const
        className = elem.className;
        if (className && isString(className)) {
          classes = className.split(/\s+/);
          for (i = 0; i < classes.length; i++) {
            out.push(`.${classes[i]}`);
          }
        }
      }
      const allowedAttrs = ['aria-label', 'type', 'name', 'title', 'alt'];
      for (i = 0; i < allowedAttrs.length; i++) {
        key = allowedAttrs[i];
        attr = elem.getAttribute(key);
        if (attr) {
          out.push(`[${key}="${attr}"]`);
        }
      }
      return out.join('');
    }
  
    /**
     * A safe form of location.href
     */
    function getLocationHref() {
      try {
        return WINDOW$6.document.location.href;
      } catch (oO) {
        return '';
      }
    }
  
    /**
     * Gets a DOM element by using document.querySelector.
     *
     * This wrapper will first check for the existance of the function before
     * actually calling it so that we don't have to take care of this check,
     * every time we want to access the DOM.
     *
     * Reason: DOM/querySelector is not available in all environments.
     *
     * We have to cast to any because utils can be consumed by a variety of environments,
     * and we don't want to break TS users. If you know what element will be selected by
     * `document.querySelector`, specify it as part of the generic call. For example,
     * `const element = getDomElement<Element>('selector');`
     *
     * @param selector the selector string passed on to document.querySelector
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function getDomElement(selector) {
      if (WINDOW$6.document && WINDOW$6.document.querySelector) {
        return WINDOW$6.document.querySelector(selector) ;
      }
      return null;
    }
  
    /** An error emitted by Sentry SDKs and related utilities. */
    class SentryError extends Error {
      /** Display name of this error instance. */
  
       constructor( message, logLevel = 'warn') {
        super(message);this.message = message;
        this.name = new.target.prototype.constructor.name;
        // This sets the prototype to be `Error`, not `SentryError`. It's unclear why we do this, but commenting this line
        // out causes various (seemingly totally unrelated) playwright tests consistently time out. FYI, this makes
        // instances of `SentryError` fail `obj instanceof SentryError` checks.
        Object.setPrototypeOf(this, new.target.prototype);
        this.logLevel = logLevel;
      }
    }
  
    /** Regular expression used to parse a Dsn. */
    const DSN_REGEX = /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+)?)?@)([\w.-]+)(?::(\d+))?\/(.+)/;
  
    function isValidProtocol(protocol) {
      return protocol === 'http' || protocol === 'https';
    }
  
    /**
     * Renders the string representation of this Dsn.
     *
     * By default, this will render the public representation without the password
     * component. To get the deprecated private representation, set `withPassword`
     * to true.
     *
     * @param withPassword When set to true, the password will be included.
     */
    function dsnToString(dsn, withPassword = false) {
      const { host, path, pass, port, projectId, protocol, publicKey } = dsn;
      return (
        `${protocol}://${publicKey}${withPassword && pass ? `:${pass}` : ''}` +
        `@${host}${port ? `:${port}` : ''}/${path ? `${path}/` : path}${projectId}`
      );
    }
  
    /**
     * Parses a Dsn from a given string.
     *
     * @param str A Dsn as string
     * @returns Dsn as DsnComponents
     */
    function dsnFromString(str) {
      const match = DSN_REGEX.exec(str);
  
      if (!match) {
        throw new SentryError(`Invalid Sentry Dsn: ${str}`);
      }
  
      const [protocol, publicKey, pass = '', host, port = '', lastPath] = match.slice(1);
      let path = '';
      let projectId = lastPath;
  
      const split = projectId.split('/');
      if (split.length > 1) {
        path = split.slice(0, -1).join('/');
        projectId = split.pop() ;
      }
  
      if (projectId) {
        const projectMatch = projectId.match(/^\d+/);
        if (projectMatch) {
          projectId = projectMatch[0];
        }
      }
  
      return dsnFromComponents({ host, pass, path, projectId, port, protocol: protocol , publicKey });
    }
  
    function dsnFromComponents(components) {
      return {
        protocol: components.protocol,
        publicKey: components.publicKey || '',
        pass: components.pass || '',
        host: components.host,
        port: components.port || '',
        path: components.path || '',
        projectId: components.projectId,
      };
    }
  
    function validateDsn(dsn) {
  
      const { port, projectId, protocol } = dsn;
  
      const requiredComponents = ['protocol', 'publicKey', 'host', 'projectId'];
      requiredComponents.forEach(component => {
        if (!dsn[component]) {
          throw new SentryError(`Invalid Sentry Dsn: ${component} missing`);
        }
      });
  
      if (!projectId.match(/^\d+$/)) {
        throw new SentryError(`Invalid Sentry Dsn: Invalid projectId ${projectId}`);
      }
  
      if (!isValidProtocol(protocol)) {
        throw new SentryError(`Invalid Sentry Dsn: Invalid protocol ${protocol}`);
      }
  
      if (port && isNaN(parseInt(port, 10))) {
        throw new SentryError(`Invalid Sentry Dsn: Invalid port ${port}`);
      }
  
      return true;
    }
  
    /** The Sentry Dsn, identifying a Sentry instance and project. */
    function makeDsn(from) {
      const components = typeof from === 'string' ? dsnFromString(from) : dsnFromComponents(from);
      validateDsn(components);
      return components;
    }
  
    /** Prefix for logging strings */
    const PREFIX = 'Sentry Logger ';
  
    const CONSOLE_LEVELS = ['debug', 'info', 'warn', 'error', 'log', 'assert', 'trace'] ;
  
    /**
     * Temporarily disable sentry console instrumentations.
     *
     * @param callback The function to run against the original `console` messages
     * @returns The results of the callback
     */
    function consoleSandbox(callback) {
      if (!('console' in GLOBAL_OBJ)) {
        return callback();
      }
  
      const originalConsole = GLOBAL_OBJ.console ;
      const wrappedLevels = {};
  
      // Restore all wrapped console methods
      CONSOLE_LEVELS.forEach(level => {
        // TODO(v7): Remove this check as it's only needed for Node 6
        const originalWrappedFunc =
          originalConsole[level] && (originalConsole[level] ).__sentry_original__;
        if (level in originalConsole && originalWrappedFunc) {
          wrappedLevels[level] = originalConsole[level] ;
          originalConsole[level] = originalWrappedFunc ;
        }
      });
  
      try {
        return callback();
      } finally {
        // Revert restoration to wrapped state
        Object.keys(wrappedLevels).forEach(level => {
          originalConsole[level] = wrappedLevels[level ];
        });
      }
    }
  
    function makeLogger() {
      let enabled = false;
      const logger = {
        enable: () => {
          enabled = true;
        },
        disable: () => {
          enabled = false;
        },
      };
  
      {
        CONSOLE_LEVELS.forEach(name => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          logger[name] = (...args) => {
            if (enabled) {
              consoleSandbox(() => {
                GLOBAL_OBJ.console[name](`${PREFIX}[${name}]:`, ...args);
              });
            }
          };
        });
      }
  
      return logger ;
    }
  
    // Ensure we only have a single logger instance, even if multiple versions of @sentry/utils are being used
    let logger;
    {
      logger = getGlobalSingleton('logger', makeLogger);
    }
  
    /**
     * Truncates given string to the maximum characters count
     *
     * @param str An object that contains serializable values
     * @param max Maximum number of characters in truncated string (0 = unlimited)
     * @returns string Encoded
     */
    function truncate(str, max = 0) {
      if (typeof str !== 'string' || max === 0) {
        return str;
      }
      return str.length <= max ? str : `${str.slice(0, max)}...`;
    }
  
    /**
     * Join values in array
     * @param input array of values to be joined together
     * @param delimiter string to be placed in-between values
     * @returns Joined values
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function safeJoin(input, delimiter) {
      if (!Array.isArray(input)) {
        return '';
      }
  
      const output = [];
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < input.length; i++) {
        const value = input[i];
        try {
          output.push(String(value));
        } catch (e) {
          output.push('[value cannot be serialized]');
        }
      }
  
      return output.join(delimiter);
    }
  
    /**
     * Checks if the given value matches a regex or string
     *
     * @param value The string to test
     * @param pattern Either a regex or a string against which `value` will be matched
     * @param requireExactStringMatch If true, `value` must match `pattern` exactly. If false, `value` will match
     * `pattern` if it contains `pattern`. Only applies to string-type patterns.
     */
    function isMatchingPattern(
      value,
      pattern,
      requireExactStringMatch = false,
    ) {
      if (!isString(value)) {
        return false;
      }
  
      if (isRegExp(pattern)) {
        return pattern.test(value);
      }
      if (isString(pattern)) {
        return requireExactStringMatch ? value === pattern : value.includes(pattern);
      }
  
      return false;
    }
  
    /**
     * Test the given string against an array of strings and regexes. By default, string matching is done on a
     * substring-inclusion basis rather than a strict equality basis
     *
     * @param testString The string to test
     * @param patterns The patterns against which to test the string
     * @param requireExactStringMatch If true, `testString` must match one of the given string patterns exactly in order to
     * count. If false, `testString` will match a string pattern if it contains that pattern.
     * @returns
     */
    function stringMatchesSomePattern(
      testString,
      patterns = [],
      requireExactStringMatch = false,
    ) {
      return patterns.some(pattern => isMatchingPattern(testString, pattern, requireExactStringMatch));
    }
  
    /**
     * Replace a method in an object with a wrapped version of itself.
     *
     * @param source An object that contains a method to be wrapped.
     * @param name The name of the method to be wrapped.
     * @param replacementFactory A higher-order function that takes the original version of the given method and returns a
     * wrapped version. Note: The function returned by `replacementFactory` needs to be a non-arrow function, in order to
     * preserve the correct value of `this`, and the original method must be called using `origMethod.call(this, <other
     * args>)` or `origMethod.apply(this, [<other args>])` (rather than being called directly), again to preserve `this`.
     * @returns void
     */
    function fill(source, name, replacementFactory) {
      if (!(name in source)) {
        return;
      }
  
      const original = source[name] ;
      const wrapped = replacementFactory(original) ;
  
      // Make sure it's a function first, as we need to attach an empty prototype for `defineProperties` to work
      // otherwise it'll throw "TypeError: Object.defineProperties called on non-object"
      if (typeof wrapped === 'function') {
        try {
          markFunctionWrapped(wrapped, original);
        } catch (_Oo) {
          // This can throw if multiple fill happens on a global object like XMLHttpRequest
          // Fixes https://github.com/getsentry/sentry-javascript/issues/2043
        }
      }
  
      source[name] = wrapped;
    }
  
    /**
     * Defines a non-enumerable property on the given object.
     *
     * @param obj The object on which to set the property
     * @param name The name of the property to be set
     * @param value The value to which to set the property
     */
    function addNonEnumerableProperty(obj, name, value) {
      Object.defineProperty(obj, name, {
        // enumerable: false, // the default, so we can save on bundle size by not explicitly setting it
        value: value,
        writable: true,
        configurable: true,
      });
    }
  
    /**
     * Remembers the original function on the wrapped function and
     * patches up the prototype.
     *
     * @param wrapped the wrapper function
     * @param original the original function that gets wrapped
     */
    function markFunctionWrapped(wrapped, original) {
      const proto = original.prototype || {};
      wrapped.prototype = original.prototype = proto;
      addNonEnumerableProperty(wrapped, '__sentry_original__', original);
    }
  
    /**
     * This extracts the original function if available.  See
     * `markFunctionWrapped` for more information.
     *
     * @param func the function to unwrap
     * @returns the unwrapped version of the function if available.
     */
    function getOriginalFunction(func) {
      return func.__sentry_original__;
    }
  
    /**
     * Encodes given object into url-friendly format
     *
     * @param object An object that contains serializable values
     * @returns string Encoded
     */
    function urlEncode(object) {
      return Object.keys(object)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(object[key])}`)
        .join('&');
    }
  
    /**
     * Transforms any `Error` or `Event` into a plain object with all of their enumerable properties, and some of their
     * non-enumerable properties attached.
     *
     * @param value Initial source that we have to transform in order for it to be usable by the serializer
     * @returns An Event or Error turned into an object - or the value argurment itself, when value is neither an Event nor
     *  an Error.
     */
    function convertToPlainObject(value)
  
     {
      if (isError(value)) {
        return {
          message: value.message,
          name: value.name,
          stack: value.stack,
          ...getOwnProperties(value),
        };
      } else if (isEvent(value)) {
        const newObj
  
     = {
          type: value.type,
          target: serializeEventTarget(value.target),
          currentTarget: serializeEventTarget(value.currentTarget),
          ...getOwnProperties(value),
        };
  
        if (typeof CustomEvent !== 'undefined' && isInstanceOf(value, CustomEvent)) {
          newObj.detail = value.detail;
        }
  
        return newObj;
      } else {
        return value;
      }
    }
  
    /** Creates a string representation of the target of an `Event` object */
    function serializeEventTarget(target) {
      try {
        return isElement(target) ? htmlTreeAsString(target) : Object.prototype.toString.call(target);
      } catch (_oO) {
        return '<unknown>';
      }
    }
  
    /** Filters out all but an object's own properties */
    function getOwnProperties(obj) {
      if (typeof obj === 'object' && obj !== null) {
        const extractedProps = {};
        for (const property in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, property)) {
            extractedProps[property] = (obj )[property];
          }
        }
        return extractedProps;
      } else {
        return {};
      }
    }
  
    /**
     * Given any captured exception, extract its keys and create a sorted
     * and truncated list that will be used inside the event message.
     * eg. `Non-error exception captured with keys: foo, bar, baz`
     */
    function extractExceptionKeysForMessage(exception, maxLength = 40) {
      const keys = Object.keys(convertToPlainObject(exception));
      keys.sort();
  
      if (!keys.length) {
        return '[object has no keys]';
      }
  
      if (keys[0].length >= maxLength) {
        return truncate(keys[0], maxLength);
      }
  
      for (let includedKeys = keys.length; includedKeys > 0; includedKeys--) {
        const serialized = keys.slice(0, includedKeys).join(', ');
        if (serialized.length > maxLength) {
          continue;
        }
        if (includedKeys === keys.length) {
          return serialized;
        }
        return truncate(serialized, maxLength);
      }
  
      return '';
    }
  
    /**
     * Given any object, return a new object having removed all fields whose value was `undefined`.
     * Works recursively on objects and arrays.
     *
     * Attention: This function keeps circular references in the returned object.
     */
    function dropUndefinedKeys(inputValue) {
      // This map keeps track of what already visited nodes map to.
      // Our Set - based memoBuilder doesn't work here because we want to the output object to have the same circular
      // references as the input object.
      const memoizationMap = new Map();
  
      // This function just proxies `_dropUndefinedKeys` to keep the `memoBuilder` out of this function's API
      return _dropUndefinedKeys(inputValue, memoizationMap);
    }
  
    function _dropUndefinedKeys(inputValue, memoizationMap) {
      if (isPlainObject(inputValue)) {
        // If this node has already been visited due to a circular reference, return the object it was mapped to in the new object
        const memoVal = memoizationMap.get(inputValue);
        if (memoVal !== undefined) {
          return memoVal ;
        }
  
        const returnValue = {};
        // Store the mapping of this value in case we visit it again, in case of circular data
        memoizationMap.set(inputValue, returnValue);
  
        for (const key of Object.keys(inputValue)) {
          if (typeof inputValue[key] !== 'undefined') {
            returnValue[key] = _dropUndefinedKeys(inputValue[key], memoizationMap);
          }
        }
  
        return returnValue ;
      }
  
      if (Array.isArray(inputValue)) {
        // If this node has already been visited due to a circular reference, return the array it was mapped to in the new object
        const memoVal = memoizationMap.get(inputValue);
        if (memoVal !== undefined) {
          return memoVal ;
        }
  
        const returnValue = [];
        // Store the mapping of this value in case we visit it again, in case of circular data
        memoizationMap.set(inputValue, returnValue);
  
        inputValue.forEach((item) => {
          returnValue.push(_dropUndefinedKeys(item, memoizationMap));
        });
  
        return returnValue ;
      }
  
      return inputValue;
    }
  
    const STACKTRACE_FRAME_LIMIT = 50;
    // Used to sanitize webpack (error: *) wrapped stack errors
    const WEBPACK_ERROR_REGEXP = /\(error: (.*)\)/;
  
    /**
     * Creates a stack parser with the supplied line parsers
     *
     * StackFrames are returned in the correct order for Sentry Exception
     * frames and with Sentry SDK internal frames removed from the top and bottom
     *
     */
    function createStackParser(...parsers) {
      const sortedParsers = parsers.sort((a, b) => a[0] - b[0]).map(p => p[1]);
  
      return (stack, skipFirst = 0) => {
        const frames = [];
        const lines = stack.split('\n');
  
        for (let i = skipFirst; i < lines.length; i++) {
          const line = lines[i];
          // Ignore lines over 1kb as they are unlikely to be stack frames.
          // Many of the regular expressions use backtracking which results in run time that increases exponentially with
          // input size. Huge strings can result in hangs/Denial of Service:
          // https://github.com/getsentry/sentry-javascript/issues/2286
          if (line.length > 1024) {
            continue;
          }
  
          // https://github.com/getsentry/sentry-javascript/issues/5459
          // Remove webpack (error: *) wrappers
          const cleanedLine = WEBPACK_ERROR_REGEXP.test(line) ? line.replace(WEBPACK_ERROR_REGEXP, '$1') : line;
  
          // https://github.com/getsentry/sentry-javascript/issues/7813
          // Skip Error: lines
          if (cleanedLine.match(/\S*Error: /)) {
            continue;
          }
  
          for (const parser of sortedParsers) {
            const frame = parser(cleanedLine);
  
            if (frame) {
              frames.push(frame);
              break;
            }
          }
  
          if (frames.length >= STACKTRACE_FRAME_LIMIT) {
            break;
          }
        }
  
        return stripSentryFramesAndReverse(frames);
      };
    }
  
    /**
     * Gets a stack parser implementation from Options.stackParser
     * @see Options
     *
     * If options contains an array of line parsers, it is converted into a parser
     */
    function stackParserFromStackParserOptions(stackParser) {
      if (Array.isArray(stackParser)) {
        return createStackParser(...stackParser);
      }
      return stackParser;
    }
  
    /**
     * Removes Sentry frames from the top and bottom of the stack if present and enforces a limit of max number of frames.
     * Assumes stack input is ordered from top to bottom and returns the reverse representation so call site of the
     * function that caused the crash is the last frame in the array.
     * @hidden
     */
    function stripSentryFramesAndReverse(stack) {
      if (!stack.length) {
        return [];
      }
  
      const localStack = stack.slice(0, STACKTRACE_FRAME_LIMIT);
  
      const lastFrameFunction = localStack[localStack.length - 1].function;
      // If stack starts with one of our API calls, remove it (starts, meaning it's the top of the stack - aka last call)
      if (lastFrameFunction && /sentryWrapped/.test(lastFrameFunction)) {
        localStack.pop();
      }
  
      // Reversing in the middle of the procedure allows us to just pop the values off the stack
      localStack.reverse();
  
      const firstFrameFunction = localStack[localStack.length - 1].function;
      // If stack ends with one of our internal API calls, remove it (ends, meaning it's the bottom of the stack - aka top-most call)
      if (firstFrameFunction && /captureMessage|captureException/.test(firstFrameFunction)) {
        localStack.pop();
      }
  
      return localStack.map(frame => ({
        ...frame,
        filename: frame.filename || localStack[localStack.length - 1].filename,
        function: frame.function || '?',
      }));
    }
  
    const defaultFunctionName = '<anonymous>';
  
    /**
     * Safely extract function name from itself
     */
    function getFunctionName(fn) {
      try {
        if (!fn || typeof fn !== 'function') {
          return defaultFunctionName;
        }
        return fn.name || defaultFunctionName;
      } catch (e) {
        // Just accessing custom props in some Selenium environments
        // can cause a "Permission denied" exception (see raven-js#495).
        return defaultFunctionName;
      }
    }
  
    // eslint-disable-next-line deprecation/deprecation
    const WINDOW$5 = getGlobalObject();
  
    /**
     * Tells whether current environment supports Fetch API
     * {@link supportsFetch}.
     *
     * @returns Answer to the given question.
     */
    function supportsFetch() {
      if (!('fetch' in WINDOW$5)) {
        return false;
      }
  
      try {
        new Headers();
        new Request('http://www.example.com');
        new Response();
        return true;
      } catch (e) {
        return false;
      }
    }
    /**
     * isNativeFetch checks if the given function is a native implementation of fetch()
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    function isNativeFetch(func) {
      return func && /^function fetch\(\)\s+\{\s+\[native code\]\s+\}$/.test(func.toString());
    }
  
    /**
     * Tells whether current environment supports Fetch API natively
     * {@link supportsNativeFetch}.
     *
     * @returns true if `window.fetch` is natively implemented, false otherwise
     */
    function supportsNativeFetch() {
      if (!supportsFetch()) {
        return false;
      }
  
      // Fast path to avoid DOM I/O
      // eslint-disable-next-line @typescript-eslint/unbound-method
      if (isNativeFetch(WINDOW$5.fetch)) {
        return true;
      }
  
      // window.fetch is implemented, but is polyfilled or already wrapped (e.g: by a chrome extension)
      // so create a "pure" iframe to see if that has native fetch
      let result = false;
      const doc = WINDOW$5.document;
      // eslint-disable-next-line deprecation/deprecation
      if (doc && typeof (doc.createElement ) === 'function') {
        try {
          const sandbox = doc.createElement('iframe');
          sandbox.hidden = true;
          doc.head.appendChild(sandbox);
          if (sandbox.contentWindow && sandbox.contentWindow.fetch) {
            // eslint-disable-next-line @typescript-eslint/unbound-method
            result = isNativeFetch(sandbox.contentWindow.fetch);
          }
          doc.head.removeChild(sandbox);
        } catch (err) {
          logger.warn('Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ', err);
        }
      }
  
      return result;
    }
  
    // Based on https://github.com/angular/angular.js/pull/13945/files
  
    // eslint-disable-next-line deprecation/deprecation
    const WINDOW$4 = getGlobalObject();
  
    /**
     * Tells whether current environment supports History API
     * {@link supportsHistory}.
     *
     * @returns Answer to the given question.
     */
    function supportsHistory() {
      // NOTE: in Chrome App environment, touching history.pushState, *even inside
      //       a try/catch block*, will cause Chrome to output an error to console.error
      // borrowed from: https://github.com/angular/angular.js/pull/13945/files
      /* eslint-disable @typescript-eslint/no-unsafe-member-access */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const chrome = (WINDOW$4 ).chrome;
      const isChromePackagedApp = chrome && chrome.app && chrome.app.runtime;
      /* eslint-enable @typescript-eslint/no-unsafe-member-access */
      const hasHistoryApi = 'history' in WINDOW$4 && !!WINDOW$4.history.pushState && !!WINDOW$4.history.replaceState;
  
      return !isChromePackagedApp && hasHistoryApi;
    }
  
    // eslint-disable-next-line deprecation/deprecation
    const WINDOW$3 = getGlobalObject();
  
    const SENTRY_XHR_DATA_KEY = '__sentry_xhr_v2__';
  
    /**
     * Instrument native APIs to call handlers that can be used to create breadcrumbs, APM spans etc.
     *  - Console API
     *  - Fetch API
     *  - XHR API
     *  - History API
     *  - DOM API (click/typing)
     *  - Error API
     *  - UnhandledRejection API
     */
  
    const handlers = {};
    const instrumented = {};
  
    /** Instruments given API */
    function instrument(type) {
      if (instrumented[type]) {
        return;
      }
  
      instrumented[type] = true;
  
      switch (type) {
        case 'console':
          instrumentConsole();
          break;
        case 'dom':
          instrumentDOM();
          break;
        case 'xhr':
          instrumentXHR();
          break;
        case 'fetch':
          instrumentFetch();
          break;
        case 'history':
          instrumentHistory();
          break;
        case 'error':
          instrumentError();
          break;
        case 'unhandledrejection':
          instrumentUnhandledRejection();
          break;
        default:
          logger.warn('unknown instrumentation type:', type);
          return;
      }
    }
  
    /**
     * Add handler that will be called when given type of instrumentation triggers.
     * Use at your own risk, this might break without changelog notice, only used internally.
     * @hidden
     */
    function addInstrumentationHandler(type, callback) {
      handlers[type] = handlers[type] || [];
      (handlers[type] ).push(callback);
      instrument(type);
    }
  
    /** JSDoc */
    function triggerHandlers(type, data) {
      if (!type || !handlers[type]) {
        return;
      }
  
      for (const handler of handlers[type] || []) {
        try {
          handler(data);
        } catch (e) {
          logger.error(
              `Error while triggering instrumentation handler.\nType: ${type}\nName: ${getFunctionName(handler)}\nError:`,
              e,
            );
        }
      }
    }
  
    /** JSDoc */
    function instrumentConsole() {
      if (!('console' in WINDOW$3)) {
        return;
      }
  
      CONSOLE_LEVELS.forEach(function (level) {
        if (!(level in WINDOW$3.console)) {
          return;
        }
  
        fill(WINDOW$3.console, level, function (originalConsoleMethod) {
          return function (...args) {
            triggerHandlers('console', { args, level });
  
            // this fails for some browsers. :(
            if (originalConsoleMethod) {
              originalConsoleMethod.apply(WINDOW$3.console, args);
            }
          };
        });
      });
    }
  
    /** JSDoc */
    function instrumentFetch() {
      if (!supportsNativeFetch()) {
        return;
      }
  
      fill(WINDOW$3, 'fetch', function (originalFetch) {
        return function (...args) {
          const { method, url } = parseFetchArgs(args);
  
          const handlerData = {
            args,
            fetchData: {
              method,
              url,
            },
            startTimestamp: Date.now(),
          };
  
          triggerHandlers('fetch', {
            ...handlerData,
          });
  
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          return originalFetch.apply(WINDOW$3, args).then(
            (response) => {
              triggerHandlers('fetch', {
                ...handlerData,
                endTimestamp: Date.now(),
                response,
              });
              return response;
            },
            (error) => {
              triggerHandlers('fetch', {
                ...handlerData,
                endTimestamp: Date.now(),
                error,
              });
              // NOTE: If you are a Sentry user, and you are seeing this stack frame,
              //       it means the sentry.javascript SDK caught an error invoking your application code.
              //       This is expected behavior and NOT indicative of a bug with sentry.javascript.
              throw error;
            },
          );
        };
      });
    }
  
    function hasProp(obj, prop) {
      return !!obj && typeof obj === 'object' && !!(obj )[prop];
    }
  
    function getUrlFromResource(resource) {
      if (typeof resource === 'string') {
        return resource;
      }
  
      if (!resource) {
        return '';
      }
  
      if (hasProp(resource, 'url')) {
        return resource.url;
      }
  
      if (resource.toString) {
        return resource.toString();
      }
  
      return '';
    }
  
    /**
     * Parses the fetch arguments to find the used Http method and the url of the request
     */
    function parseFetchArgs(fetchArgs) {
      if (fetchArgs.length === 0) {
        return { method: 'GET', url: '' };
      }
  
      if (fetchArgs.length === 2) {
        const [url, options] = fetchArgs ;
  
        return {
          url: getUrlFromResource(url),
          method: hasProp(options, 'method') ? String(options.method).toUpperCase() : 'GET',
        };
      }
  
      const arg = fetchArgs[0];
      return {
        url: getUrlFromResource(arg ),
        method: hasProp(arg, 'method') ? String(arg.method).toUpperCase() : 'GET',
      };
    }
  
    /** JSDoc */
    function instrumentXHR() {
      if (!('XMLHttpRequest' in WINDOW$3)) {
        return;
      }
  
      const xhrproto = XMLHttpRequest.prototype;
  
      fill(xhrproto, 'open', function (originalOpen) {
        return function ( ...args) {
          const url = args[1];
          const xhrInfo = (this[SENTRY_XHR_DATA_KEY] = {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            method: isString(args[0]) ? args[0].toUpperCase() : args[0],
            url: args[1],
            request_headers: {},
          });
  
          // if Sentry key appears in URL, don't capture it as a request
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (isString(url) && xhrInfo.method === 'POST' && url.match(/sentry_key/)) {
            this.__sentry_own_request__ = true;
          }
  
          const onreadystatechangeHandler = () => {
            // For whatever reason, this is not the same instance here as from the outer method
            const xhrInfo = this[SENTRY_XHR_DATA_KEY];
  
            if (!xhrInfo) {
              return;
            }
  
            if (this.readyState === 4) {
              try {
                // touching statusCode in some platforms throws
                // an exception
                xhrInfo.status_code = this.status;
              } catch (e) {
                /* do nothing */
              }
  
              triggerHandlers('xhr', {
                args: args ,
                endTimestamp: Date.now(),
                startTimestamp: Date.now(),
                xhr: this,
              } );
            }
          };
  
          if ('onreadystatechange' in this && typeof this.onreadystatechange === 'function') {
            fill(this, 'onreadystatechange', function (original) {
              return function ( ...readyStateArgs) {
                onreadystatechangeHandler();
                return original.apply(this, readyStateArgs);
              };
            });
          } else {
            this.addEventListener('readystatechange', onreadystatechangeHandler);
          }
  
          // Intercepting `setRequestHeader` to access the request headers of XHR instance.
          // This will only work for user/library defined headers, not for the default/browser-assigned headers.
          // Request cookies are also unavailable for XHR, as `Cookie` header can't be defined by `setRequestHeader`.
          fill(this, 'setRequestHeader', function (original) {
            return function ( ...setRequestHeaderArgs) {
              const [header, value] = setRequestHeaderArgs ;
  
              const xhrInfo = this[SENTRY_XHR_DATA_KEY];
  
              if (xhrInfo) {
                xhrInfo.request_headers[header.toLowerCase()] = value;
              }
  
              return original.apply(this, setRequestHeaderArgs);
            };
          });
  
          return originalOpen.apply(this, args);
        };
      });
  
      fill(xhrproto, 'send', function (originalSend) {
        return function ( ...args) {
          const sentryXhrData = this[SENTRY_XHR_DATA_KEY];
          if (sentryXhrData && args[0] !== undefined) {
            sentryXhrData.body = args[0];
          }
  
          triggerHandlers('xhr', {
            args,
            startTimestamp: Date.now(),
            xhr: this,
          });
  
          return originalSend.apply(this, args);
        };
      });
    }
  
    let lastHref;
  
    /** JSDoc */
    function instrumentHistory() {
      if (!supportsHistory()) {
        return;
      }
  
      const oldOnPopState = WINDOW$3.onpopstate;
      WINDOW$3.onpopstate = function ( ...args) {
        const to = WINDOW$3.location.href;
        // keep track of the current URL state, as we always receive only the updated state
        const from = lastHref;
        lastHref = to;
        triggerHandlers('history', {
          from,
          to,
        });
        if (oldOnPopState) {
          // Apparently this can throw in Firefox when incorrectly implemented plugin is installed.
          // https://github.com/getsentry/sentry-javascript/issues/3344
          // https://github.com/bugsnag/bugsnag-js/issues/469
          try {
            return oldOnPopState.apply(this, args);
          } catch (_oO) {
            // no-empty
          }
        }
      };
  
      /** @hidden */
      function historyReplacementFunction(originalHistoryFunction) {
        return function ( ...args) {
          const url = args.length > 2 ? args[2] : undefined;
          if (url) {
            // coerce to string (this is what pushState does)
            const from = lastHref;
            const to = String(url);
            // keep track of the current URL state, as we always receive only the updated state
            lastHref = to;
            triggerHandlers('history', {
              from,
              to,
            });
          }
          return originalHistoryFunction.apply(this, args);
        };
      }
  
      fill(WINDOW$3.history, 'pushState', historyReplacementFunction);
      fill(WINDOW$3.history, 'replaceState', historyReplacementFunction);
    }
  
    const debounceDuration = 1000;
    let debounceTimerID;
    let lastCapturedEvent;
  
    /**
     * Decide whether the current event should finish the debounce of previously captured one.
     * @param previous previously captured event
     * @param current event to be captured
     */
    function shouldShortcircuitPreviousDebounce(previous, current) {
      // If there was no previous event, it should always be swapped for the new one.
      if (!previous) {
        return true;
      }
  
      // If both events have different type, then user definitely performed two separate actions. e.g. click + keypress.
      if (previous.type !== current.type) {
        return true;
      }
  
      try {
        // If both events have the same type, it's still possible that actions were performed on different targets.
        // e.g. 2 clicks on different buttons.
        if (previous.target !== current.target) {
          return true;
        }
      } catch (e) {
        // just accessing `target` property can throw an exception in some rare circumstances
        // see: https://github.com/getsentry/sentry-javascript/issues/838
      }
  
      // If both events have the same type _and_ same `target` (an element which triggered an event, _not necessarily_
      // to which an event listener was attached), we treat them as the same action, as we want to capture
      // only one breadcrumb. e.g. multiple clicks on the same button, or typing inside a user input box.
      return false;
    }
  
    /**
     * Decide whether an event should be captured.
     * @param event event to be captured
     */
    function shouldSkipDOMEvent(event) {
      // We are only interested in filtering `keypress` events for now.
      if (event.type !== 'keypress') {
        return false;
      }
  
      try {
        const target = event.target ;
  
        if (!target || !target.tagName) {
          return true;
        }
  
        // Only consider keypress events on actual input elements. This will disregard keypresses targeting body
        // e.g.tabbing through elements, hotkeys, etc.
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
          return false;
        }
      } catch (e) {
        // just accessing `target` property can throw an exception in some rare circumstances
        // see: https://github.com/getsentry/sentry-javascript/issues/838
      }
  
      return true;
    }
  
    /**
     * Wraps addEventListener to capture UI breadcrumbs
     * @param handler function that will be triggered
     * @param globalListener indicates whether event was captured by the global event listener
     * @returns wrapped breadcrumb events handler
     * @hidden
     */
    function makeDOMEventHandler(handler, globalListener = false) {
      return (event) => {
        // It's possible this handler might trigger multiple times for the same
        // event (e.g. event propagation through node ancestors).
        // Ignore if we've already captured that event.
        if (!event || lastCapturedEvent === event) {
          return;
        }
  
        // We always want to skip _some_ events.
        if (shouldSkipDOMEvent(event)) {
          return;
        }
  
        const name = event.type === 'keypress' ? 'input' : event.type;
  
        // If there is no debounce timer, it means that we can safely capture the new event and store it for future comparisons.
        if (debounceTimerID === undefined) {
          handler({
            event: event,
            name,
            global: globalListener,
          });
          lastCapturedEvent = event;
        }
        // If there is a debounce awaiting, see if the new event is different enough to treat it as a unique one.
        // If that's the case, emit the previous event and store locally the newly-captured DOM event.
        else if (shouldShortcircuitPreviousDebounce(lastCapturedEvent, event)) {
          handler({
            event: event,
            name,
            global: globalListener,
          });
          lastCapturedEvent = event;
        }
  
        // Start a new debounce timer that will prevent us from capturing multiple events that should be grouped together.
        clearTimeout(debounceTimerID);
        debounceTimerID = WINDOW$3.setTimeout(() => {
          debounceTimerID = undefined;
        }, debounceDuration);
      };
    }
  
    /** JSDoc */
    function instrumentDOM() {
      if (!('document' in WINDOW$3)) {
        return;
      }
  
      // Make it so that any click or keypress that is unhandled / bubbled up all the way to the document triggers our dom
      // handlers. (Normally we have only one, which captures a breadcrumb for each click or keypress.) Do this before
      // we instrument `addEventListener` so that we don't end up attaching this handler twice.
      const triggerDOMHandler = triggerHandlers.bind(null, 'dom');
      const globalDOMEventHandler = makeDOMEventHandler(triggerDOMHandler, true);
      WINDOW$3.document.addEventListener('click', globalDOMEventHandler, false);
      WINDOW$3.document.addEventListener('keypress', globalDOMEventHandler, false);
  
      // After hooking into click and keypress events bubbled up to `document`, we also hook into user-handled
      // clicks & keypresses, by adding an event listener of our own to any element to which they add a listener. That
      // way, whenever one of their handlers is triggered, ours will be, too. (This is needed because their handler
      // could potentially prevent the event from bubbling up to our global listeners. This way, our handler are still
      // guaranteed to fire at least once.)
      ['EventTarget', 'Node'].forEach((target) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const proto = (WINDOW$3 )[target] && (WINDOW$3 )[target].prototype;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-prototype-builtins
        if (!proto || !proto.hasOwnProperty || !proto.hasOwnProperty('addEventListener')) {
          return;
        }
  
        fill(proto, 'addEventListener', function (originalAddEventListener) {
          return function (
  
            type,
            listener,
            options,
          ) {
            if (type === 'click' || type == 'keypress') {
              try {
                const el = this ;
                const handlers = (el.__sentry_instrumentation_handlers__ = el.__sentry_instrumentation_handlers__ || {});
                const handlerForType = (handlers[type] = handlers[type] || { refCount: 0 });
  
                if (!handlerForType.handler) {
                  const handler = makeDOMEventHandler(triggerDOMHandler);
                  handlerForType.handler = handler;
                  originalAddEventListener.call(this, type, handler, options);
                }
  
                handlerForType.refCount++;
              } catch (e) {
                // Accessing dom properties is always fragile.
                // Also allows us to skip `addEventListenrs` calls with no proper `this` context.
              }
            }
  
            return originalAddEventListener.call(this, type, listener, options);
          };
        });
  
        fill(
          proto,
          'removeEventListener',
          function (originalRemoveEventListener) {
            return function (
  
              type,
              listener,
              options,
            ) {
              if (type === 'click' || type == 'keypress') {
                try {
                  const el = this ;
                  const handlers = el.__sentry_instrumentation_handlers__ || {};
                  const handlerForType = handlers[type];
  
                  if (handlerForType) {
                    handlerForType.refCount--;
                    // If there are no longer any custom handlers of the current type on this element, we can remove ours, too.
                    if (handlerForType.refCount <= 0) {
                      originalRemoveEventListener.call(this, type, handlerForType.handler, options);
                      handlerForType.handler = undefined;
                      delete handlers[type]; // eslint-disable-line @typescript-eslint/no-dynamic-delete
                    }
  
                    // If there are no longer any custom handlers of any type on this element, cleanup everything.
                    if (Object.keys(handlers).length === 0) {
                      delete el.__sentry_instrumentation_handlers__;
                    }
                  }
                } catch (e) {
                  // Accessing dom properties is always fragile.
                  // Also allows us to skip `addEventListenrs` calls with no proper `this` context.
                }
              }
  
              return originalRemoveEventListener.call(this, type, listener, options);
            };
          },
        );
      });
    }
  
    let _oldOnErrorHandler = null;
    /** JSDoc */
    function instrumentError() {
      _oldOnErrorHandler = WINDOW$3.onerror;
  
      WINDOW$3.onerror = function (msg, url, line, column, error) {
        triggerHandlers('error', {
          column,
          error,
          line,
          msg,
          url,
        });
  
        if (_oldOnErrorHandler && !_oldOnErrorHandler.__SENTRY_LOADER__) {
          // eslint-disable-next-line prefer-rest-params
          return _oldOnErrorHandler.apply(this, arguments);
        }
  
        return false;
      };
  
      WINDOW$3.onerror.__SENTRY_INSTRUMENTED__ = true;
    }
  
    let _oldOnUnhandledRejectionHandler = null;
    /** JSDoc */
    function instrumentUnhandledRejection() {
      _oldOnUnhandledRejectionHandler = WINDOW$3.onunhandledrejection;
  
      WINDOW$3.onunhandledrejection = function (e) {
        triggerHandlers('unhandledrejection', e);
  
        if (_oldOnUnhandledRejectionHandler && !_oldOnUnhandledRejectionHandler.__SENTRY_LOADER__) {
          // eslint-disable-next-line prefer-rest-params
          return _oldOnUnhandledRejectionHandler.apply(this, arguments);
        }
  
        return true;
      };
  
      WINDOW$3.onunhandledrejection.__SENTRY_INSTRUMENTED__ = true;
    }
  
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    /* eslint-disable @typescript-eslint/no-explicit-any */
  
    /**
     * Helper to decycle json objects
     */
    function memoBuilder() {
      const hasWeakSet = typeof WeakSet === 'function';
      const inner = hasWeakSet ? new WeakSet() : [];
      function memoize(obj) {
        if (hasWeakSet) {
          if (inner.has(obj)) {
            return true;
          }
          inner.add(obj);
          return false;
        }
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < inner.length; i++) {
          const value = inner[i];
          if (value === obj) {
            return true;
          }
        }
        inner.push(obj);
        return false;
      }
  
      function unmemoize(obj) {
        if (hasWeakSet) {
          inner.delete(obj);
        } else {
          for (let i = 0; i < inner.length; i++) {
            if (inner[i] === obj) {
              inner.splice(i, 1);
              break;
            }
          }
        }
      }
      return [memoize, unmemoize];
    }
  
    /**
     * UUID4 generator
     *
     * @returns string Generated UUID4.
     */
    function uuid4() {
      const gbl = GLOBAL_OBJ ;
      const crypto = gbl.crypto || gbl.msCrypto;
  
      if (crypto && crypto.randomUUID) {
        return crypto.randomUUID().replace(/-/g, '');
      }
  
      const getRandomByte =
        crypto && crypto.getRandomValues ? () => crypto.getRandomValues(new Uint8Array(1))[0] : () => Math.random() * 16;
  
      // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
      // Concatenating the following numbers as strings results in '10000000100040008000100000000000'
      return (([1e7] ) + 1e3 + 4e3 + 8e3 + 1e11).replace(/[018]/g, c =>
        // eslint-disable-next-line no-bitwise
        ((c ) ^ ((getRandomByte() & 15) >> ((c ) / 4))).toString(16),
      );
    }
  
    function getFirstException(event) {
      return event.exception && event.exception.values ? event.exception.values[0] : undefined;
    }
  
    /**
     * Extracts either message or type+value from an event that can be used for user-facing logs
     * @returns event's description
     */
    function getEventDescription(event) {
      const { message, event_id: eventId } = event;
      if (message) {
        return message;
      }
  
      const firstException = getFirstException(event);
      if (firstException) {
        if (firstException.type && firstException.value) {
          return `${firstException.type}: ${firstException.value}`;
        }
        return firstException.type || firstException.value || eventId || '<unknown>';
      }
      return eventId || '<unknown>';
    }
  
    /**
     * Adds exception values, type and value to an synthetic Exception.
     * @param event The event to modify.
     * @param value Value of the exception.
     * @param type Type of the exception.
     * @hidden
     */
    function addExceptionTypeValue(event, value, type) {
      const exception = (event.exception = event.exception || {});
      const values = (exception.values = exception.values || []);
      const firstException = (values[0] = values[0] || {});
      if (!firstException.value) {
        firstException.value = value || '';
      }
      if (!firstException.type) {
        firstException.type = type || 'Error';
      }
    }
  
    /**
     * Adds exception mechanism data to a given event. Uses defaults if the second parameter is not passed.
     *
     * @param event The event to modify.
     * @param newMechanism Mechanism data to add to the event.
     * @hidden
     */
    function addExceptionMechanism(event, newMechanism) {
      const firstException = getFirstException(event);
      if (!firstException) {
        return;
      }
  
      const defaultMechanism = { type: 'generic', handled: true };
      const currentMechanism = firstException.mechanism;
      firstException.mechanism = { ...defaultMechanism, ...currentMechanism, ...newMechanism };
  
      if (newMechanism && 'data' in newMechanism) {
        const mergedData = { ...(currentMechanism && currentMechanism.data), ...newMechanism.data };
        firstException.mechanism.data = mergedData;
      }
    }
  
    /**
     * Checks whether or not we've already captured the given exception (note: not an identical exception - the very object
     * in question), and marks it captured if not.
     *
     * This is useful because it's possible for an error to get captured by more than one mechanism. After we intercept and
     * record an error, we rethrow it (assuming we've intercepted it before it's reached the top-level global handlers), so
     * that we don't interfere with whatever effects the error might have had were the SDK not there. At that point, because
     * the error has been rethrown, it's possible for it to bubble up to some other code we've instrumented. If it's not
     * caught after that, it will bubble all the way up to the global handlers (which of course we also instrument). This
     * function helps us ensure that even if we encounter the same error more than once, we only record it the first time we
     * see it.
     *
     * Note: It will ignore primitives (always return `false` and not mark them as seen), as properties can't be set on
     * them. {@link: Object.objectify} can be used on exceptions to convert any that are primitives into their equivalent
     * object wrapper forms so that this check will always work. However, because we need to flag the exact object which
     * will get rethrown, and because that rethrowing happens outside of the event processing pipeline, the objectification
     * must be done before the exception captured.
     *
     * @param A thrown exception to check or flag as having been seen
     * @returns `true` if the exception has already been captured, `false` if not (with the side effect of marking it seen)
     */
    function checkOrSetAlreadyCaught(exception) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (exception && (exception ).__sentry_captured__) {
        return true;
      }
  
      try {
        // set it this way rather than by assignment so that it's not ennumerable and therefore isn't recorded by the
        // `ExtraErrorData` integration
        addNonEnumerableProperty(exception , '__sentry_captured__', true);
      } catch (err) {
        // `exception` is a primitive, so we can't mark it seen
      }
  
      return false;
    }
  
    /**
     * Checks whether the given input is already an array, and if it isn't, wraps it in one.
     *
     * @param maybeArray Input to turn into an array, if necessary
     * @returns The input, if already an array, or an array with the input as the only element, if not
     */
    function arrayify(maybeArray) {
      return Array.isArray(maybeArray) ? maybeArray : [maybeArray];
    }
  
    /*
     * This module exists for optimizations in the build process through rollup and terser.  We define some global
     * constants, which can be overridden during build. By guarding certain pieces of code with functions that return these
     * constants, we can control whether or not they appear in the final bundle. (Any code guarded by a false condition will
     * never run, and will hence be dropped during treeshaking.) The two primary uses for this are stripping out calls to
     * `logger` and preventing node-related code from appearing in browser bundles.
     *
     * Attention:
     * This file should not be used to define constants/flags that are intended to be used for tree-shaking conducted by
     * users. These flags should live in their respective packages, as we identified user tooling (specifically webpack)
     * having issues tree-shaking these constants across package boundaries.
     * An example for this is the true constant. It is declared in each package individually because we want
     * users to be able to shake away expressions that it guards.
     */
  
    /**
     * Get source of SDK.
     */
    function getSDKSource() {
      // @ts-ignore "npm" is injected by rollup during build process
      return "npm";
    }
  
    /**
     * Recursively normalizes the given object.
     *
     * - Creates a copy to prevent original input mutation
     * - Skips non-enumerable properties
     * - When stringifying, calls `toJSON` if implemented
     * - Removes circular references
     * - Translates non-serializable values (`undefined`/`NaN`/functions) to serializable format
     * - Translates known global objects/classes to a string representations
     * - Takes care of `Error` object serialization
     * - Optionally limits depth of final output
     * - Optionally limits number of properties/elements included in any single object/array
     *
     * @param input The object to be normalized.
     * @param depth The max depth to which to normalize the object. (Anything deeper stringified whole.)
     * @param maxProperties The max number of elements or properties to be included in any single array or
     * object in the normallized output.
     * @returns A normalized version of the object, or `"**non-serializable**"` if any errors are thrown during normalization.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function normalize(input, depth = 100, maxProperties = +Infinity) {
      try {
        // since we're at the outermost level, we don't provide a key
        return visit('', input, depth, maxProperties);
      } catch (err) {
        return { ERROR: `**non-serializable** (${err})` };
      }
    }
  
    /** JSDoc */
    function normalizeToSize(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      object,
      // Default Node.js REPL depth
      depth = 3,
      // 100kB, as 200kB is max payload size, so half sounds reasonable
      maxSize = 100 * 1024,
    ) {
      const normalized = normalize(object, depth);
  
      if (jsonSize(normalized) > maxSize) {
        return normalizeToSize(object, depth - 1, maxSize);
      }
  
      return normalized ;
    }
  
    /**
     * Visits a node to perform normalization on it
     *
     * @param key The key corresponding to the given node
     * @param value The node to be visited
     * @param depth Optional number indicating the maximum recursion depth
     * @param maxProperties Optional maximum number of properties/elements included in any single object/array
     * @param memo Optional Memo class handling decycling
     */
    function visit(
      key,
      value,
      depth = +Infinity,
      maxProperties = +Infinity,
      memo = memoBuilder(),
    ) {
      const [memoize, unmemoize] = memo;
  
      // Get the simple cases out of the way first
      if (
        value == null || // this matches null and undefined -> eqeq not eqeqeq
        (['number', 'boolean', 'string'].includes(typeof value) && !isNaN$1(value))
      ) {
        return value ;
      }
  
      const stringified = stringifyValue(key, value);
  
      // Anything we could potentially dig into more (objects or arrays) will have come back as `"[object XXXX]"`.
      // Everything else will have already been serialized, so if we don't see that pattern, we're done.
      if (!stringified.startsWith('[object ')) {
        return stringified;
      }
  
      // From here on, we can assert that `value` is either an object or an array.
  
      // Do not normalize objects that we know have already been normalized. As a general rule, the
      // "__sentry_skip_normalization__" property should only be used sparingly and only should only be set on objects that
      // have already been normalized.
      if ((value )['__sentry_skip_normalization__']) {
        return value ;
      }
  
      // We can set `__sentry_override_normalization_depth__` on an object to ensure that from there
      // We keep a certain amount of depth.
      // This should be used sparingly, e.g. we use it for the redux integration to ensure we get a certain amount of state.
      const remainingDepth =
        typeof (value )['__sentry_override_normalization_depth__'] === 'number'
          ? ((value )['__sentry_override_normalization_depth__'] )
          : depth;
  
      // We're also done if we've reached the max depth
      if (remainingDepth === 0) {
        // At this point we know `serialized` is a string of the form `"[object XXXX]"`. Clean it up so it's just `"[XXXX]"`.
        return stringified.replace('object ', '');
      }
  
      // If we've already visited this branch, bail out, as it's circular reference. If not, note that we're seeing it now.
      if (memoize(value)) {
        return '[Circular ~]';
      }
  
      // If the value has a `toJSON` method, we call it to extract more information
      const valueWithToJSON = value ;
      if (valueWithToJSON && typeof valueWithToJSON.toJSON === 'function') {
        try {
          const jsonValue = valueWithToJSON.toJSON();
          // We need to normalize the return value of `.toJSON()` in case it has circular references
          return visit('', jsonValue, remainingDepth - 1, maxProperties, memo);
        } catch (err) {
          // pass (The built-in `toJSON` failed, but we can still try to do it ourselves)
        }
      }
  
      // At this point we know we either have an object or an array, we haven't seen it before, and we're going to recurse
      // because we haven't yet reached the max depth. Create an accumulator to hold the results of visiting each
      // property/entry, and keep track of the number of items we add to it.
      const normalized = (Array.isArray(value) ? [] : {}) ;
      let numAdded = 0;
  
      // Before we begin, convert`Error` and`Event` instances into plain objects, since some of each of their relevant
      // properties are non-enumerable and otherwise would get missed.
      const visitable = convertToPlainObject(value );
  
      for (const visitKey in visitable) {
        // Avoid iterating over fields in the prototype if they've somehow been exposed to enumeration.
        if (!Object.prototype.hasOwnProperty.call(visitable, visitKey)) {
          continue;
        }
  
        if (numAdded >= maxProperties) {
          normalized[visitKey] = '[MaxProperties ~]';
          break;
        }
  
        // Recursively visit all the child nodes
        const visitValue = visitable[visitKey];
        normalized[visitKey] = visit(visitKey, visitValue, remainingDepth - 1, maxProperties, memo);
  
        numAdded++;
      }
  
      // Once we've visited all the branches, remove the parent from memo storage
      unmemoize(value);
  
      // Return accumulated values
      return normalized;
    }
  
    /* eslint-disable complexity */
    /**
     * Stringify the given value. Handles various known special values and types.
     *
     * Not meant to be used on simple primitives which already have a string representation, as it will, for example, turn
     * the number 1231 into "[Object Number]", nor on `null`, as it will throw.
     *
     * @param value The value to stringify
     * @returns A stringified representation of the given value
     */
    function stringifyValue(
      key,
      // this type is a tiny bit of a cheat, since this function does handle NaN (which is technically a number), but for
      // our internal use, it'll do
      value,
    ) {
      try {
        if (key === 'domain' && value && typeof value === 'object' && (value )._events) {
          return '[Domain]';
        }
  
        if (key === 'domainEmitter') {
          return '[DomainEmitter]';
        }
  
        // It's safe to use `global`, `window`, and `document` here in this manner, as we are asserting using `typeof` first
        // which won't throw if they are not present.
  
        if (typeof global !== 'undefined' && value === global) {
          return '[Global]';
        }
  
        // eslint-disable-next-line no-restricted-globals
        if (typeof window !== 'undefined' && value === window) {
          return '[Window]';
        }
  
        // eslint-disable-next-line no-restricted-globals
        if (typeof document !== 'undefined' && value === document) {
          return '[Document]';
        }
  
        // React's SyntheticEvent thingy
        if (isSyntheticEvent(value)) {
          return '[SyntheticEvent]';
        }
  
        if (typeof value === 'number' && value !== value) {
          return '[NaN]';
        }
  
        if (typeof value === 'function') {
          return `[Function: ${getFunctionName(value)}]`;
        }
  
        if (typeof value === 'symbol') {
          return `[${String(value)}]`;
        }
  
        // stringified BigInts are indistinguishable from regular numbers, so we need to label them to avoid confusion
        if (typeof value === 'bigint') {
          return `[BigInt: ${String(value)}]`;
        }
  
        // Now that we've knocked out all the special cases and the primitives, all we have left are objects. Simply casting
        // them to strings means that instances of classes which haven't defined their `toStringTag` will just come out as
        // `"[object Object]"`. If we instead look at the constructor's name (which is the same as the name of the class),
        // we can make sure that only plain objects come out that way.
        const objName = getConstructorName(value);
  
        // Handle HTML Elements
        if (/^HTML(\w*)Element$/.test(objName)) {
          return `[HTMLElement: ${objName}]`;
        }
  
        return `[object ${objName}]`;
      } catch (err) {
        return `**non-serializable** (${err})`;
      }
    }
    /* eslint-enable complexity */
  
    function getConstructorName(value) {
      const prototype = Object.getPrototypeOf(value);
  
      return prototype ? prototype.constructor.name : 'null prototype';
    }
  
    /** Calculates bytes size of input string */
    function utf8Length(value) {
      // eslint-disable-next-line no-bitwise
      return ~-encodeURI(value).split(/%..|./).length;
    }
  
    /** Calculates bytes size of input object */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function jsonSize(value) {
      return utf8Length(JSON.stringify(value));
    }
  
    /* eslint-disable @typescript-eslint/explicit-function-return-type */
  
    /** SyncPromise internal states */
    var States; (function (States) {
      /** Pending */
      const PENDING = 0; States[States["PENDING"] = PENDING] = "PENDING";
      /** Resolved / OK */
      const RESOLVED = 1; States[States["RESOLVED"] = RESOLVED] = "RESOLVED";
      /** Rejected / Error */
      const REJECTED = 2; States[States["REJECTED"] = REJECTED] = "REJECTED";
    })(States || (States = {}));
  
    // Overloads so we can call resolvedSyncPromise without arguments and generic argument
  
    /**
     * Creates a resolved sync promise.
     *
     * @param value the value to resolve the promise with
     * @returns the resolved sync promise
     */
    function resolvedSyncPromise(value) {
      return new SyncPromise(resolve => {
        resolve(value);
      });
    }
  
    /**
     * Creates a rejected sync promise.
     *
     * @param value the value to reject the promise with
     * @returns the rejected sync promise
     */
    function rejectedSyncPromise(reason) {
      return new SyncPromise((_, reject) => {
        reject(reason);
      });
    }
  
    /**
     * Thenable class that behaves like a Promise and follows it's interface
     * but is not async internally
     */
    class SyncPromise {
       __init() {this._state = States.PENDING;}
       __init2() {this._handlers = [];}
  
       constructor(
        executor,
      ) {SyncPromise.prototype.__init.call(this);SyncPromise.prototype.__init2.call(this);SyncPromise.prototype.__init3.call(this);SyncPromise.prototype.__init4.call(this);SyncPromise.prototype.__init5.call(this);SyncPromise.prototype.__init6.call(this);
        try {
          executor(this._resolve, this._reject);
        } catch (e) {
          this._reject(e);
        }
      }
  
      /** JSDoc */
       then(
        onfulfilled,
        onrejected,
      ) {
        return new SyncPromise((resolve, reject) => {
          this._handlers.push([
            false,
            result => {
              if (!onfulfilled) {
                // TODO: ¯\_(ツ)_/¯
                // TODO: FIXME
                resolve(result );
              } else {
                try {
                  resolve(onfulfilled(result));
                } catch (e) {
                  reject(e);
                }
              }
            },
            reason => {
              if (!onrejected) {
                reject(reason);
              } else {
                try {
                  resolve(onrejected(reason));
                } catch (e) {
                  reject(e);
                }
              }
            },
          ]);
          this._executeHandlers();
        });
      }
  
      /** JSDoc */
       catch(
        onrejected,
      ) {
        return this.then(val => val, onrejected);
      }
  
      /** JSDoc */
       finally(onfinally) {
        return new SyncPromise((resolve, reject) => {
          let val;
          let isRejected;
  
          return this.then(
            value => {
              isRejected = false;
              val = value;
              if (onfinally) {
                onfinally();
              }
            },
            reason => {
              isRejected = true;
              val = reason;
              if (onfinally) {
                onfinally();
              }
            },
          ).then(() => {
            if (isRejected) {
              reject(val);
              return;
            }
  
            resolve(val );
          });
        });
      }
  
      /** JSDoc */
        __init3() {this._resolve = (value) => {
        this._setResult(States.RESOLVED, value);
      };}
  
      /** JSDoc */
        __init4() {this._reject = (reason) => {
        this._setResult(States.REJECTED, reason);
      };}
  
      /** JSDoc */
        __init5() {this._setResult = (state, value) => {
        if (this._state !== States.PENDING) {
          return;
        }
  
        if (isThenable(value)) {
          void (value ).then(this._resolve, this._reject);
          return;
        }
  
        this._state = state;
        this._value = value;
  
        this._executeHandlers();
      };}
  
      /** JSDoc */
        __init6() {this._executeHandlers = () => {
        if (this._state === States.PENDING) {
          return;
        }
  
        const cachedHandlers = this._handlers.slice();
        this._handlers = [];
  
        cachedHandlers.forEach(handler => {
          if (handler[0]) {
            return;
          }
  
          if (this._state === States.RESOLVED) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            handler[1](this._value );
          }
  
          if (this._state === States.REJECTED) {
            handler[2](this._value);
          }
  
          handler[0] = true;
        });
      };}
    }
  
    /**
     * Creates an new PromiseBuffer object with the specified limit
     * @param limit max number of promises that can be stored in the buffer
     */
    function makePromiseBuffer(limit) {
      const buffer = [];
  
      function isReady() {
        return limit === undefined || buffer.length < limit;
      }
  
      /**
       * Remove a promise from the queue.
       *
       * @param task Can be any PromiseLike<T>
       * @returns Removed promise.
       */
      function remove(task) {
        return buffer.splice(buffer.indexOf(task), 1)[0];
      }
  
      /**
       * Add a promise (representing an in-flight action) to the queue, and set it to remove itself on fulfillment.
       *
       * @param taskProducer A function producing any PromiseLike<T>; In previous versions this used to be `task:
       *        PromiseLike<T>`, but under that model, Promises were instantly created on the call-site and their executor
       *        functions therefore ran immediately. Thus, even if the buffer was full, the action still happened. By
       *        requiring the promise to be wrapped in a function, we can defer promise creation until after the buffer
       *        limit check.
       * @returns The original promise.
       */
      function add(taskProducer) {
        if (!isReady()) {
          return rejectedSyncPromise(new SentryError('Not adding Promise because buffer limit was reached.'));
        }
  
        // start the task and add its promise to the queue
        const task = taskProducer();
        if (buffer.indexOf(task) === -1) {
          buffer.push(task);
        }
        void task
          .then(() => remove(task))
          // Use `then(null, rejectionHandler)` rather than `catch(rejectionHandler)` so that we can use `PromiseLike`
          // rather than `Promise`. `PromiseLike` doesn't have a `.catch` method, making its polyfill smaller. (ES5 didn't
          // have promises, so TS has to polyfill when down-compiling.)
          .then(null, () =>
            remove(task).then(null, () => {
              // We have to add another catch here because `remove()` starts a new promise chain.
            }),
          );
        return task;
      }
  
      /**
       * Wait for all promises in the queue to resolve or for timeout to expire, whichever comes first.
       *
       * @param timeout The time, in ms, after which to resolve to `false` if the queue is still non-empty. Passing `0` (or
       * not passing anything) will make the promise wait as long as it takes for the queue to drain before resolving to
       * `true`.
       * @returns A promise which will resolve to `true` if the queue is already empty or drains before the timeout, and
       * `false` otherwise
       */
      function drain(timeout) {
        return new SyncPromise((resolve, reject) => {
          let counter = buffer.length;
  
          if (!counter) {
            return resolve(true);
          }
  
          // wait for `timeout` ms and then resolve to `false` (if not cancelled first)
          const capturedSetTimeout = setTimeout(() => {
            if (timeout && timeout > 0) {
              resolve(false);
            }
          }, timeout);
  
          // if all promises resolve in time, cancel the timer and resolve to `true`
          buffer.forEach(item => {
            void resolvedSyncPromise(item).then(() => {
              if (!--counter) {
                clearTimeout(capturedSetTimeout);
                resolve(true);
              }
            }, reject);
          });
        });
      }
  
      return {
        $: buffer,
        add,
        drain,
      };
    }
  
    /**
     * Parses string form of URL into an object
     * // borrowed from https://tools.ietf.org/html/rfc3986#appendix-B
     * // intentionally using regex and not <a/> href parsing trick because React Native and other
     * // environments where DOM might not be available
     * @returns parsed URL object
     */
    function parseUrl(url) {
      if (!url) {
        return {};
      }
  
      const match = url.match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
  
      if (!match) {
        return {};
      }
  
      // coerce to undefined values to empty string so we don't get 'undefined'
      const query = match[6] || '';
      const fragment = match[8] || '';
      return {
        host: match[4],
        path: match[5],
        protocol: match[2],
        search: query,
        hash: fragment,
        relative: match[5] + query + fragment, // everything minus origin
      };
    }
  
    // Note: Ideally the `SeverityLevel` type would be derived from `validSeverityLevels`, but that would mean either
    //
    // a) moving `validSeverityLevels` to `@sentry/types`,
    // b) moving the`SeverityLevel` type here, or
    // c) importing `validSeverityLevels` from here into `@sentry/types`.
    //
    // Option A would make `@sentry/types` a runtime dependency of `@sentry/utils` (not good), and options B and C would
    // create a circular dependency between `@sentry/types` and `@sentry/utils` (also not good). So a TODO accompanying the
    // type, reminding anyone who changes it to change this list also, will have to do.
  
    const validSeverityLevels = ['fatal', 'error', 'warning', 'log', 'info', 'debug'];
  
    /**
     * Converts a string-based level into a `SeverityLevel`, normalizing it along the way.
     *
     * @param level String representation of desired `SeverityLevel`.
     * @returns The `SeverityLevel` corresponding to the given string, or 'log' if the string isn't a valid level.
     */
    function severityLevelFromString(level) {
      return (level === 'warn' ? 'warning' : validSeverityLevels.includes(level) ? level : 'log') ;
    }
  
    // eslint-disable-next-line deprecation/deprecation
    const WINDOW$2 = getGlobalObject();
  
    /**
     * An object that can return the current timestamp in seconds since the UNIX epoch.
     */
  
    /**
     * A TimestampSource implementation for environments that do not support the Performance Web API natively.
     *
     * Note that this TimestampSource does not use a monotonic clock. A call to `nowSeconds` may return a timestamp earlier
     * than a previously returned value. We do not try to emulate a monotonic behavior in order to facilitate debugging. It
     * is more obvious to explain "why does my span have negative duration" than "why my spans have zero duration".
     */
    const dateTimestampSource = {
      nowSeconds: () => Date.now() / 1000,
    };
  
    /**
     * A partial definition of the [Performance Web API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Performance}
     * for accessing a high-resolution monotonic clock.
     */
  
    /**
     * Returns a wrapper around the native Performance API browser implementation, or undefined for browsers that do not
     * support the API.
     *
     * Wrapping the native API works around differences in behavior from different browsers.
     */
    function getBrowserPerformance() {
      const { performance } = WINDOW$2;
      if (!performance || !performance.now) {
        return undefined;
      }
  
      // Replace performance.timeOrigin with our own timeOrigin based on Date.now().
      //
      // This is a partial workaround for browsers reporting performance.timeOrigin such that performance.timeOrigin +
      // performance.now() gives a date arbitrarily in the past.
      //
      // Additionally, computing timeOrigin in this way fills the gap for browsers where performance.timeOrigin is
      // undefined.
      //
      // The assumption that performance.timeOrigin + performance.now() ~= Date.now() is flawed, but we depend on it to
      // interact with data coming out of performance entries.
      //
      // Note that despite recommendations against it in the spec, browsers implement the Performance API with a clock that
      // might stop when the computer is asleep (and perhaps under other circumstances). Such behavior causes
      // performance.timeOrigin + performance.now() to have an arbitrary skew over Date.now(). In laptop computers, we have
      // observed skews that can be as long as days, weeks or months.
      //
      // See https://github.com/getsentry/sentry-javascript/issues/2590.
      //
      // BUG: despite our best intentions, this workaround has its limitations. It mostly addresses timings of pageload
      // transactions, but ignores the skew built up over time that can aversely affect timestamps of navigation
      // transactions of long-lived web pages.
      const timeOrigin = Date.now() - performance.now();
  
      return {
        now: () => performance.now(),
        timeOrigin,
      };
    }
  
    /**
     * The Performance API implementation for the current platform, if available.
     */
    const platformPerformance = getBrowserPerformance();
  
    const timestampSource =
      platformPerformance === undefined
        ? dateTimestampSource
        : {
            nowSeconds: () => (platformPerformance.timeOrigin + platformPerformance.now()) / 1000,
          };
  
    /**
     * Returns a timestamp in seconds since the UNIX epoch using the Date API.
     */
    const dateTimestampInSeconds = dateTimestampSource.nowSeconds.bind(dateTimestampSource);
  
    /**
     * Returns a timestamp in seconds since the UNIX epoch using either the Performance or Date APIs, depending on the
     * availability of the Performance API.
     *
     * See `usingPerformanceAPI` to test whether the Performance API is used.
     *
     * BUG: Note that because of how browsers implement the Performance API, the clock might stop when the computer is
     * asleep. This creates a skew between `dateTimestampInSeconds` and `timestampInSeconds`. The
     * skew can grow to arbitrary amounts like days, weeks or months.
     * See https://github.com/getsentry/sentry-javascript/issues/2590.
     */
    const timestampInSeconds = timestampSource.nowSeconds.bind(timestampSource);
  
    /**
     * The number of milliseconds since the UNIX epoch. This value is only usable in a browser, and only when the
     * performance API is available.
     */
    const browserPerformanceTimeOrigin = (() => {
      // Unfortunately browsers may report an inaccurate time origin data, through either performance.timeOrigin or
      // performance.timing.navigationStart, which results in poor results in performance data. We only treat time origin
      // data as reliable if they are within a reasonable threshold of the current time.
  
      const { performance } = WINDOW$2;
      if (!performance || !performance.now) {
        return undefined;
      }
  
      const threshold = 3600 * 1000;
      const performanceNow = performance.now();
      const dateNow = Date.now();
  
      // if timeOrigin isn't available set delta to threshold so it isn't used
      const timeOriginDelta = performance.timeOrigin
        ? Math.abs(performance.timeOrigin + performanceNow - dateNow)
        : threshold;
      const timeOriginIsReliable = timeOriginDelta < threshold;
  
      // While performance.timing.navigationStart is deprecated in favor of performance.timeOrigin, performance.timeOrigin
      // is not as widely supported. Namely, performance.timeOrigin is undefined in Safari as of writing.
      // Also as of writing, performance.timing is not available in Web Workers in mainstream browsers, so it is not always
      // a valid fallback. In the absence of an initial time provided by the browser, fallback to the current time from the
      // Date API.
      // eslint-disable-next-line deprecation/deprecation
      const navigationStart = performance.timing && performance.timing.navigationStart;
      const hasNavigationStart = typeof navigationStart === 'number';
      // if navigationStart isn't available set delta to threshold so it isn't used
      const navigationStartDelta = hasNavigationStart ? Math.abs(navigationStart + performanceNow - dateNow) : threshold;
      const navigationStartIsReliable = navigationStartDelta < threshold;
  
      if (timeOriginIsReliable || navigationStartIsReliable) {
        // Use the more reliable time origin
        if (timeOriginDelta <= navigationStartDelta) {
          return performance.timeOrigin;
        } else {
          return navigationStart;
        }
      }
      return dateNow;
    })();
  
    const TRACEPARENT_REGEXP = new RegExp(
      '^[ \\t]*' + // whitespace
        '([0-9a-f]{32})?' + // trace_id
        '-?([0-9a-f]{16})?' + // span_id
        '-?([01])?' + // sampled
        '[ \\t]*$', // whitespace
    );
  
    /**
     * Extract transaction context data from a `sentry-trace` header.
     *
     * @param traceparent Traceparent string
     *
     * @returns Object containing data from the header, or undefined if traceparent string is malformed
     */
    function extractTraceparentData(traceparent) {
      const matches = traceparent.match(TRACEPARENT_REGEXP);
  
      if (!traceparent || !matches) {
        // empty string or no matches is invalid traceparent data
        return undefined;
      }
  
      let parentSampled;
      if (matches[3] === '1') {
        parentSampled = true;
      } else if (matches[3] === '0') {
        parentSampled = false;
      }
  
      return {
        traceId: matches[1],
        parentSampled,
        parentSpanId: matches[2],
      };
    }
  
    /**
     * Creates an envelope.
     * Make sure to always explicitly provide the generic to this function
     * so that the envelope types resolve correctly.
     */
    function createEnvelope(headers, items = []) {
      return [headers, items] ;
    }
  
    /**
     * Add an item to an envelope.
     * Make sure to always explicitly provide the generic to this function
     * so that the envelope types resolve correctly.
     */
    function addItemToEnvelope(envelope, newItem) {
      const [headers, items] = envelope;
      return [headers, [...items, newItem]] ;
    }
  
    /**
     * Convenience function to loop through the items and item types of an envelope.
     * (This function was mostly created because working with envelope types is painful at the moment)
     *
     * If the callback returns true, the rest of the items will be skipped.
     */
    function forEachEnvelopeItem(
      envelope,
      callback,
    ) {
      const envelopeItems = envelope[1];
  
      for (const envelopeItem of envelopeItems) {
        const envelopeItemType = envelopeItem[0].type;
        const result = callback(envelopeItem, envelopeItemType);
  
        if (result) {
          return true;
        }
      }
  
      return false;
    }
  
    /**
     * Encode a string to UTF8.
     */
    function encodeUTF8(input, textEncoder) {
      const utf8 = textEncoder || new TextEncoder();
      return utf8.encode(input);
    }
  
    /**
     * Serializes an envelope.
     */
    function serializeEnvelope(envelope, textEncoder) {
      const [envHeaders, items] = envelope;
  
      // Initially we construct our envelope as a string and only convert to binary chunks if we encounter binary data
      let parts = JSON.stringify(envHeaders);
  
      function append(next) {
        if (typeof parts === 'string') {
          parts = typeof next === 'string' ? parts + next : [encodeUTF8(parts, textEncoder), next];
        } else {
          parts.push(typeof next === 'string' ? encodeUTF8(next, textEncoder) : next);
        }
      }
  
      for (const item of items) {
        const [itemHeaders, payload] = item;
  
        append(`\n${JSON.stringify(itemHeaders)}\n`);
  
        if (typeof payload === 'string' || payload instanceof Uint8Array) {
          append(payload);
        } else {
          let stringifiedPayload;
          try {
            stringifiedPayload = JSON.stringify(payload);
          } catch (e) {
            // In case, despite all our efforts to keep `payload` circular-dependency-free, `JSON.strinify()` still
            // fails, we try again after normalizing it again with infinite normalization depth. This of course has a
            // performance impact but in this case a performance hit is better than throwing.
            stringifiedPayload = JSON.stringify(normalize(payload));
          }
          append(stringifiedPayload);
        }
      }
  
      return typeof parts === 'string' ? parts : concatBuffers(parts);
    }
  
    function concatBuffers(buffers) {
      const totalLength = buffers.reduce((acc, buf) => acc + buf.length, 0);
  
      const merged = new Uint8Array(totalLength);
      let offset = 0;
      for (const buffer of buffers) {
        merged.set(buffer, offset);
        offset += buffer.length;
      }
  
      return merged;
    }
  
    /**
     * Creates attachment envelope items
     */
    function createAttachmentEnvelopeItem(
      attachment,
      textEncoder,
    ) {
      const buffer = typeof attachment.data === 'string' ? encodeUTF8(attachment.data, textEncoder) : attachment.data;
  
      return [
        dropUndefinedKeys({
          type: 'attachment',
          length: buffer.length,
          filename: attachment.filename,
          content_type: attachment.contentType,
          attachment_type: attachment.attachmentType,
        }),
        buffer,
      ];
    }
  
    const ITEM_TYPE_TO_DATA_CATEGORY_MAP = {
      session: 'session',
      sessions: 'session',
      attachment: 'attachment',
      transaction: 'transaction',
      event: 'error',
      client_report: 'internal',
      user_report: 'default',
      profile: 'profile',
      replay_event: 'replay',
      replay_recording: 'replay',
      check_in: 'monitor',
    };
  
    /**
     * Maps the type of an envelope item to a data category.
     */
    function envelopeItemTypeToDataCategory(type) {
      return ITEM_TYPE_TO_DATA_CATEGORY_MAP[type];
    }
  
    /** Extracts the minimal SDK info from from the metadata or an events */
    function getSdkMetadataForEnvelopeHeader(metadataOrEvent) {
      if (!metadataOrEvent || !metadataOrEvent.sdk) {
        return;
      }
      const { name, version } = metadataOrEvent.sdk;
      return { name, version };
    }
  
    /**
     * Creates event envelope headers, based on event, sdk info and tunnel
     * Note: This function was extracted from the core package to make it available in Replay
     */
    function createEventEnvelopeHeaders(
      event,
      sdkInfo,
      tunnel,
      dsn,
    ) {
      const dynamicSamplingContext = event.sdkProcessingMetadata && event.sdkProcessingMetadata.dynamicSamplingContext;
      return {
        event_id: event.event_id ,
        sent_at: new Date().toISOString(),
        ...(sdkInfo && { sdk: sdkInfo }),
        ...(!!tunnel && { dsn: dsnToString(dsn) }),
        ...(dynamicSamplingContext && {
          trace: dropUndefinedKeys({ ...dynamicSamplingContext }),
        }),
      };
    }
  
    /**
     * Creates client report envelope
     * @param discarded_events An array of discard events
     * @param dsn A DSN that can be set on the header. Optional.
     */
    function createClientReportEnvelope(
      discarded_events,
      dsn,
      timestamp,
    ) {
      const clientReportItem = [
        { type: 'client_report' },
        {
          timestamp: timestamp || dateTimestampInSeconds(),
          discarded_events,
        },
      ];
      return createEnvelope(dsn ? { dsn } : {}, [clientReportItem]);
    }
  
    // Intentionally keeping the key broad, as we don't know for sure what rate limit headers get returned from backend
  
    const DEFAULT_RETRY_AFTER = 60 * 1000; // 60 seconds
  
    /**
     * Extracts Retry-After value from the request header or returns default value
     * @param header string representation of 'Retry-After' header
     * @param now current unix timestamp
     *
     */
    function parseRetryAfterHeader(header, now = Date.now()) {
      const headerDelay = parseInt(`${header}`, 10);
      if (!isNaN(headerDelay)) {
        return headerDelay * 1000;
      }
  
      const headerDate = Date.parse(`${header}`);
      if (!isNaN(headerDate)) {
        return headerDate - now;
      }
  
      return DEFAULT_RETRY_AFTER;
    }
  
    /**
     * Gets the time that the given category is disabled until for rate limiting.
     * In case no category-specific limit is set but a general rate limit across all categories is active,
     * that time is returned.
     *
     * @return the time in ms that the category is disabled until or 0 if there's no active rate limit.
     */
    function disabledUntil(limits, category) {
      return limits[category] || limits.all || 0;
    }
  
    /**
     * Checks if a category is rate limited
     */
    function isRateLimited(limits, category, now = Date.now()) {
      return disabledUntil(limits, category) > now;
    }
  
    /**
     * Update ratelimits from incoming headers.
     *
     * @return the updated RateLimits object.
     */
    function updateRateLimits(
      limits,
      { statusCode, headers },
      now = Date.now(),
    ) {
      const updatedRateLimits = {
        ...limits,
      };
  
      // "The name is case-insensitive."
      // https://developer.mozilla.org/en-US/docs/Web/API/Headers/get
      const rateLimitHeader = headers && headers['x-sentry-rate-limits'];
      const retryAfterHeader = headers && headers['retry-after'];
  
      if (rateLimitHeader) {
        /**
         * rate limit headers are of the form
         *     <header>,<header>,..
         * where each <header> is of the form
         *     <retry_after>: <categories>: <scope>: <reason_code>
         * where
         *     <retry_after> is a delay in seconds
         *     <categories> is the event type(s) (error, transaction, etc) being rate limited and is of the form
         *         <category>;<category>;...
         *     <scope> is what's being limited (org, project, or key) - ignored by SDK
         *     <reason_code> is an arbitrary string like "org_quota" - ignored by SDK
         */
        for (const limit of rateLimitHeader.trim().split(',')) {
          const [retryAfter, categories] = limit.split(':', 2);
          const headerDelay = parseInt(retryAfter, 10);
          const delay = (!isNaN(headerDelay) ? headerDelay : 60) * 1000; // 60sec default
          if (!categories) {
            updatedRateLimits.all = now + delay;
          } else {
            for (const category of categories.split(';')) {
              updatedRateLimits[category] = now + delay;
            }
          }
        }
      } else if (retryAfterHeader) {
        updatedRateLimits.all = now + parseRetryAfterHeader(retryAfterHeader, now);
      } else if (statusCode === 429) {
        updatedRateLimits.all = now + 60 * 1000;
      }
  
      return updatedRateLimits;
    }
  
    const BAGGAGE_HEADER_NAME = 'baggage';
  
    const SENTRY_BAGGAGE_KEY_PREFIX = 'sentry-';
  
    const SENTRY_BAGGAGE_KEY_PREFIX_REGEX = /^sentry-/;
  
    /**
     * Max length of a serialized baggage string
     *
     * https://www.w3.org/TR/baggage/#limits
     */
    const MAX_BAGGAGE_STRING_LENGTH = 8192;
  
    /**
     * Takes a baggage header and turns it into Dynamic Sampling Context, by extracting all the "sentry-" prefixed values
     * from it.
     *
     * @param baggageHeader A very bread definition of a baggage header as it might appear in various frameworks.
     * @returns The Dynamic Sampling Context that was found on `baggageHeader`, if there was any, `undefined` otherwise.
     */
    function baggageHeaderToDynamicSamplingContext(
      // Very liberal definition of what any incoming header might look like
      baggageHeader,
    ) {
      if (!isString(baggageHeader) && !Array.isArray(baggageHeader)) {
        return undefined;
      }
  
      // Intermediary object to store baggage key value pairs of incoming baggage headers on.
      // It is later used to read Sentry-DSC-values from.
      let baggageObject = {};
  
      if (Array.isArray(baggageHeader)) {
        // Combine all baggage headers into one object containing the baggage values so we can later read the Sentry-DSC-values from it
        baggageObject = baggageHeader.reduce((acc, curr) => {
          const currBaggageObject = baggageHeaderToObject(curr);
          return {
            ...acc,
            ...currBaggageObject,
          };
        }, {});
      } else {
        // Return undefined if baggage header is an empty string (technically an empty baggage header is not spec conform but
        // this is how we choose to handle it)
        if (!baggageHeader) {
          return undefined;
        }
  
        baggageObject = baggageHeaderToObject(baggageHeader);
      }
  
      // Read all "sentry-" prefixed values out of the baggage object and put it onto a dynamic sampling context object.
      const dynamicSamplingContext = Object.entries(baggageObject).reduce((acc, [key, value]) => {
        if (key.match(SENTRY_BAGGAGE_KEY_PREFIX_REGEX)) {
          const nonPrefixedKey = key.slice(SENTRY_BAGGAGE_KEY_PREFIX.length);
          acc[nonPrefixedKey] = value;
        }
        return acc;
      }, {});
  
      // Only return a dynamic sampling context object if there are keys in it.
      // A keyless object means there were no sentry values on the header, which means that there is no DSC.
      if (Object.keys(dynamicSamplingContext).length > 0) {
        return dynamicSamplingContext ;
      } else {
        return undefined;
      }
    }
  
    /**
     * Turns a Dynamic Sampling Object into a baggage header by prefixing all the keys on the object with "sentry-".
     *
     * @param dynamicSamplingContext The Dynamic Sampling Context to turn into a header. For convenience and compatibility
     * with the `getDynamicSamplingContext` method on the Transaction class ,this argument can also be `undefined`. If it is
     * `undefined` the function will return `undefined`.
     * @returns a baggage header, created from `dynamicSamplingContext`, or `undefined` either if `dynamicSamplingContext`
     * was `undefined`, or if `dynamicSamplingContext` didn't contain any values.
     */
    function dynamicSamplingContextToSentryBaggageHeader(
      // this also takes undefined for convenience and bundle size in other places
      dynamicSamplingContext,
    ) {
      // Prefix all DSC keys with "sentry-" and put them into a new object
      const sentryPrefixedDSC = Object.entries(dynamicSamplingContext).reduce(
        (acc, [dscKey, dscValue]) => {
          if (dscValue) {
            acc[`${SENTRY_BAGGAGE_KEY_PREFIX}${dscKey}`] = dscValue;
          }
          return acc;
        },
        {},
      );
  
      return objectToBaggageHeader(sentryPrefixedDSC);
    }
  
    /**
     * Will parse a baggage header, which is a simple key-value map, into a flat object.
     *
     * @param baggageHeader The baggage header to parse.
     * @returns a flat object containing all the key-value pairs from `baggageHeader`.
     */
    function baggageHeaderToObject(baggageHeader) {
      return baggageHeader
        .split(',')
        .map(baggageEntry => baggageEntry.split('=').map(keyOrValue => decodeURIComponent(keyOrValue.trim())))
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
    }
  
    /**
     * Turns a flat object (key-value pairs) into a baggage header, which is also just key-value pairs.
     *
     * @param object The object to turn into a baggage header.
     * @returns a baggage header string, or `undefined` if the object didn't have any values, since an empty baggage header
     * is not spec compliant.
     */
    function objectToBaggageHeader(object) {
      if (Object.keys(object).length === 0) {
        // An empty baggage header is not spec compliant: We return undefined.
        return undefined;
      }
  
      return Object.entries(object).reduce((baggageHeader, [objectKey, objectValue], currentIndex) => {
        const baggageEntry = `${encodeURIComponent(objectKey)}=${encodeURIComponent(objectValue)}`;
        const newBaggageHeader = currentIndex === 0 ? baggageEntry : `${baggageHeader},${baggageEntry}`;
        if (newBaggageHeader.length > MAX_BAGGAGE_STRING_LENGTH) {
          logger.warn(
              `Not adding key: ${objectKey} with val: ${objectValue} to baggage header due to exceeding baggage size limits.`,
            );
          return baggageHeader;
        } else {
          return newBaggageHeader;
        }
      }, '');
    }
  
    const DEFAULT_ENVIRONMENT = 'production';
  
    /**
     * Creates a new `Session` object by setting certain default parameters. If optional @param context
     * is passed, the passed properties are applied to the session object.
     *
     * @param context (optional) additional properties to be applied to the returned session object
     *
     * @returns a new `Session` object
     */
    function makeSession(context) {
      // Both timestamp and started are in seconds since the UNIX epoch.
      const startingTime = timestampInSeconds();
  
      const session = {
        sid: uuid4(),
        init: true,
        timestamp: startingTime,
        started: startingTime,
        duration: 0,
        status: 'ok',
        errors: 0,
        ignoreDuration: false,
        toJSON: () => sessionToJSON(session),
      };
  
      if (context) {
        updateSession(session, context);
      }
  
      return session;
    }
  
    /**
     * Updates a session object with the properties passed in the context.
     *
     * Note that this function mutates the passed object and returns void.
     * (Had to do this instead of returning a new and updated session because closing and sending a session
     * makes an update to the session after it was passed to the sending logic.
     * @see BaseClient.captureSession )
     *
     * @param session the `Session` to update
     * @param context the `SessionContext` holding the properties that should be updated in @param session
     */
    // eslint-disable-next-line complexity
    function updateSession(session, context = {}) {
      if (context.user) {
        if (!session.ipAddress && context.user.ip_address) {
          session.ipAddress = context.user.ip_address;
        }
  
        if (!session.did && !context.did) {
          session.did = context.user.id || context.user.email || context.user.username;
        }
      }
  
      session.timestamp = context.timestamp || timestampInSeconds();
  
      if (context.ignoreDuration) {
        session.ignoreDuration = context.ignoreDuration;
      }
      if (context.sid) {
        // Good enough uuid validation. — Kamil
        session.sid = context.sid.length === 32 ? context.sid : uuid4();
      }
      if (context.init !== undefined) {
        session.init = context.init;
      }
      if (!session.did && context.did) {
        session.did = `${context.did}`;
      }
      if (typeof context.started === 'number') {
        session.started = context.started;
      }
      if (session.ignoreDuration) {
        session.duration = undefined;
      } else if (typeof context.duration === 'number') {
        session.duration = context.duration;
      } else {
        const duration = session.timestamp - session.started;
        session.duration = duration >= 0 ? duration : 0;
      }
      if (context.release) {
        session.release = context.release;
      }
      if (context.environment) {
        session.environment = context.environment;
      }
      if (!session.ipAddress && context.ipAddress) {
        session.ipAddress = context.ipAddress;
      }
      if (!session.userAgent && context.userAgent) {
        session.userAgent = context.userAgent;
      }
      if (typeof context.errors === 'number') {
        session.errors = context.errors;
      }
      if (context.status) {
        session.status = context.status;
      }
    }
  
    /**
     * Closes a session by setting its status and updating the session object with it.
     * Internally calls `updateSession` to update the passed session object.
     *
     * Note that this function mutates the passed session (@see updateSession for explanation).
     *
     * @param session the `Session` object to be closed
     * @param status the `SessionStatus` with which the session was closed. If you don't pass a status,
     *               this function will keep the previously set status, unless it was `'ok'` in which case
     *               it is changed to `'exited'`.
     */
    function closeSession(session, status) {
      let context = {};
      if (status) {
        context = { status };
      } else if (session.status === 'ok') {
        context = { status: 'exited' };
      }
  
      updateSession(session, context);
    }
  
    /**
     * Serializes a passed session object to a JSON object with a slightly different structure.
     * This is necessary because the Sentry backend requires a slightly different schema of a session
     * than the one the JS SDKs use internally.
     *
     * @param session the session to be converted
     *
     * @returns a JSON object of the passed session
     */
    function sessionToJSON(session) {
      return dropUndefinedKeys({
        sid: `${session.sid}`,
        init: session.init,
        // Make sure that sec is converted to ms for date constructor
        started: new Date(session.started * 1000).toISOString(),
        timestamp: new Date(session.timestamp * 1000).toISOString(),
        status: session.status,
        errors: session.errors,
        did: typeof session.did === 'number' || typeof session.did === 'string' ? `${session.did}` : undefined,
        duration: session.duration,
        attrs: {
          release: session.release,
          environment: session.environment,
          ip_address: session.ipAddress,
          user_agent: session.userAgent,
        },
      });
    }
  
    /**
     * Default value for maximum number of breadcrumbs added to an event.
     */
    const DEFAULT_MAX_BREADCRUMBS = 100;
  
    /**
     * Holds additional event information. {@link Scope.applyToEvent} will be
     * called by the client before an event will be sent.
     */
    class Scope  {
      /** Flag if notifying is happening. */
  
      /** Callback for client to receive scope changes. */
  
      /** Callback list that will be called after {@link applyToEvent}. */
  
      /** Array of breadcrumbs. */
  
      /** User */
  
      /** Tags */
  
      /** Extra */
  
      /** Contexts */
  
      /** Attachments */
  
      /**
       * A place to stash data which is needed at some point in the SDK's event processing pipeline but which shouldn't get
       * sent to Sentry
       */
  
      /** Fingerprint */
  
      /** Severity */
      // eslint-disable-next-line deprecation/deprecation
  
      /** Transaction Name */
  
      /** Span */
  
      /** Session */
  
      /** Request Mode Session Status */
  
      // NOTE: Any field which gets added here should get added not only to the constructor but also to the `clone` method.
  
       constructor() {
        this._notifyingListeners = false;
        this._scopeListeners = [];
        this._eventProcessors = [];
        this._breadcrumbs = [];
        this._attachments = [];
        this._user = {};
        this._tags = {};
        this._extra = {};
        this._contexts = {};
        this._sdkProcessingMetadata = {};
      }
  
      /**
       * Inherit values from the parent scope.
       * @param scope to clone.
       */
       static clone(scope) {
        const newScope = new Scope();
        if (scope) {
          newScope._breadcrumbs = [...scope._breadcrumbs];
          newScope._tags = { ...scope._tags };
          newScope._extra = { ...scope._extra };
          newScope._contexts = { ...scope._contexts };
          newScope._user = scope._user;
          newScope._level = scope._level;
          newScope._span = scope._span;
          newScope._session = scope._session;
          newScope._transactionName = scope._transactionName;
          newScope._fingerprint = scope._fingerprint;
          newScope._eventProcessors = [...scope._eventProcessors];
          newScope._requestSession = scope._requestSession;
          newScope._attachments = [...scope._attachments];
          newScope._sdkProcessingMetadata = { ...scope._sdkProcessingMetadata };
        }
        return newScope;
      }
  
      /**
       * Add internal on change listener. Used for sub SDKs that need to store the scope.
       * @hidden
       */
       addScopeListener(callback) {
        this._scopeListeners.push(callback);
      }
  
      /**
       * @inheritDoc
       */
       addEventProcessor(callback) {
        this._eventProcessors.push(callback);
        return this;
      }
  
      /**
       * @inheritDoc
       */
       setUser(user) {
        this._user = user || {};
        if (this._session) {
          updateSession(this._session, { user });
        }
        this._notifyScopeListeners();
        return this;
      }
  
      /**
       * @inheritDoc
       */
       getUser() {
        return this._user;
      }
  
      /**
       * @inheritDoc
       */
       getRequestSession() {
        return this._requestSession;
      }
  
      /**
       * @inheritDoc
       */
       setRequestSession(requestSession) {
        this._requestSession = requestSession;
        return this;
      }
  
      /**
       * @inheritDoc
       */
       setTags(tags) {
        this._tags = {
          ...this._tags,
          ...tags,
        };
        this._notifyScopeListeners();
        return this;
      }
  
      /**
       * @inheritDoc
       */
       setTag(key, value) {
        this._tags = { ...this._tags, [key]: value };
        this._notifyScopeListeners();
        return this;
      }
  
      /**
       * @inheritDoc
       */
       setExtras(extras) {
        this._extra = {
          ...this._extra,
          ...extras,
        };
        this._notifyScopeListeners();
        return this;
      }
  
      /**
       * @inheritDoc
       */
       setExtra(key, extra) {
        this._extra = { ...this._extra, [key]: extra };
        this._notifyScopeListeners();
        return this;
      }
  
      /**
       * @inheritDoc
       */
       setFingerprint(fingerprint) {
        this._fingerprint = fingerprint;
        this._notifyScopeListeners();
        return this;
      }
  
      /**
       * @inheritDoc
       */
       setLevel(
        // eslint-disable-next-line deprecation/deprecation
        level,
      ) {
        this._level = level;
        this._notifyScopeListeners();
        return this;
      }
  
      /**
       * @inheritDoc
       */
       setTransactionName(name) {
        this._transactionName = name;
        this._notifyScopeListeners();
        return this;
      }
  
      /**
       * @inheritDoc
       */
       setContext(key, context) {
        if (context === null) {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete this._contexts[key];
        } else {
          this._contexts[key] = context;
        }
  
        this._notifyScopeListeners();
        return this;
      }
  
      /**
       * @inheritDoc
       */
       setSpan(span) {
        this._span = span;
        this._notifyScopeListeners();
        return this;
      }
  
      /**
       * @inheritDoc
       */
       getSpan() {
        return this._span;
      }
  
      /**
       * @inheritDoc
       */
       getTransaction() {
        // Often, this span (if it exists at all) will be a transaction, but it's not guaranteed to be. Regardless, it will
        // have a pointer to the currently-active transaction.
        const span = this.getSpan();
        return span && span.transaction;
      }
  
      /**
       * @inheritDoc
       */
       setSession(session) {
        if (!session) {
          delete this._session;
        } else {
          this._session = session;
        }
        this._notifyScopeListeners();
        return this;
      }
  
      /**
       * @inheritDoc
       */
       getSession() {
        return this._session;
      }
  
      /**
       * @inheritDoc
       */
       update(captureContext) {
        if (!captureContext) {
          return this;
        }
  
        if (typeof captureContext === 'function') {
          const updatedScope = (captureContext )(this);
          return updatedScope instanceof Scope ? updatedScope : this;
        }
  
        if (captureContext instanceof Scope) {
          this._tags = { ...this._tags, ...captureContext._tags };
          this._extra = { ...this._extra, ...captureContext._extra };
          this._contexts = { ...this._contexts, ...captureContext._contexts };
          if (captureContext._user && Object.keys(captureContext._user).length) {
            this._user = captureContext._user;
          }
          if (captureContext._level) {
            this._level = captureContext._level;
          }
          if (captureContext._fingerprint) {
            this._fingerprint = captureContext._fingerprint;
          }
          if (captureContext._requestSession) {
            this._requestSession = captureContext._requestSession;
          }
        } else if (isPlainObject(captureContext)) {
          // eslint-disable-next-line no-param-reassign
          captureContext = captureContext ;
          this._tags = { ...this._tags, ...captureContext.tags };
          this._extra = { ...this._extra, ...captureContext.extra };
          this._contexts = { ...this._contexts, ...captureContext.contexts };
          if (captureContext.user) {
            this._user = captureContext.user;
          }
          if (captureContext.level) {
            this._level = captureContext.level;
          }
          if (captureContext.fingerprint) {
            this._fingerprint = captureContext.fingerprint;
          }
          if (captureContext.requestSession) {
            this._requestSession = captureContext.requestSession;
          }
        }
  
        return this;
      }
  
      /**
       * @inheritDoc
       */
       clear() {
        this._breadcrumbs = [];
        this._tags = {};
        this._extra = {};
        this._user = {};
        this._contexts = {};
        this._level = undefined;
        this._transactionName = undefined;
        this._fingerprint = undefined;
        this._requestSession = undefined;
        this._span = undefined;
        this._session = undefined;
        this._notifyScopeListeners();
        this._attachments = [];
        return this;
      }
  
      /**
       * @inheritDoc
       */
       addBreadcrumb(breadcrumb, maxBreadcrumbs) {
        const maxCrumbs = typeof maxBreadcrumbs === 'number' ? maxBreadcrumbs : DEFAULT_MAX_BREADCRUMBS;
  
        // No data has been changed, so don't notify scope listeners
        if (maxCrumbs <= 0) {
          return this;
        }
  
        const mergedBreadcrumb = {
          timestamp: dateTimestampInSeconds(),
          ...breadcrumb,
        };
        this._breadcrumbs = [...this._breadcrumbs, mergedBreadcrumb].slice(-maxCrumbs);
        this._notifyScopeListeners();
  
        return this;
      }
  
      /**
       * @inheritDoc
       */
       getLastBreadcrumb() {
        return this._breadcrumbs[this._breadcrumbs.length - 1];
      }
  
      /**
       * @inheritDoc
       */
       clearBreadcrumbs() {
        this._breadcrumbs = [];
        this._notifyScopeListeners();
        return this;
      }
  
      /**
       * @inheritDoc
       */
       addAttachment(attachment) {
        this._attachments.push(attachment);
        return this;
      }
  
      /**
       * @inheritDoc
       */
       getAttachments() {
        return this._attachments;
      }
  
      /**
       * @inheritDoc
       */
       clearAttachments() {
        this._attachments = [];
        return this;
      }
  
      /**
       * Applies data from the scope to the event and runs all event processors on it.
       *
       * @param event Event
       * @param hint Object containing additional information about the original exception, for use by the event processors.
       * @hidden
       */
       applyToEvent(event, hint = {}) {
        if (this._extra && Object.keys(this._extra).length) {
          event.extra = { ...this._extra, ...event.extra };
        }
        if (this._tags && Object.keys(this._tags).length) {
          event.tags = { ...this._tags, ...event.tags };
        }
        if (this._user && Object.keys(this._user).length) {
          event.user = { ...this._user, ...event.user };
        }
        if (this._contexts && Object.keys(this._contexts).length) {
          event.contexts = { ...this._contexts, ...event.contexts };
        }
        if (this._level) {
          event.level = this._level;
        }
        if (this._transactionName) {
          event.transaction = this._transactionName;
        }
  
        // We want to set the trace context for normal events only if there isn't already
        // a trace context on the event. There is a product feature in place where we link
        // errors with transaction and it relies on that.
        if (this._span) {
          event.contexts = { trace: this._span.getTraceContext(), ...event.contexts };
          const transaction = this._span.transaction;
          if (transaction) {
            event.sdkProcessingMetadata = {
              dynamicSamplingContext: transaction.getDynamicSamplingContext(),
              ...event.sdkProcessingMetadata,
            };
            const transactionName = transaction.name;
            if (transactionName) {
              event.tags = { transaction: transactionName, ...event.tags };
            }
          }
        }
  
        this._applyFingerprint(event);
  
        event.breadcrumbs = [...(event.breadcrumbs || []), ...this._breadcrumbs];
        event.breadcrumbs = event.breadcrumbs.length > 0 ? event.breadcrumbs : undefined;
  
        event.sdkProcessingMetadata = { ...event.sdkProcessingMetadata, ...this._sdkProcessingMetadata };
  
        return this._notifyEventProcessors([...getGlobalEventProcessors(), ...this._eventProcessors], event, hint);
      }
  
      /**
       * Add data which will be accessible during event processing but won't get sent to Sentry
       */
       setSDKProcessingMetadata(newData) {
        this._sdkProcessingMetadata = { ...this._sdkProcessingMetadata, ...newData };
  
        return this;
      }
  
      /**
       * This will be called after {@link applyToEvent} is finished.
       */
       _notifyEventProcessors(
        processors,
        event,
        hint,
        index = 0,
      ) {
        return new SyncPromise((resolve, reject) => {
          const processor = processors[index];
          if (event === null || typeof processor !== 'function') {
            resolve(event);
          } else {
            const result = processor({ ...event }, hint) ;
  
            processor.id &&
              result === null &&
              logger.log(`Event processor "${processor.id}" dropped event`);
  
            if (isThenable(result)) {
              void result
                .then(final => this._notifyEventProcessors(processors, final, hint, index + 1).then(resolve))
                .then(null, reject);
            } else {
              void this._notifyEventProcessors(processors, result, hint, index + 1)
                .then(resolve)
                .then(null, reject);
            }
          }
        });
      }
  
      /**
       * This will be called on every set call.
       */
       _notifyScopeListeners() {
        // We need this check for this._notifyingListeners to be able to work on scope during updates
        // If this check is not here we'll produce endless recursion when something is done with the scope
        // during the callback.
        if (!this._notifyingListeners) {
          this._notifyingListeners = true;
          this._scopeListeners.forEach(callback => {
            callback(this);
          });
          this._notifyingListeners = false;
        }
      }
  
      /**
       * Applies fingerprint from the scope to the event if there's one,
       * uses message if there's one instead or get rid of empty fingerprint
       */
       _applyFingerprint(event) {
        // Make sure it's an array first and we actually have something in place
        event.fingerprint = event.fingerprint ? arrayify(event.fingerprint) : [];
  
        // If we have something on the scope, then merge it with event
        if (this._fingerprint) {
          event.fingerprint = event.fingerprint.concat(this._fingerprint);
        }
  
        // If we have no data at all, remove empty array default
        if (event.fingerprint && !event.fingerprint.length) {
          delete event.fingerprint;
        }
      }
    }
  
    /**
     * Returns the global event processors.
     */
    function getGlobalEventProcessors() {
      return getGlobalSingleton('globalEventProcessors', () => []);
    }
  
    /**
     * Add a EventProcessor to be kept globally.
     * @param callback EventProcessor to add
     */
    function addGlobalEventProcessor(callback) {
      getGlobalEventProcessors().push(callback);
    }
  
    /**
     * API compatibility version of this hub.
     *
     * WARNING: This number should only be increased when the global interface
     * changes and new methods are introduced.
     *
     * @hidden
     */
    const API_VERSION = 4;
  
    /**
     * Default maximum number of breadcrumbs added to an event. Can be overwritten
     * with {@link Options.maxBreadcrumbs}.
     */
    const DEFAULT_BREADCRUMBS = 100;
  
    /**
     * @inheritDoc
     */
    class Hub  {
      /** Is a {@link Layer}[] containing the client and scope */
  
      /** Contains the last event id of a captured event.  */
  
      /**
       * Creates a new instance of the hub, will push one {@link Layer} into the
       * internal stack on creation.
       *
       * @param client bound to the hub.
       * @param scope bound to the hub.
       * @param version number, higher number means higher priority.
       */
       constructor(client, scope = new Scope(),   _version = API_VERSION) {this._version = _version;
        this._stack = [{ scope }];
        if (client) {
          this.bindClient(client);
        }
      }
  
      /**
       * @inheritDoc
       */
       isOlderThan(version) {
        return this._version < version;
      }
  
      /**
       * @inheritDoc
       */
       bindClient(client) {
        const top = this.getStackTop();
        top.client = client;
        if (client && client.setupIntegrations) {
          client.setupIntegrations();
        }
      }
  
      /**
       * @inheritDoc
       */
       pushScope() {
        // We want to clone the content of prev scope
        const scope = Scope.clone(this.getScope());
        this.getStack().push({
          client: this.getClient(),
          scope,
        });
        return scope;
      }
  
      /**
       * @inheritDoc
       */
       popScope() {
        if (this.getStack().length <= 1) return false;
        return !!this.getStack().pop();
      }
  
      /**
       * @inheritDoc
       */
       withScope(callback) {
        const scope = this.pushScope();
        try {
          callback(scope);
        } finally {
          this.popScope();
        }
      }
  
      /**
       * @inheritDoc
       */
       getClient() {
        return this.getStackTop().client ;
      }
  
      /** Returns the scope of the top stack. */
       getScope() {
        return this.getStackTop().scope;
      }
  
      /** Returns the scope stack for domains or the process. */
       getStack() {
        return this._stack;
      }
  
      /** Returns the topmost scope layer in the order domain > local > process. */
       getStackTop() {
        return this._stack[this._stack.length - 1];
      }
  
      /**
       * @inheritDoc
       */
       captureException(exception, hint) {
        const eventId = (this._lastEventId = hint && hint.event_id ? hint.event_id : uuid4());
        const syntheticException = new Error('Sentry syntheticException');
        this._withClient((client, scope) => {
          client.captureException(
            exception,
            {
              originalException: exception,
              syntheticException,
              ...hint,
              event_id: eventId,
            },
            scope,
          );
        });
        return eventId;
      }
  
      /**
       * @inheritDoc
       */
       captureMessage(
        message,
        // eslint-disable-next-line deprecation/deprecation
        level,
        hint,
      ) {
        const eventId = (this._lastEventId = hint && hint.event_id ? hint.event_id : uuid4());
        const syntheticException = new Error(message);
        this._withClient((client, scope) => {
          client.captureMessage(
            message,
            level,
            {
              originalException: message,
              syntheticException,
              ...hint,
              event_id: eventId,
            },
            scope,
          );
        });
        return eventId;
      }
  
      /**
       * @inheritDoc
       */
       captureEvent(event, hint) {
        const eventId = hint && hint.event_id ? hint.event_id : uuid4();
        if (!event.type) {
          this._lastEventId = eventId;
        }
  
        this._withClient((client, scope) => {
          client.captureEvent(event, { ...hint, event_id: eventId }, scope);
        });
        return eventId;
      }
  
      /**
       * @inheritDoc
       */
       lastEventId() {
        return this._lastEventId;
      }
  
      /**
       * @inheritDoc
       */
       addBreadcrumb(breadcrumb, hint) {
        const { scope, client } = this.getStackTop();
  
        if (!client) return;
  
        const { beforeBreadcrumb = null, maxBreadcrumbs = DEFAULT_BREADCRUMBS } =
          (client.getOptions && client.getOptions()) || {};
  
        if (maxBreadcrumbs <= 0) return;
  
        const timestamp = dateTimestampInSeconds();
        const mergedBreadcrumb = { timestamp, ...breadcrumb };
        const finalBreadcrumb = beforeBreadcrumb
          ? (consoleSandbox(() => beforeBreadcrumb(mergedBreadcrumb, hint)) )
          : mergedBreadcrumb;
  
        if (finalBreadcrumb === null) return;
  
        if (client.emit) {
          client.emit('beforeAddBreadcrumb', finalBreadcrumb, hint);
        }
  
        scope.addBreadcrumb(finalBreadcrumb, maxBreadcrumbs);
      }
  
      /**
       * @inheritDoc
       */
       setUser(user) {
        this.getScope().setUser(user);
      }
  
      /**
       * @inheritDoc
       */
       setTags(tags) {
        this.getScope().setTags(tags);
      }
  
      /**
       * @inheritDoc
       */
       setExtras(extras) {
        this.getScope().setExtras(extras);
      }
  
      /**
       * @inheritDoc
       */
       setTag(key, value) {
        this.getScope().setTag(key, value);
      }
  
      /**
       * @inheritDoc
       */
       setExtra(key, extra) {
        this.getScope().setExtra(key, extra);
      }
  
      /**
       * @inheritDoc
       */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
       setContext(name, context) {
        this.getScope().setContext(name, context);
      }
  
      /**
       * @inheritDoc
       */
       configureScope(callback) {
        const { scope, client } = this.getStackTop();
        if (client) {
          callback(scope);
        }
      }
  
      /**
       * @inheritDoc
       */
       run(callback) {
        const oldHub = makeMain(this);
        try {
          callback(this);
        } finally {
          makeMain(oldHub);
        }
      }
  
      /**
       * @inheritDoc
       */
       getIntegration(integration) {
        const client = this.getClient();
        if (!client) return null;
        try {
          return client.getIntegration(integration);
        } catch (_oO) {
          logger.warn(`Cannot retrieve integration ${integration.id} from the current Hub`);
          return null;
        }
      }
  
      /**
       * @inheritDoc
       */
       startTransaction(context, customSamplingContext) {
        const result = this._callExtensionMethod('startTransaction', context, customSamplingContext);
  
        if (!result) {
          // eslint-disable-next-line no-console
          console.warn(`Tracing extension 'startTransaction' has not been added. Call 'addTracingExtensions' before calling 'init':
  Sentry.addTracingExtensions();
  Sentry.init({...});
  `);
        }
  
        return result;
      }
  
      /**
       * @inheritDoc
       */
       traceHeaders() {
        return this._callExtensionMethod('traceHeaders');
      }
  
      /**
       * @inheritDoc
       */
       captureSession(endSession = false) {
        // both send the update and pull the session from the scope
        if (endSession) {
          return this.endSession();
        }
  
        // only send the update
        this._sendSessionUpdate();
      }
  
      /**
       * @inheritDoc
       */
       endSession() {
        const layer = this.getStackTop();
        const scope = layer.scope;
        const session = scope.getSession();
        if (session) {
          closeSession(session);
        }
        this._sendSessionUpdate();
  
        // the session is over; take it off of the scope
        scope.setSession();
      }
  
      /**
       * @inheritDoc
       */
       startSession(context) {
        const { scope, client } = this.getStackTop();
        const { release, environment = DEFAULT_ENVIRONMENT } = (client && client.getOptions()) || {};
  
        // Will fetch userAgent if called from browser sdk
        const { userAgent } = GLOBAL_OBJ.navigator || {};
  
        const session = makeSession({
          release,
          environment,
          user: scope.getUser(),
          ...(userAgent && { userAgent }),
          ...context,
        });
  
        // End existing session if there's one
        const currentSession = scope.getSession && scope.getSession();
        if (currentSession && currentSession.status === 'ok') {
          updateSession(currentSession, { status: 'exited' });
        }
        this.endSession();
  
        // Afterwards we set the new session on the scope
        scope.setSession(session);
  
        return session;
      }
  
      /**
       * Returns if default PII should be sent to Sentry and propagated in ourgoing requests
       * when Tracing is used.
       */
       shouldSendDefaultPii() {
        const client = this.getClient();
        const options = client && client.getOptions();
        return Boolean(options && options.sendDefaultPii);
      }
  
      /**
       * Sends the current Session on the scope
       */
       _sendSessionUpdate() {
        const { scope, client } = this.getStackTop();
  
        const session = scope.getSession();
        if (session && client && client.captureSession) {
          client.captureSession(session);
        }
      }
  
      /**
       * Internal helper function to call a method on the top client if it exists.
       *
       * @param method The method to call on the client.
       * @param args Arguments to pass to the client function.
       */
       _withClient(callback) {
        const { scope, client } = this.getStackTop();
        if (client) {
          callback(client, scope);
        }
      }
  
      /**
       * Calls global extension method and binding current instance to the function call
       */
      // @ts-ignore Function lacks ending return statement and return type does not include 'undefined'. ts(2366)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
       _callExtensionMethod(method, ...args) {
        const carrier = getMainCarrier();
        const sentry = carrier.__SENTRY__;
        if (sentry && sentry.extensions && typeof sentry.extensions[method] === 'function') {
          return sentry.extensions[method].apply(this, args);
        }
        logger.warn(`Extension method ${method} couldn't be found, doing nothing.`);
      }
    }
  
    /**
     * Returns the global shim registry.
     *
     * FIXME: This function is problematic, because despite always returning a valid Carrier,
     * it has an optional `__SENTRY__` property, which then in turn requires us to always perform an unnecessary check
     * at the call-site. We always access the carrier through this function, so we can guarantee that `__SENTRY__` is there.
     **/
    function getMainCarrier() {
      GLOBAL_OBJ.__SENTRY__ = GLOBAL_OBJ.__SENTRY__ || {
        extensions: {},
        hub: undefined,
      };
      return GLOBAL_OBJ;
    }
  
    /**
     * Replaces the current main hub with the passed one on the global object
     *
     * @returns The old replaced hub
     */
    function makeMain(hub) {
      const registry = getMainCarrier();
      const oldHub = getHubFromCarrier(registry);
      setHubOnCarrier(registry, hub);
      return oldHub;
    }
  
    /**
     * Returns the default hub instance.
     *
     * If a hub is already registered in the global carrier but this module
     * contains a more recent version, it replaces the registered version.
     * Otherwise, the currently registered hub will be returned.
     */
    function getCurrentHub() {
      // Get main carrier (global for every environment)
      const registry = getMainCarrier();
  
      if (registry.__SENTRY__ && registry.__SENTRY__.acs) {
        const hub = registry.__SENTRY__.acs.getCurrentHub();
  
        if (hub) {
          return hub;
        }
      }
  
      // Return hub that lives on a global object
      return getGlobalHub(registry);
    }
  
    function getGlobalHub(registry = getMainCarrier()) {
      // If there's no hub, or its an old API, assign a new one
      if (!hasHubOnCarrier(registry) || getHubFromCarrier(registry).isOlderThan(API_VERSION)) {
        setHubOnCarrier(registry, new Hub());
      }
  
      // Return hub that lives on a global object
      return getHubFromCarrier(registry);
    }
  
    /**
     * This will tell whether a carrier has a hub on it or not
     * @param carrier object
     */
    function hasHubOnCarrier(carrier) {
      return !!(carrier && carrier.__SENTRY__ && carrier.__SENTRY__.hub);
    }
  
    /**
     * This will create a new {@link Hub} and add to the passed object on
     * __SENTRY__.hub.
     * @param carrier object
     * @hidden
     */
    function getHubFromCarrier(carrier) {
      return getGlobalSingleton('hub', () => new Hub(), carrier);
    }
  
    /**
     * This will set passed {@link Hub} on the passed object's __SENTRY__.hub attribute
     * @param carrier object
     * @param hub Hub
     * @returns A boolean indicating success or failure
     */
    function setHubOnCarrier(carrier, hub) {
      if (!carrier) return false;
      const __SENTRY__ = (carrier.__SENTRY__ = carrier.__SENTRY__ || {});
      __SENTRY__.hub = hub;
      return true;
    }
  
    // Treeshakable guard to remove all code related to tracing
  
    /**
     * Determines if tracing is currently enabled.
     *
     * Tracing is enabled when at least one of `tracesSampleRate` and `tracesSampler` is defined in the SDK config.
     */
    function hasTracingEnabled(
      maybeOptions,
    ) {
      if (typeof __SENTRY_TRACING__ === 'boolean' && !__SENTRY_TRACING__) {
        return false;
      }
  
      const client = getCurrentHub().getClient();
      const options = maybeOptions || (client && client.getOptions());
      return !!options && (options.enableTracing || 'tracesSampleRate' in options || 'tracesSampler' in options);
    }
  
    /** Grabs active transaction off scope, if any */
    function getActiveTransaction(maybeHub) {
      const hub = maybeHub || getCurrentHub();
      const scope = hub.getScope();
      return scope.getTransaction() ;
    }
  
    let errorsInstrumented = false;
  
    /**
     * Configures global error listeners
     */
    function registerErrorInstrumentation() {
      if (errorsInstrumented) {
        return;
      }
  
      errorsInstrumented = true;
      addInstrumentationHandler('error', errorCallback);
      addInstrumentationHandler('unhandledrejection', errorCallback);
    }
  
    /**
     * If an error or unhandled promise occurs, we mark the active transaction as failed
     */
    function errorCallback() {
      const activeTransaction = getActiveTransaction();
      if (activeTransaction) {
        const status = 'internal_error';
        logger.log(`[Tracing] Transaction: ${status} -> Global error occured`);
        activeTransaction.setStatus(status);
      }
    }
  
    // The function name will be lost when bundling but we need to be able to identify this listener later to maintain the
    // node.js default exit behaviour
    errorCallback.tag = 'sentry_tracingErrorCallback';
  
    /**
     * Keeps track of finished spans for a given transaction
     * @internal
     * @hideconstructor
     * @hidden
     */
    class SpanRecorder {
       __init() {this.spans = [];}
  
       constructor(maxlen = 1000) {SpanRecorder.prototype.__init.call(this);
        this._maxlen = maxlen;
      }
  
      /**
       * This is just so that we don't run out of memory while recording a lot
       * of spans. At some point we just stop and flush out the start of the
       * trace tree (i.e.the first n spans with the smallest
       * start_timestamp).
       */
       add(span) {
        if (this.spans.length > this._maxlen) {
          span.spanRecorder = undefined;
        } else {
          this.spans.push(span);
        }
      }
    }
  
    /**
     * Span contains all data about a span
     */
    class Span  {
      /**
       * @inheritDoc
       */
       __init2() {this.traceId = uuid4();}
  
      /**
       * @inheritDoc
       */
       __init3() {this.spanId = uuid4().substring(16);}
  
      /**
       * @inheritDoc
       */
  
      /**
       * Internal keeper of the status
       */
  
      /**
       * @inheritDoc
       */
  
      /**
       * Timestamp in seconds when the span was created.
       */
       __init4() {this.startTimestamp = timestampInSeconds();}
  
      /**
       * Timestamp in seconds when the span ended.
       */
  
      /**
       * @inheritDoc
       */
  
      /**
       * @inheritDoc
       */
  
      /**
       * @inheritDoc
       */
       __init5() {this.tags = {};}
  
      /**
       * @inheritDoc
       */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
       __init6() {this.data = {};}
  
      /**
       * List of spans that were finalized
       */
  
      /**
       * @inheritDoc
       */
  
      /**
       * The instrumenter that created this span.
       */
       __init7() {this.instrumenter = 'sentry';}
  
      /**
       * You should never call the constructor manually, always use `Sentry.startTransaction()`
       * or call `startChild()` on an existing span.
       * @internal
       * @hideconstructor
       * @hidden
       */
       constructor(spanContext) {Span.prototype.__init2.call(this);Span.prototype.__init3.call(this);Span.prototype.__init4.call(this);Span.prototype.__init5.call(this);Span.prototype.__init6.call(this);Span.prototype.__init7.call(this);
        if (!spanContext) {
          return this;
        }
        if (spanContext.traceId) {
          this.traceId = spanContext.traceId;
        }
        if (spanContext.spanId) {
          this.spanId = spanContext.spanId;
        }
        if (spanContext.parentSpanId) {
          this.parentSpanId = spanContext.parentSpanId;
        }
        // We want to include booleans as well here
        if ('sampled' in spanContext) {
          this.sampled = spanContext.sampled;
        }
        if (spanContext.op) {
          this.op = spanContext.op;
        }
        if (spanContext.description) {
          this.description = spanContext.description;
        }
        if (spanContext.data) {
          this.data = spanContext.data;
        }
        if (spanContext.tags) {
          this.tags = spanContext.tags;
        }
        if (spanContext.status) {
          this.status = spanContext.status;
        }
        if (spanContext.startTimestamp) {
          this.startTimestamp = spanContext.startTimestamp;
        }
        if (spanContext.endTimestamp) {
          this.endTimestamp = spanContext.endTimestamp;
        }
        if (spanContext.instrumenter) {
          this.instrumenter = spanContext.instrumenter;
        }
      }
  
      /**
       * @inheritDoc
       */
       startChild(
        spanContext,
      ) {
        const childSpan = new Span({
          ...spanContext,
          parentSpanId: this.spanId,
          sampled: this.sampled,
          traceId: this.traceId,
        });
  
        childSpan.spanRecorder = this.spanRecorder;
        if (childSpan.spanRecorder) {
          childSpan.spanRecorder.add(childSpan);
        }
  
        childSpan.transaction = this.transaction;
  
        if (childSpan.transaction) {
          const opStr = (spanContext && spanContext.op) || '< unknown op >';
          const nameStr = childSpan.transaction.name || '< unknown name >';
          const idStr = childSpan.transaction.spanId;
  
          const logMessage = `[Tracing] Starting '${opStr}' span on transaction '${nameStr}' (${idStr}).`;
          childSpan.transaction.metadata.spanMetadata[childSpan.spanId] = { logMessage };
          logger.log(logMessage);
        }
  
        return childSpan;
      }
  
      /**
       * @inheritDoc
       */
       setTag(key, value) {
        this.tags = { ...this.tags, [key]: value };
        return this;
      }
  
      /**
       * @inheritDoc
       */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
       setData(key, value) {
        this.data = { ...this.data, [key]: value };
        return this;
      }
  
      /**
       * @inheritDoc
       */
       setStatus(value) {
        this.status = value;
        return this;
      }
  
      /**
       * @inheritDoc
       */
       setHttpStatus(httpStatus) {
        this.setTag('http.status_code', String(httpStatus));
        const spanStatus = spanStatusfromHttpCode(httpStatus);
        if (spanStatus !== 'unknown_error') {
          this.setStatus(spanStatus);
        }
        return this;
      }
  
      /**
       * @inheritDoc
       */
       isSuccess() {
        return this.status === 'ok';
      }
  
      /**
       * @inheritDoc
       */
       finish(endTimestamp) {
        if (
          // Don't call this for transactions
          this.transaction &&
          this.transaction.spanId !== this.spanId
        ) {
          const { logMessage } = this.transaction.metadata.spanMetadata[this.spanId];
          if (logMessage) {
            logger.log((logMessage ).replace('Starting', 'Finishing'));
          }
        }
  
        this.endTimestamp = typeof endTimestamp === 'number' ? endTimestamp : timestampInSeconds();
      }
  
      /**
       * @inheritDoc
       */
       toTraceparent() {
        let sampledString = '';
        if (this.sampled !== undefined) {
          sampledString = this.sampled ? '-1' : '-0';
        }
        return `${this.traceId}-${this.spanId}${sampledString}`;
      }
  
      /**
       * @inheritDoc
       */
       toContext() {
        return dropUndefinedKeys({
          data: this.data,
          description: this.description,
          endTimestamp: this.endTimestamp,
          op: this.op,
          parentSpanId: this.parentSpanId,
          sampled: this.sampled,
          spanId: this.spanId,
          startTimestamp: this.startTimestamp,
          status: this.status,
          tags: this.tags,
          traceId: this.traceId,
        });
      }
  
      /**
       * @inheritDoc
       */
       updateWithContext(spanContext) {
        this.data = spanContext.data || {};
        this.description = spanContext.description;
        this.endTimestamp = spanContext.endTimestamp;
        this.op = spanContext.op;
        this.parentSpanId = spanContext.parentSpanId;
        this.sampled = spanContext.sampled;
        this.spanId = spanContext.spanId || this.spanId;
        this.startTimestamp = spanContext.startTimestamp || this.startTimestamp;
        this.status = spanContext.status;
        this.tags = spanContext.tags || {};
        this.traceId = spanContext.traceId || this.traceId;
  
        return this;
      }
  
      /**
       * @inheritDoc
       */
       getTraceContext() {
        return dropUndefinedKeys({
          data: Object.keys(this.data).length > 0 ? this.data : undefined,
          description: this.description,
          op: this.op,
          parent_span_id: this.parentSpanId,
          span_id: this.spanId,
          status: this.status,
          tags: Object.keys(this.tags).length > 0 ? this.tags : undefined,
          trace_id: this.traceId,
        });
      }
  
      /**
       * @inheritDoc
       */
       toJSON()
  
     {
        return dropUndefinedKeys({
          data: Object.keys(this.data).length > 0 ? this.data : undefined,
          description: this.description,
          op: this.op,
          parent_span_id: this.parentSpanId,
          span_id: this.spanId,
          start_timestamp: this.startTimestamp,
          status: this.status,
          tags: Object.keys(this.tags).length > 0 ? this.tags : undefined,
          timestamp: this.endTimestamp,
          trace_id: this.traceId,
        });
      }
    }
  
    /**
     * Converts a HTTP status code into a {@link SpanStatusType}.
     *
     * @param httpStatus The HTTP response status code.
     * @returns The span status or unknown_error.
     */
    function spanStatusfromHttpCode(httpStatus) {
      if (httpStatus < 400 && httpStatus >= 100) {
        return 'ok';
      }
  
      if (httpStatus >= 400 && httpStatus < 500) {
        switch (httpStatus) {
          case 401:
            return 'unauthenticated';
          case 403:
            return 'permission_denied';
          case 404:
            return 'not_found';
          case 409:
            return 'already_exists';
          case 413:
            return 'failed_precondition';
          case 429:
            return 'resource_exhausted';
          default:
            return 'invalid_argument';
        }
      }
  
      if (httpStatus >= 500 && httpStatus < 600) {
        switch (httpStatus) {
          case 501:
            return 'unimplemented';
          case 503:
            return 'unavailable';
          case 504:
            return 'deadline_exceeded';
          default:
            return 'internal_error';
        }
      }
  
      return 'unknown_error';
    }
  
    /** JSDoc */
    class Transaction extends Span  {
  
      /**
       * The reference to the current hub.
       */
  
       __init() {this._measurements = {};}
  
       __init2() {this._contexts = {};}
  
       __init3() {this._frozenDynamicSamplingContext = undefined;}
  
      /**
       * This constructor should never be called manually. Those instrumenting tracing should use
       * `Sentry.startTransaction()`, and internal methods should use `hub.startTransaction()`.
       * @internal
       * @hideconstructor
       * @hidden
       */
       constructor(transactionContext, hub) {
        super(transactionContext);Transaction.prototype.__init.call(this);Transaction.prototype.__init2.call(this);Transaction.prototype.__init3.call(this);
        this._hub = hub || getCurrentHub();
  
        this._name = transactionContext.name || '';
  
        this.metadata = {
          source: 'custom',
          ...transactionContext.metadata,
          spanMetadata: {},
        };
  
        this._trimEnd = transactionContext.trimEnd;
  
        // this is because transactions are also spans, and spans have a transaction pointer
        this.transaction = this;
  
        // If Dynamic Sampling Context is provided during the creation of the transaction, we freeze it as it usually means
        // there is incoming Dynamic Sampling Context. (Either through an incoming request, a baggage meta-tag, or other means)
        const incomingDynamicSamplingContext = this.metadata.dynamicSamplingContext;
        if (incomingDynamicSamplingContext) {
          // We shallow copy this in case anything writes to the original reference of the passed in `dynamicSamplingContext`
          this._frozenDynamicSamplingContext = { ...incomingDynamicSamplingContext };
        }
      }
  
      /** Getter for `name` property */
       get name() {
        return this._name;
      }
  
      /** Setter for `name` property, which also sets `source` as custom */
       set name(newName) {
        this.setName(newName);
      }
  
      /**
       * JSDoc
       */
       setName(name, source = 'custom') {
        this._name = name;
        this.metadata.source = source;
      }
  
      /**
       * Attaches SpanRecorder to the span itself
       * @param maxlen maximum number of spans that can be recorded
       */
       initSpanRecorder(maxlen = 1000) {
        if (!this.spanRecorder) {
          this.spanRecorder = new SpanRecorder(maxlen);
        }
        this.spanRecorder.add(this);
      }
  
      /**
       * @inheritDoc
       */
       setContext(key, context) {
        if (context === null) {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete this._contexts[key];
        } else {
          this._contexts[key] = context;
        }
      }
  
      /**
       * @inheritDoc
       */
       setMeasurement(name, value, unit = '') {
        this._measurements[name] = { value, unit };
      }
  
      /**
       * @inheritDoc
       */
       setMetadata(newMetadata) {
        this.metadata = { ...this.metadata, ...newMetadata };
      }
  
      /**
       * @inheritDoc
       */
       finish(endTimestamp) {
        // This transaction is already finished, so we should not flush it again.
        if (this.endTimestamp !== undefined) {
          return undefined;
        }
  
        if (!this.name) {
          logger.warn('Transaction has no name, falling back to `<unlabeled transaction>`.');
          this.name = '<unlabeled transaction>';
        }
  
        // just sets the end timestamp
        super.finish(endTimestamp);
  
        const client = this._hub.getClient();
        if (client && client.emit) {
          client.emit('finishTransaction', this);
        }
  
        if (this.sampled !== true) {
          // At this point if `sampled !== true` we want to discard the transaction.
          logger.log('[Tracing] Discarding transaction because its trace was not chosen to be sampled.');
  
          if (client) {
            client.recordDroppedEvent('sample_rate', 'transaction');
          }
  
          return undefined;
        }
  
        const finishedSpans = this.spanRecorder ? this.spanRecorder.spans.filter(s => s !== this && s.endTimestamp) : [];
  
        if (this._trimEnd && finishedSpans.length > 0) {
          this.endTimestamp = finishedSpans.reduce((prev, current) => {
            if (prev.endTimestamp && current.endTimestamp) {
              return prev.endTimestamp > current.endTimestamp ? prev : current;
            }
            return prev;
          }).endTimestamp;
        }
  
        const metadata = this.metadata;
  
        const transaction = {
          contexts: {
            ...this._contexts,
            // We don't want to override trace context
            trace: this.getTraceContext(),
          },
          spans: finishedSpans,
          start_timestamp: this.startTimestamp,
          tags: this.tags,
          timestamp: this.endTimestamp,
          transaction: this.name,
          type: 'transaction',
          sdkProcessingMetadata: {
            ...metadata,
            dynamicSamplingContext: this.getDynamicSamplingContext(),
          },
          ...(metadata.source && {
            transaction_info: {
              source: metadata.source,
            },
          }),
        };
  
        const hasMeasurements = Object.keys(this._measurements).length > 0;
  
        if (hasMeasurements) {
          logger.log(
              '[Measurements] Adding measurements to transaction',
              JSON.stringify(this._measurements, undefined, 2),
            );
          transaction.measurements = this._measurements;
        }
  
        logger.log(`[Tracing] Finishing ${this.op} transaction: ${this.name}.`);
  
        return this._hub.captureEvent(transaction);
      }
  
      /**
       * @inheritDoc
       */
       toContext() {
        const spanContext = super.toContext();
  
        return dropUndefinedKeys({
          ...spanContext,
          name: this.name,
          trimEnd: this._trimEnd,
        });
      }
  
      /**
       * @inheritDoc
       */
       updateWithContext(transactionContext) {
        super.updateWithContext(transactionContext);
  
        this.name = transactionContext.name || '';
  
        this._trimEnd = transactionContext.trimEnd;
  
        return this;
      }
  
      /**
       * @inheritdoc
       *
       * @experimental
       */
       getDynamicSamplingContext() {
        if (this._frozenDynamicSamplingContext) {
          return this._frozenDynamicSamplingContext;
        }
  
        const hub = this._hub || getCurrentHub();
        const client = hub && hub.getClient();
  
        if (!client) return {};
  
        const { environment, release } = client.getOptions() || {};
        const { publicKey: public_key } = client.getDsn() || {};
  
        const maybeSampleRate = this.metadata.sampleRate;
        const sample_rate = maybeSampleRate !== undefined ? maybeSampleRate.toString() : undefined;
  
        const { segment: user_segment } = hub.getScope().getUser() || {};
  
        const source = this.metadata.source;
  
        // We don't want to have a transaction name in the DSC if the source is "url" because URLs might contain PII
        const transaction = source && source !== 'url' ? this.name : undefined;
  
        const dsc = dropUndefinedKeys({
          environment: environment || DEFAULT_ENVIRONMENT,
          release,
          transaction,
          user_segment,
          public_key,
          trace_id: this.traceId,
          sample_rate,
        });
  
        // Uncomment if we want to make DSC immutable
        // this._frozenDynamicSamplingContext = dsc;
  
        client.emit && client.emit('createDsc', dsc);
  
        return dsc;
      }
  
      /**
       * Override the current hub with a new one.
       * Used if you want another hub to finish the transaction.
       *
       * @internal
       */
       setHub(hub) {
        this._hub = hub;
      }
    }
  
    const TRACING_DEFAULTS = {
      idleTimeout: 1000,
      finalTimeout: 30000,
      heartbeatInterval: 5000,
    };
  
    const FINISH_REASON_TAG = 'finishReason';
  
    const IDLE_TRANSACTION_FINISH_REASONS = [
      'heartbeatFailed',
      'idleTimeout',
      'documentHidden',
      'finalTimeout',
      'externalFinish',
      'cancelled',
    ];
  
    /**
     * @inheritDoc
     */
    class IdleTransactionSpanRecorder extends SpanRecorder {
       constructor(
          _pushActivity,
          _popActivity,
         transactionSpanId,
        maxlen,
      ) {
        super(maxlen);this._pushActivity = _pushActivity;this._popActivity = _popActivity;this.transactionSpanId = transactionSpanId;  }
  
      /**
       * @inheritDoc
       */
       add(span) {
        // We should make sure we do not push and pop activities for
        // the transaction that this span recorder belongs to.
        if (span.spanId !== this.transactionSpanId) {
          // We patch span.finish() to pop an activity after setting an endTimestamp.
          span.finish = (endTimestamp) => {
            span.endTimestamp = typeof endTimestamp === 'number' ? endTimestamp : timestampInSeconds();
            this._popActivity(span.spanId);
          };
  
          // We should only push new activities if the span does not have an end timestamp.
          if (span.endTimestamp === undefined) {
            this._pushActivity(span.spanId);
          }
        }
  
        super.add(span);
      }
    }
  
    /**
     * An IdleTransaction is a transaction that automatically finishes. It does this by tracking child spans as activities.
     * You can have multiple IdleTransactions active, but if the `onScope` option is specified, the idle transaction will
     * put itself on the scope on creation.
     */
    class IdleTransaction extends Transaction {
      // Activities store a list of active spans
       __init() {this.activities = {};}
  
      // Track state of activities in previous heartbeat
  
      // Amount of times heartbeat has counted. Will cause transaction to finish after 3 beats.
       __init2() {this._heartbeatCounter = 0;}
  
      // We should not use heartbeat if we finished a transaction
       __init3() {this._finished = false;}
  
      // Idle timeout was canceled and we should finish the transaction with the last span end.
       __init4() {this._idleTimeoutCanceledPermanently = false;}
  
        __init5() {this._beforeFinishCallbacks = [];}
  
      /**
       * Timer that tracks Transaction idleTimeout
       */
  
       __init6() {this._finishReason = IDLE_TRANSACTION_FINISH_REASONS[4];}
  
       constructor(
        transactionContext,
          _idleHub,
        /**
         * The time to wait in ms until the idle transaction will be finished. This timer is started each time
         * there are no active spans on this transaction.
         */
          _idleTimeout = TRACING_DEFAULTS.idleTimeout,
        /**
         * The final value in ms that a transaction cannot exceed
         */
          _finalTimeout = TRACING_DEFAULTS.finalTimeout,
          _heartbeatInterval = TRACING_DEFAULTS.heartbeatInterval,
        // Whether or not the transaction should put itself on the scope when it starts and pop itself off when it ends
          _onScope = false,
      ) {
        super(transactionContext, _idleHub);this._idleHub = _idleHub;this._idleTimeout = _idleTimeout;this._finalTimeout = _finalTimeout;this._heartbeatInterval = _heartbeatInterval;this._onScope = _onScope;IdleTransaction.prototype.__init.call(this);IdleTransaction.prototype.__init2.call(this);IdleTransaction.prototype.__init3.call(this);IdleTransaction.prototype.__init4.call(this);IdleTransaction.prototype.__init5.call(this);IdleTransaction.prototype.__init6.call(this);
        if (_onScope) {
          // We set the transaction here on the scope so error events pick up the trace
          // context and attach it to the error.
          logger.log(`Setting idle transaction on scope. Span ID: ${this.spanId}`);
          _idleHub.configureScope(scope => scope.setSpan(this));
        }
  
        this._restartIdleTimeout();
        setTimeout(() => {
          if (!this._finished) {
            this.setStatus('deadline_exceeded');
            this._finishReason = IDLE_TRANSACTION_FINISH_REASONS[3];
            this.finish();
          }
        }, this._finalTimeout);
      }
  
      /** {@inheritDoc} */
       finish(endTimestamp = timestampInSeconds()) {
        this._finished = true;
        this.activities = {};
  
        if (this.op === 'ui.action.click') {
          this.setTag(FINISH_REASON_TAG, this._finishReason);
        }
  
        if (this.spanRecorder) {
          logger.log('[Tracing] finishing IdleTransaction', new Date(endTimestamp * 1000).toISOString(), this.op);
  
          for (const callback of this._beforeFinishCallbacks) {
            callback(this, endTimestamp);
          }
  
          this.spanRecorder.spans = this.spanRecorder.spans.filter((span) => {
            // If we are dealing with the transaction itself, we just return it
            if (span.spanId === this.spanId) {
              return true;
            }
  
            // We cancel all pending spans with status "cancelled" to indicate the idle transaction was finished early
            if (!span.endTimestamp) {
              span.endTimestamp = endTimestamp;
              span.setStatus('cancelled');
              logger.log('[Tracing] cancelling span since transaction ended early', JSON.stringify(span, undefined, 2));
            }
  
            const keepSpan = span.startTimestamp < endTimestamp;
            if (!keepSpan) {
              logger.log(
                  '[Tracing] discarding Span since it happened after Transaction was finished',
                  JSON.stringify(span, undefined, 2),
                );
            }
            return keepSpan;
          });
  
          logger.log('[Tracing] flushing IdleTransaction');
        } else {
          logger.log('[Tracing] No active IdleTransaction');
        }
  
        // if `this._onScope` is `true`, the transaction put itself on the scope when it started
        if (this._onScope) {
          const scope = this._idleHub.getScope();
          if (scope.getTransaction() === this) {
            scope.setSpan(undefined);
          }
        }
  
        return super.finish(endTimestamp);
      }
  
      /**
       * Register a callback function that gets excecuted before the transaction finishes.
       * Useful for cleanup or if you want to add any additional spans based on current context.
       *
       * This is exposed because users have no other way of running something before an idle transaction
       * finishes.
       */
       registerBeforeFinishCallback(callback) {
        this._beforeFinishCallbacks.push(callback);
      }
  
      /**
       * @inheritDoc
       */
       initSpanRecorder(maxlen) {
        if (!this.spanRecorder) {
          const pushActivity = (id) => {
            if (this._finished) {
              return;
            }
            this._pushActivity(id);
          };
          const popActivity = (id) => {
            if (this._finished) {
              return;
            }
            this._popActivity(id);
          };
  
          this.spanRecorder = new IdleTransactionSpanRecorder(pushActivity, popActivity, this.spanId, maxlen);
  
          // Start heartbeat so that transactions do not run forever.
          logger.log('Starting heartbeat');
          this._pingHeartbeat();
        }
        this.spanRecorder.add(this);
      }
  
      /**
       * Cancels the existing idle timeout, if there is one.
       * @param restartOnChildSpanChange Default is `true`.
       *                                 If set to false the transaction will end
       *                                 with the last child span.
       */
       cancelIdleTimeout(
        endTimestamp,
        {
          restartOnChildSpanChange,
        }
  
     = {
          restartOnChildSpanChange: true,
        },
      ) {
        this._idleTimeoutCanceledPermanently = restartOnChildSpanChange === false;
        if (this._idleTimeoutID) {
          clearTimeout(this._idleTimeoutID);
          this._idleTimeoutID = undefined;
  
          if (Object.keys(this.activities).length === 0 && this._idleTimeoutCanceledPermanently) {
            this._finishReason = IDLE_TRANSACTION_FINISH_REASONS[5];
            this.finish(endTimestamp);
          }
        }
      }
  
      /**
       * Temporary method used to externally set the transaction's `finishReason`
       *
       * ** WARNING**
       * This is for the purpose of experimentation only and will be removed in the near future, do not use!
       *
       * @internal
       *
       */
       setFinishReason(reason) {
        this._finishReason = reason;
      }
  
      /**
       * Restarts idle timeout, if there is no running idle timeout it will start one.
       */
       _restartIdleTimeout(endTimestamp) {
        this.cancelIdleTimeout();
        this._idleTimeoutID = setTimeout(() => {
          if (!this._finished && Object.keys(this.activities).length === 0) {
            this._finishReason = IDLE_TRANSACTION_FINISH_REASONS[1];
            this.finish(endTimestamp);
          }
        }, this._idleTimeout);
      }
  
      /**
       * Start tracking a specific activity.
       * @param spanId The span id that represents the activity
       */
       _pushActivity(spanId) {
        this.cancelIdleTimeout(undefined, { restartOnChildSpanChange: !this._idleTimeoutCanceledPermanently });
        logger.log(`[Tracing] pushActivity: ${spanId}`);
        this.activities[spanId] = true;
        logger.log('[Tracing] new activities count', Object.keys(this.activities).length);
      }
  
      /**
       * Remove an activity from usage
       * @param spanId The span id that represents the activity
       */
       _popActivity(spanId) {
        if (this.activities[spanId]) {
          logger.log(`[Tracing] popActivity ${spanId}`);
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete this.activities[spanId];
          logger.log('[Tracing] new activities count', Object.keys(this.activities).length);
        }
  
        if (Object.keys(this.activities).length === 0) {
          const endTimestamp = timestampInSeconds();
          if (this._idleTimeoutCanceledPermanently) {
            this._finishReason = IDLE_TRANSACTION_FINISH_REASONS[5];
            this.finish(endTimestamp);
          } else {
            // We need to add the timeout here to have the real endtimestamp of the transaction
            // Remember timestampInSeconds is in seconds, timeout is in ms
            this._restartIdleTimeout(endTimestamp + this._idleTimeout / 1000);
          }
        }
      }
  
      /**
       * Checks when entries of this.activities are not changing for 3 beats.
       * If this occurs we finish the transaction.
       */
       _beat() {
        // We should not be running heartbeat if the idle transaction is finished.
        if (this._finished) {
          return;
        }
  
        const heartbeatString = Object.keys(this.activities).join('');
  
        if (heartbeatString === this._prevHeartbeatString) {
          this._heartbeatCounter++;
        } else {
          this._heartbeatCounter = 1;
        }
  
        this._prevHeartbeatString = heartbeatString;
  
        if (this._heartbeatCounter >= 3) {
          logger.log('[Tracing] Transaction finished because of no change for 3 heart beats');
          this.setStatus('deadline_exceeded');
          this._finishReason = IDLE_TRANSACTION_FINISH_REASONS[0];
          this.finish();
        } else {
          this._pingHeartbeat();
        }
      }
  
      /**
       * Pings the heartbeat
       */
       _pingHeartbeat() {
        logger.log(`pinging Heartbeat -> current counter: ${this._heartbeatCounter}`);
        setTimeout(() => {
          this._beat();
        }, this._heartbeatInterval);
      }
    }
  
    /** Returns all trace headers that are currently on the top scope. */
    function traceHeaders() {
      const scope = this.getScope();
      const span = scope.getSpan();
  
      return span
        ? {
            'sentry-trace': span.toTraceparent(),
          }
        : {};
    }
  
    /**
     * Makes a sampling decision for the given transaction and stores it on the transaction.
     *
     * Called every time a transaction is created. Only transactions which emerge with a `sampled` value of `true` will be
     * sent to Sentry.
     *
     * @param transaction: The transaction needing a sampling decision
     * @param options: The current client's options, so we can access `tracesSampleRate` and/or `tracesSampler`
     * @param samplingContext: Default and user-provided data which may be used to help make the decision
     *
     * @returns The given transaction with its `sampled` value set
     */
    function sample(
      transaction,
      options,
      samplingContext,
    ) {
      // nothing to do if tracing is not enabled
      if (!hasTracingEnabled(options)) {
        transaction.sampled = false;
        return transaction;
      }
  
      // if the user has forced a sampling decision by passing a `sampled` value in their transaction context, go with that
      if (transaction.sampled !== undefined) {
        transaction.setMetadata({
          sampleRate: Number(transaction.sampled),
        });
        return transaction;
      }
  
      // we would have bailed already if neither `tracesSampler` nor `tracesSampleRate` nor `enableTracing` were defined, so one of these should
      // work; prefer the hook if so
      let sampleRate;
      if (typeof options.tracesSampler === 'function') {
        sampleRate = options.tracesSampler(samplingContext);
        transaction.setMetadata({
          sampleRate: Number(sampleRate),
        });
      } else if (samplingContext.parentSampled !== undefined) {
        sampleRate = samplingContext.parentSampled;
      } else if (typeof options.tracesSampleRate !== 'undefined') {
        sampleRate = options.tracesSampleRate;
        transaction.setMetadata({
          sampleRate: Number(sampleRate),
        });
      } else {
        // When `enableTracing === true`, we use a sample rate of 100%
        sampleRate = 1;
        transaction.setMetadata({
          sampleRate,
        });
      }
  
      // Since this is coming from the user (or from a function provided by the user), who knows what we might get. (The
      // only valid values are booleans or numbers between 0 and 1.)
      if (!isValidSampleRate(sampleRate)) {
        logger.warn('[Tracing] Discarding transaction because of invalid sample rate.');
        transaction.sampled = false;
        return transaction;
      }
  
      // if the function returned 0 (or false), or if `tracesSampleRate` is 0, it's a sign the transaction should be dropped
      if (!sampleRate) {
        logger.log(
            `[Tracing] Discarding transaction because ${
            typeof options.tracesSampler === 'function'
              ? 'tracesSampler returned 0 or false'
              : 'a negative sampling decision was inherited or tracesSampleRate is set to 0'
          }`,
          );
        transaction.sampled = false;
        return transaction;
      }
  
      // Now we roll the dice. Math.random is inclusive of 0, but not of 1, so strict < is safe here. In case sampleRate is
      // a boolean, the < comparison will cause it to be automatically cast to 1 if it's true and 0 if it's false.
      transaction.sampled = Math.random() < (sampleRate );
  
      // if we're not going to keep it, we're done
      if (!transaction.sampled) {
        logger.log(
            `[Tracing] Discarding transaction because it's not included in the random sample (sampling rate = ${Number(
            sampleRate,
          )})`,
          );
        return transaction;
      }
  
      logger.log(`[Tracing] starting ${transaction.op} transaction - ${transaction.name}`);
      return transaction;
    }
  
    /**
     * Checks the given sample rate to make sure it is valid type and value (a boolean, or a number between 0 and 1).
     */
    function isValidSampleRate(rate) {
      // we need to check NaN explicitly because it's of type 'number' and therefore wouldn't get caught by this typecheck
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (isNaN$1(rate) || !(typeof rate === 'number' || typeof rate === 'boolean')) {
        logger.warn(
            `[Tracing] Given sample rate is invalid. Sample rate must be a boolean or a number between 0 and 1. Got ${JSON.stringify(
            rate,
          )} of type ${JSON.stringify(typeof rate)}.`,
          );
        return false;
      }
  
      // in case sampleRate is a boolean, it will get automatically cast to 1 if it's true and 0 if it's false
      if (rate < 0 || rate > 1) {
        logger.warn(`[Tracing] Given sample rate is invalid. Sample rate must be between 0 and 1. Got ${rate}.`);
        return false;
      }
      return true;
    }
  
    /**
     * Creates a new transaction and adds a sampling decision if it doesn't yet have one.
     *
     * The Hub.startTransaction method delegates to this method to do its work, passing the Hub instance in as `this`, as if
     * it had been called on the hub directly. Exists as a separate function so that it can be injected into the class as an
     * "extension method."
     *
     * @param this: The Hub starting the transaction
     * @param transactionContext: Data used to configure the transaction
     * @param CustomSamplingContext: Optional data to be provided to the `tracesSampler` function (if any)
     *
     * @returns The new transaction
     *
     * @see {@link Hub.startTransaction}
     */
    function _startTransaction(
  
      transactionContext,
      customSamplingContext,
    ) {
      const client = this.getClient();
      const options = (client && client.getOptions()) || {};
  
      const configInstrumenter = options.instrumenter || 'sentry';
      const transactionInstrumenter = transactionContext.instrumenter || 'sentry';
  
      if (configInstrumenter !== transactionInstrumenter) {
        logger.error(
            `A transaction was started with instrumenter=\`${transactionInstrumenter}\`, but the SDK is configured with the \`${configInstrumenter}\` instrumenter.
  The transaction will not be sampled. Please use the ${configInstrumenter} instrumentation to start transactions.`,
          );
  
        transactionContext.sampled = false;
      }
  
      let transaction = new Transaction(transactionContext, this);
      transaction = sample(transaction, options, {
        parentSampled: transactionContext.parentSampled,
        transactionContext,
        ...customSamplingContext,
      });
      if (transaction.sampled) {
        transaction.initSpanRecorder(options._experiments && (options._experiments.maxSpans ));
      }
      if (client && client.emit) {
        client.emit('startTransaction', transaction);
      }
      return transaction;
    }
  
    /**
     * Create new idle transaction.
     */
    function startIdleTransaction(
      hub,
      transactionContext,
      idleTimeout,
      finalTimeout,
      onScope,
      customSamplingContext,
      heartbeatInterval,
    ) {
      const client = hub.getClient();
      const options = (client && client.getOptions()) || {};
  
      let transaction = new IdleTransaction(transactionContext, hub, idleTimeout, finalTimeout, heartbeatInterval, onScope);
      transaction = sample(transaction, options, {
        parentSampled: transactionContext.parentSampled,
        transactionContext,
        ...customSamplingContext,
      });
      if (transaction.sampled) {
        transaction.initSpanRecorder(options._experiments && (options._experiments.maxSpans ));
      }
      if (client && client.emit) {
        client.emit('startTransaction', transaction);
      }
      return transaction;
    }
  
    /**
     * Adds tracing extensions to the global hub.
     */
    function addTracingExtensions() {
      const carrier = getMainCarrier();
      if (!carrier.__SENTRY__) {
        return;
      }
      carrier.__SENTRY__.extensions = carrier.__SENTRY__.extensions || {};
      if (!carrier.__SENTRY__.extensions.startTransaction) {
        carrier.__SENTRY__.extensions.startTransaction = _startTransaction;
      }
      if (!carrier.__SENTRY__.extensions.traceHeaders) {
        carrier.__SENTRY__.extensions.traceHeaders = traceHeaders;
      }
  
      registerErrorInstrumentation();
    }
  
    // Note: All functions in this file are typed with a return value of `ReturnType<Hub[HUB_FUNCTION]>`,
    // where HUB_FUNCTION is some method on the Hub class.
    //
    // This is done to make sure the top level SDK methods stay in sync with the hub methods.
    // Although every method here has an explicit return type, some of them (that map to void returns) do not
    // contain `return` keywords. This is done to save on bundle size, as `return` is not minifiable.
  
    /**
     * Captures an exception event and sends it to Sentry.
     *
     * @param exception An exception-like object.
     * @param captureContext Additional scope data to apply to exception event.
     * @returns The generated eventId.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    function captureException(exception, captureContext) {
      return getCurrentHub().captureException(exception, { captureContext });
    }
  
    /**
     * Captures a message event and sends it to Sentry.
     *
     * @param message The message to send to Sentry.
     * @param Severity Define the level of the message.
     * @returns The generated eventId.
     */
    function captureMessage(
      message,
      // eslint-disable-next-line deprecation/deprecation
      captureContext,
    ) {
      // This is necessary to provide explicit scopes upgrade, without changing the original
      // arity of the `captureMessage(message, level)` method.
      const level = typeof captureContext === 'string' ? captureContext : undefined;
      const context = typeof captureContext !== 'string' ? { captureContext } : undefined;
      return getCurrentHub().captureMessage(message, level, context);
    }
  
    /**
     * Captures a manually created event and sends it to Sentry.
     *
     * @param event The event to send to Sentry.
     * @returns The generated eventId.
     */
    function captureEvent(event, hint) {
      return getCurrentHub().captureEvent(event, hint);
    }
  
    /**
     * Callback to set context information onto the scope.
     * @param callback Callback function that receives Scope.
     */
    function configureScope(callback) {
      getCurrentHub().configureScope(callback);
    }
  
    /**
     * Records a new breadcrumb which will be attached to future events.
     *
     * Breadcrumbs will be added to subsequent events to provide more context on
     * user's actions prior to an error or crash.
     *
     * @param breadcrumb The breadcrumb to record.
     */
    function addBreadcrumb(breadcrumb) {
      getCurrentHub().addBreadcrumb(breadcrumb);
    }
  
    /**
     * Sets context data with the given name.
     * @param name of the context
     * @param context Any kind of data. This data will be normalized.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function setContext(name, context) {
      getCurrentHub().setContext(name, context);
    }
  
    /**
     * Set an object that will be merged sent as extra data with the event.
     * @param extras Extras object to merge into current context.
     */
    function setExtras(extras) {
      getCurrentHub().setExtras(extras);
    }
  
    /**
     * Set key:value that will be sent as extra data with the event.
     * @param key String of extra
     * @param extra Any kind of data. This data will be normalized.
     */
    function setExtra(key, extra) {
      getCurrentHub().setExtra(key, extra);
    }
  
    /**
     * Set an object that will be merged sent as tags data with the event.
     * @param tags Tags context object to merge into current context.
     */
    function setTags(tags) {
      getCurrentHub().setTags(tags);
    }
  
    /**
     * Set key:value that will be sent as tags data with the event.
     *
     * Can also be used to unset a tag, by passing `undefined`.
     *
     * @param key String key of tag
     * @param value Value of tag
     */
    function setTag(key, value) {
      getCurrentHub().setTag(key, value);
    }
  
    /**
     * Updates user context information for future events.
     *
     * @param user User context object to be set in the current context. Pass `null` to unset the user.
     */
    function setUser(user) {
      getCurrentHub().setUser(user);
    }
  
    /**
     * Creates a new scope with and executes the given operation within.
     * The scope is automatically removed once the operation
     * finishes or throws.
     *
     * This is essentially a convenience function for:
     *
     *     pushScope();
     *     callback();
     *     popScope();
     *
     * @param callback that will be enclosed into push/popScope.
     */
    function withScope(callback) {
      getCurrentHub().withScope(callback);
    }
  
    /**
     * Starts a new `Transaction` and returns it. This is the entry point to manual tracing instrumentation.
     *
     * A tree structure can be built by adding child spans to the transaction, and child spans to other spans. To start a
     * new child span within the transaction or any span, call the respective `.startChild()` method.
     *
     * Every child span must be finished before the transaction is finished, otherwise the unfinished spans are discarded.
     *
     * The transaction must be finished with a call to its `.finish()` method, at which point the transaction with all its
     * finished child spans will be sent to Sentry.
     *
     * NOTE: This function should only be used for *manual* instrumentation. Auto-instrumentation should call
     * `startTransaction` directly on the hub.
     *
     * @param context Properties of the new `Transaction`.
     * @param customSamplingContext Information given to the transaction sampling function (along with context-dependent
     * default values). See {@link Options.tracesSampler}.
     *
     * @returns The transaction which was just started
     */
    function startTransaction(
      context,
      customSamplingContext,
    ) {
      return getCurrentHub().startTransaction({ ...context }, customSamplingContext);
    }
  
    const SENTRY_API_VERSION = '7';
  
    /** Returns the prefix to construct Sentry ingestion API endpoints. */
    function getBaseApiEndpoint(dsn) {
      const protocol = dsn.protocol ? `${dsn.protocol}:` : '';
      const port = dsn.port ? `:${dsn.port}` : '';
      return `${protocol}//${dsn.host}${port}${dsn.path ? `/${dsn.path}` : ''}/api/`;
    }
  
    /** Returns the ingest API endpoint for target. */
    function _getIngestEndpoint(dsn) {
      return `${getBaseApiEndpoint(dsn)}${dsn.projectId}/envelope/`;
    }
  
    /** Returns a URL-encoded string with auth config suitable for a query string. */
    function _encodedAuth(dsn, sdkInfo) {
      return urlEncode({
        // We send only the minimum set of required information. See
        // https://github.com/getsentry/sentry-javascript/issues/2572.
        sentry_key: dsn.publicKey,
        sentry_version: SENTRY_API_VERSION,
        ...(sdkInfo && { sentry_client: `${sdkInfo.name}/${sdkInfo.version}` }),
      });
    }
  
    /**
     * Returns the envelope endpoint URL with auth in the query string.
     *
     * Sending auth as part of the query string and not as custom HTTP headers avoids CORS preflight requests.
     */
    function getEnvelopeEndpointWithUrlEncodedAuth(
      dsn,
      // TODO (v8): Remove `tunnelOrOptions` in favor of `options`, and use the substitute code below
      // options: ClientOptions = {} as ClientOptions,
      tunnelOrOptions = {} ,
    ) {
      // TODO (v8): Use this code instead
      // const { tunnel, _metadata = {} } = options;
      // return tunnel ? tunnel : `${_getIngestEndpoint(dsn)}?${_encodedAuth(dsn, _metadata.sdk)}`;
  
      const tunnel = typeof tunnelOrOptions === 'string' ? tunnelOrOptions : tunnelOrOptions.tunnel;
      const sdkInfo =
        typeof tunnelOrOptions === 'string' || !tunnelOrOptions._metadata ? undefined : tunnelOrOptions._metadata.sdk;
  
      return tunnel ? tunnel : `${_getIngestEndpoint(dsn)}?${_encodedAuth(dsn, sdkInfo)}`;
    }
  
    /** Returns the url to the report dialog endpoint. */
    function getReportDialogEndpoint(
      dsnLike,
      dialogOptions
  
    ,
    ) {
      const dsn = makeDsn(dsnLike);
      const endpoint = `${getBaseApiEndpoint(dsn)}embed/error-page/`;
  
      let encodedOptions = `dsn=${dsnToString(dsn)}`;
      for (const key in dialogOptions) {
        if (key === 'dsn') {
          continue;
        }
  
        if (key === 'user') {
          const user = dialogOptions.user;
          if (!user) {
            continue;
          }
          if (user.name) {
            encodedOptions += `&name=${encodeURIComponent(user.name)}`;
          }
          if (user.email) {
            encodedOptions += `&email=${encodeURIComponent(user.email)}`;
          }
        } else {
          encodedOptions += `&${encodeURIComponent(key)}=${encodeURIComponent(dialogOptions[key] )}`;
        }
      }
  
      return `${endpoint}?${encodedOptions}`;
    }
  
    /**
     * Apply SdkInfo (name, version, packages, integrations) to the corresponding event key.
     * Merge with existing data if any.
     **/
    function enhanceEventWithSdkInfo(event, sdkInfo) {
      if (!sdkInfo) {
        return event;
      }
      event.sdk = event.sdk || {};
      event.sdk.name = event.sdk.name || sdkInfo.name;
      event.sdk.version = event.sdk.version || sdkInfo.version;
      event.sdk.integrations = [...(event.sdk.integrations || []), ...(sdkInfo.integrations || [])];
      event.sdk.packages = [...(event.sdk.packages || []), ...(sdkInfo.packages || [])];
      return event;
    }
  
    /** Creates an envelope from a Session */
    function createSessionEnvelope(
      session,
      dsn,
      metadata,
      tunnel,
    ) {
      const sdkInfo = getSdkMetadataForEnvelopeHeader(metadata);
      const envelopeHeaders = {
        sent_at: new Date().toISOString(),
        ...(sdkInfo && { sdk: sdkInfo }),
        ...(!!tunnel && { dsn: dsnToString(dsn) }),
      };
  
      const envelopeItem =
        'aggregates' in session ? [{ type: 'sessions' }, session] : [{ type: 'session' }, session];
  
      return createEnvelope(envelopeHeaders, [envelopeItem]);
    }
  
    /**
     * Create an Envelope from an event.
     */
    function createEventEnvelope(
      event,
      dsn,
      metadata,
      tunnel,
    ) {
      const sdkInfo = getSdkMetadataForEnvelopeHeader(metadata);
  
      /*
        Note: Due to TS, event.type may be `replay_event`, theoretically.
        In practice, we never call `createEventEnvelope` with `replay_event` type,
        and we'd have to adjut a looot of types to make this work properly.
        We want to avoid casting this around, as that could lead to bugs (e.g. when we add another type)
        So the safe choice is to really guard against the replay_event type here.
      */
      const eventType = event.type && event.type !== 'replay_event' ? event.type : 'event';
  
      enhanceEventWithSdkInfo(event, metadata && metadata.sdk);
  
      const envelopeHeaders = createEventEnvelopeHeaders(event, sdkInfo, tunnel, dsn);
  
      // Prevent this data (which, if it exists, was used in earlier steps in the processing pipeline) from being sent to
      // sentry. (Note: Our use of this property comes and goes with whatever we might be debugging, whatever hacks we may
      // have temporarily added, etc. Even if we don't happen to be using it at some point in the future, let's not get rid
      // of this `delete`, lest we miss putting it back in the next time the property is in use.)
      delete event.sdkProcessingMetadata;
  
      const eventItem = [{ type: eventType }, event];
      return createEnvelope(envelopeHeaders, [eventItem]);
    }
  
    const installedIntegrations = [];
  
    /** Map of integrations assigned to a client */
  
    /**
     * Remove duplicates from the given array, preferring the last instance of any duplicate. Not guaranteed to
     * preseve the order of integrations in the array.
     *
     * @private
     */
    function filterDuplicates(integrations) {
      const integrationsByName = {};
  
      integrations.forEach(currentInstance => {
        const { name } = currentInstance;
  
        const existingInstance = integrationsByName[name];
  
        // We want integrations later in the array to overwrite earlier ones of the same type, except that we never want a
        // default instance to overwrite an existing user instance
        if (existingInstance && !existingInstance.isDefaultInstance && currentInstance.isDefaultInstance) {
          return;
        }
  
        integrationsByName[name] = currentInstance;
      });
  
      return Object.keys(integrationsByName).map(k => integrationsByName[k]);
    }
  
    /** Gets integrations to install */
    function getIntegrationsToSetup(options) {
      const defaultIntegrations = options.defaultIntegrations || [];
      const userIntegrations = options.integrations;
  
      // We flag default instances, so that later we can tell them apart from any user-created instances of the same class
      defaultIntegrations.forEach(integration => {
        integration.isDefaultInstance = true;
      });
  
      let integrations;
  
      if (Array.isArray(userIntegrations)) {
        integrations = [...defaultIntegrations, ...userIntegrations];
      } else if (typeof userIntegrations === 'function') {
        integrations = arrayify(userIntegrations(defaultIntegrations));
      } else {
        integrations = defaultIntegrations;
      }
  
      const finalIntegrations = filterDuplicates(integrations);
  
      // The `Debug` integration prints copies of the `event` and `hint` which will be passed to `beforeSend` or
      // `beforeSendTransaction`. It therefore has to run after all other integrations, so that the changes of all event
      // processors will be reflected in the printed values. For lack of a more elegant way to guarantee that, we therefore
      // locate it and, assuming it exists, pop it out of its current spot and shove it onto the end of the array.
      const debugIndex = findIndex(finalIntegrations, integration => integration.name === 'Debug');
      if (debugIndex !== -1) {
        const [debugInstance] = finalIntegrations.splice(debugIndex, 1);
        finalIntegrations.push(debugInstance);
      }
  
      return finalIntegrations;
    }
  
    /**
     * Given a list of integration instances this installs them all. When `withDefaults` is set to `true` then all default
     * integrations are added unless they were already provided before.
     * @param integrations array of integration instances
     * @param withDefault should enable default integrations
     */
    function setupIntegrations(integrations) {
      const integrationIndex = {};
  
      integrations.forEach(integration => {
        // guard against empty provided integrations
        if (integration) {
          setupIntegration(integration, integrationIndex);
        }
      });
  
      return integrationIndex;
    }
  
    /** Setup a single integration.  */
    function setupIntegration(integration, integrationIndex) {
      integrationIndex[integration.name] = integration;
  
      if (installedIntegrations.indexOf(integration.name) === -1) {
        integration.setupOnce(addGlobalEventProcessor, getCurrentHub);
        installedIntegrations.push(integration.name);
        logger.log(`Integration installed: ${integration.name}`);
      }
    }
  
    // Polyfill for Array.findIndex(), which is not supported in ES5
    function findIndex(arr, callback) {
      for (let i = 0; i < arr.length; i++) {
        if (callback(arr[i]) === true) {
          return i;
        }
      }
  
      return -1;
    }
  
    /**
     * Adds common information to events.
     *
     * The information includes release and environment from `options`,
     * breadcrumbs and context (extra, tags and user) from the scope.
     *
     * Information that is already present in the event is never overwritten. For
     * nested objects, such as the context, keys are merged.
     *
     * Note: This also triggers callbacks for `addGlobalEventProcessor`, but not `beforeSend`.
     *
     * @param event The original event.
     * @param hint May contain additional information about the original exception.
     * @param scope A scope containing event metadata.
     * @returns A new event with more information.
     * @hidden
     */
    function prepareEvent(
      options,
      event,
      hint,
      scope,
    ) {
      const { normalizeDepth = 3, normalizeMaxBreadth = 1000 } = options;
      const prepared = {
        ...event,
        event_id: event.event_id || hint.event_id || uuid4(),
        timestamp: event.timestamp || dateTimestampInSeconds(),
      };
      const integrations = hint.integrations || options.integrations.map(i => i.name);
  
      applyClientOptions(prepared, options);
      applyIntegrationsMetadata(prepared, integrations);
  
      // Only apply debug metadata to error events.
      if (event.type === undefined) {
        applyDebugMetadata(prepared, options.stackParser);
      }
  
      // If we have scope given to us, use it as the base for further modifications.
      // This allows us to prevent unnecessary copying of data if `captureContext` is not provided.
      let finalScope = scope;
      if (hint.captureContext) {
        finalScope = Scope.clone(finalScope).update(hint.captureContext);
      }
  
      // We prepare the result here with a resolved Event.
      let result = resolvedSyncPromise(prepared);
  
      // This should be the last thing called, since we want that
      // {@link Hub.addEventProcessor} gets the finished prepared event.
      //
      // We need to check for the existence of `finalScope.getAttachments`
      // because `getAttachments` can be undefined if users are using an older version
      // of `@sentry/core` that does not have the `getAttachments` method.
      // See: https://github.com/getsentry/sentry-javascript/issues/5229
      if (finalScope) {
        // Collect attachments from the hint and scope
        if (finalScope.getAttachments) {
          const attachments = [...(hint.attachments || []), ...finalScope.getAttachments()];
  
          if (attachments.length) {
            hint.attachments = attachments;
          }
        }
  
        // In case we have a hub we reassign it.
        result = finalScope.applyToEvent(prepared, hint);
      }
  
      return result.then(evt => {
        if (typeof normalizeDepth === 'number' && normalizeDepth > 0) {
          return normalizeEvent(evt, normalizeDepth, normalizeMaxBreadth);
        }
        return evt;
      });
    }
  
    /**
     *  Enhances event using the client configuration.
     *  It takes care of all "static" values like environment, release and `dist`,
     *  as well as truncating overly long values.
     * @param event event instance to be enhanced
     */
    function applyClientOptions(event, options) {
      const { environment, release, dist, maxValueLength = 250 } = options;
  
      if (!('environment' in event)) {
        event.environment = 'environment' in options ? environment : DEFAULT_ENVIRONMENT;
      }
  
      if (event.release === undefined && release !== undefined) {
        event.release = release;
      }
  
      if (event.dist === undefined && dist !== undefined) {
        event.dist = dist;
      }
  
      if (event.message) {
        event.message = truncate(event.message, maxValueLength);
      }
  
      const exception = event.exception && event.exception.values && event.exception.values[0];
      if (exception && exception.value) {
        exception.value = truncate(exception.value, maxValueLength);
      }
  
      const request = event.request;
      if (request && request.url) {
        request.url = truncate(request.url, maxValueLength);
      }
    }
  
    const debugIdStackParserCache = new WeakMap();
  
    /**
     * Applies debug metadata images to the event in order to apply source maps by looking up their debug ID.
     */
    function applyDebugMetadata(event, stackParser) {
      const debugIdMap = GLOBAL_OBJ._sentryDebugIds;
  
      if (!debugIdMap) {
        return;
      }
  
      let debugIdStackFramesCache;
      const cachedDebugIdStackFrameCache = debugIdStackParserCache.get(stackParser);
      if (cachedDebugIdStackFrameCache) {
        debugIdStackFramesCache = cachedDebugIdStackFrameCache;
      } else {
        debugIdStackFramesCache = new Map();
        debugIdStackParserCache.set(stackParser, debugIdStackFramesCache);
      }
  
      // Build a map of filename -> debug_id
      const filenameDebugIdMap = Object.keys(debugIdMap).reduce((acc, debugIdStackTrace) => {
        let parsedStack;
        const cachedParsedStack = debugIdStackFramesCache.get(debugIdStackTrace);
        if (cachedParsedStack) {
          parsedStack = cachedParsedStack;
        } else {
          parsedStack = stackParser(debugIdStackTrace);
          debugIdStackFramesCache.set(debugIdStackTrace, parsedStack);
        }
  
        for (let i = parsedStack.length - 1; i >= 0; i--) {
          const stackFrame = parsedStack[i];
          if (stackFrame.filename) {
            acc[stackFrame.filename] = debugIdMap[debugIdStackTrace];
            break;
          }
        }
        return acc;
      }, {});
  
      // Get a Set of filenames in the stack trace
      const errorFileNames = new Set();
      try {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        event.exception.values.forEach(exception => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          exception.stacktrace.frames.forEach(frame => {
            if (frame.filename) {
              errorFileNames.add(frame.filename);
            }
          });
        });
      } catch (e) {
        // To save bundle size we're just try catching here instead of checking for the existence of all the different objects.
      }
  
      // Fill debug_meta information
      event.debug_meta = event.debug_meta || {};
      event.debug_meta.images = event.debug_meta.images || [];
      const images = event.debug_meta.images;
      errorFileNames.forEach(filename => {
        if (filenameDebugIdMap[filename]) {
          images.push({
            type: 'sourcemap',
            code_file: filename,
            debug_id: filenameDebugIdMap[filename],
          });
        }
      });
    }
  
    /**
     * This function adds all used integrations to the SDK info in the event.
     * @param event The event that will be filled with all integrations.
     */
    function applyIntegrationsMetadata(event, integrationNames) {
      if (integrationNames.length > 0) {
        event.sdk = event.sdk || {};
        event.sdk.integrations = [...(event.sdk.integrations || []), ...integrationNames];
      }
    }
  
    /**
     * Applies `normalize` function on necessary `Event` attributes to make them safe for serialization.
     * Normalized keys:
     * - `breadcrumbs.data`
     * - `user`
     * - `contexts`
     * - `extra`
     * @param event Event
     * @returns Normalized event
     */
    function normalizeEvent(event, depth, maxBreadth) {
      if (!event) {
        return null;
      }
  
      const normalized = {
        ...event,
        ...(event.breadcrumbs && {
          breadcrumbs: event.breadcrumbs.map(b => ({
            ...b,
            ...(b.data && {
              data: normalize(b.data, depth, maxBreadth),
            }),
          })),
        }),
        ...(event.user && {
          user: normalize(event.user, depth, maxBreadth),
        }),
        ...(event.contexts && {
          contexts: normalize(event.contexts, depth, maxBreadth),
        }),
        ...(event.extra && {
          extra: normalize(event.extra, depth, maxBreadth),
        }),
      };
  
      // event.contexts.trace stores information about a Transaction. Similarly,
      // event.spans[] stores information about child Spans. Given that a
      // Transaction is conceptually a Span, normalization should apply to both
      // Transactions and Spans consistently.
      // For now the decision is to skip normalization of Transactions and Spans,
      // so this block overwrites the normalized event to add back the original
      // Transaction information prior to normalization.
      if (event.contexts && event.contexts.trace && normalized.contexts) {
        normalized.contexts.trace = event.contexts.trace;
  
        // event.contexts.trace.data may contain circular/dangerous data so we need to normalize it
        if (event.contexts.trace.data) {
          normalized.contexts.trace.data = normalize(event.contexts.trace.data, depth, maxBreadth);
        }
      }
  
      // event.spans[].data may contain circular/dangerous data so we need to normalize it
      if (event.spans) {
        normalized.spans = event.spans.map(span => {
          // We cannot use the spread operator here because `toJSON` on `span` is non-enumerable
          if (span.data) {
            span.data = normalize(span.data, depth, maxBreadth);
          }
          return span;
        });
      }
  
      return normalized;
    }
  
    const ALREADY_SEEN_ERROR = "Not capturing exception because it's already been captured.";
  
    /**
     * Base implementation for all JavaScript SDK clients.
     *
     * Call the constructor with the corresponding options
     * specific to the client subclass. To access these options later, use
     * {@link Client.getOptions}.
     *
     * If a Dsn is specified in the options, it will be parsed and stored. Use
     * {@link Client.getDsn} to retrieve the Dsn at any moment. In case the Dsn is
     * invalid, the constructor will throw a {@link SentryException}. Note that
     * without a valid Dsn, the SDK will not send any events to Sentry.
     *
     * Before sending an event, it is passed through
     * {@link BaseClient._prepareEvent} to add SDK information and scope data
     * (breadcrumbs and context). To add more custom information, override this
     * method and extend the resulting prepared event.
     *
     * To issue automatically created events (e.g. via instrumentation), use
     * {@link Client.captureEvent}. It will prepare the event and pass it through
     * the callback lifecycle. To issue auto-breadcrumbs, use
     * {@link Client.addBreadcrumb}.
     *
     * @example
     * class NodeClient extends BaseClient<NodeOptions> {
     *   public constructor(options: NodeOptions) {
     *     super(options);
     *   }
     *
     *   // ...
     * }
     */
    class BaseClient {
      /** Options passed to the SDK. */
  
      /** The client Dsn, if specified in options. Without this Dsn, the SDK will be disabled. */
  
      /** Array of set up integrations. */
       __init() {this._integrations = {};}
  
      /** Indicates whether this client's integrations have been set up. */
       __init2() {this._integrationsInitialized = false;}
  
      /** Number of calls being processed */
       __init3() {this._numProcessing = 0;}
  
      /** Holds flushable  */
       __init4() {this._outcomes = {};}
  
      // eslint-disable-next-line @typescript-eslint/ban-types
       __init5() {this._hooks = {};}
  
      /**
       * Initializes this client instance.
       *
       * @param options Options for the client.
       */
       constructor(options) {BaseClient.prototype.__init.call(this);BaseClient.prototype.__init2.call(this);BaseClient.prototype.__init3.call(this);BaseClient.prototype.__init4.call(this);BaseClient.prototype.__init5.call(this);
        this._options = options;
        if (options.dsn) {
          this._dsn = makeDsn(options.dsn);
          const url = getEnvelopeEndpointWithUrlEncodedAuth(this._dsn, options);
          this._transport = options.transport({
            recordDroppedEvent: this.recordDroppedEvent.bind(this),
            ...options.transportOptions,
            url,
          });
        } else {
          logger.warn('No DSN provided, client will not do anything.');
        }
      }
  
      /**
       * @inheritDoc
       */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
       captureException(exception, hint, scope) {
        // ensure we haven't captured this very object before
        if (checkOrSetAlreadyCaught(exception)) {
          logger.log(ALREADY_SEEN_ERROR);
          return;
        }
  
        let eventId = hint && hint.event_id;
  
        this._process(
          this.eventFromException(exception, hint)
            .then(event => this._captureEvent(event, hint, scope))
            .then(result => {
              eventId = result;
            }),
        );
  
        return eventId;
      }
  
      /**
       * @inheritDoc
       */
       captureMessage(
        message,
        // eslint-disable-next-line deprecation/deprecation
        level,
        hint,
        scope,
      ) {
        let eventId = hint && hint.event_id;
  
        const promisedEvent = isPrimitive(message)
          ? this.eventFromMessage(String(message), level, hint)
          : this.eventFromException(message, hint);
  
        this._process(
          promisedEvent
            .then(event => this._captureEvent(event, hint, scope))
            .then(result => {
              eventId = result;
            }),
        );
  
        return eventId;
      }
  
      /**
       * @inheritDoc
       */
       captureEvent(event, hint, scope) {
        // ensure we haven't captured this very object before
        if (hint && hint.originalException && checkOrSetAlreadyCaught(hint.originalException)) {
          logger.log(ALREADY_SEEN_ERROR);
          return;
        }
  
        let eventId = hint && hint.event_id;
  
        this._process(
          this._captureEvent(event, hint, scope).then(result => {
            eventId = result;
          }),
        );
  
        return eventId;
      }
  
      /**
       * @inheritDoc
       */
       captureSession(session) {
        if (!this._isEnabled()) {
          logger.warn('SDK not enabled, will not capture session.');
          return;
        }
  
        if (!(typeof session.release === 'string')) {
          logger.warn('Discarded session because of missing or non-string release');
        } else {
          this.sendSession(session);
          // After sending, we set init false to indicate it's not the first occurrence
          updateSession(session, { init: false });
        }
      }
  
      /**
       * @inheritDoc
       */
       getDsn() {
        return this._dsn;
      }
  
      /**
       * @inheritDoc
       */
       getOptions() {
        return this._options;
      }
  
      /**
       * @see SdkMetadata in @sentry/types
       *
       * @return The metadata of the SDK
       */
       getSdkMetadata() {
        return this._options._metadata;
      }
  
      /**
       * @inheritDoc
       */
       getTransport() {
        return this._transport;
      }
  
      /**
       * @inheritDoc
       */
       flush(timeout) {
        const transport = this._transport;
        if (transport) {
          return this._isClientDoneProcessing(timeout).then(clientFinished => {
            return transport.flush(timeout).then(transportFlushed => clientFinished && transportFlushed);
          });
        } else {
          return resolvedSyncPromise(true);
        }
      }
  
      /**
       * @inheritDoc
       */
       close(timeout) {
        return this.flush(timeout).then(result => {
          this.getOptions().enabled = false;
          return result;
        });
      }
  
      /**
       * Sets up the integrations
       */
       setupIntegrations() {
        if (this._isEnabled() && !this._integrationsInitialized) {
          this._integrations = setupIntegrations(this._options.integrations);
          this._integrationsInitialized = true;
        }
      }
  
      /**
       * Gets an installed integration by its `id`.
       *
       * @returns The installed integration or `undefined` if no integration with that `id` was installed.
       */
       getIntegrationById(integrationId) {
        return this._integrations[integrationId];
      }
  
      /**
       * @inheritDoc
       */
       getIntegration(integration) {
        try {
          return (this._integrations[integration.id] ) || null;
        } catch (_oO) {
          logger.warn(`Cannot retrieve integration ${integration.id} from the current Client`);
          return null;
        }
      }
  
      /**
       * @inheritDoc
       */
       addIntegration(integration) {
        setupIntegration(integration, this._integrations);
      }
  
      /**
       * @inheritDoc
       */
       sendEvent(event, hint = {}) {
        if (this._dsn) {
          let env = createEventEnvelope(event, this._dsn, this._options._metadata, this._options.tunnel);
  
          for (const attachment of hint.attachments || []) {
            env = addItemToEnvelope(
              env,
              createAttachmentEnvelopeItem(
                attachment,
                this._options.transportOptions && this._options.transportOptions.textEncoder,
              ),
            );
          }
  
          const promise = this._sendEnvelope(env);
          if (promise) {
            promise.then(sendResponse => this.emit('afterSendEvent', event, sendResponse), null);
          }
        }
      }
  
      /**
       * @inheritDoc
       */
       sendSession(session) {
        if (this._dsn) {
          const env = createSessionEnvelope(session, this._dsn, this._options._metadata, this._options.tunnel);
          void this._sendEnvelope(env);
        }
      }
  
      /**
       * @inheritDoc
       */
       recordDroppedEvent(reason, category, _event) {
        // Note: we use `event` in replay, where we overwrite this hook.
  
        if (this._options.sendClientReports) {
          // We want to track each category (error, transaction, session, replay_event) separately
          // but still keep the distinction between different type of outcomes.
          // We could use nested maps, but it's much easier to read and type this way.
          // A correct type for map-based implementation if we want to go that route
          // would be `Partial<Record<SentryRequestType, Partial<Record<Outcome, number>>>>`
          // With typescript 4.1 we could even use template literal types
          const key = `${reason}:${category}`;
          logger.log(`Adding outcome: "${key}"`);
  
          // The following works because undefined + 1 === NaN and NaN is falsy
          this._outcomes[key] = this._outcomes[key] + 1 || 1;
        }
      }
  
      // Keep on() & emit() signatures in sync with types' client.ts interface
  
      /** @inheritdoc */
  
      /** @inheritdoc */
       on(hook, callback) {
        if (!this._hooks[hook]) {
          this._hooks[hook] = [];
        }
  
        // @ts-ignore We assue the types are correct
        this._hooks[hook].push(callback);
      }
  
      /** @inheritdoc */
  
      /** @inheritdoc */
       emit(hook, ...rest) {
        if (this._hooks[hook]) {
          // @ts-ignore we cannot enforce the callback to match the hook
          this._hooks[hook].forEach(callback => callback(...rest));
        }
      }
  
      /** Updates existing session based on the provided event */
       _updateSessionFromEvent(session, event) {
        let crashed = false;
        let errored = false;
        const exceptions = event.exception && event.exception.values;
  
        if (exceptions) {
          errored = true;
  
          for (const ex of exceptions) {
            const mechanism = ex.mechanism;
            if (mechanism && mechanism.handled === false) {
              crashed = true;
              break;
            }
          }
        }
  
        // A session is updated and that session update is sent in only one of the two following scenarios:
        // 1. Session with non terminal status and 0 errors + an error occurred -> Will set error count to 1 and send update
        // 2. Session with non terminal status and 1 error + a crash occurred -> Will set status crashed and send update
        const sessionNonTerminal = session.status === 'ok';
        const shouldUpdateAndSend = (sessionNonTerminal && session.errors === 0) || (sessionNonTerminal && crashed);
  
        if (shouldUpdateAndSend) {
          updateSession(session, {
            ...(crashed && { status: 'crashed' }),
            errors: session.errors || Number(errored || crashed),
          });
          this.captureSession(session);
        }
      }
  
      /**
       * Determine if the client is finished processing. Returns a promise because it will wait `timeout` ms before saying
       * "no" (resolving to `false`) in order to give the client a chance to potentially finish first.
       *
       * @param timeout The time, in ms, after which to resolve to `false` if the client is still busy. Passing `0` (or not
       * passing anything) will make the promise wait as long as it takes for processing to finish before resolving to
       * `true`.
       * @returns A promise which will resolve to `true` if processing is already done or finishes before the timeout, and
       * `false` otherwise
       */
       _isClientDoneProcessing(timeout) {
        return new SyncPromise(resolve => {
          let ticked = 0;
          const tick = 1;
  
          const interval = setInterval(() => {
            if (this._numProcessing == 0) {
              clearInterval(interval);
              resolve(true);
            } else {
              ticked += tick;
              if (timeout && ticked >= timeout) {
                clearInterval(interval);
                resolve(false);
              }
            }
          }, tick);
        });
      }
  
      /** Determines whether this SDK is enabled and a valid Dsn is present. */
       _isEnabled() {
        return this.getOptions().enabled !== false && this._dsn !== undefined;
      }
  
      /**
       * Adds common information to events.
       *
       * The information includes release and environment from `options`,
       * breadcrumbs and context (extra, tags and user) from the scope.
       *
       * Information that is already present in the event is never overwritten. For
       * nested objects, such as the context, keys are merged.
       *
       * @param event The original event.
       * @param hint May contain additional information about the original exception.
       * @param scope A scope containing event metadata.
       * @returns A new event with more information.
       */
       _prepareEvent(event, hint, scope) {
        const options = this.getOptions();
        const integrations = Object.keys(this._integrations);
        if (!hint.integrations && integrations.length > 0) {
          hint.integrations = integrations;
        }
        return prepareEvent(options, event, hint, scope);
      }
  
      /**
       * Processes the event and logs an error in case of rejection
       * @param event
       * @param hint
       * @param scope
       */
       _captureEvent(event, hint = {}, scope) {
        return this._processEvent(event, hint, scope).then(
          finalEvent => {
            return finalEvent.event_id;
          },
          reason => {
            {
              // If something's gone wrong, log the error as a warning. If it's just us having used a `SentryError` for
              // control flow, log just the message (no stack) as a log-level log.
              const sentryError = reason ;
              if (sentryError.logLevel === 'log') {
                logger.log(sentryError.message);
              } else {
                logger.warn(sentryError);
              }
            }
            return undefined;
          },
        );
      }
  
      /**
       * Processes an event (either error or message) and sends it to Sentry.
       *
       * This also adds breadcrumbs and context information to the event. However,
       * platform specific meta data (such as the User's IP address) must be added
       * by the SDK implementor.
       *
       *
       * @param event The event to send to Sentry.
       * @param hint May contain additional information about the original exception.
       * @param scope A scope containing event metadata.
       * @returns A SyncPromise that resolves with the event or rejects in case event was/will not be send.
       */
       _processEvent(event, hint, scope) {
        const options = this.getOptions();
        const { sampleRate } = options;
  
        if (!this._isEnabled()) {
          return rejectedSyncPromise(new SentryError('SDK not enabled, will not capture event.', 'log'));
        }
  
        const isTransaction = isTransactionEvent(event);
        const isError = isErrorEvent(event);
        const eventType = event.type || 'error';
        const beforeSendLabel = `before send for type \`${eventType}\``;
  
        // 1.0 === 100% events are sent
        // 0.0 === 0% events are sent
        // Sampling for transaction happens somewhere else
        if (isError && typeof sampleRate === 'number' && Math.random() > sampleRate) {
          this.recordDroppedEvent('sample_rate', 'error', event);
          return rejectedSyncPromise(
            new SentryError(
              `Discarding event because it's not included in the random sample (sampling rate = ${sampleRate})`,
              'log',
            ),
          );
        }
  
        const dataCategory = eventType === 'replay_event' ? 'replay' : eventType;
  
        return this._prepareEvent(event, hint, scope)
          .then(prepared => {
            if (prepared === null) {
              this.recordDroppedEvent('event_processor', dataCategory, event);
              throw new SentryError('An event processor returned `null`, will not send event.', 'log');
            }
  
            const isInternalException = hint.data && (hint.data ).__sentry__ === true;
            if (isInternalException) {
              return prepared;
            }
  
            const result = processBeforeSend(options, prepared, hint);
            return _validateBeforeSendResult(result, beforeSendLabel);
          })
          .then(processedEvent => {
            if (processedEvent === null) {
              this.recordDroppedEvent('before_send', dataCategory, event);
              throw new SentryError(`${beforeSendLabel} returned \`null\`, will not send event.`, 'log');
            }
  
            const session = scope && scope.getSession();
            if (!isTransaction && session) {
              this._updateSessionFromEvent(session, processedEvent);
            }
  
            // None of the Sentry built event processor will update transaction name,
            // so if the transaction name has been changed by an event processor, we know
            // it has to come from custom event processor added by a user
            const transactionInfo = processedEvent.transaction_info;
            if (isTransaction && transactionInfo && processedEvent.transaction !== event.transaction) {
              const source = 'custom';
              processedEvent.transaction_info = {
                ...transactionInfo,
                source,
              };
            }
  
            this.sendEvent(processedEvent, hint);
            return processedEvent;
          })
          .then(null, reason => {
            if (reason instanceof SentryError) {
              throw reason;
            }
  
            this.captureException(reason, {
              data: {
                __sentry__: true,
              },
              originalException: reason,
            });
            throw new SentryError(
              `Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.\nReason: ${reason}`,
            );
          });
      }
  
      /**
       * Occupies the client with processing and event
       */
       _process(promise) {
        this._numProcessing++;
        void promise.then(
          value => {
            this._numProcessing--;
            return value;
          },
          reason => {
            this._numProcessing--;
            return reason;
          },
        );
      }
  
      /**
       * @inheritdoc
       */
       _sendEnvelope(envelope) {
        if (this._transport && this._dsn) {
          this.emit('beforeEnvelope', envelope);
  
          return this._transport.send(envelope).then(null, reason => {
            logger.error('Error while sending event:', reason);
          });
        } else {
          logger.error('Transport disabled');
        }
      }
  
      /**
       * Clears outcomes on this client and returns them.
       */
       _clearOutcomes() {
        const outcomes = this._outcomes;
        this._outcomes = {};
        return Object.keys(outcomes).map(key => {
          const [reason, category] = key.split(':') ;
          return {
            reason,
            category,
            quantity: outcomes[key],
          };
        });
      }
  
      /**
       * @inheritDoc
       */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  
    }
  
    /**
     * Verifies that return value of configured `beforeSend` or `beforeSendTransaction` is of expected type, and returns the value if so.
     */
    function _validateBeforeSendResult(
      beforeSendResult,
      beforeSendLabel,
    ) {
      const invalidValueError = `${beforeSendLabel} must return \`null\` or a valid event.`;
      if (isThenable(beforeSendResult)) {
        return beforeSendResult.then(
          event => {
            if (!isPlainObject(event) && event !== null) {
              throw new SentryError(invalidValueError);
            }
            return event;
          },
          e => {
            throw new SentryError(`${beforeSendLabel} rejected with ${e}`);
          },
        );
      } else if (!isPlainObject(beforeSendResult) && beforeSendResult !== null) {
        throw new SentryError(invalidValueError);
      }
      return beforeSendResult;
    }
  
    /**
     * Process the matching `beforeSendXXX` callback.
     */
    function processBeforeSend(
      options,
      event,
      hint,
    ) {
      const { beforeSend, beforeSendTransaction } = options;
  
      if (isErrorEvent(event) && beforeSend) {
        return beforeSend(event, hint);
      }
  
      if (isTransactionEvent(event) && beforeSendTransaction) {
        return beforeSendTransaction(event, hint);
      }
  
      return event;
    }
  
    function isErrorEvent(event) {
      return event.type === undefined;
    }
  
    function isTransactionEvent(event) {
      return event.type === 'transaction';
    }
  
    /** A class object that can instantiate Client objects. */
  
    /**
     * Internal function to create a new SDK client instance. The client is
     * installed and then bound to the current scope.
     *
     * @param clientClass The client class to instantiate.
     * @param options Options to pass to the client.
     */
    function initAndBind(
      clientClass,
      options,
    ) {
      if (options.debug === true) {
        {
          logger.enable();
        }
      }
      const hub = getCurrentHub();
      const scope = hub.getScope();
      scope.update(options.initialScope);
  
      const client = new clientClass(options);
      hub.bindClient(client);
    }
  
    const DEFAULT_TRANSPORT_BUFFER_SIZE = 30;
  
    /**
     * Creates an instance of a Sentry `Transport`
     *
     * @param options
     * @param makeRequest
     */
    function createTransport(
      options,
      makeRequest,
      buffer = makePromiseBuffer(
        options.bufferSize || DEFAULT_TRANSPORT_BUFFER_SIZE,
      ),
    ) {
      let rateLimits = {};
      const flush = (timeout) => buffer.drain(timeout);
  
      function send(envelope) {
        const filteredEnvelopeItems = [];
  
        // Drop rate limited items from envelope
        forEachEnvelopeItem(envelope, (item, type) => {
          const envelopeItemDataCategory = envelopeItemTypeToDataCategory(type);
          if (isRateLimited(rateLimits, envelopeItemDataCategory)) {
            const event = getEventForEnvelopeItem(item, type);
            options.recordDroppedEvent('ratelimit_backoff', envelopeItemDataCategory, event);
          } else {
            filteredEnvelopeItems.push(item);
          }
        });
  
        // Skip sending if envelope is empty after filtering out rate limited events
        if (filteredEnvelopeItems.length === 0) {
          return resolvedSyncPromise();
        }
  
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filteredEnvelope = createEnvelope(envelope[0], filteredEnvelopeItems );
  
        // Creates client report for each item in an envelope
        const recordEnvelopeLoss = (reason) => {
          forEachEnvelopeItem(filteredEnvelope, (item, type) => {
            const event = getEventForEnvelopeItem(item, type);
            options.recordDroppedEvent(reason, envelopeItemTypeToDataCategory(type), event);
          });
        };
  
        const requestTask = () =>
          makeRequest({ body: serializeEnvelope(filteredEnvelope, options.textEncoder) }).then(
            response => {
              // We don't want to throw on NOK responses, but we want to at least log them
              if (response.statusCode !== undefined && (response.statusCode < 200 || response.statusCode >= 300)) {
                logger.warn(`Sentry responded with status code ${response.statusCode} to sent event.`);
              }
  
              rateLimits = updateRateLimits(rateLimits, response);
              return response;
            },
            error => {
              recordEnvelopeLoss('network_error');
              throw error;
            },
          );
  
        return buffer.add(requestTask).then(
          result => result,
          error => {
            if (error instanceof SentryError) {
              logger.error('Skipped sending event because buffer is full.');
              recordEnvelopeLoss('queue_overflow');
              return resolvedSyncPromise();
            } else {
              throw error;
            }
          },
        );
      }
  
      // We use this to identifify if the transport is the base transport
      // TODO (v8): Remove this again as we'll no longer need it
      send.__sentry__baseTransport__ = true;
  
      return {
        send,
        flush,
      };
    }
  
    function getEventForEnvelopeItem(item, type) {
      if (type !== 'event' && type !== 'transaction') {
        return undefined;
      }
  
      return Array.isArray(item) ? (item )[1] : undefined;
    }
  
    const SDK_VERSION = '7.51.1';
  
    let originalFunctionToString;
  
    /** Patch toString calls to return proper name for wrapped functions */
    class FunctionToString  {constructor() { FunctionToString.prototype.__init.call(this); }
      /**
       * @inheritDoc
       */
       static __initStatic() {this.id = 'FunctionToString';}
  
      /**
       * @inheritDoc
       */
       __init() {this.name = FunctionToString.id;}
  
      /**
       * @inheritDoc
       */
       setupOnce() {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        originalFunctionToString = Function.prototype.toString;
  
        // intrinsics (like Function.prototype) might be immutable in some environments
        // e.g. Node with --frozen-intrinsics, XS (an embedded JavaScript engine) or SES (a JavaScript proposal)
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Function.prototype.toString = function ( ...args) {
            const context = getOriginalFunction(this) || this;
            return originalFunctionToString.apply(context, args);
          };
        } catch (e) {
          // ignore errors here, just don't patch this
        }
      }
    } FunctionToString.__initStatic();
  
    // "Script error." is hard coded into browsers for errors that it can't read.
    // this is the result of a script being pulled in from an external domain and CORS.
    const DEFAULT_IGNORE_ERRORS = [/^Script error\.?$/, /^Javascript error: Script error\.? on line 0$/];
  
    /** Options for the InboundFilters integration */
  
    /** Inbound filters configurable by the user */
    class InboundFilters  {
      /**
       * @inheritDoc
       */
       static __initStatic() {this.id = 'InboundFilters';}
  
      /**
       * @inheritDoc
       */
       __init() {this.name = InboundFilters.id;}
  
       constructor(  _options = {}) {this._options = _options;InboundFilters.prototype.__init.call(this);}
  
      /**
       * @inheritDoc
       */
       setupOnce(addGlobalEventProcessor, getCurrentHub) {
        const eventProcess = (event) => {
          const hub = getCurrentHub();
          if (hub) {
            const self = hub.getIntegration(InboundFilters);
            if (self) {
              const client = hub.getClient();
              const clientOptions = client ? client.getOptions() : {};
              const options = _mergeOptions(self._options, clientOptions);
              return _shouldDropEvent$1(event, options) ? null : event;
            }
          }
          return event;
        };
  
        eventProcess.id = this.name;
        addGlobalEventProcessor(eventProcess);
      }
    } InboundFilters.__initStatic();
  
    /** JSDoc */
    function _mergeOptions(
      internalOptions = {},
      clientOptions = {},
    ) {
      return {
        allowUrls: [...(internalOptions.allowUrls || []), ...(clientOptions.allowUrls || [])],
        denyUrls: [...(internalOptions.denyUrls || []), ...(clientOptions.denyUrls || [])],
        ignoreErrors: [
          ...(internalOptions.ignoreErrors || []),
          ...(clientOptions.ignoreErrors || []),
          ...DEFAULT_IGNORE_ERRORS,
        ],
        ignoreTransactions: [...(internalOptions.ignoreTransactions || []), ...(clientOptions.ignoreTransactions || [])],
        ignoreInternal: internalOptions.ignoreInternal !== undefined ? internalOptions.ignoreInternal : true,
      };
    }
  
    /** JSDoc */
    function _shouldDropEvent$1(event, options) {
      if (options.ignoreInternal && _isSentryError(event)) {
        logger.warn(`Event dropped due to being internal Sentry Error.\nEvent: ${getEventDescription(event)}`);
        return true;
      }
      if (_isIgnoredError(event, options.ignoreErrors)) {
        logger.warn(
            `Event dropped due to being matched by \`ignoreErrors\` option.\nEvent: ${getEventDescription(event)}`,
          );
        return true;
      }
      if (_isIgnoredTransaction(event, options.ignoreTransactions)) {
        logger.warn(
            `Event dropped due to being matched by \`ignoreTransactions\` option.\nEvent: ${getEventDescription(event)}`,
          );
        return true;
      }
      if (_isDeniedUrl(event, options.denyUrls)) {
        logger.warn(
            `Event dropped due to being matched by \`denyUrls\` option.\nEvent: ${getEventDescription(
            event,
          )}.\nUrl: ${_getEventFilterUrl(event)}`,
          );
        return true;
      }
      if (!_isAllowedUrl(event, options.allowUrls)) {
        logger.warn(
            `Event dropped due to not being matched by \`allowUrls\` option.\nEvent: ${getEventDescription(
            event,
          )}.\nUrl: ${_getEventFilterUrl(event)}`,
          );
        return true;
      }
      return false;
    }
  
    function _isIgnoredError(event, ignoreErrors) {
      // If event.type, this is not an error
      if (event.type || !ignoreErrors || !ignoreErrors.length) {
        return false;
      }
  
      return _getPossibleEventMessages(event).some(message => stringMatchesSomePattern(message, ignoreErrors));
    }
  
    function _isIgnoredTransaction(event, ignoreTransactions) {
      if (event.type !== 'transaction' || !ignoreTransactions || !ignoreTransactions.length) {
        return false;
      }
  
      const name = event.transaction;
      return name ? stringMatchesSomePattern(name, ignoreTransactions) : false;
    }
  
    function _isDeniedUrl(event, denyUrls) {
      // TODO: Use Glob instead?
      if (!denyUrls || !denyUrls.length) {
        return false;
      }
      const url = _getEventFilterUrl(event);
      return !url ? false : stringMatchesSomePattern(url, denyUrls);
    }
  
    function _isAllowedUrl(event, allowUrls) {
      // TODO: Use Glob instead?
      if (!allowUrls || !allowUrls.length) {
        return true;
      }
      const url = _getEventFilterUrl(event);
      return !url ? true : stringMatchesSomePattern(url, allowUrls);
    }
  
    function _getPossibleEventMessages(event) {
      if (event.message) {
        return [event.message];
      }
      if (event.exception) {
        try {
          const { type = '', value = '' } = (event.exception.values && event.exception.values[0]) || {};
          return [`${value}`, `${type}: ${value}`];
        } catch (oO) {
          logger.error(`Cannot extract message for event ${getEventDescription(event)}`);
          return [];
        }
      }
      return [];
    }
  
    function _isSentryError(event) {
      try {
        // @ts-ignore can't be a sentry error if undefined
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return event.exception.values[0].type === 'SentryError';
      } catch (e) {
        // ignore
      }
      return false;
    }
  
    function _getLastValidUrl(frames = []) {
      for (let i = frames.length - 1; i >= 0; i--) {
        const frame = frames[i];
  
        if (frame && frame.filename !== '<anonymous>' && frame.filename !== '[native code]') {
          return frame.filename || null;
        }
      }
  
      return null;
    }
  
    function _getEventFilterUrl(event) {
      try {
        let frames;
        try {
          // @ts-ignore we only care about frames if the whole thing here is defined
          frames = event.exception.values[0].stacktrace.frames;
        } catch (e) {
          // ignore
        }
        return frames ? _getLastValidUrl(frames) : null;
      } catch (oO) {
        logger.error(`Cannot extract url for event ${getEventDescription(event)}`);
        return null;
      }
    }
  
    var CoreIntegrations = /*#__PURE__*/Object.freeze({
      __proto__: null,
      FunctionToString: FunctionToString,
      InboundFilters: InboundFilters
    });
  
    const WINDOW$1 = GLOBAL_OBJ ;
  
    /**
     * Add a listener that cancels and finishes a transaction when the global
     * document is hidden.
     */
    function registerBackgroundTabDetection() {
      if (WINDOW$1 && WINDOW$1.document) {
        WINDOW$1.document.addEventListener('visibilitychange', () => {
          const activeTransaction = getActiveTransaction() ;
          if (WINDOW$1.document.hidden && activeTransaction) {
            const statusType = 'cancelled';
  
            logger.log(
                `[Tracing] Transaction: ${statusType} -> since tab moved to the background, op: ${activeTransaction.op}`,
              );
            // We should not set status if it is already set, this prevent important statuses like
            // error or data loss from being overwritten on transaction.
            if (!activeTransaction.status) {
              activeTransaction.setStatus(statusType);
            }
            activeTransaction.setTag('visibilitychange', 'document.hidden');
            activeTransaction.finish();
          }
        });
      } else {
        logger.warn('[Tracing] Could not set up background tab detection due to lack of global document');
      }
    }
  
    const bindReporter = (
      callback,
      metric,
      reportAllChanges,
    ) => {
      let prevValue;
      let delta;
      return (forceReport) => {
        if (metric.value >= 0) {
          if (forceReport || reportAllChanges) {
            delta = metric.value - (prevValue || 0);
  
            // Report the metric if there's a non-zero delta or if no previous
            // value exists (which can happen in the case of the document becoming
            // hidden when the metric value is 0).
            // See: https://github.com/GoogleChrome/web-vitals/issues/14
            if (delta || prevValue === undefined) {
              prevValue = metric.value;
              metric.delta = delta;
              callback(metric);
            }
          }
        }
      };
    };
  
    /*
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *     https://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
  
    /**
     * Performantly generate a unique, 30-char string by combining a version
     * number, the current timestamp with a 13-digit number integer.
     * @return {string}
     */
    const generateUniqueID = () => {
      return `v3-${Date.now()}-${Math.floor(Math.random() * (9e12 - 1)) + 1e12}`;
    };
  
    /*
     * Copyright 2022 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *     https://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
  
    const getNavigationEntryFromPerformanceTiming = () => {
      // eslint-disable-next-line deprecation/deprecation
      const timing = WINDOW$1.performance.timing;
      // eslint-disable-next-line deprecation/deprecation
      const type = WINDOW$1.performance.navigation.type;
  
      const navigationEntry = {
        entryType: 'navigation',
        startTime: 0,
        type: type == 2 ? 'back_forward' : type === 1 ? 'reload' : 'navigate',
      };
  
      for (const key in timing) {
        if (key !== 'navigationStart' && key !== 'toJSON') {
          navigationEntry[key] = Math.max((timing[key ] ) - timing.navigationStart, 0);
        }
      }
      return navigationEntry ;
    };
  
    const getNavigationEntry = () => {
      if (WINDOW$1.__WEB_VITALS_POLYFILL__) {
        return (
          WINDOW$1.performance &&
          ((performance.getEntriesByType && performance.getEntriesByType('navigation')[0]) ||
            getNavigationEntryFromPerformanceTiming())
        );
      } else {
        return WINDOW$1.performance && performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
      }
    };
  
    /*
     * Copyright 2022 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *     https://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
  
    const getActivationStart = () => {
      const navEntry = getNavigationEntry();
      return (navEntry && navEntry.activationStart) || 0;
    };
  
    /*
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *     https://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
  
    const initMetric = (name, value) => {
      const navEntry = getNavigationEntry();
      let navigationType = 'navigate';
  
      if (navEntry) {
        if (WINDOW$1.document.prerendering || getActivationStart() > 0) {
          navigationType = 'prerender';
        } else {
          navigationType = navEntry.type.replace(/_/g, '-') ;
        }
      }
  
      return {
        name,
        value: typeof value === 'undefined' ? -1 : value,
        rating: 'good', // Will be updated if the value changes.
        delta: 0,
        entries: [],
        id: generateUniqueID(),
        navigationType,
      };
    };
  
    /**
     * Takes a performance entry type and a callback function, and creates a
     * `PerformanceObserver` instance that will observe the specified entry type
     * with buffering enabled and call the callback _for each entry_.
     *
     * This function also feature-detects entry support and wraps the logic in a
     * try/catch to avoid errors in unsupporting browsers.
     */
    const observe = (
      type,
      callback,
      opts,
    ) => {
      try {
        if (PerformanceObserver.supportedEntryTypes.includes(type)) {
          const po = new PerformanceObserver(list => {
            callback(list.getEntries() );
          });
          po.observe(
            Object.assign(
              {
                type,
                buffered: true,
              },
              opts || {},
            ) ,
          );
          return po;
        }
      } catch (e) {
        // Do nothing.
      }
      return;
    };
  
    /*
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *     https://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
  
    const onHidden = (cb, once) => {
      const onHiddenOrPageHide = (event) => {
        if (event.type === 'pagehide' || WINDOW$1.document.visibilityState === 'hidden') {
          cb(event);
          if (once) {
            removeEventListener('visibilitychange', onHiddenOrPageHide, true);
            removeEventListener('pagehide', onHiddenOrPageHide, true);
          }
        }
      };
      addEventListener('visibilitychange', onHiddenOrPageHide, true);
      // Some browsers have buggy implementations of visibilitychange,
      // so we use pagehide in addition, just to be safe.
      addEventListener('pagehide', onHiddenOrPageHide, true);
    };
  
    /*
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *     https://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
  
    /**
     * Calculates the [CLS](https://web.dev/cls/) value for the current page and
     * calls the `callback` function once the value is ready to be reported, along
     * with all `layout-shift` performance entries that were used in the metric
     * value calculation. The reported value is a `double` (corresponding to a
     * [layout shift score](https://web.dev/cls/#layout-shift-score)).
     *
     * If the `reportAllChanges` configuration option is set to `true`, the
     * `callback` function will be called as soon as the value is initially
     * determined as well as any time the value changes throughout the page
     * lifespan.
     *
     * _**Important:** CLS should be continually monitored for changes throughout
     * the entire lifespan of a page—including if the user returns to the page after
     * it's been hidden/backgrounded. However, since browsers often [will not fire
     * additional callbacks once the user has backgrounded a
     * page](https://developer.chrome.com/blog/page-lifecycle-api/#advice-hidden),
     * `callback` is always called when the page's visibility state changes to
     * hidden. As a result, the `callback` function might be called multiple times
     * during the same page load._
     */
    const onCLS = (onReport) => {
      const metric = initMetric('CLS', 0);
      let report;
  
      let sessionValue = 0;
      let sessionEntries = [];
  
      // const handleEntries = (entries: Metric['entries']) => {
      const handleEntries = (entries) => {
        entries.forEach(entry => {
          // Only count layout shifts without recent user input.
          if (!entry.hadRecentInput) {
            const firstSessionEntry = sessionEntries[0];
            const lastSessionEntry = sessionEntries[sessionEntries.length - 1];
  
            // If the entry occurred less than 1 second after the previous entry and
            // less than 5 seconds after the first entry in the session, include the
            // entry in the current session. Otherwise, start a new session.
            if (
              sessionValue &&
              sessionEntries.length !== 0 &&
              entry.startTime - lastSessionEntry.startTime < 1000 &&
              entry.startTime - firstSessionEntry.startTime < 5000
            ) {
              sessionValue += entry.value;
              sessionEntries.push(entry);
            } else {
              sessionValue = entry.value;
              sessionEntries = [entry];
            }
  
            // If the current session value is larger than the current CLS value,
            // update CLS and the entries contributing to it.
            if (sessionValue > metric.value) {
              metric.value = sessionValue;
              metric.entries = sessionEntries;
              if (report) {
                report();
              }
            }
          }
        });
      };
  
      const po = observe('layout-shift', handleEntries);
      if (po) {
        report = bindReporter(onReport, metric);
  
        const stopListening = () => {
          handleEntries(po.takeRecords() );
          report(true);
        };
  
        onHidden(stopListening);
  
        return stopListening;
      }
  
      return;
    };
  
    /*
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *     https://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
  
    let firstHiddenTime = -1;
  
    const initHiddenTime = () => {
      // If the document is hidden and not prerendering, assume it was always
      // hidden and the page was loaded in the background.
      return WINDOW$1.document.visibilityState === 'hidden' && !WINDOW$1.document.prerendering ? 0 : Infinity;
    };
  
    const trackChanges = () => {
      // Update the time if/when the document becomes hidden.
      onHidden(({ timeStamp }) => {
        firstHiddenTime = timeStamp;
      }, true);
    };
  
    const getVisibilityWatcher = (
  
    ) => {
      if (firstHiddenTime < 0) {
        // If the document is hidden when this code runs, assume it was hidden
        // since navigation start. This isn't a perfect heuristic, but it's the
        // best we can do until an API is available to support querying past
        // visibilityState.
        firstHiddenTime = initHiddenTime();
        trackChanges();
      }
      return {
        get firstHiddenTime() {
          return firstHiddenTime;
        },
      };
    };
  
    /*
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *     https://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
  
    /**
     * Calculates the [FID](https://web.dev/fid/) value for the current page and
     * calls the `callback` function once the value is ready, along with the
     * relevant `first-input` performance entry used to determine the value. The
     * reported value is a `DOMHighResTimeStamp`.
     *
     * _**Important:** since FID is only reported after the user interacts with the
     * page, it's possible that it will not be reported for some page loads._
     */
    const onFID = (onReport) => {
      const visibilityWatcher = getVisibilityWatcher();
      const metric = initMetric('FID');
      // eslint-disable-next-line prefer-const
      let report;
  
      const handleEntry = (entry) => {
        // Only report if the page wasn't hidden prior to the first input.
        if (entry.startTime < visibilityWatcher.firstHiddenTime) {
          metric.value = entry.processingStart - entry.startTime;
          metric.entries.push(entry);
          report(true);
        }
      };
  
      const handleEntries = (entries) => {
        (entries ).forEach(handleEntry);
      };
  
      const po = observe('first-input', handleEntries);
      report = bindReporter(onReport, metric);
  
      if (po) {
        onHidden(() => {
          handleEntries(po.takeRecords() );
          po.disconnect();
        }, true);
      }
    };
  
    /*
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *     https://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
  
    const reportedMetricIDs = {};
  
    /**
     * Calculates the [LCP](https://web.dev/lcp/) value for the current page and
     * calls the `callback` function once the value is ready (along with the
     * relevant `largest-contentful-paint` performance entry used to determine the
     * value). The reported value is a `DOMHighResTimeStamp`.
     */
    const onLCP = (onReport) => {
      const visibilityWatcher = getVisibilityWatcher();
      const metric = initMetric('LCP');
      let report;
  
      const handleEntries = (entries) => {
        const lastEntry = entries[entries.length - 1] ;
        if (lastEntry) {
          // The startTime attribute returns the value of the renderTime if it is
          // not 0, and the value of the loadTime otherwise. The activationStart
          // reference is used because LCP should be relative to page activation
          // rather than navigation start if the page was prerendered.
          const value = Math.max(lastEntry.startTime - getActivationStart(), 0);
  
          // Only report if the page wasn't hidden prior to LCP.
          if (value < visibilityWatcher.firstHiddenTime) {
            metric.value = value;
            metric.entries = [lastEntry];
            report();
          }
        }
      };
  
      const po = observe('largest-contentful-paint', handleEntries);
  
      if (po) {
        report = bindReporter(onReport, metric);
  
        const stopListening = () => {
          if (!reportedMetricIDs[metric.id]) {
            handleEntries(po.takeRecords() );
            po.disconnect();
            reportedMetricIDs[metric.id] = true;
            report(true);
          }
        };
  
        // Stop listening after input. Note: while scrolling is an input that
        // stop LCP observation, it's unreliable since it can be programmatically
        // generated. See: https://github.com/GoogleChrome/web-vitals/issues/75
        ['keydown', 'click'].forEach(type => {
          addEventListener(type, stopListening, { once: true, capture: true });
        });
  
        onHidden(stopListening, true);
  
        return stopListening;
      }
  
      return;
    };
  
    /**
     * Checks if a given value is a valid measurement value.
     */
    function isMeasurementValue(value) {
      return typeof value === 'number' && isFinite(value);
    }
  
    /**
     * Helper function to start child on transactions. This function will make sure that the transaction will
     * use the start timestamp of the created child span if it is earlier than the transactions actual
     * start timestamp.
     */
    function _startChild(transaction, { startTimestamp, ...ctx }) {
      if (startTimestamp && transaction.startTimestamp > startTimestamp) {
        transaction.startTimestamp = startTimestamp;
      }
  
      return transaction.startChild({
        startTimestamp,
        ...ctx,
      });
    }
  
    /**
     * Converts from milliseconds to seconds
     * @param time time in ms
     */
    function msToSec(time) {
      return time / 1000;
    }
  
    function getBrowserPerformanceAPI() {
      return WINDOW$1 && WINDOW$1.addEventListener && WINDOW$1.performance;
    }
  
    let _performanceCursor = 0;
  
    let _measurements = {};
    let _lcpEntry;
    let _clsEntry;
  
    /**
     * Start tracking web vitals
     *
     * @returns A function that forces web vitals collection
     */
    function startTrackingWebVitals() {
      const performance = getBrowserPerformanceAPI();
      if (performance && browserPerformanceTimeOrigin) {
        if (performance.mark) {
          WINDOW$1.performance.mark('sentry-tracing-init');
        }
        _trackFID();
        const clsCallback = _trackCLS();
        const lcpCallback = _trackLCP();
  
        return () => {
          if (clsCallback) {
            clsCallback();
          }
          if (lcpCallback) {
            lcpCallback();
          }
        };
      }
  
      return () => undefined;
    }
  
    /**
     * Start tracking long tasks.
     */
    function startTrackingLongTasks() {
      const entryHandler = (entries) => {
        for (const entry of entries) {
          const transaction = getActiveTransaction() ;
          if (!transaction) {
            return;
          }
          const startTime = msToSec((browserPerformanceTimeOrigin ) + entry.startTime);
          const duration = msToSec(entry.duration);
  
          transaction.startChild({
            description: 'Main UI thread blocked',
            op: 'ui.long-task',
            startTimestamp: startTime,
            endTimestamp: startTime + duration,
          });
        }
      };
  
      observe('longtask', entryHandler);
    }
  
    /**
     * Start tracking interaction events.
     */
    function startTrackingInteractions() {
      const entryHandler = (entries) => {
        for (const entry of entries) {
          const transaction = getActiveTransaction() ;
          if (!transaction) {
            return;
          }
  
          if (entry.name === 'click') {
            const startTime = msToSec((browserPerformanceTimeOrigin ) + entry.startTime);
            const duration = msToSec(entry.duration);
  
            transaction.startChild({
              description: htmlTreeAsString(entry.target),
              op: `ui.interaction.${entry.name}`,
              startTimestamp: startTime,
              endTimestamp: startTime + duration,
            });
          }
        }
      };
  
      observe('event', entryHandler, { durationThreshold: 0 });
    }
  
    /** Starts tracking the Cumulative Layout Shift on the current page. */
    function _trackCLS() {
      // See:
      // https://web.dev/evolving-cls/
      // https://web.dev/cls-web-tooling/
      return onCLS(metric => {
        const entry = metric.entries.pop();
        if (!entry) {
          return;
        }
  
        logger.log('[Measurements] Adding CLS');
        _measurements['cls'] = { value: metric.value, unit: '' };
        _clsEntry = entry ;
      });
    }
  
    /** Starts tracking the Largest Contentful Paint on the current page. */
    function _trackLCP() {
      return onLCP(metric => {
        const entry = metric.entries.pop();
        if (!entry) {
          return;
        }
  
        logger.log('[Measurements] Adding LCP');
        _measurements['lcp'] = { value: metric.value, unit: 'millisecond' };
        _lcpEntry = entry ;
      });
    }
  
    /** Starts tracking the First Input Delay on the current page. */
    function _trackFID() {
      onFID(metric => {
        const entry = metric.entries.pop();
        if (!entry) {
          return;
        }
  
        const timeOrigin = msToSec(browserPerformanceTimeOrigin );
        const startTime = msToSec(entry.startTime);
        logger.log('[Measurements] Adding FID');
        _measurements['fid'] = { value: metric.value, unit: 'millisecond' };
        _measurements['mark.fid'] = { value: timeOrigin + startTime, unit: 'second' };
      });
    }
  
    /** Add performance related spans to a transaction */
    function addPerformanceEntries(transaction) {
      const performance = getBrowserPerformanceAPI();
      if (!performance || !WINDOW$1.performance.getEntries || !browserPerformanceTimeOrigin) {
        // Gatekeeper if performance API not available
        return;
      }
  
      logger.log('[Tracing] Adding & adjusting spans using Performance API');
      const timeOrigin = msToSec(browserPerformanceTimeOrigin);
  
      const performanceEntries = performance.getEntries();
  
      let responseStartTimestamp;
      let requestStartTimestamp;
  
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      performanceEntries.slice(_performanceCursor).forEach((entry) => {
        const startTime = msToSec(entry.startTime);
        const duration = msToSec(entry.duration);
  
        if (transaction.op === 'navigation' && timeOrigin + startTime < transaction.startTimestamp) {
          return;
        }
  
        switch (entry.entryType) {
          case 'navigation': {
            _addNavigationSpans(transaction, entry, timeOrigin);
            responseStartTimestamp = timeOrigin + msToSec(entry.responseStart);
            requestStartTimestamp = timeOrigin + msToSec(entry.requestStart);
            break;
          }
          case 'mark':
          case 'paint':
          case 'measure': {
            _addMeasureSpans(transaction, entry, startTime, duration, timeOrigin);
  
            // capture web vitals
            const firstHidden = getVisibilityWatcher();
            // Only report if the page wasn't hidden prior to the web vital.
            const shouldRecord = entry.startTime < firstHidden.firstHiddenTime;
  
            if (entry.name === 'first-paint' && shouldRecord) {
              logger.log('[Measurements] Adding FP');
              _measurements['fp'] = { value: entry.startTime, unit: 'millisecond' };
            }
            if (entry.name === 'first-contentful-paint' && shouldRecord) {
              logger.log('[Measurements] Adding FCP');
              _measurements['fcp'] = { value: entry.startTime, unit: 'millisecond' };
            }
            break;
          }
          case 'resource': {
            const resourceName = (entry.name ).replace(WINDOW$1.location.origin, '');
            _addResourceSpans(transaction, entry, resourceName, startTime, duration, timeOrigin);
            break;
          }
          // Ignore other entry types.
        }
      });
  
      _performanceCursor = Math.max(performanceEntries.length - 1, 0);
  
      _trackNavigator(transaction);
  
      // Measurements are only available for pageload transactions
      if (transaction.op === 'pageload') {
        // Generate TTFB (Time to First Byte), which measured as the time between the beginning of the transaction and the
        // start of the response in milliseconds
        if (typeof responseStartTimestamp === 'number') {
          logger.log('[Measurements] Adding TTFB');
          _measurements['ttfb'] = {
            value: (responseStartTimestamp - transaction.startTimestamp) * 1000,
            unit: 'millisecond',
          };
  
          if (typeof requestStartTimestamp === 'number' && requestStartTimestamp <= responseStartTimestamp) {
            // Capture the time spent making the request and receiving the first byte of the response.
            // This is the time between the start of the request and the start of the response in milliseconds.
            _measurements['ttfb.requestTime'] = {
              value: (responseStartTimestamp - requestStartTimestamp) * 1000,
              unit: 'millisecond',
            };
          }
        }
  
        ['fcp', 'fp', 'lcp'].forEach(name => {
          if (!_measurements[name] || timeOrigin >= transaction.startTimestamp) {
            return;
          }
          // The web vitals, fcp, fp, lcp, and ttfb, all measure relative to timeOrigin.
          // Unfortunately, timeOrigin is not captured within the transaction span data, so these web vitals will need
          // to be adjusted to be relative to transaction.startTimestamp.
          const oldValue = _measurements[name].value;
          const measurementTimestamp = timeOrigin + msToSec(oldValue);
  
          // normalizedValue should be in milliseconds
          const normalizedValue = Math.abs((measurementTimestamp - transaction.startTimestamp) * 1000);
          const delta = normalizedValue - oldValue;
  
          logger.log(`[Measurements] Normalized ${name} from ${oldValue} to ${normalizedValue} (${delta})`);
          _measurements[name].value = normalizedValue;
        });
  
        const fidMark = _measurements['mark.fid'];
        if (fidMark && _measurements['fid']) {
          // create span for FID
          _startChild(transaction, {
            description: 'first input delay',
            endTimestamp: fidMark.value + msToSec(_measurements['fid'].value),
            op: 'ui.action',
            startTimestamp: fidMark.value,
          });
  
          // Delete mark.fid as we don't want it to be part of final payload
          delete _measurements['mark.fid'];
        }
  
        // If FCP is not recorded we should not record the cls value
        // according to the new definition of CLS.
        if (!('fcp' in _measurements)) {
          delete _measurements.cls;
        }
  
        Object.keys(_measurements).forEach(measurementName => {
          transaction.setMeasurement(
            measurementName,
            _measurements[measurementName].value,
            _measurements[measurementName].unit,
          );
        });
  
        _tagMetricInfo(transaction);
      }
  
      _lcpEntry = undefined;
      _clsEntry = undefined;
      _measurements = {};
    }
  
    /** Create measure related spans */
    function _addMeasureSpans(
      transaction,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      entry,
      startTime,
      duration,
      timeOrigin,
    ) {
      const measureStartTimestamp = timeOrigin + startTime;
      const measureEndTimestamp = measureStartTimestamp + duration;
  
      _startChild(transaction, {
        description: entry.name ,
        endTimestamp: measureEndTimestamp,
        op: entry.entryType ,
        startTimestamp: measureStartTimestamp,
      });
  
      return measureStartTimestamp;
    }
  
    /** Instrument navigation entries */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function _addNavigationSpans(transaction, entry, timeOrigin) {
      ['unloadEvent', 'redirect', 'domContentLoadedEvent', 'loadEvent', 'connect'].forEach(event => {
        _addPerformanceNavigationTiming(transaction, entry, event, timeOrigin);
      });
      _addPerformanceNavigationTiming(transaction, entry, 'secureConnection', timeOrigin, 'TLS/SSL', 'connectEnd');
      _addPerformanceNavigationTiming(transaction, entry, 'fetch', timeOrigin, 'cache', 'domainLookupStart');
      _addPerformanceNavigationTiming(transaction, entry, 'domainLookup', timeOrigin, 'DNS');
      _addRequest(transaction, entry, timeOrigin);
    }
  
    /** Create performance navigation related spans */
    function _addPerformanceNavigationTiming(
      transaction,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      entry,
      event,
      timeOrigin,
      description,
      eventEnd,
    ) {
      const end = eventEnd ? (entry[eventEnd] ) : (entry[`${event}End`] );
      const start = entry[`${event}Start`] ;
      if (!start || !end) {
        return;
      }
      _startChild(transaction, {
        op: 'browser',
        description: description || event,
        startTimestamp: timeOrigin + msToSec(start),
        endTimestamp: timeOrigin + msToSec(end),
      });
    }
  
    /** Create request and response related spans */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function _addRequest(transaction, entry, timeOrigin) {
      _startChild(transaction, {
        op: 'browser',
        description: 'request',
        startTimestamp: timeOrigin + msToSec(entry.requestStart ),
        endTimestamp: timeOrigin + msToSec(entry.responseEnd ),
      });
  
      _startChild(transaction, {
        op: 'browser',
        description: 'response',
        startTimestamp: timeOrigin + msToSec(entry.responseStart ),
        endTimestamp: timeOrigin + msToSec(entry.responseEnd ),
      });
    }
  
    /** Create resource-related spans */
    function _addResourceSpans(
      transaction,
      entry,
      resourceName,
      startTime,
      duration,
      timeOrigin,
    ) {
      // we already instrument based on fetch and xhr, so we don't need to
      // duplicate spans here.
      if (entry.initiatorType === 'xmlhttprequest' || entry.initiatorType === 'fetch') {
        return;
      }
  
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = {};
      if ('transferSize' in entry) {
        data['http.response_transfer_size'] = entry.transferSize;
      }
      if ('encodedBodySize' in entry) {
        data['http.response_content_length'] = entry.encodedBodySize;
      }
      if ('decodedBodySize' in entry) {
        data['http.decoded_response_content_length'] = entry.decodedBodySize;
      }
      if ('renderBlockingStatus' in entry) {
        data['resource.render_blocking_status'] = entry.renderBlockingStatus;
      }
  
      const startTimestamp = timeOrigin + startTime;
      const endTimestamp = startTimestamp + duration;
  
      _startChild(transaction, {
        description: resourceName,
        endTimestamp,
        op: entry.initiatorType ? `resource.${entry.initiatorType}` : 'resource.other',
        startTimestamp,
        data,
      });
    }
  
    /**
     * Capture the information of the user agent.
     */
    function _trackNavigator(transaction) {
      const navigator = WINDOW$1.navigator ;
      if (!navigator) {
        return;
      }
  
      // track network connectivity
      const connection = navigator.connection;
      if (connection) {
        if (connection.effectiveType) {
          transaction.setTag('effectiveConnectionType', connection.effectiveType);
        }
  
        if (connection.type) {
          transaction.setTag('connectionType', connection.type);
        }
  
        if (isMeasurementValue(connection.rtt)) {
          _measurements['connection.rtt'] = { value: connection.rtt, unit: 'millisecond' };
        }
      }
  
      if (isMeasurementValue(navigator.deviceMemory)) {
        transaction.setTag('deviceMemory', `${navigator.deviceMemory} GB`);
      }
  
      if (isMeasurementValue(navigator.hardwareConcurrency)) {
        transaction.setTag('hardwareConcurrency', String(navigator.hardwareConcurrency));
      }
    }
  
    /** Add LCP / CLS data to transaction to allow debugging */
    function _tagMetricInfo(transaction) {
      if (_lcpEntry) {
        logger.log('[Measurements] Adding LCP Data');
  
        // Capture Properties of the LCP element that contributes to the LCP.
  
        if (_lcpEntry.element) {
          transaction.setTag('lcp.element', htmlTreeAsString(_lcpEntry.element));
        }
  
        if (_lcpEntry.id) {
          transaction.setTag('lcp.id', _lcpEntry.id);
        }
  
        if (_lcpEntry.url) {
          // Trim URL to the first 200 characters.
          transaction.setTag('lcp.url', _lcpEntry.url.trim().slice(0, 200));
        }
  
        transaction.setTag('lcp.size', _lcpEntry.size);
      }
  
      // See: https://developer.mozilla.org/en-US/docs/Web/API/LayoutShift
      if (_clsEntry && _clsEntry.sources) {
        logger.log('[Measurements] Adding CLS Data');
        _clsEntry.sources.forEach((source, index) =>
          transaction.setTag(`cls.source.${index + 1}`, htmlTreeAsString(source.node)),
        );
      }
    }
  
    /* eslint-disable max-lines */
  
    const DEFAULT_TRACE_PROPAGATION_TARGETS = ['localhost', /^\//];
  
    /** Options for Request Instrumentation */
  
    const defaultRequestInstrumentationOptions = {
      traceFetch: true,
      traceXHR: true,
      // TODO (v8): Remove this property
      tracingOrigins: DEFAULT_TRACE_PROPAGATION_TARGETS,
      tracePropagationTargets: DEFAULT_TRACE_PROPAGATION_TARGETS,
    };
  
    /** Registers span creators for xhr and fetch requests  */
    function instrumentOutgoingRequests(_options) {
      // eslint-disable-next-line deprecation/deprecation
      const { traceFetch, traceXHR, tracePropagationTargets, tracingOrigins, shouldCreateSpanForRequest } = {
        traceFetch: defaultRequestInstrumentationOptions.traceFetch,
        traceXHR: defaultRequestInstrumentationOptions.traceXHR,
        ..._options,
      };
  
      const shouldCreateSpan =
        typeof shouldCreateSpanForRequest === 'function' ? shouldCreateSpanForRequest : (_) => true;
  
      // TODO(v8) Remove tracingOrigins here
      // The only reason we're passing it in here is because this instrumentOutgoingRequests function is publicly exported
      // and we don't want to break the API. We can remove it in v8.
      const shouldAttachHeadersWithTargets = (url) =>
        shouldAttachHeaders(url, tracePropagationTargets || tracingOrigins);
  
      const spans = {};
  
      if (traceFetch) {
        addInstrumentationHandler('fetch', (handlerData) => {
          fetchCallback(handlerData, shouldCreateSpan, shouldAttachHeadersWithTargets, spans);
        });
      }
  
      if (traceXHR) {
        addInstrumentationHandler('xhr', (handlerData) => {
          xhrCallback(handlerData, shouldCreateSpan, shouldAttachHeadersWithTargets, spans);
        });
      }
    }
  
    /**
     * A function that determines whether to attach tracing headers to a request.
     * This was extracted from `instrumentOutgoingRequests` to make it easier to test shouldAttachHeaders.
     * We only export this fuction for testing purposes.
     */
    function shouldAttachHeaders(url, tracePropagationTargets) {
      return stringMatchesSomePattern(url, tracePropagationTargets || DEFAULT_TRACE_PROPAGATION_TARGETS);
    }
  
    /**
     * Create and track fetch request spans
     */
    function fetchCallback(
      handlerData,
      shouldCreateSpan,
      shouldAttachHeaders,
      spans,
    ) {
      if (!hasTracingEnabled() || !(handlerData.fetchData && shouldCreateSpan(handlerData.fetchData.url))) {
        return;
      }
  
      if (handlerData.endTimestamp) {
        const spanId = handlerData.fetchData.__span;
        if (!spanId) return;
  
        const span = spans[spanId];
        if (span) {
          if (handlerData.response) {
            // TODO (kmclb) remove this once types PR goes through
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            span.setHttpStatus(handlerData.response.status);
          } else if (handlerData.error) {
            span.setStatus('internal_error');
          }
          span.finish();
  
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete spans[spanId];
        }
        return;
      }
  
      const contentLength =
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        handlerData.response && handlerData.response.headers && handlerData.response.headers.get('content-length');
      const currentScope = getCurrentHub().getScope();
      const currentSpan = currentScope && currentScope.getSpan();
      const activeTransaction = currentSpan && currentSpan.transaction;
  
      if (currentSpan && activeTransaction) {
        const { method, url } = handlerData.fetchData;
        const span = currentSpan.startChild({
          data: {
            url,
            type: 'fetch',
            ...(contentLength ? { 'http.response_content_length': contentLength } : {}),
            'http.method': method,
          },
          description: `${method} ${url}`,
          op: 'http.client',
        });
  
        handlerData.fetchData.__span = span.spanId;
        spans[span.spanId] = span;
  
        const request = handlerData.args[0];
  
        // In case the user hasn't set the second argument of a fetch call we default it to `{}`.
        handlerData.args[1] = handlerData.args[1] || {};
  
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options = handlerData.args[1];
  
        if (shouldAttachHeaders(handlerData.fetchData.url)) {
          options.headers = addTracingHeadersToFetchRequest(
            request,
            activeTransaction.getDynamicSamplingContext(),
            span,
            options,
          );
        }
      }
    }
  
    /**
     * Adds sentry-trace and baggage headers to the various forms of fetch headers
     */
    function addTracingHeadersToFetchRequest(
      request, // unknown is actually type Request but we can't export DOM types from this package,
      dynamicSamplingContext,
      span,
      options
  
    ,
    ) {
      const sentryBaggageHeader = dynamicSamplingContextToSentryBaggageHeader(dynamicSamplingContext);
      const sentryTraceHeader = span.toTraceparent();
  
      const headers =
        typeof Request !== 'undefined' && isInstanceOf(request, Request) ? (request ).headers : options.headers;
  
      if (!headers) {
        return { 'sentry-trace': sentryTraceHeader, baggage: sentryBaggageHeader };
      } else if (typeof Headers !== 'undefined' && isInstanceOf(headers, Headers)) {
        const newHeaders = new Headers(headers );
  
        newHeaders.append('sentry-trace', sentryTraceHeader);
  
        if (sentryBaggageHeader) {
          // If the same header is appended multiple times the browser will merge the values into a single request header.
          // Its therefore safe to simply push a "baggage" entry, even though there might already be another baggage header.
          newHeaders.append(BAGGAGE_HEADER_NAME, sentryBaggageHeader);
        }
  
        return newHeaders ;
      } else if (Array.isArray(headers)) {
        const newHeaders = [...headers, ['sentry-trace', sentryTraceHeader]];
  
        if (sentryBaggageHeader) {
          // If there are multiple entries with the same key, the browser will merge the values into a single request header.
          // Its therefore safe to simply push a "baggage" entry, even though there might already be another baggage header.
          newHeaders.push([BAGGAGE_HEADER_NAME, sentryBaggageHeader]);
        }
  
        return newHeaders ;
      } else {
        const existingBaggageHeader = 'baggage' in headers ? headers.baggage : undefined;
        const newBaggageHeaders = [];
  
        if (Array.isArray(existingBaggageHeader)) {
          newBaggageHeaders.push(...existingBaggageHeader);
        } else if (existingBaggageHeader) {
          newBaggageHeaders.push(existingBaggageHeader);
        }
  
        if (sentryBaggageHeader) {
          newBaggageHeaders.push(sentryBaggageHeader);
        }
  
        return {
          ...(headers ),
          'sentry-trace': sentryTraceHeader,
          baggage: newBaggageHeaders.length > 0 ? newBaggageHeaders.join(',') : undefined,
        };
      }
    }
  
    /**
     * Create and track xhr request spans
     */
    function xhrCallback(
      handlerData,
      shouldCreateSpan,
      shouldAttachHeaders,
      spans,
    ) {
      const xhr = handlerData.xhr;
      const sentryXhrData = xhr && xhr[SENTRY_XHR_DATA_KEY];
  
      if (
        !hasTracingEnabled() ||
        (xhr && xhr.__sentry_own_request__) ||
        !(xhr && sentryXhrData && shouldCreateSpan(sentryXhrData.url))
      ) {
        return;
      }
  
      // check first if the request has finished and is tracked by an existing span which should now end
      if (handlerData.endTimestamp) {
        const spanId = xhr.__sentry_xhr_span_id__;
        if (!spanId) return;
  
        const span = spans[spanId];
        if (span) {
          span.setHttpStatus(sentryXhrData.status_code);
          span.finish();
  
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete spans[spanId];
        }
        return;
      }
  
      const currentScope = getCurrentHub().getScope();
      const currentSpan = currentScope && currentScope.getSpan();
      const activeTransaction = currentSpan && currentSpan.transaction;
  
      if (currentSpan && activeTransaction) {
        const span = currentSpan.startChild({
          data: {
            ...sentryXhrData.data,
            type: 'xhr',
            'http.method': sentryXhrData.method,
            url: sentryXhrData.url,
          },
          description: `${sentryXhrData.method} ${sentryXhrData.url}`,
          op: 'http.client',
        });
  
        xhr.__sentry_xhr_span_id__ = span.spanId;
        spans[xhr.__sentry_xhr_span_id__] = span;
  
        if (xhr.setRequestHeader && shouldAttachHeaders(sentryXhrData.url)) {
          try {
            xhr.setRequestHeader('sentry-trace', span.toTraceparent());
  
            const dynamicSamplingContext = activeTransaction.getDynamicSamplingContext();
            const sentryBaggageHeader = dynamicSamplingContextToSentryBaggageHeader(dynamicSamplingContext);
  
            if (sentryBaggageHeader) {
              // From MDN: "If this method is called several times with the same header, the values are merged into one single request header."
              // We can therefore simply set a baggage header without checking what was there before
              // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/setRequestHeader
              xhr.setRequestHeader(BAGGAGE_HEADER_NAME, sentryBaggageHeader);
            }
          } catch (_) {
            // Error: InvalidStateError: Failed to execute 'setRequestHeader' on 'XMLHttpRequest': The object's state must be OPENED.
          }
        }
      }
    }
  
    /**
     * Default function implementing pageload and navigation transactions
     */
    function instrumentRoutingWithDefaults(
      customStartTransaction,
      startTransactionOnPageLoad = true,
      startTransactionOnLocationChange = true,
    ) {
      if (!WINDOW$1 || !WINDOW$1.location) {
        logger.warn('Could not initialize routing instrumentation due to invalid location');
        return;
      }
  
      let startingUrl = WINDOW$1.location.href;
  
      let activeTransaction;
      if (startTransactionOnPageLoad) {
        activeTransaction = customStartTransaction({
          name: WINDOW$1.location.pathname,
          // pageload should always start at timeOrigin (and needs to be in s, not ms)
          startTimestamp: browserPerformanceTimeOrigin ? browserPerformanceTimeOrigin / 1000 : undefined,
          op: 'pageload',
          metadata: { source: 'url' },
        });
      }
  
      if (startTransactionOnLocationChange) {
        addInstrumentationHandler('history', ({ to, from }) => {
          /**
           * This early return is there to account for some cases where a navigation transaction starts right after
           * long-running pageload. We make sure that if `from` is undefined and a valid `startingURL` exists, we don't
           * create an uneccessary navigation transaction.
           *
           * This was hard to duplicate, but this behavior stopped as soon as this fix was applied. This issue might also
           * only be caused in certain development environments where the usage of a hot module reloader is causing
           * errors.
           */
          if (from === undefined && startingUrl && startingUrl.indexOf(to) !== -1) {
            startingUrl = undefined;
            return;
          }
  
          if (from !== to) {
            startingUrl = undefined;
            if (activeTransaction) {
              logger.log(`[Tracing] Finishing current transaction with op: ${activeTransaction.op}`);
              // If there's an open transaction on the scope, we need to finish it before creating an new one.
              activeTransaction.finish();
            }
            activeTransaction = customStartTransaction({
              name: WINDOW$1.location.pathname,
              op: 'navigation',
              metadata: { source: 'url' },
            });
          }
        });
      }
    }
  
    const BROWSER_TRACING_INTEGRATION_ID = 'BrowserTracing';
  
    /** Options for Browser Tracing integration */
  
    const DEFAULT_BROWSER_TRACING_OPTIONS = {
      ...TRACING_DEFAULTS,
      markBackgroundTransactions: true,
      routingInstrumentation: instrumentRoutingWithDefaults,
      startTransactionOnLocationChange: true,
      startTransactionOnPageLoad: true,
      enableLongTask: true,
      _experiments: {},
      ...defaultRequestInstrumentationOptions,
    };
  
    /**
     * The Browser Tracing integration automatically instruments browser pageload/navigation
     * actions as transactions, and captures requests, metrics and errors as spans.
     *
     * The integration can be configured with a variety of options, and can be extended to use
     * any routing library. This integration uses {@see IdleTransaction} to create transactions.
     */
    class BrowserTracing  {
      // This class currently doesn't have a static `id` field like the other integration classes, because it prevented
      // @sentry/tracing from being treeshaken. Tree shakers do not like static fields, because they behave like side effects.
      // TODO: Come up with a better plan, than using static fields on integration classes, and use that plan on all
      // integrations.
  
      /** Browser Tracing integration options */
  
      /**
       * @inheritDoc
       */
       __init() {this.name = BROWSER_TRACING_INTEGRATION_ID;}
  
       constructor(_options) {BrowserTracing.prototype.__init.call(this);
        addTracingExtensions();
  
        this.options = {
          ...DEFAULT_BROWSER_TRACING_OPTIONS,
          ..._options,
        };
  
        // Special case: enableLongTask can be set in _experiments
        // TODO (v8): Remove this in v8
        if (this.options._experiments.enableLongTask !== undefined) {
          this.options.enableLongTask = this.options._experiments.enableLongTask;
        }
  
        // TODO (v8): remove this block after tracingOrigins is removed
        // Set tracePropagationTargets to tracingOrigins if specified by the user
        // In case both are specified, tracePropagationTargets takes precedence
        // eslint-disable-next-line deprecation/deprecation
        if (_options && !_options.tracePropagationTargets && _options.tracingOrigins) {
          // eslint-disable-next-line deprecation/deprecation
          this.options.tracePropagationTargets = _options.tracingOrigins;
        }
  
        this._collectWebVitals = startTrackingWebVitals();
        if (this.options.enableLongTask) {
          startTrackingLongTasks();
        }
        if (this.options._experiments.enableInteractions) {
          startTrackingInteractions();
        }
      }
  
      /**
       * @inheritDoc
       */
       setupOnce(_, getCurrentHub) {
        this._getCurrentHub = getCurrentHub;
  
        const {
          routingInstrumentation: instrumentRouting,
          startTransactionOnLocationChange,
          startTransactionOnPageLoad,
          markBackgroundTransactions,
          traceFetch,
          traceXHR,
          tracePropagationTargets,
          shouldCreateSpanForRequest,
          _experiments,
        } = this.options;
  
        instrumentRouting(
          (context) => {
            const transaction = this._createRouteTransaction(context);
  
            this.options._experiments.onStartRouteTransaction &&
              this.options._experiments.onStartRouteTransaction(transaction, context, getCurrentHub);
  
            return transaction;
          },
          startTransactionOnPageLoad,
          startTransactionOnLocationChange,
        );
  
        if (markBackgroundTransactions) {
          registerBackgroundTabDetection();
        }
  
        if (_experiments.enableInteractions) {
          this._registerInteractionListener();
        }
  
        instrumentOutgoingRequests({
          traceFetch,
          traceXHR,
          tracePropagationTargets,
          shouldCreateSpanForRequest,
        });
      }
  
      /** Create routing idle transaction. */
       _createRouteTransaction(context) {
        if (!this._getCurrentHub) {
          logger.warn(`[Tracing] Did not create ${context.op} transaction because _getCurrentHub is invalid.`);
          return undefined;
        }
  
        const { beforeNavigate, idleTimeout, finalTimeout, heartbeatInterval } = this.options;
  
        const isPageloadTransaction = context.op === 'pageload';
  
        const sentryTraceMetaTagValue = isPageloadTransaction ? getMetaContent('sentry-trace') : null;
        const baggageMetaTagValue = isPageloadTransaction ? getMetaContent('baggage') : null;
  
        const traceParentData = sentryTraceMetaTagValue ? extractTraceparentData(sentryTraceMetaTagValue) : undefined;
        const dynamicSamplingContext = baggageMetaTagValue
          ? baggageHeaderToDynamicSamplingContext(baggageMetaTagValue)
          : undefined;
  
        const expandedContext = {
          ...context,
          ...traceParentData,
          metadata: {
            ...context.metadata,
            dynamicSamplingContext: traceParentData && !dynamicSamplingContext ? {} : dynamicSamplingContext,
          },
          trimEnd: true,
        };
  
        const modifiedContext = typeof beforeNavigate === 'function' ? beforeNavigate(expandedContext) : expandedContext;
  
        // For backwards compatibility reasons, beforeNavigate can return undefined to "drop" the transaction (prevent it
        // from being sent to Sentry).
        const finalContext = modifiedContext === undefined ? { ...expandedContext, sampled: false } : modifiedContext;
  
        // If `beforeNavigate` set a custom name, record that fact
        finalContext.metadata =
          finalContext.name !== expandedContext.name
            ? { ...finalContext.metadata, source: 'custom' }
            : finalContext.metadata;
  
        this._latestRouteName = finalContext.name;
        this._latestRouteSource = finalContext.metadata && finalContext.metadata.source;
  
        if (finalContext.sampled === false) {
          logger.log(`[Tracing] Will not send ${finalContext.op} transaction because of beforeNavigate.`);
        }
  
        logger.log(`[Tracing] Starting ${finalContext.op} transaction on scope`);
  
        const hub = this._getCurrentHub();
        const { location } = WINDOW$1;
  
        const idleTransaction = startIdleTransaction(
          hub,
          finalContext,
          idleTimeout,
          finalTimeout,
          true,
          { location }, // for use in the tracesSampler
          heartbeatInterval,
        );
        idleTransaction.registerBeforeFinishCallback(transaction => {
          this._collectWebVitals();
          addPerformanceEntries(transaction);
        });
  
        return idleTransaction ;
      }
  
      /** Start listener for interaction transactions */
       _registerInteractionListener() {
        let inflightInteractionTransaction;
        const registerInteractionTransaction = () => {
          const { idleTimeout, finalTimeout, heartbeatInterval } = this.options;
          const op = 'ui.action.click';
  
          const currentTransaction = getActiveTransaction();
          if (currentTransaction && currentTransaction.op && ['navigation', 'pageload'].includes(currentTransaction.op)) {
            logger.warn(
                `[Tracing] Did not create ${op} transaction because a pageload or navigation transaction is in progress.`,
              );
            return undefined;
          }
  
          if (inflightInteractionTransaction) {
            inflightInteractionTransaction.setFinishReason('interactionInterrupted');
            inflightInteractionTransaction.finish();
            inflightInteractionTransaction = undefined;
          }
  
          if (!this._getCurrentHub) {
            logger.warn(`[Tracing] Did not create ${op} transaction because _getCurrentHub is invalid.`);
            return undefined;
          }
  
          if (!this._latestRouteName) {
            logger.warn(`[Tracing] Did not create ${op} transaction because _latestRouteName is missing.`);
            return undefined;
          }
  
          const hub = this._getCurrentHub();
          const { location } = WINDOW$1;
  
          const context = {
            name: this._latestRouteName,
            op,
            trimEnd: true,
            metadata: {
              source: this._latestRouteSource || 'url',
            },
          };
  
          inflightInteractionTransaction = startIdleTransaction(
            hub,
            context,
            idleTimeout,
            finalTimeout,
            true,
            { location }, // for use in the tracesSampler
            heartbeatInterval,
          );
        };
  
        ['click'].forEach(type => {
          addEventListener(type, registerInteractionTransaction, { once: false, capture: true });
        });
      }
    }
  
    /** Returns the value of a meta tag */
    function getMetaContent(metaName) {
      // Can't specify generic to `getDomElement` because tracing can be used
      // in a variety of environments, have to disable `no-unsafe-member-access`
      // as a result.
      const metaTag = getDomElement(`meta[name=${metaName}]`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return metaTag ? metaTag.getAttribute('content') : null;
    }
  
    /**
     * This patches the global object and injects the Tracing extensions methods
     */
    function addExtensionMethods() {
      addTracingExtensions();
    }
  
    const WINDOW = GLOBAL_OBJ ;
  
    let ignoreOnError = 0;
  
    /**
     * @hidden
     */
    function shouldIgnoreOnError() {
      return ignoreOnError > 0;
    }
  
    /**
     * @hidden
     */
    function ignoreNextOnError() {
      // onerror should trigger before setTimeout
      ignoreOnError++;
      setTimeout(() => {
        ignoreOnError--;
      });
    }
  
    /**
     * Instruments the given function and sends an event to Sentry every time the
     * function throws an exception.
     *
     * @param fn A function to wrap. It is generally safe to pass an unbound function, because the returned wrapper always
     * has a correct `this` context.
     * @returns The wrapped function.
     * @hidden
     */
    function wrap$1(
      fn,
      options
  
     = {},
      before,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) {
      // for future readers what this does is wrap a function and then create
      // a bi-directional wrapping between them.
      //
      // example: wrapped = wrap(original);
      //  original.__sentry_wrapped__ -> wrapped
      //  wrapped.__sentry_original__ -> original
  
      if (typeof fn !== 'function') {
        return fn;
      }
  
      try {
        // if we're dealing with a function that was previously wrapped, return
        // the original wrapper.
        const wrapper = fn.__sentry_wrapped__;
        if (wrapper) {
          return wrapper;
        }
  
        // We don't wanna wrap it twice
        if (getOriginalFunction(fn)) {
          return fn;
        }
      } catch (e) {
        // Just accessing custom props in some Selenium environments
        // can cause a "Permission denied" exception (see raven-js#495).
        // Bail on wrapping and return the function as-is (defers to window.onerror).
        return fn;
      }
  
      /* eslint-disable prefer-rest-params */
      // It is important that `sentryWrapped` is not an arrow function to preserve the context of `this`
      const sentryWrapped = function () {
        const args = Array.prototype.slice.call(arguments);
  
        try {
          if (before && typeof before === 'function') {
            before.apply(this, arguments);
          }
  
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
          const wrappedArguments = args.map((arg) => wrap$1(arg, options));
  
          // Attempt to invoke user-land function
          // NOTE: If you are a Sentry user, and you are seeing this stack frame, it
          //       means the sentry.javascript SDK caught an error invoking your application code. This
          //       is expected behavior and NOT indicative of a bug with sentry.javascript.
          return fn.apply(this, wrappedArguments);
        } catch (ex) {
          ignoreNextOnError();
  
          withScope((scope) => {
            scope.addEventProcessor((event) => {
              if (options.mechanism) {
                addExceptionTypeValue(event, undefined, undefined);
                addExceptionMechanism(event, options.mechanism);
              }
  
              event.extra = {
                ...event.extra,
                arguments: args,
              };
  
              return event;
            });
  
            captureException(ex);
          });
  
          throw ex;
        }
      };
      /* eslint-enable prefer-rest-params */
  
      // Accessing some objects may throw
      // ref: https://github.com/getsentry/sentry-javascript/issues/1168
      try {
        for (const property in fn) {
          if (Object.prototype.hasOwnProperty.call(fn, property)) {
            sentryWrapped[property] = fn[property];
          }
        }
      } catch (_oO) {} // eslint-disable-line no-empty
  
      // Signal that this function has been wrapped/filled already
      // for both debugging and to prevent it to being wrapped/filled twice
      markFunctionWrapped(sentryWrapped, fn);
  
      addNonEnumerableProperty(fn, '__sentry_wrapped__', sentryWrapped);
  
      // Restore original function name (not all browsers allow that)
      try {
        const descriptor = Object.getOwnPropertyDescriptor(sentryWrapped, 'name') ;
        if (descriptor.configurable) {
          Object.defineProperty(sentryWrapped, 'name', {
            get() {
              return fn.name;
            },
          });
        }
        // eslint-disable-next-line no-empty
      } catch (_oO) {}
  
      return sentryWrapped;
    }
  
    /**
     * All properties the report dialog supports
     */
  
    /**
     * This function creates an exception from a JavaScript Error
     */
    function exceptionFromError(stackParser, ex) {
      // Get the frames first since Opera can lose the stack if we touch anything else first
      const frames = parseStackFrames(stackParser, ex);
  
      const exception = {
        type: ex && ex.name,
        value: extractMessage(ex),
      };
  
      if (frames.length) {
        exception.stacktrace = { frames };
      }
  
      if (exception.type === undefined && exception.value === '') {
        exception.value = 'Unrecoverable error caught';
      }
  
      return exception;
    }
  
    /**
     * @hidden
     */
    function eventFromPlainObject(
      stackParser,
      exception,
      syntheticException,
      isUnhandledRejection,
    ) {
      const hub = getCurrentHub();
      const client = hub.getClient();
      const normalizeDepth = client && client.getOptions().normalizeDepth;
  
      const event = {
        exception: {
          values: [
            {
              type: isEvent(exception) ? exception.constructor.name : isUnhandledRejection ? 'UnhandledRejection' : 'Error',
              value: `Non-Error ${
              isUnhandledRejection ? 'promise rejection' : 'exception'
            } captured with keys: ${extractExceptionKeysForMessage(exception)}`,
            },
          ],
        },
        extra: {
          __serialized__: normalizeToSize(exception, normalizeDepth),
        },
      };
  
      if (syntheticException) {
        const frames = parseStackFrames(stackParser, syntheticException);
        if (frames.length) {
          // event.exception.values[0] has been set above
          (event.exception ).values[0].stacktrace = { frames };
        }
      }
  
      return event;
    }
  
    /**
     * @hidden
     */
    function eventFromError(stackParser, ex) {
      return {
        exception: {
          values: [exceptionFromError(stackParser, ex)],
        },
      };
    }
  
    /** Parses stack frames from an error */
    function parseStackFrames(
      stackParser,
      ex,
    ) {
      // Access and store the stacktrace property before doing ANYTHING
      // else to it because Opera is not very good at providing it
      // reliably in other circumstances.
      const stacktrace = ex.stacktrace || ex.stack || '';
  
      const popSize = getPopSize(ex);
  
      try {
        return stackParser(stacktrace, popSize);
      } catch (e) {
        // no-empty
      }
  
      return [];
    }
  
    // Based on our own mapping pattern - https://github.com/getsentry/sentry/blob/9f08305e09866c8bd6d0c24f5b0aabdd7dd6c59c/src/sentry/lang/javascript/errormapping.py#L83-L108
    const reactMinifiedRegexp = /Minified React error #\d+;/i;
  
    function getPopSize(ex) {
      if (ex) {
        if (typeof ex.framesToPop === 'number') {
          return ex.framesToPop;
        }
  
        if (reactMinifiedRegexp.test(ex.message)) {
          return 1;
        }
      }
  
      return 0;
    }
  
    /**
     * There are cases where stacktrace.message is an Event object
     * https://github.com/getsentry/sentry-javascript/issues/1949
     * In this specific case we try to extract stacktrace.message.error.message
     */
    function extractMessage(ex) {
      const message = ex && ex.message;
      if (!message) {
        return 'No error message';
      }
      if (message.error && typeof message.error.message === 'string') {
        return message.error.message;
      }
      return message;
    }
  
    /**
     * Creates an {@link Event} from all inputs to `captureException` and non-primitive inputs to `captureMessage`.
     * @hidden
     */
    function eventFromException(
      stackParser,
      exception,
      hint,
      attachStacktrace,
    ) {
      const syntheticException = (hint && hint.syntheticException) || undefined;
      const event = eventFromUnknownInput(stackParser, exception, syntheticException, attachStacktrace);
      addExceptionMechanism(event); // defaults to { type: 'generic', handled: true }
      event.level = 'error';
      if (hint && hint.event_id) {
        event.event_id = hint.event_id;
      }
      return resolvedSyncPromise(event);
    }
  
    /**
     * Builds and Event from a Message
     * @hidden
     */
    function eventFromMessage(
      stackParser,
      message,
      // eslint-disable-next-line deprecation/deprecation
      level = 'info',
      hint,
      attachStacktrace,
    ) {
      const syntheticException = (hint && hint.syntheticException) || undefined;
      const event = eventFromString(stackParser, message, syntheticException, attachStacktrace);
      event.level = level;
      if (hint && hint.event_id) {
        event.event_id = hint.event_id;
      }
      return resolvedSyncPromise(event);
    }
  
    /**
     * @hidden
     */
    function eventFromUnknownInput(
      stackParser,
      exception,
      syntheticException,
      attachStacktrace,
      isUnhandledRejection,
    ) {
      let event;
  
      if (isErrorEvent$1(exception ) && (exception ).error) {
        // If it is an ErrorEvent with `error` property, extract it to get actual Error
        const errorEvent = exception ;
        return eventFromError(stackParser, errorEvent.error );
      }
  
      // If it is a `DOMError` (which is a legacy API, but still supported in some browsers) then we just extract the name
      // and message, as it doesn't provide anything else. According to the spec, all `DOMExceptions` should also be
      // `Error`s, but that's not the case in IE11, so in that case we treat it the same as we do a `DOMError`.
      //
      // https://developer.mozilla.org/en-US/docs/Web/API/DOMError
      // https://developer.mozilla.org/en-US/docs/Web/API/DOMException
      // https://webidl.spec.whatwg.org/#es-DOMException-specialness
      if (isDOMError(exception ) || isDOMException(exception )) {
        const domException = exception ;
  
        if ('stack' in (exception )) {
          event = eventFromError(stackParser, exception );
        } else {
          const name = domException.name || (isDOMError(domException) ? 'DOMError' : 'DOMException');
          const message = domException.message ? `${name}: ${domException.message}` : name;
          event = eventFromString(stackParser, message, syntheticException, attachStacktrace);
          addExceptionTypeValue(event, message);
        }
        if ('code' in domException) {
          event.tags = { ...event.tags, 'DOMException.code': `${domException.code}` };
        }
  
        return event;
      }
      if (isError(exception)) {
        // we have a real Error object, do nothing
        return eventFromError(stackParser, exception);
      }
      if (isPlainObject(exception) || isEvent(exception)) {
        // If it's a plain object or an instance of `Event` (the built-in JS kind, not this SDK's `Event` type), serialize
        // it manually. This will allow us to group events based on top-level keys which is much better than creating a new
        // group on any key/value change.
        const objectException = exception ;
        event = eventFromPlainObject(stackParser, objectException, syntheticException, isUnhandledRejection);
        addExceptionMechanism(event, {
          synthetic: true,
        });
        return event;
      }
  
      // If none of previous checks were valid, then it means that it's not:
      // - an instance of DOMError
      // - an instance of DOMException
      // - an instance of Event
      // - an instance of Error
      // - a valid ErrorEvent (one with an error property)
      // - a plain Object
      //
      // So bail out and capture it as a simple message:
      event = eventFromString(stackParser, exception , syntheticException, attachStacktrace);
      addExceptionTypeValue(event, `${exception}`, undefined);
      addExceptionMechanism(event, {
        synthetic: true,
      });
  
      return event;
    }
  
    /**
     * @hidden
     */
    function eventFromString(
      stackParser,
      input,
      syntheticException,
      attachStacktrace,
    ) {
      const event = {
        message: input,
      };
  
      if (attachStacktrace && syntheticException) {
        const frames = parseStackFrames(stackParser, syntheticException);
        if (frames.length) {
          event.exception = {
            values: [{ value: input, stacktrace: { frames } }],
          };
        }
      }
  
      return event;
    }
  
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
  
    /** maxStringLength gets capped to prevent 100 breadcrumbs exceeding 1MB event payload size */
    const MAX_ALLOWED_STRING_LENGTH = 1024;
  
    const BREADCRUMB_INTEGRATION_ID = 'Breadcrumbs';
  
    /**
     * Default Breadcrumbs instrumentations
     * TODO: Deprecated - with v6, this will be renamed to `Instrument`
     */
    class Breadcrumbs  {
      /**
       * @inheritDoc
       */
       static __initStatic() {this.id = BREADCRUMB_INTEGRATION_ID;}
  
      /**
       * @inheritDoc
       */
       __init() {this.name = Breadcrumbs.id;}
  
      /**
       * Options of the breadcrumbs integration.
       */
      // This field is public, because we use it in the browser client to check if the `sentry` option is enabled.
  
      /**
       * @inheritDoc
       */
       constructor(options) {Breadcrumbs.prototype.__init.call(this);
        this.options = {
          console: true,
          dom: true,
          fetch: true,
          history: true,
          sentry: true,
          xhr: true,
          ...options,
        };
      }
  
      /**
       * Instrument browser built-ins w/ breadcrumb capturing
       *  - Console API
       *  - DOM API (click/typing)
       *  - XMLHttpRequest API
       *  - Fetch API
       *  - History API
       */
       setupOnce() {
        if (this.options.console) {
          addInstrumentationHandler('console', _consoleBreadcrumb);
        }
        if (this.options.dom) {
          addInstrumentationHandler('dom', _domBreadcrumb(this.options.dom));
        }
        if (this.options.xhr) {
          addInstrumentationHandler('xhr', _xhrBreadcrumb);
        }
        if (this.options.fetch) {
          addInstrumentationHandler('fetch', _fetchBreadcrumb);
        }
        if (this.options.history) {
          addInstrumentationHandler('history', _historyBreadcrumb);
        }
      }
  
      /**
       * Adds a breadcrumb for Sentry events or transactions if this option is enabled.
       */
       addSentryBreadcrumb(event) {
        if (this.options.sentry) {
          getCurrentHub().addBreadcrumb(
            {
              category: `sentry.${event.type === 'transaction' ? 'transaction' : 'event'}`,
              event_id: event.event_id,
              level: event.level,
              message: getEventDescription(event),
            },
            {
              event,
            },
          );
        }
      }
    } Breadcrumbs.__initStatic();
  
    /**
     * A HOC that creaes a function that creates breadcrumbs from DOM API calls.
     * This is a HOC so that we get access to dom options in the closure.
     */
    function _domBreadcrumb(dom) {
      function _innerDomBreadcrumb(handlerData) {
        let target;
        let keyAttrs = typeof dom === 'object' ? dom.serializeAttribute : undefined;
  
        let maxStringLength =
          typeof dom === 'object' && typeof dom.maxStringLength === 'number' ? dom.maxStringLength : undefined;
        if (maxStringLength && maxStringLength > MAX_ALLOWED_STRING_LENGTH) {
          logger.warn(
              `\`dom.maxStringLength\` cannot exceed ${MAX_ALLOWED_STRING_LENGTH}, but a value of ${maxStringLength} was configured. Sentry will use ${MAX_ALLOWED_STRING_LENGTH} instead.`,
            );
          maxStringLength = MAX_ALLOWED_STRING_LENGTH;
        }
  
        if (typeof keyAttrs === 'string') {
          keyAttrs = [keyAttrs];
        }
  
        // Accessing event.target can throw (see getsentry/raven-js#838, #768)
        try {
          const event = handlerData.event ;
          target = _isEvent(event)
            ? htmlTreeAsString(event.target, { keyAttrs, maxStringLength })
            : htmlTreeAsString(event, { keyAttrs, maxStringLength });
        } catch (e) {
          target = '<unknown>';
        }
  
        if (target.length === 0) {
          return;
        }
  
        getCurrentHub().addBreadcrumb(
          {
            category: `ui.${handlerData.name}`,
            message: target,
          },
          {
            event: handlerData.event,
            name: handlerData.name,
            global: handlerData.global,
          },
        );
      }
  
      return _innerDomBreadcrumb;
    }
  
    /**
     * Creates breadcrumbs from console API calls
     */
    function _consoleBreadcrumb(handlerData) {
      // This is a hack to fix a Vue3-specific bug that causes an infinite loop of
      // console warnings. This happens when a Vue template is rendered with
      // an undeclared variable, which we try to stringify, ultimately causing
      // Vue to issue another warning which repeats indefinitely.
      // see: https://github.com/getsentry/sentry-javascript/pull/6010
      // see: https://github.com/getsentry/sentry-javascript/issues/5916
      for (let i = 0; i < handlerData.args.length; i++) {
        if (handlerData.args[i] === 'ref=Ref<') {
          handlerData.args[i + 1] = 'viewRef';
          break;
        }
      }
      const breadcrumb = {
        category: 'console',
        data: {
          arguments: handlerData.args,
          logger: 'console',
        },
        level: severityLevelFromString(handlerData.level),
        message: safeJoin(handlerData.args, ' '),
      };
  
      if (handlerData.level === 'assert') {
        if (handlerData.args[0] === false) {
          breadcrumb.message = `Assertion failed: ${safeJoin(handlerData.args.slice(1), ' ') || 'console.assert'}`;
          breadcrumb.data.arguments = handlerData.args.slice(1);
        } else {
          // Don't capture a breadcrumb for passed assertions
          return;
        }
      }
  
      getCurrentHub().addBreadcrumb(breadcrumb, {
        input: handlerData.args,
        level: handlerData.level,
      });
    }
  
    /**
     * Creates breadcrumbs from XHR API calls
     */
    function _xhrBreadcrumb(handlerData) {
      const { startTimestamp, endTimestamp } = handlerData;
  
      const sentryXhrData = handlerData.xhr[SENTRY_XHR_DATA_KEY];
  
      // We only capture complete, non-sentry requests
      if (!startTimestamp || !endTimestamp || !sentryXhrData) {
        return;
      }
  
      const { method, url, status_code, body } = sentryXhrData;
  
      const data = {
        method,
        url,
        status_code,
      };
  
      const hint = {
        xhr: handlerData.xhr,
        input: body,
        startTimestamp,
        endTimestamp,
      };
  
      getCurrentHub().addBreadcrumb(
        {
          category: 'xhr',
          data,
          type: 'http',
        },
        hint,
      );
    }
  
    /**
     * Creates breadcrumbs from fetch API calls
     */
    function _fetchBreadcrumb(handlerData) {
      const { startTimestamp, endTimestamp } = handlerData;
  
      // We only capture complete fetch requests
      if (!endTimestamp) {
        return;
      }
  
      if (handlerData.fetchData.url.match(/sentry_key/) && handlerData.fetchData.method === 'POST') {
        // We will not create breadcrumbs for fetch requests that contain `sentry_key` (internal sentry requests)
        return;
      }
  
      if (handlerData.error) {
        const data = handlerData.fetchData;
        const hint = {
          data: handlerData.error,
          input: handlerData.args,
          startTimestamp,
          endTimestamp,
        };
  
        getCurrentHub().addBreadcrumb(
          {
            category: 'fetch',
            data,
            level: 'error',
            type: 'http',
          },
          hint,
        );
      } else {
        const data = {
          ...handlerData.fetchData,
          status_code: handlerData.response && handlerData.response.status,
        };
        const hint = {
          input: handlerData.args,
          response: handlerData.response,
          startTimestamp,
          endTimestamp,
        };
        getCurrentHub().addBreadcrumb(
          {
            category: 'fetch',
            data,
            type: 'http',
          },
          hint,
        );
      }
    }
  
    /**
     * Creates breadcrumbs from history API calls
     */
    function _historyBreadcrumb(handlerData) {
      let from = handlerData.from;
      let to = handlerData.to;
      const parsedLoc = parseUrl(WINDOW.location.href);
      let parsedFrom = parseUrl(from);
      const parsedTo = parseUrl(to);
  
      // Initial pushState doesn't provide `from` information
      if (!parsedFrom.path) {
        parsedFrom = parsedLoc;
      }
  
      // Use only the path component of the URL if the URL matches the current
      // document (almost all the time when using pushState)
      if (parsedLoc.protocol === parsedTo.protocol && parsedLoc.host === parsedTo.host) {
        to = parsedTo.relative;
      }
      if (parsedLoc.protocol === parsedFrom.protocol && parsedLoc.host === parsedFrom.host) {
        from = parsedFrom.relative;
      }
  
      getCurrentHub().addBreadcrumb({
        category: 'navigation',
        data: {
          from,
          to,
        },
      });
    }
  
    function _isEvent(event) {
      return event && !!(event ).target;
    }
  
    /**
     * Creates an envelope from a user feedback.
     */
    function createUserFeedbackEnvelope(
      feedback,
      {
        metadata,
        tunnel,
        dsn,
      }
  
    ,
    ) {
      const headers = {
        event_id: feedback.event_id,
        sent_at: new Date().toISOString(),
        ...(metadata &&
          metadata.sdk && {
            sdk: {
              name: metadata.sdk.name,
              version: metadata.sdk.version,
            },
          }),
        ...(!!tunnel && !!dsn && { dsn: dsnToString(dsn) }),
      };
      const item = createUserFeedbackEnvelopeItem(feedback);
  
      return createEnvelope(headers, [item]);
    }
  
    function createUserFeedbackEnvelopeItem(feedback) {
      const feedbackHeaders = {
        type: 'user_report',
      };
      return [feedbackHeaders, feedback];
    }
  
    /**
     * Configuration options for the Sentry Browser SDK.
     * @see @sentry/types Options for more information.
     */
  
    /**
     * The Sentry Browser SDK Client.
     *
     * @see BrowserOptions for documentation on configuration options.
     * @see SentryClient for usage documentation.
     */
    class BrowserClient extends BaseClient {
      /**
       * Creates a new Browser SDK instance.
       *
       * @param options Configuration options for this SDK.
       */
       constructor(options) {
        const sdkSource = WINDOW.SENTRY_SDK_SOURCE || getSDKSource();
  
        options._metadata = options._metadata || {};
        options._metadata.sdk = options._metadata.sdk || {
          name: 'sentry.javascript.browser',
          packages: [
            {
              name: `${sdkSource}:@sentry/browser`,
              version: SDK_VERSION,
            },
          ],
          version: SDK_VERSION,
        };
  
        super(options);
  
        if (options.sendClientReports && WINDOW.document) {
          WINDOW.document.addEventListener('visibilitychange', () => {
            if (WINDOW.document.visibilityState === 'hidden') {
              this._flushOutcomes();
            }
          });
        }
      }
  
      /**
       * @inheritDoc
       */
       eventFromException(exception, hint) {
        return eventFromException(this._options.stackParser, exception, hint, this._options.attachStacktrace);
      }
  
      /**
       * @inheritDoc
       */
       eventFromMessage(
        message,
        // eslint-disable-next-line deprecation/deprecation
        level = 'info',
        hint,
      ) {
        return eventFromMessage(this._options.stackParser, message, level, hint, this._options.attachStacktrace);
      }
  
      /**
       * @inheritDoc
       */
       sendEvent(event, hint) {
        // We only want to add the sentry event breadcrumb when the user has the breadcrumb integration installed and
        // activated its `sentry` option.
        // We also do not want to use the `Breadcrumbs` class here directly, because we do not want it to be included in
        // bundles, if it is not used by the SDK.
        // This all sadly is a bit ugly, but we currently don't have a "pre-send" hook on the integrations so we do it this
        // way for now.
        const breadcrumbIntegration = this.getIntegrationById(BREADCRUMB_INTEGRATION_ID) ;
        // We check for definedness of `addSentryBreadcrumb` in case users provided their own integration with id
        // "Breadcrumbs" that does not have this function.
        if (breadcrumbIntegration && breadcrumbIntegration.addSentryBreadcrumb) {
          breadcrumbIntegration.addSentryBreadcrumb(event);
        }
  
        super.sendEvent(event, hint);
      }
  
      /**
       * Sends user feedback to Sentry.
       */
       captureUserFeedback(feedback) {
        if (!this._isEnabled()) {
          logger.warn('SDK not enabled, will not capture user feedback.');
          return;
        }
  
        const envelope = createUserFeedbackEnvelope(feedback, {
          metadata: this.getSdkMetadata(),
          dsn: this.getDsn(),
          tunnel: this.getOptions().tunnel,
        });
        void this._sendEnvelope(envelope);
      }
  
      /**
       * @inheritDoc
       */
       _prepareEvent(event, hint, scope) {
        event.platform = event.platform || 'javascript';
        return super._prepareEvent(event, hint, scope);
      }
  
      /**
       * Sends client reports as an envelope.
       */
       _flushOutcomes() {
        const outcomes = this._clearOutcomes();
  
        if (outcomes.length === 0) {
          logger.log('No outcomes to send');
          return;
        }
  
        if (!this._dsn) {
          logger.log('No dsn provided, will not send outcomes');
          return;
        }
  
        logger.log('Sending outcomes:', outcomes);
  
        const envelope = createClientReportEnvelope(outcomes, this._options.tunnel && dsnToString(this._dsn));
        void this._sendEnvelope(envelope);
      }
    }
  
    let cachedFetchImpl = undefined;
  
    /**
     * A special usecase for incorrectly wrapped Fetch APIs in conjunction with ad-blockers.
     * Whenever someone wraps the Fetch API and returns the wrong promise chain,
     * this chain becomes orphaned and there is no possible way to capture it's rejections
     * other than allowing it bubble up to this very handler. eg.
     *
     * const f = window.fetch;
     * window.fetch = function () {
     *   const p = f.apply(this, arguments);
     *
     *   p.then(function() {
     *     console.log('hi.');
     *   });
     *
     *   return p;
     * }
     *
     * `p.then(function () { ... })` is producing a completely separate promise chain,
     * however, what's returned is `p` - the result of original `fetch` call.
     *
     * This mean, that whenever we use the Fetch API to send our own requests, _and_
     * some ad-blocker blocks it, this orphaned chain will _always_ reject,
     * effectively causing another event to be captured.
     * This makes a whole process become an infinite loop, which we need to somehow
     * deal with, and break it in one way or another.
     *
     * To deal with this issue, we are making sure that we _always_ use the real
     * browser Fetch API, instead of relying on what `window.fetch` exposes.
     * The only downside to this would be missing our own requests as breadcrumbs,
     * but because we are already not doing this, it should be just fine.
     *
     * Possible failed fetch error messages per-browser:
     *
     * Chrome:  Failed to fetch
     * Edge:    Failed to Fetch
     * Firefox: NetworkError when attempting to fetch resource
     * Safari:  resource blocked by content blocker
     */
    function getNativeFetchImplementation() {
      if (cachedFetchImpl) {
        return cachedFetchImpl;
      }
  
      /* eslint-disable @typescript-eslint/unbound-method */
  
      // Fast path to avoid DOM I/O
      if (isNativeFetch(WINDOW.fetch)) {
        return (cachedFetchImpl = WINDOW.fetch.bind(WINDOW));
      }
  
      const document = WINDOW.document;
      let fetchImpl = WINDOW.fetch;
      // eslint-disable-next-line deprecation/deprecation
      if (document && typeof document.createElement === 'function') {
        try {
          const sandbox = document.createElement('iframe');
          sandbox.hidden = true;
          document.head.appendChild(sandbox);
          const contentWindow = sandbox.contentWindow;
          if (contentWindow && contentWindow.fetch) {
            fetchImpl = contentWindow.fetch;
          }
          document.head.removeChild(sandbox);
        } catch (e) {
          logger.warn('Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ', e);
        }
      }
  
      return (cachedFetchImpl = fetchImpl.bind(WINDOW));
      /* eslint-enable @typescript-eslint/unbound-method */
    }
  
    /** Clears cached fetch impl */
    function clearCachedFetchImplementation() {
      cachedFetchImpl = undefined;
    }
  
    /**
     * Creates a Transport that uses the Fetch API to send events to Sentry.
     */
    function makeFetchTransport(
      options,
      nativeFetch = getNativeFetchImplementation(),
    ) {
      let pendingBodySize = 0;
      let pendingCount = 0;
  
      function makeRequest(request) {
        const requestSize = request.body.length;
        pendingBodySize += requestSize;
        pendingCount++;
  
        const requestOptions = {
          body: request.body,
          method: 'POST',
          referrerPolicy: 'origin',
          headers: options.headers,
          // Outgoing requests are usually cancelled when navigating to a different page, causing a "TypeError: Failed to
          // fetch" error and sending a "network_error" client-outcome - in Chrome, the request status shows "(cancelled)".
          // The `keepalive` flag keeps outgoing requests alive, even when switching pages. We want this since we're
          // frequently sending events right before the user is switching pages (eg. whenfinishing navigation transactions).
          // Gotchas:
          // - `keepalive` isn't supported by Firefox
          // - As per spec (https://fetch.spec.whatwg.org/#http-network-or-cache-fetch):
          //   If the sum of contentLength and inflightKeepaliveBytes is greater than 64 kibibytes, then return a network error.
          //   We will therefore only activate the flag when we're below that limit.
          // There is also a limit of requests that can be open at the same time, so we also limit this to 15
          // See https://github.com/getsentry/sentry-javascript/pull/7553 for details
          keepalive: pendingBodySize <= 60000 && pendingCount < 15,
          ...options.fetchOptions,
        };
  
        try {
          return nativeFetch(options.url, requestOptions).then(response => {
            pendingBodySize -= requestSize;
            pendingCount--;
            return {
              statusCode: response.status,
              headers: {
                'x-sentry-rate-limits': response.headers.get('X-Sentry-Rate-Limits'),
                'retry-after': response.headers.get('Retry-After'),
              },
            };
          });
        } catch (e) {
          clearCachedFetchImplementation();
          pendingBodySize -= requestSize;
          pendingCount--;
          return rejectedSyncPromise(e);
        }
      }
  
      return createTransport(options, makeRequest);
    }
  
    /**
     * The DONE ready state for XmlHttpRequest
     *
     * Defining it here as a constant b/c XMLHttpRequest.DONE is not always defined
     * (e.g. during testing, it is `undefined`)
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState}
     */
    const XHR_READYSTATE_DONE = 4;
  
    /**
     * Creates a Transport that uses the XMLHttpRequest API to send events to Sentry.
     */
    function makeXHRTransport(options) {
      function makeRequest(request) {
        return new SyncPromise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
  
          xhr.onerror = reject;
  
          xhr.onreadystatechange = () => {
            if (xhr.readyState === XHR_READYSTATE_DONE) {
              resolve({
                statusCode: xhr.status,
                headers: {
                  'x-sentry-rate-limits': xhr.getResponseHeader('X-Sentry-Rate-Limits'),
                  'retry-after': xhr.getResponseHeader('Retry-After'),
                },
              });
            }
          };
  
          xhr.open('POST', options.url);
  
          for (const header in options.headers) {
            if (Object.prototype.hasOwnProperty.call(options.headers, header)) {
              xhr.setRequestHeader(header, options.headers[header]);
            }
          }
  
          xhr.send(request.body);
        });
      }
  
      return createTransport(options, makeRequest);
    }
  
    // global reference to slice
    const UNKNOWN_FUNCTION = '?';
  
    const OPERA10_PRIORITY = 10;
    const OPERA11_PRIORITY = 20;
    const CHROME_PRIORITY = 30;
    const WINJS_PRIORITY = 40;
    const GECKO_PRIORITY = 50;
  
    function createFrame(filename, func, lineno, colno) {
      const frame = {
        filename,
        function: func,
        in_app: true, // All browser frames are considered in_app
      };
  
      if (lineno !== undefined) {
        frame.lineno = lineno;
      }
  
      if (colno !== undefined) {
        frame.colno = colno;
      }
  
      return frame;
    }
  
    // Chromium based browsers: Chrome, Brave, new Opera, new Edge
    const chromeRegex =
      /^\s*at (?:(.+?\)(?: \[.+\])?|.*?) ?\((?:address at )?)?(?:async )?((?:<anonymous>|[-a-z]+:|.*bundle|\/)?.*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;
    const chromeEvalRegex = /\((\S*)(?::(\d+))(?::(\d+))\)/;
  
    const chrome = line => {
      const parts = chromeRegex.exec(line);
  
      if (parts) {
        const isEval = parts[2] && parts[2].indexOf('eval') === 0; // start of line
  
        if (isEval) {
          const subMatch = chromeEvalRegex.exec(parts[2]);
  
          if (subMatch) {
            // throw out eval line/column and use top-most line/column number
            parts[2] = subMatch[1]; // url
            parts[3] = subMatch[2]; // line
            parts[4] = subMatch[3]; // column
          }
        }
  
        // Kamil: One more hack won't hurt us right? Understanding and adding more rules on top of these regexps right now
        // would be way too time consuming. (TODO: Rewrite whole RegExp to be more readable)
        const [func, filename] = extractSafariExtensionDetails(parts[1] || UNKNOWN_FUNCTION, parts[2]);
  
        return createFrame(filename, func, parts[3] ? +parts[3] : undefined, parts[4] ? +parts[4] : undefined);
      }
  
      return;
    };
  
    const chromeStackLineParser = [CHROME_PRIORITY, chrome];
  
    // gecko regex: `(?:bundle|\d+\.js)`: `bundle` is for react native, `\d+\.js` also but specifically for ram bundles because it
    // generates filenames without a prefix like `file://` the filenames in the stacktrace are just 42.js
    // We need this specific case for now because we want no other regex to match.
    const geckoREgex =
      /^\s*(.*?)(?:\((.*?)\))?(?:^|@)?((?:[-a-z]+)?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js)|\/[\w\-. /=]+)(?::(\d+))?(?::(\d+))?\s*$/i;
    const geckoEvalRegex = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;
  
    const gecko = line => {
      const parts = geckoREgex.exec(line);
  
      if (parts) {
        const isEval = parts[3] && parts[3].indexOf(' > eval') > -1;
        if (isEval) {
          const subMatch = geckoEvalRegex.exec(parts[3]);
  
          if (subMatch) {
            // throw out eval line/column and use top-most line number
            parts[1] = parts[1] || 'eval';
            parts[3] = subMatch[1];
            parts[4] = subMatch[2];
            parts[5] = ''; // no column when eval
          }
        }
  
        let filename = parts[3];
        let func = parts[1] || UNKNOWN_FUNCTION;
        [func, filename] = extractSafariExtensionDetails(func, filename);
  
        return createFrame(filename, func, parts[4] ? +parts[4] : undefined, parts[5] ? +parts[5] : undefined);
      }
  
      return;
    };
  
    const geckoStackLineParser = [GECKO_PRIORITY, gecko];
  
    const winjsRegex = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:[-a-z]+):.*?):(\d+)(?::(\d+))?\)?\s*$/i;
  
    const winjs = line => {
      const parts = winjsRegex.exec(line);
  
      return parts
        ? createFrame(parts[2], parts[1] || UNKNOWN_FUNCTION, +parts[3], parts[4] ? +parts[4] : undefined)
        : undefined;
    };
  
    const winjsStackLineParser = [WINJS_PRIORITY, winjs];
  
    const opera10Regex = / line (\d+).*script (?:in )?(\S+)(?:: in function (\S+))?$/i;
  
    const opera10 = line => {
      const parts = opera10Regex.exec(line);
      return parts ? createFrame(parts[2], parts[3] || UNKNOWN_FUNCTION, +parts[1]) : undefined;
    };
  
    const opera10StackLineParser = [OPERA10_PRIORITY, opera10];
  
    const opera11Regex =
      / line (\d+), column (\d+)\s*(?:in (?:<anonymous function: ([^>]+)>|([^)]+))\(.*\))? in (.*):\s*$/i;
  
    const opera11 = line => {
      const parts = opera11Regex.exec(line);
      return parts ? createFrame(parts[5], parts[3] || parts[4] || UNKNOWN_FUNCTION, +parts[1], +parts[2]) : undefined;
    };
  
    const opera11StackLineParser = [OPERA11_PRIORITY, opera11];
  
    const defaultStackLineParsers = [chromeStackLineParser, geckoStackLineParser, winjsStackLineParser];
  
    const defaultStackParser = createStackParser(...defaultStackLineParsers);
  
    /**
     * Safari web extensions, starting version unknown, can produce "frames-only" stacktraces.
     * What it means, is that instead of format like:
     *
     * Error: wat
     *   at function@url:row:col
     *   at function@url:row:col
     *   at function@url:row:col
     *
     * it produces something like:
     *
     *   function@url:row:col
     *   function@url:row:col
     *   function@url:row:col
     *
     * Because of that, it won't be captured by `chrome` RegExp and will fall into `Gecko` branch.
     * This function is extracted so that we can use it in both places without duplicating the logic.
     * Unfortunately "just" changing RegExp is too complicated now and making it pass all tests
     * and fix this case seems like an impossible, or at least way too time-consuming task.
     */
    const extractSafariExtensionDetails = (func, filename) => {
      const isSafariExtension = func.indexOf('safari-extension') !== -1;
      const isSafariWebExtension = func.indexOf('safari-web-extension') !== -1;
  
      return isSafariExtension || isSafariWebExtension
        ? [
            func.indexOf('@') !== -1 ? func.split('@')[0] : UNKNOWN_FUNCTION,
            isSafariExtension ? `safari-extension:${filename}` : `safari-web-extension:${filename}`,
          ]
        : [func, filename];
    };
  
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
  
    /** Global handlers */
    class GlobalHandlers  {
      /**
       * @inheritDoc
       */
       static __initStatic() {this.id = 'GlobalHandlers';}
  
      /**
       * @inheritDoc
       */
       __init() {this.name = GlobalHandlers.id;}
  
      /** JSDoc */
  
      /**
       * Stores references functions to installing handlers. Will set to undefined
       * after they have been run so that they are not used twice.
       */
       __init2() {this._installFunc = {
        onerror: _installGlobalOnErrorHandler,
        onunhandledrejection: _installGlobalOnUnhandledRejectionHandler,
      };}
  
      /** JSDoc */
       constructor(options) {GlobalHandlers.prototype.__init.call(this);GlobalHandlers.prototype.__init2.call(this);
        this._options = {
          onerror: true,
          onunhandledrejection: true,
          ...options,
        };
      }
      /**
       * @inheritDoc
       */
       setupOnce() {
        Error.stackTraceLimit = 50;
        const options = this._options;
  
        // We can disable guard-for-in as we construct the options object above + do checks against
        // `this._installFunc` for the property.
        // eslint-disable-next-line guard-for-in
        for (const key in options) {
          const installFunc = this._installFunc[key ];
          if (installFunc && options[key ]) {
            globalHandlerLog(key);
            installFunc();
            this._installFunc[key ] = undefined;
          }
        }
      }
    } GlobalHandlers.__initStatic();
  
    /** JSDoc */
    function _installGlobalOnErrorHandler() {
      addInstrumentationHandler(
        'error',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (data) => {
          const [hub, stackParser, attachStacktrace] = getHubAndOptions();
          if (!hub.getIntegration(GlobalHandlers)) {
            return;
          }
          const { msg, url, line, column, error } = data;
          if (shouldIgnoreOnError() || (error && error.__sentry_own_request__)) {
            return;
          }
  
          const event =
            error === undefined && isString(msg)
              ? _eventFromIncompleteOnError(msg, url, line, column)
              : _enhanceEventWithInitialFrame(
                  eventFromUnknownInput(stackParser, error || msg, undefined, attachStacktrace, false),
                  url,
                  line,
                  column,
                );
  
          event.level = 'error';
  
          addMechanismAndCapture(hub, error, event, 'onerror');
        },
      );
    }
  
    /** JSDoc */
    function _installGlobalOnUnhandledRejectionHandler() {
      addInstrumentationHandler(
        'unhandledrejection',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (e) => {
          const [hub, stackParser, attachStacktrace] = getHubAndOptions();
          if (!hub.getIntegration(GlobalHandlers)) {
            return;
          }
          let error = e;
  
          // dig the object of the rejection out of known event types
          try {
            // PromiseRejectionEvents store the object of the rejection under 'reason'
            // see https://developer.mozilla.org/en-US/docs/Web/API/PromiseRejectionEvent
            if ('reason' in e) {
              error = e.reason;
            }
            // something, somewhere, (likely a browser extension) effectively casts PromiseRejectionEvents
            // to CustomEvents, moving the `promise` and `reason` attributes of the PRE into
            // the CustomEvent's `detail` attribute, since they're not part of CustomEvent's spec
            // see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent and
            // https://github.com/getsentry/sentry-javascript/issues/2380
            else if ('detail' in e && 'reason' in e.detail) {
              error = e.detail.reason;
            }
          } catch (_oO) {
            // no-empty
          }
  
          if (shouldIgnoreOnError() || (error && error.__sentry_own_request__)) {
            return true;
          }
  
          const event = isPrimitive(error)
            ? _eventFromRejectionWithPrimitive(error)
            : eventFromUnknownInput(stackParser, error, undefined, attachStacktrace, true);
  
          event.level = 'error';
  
          addMechanismAndCapture(hub, error, event, 'onunhandledrejection');
          return;
        },
      );
    }
  
    /**
     * Create an event from a promise rejection where the `reason` is a primitive.
     *
     * @param reason: The `reason` property of the promise rejection
     * @returns An Event object with an appropriate `exception` value
     */
    function _eventFromRejectionWithPrimitive(reason) {
      return {
        exception: {
          values: [
            {
              type: 'UnhandledRejection',
              // String() is needed because the Primitive type includes symbols (which can't be automatically stringified)
              value: `Non-Error promise rejection captured with value: ${String(reason)}`,
            },
          ],
        },
      };
    }
  
    /**
     * This function creates a stack from an old, error-less onerror handler.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function _eventFromIncompleteOnError(msg, url, line, column) {
      const ERROR_TYPES_RE =
        /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/i;
  
      // If 'message' is ErrorEvent, get real message from inside
      let message = isErrorEvent$1(msg) ? msg.message : msg;
      let name = 'Error';
  
      const groups = message.match(ERROR_TYPES_RE);
      if (groups) {
        name = groups[1];
        message = groups[2];
      }
  
      const event = {
        exception: {
          values: [
            {
              type: name,
              value: message,
            },
          ],
        },
      };
  
      return _enhanceEventWithInitialFrame(event, url, line, column);
    }
  
    /** JSDoc */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function _enhanceEventWithInitialFrame(event, url, line, column) {
      // event.exception
      const e = (event.exception = event.exception || {});
      // event.exception.values
      const ev = (e.values = e.values || []);
      // event.exception.values[0]
      const ev0 = (ev[0] = ev[0] || {});
      // event.exception.values[0].stacktrace
      const ev0s = (ev0.stacktrace = ev0.stacktrace || {});
      // event.exception.values[0].stacktrace.frames
      const ev0sf = (ev0s.frames = ev0s.frames || []);
  
      const colno = isNaN(parseInt(column, 10)) ? undefined : column;
      const lineno = isNaN(parseInt(line, 10)) ? undefined : line;
      const filename = isString(url) && url.length > 0 ? url : getLocationHref();
  
      // event.exception.values[0].stacktrace.frames
      if (ev0sf.length === 0) {
        ev0sf.push({
          colno,
          filename,
          function: '?',
          in_app: true,
          lineno,
        });
      }
  
      return event;
    }
  
    function globalHandlerLog(type) {
      logger.log(`Global Handler attached: ${type}`);
    }
  
    function addMechanismAndCapture(hub, error, event, type) {
      addExceptionMechanism(event, {
        handled: false,
        type,
      });
      hub.captureEvent(event, {
        originalException: error,
      });
    }
  
    function getHubAndOptions() {
      const hub = getCurrentHub();
      const client = hub.getClient();
      const options = (client && client.getOptions()) || {
        stackParser: () => [],
        attachStacktrace: false,
      };
      return [hub, options.stackParser, options.attachStacktrace];
    }
  
    const DEFAULT_EVENT_TARGET = [
      'EventTarget',
      'Window',
      'Node',
      'ApplicationCache',
      'AudioTrackList',
      'ChannelMergerNode',
      'CryptoOperation',
      'EventSource',
      'FileReader',
      'HTMLUnknownElement',
      'IDBDatabase',
      'IDBRequest',
      'IDBTransaction',
      'KeyOperation',
      'MediaController',
      'MessagePort',
      'ModalWindow',
      'Notification',
      'SVGElementInstance',
      'Screen',
      'TextTrack',
      'TextTrackCue',
      'TextTrackList',
      'WebSocket',
      'WebSocketWorker',
      'Worker',
      'XMLHttpRequest',
      'XMLHttpRequestEventTarget',
      'XMLHttpRequestUpload',
    ];
  
    /** Wrap timer functions and event targets to catch errors and provide better meta data */
    class TryCatch  {
      /**
       * @inheritDoc
       */
       static __initStatic() {this.id = 'TryCatch';}
  
      /**
       * @inheritDoc
       */
       __init() {this.name = TryCatch.id;}
  
      /** JSDoc */
  
      /**
       * @inheritDoc
       */
       constructor(options) {TryCatch.prototype.__init.call(this);
        this._options = {
          XMLHttpRequest: true,
          eventTarget: true,
          requestAnimationFrame: true,
          setInterval: true,
          setTimeout: true,
          ...options,
        };
      }
  
      /**
       * Wrap timer functions and event targets to catch errors
       * and provide better metadata.
       */
       setupOnce() {
        if (this._options.setTimeout) {
          fill(WINDOW, 'setTimeout', _wrapTimeFunction);
        }
  
        if (this._options.setInterval) {
          fill(WINDOW, 'setInterval', _wrapTimeFunction);
        }
  
        if (this._options.requestAnimationFrame) {
          fill(WINDOW, 'requestAnimationFrame', _wrapRAF);
        }
  
        if (this._options.XMLHttpRequest && 'XMLHttpRequest' in WINDOW) {
          fill(XMLHttpRequest.prototype, 'send', _wrapXHR);
        }
  
        const eventTargetOption = this._options.eventTarget;
        if (eventTargetOption) {
          const eventTarget = Array.isArray(eventTargetOption) ? eventTargetOption : DEFAULT_EVENT_TARGET;
          eventTarget.forEach(_wrapEventTarget);
        }
      }
    } TryCatch.__initStatic();
  
    /** JSDoc */
    function _wrapTimeFunction(original) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return function ( ...args) {
        const originalCallback = args[0];
        args[0] = wrap$1(originalCallback, {
          mechanism: {
            data: { function: getFunctionName(original) },
            handled: true,
            type: 'instrument',
          },
        });
        return original.apply(this, args);
      };
    }
  
    /** JSDoc */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function _wrapRAF(original) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return function ( callback) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return original.apply(this, [
          wrap$1(callback, {
            mechanism: {
              data: {
                function: 'requestAnimationFrame',
                handler: getFunctionName(original),
              },
              handled: true,
              type: 'instrument',
            },
          }),
        ]);
      };
    }
  
    /** JSDoc */
    function _wrapXHR(originalSend) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return function ( ...args) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const xhr = this;
        const xmlHttpRequestProps = ['onload', 'onerror', 'onprogress', 'onreadystatechange'];
  
        xmlHttpRequestProps.forEach(prop => {
          if (prop in xhr && typeof xhr[prop] === 'function') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            fill(xhr, prop, function (original) {
              const wrapOptions = {
                mechanism: {
                  data: {
                    function: prop,
                    handler: getFunctionName(original),
                  },
                  handled: true,
                  type: 'instrument',
                },
              };
  
              // If Instrument integration has been called before TryCatch, get the name of original function
              const originalFunction = getOriginalFunction(original);
              if (originalFunction) {
                wrapOptions.mechanism.data.handler = getFunctionName(originalFunction);
              }
  
              // Otherwise wrap directly
              return wrap$1(original, wrapOptions);
            });
          }
        });
  
        return originalSend.apply(this, args);
      };
    }
  
    /** JSDoc */
    function _wrapEventTarget(target) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const globalObject = WINDOW ;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const proto = globalObject[target] && globalObject[target].prototype;
  
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-prototype-builtins
      if (!proto || !proto.hasOwnProperty || !proto.hasOwnProperty('addEventListener')) {
        return;
      }
  
      fill(proto, 'addEventListener', function (original)
  
     {
        return function (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
  
          eventName,
          fn,
          options,
        ) {
          try {
            if (typeof fn.handleEvent === 'function') {
              // ESlint disable explanation:
              //  First, it is generally safe to call `wrap` with an unbound function. Furthermore, using `.bind()` would
              //  introduce a bug here, because bind returns a new function that doesn't have our
              //  flags(like __sentry_original__) attached. `wrap` checks for those flags to avoid unnecessary wrapping.
              //  Without those flags, every call to addEventListener wraps the function again, causing a memory leak.
              // eslint-disable-next-line @typescript-eslint/unbound-method
              fn.handleEvent = wrap$1(fn.handleEvent, {
                mechanism: {
                  data: {
                    function: 'handleEvent',
                    handler: getFunctionName(fn),
                    target,
                  },
                  handled: true,
                  type: 'instrument',
                },
              });
            }
          } catch (err) {
            // can sometimes get 'Permission denied to access property "handle Event'
          }
  
          return original.apply(this, [
            eventName,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            wrap$1(fn , {
              mechanism: {
                data: {
                  function: 'addEventListener',
                  handler: getFunctionName(fn),
                  target,
                },
                handled: true,
                type: 'instrument',
              },
            }),
            options,
          ]);
        };
      });
  
      fill(
        proto,
        'removeEventListener',
        function (
          originalRemoveEventListener,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) {
          return function (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
  
            eventName,
            fn,
            options,
          ) {
            /**
             * There are 2 possible scenarios here:
             *
             * 1. Someone passes a callback, which was attached prior to Sentry initialization, or by using unmodified
             * method, eg. `document.addEventListener.call(el, name, handler). In this case, we treat this function
             * as a pass-through, and call original `removeEventListener` with it.
             *
             * 2. Someone passes a callback, which was attached after Sentry was initialized, which means that it was using
             * our wrapped version of `addEventListener`, which internally calls `wrap` helper.
             * This helper "wraps" whole callback inside a try/catch statement, and attached appropriate metadata to it,
             * in order for us to make a distinction between wrapped/non-wrapped functions possible.
             * If a function was wrapped, it has additional property of `__sentry_wrapped__`, holding the handler.
             *
             * When someone adds a handler prior to initialization, and then do it again, but after,
             * then we have to detach both of them. Otherwise, if we'd detach only wrapped one, it'd be impossible
             * to get rid of the initial handler and it'd stick there forever.
             */
            const wrappedEventHandler = fn ;
            try {
              const originalEventHandler = wrappedEventHandler && wrappedEventHandler.__sentry_wrapped__;
              if (originalEventHandler) {
                originalRemoveEventListener.call(this, eventName, originalEventHandler, options);
              }
            } catch (e) {
              // ignore, accessing __sentry_wrapped__ will throw in some Selenium environments
            }
            return originalRemoveEventListener.call(this, eventName, wrappedEventHandler, options);
          };
        },
      );
    }
  
    const DEFAULT_KEY = 'cause';
    const DEFAULT_LIMIT = 5;
  
    /** Adds SDK info to an event. */
    class LinkedErrors  {
      /**
       * @inheritDoc
       */
       static __initStatic() {this.id = 'LinkedErrors';}
  
      /**
       * @inheritDoc
       */
        __init() {this.name = LinkedErrors.id;}
  
      /**
       * @inheritDoc
       */
  
      /**
       * @inheritDoc
       */
  
      /**
       * @inheritDoc
       */
       constructor(options = {}) {LinkedErrors.prototype.__init.call(this);
        this._key = options.key || DEFAULT_KEY;
        this._limit = options.limit || DEFAULT_LIMIT;
      }
  
      /**
       * @inheritDoc
       */
       setupOnce() {
        const client = getCurrentHub().getClient();
        if (!client) {
          return;
        }
        addGlobalEventProcessor((event, hint) => {
          const self = getCurrentHub().getIntegration(LinkedErrors);
          return self ? _handler(client.getOptions().stackParser, self._key, self._limit, event, hint) : event;
        });
      }
    } LinkedErrors.__initStatic();
  
    /**
     * @inheritDoc
     */
    function _handler(
      parser,
      key,
      limit,
      event,
      hint,
    ) {
      if (!event.exception || !event.exception.values || !hint || !isInstanceOf(hint.originalException, Error)) {
        return event;
      }
      const linkedErrors = _walkErrorTree(parser, limit, hint.originalException , key);
      event.exception.values = [...linkedErrors, ...event.exception.values];
      return event;
    }
  
    /**
     * JSDOC
     */
    function _walkErrorTree(
      parser,
      limit,
      error,
      key,
      stack = [],
    ) {
      if (!isInstanceOf(error[key], Error) || stack.length + 1 >= limit) {
        return stack;
      }
      const exception = exceptionFromError(parser, error[key]);
      return _walkErrorTree(parser, limit, error[key], key, [exception, ...stack]);
    }
  
    /** HttpContext integration collects information about HTTP request headers */
    class HttpContext  {constructor() { HttpContext.prototype.__init.call(this); }
      /**
       * @inheritDoc
       */
       static __initStatic() {this.id = 'HttpContext';}
  
      /**
       * @inheritDoc
       */
       __init() {this.name = HttpContext.id;}
  
      /**
       * @inheritDoc
       */
       setupOnce() {
        addGlobalEventProcessor((event) => {
          if (getCurrentHub().getIntegration(HttpContext)) {
            // if none of the information we want exists, don't bother
            if (!WINDOW.navigator && !WINDOW.location && !WINDOW.document) {
              return event;
            }
  
            // grab as much info as exists and add it to the event
            const url = (event.request && event.request.url) || (WINDOW.location && WINDOW.location.href);
            const { referrer } = WINDOW.document || {};
            const { userAgent } = WINDOW.navigator || {};
  
            const headers = {
              ...(event.request && event.request.headers),
              ...(referrer && { Referer: referrer }),
              ...(userAgent && { 'User-Agent': userAgent }),
            };
            const request = { ...event.request, ...(url && { url }), headers };
  
            return { ...event, request };
          }
          return event;
        });
      }
    } HttpContext.__initStatic();
  
    /** Deduplication filter */
    class Dedupe  {constructor() { Dedupe.prototype.__init.call(this); }
      /**
       * @inheritDoc
       */
       static __initStatic() {this.id = 'Dedupe';}
  
      /**
       * @inheritDoc
       */
       __init() {this.name = Dedupe.id;}
  
      /**
       * @inheritDoc
       */
  
      /**
       * @inheritDoc
       */
       setupOnce(addGlobalEventProcessor, getCurrentHub) {
        const eventProcessor = currentEvent => {
          // We want to ignore any non-error type events, e.g. transactions or replays
          // These should never be deduped, and also not be compared against as _previousEvent.
          if (currentEvent.type) {
            return currentEvent;
          }
  
          const self = getCurrentHub().getIntegration(Dedupe);
          if (self) {
            // Juuust in case something goes wrong
            try {
              if (_shouldDropEvent(currentEvent, self._previousEvent)) {
                logger.warn('Event dropped due to being a duplicate of previously captured event.');
                return null;
              }
            } catch (_oO) {
              return (self._previousEvent = currentEvent);
            }
  
            return (self._previousEvent = currentEvent);
          }
          return currentEvent;
        };
  
        eventProcessor.id = this.name;
        addGlobalEventProcessor(eventProcessor);
      }
    } Dedupe.__initStatic();
  
    /** JSDoc */
    function _shouldDropEvent(currentEvent, previousEvent) {
      if (!previousEvent) {
        return false;
      }
  
      if (_isSameMessageEvent(currentEvent, previousEvent)) {
        return true;
      }
  
      if (_isSameExceptionEvent(currentEvent, previousEvent)) {
        return true;
      }
  
      return false;
    }
  
    /** JSDoc */
    function _isSameMessageEvent(currentEvent, previousEvent) {
      const currentMessage = currentEvent.message;
      const previousMessage = previousEvent.message;
  
      // If neither event has a message property, they were both exceptions, so bail out
      if (!currentMessage && !previousMessage) {
        return false;
      }
  
      // If only one event has a stacktrace, but not the other one, they are not the same
      if ((currentMessage && !previousMessage) || (!currentMessage && previousMessage)) {
        return false;
      }
  
      if (currentMessage !== previousMessage) {
        return false;
      }
  
      if (!_isSameFingerprint(currentEvent, previousEvent)) {
        return false;
      }
  
      if (!_isSameStacktrace(currentEvent, previousEvent)) {
        return false;
      }
  
      return true;
    }
  
    /** JSDoc */
    function _isSameExceptionEvent(currentEvent, previousEvent) {
      const previousException = _getExceptionFromEvent(previousEvent);
      const currentException = _getExceptionFromEvent(currentEvent);
  
      if (!previousException || !currentException) {
        return false;
      }
  
      if (previousException.type !== currentException.type || previousException.value !== currentException.value) {
        return false;
      }
  
      if (!_isSameFingerprint(currentEvent, previousEvent)) {
        return false;
      }
  
      if (!_isSameStacktrace(currentEvent, previousEvent)) {
        return false;
      }
  
      return true;
    }
  
    /** JSDoc */
    function _isSameStacktrace(currentEvent, previousEvent) {
      let currentFrames = _getFramesFromEvent(currentEvent);
      let previousFrames = _getFramesFromEvent(previousEvent);
  
      // If neither event has a stacktrace, they are assumed to be the same
      if (!currentFrames && !previousFrames) {
        return true;
      }
  
      // If only one event has a stacktrace, but not the other one, they are not the same
      if ((currentFrames && !previousFrames) || (!currentFrames && previousFrames)) {
        return false;
      }
  
      currentFrames = currentFrames ;
      previousFrames = previousFrames ;
  
      // If number of frames differ, they are not the same
      if (previousFrames.length !== currentFrames.length) {
        return false;
      }
  
      // Otherwise, compare the two
      for (let i = 0; i < previousFrames.length; i++) {
        const frameA = previousFrames[i];
        const frameB = currentFrames[i];
  
        if (
          frameA.filename !== frameB.filename ||
          frameA.lineno !== frameB.lineno ||
          frameA.colno !== frameB.colno ||
          frameA.function !== frameB.function
        ) {
          return false;
        }
      }
  
      return true;
    }
  
    /** JSDoc */
    function _isSameFingerprint(currentEvent, previousEvent) {
      let currentFingerprint = currentEvent.fingerprint;
      let previousFingerprint = previousEvent.fingerprint;
  
      // If neither event has a fingerprint, they are assumed to be the same
      if (!currentFingerprint && !previousFingerprint) {
        return true;
      }
  
      // If only one event has a fingerprint, but not the other one, they are not the same
      if ((currentFingerprint && !previousFingerprint) || (!currentFingerprint && previousFingerprint)) {
        return false;
      }
  
      currentFingerprint = currentFingerprint ;
      previousFingerprint = previousFingerprint ;
  
      // Otherwise, compare the two
      try {
        return !!(currentFingerprint.join('') === previousFingerprint.join(''));
      } catch (_oO) {
        return false;
      }
    }
  
    /** JSDoc */
    function _getExceptionFromEvent(event) {
      return event.exception && event.exception.values && event.exception.values[0];
    }
  
    /** JSDoc */
    function _getFramesFromEvent(event) {
      const exception = event.exception;
  
      if (exception) {
        try {
          // @ts-ignore Object could be undefined
          return exception.values[0].stacktrace.frames;
        } catch (_oO) {
          return undefined;
        }
      }
      return undefined;
    }
  
    var BrowserIntegrations = /*#__PURE__*/Object.freeze({
      __proto__: null,
      GlobalHandlers: GlobalHandlers,
      TryCatch: TryCatch,
      Breadcrumbs: Breadcrumbs,
      LinkedErrors: LinkedErrors,
      HttpContext: HttpContext,
      Dedupe: Dedupe
    });
  
    const defaultIntegrations = [
      new InboundFilters(),
      new FunctionToString(),
      new TryCatch(),
      new Breadcrumbs(),
      new GlobalHandlers(),
      new LinkedErrors(),
      new Dedupe(),
      new HttpContext(),
    ];
  
    /**
     * A magic string that build tooling can leverage in order to inject a release value into the SDK.
     */
  
    /**
     * The Sentry Browser SDK Client.
     *
     * To use this SDK, call the {@link init} function as early as possible when
     * loading the web page. To set context information or send manual events, use
     * the provided methods.
     *
     * @example
     *
     * ```
     *
     * import { init } from '@sentry/browser';
     *
     * init({
     *   dsn: '__DSN__',
     *   // ...
     * });
     * ```
     *
     * @example
     * ```
     *
     * import { configureScope } from '@sentry/browser';
     * configureScope((scope: Scope) => {
     *   scope.setExtra({ battery: 0.7 });
     *   scope.setTag({ user_mode: 'admin' });
     *   scope.setUser({ id: '4711' });
     * });
     * ```
     *
     * @example
     * ```
     *
     * import { addBreadcrumb } from '@sentry/browser';
     * addBreadcrumb({
     *   message: 'My Breadcrumb',
     *   // ...
     * });
     * ```
     *
     * @example
     *
     * ```
     *
     * import * as Sentry from '@sentry/browser';
     * Sentry.captureMessage('Hello, world!');
     * Sentry.captureException(new Error('Good bye'));
     * Sentry.captureEvent({
     *   message: 'Manual',
     *   stacktrace: [
     *     // ...
     *   ],
     * });
     * ```
     *
     * @see {@link BrowserOptions} for documentation on configuration options.
     */
    function init(options = {}) {
      if (options.defaultIntegrations === undefined) {
        options.defaultIntegrations = defaultIntegrations;
      }
      if (options.release === undefined) {
        // This allows build tooling to find-and-replace __SENTRY_RELEASE__ to inject a release value
        if (typeof __SENTRY_RELEASE__ === 'string') {
          options.release = __SENTRY_RELEASE__;
        }
  
        // This supports the variable that sentry-webpack-plugin injects
        if (WINDOW.SENTRY_RELEASE && WINDOW.SENTRY_RELEASE.id) {
          options.release = WINDOW.SENTRY_RELEASE.id;
        }
      }
      if (options.autoSessionTracking === undefined) {
        options.autoSessionTracking = true;
      }
      if (options.sendClientReports === undefined) {
        options.sendClientReports = true;
      }
  
      const clientOptions = {
        ...options,
        stackParser: stackParserFromStackParserOptions(options.stackParser || defaultStackParser),
        integrations: getIntegrationsToSetup(options),
        transport: options.transport || (supportsFetch() ? makeFetchTransport : makeXHRTransport),
      };
  
      initAndBind(BrowserClient, clientOptions);
  
      if (options.autoSessionTracking) {
        startSessionTracking();
      }
    }
  
    /**
     * Present the user with a report dialog.
     *
     * @param options Everything is optional, we try to fetch all info need from the global scope.
     */
    function showReportDialog(options = {}, hub = getCurrentHub()) {
      // doesn't work without a document (React Native)
      if (!WINDOW.document) {
        logger.error('Global document not defined in showReportDialog call');
        return;
      }
  
      const { client, scope } = hub.getStackTop();
      const dsn = options.dsn || (client && client.getDsn());
      if (!dsn) {
        logger.error('DSN not configured for showReportDialog call');
        return;
      }
  
      if (scope) {
        options.user = {
          ...scope.getUser(),
          ...options.user,
        };
      }
  
      if (!options.eventId) {
        options.eventId = hub.lastEventId();
      }
  
      const script = WINDOW.document.createElement('script');
      script.async = true;
      script.src = getReportDialogEndpoint(dsn, options);
  
      if (options.onLoad) {
        script.onload = options.onLoad;
      }
  
      const injectionPoint = WINDOW.document.head || WINDOW.document.body;
      if (injectionPoint) {
        injectionPoint.appendChild(script);
      } else {
        logger.error('Not injecting report dialog. No injection point found in HTML');
      }
    }
  
    /**
     * This is the getter for lastEventId.
     *
     * @returns The last event id of a captured event.
     */
    function lastEventId() {
      return getCurrentHub().lastEventId();
    }
  
    /**
     * This function is here to be API compatible with the loader.
     * @hidden
     */
    function forceLoad() {
      // Noop
    }
  
    /**
     * This function is here to be API compatible with the loader.
     * @hidden
     */
    function onLoad(callback) {
      callback();
    }
  
    /**
     * Call `flush()` on the current client, if there is one. See {@link Client.flush}.
     *
     * @param timeout Maximum time in ms the client should wait to flush its event queue. Omitting this parameter will cause
     * the client to wait until all events are sent before resolving the promise.
     * @returns A promise which resolves to `true` if the queue successfully drains before the timeout, or `false` if it
     * doesn't (or if there's no client defined).
     */
    function flush(timeout) {
      const client = getCurrentHub().getClient();
      if (client) {
        return client.flush(timeout);
      }
      logger.warn('Cannot flush events. No client defined.');
      return resolvedSyncPromise(false);
    }
  
    /**
     * Call `close()` on the current client, if there is one. See {@link Client.close}.
     *
     * @param timeout Maximum time in ms the client should wait to flush its event queue before shutting down. Omitting this
     * parameter will cause the client to wait until all events are sent before disabling itself.
     * @returns A promise which resolves to `true` if the queue successfully drains before the timeout, or `false` if it
     * doesn't (or if there's no client defined).
     */
    function close(timeout) {
      const client = getCurrentHub().getClient();
      if (client) {
        return client.close(timeout);
      }
      logger.warn('Cannot flush events and disable SDK. No client defined.');
      return resolvedSyncPromise(false);
    }
  
    /**
     * Wrap code within a try/catch block so the SDK is able to capture errors.
     *
     * @param fn A function to wrap.
     *
     * @returns The result of wrapped function call.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function wrap(fn) {
      return wrap$1(fn)();
    }
  
    function startSessionOnHub(hub) {
      hub.startSession({ ignoreDuration: true });
      hub.captureSession();
    }
  
    /**
     * Enable automatic Session Tracking for the initial page load.
     */
    function startSessionTracking() {
      if (typeof WINDOW.document === 'undefined') {
        logger.warn('Session tracking in non-browser environment with @sentry/browser is not supported.');
        return;
      }
  
      const hub = getCurrentHub();
  
      // The only way for this to be false is for there to be a version mismatch between @sentry/browser (>= 6.0.0) and
      // @sentry/hub (< 5.27.0). In the simple case, there won't ever be such a mismatch, because the two packages are
      // pinned at the same version in package.json, but there are edge cases where it's possible. See
      // https://github.com/getsentry/sentry-javascript/issues/3207 and
      // https://github.com/getsentry/sentry-javascript/issues/3234 and
      // https://github.com/getsentry/sentry-javascript/issues/3278.
      if (!hub.captureSession) {
        return;
      }
  
      // The session duration for browser sessions does not track a meaningful
      // concept that can be used as a metric.
      // Automatically captured sessions are akin to page views, and thus we
      // discard their duration.
      startSessionOnHub(hub);
  
      // We want to create a session for every navigation as well
      addInstrumentationHandler('history', ({ from, to }) => {
        // Don't create an additional session for the initial route or if the location did not change
        if (!(from === undefined || from === to)) {
          startSessionOnHub(getCurrentHub());
        }
      });
    }
  
    /**
     * Captures user feedback and sends it to Sentry.
     */
    function captureUserFeedback(feedback) {
      const client = getCurrentHub().getClient();
      if (client) {
        client.captureUserFeedback(feedback);
      }
    }
  
    let windowIntegrations = {};
  
    // This block is needed to add compatibility with the integrations packages when used with a CDN
    if (WINDOW.Sentry && WINDOW.Sentry.Integrations) {
      windowIntegrations = WINDOW.Sentry.Integrations;
    }
  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const INTEGRATIONS = {
      ...windowIntegrations,
      ...CoreIntegrations,
      ...BrowserIntegrations,
    };
  
    // This is exported so the loader does not fail when switching off Replay
  
    // TODO (v8): Remove this as it was only needed for backwards compatibility
    // We want replay to be available under Sentry.Replay, to be consistent
    // with the NPM package version.
    INTEGRATIONS.Replay = ReplayShim;
  
    INTEGRATIONS.BrowserTracing = BrowserTracing;
  
    // We are patching the global object with our hub extension methods
    addExtensionMethods();
  
    exports.Breadcrumbs = Breadcrumbs;
    exports.BrowserClient = BrowserClient;
    exports.BrowserTracing = BrowserTracing;
    exports.Dedupe = Dedupe;
    exports.FunctionToString = FunctionToString;
    exports.GlobalHandlers = GlobalHandlers;
    exports.HttpContext = HttpContext;
    exports.Hub = Hub;
    exports.InboundFilters = InboundFilters;
    exports.Integrations = INTEGRATIONS;
    exports.LinkedErrors = LinkedErrors;
    exports.Replay = ReplayShim;
    exports.SDK_VERSION = SDK_VERSION;
    exports.Scope = Scope;
    exports.Span = Span;
    exports.TryCatch = TryCatch;
    exports.WINDOW = WINDOW;
    exports.addBreadcrumb = addBreadcrumb;
    exports.addExtensionMethods = addExtensionMethods;
    exports.addGlobalEventProcessor = addGlobalEventProcessor;
    exports.captureEvent = captureEvent;
    exports.captureException = captureException;
    exports.captureMessage = captureMessage;
    exports.captureUserFeedback = captureUserFeedback;
    exports.chromeStackLineParser = chromeStackLineParser;
    exports.close = close;
    exports.configureScope = configureScope;
    exports.createTransport = createTransport;
    exports.createUserFeedbackEnvelope = createUserFeedbackEnvelope;
    exports.defaultIntegrations = defaultIntegrations;
    exports.defaultStackLineParsers = defaultStackLineParsers;
    exports.defaultStackParser = defaultStackParser;
    exports.eventFromException = eventFromException;
    exports.eventFromMessage = eventFromMessage;
    exports.flush = flush;
    exports.forceLoad = forceLoad;
    exports.geckoStackLineParser = geckoStackLineParser;
    exports.getCurrentHub = getCurrentHub;
    exports.getHubFromCarrier = getHubFromCarrier;
    exports.init = init;
    exports.lastEventId = lastEventId;
    exports.makeFetchTransport = makeFetchTransport;
    exports.makeMain = makeMain;
    exports.makeXHRTransport = makeXHRTransport;
    exports.onLoad = onLoad;
    exports.opera10StackLineParser = opera10StackLineParser;
    exports.opera11StackLineParser = opera11StackLineParser;
    exports.setContext = setContext;
    exports.setExtra = setExtra;
    exports.setExtras = setExtras;
    exports.setTag = setTag;
    exports.setTags = setTags;
    exports.setUser = setUser;
    exports.showReportDialog = showReportDialog;
    exports.startTransaction = startTransaction;
    exports.winjsStackLineParser = winjsStackLineParser;
    exports.withScope = withScope;
    exports.wrap = wrap;
  
    return exports;
  
  })({});
