(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.starling = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = require('./lib/axios');
},{"./lib/axios":3}],2:[function(require,module,exports){
(function (process){
'use strict';

var utils = require('./../utils');
var buildURL = require('./../helpers/buildURL');
var parseHeaders = require('./../helpers/parseHeaders');
var transformData = require('./../helpers/transformData');
var isURLSameOrigin = require('./../helpers/isURLSameOrigin');
var btoa = (typeof window !== 'undefined' && window.btoa) || require('./../helpers/btoa');

module.exports = function xhrAdapter(resolve, reject, config) {
  var requestData = config.data;
  var requestHeaders = config.headers;

  if (utils.isFormData(requestData)) {
    delete requestHeaders['Content-Type']; // Let the browser set it
  }

  var request = new XMLHttpRequest();
  var loadEvent = 'onreadystatechange';
  var xDomain = false;

  // For IE 8/9 CORS support
  // Only supports POST and GET calls and doesn't returns the response headers.
  // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
  if (process.env.NODE_ENV !== 'test' && typeof window !== 'undefined' && window.XDomainRequest && !('withCredentials' in request) && !isURLSameOrigin(config.url)) {
    request = new window.XDomainRequest();
    loadEvent = 'onload';
    xDomain = true;
  }

  // HTTP basic authentication
  if (config.auth) {
    var username = config.auth.username || '';
    var password = config.auth.password || '';
    requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
  }

  request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

  // Set the request timeout in MS
  request.timeout = config.timeout;

  // For IE 9 CORS support.
  request.onprogress = function handleProgress() {};
  request.ontimeout = function handleTimeout() {};

  // Listen for ready state
  request[loadEvent] = function handleLoad() {
    if (!request || (request.readyState !== 4 && !xDomain)) {
      return;
    }

    // The request errored out and we didn't get a response, this will be
    // handled by onerror instead
    if (request.status === 0) {
      return;
    }

    // Prepare the response
    var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
    var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
    var response = {
      data: transformData(
        responseData,
        responseHeaders,
        config.transformResponse
      ),
      // IE sends 1223 instead of 204 (https://github.com/mzabriskie/axios/issues/201)
      status: request.status === 1223 ? 204 : request.status,
      statusText: request.status === 1223 ? 'No Content' : request.statusText,
      headers: responseHeaders,
      config: config,
      request: request
    };

    // Resolve or reject the Promise based on the status
    ((response.status >= 200 && response.status < 300) ||
     (!('status' in request) && request.responseText) ?
      resolve :
      reject)(response);

    // Clean up request
    request = null;
  };

  // Handle low level network errors
  request.onerror = function handleError() {
    // Real errors are hidden from us by the browser
    // onerror should only fire if it's a network error
    reject(new Error('Network Error'));

    // Clean up request
    request = null;
  };

  // Handle timeout
  request.ontimeout = function handleTimeout() {
    var err = new Error('timeout of ' + config.timeout + 'ms exceeded');
    err.timeout = config.timeout;
    err.code = 'ECONNABORTED';
    reject(err);

    // Clean up request
    request = null;
  };

  // Add xsrf header
  // This is only done if running in a standard browser environment.
  // Specifically not if we're in a web worker, or react-native.
  if (utils.isStandardBrowserEnv()) {
    var cookies = require('./../helpers/cookies');

    // Add xsrf header
    var xsrfValue = config.withCredentials || isURLSameOrigin(config.url) ?
        cookies.read(config.xsrfCookieName) :
        undefined;

    if (xsrfValue) {
      requestHeaders[config.xsrfHeaderName] = xsrfValue;
    }
  }

  // Add headers to the request
  if ('setRequestHeader' in request) {
    utils.forEach(requestHeaders, function setRequestHeader(val, key) {
      if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
        // Remove Content-Type if data is undefined
        delete requestHeaders[key];
      } else {
        // Otherwise add header to the request
        request.setRequestHeader(key, val);
      }
    });
  }

  // Add withCredentials to request if needed
  if (config.withCredentials) {
    request.withCredentials = true;
  }

  // Add responseType to request if needed
  if (config.responseType) {
    try {
      request.responseType = config.responseType;
    } catch (e) {
      if (request.responseType !== 'json') {
        throw e;
      }
    }
  }

  // Handle progress if needed
  if (config.progress) {
    if (config.method === 'post' || config.method === 'put') {
      request.upload.addEventListener('progress', config.progress);
    } else if (config.method === 'get') {
      request.addEventListener('progress', config.progress);
    }
  }

  // Format request data
  if (utils.isArrayBuffer(requestData)) {
    requestData = new DataView(requestData);
  }

  if (requestData === undefined) {
    requestData = null;
  }

  // Send the request
  request.send(requestData);
};

}).call(this,require('_process'))

},{"./../helpers/btoa":8,"./../helpers/buildURL":9,"./../helpers/cookies":11,"./../helpers/isURLSameOrigin":13,"./../helpers/parseHeaders":14,"./../helpers/transformData":16,"./../utils":17,"_process":21}],3:[function(require,module,exports){
'use strict';

var defaults = require('./defaults');
var utils = require('./utils');
var dispatchRequest = require('./core/dispatchRequest');
var InterceptorManager = require('./core/InterceptorManager');
var isAbsoluteURL = require('./helpers/isAbsoluteURL');
var combineURLs = require('./helpers/combineURLs');
var bind = require('./helpers/bind');
var transformData = require('./helpers/transformData');

function Axios(defaultConfig) {
  this.defaults = utils.merge({}, defaultConfig);
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, this.defaults, { method: 'get' }, config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Don't allow overriding defaults.withCredentials
  config.withCredentials = config.withCredentials || this.defaults.withCredentials;

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

var defaultInstance = new Axios(defaults);
var axios = module.exports = bind(Axios.prototype.request, defaultInstance);

// Expose properties from defaultInstance
axios.defaults = defaultInstance.defaults;
axios.interceptors = defaultInstance.interceptors;

// Factory for creating new instances
axios.create = function create(defaultConfig) {
  return new Axios(defaultConfig);
};

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
  axios[method] = bind(Axios.prototype[method], defaultInstance);
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
  axios[method] = bind(Axios.prototype[method], defaultInstance);
});

},{"./core/InterceptorManager":4,"./core/dispatchRequest":5,"./defaults":6,"./helpers/bind":7,"./helpers/combineURLs":10,"./helpers/isAbsoluteURL":12,"./helpers/spread":15,"./helpers/transformData":16,"./utils":17}],4:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

},{"./../utils":17}],5:[function(require,module,exports){
(function (process){
'use strict';

/**
 * Dispatch a request to the server using whichever adapter
 * is supported by the current environment.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  return new Promise(function executor(resolve, reject) {
    try {
      var adapter;

      if (typeof config.adapter === 'function') {
        // For custom adapter support
        adapter = config.adapter;
      } else if (typeof XMLHttpRequest !== 'undefined') {
        // For browsers use XHR adapter
        adapter = require('../adapters/xhr');
      } else if (typeof process !== 'undefined') {
        // For node use HTTP adapter
        adapter = require('../adapters/http');
      }

      if (typeof adapter === 'function') {
        adapter(resolve, reject, config);
      }
    } catch (e) {
      reject(e);
    }
  });
};


}).call(this,require('_process'))

},{"../adapters/http":2,"../adapters/xhr":2,"_process":21}],6:[function(require,module,exports){
'use strict';

var utils = require('./utils');

var PROTECTION_PREFIX = /^\)\]\}',?\n/;
var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

module.exports = {
  transformRequest: [function transformRequestJSON(data, headers) {
    if (utils.isFormData(data)) {
      return data;
    }
    if (utils.isArrayBuffer(data)) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isObject(data) && !utils.isFile(data) && !utils.isBlob(data)) {
      // Set application/json if no Content-Type has been specified
      if (!utils.isUndefined(headers)) {
        utils.forEach(headers, function processContentTypeHeader(val, key) {
          if (key.toLowerCase() === 'content-type') {
            headers['Content-Type'] = val;
          }
        });

        if (utils.isUndefined(headers['Content-Type'])) {
          headers['Content-Type'] = 'application/json;charset=utf-8';
        }
      }
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponseJSON(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      data = data.replace(PROTECTION_PREFIX, '');
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*'
    },
    patch: utils.merge(DEFAULT_CONTENT_TYPE),
    post: utils.merge(DEFAULT_CONTENT_TYPE),
    put: utils.merge(DEFAULT_CONTENT_TYPE)
  },

  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1
};

},{"./utils":17}],7:[function(require,module,exports){
'use strict';

module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

},{}],8:[function(require,module,exports){
'use strict';

// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error;
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars;
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

module.exports = btoa;

},{}],9:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      }

      if (!utils.isArray(val)) {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


},{"./../utils":17}],10:[function(require,module,exports){
'use strict';

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '');
};

},{}],11:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

  // Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })()
);

},{"./../utils":17}],12:[function(require,module,exports){
'use strict';

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

},{}],13:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      var href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                  urlParsingNode.pathname :
                  '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })()
);

},{"./../utils":17}],14:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
};

},{"./../utils":17}],15:[function(require,module,exports){
'use strict';

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

},{}],16:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};

},{"./../utils":17}],17:[function(require,module,exports){
'use strict';

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return toString.call(val) === '[object FormData]';
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  typeof document.createElement -> undefined
 */
function isStandardBrowserEnv() {
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined' &&
    typeof document.createElement === 'function'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object' && !isArray(obj)) {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  trim: trim
};

},{}],18:[function(require,module,exports){
(function (process){
/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = require('./debug');
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}

}).call(this,require('_process'))

},{"./debug":19,"_process":21}],19:[function(require,module,exports){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = require('ms');

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  return debug;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

},{"ms":20}],20:[function(require,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}

},{}],21:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],22:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'axios', 'debug', '../utils/http', '../utils/validator'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, require('axios'), require('debug'), require('../utils/http'), require('../utils/validator'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, global.axios, global.debug, global.http, global.validator);
    global.account = mod.exports;
  }
})(this, function (module, _axios, _debug, _http, _validator) {
  'use strict';

  var _axios2 = _interopRequireDefault(_axios);

  var _debug2 = _interopRequireDefault(_debug);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
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

  var log = (0, _debug2.default)('starling:account-service');

  /**
   * Service to interact with a customer's account
   */

  var Account = function () {

    /**
     * Creates an instance of the account client
     * @param {Object} options - application config
     */
    function Account(options) {
      _classCallCheck(this, Account);

      this.options = options;
    }

    /**
     * Retrieves a customer's account
     * @param {string} accessToken - the oauth bearer token
     * @return {Promise} - the http request promise
     */


    _createClass(Account, [{
      key: 'getAccount',
      value: function getAccount(accessToken) {
        (0, _validator.typeValidation)(arguments, getAccountParameterDefinition);
        var url = this.options.apiUrl + '/api/v1/accounts';
        log('GET ' + url);

        return (0, _axios2.default)({
          method: 'GET',
          url: url,
          headers: (0, _http.defaultHeaders)(accessToken)
        });
      }
    }, {
      key: 'getBalance',
      value: function getBalance(accessToken) {
        (0, _validator.typeValidation)(arguments, getBalanceParameterDefinition);
        var url = this.options.apiUrl + '/api/v1/accounts/balance';
        log('GET ' + url);

        return (0, _axios2.default)({
          method: 'GET',
          url: url,
          headers: (0, _http.defaultHeaders)(accessToken)
        });
      }
    }]);

    return Account;
  }();

  var getAccountParameterDefinition = [{ name: 'accessToken', validations: ['required', 'string'] }];

  var getBalanceParameterDefinition = [{ name: 'accessToken', validations: ['required', 'string'] }];

  module.exports = Account;
});

},{"../utils/http":34,"../utils/validator":35,"axios":1,"debug":18}],23:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'axios', 'debug', '../utils/http', '../utils/validator'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, require('axios'), require('debug'), require('../utils/http'), require('../utils/validator'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, global.axios, global.debug, global.http, global.validator);
    global.address = mod.exports;
  }
})(this, function (module, _axios, _debug, _http, _validator) {
  'use strict';

  var _axios2 = _interopRequireDefault(_axios);

  var _debug2 = _interopRequireDefault(_debug);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
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

  var log = (0, _debug2.default)('starling:address-service');

  /**
   * Service to interact with a customer address
   */

  var Address = function () {

    /**
     * Creates an instance of the address client
     * @param {Object} options - configuration parameters
     */
    function Address(options) {
      _classCallCheck(this, Address);

      this.options = options;
    }

    /**
     * Retrieves a customer's address
     * @param {string} accessToken - the oauth bearer token.
     * @return {Promise} - the http request promise
     */


    _createClass(Address, [{
      key: 'getAddresses',
      value: function getAddresses(accessToken) {
        (0, _validator.typeValidation)(arguments, getAddressParameterDefinition);
        var url = this.options.apiUrl + '/api/v1/addresses';
        log('GET ' + url);

        return (0, _axios2.default)({
          method: 'GET',
          url: url,
          headers: (0, _http.defaultHeaders)(accessToken)
        });
      }
    }]);

    return Address;
  }();

  var getAddressParameterDefinition = [{ name: 'accessToken', validations: ['required', 'string'] }];

  module.exports = Address;
});

},{"../utils/http":34,"../utils/validator":35,"axios":1,"debug":18}],24:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'axios', 'debug', '../utils/http', '../utils/validator'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, require('axios'), require('debug'), require('../utils/http'), require('../utils/validator'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, global.axios, global.debug, global.http, global.validator);
    global.card = mod.exports;
  }
})(this, function (module, _axios, _debug, _http, _validator) {
  'use strict';

  var _axios2 = _interopRequireDefault(_axios);

  var _debug2 = _interopRequireDefault(_debug);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
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

  var log = (0, _debug2.default)('starling:card-service');

  /**
   * Service to interact with a customer card
   */

  var Card = function () {

    /**
     * Creates an instance of the client's card
     * @param {Object} options - configuration parameters
     */
    function Card(options) {
      _classCallCheck(this, Card);

      this.options = options;
    }

    /**
     * Retrieves a customer's card
     * @param {string} accessToken - the oauth bearer token.
     * @return {Promise} - the http request promise
     */


    _createClass(Card, [{
      key: 'getCard',
      value: function getCard(accessToken) {
        (0, _validator.typeValidation)(arguments, getCardParameterDefinition);
        var url = this.options.apiUrl + '/api/v1/cards';
        log('GET ' + url);

        return (0, _axios2.default)({
          method: 'GET',
          url: url,
          headers: (0, _http.defaultHeaders)(accessToken)
        });
      }
    }]);

    return Card;
  }();

  var getCardParameterDefinition = [{ name: 'accessToken', validations: ['required', 'string'] }];

  module.exports = Card;
});

},{"../utils/http":34,"../utils/validator":35,"axios":1,"debug":18}],25:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'axios', 'debug', '../utils/http', '../utils/validator'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, require('axios'), require('debug'), require('../utils/http'), require('../utils/validator'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, global.axios, global.debug, global.http, global.validator);
    global.contact = mod.exports;
  }
})(this, function (module, _axios, _debug, _http, _validator) {
  'use strict';

  var _axios2 = _interopRequireDefault(_axios);

  var _debug2 = _interopRequireDefault(_debug);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
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

  var log = (0, _debug2.default)('starling:contact-service');

  /**
   * Service to interact with a customer's contacts (payees)
   */

  var Contact = function () {

    /**
     * Create a new contact service
     * @param {Object} options - configuration parameters
     */
    function Contact(options) {
      _classCallCheck(this, Contact);

      this.options = options;
    }

    /**
     * Gets the customer's contacts (payees)
     * @param {string} accessToken - the oauth bearer token.
     * @return {Promise} - the http request promise
     */


    _createClass(Contact, [{
      key: 'getContacts',
      value: function getContacts(accessToken) {
        (0, _validator.typeValidation)(arguments, getContactsParameterDefinition);
        var url = this.options.apiUrl + '/api/v1/contacts';
        log('GET ' + url);

        return (0, _axios2.default)({
          method: 'GET',
          url: url,
          headers: (0, _http.defaultHeaders)(accessToken)
        });
      }
    }, {
      key: 'getContactAccount',
      value: function getContactAccount(accessToken, contactId) {
        (0, _validator.typeValidation)(arguments, getContactAccountParameterDefinition);
        var url = this.options.apiUrl + '/api/v1/contacts/' + contactId + '/accounts';
        log('GET ' + url);
        return (0, _axios2.default)({
          method: 'GET',
          url: url,
          headers: (0, _http.defaultHeaders)(accessToken)
        });
      }
    }, {
      key: 'createContact',
      value: function createContact(accessToken, name, accountType, accountNumber, sortCode, customerId) {
        (0, _validator.typeValidation)(arguments, createContactParameterDefinition);
        var url = this.options.apiUrl + '/api/v1/contacts';
        log('POST ' + url);
        return (0, _axios2.default)({
          method: 'POST',
          url: url,
          headers: (0, _http.postHeaders)(accessToken),
          data: JSON.stringify({
            name: name,
            accountType: accountType,
            accountNumber: accountNumber,
            sortCode: sortCode,
            customerId: customerId
          })
        });
      }
    }, {
      key: 'deleteContact',
      value: function deleteContact(accessToken, contactId) {
        (0, _validator.typeValidation)(arguments, deleteContactParameterDefinition);
        var url = this.options.apiUrl + '/api/v1/contacts/' + contactId;
        log('DELETE ' + url);
        return (0, _axios2.default)({
          method: 'DELETE',
          url: url,
          headers: (0, _http.defaultHeaders)(accessToken)
        });
      }
    }]);

    return Contact;
  }();

  var getContactsParameterDefinition = [{ name: 'accessToken', validations: ['required', 'string'] }];

  var getContactAccountParameterDefinition = [{ name: 'accessToken', validations: ['required', 'string'] }, { name: 'contactId', validations: ['required', 'string'] }];

  var createContactParameterDefinition = [{ name: 'accessToken', validations: ['required', 'string'] }, { name: 'name', validations: ['required', 'string'] }, { name: 'accountType', validations: ['required', 'string'] }, { name: 'accountNumber', validations: ['required', 'string'] }, { name: 'sortCode', validations: ['required', 'string'] }, { name: 'customerId', validations: ['optional', 'string'] }];

  var deleteContactParameterDefinition = [{ name: 'accessToken', validations: ['required', 'string'] }, { name: 'contactId', validations: ['required', 'string'] }];

  module.exports = Contact;
});

},{"../utils/http":34,"../utils/validator":35,"axios":1,"debug":18}],26:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'axios', 'debug', '../utils/http', '../utils/validator'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, require('axios'), require('debug'), require('../utils/http'), require('../utils/validator'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, global.axios, global.debug, global.http, global.validator);
    global.customer = mod.exports;
  }
})(this, function (module, _axios, _debug, _http, _validator) {
  'use strict';

  var _axios2 = _interopRequireDefault(_axios);

  var _debug2 = _interopRequireDefault(_debug);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
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

  var log = (0, _debug2.default)('starling:customer-service');

  /**
   * Service to interact with a customer
   */

  var Customer = function () {

    /**
     * Create a new customer service
     * @param {Object} options - configuration parameters
     */
    function Customer(options) {
      _classCallCheck(this, Customer);

      this.options = options;
    }

    /**
     * Gets the customer's details
     * @param {string} accessToken - the oauth bearer token.
     * @return {Promise} - the http request promise
     */


    _createClass(Customer, [{
      key: 'getCustomer',
      value: function getCustomer(accessToken) {
        (0, _validator.typeValidation)(arguments, getCustomerParameterDefinition);
        var url = this.options.apiUrl + '/api/v1/customers';
        log('GET ' + url);

        return (0, _axios2.default)({
          method: 'GET',
          url: url,
          headers: (0, _http.defaultHeaders)(accessToken)
        });
      }
    }]);

    return Customer;
  }();

  var getCustomerParameterDefinition = [{ name: 'accessToken', validations: ['required', 'string'] }];

  module.exports = Customer;
});

},{"../utils/http":34,"../utils/validator":35,"axios":1,"debug":18}],27:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'axios', 'debug', '../utils/http', '../utils/validator'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, require('axios'), require('debug'), require('../utils/http'), require('../utils/validator'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, global.axios, global.debug, global.http, global.validator);
    global.mandate = mod.exports;
  }
})(this, function (module, _axios, _debug, _http, _validator) {
  'use strict';

  var _axios2 = _interopRequireDefault(_axios);

  var _debug2 = _interopRequireDefault(_debug);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
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

  var log = (0, _debug2.default)('starling:mandate-service');

  /**
   * Service to interact with a customer's transactions
   */

  var Mandate = function () {
    /**
     * Create a new transaction service
     * @param {Object} options - configuration parameters
     */
    function Mandate(options) {
      _classCallCheck(this, Mandate);

      this.options = options;
    }

    /**
     * Gets a list of the customer's current direct debit mandates
     * @param {string} accessToken - the oauth bearer token.
     * @return {Promise} - the http request promise
     */


    _createClass(Mandate, [{
      key: 'listMandates',
      value: function listMandates(accessToken) {
        (0, _validator.typeValidation)(arguments, listMandatesParameterDefinition);
        var url = this.options.apiUrl + '/api/v1/direct-debit/mandates';
        log('GET ' + url);
        return (0, _axios2.default)({
          method: 'GET',
          url: url,
          headers: (0, _http.defaultHeaders)(accessToken)
        });
      }
    }, {
      key: 'deleteMandate',
      value: function deleteMandate(accessToken, mandateId) {
        (0, _validator.typeValidation)(arguments, deleteMandateParameterDefinition);
        var url = this.options.apiUrl + '/api/v1/direct-debit/mandates/' + mandateId;
        log('DELETE ' + url);
        return (0, _axios2.default)({
          method: 'DELETE',
          url: url,
          headers: (0, _http.defaultHeaders)(accessToken)
        });
      }
    }]);

    return Mandate;
  }();

  var listMandatesParameterDefinition = [{ name: 'accessToken', validations: ['required', 'string'] }];

  var deleteMandateParameterDefinition = [{ name: 'accessToken', validations: ['required', 'string'] }, { name: 'mandateId', validations: ['required', 'string'] }];

  module.exports = Mandate;
});

},{"../utils/http":34,"../utils/validator":35,"axios":1,"debug":18}],28:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'axios', 'debug', '../utils/validator'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, require('axios'), require('debug'), require('../utils/validator'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, global.axios, global.debug, global.validator);
    global.oauth = mod.exports;
  }
})(this, function (module, _axios, _debug, _validator) {
  'use strict';

  var _axios2 = _interopRequireDefault(_axios);

  var _debug2 = _interopRequireDefault(_debug);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
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

  var ACCESS_TOKEN_GRANT_TYPE = 'authorization_code';
  var REFRESH_TOKEN_GRANT_TYPE = 'refresh_token';

  var log = (0, _debug2.default)('starling:oauth-service');

  /**
   * Service to interact with a the oauth endpoint
   */

  var OAuth = function () {

    /**
     * Create a new oauth service
     * @param {Object} options - configuration parameters
     */
    function OAuth(options) {
      _classCallCheck(this, OAuth);

      this.options = options;
    }

    /**
     * Exchanges the authorization code for an access token
     * @param {string} authorizationCode - the authorization code, acquired from the user agent after the
     * user authenticates with starling
     * @return {Promise} - the http request promise
     */


    _createClass(OAuth, [{
      key: 'getAccessToken',
      value: function getAccessToken(authorizationCode) {
        (0, _validator.typeValidation)(arguments, authorizationCodeParameterDefinition);
        return this.getOAuthToken({
          'code': authorizationCode,
          'grant_type': ACCESS_TOKEN_GRANT_TYPE,
          'client_id': this.options.clientId,
          'client_secret': this.options.clientSecret,
          'redirect_uri': this.options.redirectUri
        });
      }
    }, {
      key: 'refreshAccessToken',
      value: function refreshAccessToken(refreshToken) {
        (0, _validator.typeValidation)(arguments, refreshTokenParameterDefinition);
        return this.getOAuthToken({
          'refresh_token': refreshToken,
          'grant_type': REFRESH_TOKEN_GRANT_TYPE,
          'client_id': this.options.clientId,
          'client_secret': this.options.clientSecret
        });
      }
    }, {
      key: 'getOAuthToken',
      value: function getOAuthToken(params) {
        if (!this.options.clientId) {
          throw Error('clientId is not configured');
        }

        if (!this.options.clientSecret) {
          throw Error('clientSecret is not configured');
        }

        var url = this.options.oauthUrl + '/oauth/access-token';
        log('POST ' + url + ' queryParams:' + JSON.stringify(params));

        return (0, _axios2.default)({
          url: url,
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json'
          },
          params: params
        });
      }
    }]);

    return OAuth;
  }();

  var refreshTokenParameterDefinition = [{ name: 'refreshToken', validations: ['required', 'string'] }];

  var authorizationCodeParameterDefinition = [{ name: 'authorizationCode', validations: ['required', 'string'] }];

  module.exports = OAuth;
});

},{"../utils/validator":35,"axios":1,"debug":18}],29:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'axios', 'debug', '../utils/http', '../utils/validator'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, require('axios'), require('debug'), require('../utils/http'), require('../utils/validator'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, global.axios, global.debug, global.http, global.validator);
    global.payment = mod.exports;
  }
})(this, function (module, _axios, _debug, _http, _validator) {
  'use strict';

  var _axios2 = _interopRequireDefault(_axios);

  var _debug2 = _interopRequireDefault(_debug);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
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

  var log = (0, _debug2.default)('starling:payment-service');

  /**
   * Service to interact with a customer's transactions
   */

  var Payment = function () {
    /**
     * Create a new transaction service
     * @param {Object} options - configuration parameters
     */
    function Payment(options) {
      _classCallCheck(this, Payment);

      this.options = options;
    }

    /**
     * Makes a payment on behalf of the customer to another UK bank account using the Faster Payments network
     * @param {string} accessToken - the oauth bearer token.
     *  @param {string} destinationAccountUid - the account identifier of the recipient
     * @param {string} reference - The payment reference, max. 18 characters.
     * @param {string} amount - the amount to be send.
     * @param {string=} currency - the currency, optional, defaults to "GBP".
     * @return {Promise} - the http request promise
     */


    _createClass(Payment, [{
      key: 'makeLocalPayment',
      value: function makeLocalPayment(accessToken, destinationAccountUid, reference, amount, currency) {
        (0, _validator.typeValidation)(arguments, makeLocalPaymentParameterDefinition);
        var url = this.options.apiUrl + '/api/v1/payments/local';
        log('POST ' + url);
        return (0, _axios2.default)({
          method: 'POST',
          url: url,
          headers: (0, _http.postHeaders)(accessToken),
          data: JSON.stringify({
            destinationAccountUid: destinationAccountUid,
            payment: {
              amount: amount,
              currency: currency
            },
            reference: reference
          })
        });
      }
    }, {
      key: 'listScheduledPayments',
      value: function listScheduledPayments(accessToken) {
        (0, _validator.typeValidation)(arguments, listScheduledPaymentsParameterDefinition);
        var url = this.options.apiUrl + '/api/v1/payments/scheduled';
        log('GET ' + url);
        return (0, _axios2.default)({
          method: 'GET',
          url: url,
          headers: (0, _http.defaultHeaders)(accessToken)
        });
      }
    }]);

    return Payment;
  }();

  var makeLocalPaymentParameterDefinition = [{ name: 'accessToken', validations: ['required', 'string'] }, { name: 'destinationAccountUid', validations: ['required', 'string'] }, { name: 'reference', validations: ['required', 'string'] }, { name: 'amount', validations: ['required', 'string'] }, { name: 'currency', validations: ['optional', 'string'] }];

  var listScheduledPaymentsParameterDefinition = [{ name: 'accessToken', validations: ['required', 'string'] }];

  module.exports = Payment;
});

},{"../utils/http":34,"../utils/validator":35,"axios":1,"debug":18}],30:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'axios', 'debug', '../utils/http', '../utils/validator'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, require('axios'), require('debug'), require('../utils/http'), require('../utils/validator'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, global.axios, global.debug, global.http, global.validator);
    global.savingsGoals = mod.exports;
  }
})(this, function (module, _axios, _debug, _http, _validator) {
  'use strict';

  var _axios2 = _interopRequireDefault(_axios);

  var _debug2 = _interopRequireDefault(_debug);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
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

  var log = (0, _debug2.default)('starling:saving-goals-service');

  /**
   * Service to interact with a customer's savings goals
   */

  var SavingsGoals = function () {
    /**
     * Create a new savings goal service
     * @param {Object} options - configuration parameters
     */
    function SavingsGoals(options) {
      _classCallCheck(this, SavingsGoals);

      this.options = options;
    }

    /**
     * Gets a list of the customer's savings goals
     * @param {string} accessToken - the oauth bearer token.
     * @return {Promise} - the http request promise
     */


    _createClass(SavingsGoals, [{
      key: 'listSavingsGoals',
      value: function listSavingsGoals(accessToken) {
        (0, _validator.typeValidation)(arguments, listSavingsGoalsParameterDefinition);
        var url = this.options.apiUrl + '/api/v1/savings-goals';
        log('GET ' + url);
        return (0, _axios2.default)({
          method: 'GET',
          url: url,
          headers: (0, _http.defaultHeaders)(accessToken)
        });
      }
    }, {
      key: 'getSavingsGoal',
      value: function getSavingsGoal(accessToken, savingsGoalId) {
        (0, _validator.typeValidation)(arguments, getSavingsGoalParameterDefinition);
        var url = this.options.apiUrl + '/api/v1/savings-goals/' + savingsGoalId;
        log('GET ' + url);
        return (0, _axios2.default)({
          method: 'GET',
          url: url,
          headers: (0, _http.defaultHeaders)(accessToken)
        });
      }
    }, {
      key: 'createSavingsGoal',
      value: function createSavingsGoal(accessToken, savingsGoalId, name, currency, targetAmount, targetCurrency, base64EncodedPhoto) {
        (0, _validator.typeValidation)(arguments, createSavingsGoalParameterDefinition);
        var url = this.options.apiUrl + '/api/v1/savings-goals/' + savingsGoalId;
        log('PUT ' + url);
        return (0, _axios2.default)({
          method: 'PUT',
          url: url,
          headers: (0, _http.postHeaders)(accessToken),
          data: JSON.stringify({
            name: name,
            currency: currency,
            target: {
              targetAmount: targetAmount,
              targetCurrency: targetCurrency
            },
            base64EncodedPhoto: base64EncodedPhoto
          })
        });
      }
    }, {
      key: 'deleteSavingsGoal',
      value: function deleteSavingsGoal(accessToken, savingsGoalId) {
        (0, _validator.typeValidation)(arguments, deleteSavingsGoalParameterDefinition);
        var url = this.options.apiUrl + '/api/v1/savings-goals/' + savingsGoalId;
        log('DELETE ' + url);
        return (0, _axios2.default)({
          method: 'DELETE',
          url: url,
          headers: (0, _http.defaultHeaders)(accessToken)
        });
      }
    }, {
      key: 'addMoneyToSavingsGoal',
      value: function addMoneyToSavingsGoal(accessToken, savingsGoalId, transactionId, amount, currency) {
        (0, _validator.typeValidation)(arguments, addMoneySavingsGoalParameterDefinition);
        var url = this.options.apiUrl + '/api/v1/savings-goals/' + savingsGoalId + '/add-money/' + transactionId;
        log('PUT ' + url);
        return (0, _axios2.default)({
          method: 'PUT',
          url: url,
          headers: (0, _http.postHeaders)(accessToken),
          data: JSON.stringify({
            amount: {
              currency: currency,
              minorUnits: amount
            }
          })
        });
      }
    }]);

    return SavingsGoals;
  }();

  var listSavingsGoalsParameterDefinition = [{ name: 'accessToken', validations: ['required', 'string'] }];

  var getSavingsGoalParameterDefinition = [{ name: 'accessToken', validations: ['required', 'string'] }, { name: 'savingsGoalId', validations: ['required', 'string'] }];

  var deleteSavingsGoalParameterDefinition = [{ name: 'accessToken', validations: ['required', 'string'] }, { name: 'savingsGoalId', validations: ['required', 'string'] }];

  var createSavingsGoalParameterDefinition = [{ name: 'accessToken', validations: ['required', 'string'] }, { name: 'savingsGoalId', validations: ['required', 'string'] }, { name: 'name', validations: ['required', 'string'] }, { name: 'currency', validations: ['required', 'string'] }, { name: 'targetAmount', validations: ['optional', 'number'] }, { name: 'targetCurrency', validations: ['optional', 'string'] }, { name: 'base64EncodedPhoto', validations: ['optional', 'string'] }];

  var addMoneySavingsGoalParameterDefinition = [{ name: 'accessToken', validations: ['required', 'string'] }, { name: 'savingsGoalId', validations: ['required', 'string'] }, { name: 'transactionId', validations: ['required', 'string'] }, { name: 'amount', validations: ['required', 'number'] }];

  module.exports = SavingsGoals;
});

},{"../utils/http":34,"../utils/validator":35,"axios":1,"debug":18}],31:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'axios', 'debug', '../utils/http', '../utils/validator'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, require('axios'), require('debug'), require('../utils/http'), require('../utils/validator'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, global.axios, global.debug, global.http, global.validator);
    global.transaction = mod.exports;
  }
})(this, function (module, _axios, _debug, _http, _validator) {
  'use strict';

  var _axios2 = _interopRequireDefault(_axios);

  var _debug2 = _interopRequireDefault(_debug);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
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

  var log = (0, _debug2.default)('starling:transaction-service');

  var transactionSource = function transactionSource(source) {
    if (source === 'MASTER_CARD') {
      return '/mastercard';
    } else if (source === 'FASTER_PAYMENTS_IN') {
      return '/fps/in';
    } else if (source === 'FASTER_PAYMENTS_OUT') {
      return '/fps/out';
    } else if (source === 'DIRECT_DEBIT') {
      return '/direct-debit';
    } else {
      return '';
    }
  };

  /**
   * Service to interact with a customer's transactions
   */

  var Transaction = function () {
    /**
     * Create a new transaction service
     * @param {Object} options - configuration parameters
     */
    function Transaction(options) {
      _classCallCheck(this, Transaction);

      this.options = options;
    }

    /**
     * Gets the customer's transactions over the given period
     * @param {string} accessToken - the oauth bearer token.
     * @param {string} fromDate - filter transactions after this date. Format: YYYY-MM-DD
     * @param {string} toDate - filter transactions before this date. Format: YYYY-MM-DD
     * @param {string=} source - the transaction type (e.g. faster payments, mastercard).
     * If not specified, results are not filtered by source.
     * @return {Promise} - the http request promise
     */


    _createClass(Transaction, [{
      key: 'getTransactions',
      value: function getTransactions(accessToken, fromDate, toDate, source) {
        (0, _validator.typeValidation)(arguments, getTransactionsParameterDefinition);
        var url = this.options.apiUrl + '/api/v1/transactions' + transactionSource(source);
        log('GET ' + url + ' from=' + fromDate + ' to=' + toDate);

        return (0, _axios2.default)({
          method: 'GET',
          url: url,
          params: {
            from: fromDate,
            to: toDate
          },
          headers: (0, _http.defaultHeaders)(accessToken)
        });
      }
    }, {
      key: 'getTransaction',
      value: function getTransaction(accessToken, transactionId, source) {
        (0, _validator.typeValidation)(arguments, getTransactionParameterDefinition);
        var url = this.options.apiUrl + '/api/v1/transactions' + transactionSource(source) + '/' + transactionId;
        log('GET ' + url);
        return (0, _axios2.default)({
          method: 'GET',
          url: url,
          headers: (0, _http.defaultHeaders)(accessToken)
        });
      }
    }]);

    return Transaction;
  }();

  var getTransactionsParameterDefinition = [{ name: 'accessToken', validations: ['required', 'string'] }, { name: 'fromDate', validations: ['optional', 'string'] }, { name: 'toDate', validations: ['optional', 'string'] }, { name: 'source', validations: ['optional', 'string'] }];

  var getTransactionParameterDefinition = [{ name: 'accessToken', validations: ['required', 'string'] }, { name: 'transactionId', validations: ['required', 'string'] }, { name: 'source', validations: ['optional', 'string'] }];

  module.exports = Transaction;
});

},{"../utils/http":34,"../utils/validator":35,"axios":1,"debug":18}],32:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'axios', 'debug', '../utils/http', '../utils/validator'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, require('axios'), require('debug'), require('../utils/http'), require('../utils/validator'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, global.axios, global.debug, global.http, global.validator);
    global.whoAmI = mod.exports;
  }
})(this, function (module, _axios, _debug, _http, _validator) {
  'use strict';

  var _axios2 = _interopRequireDefault(_axios);

  var _debug2 = _interopRequireDefault(_debug);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
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

  var log = (0, _debug2.default)('starling:who-am-i-service');

  /**
   * Service to interact with the Who Am I endpoint
   */

  var WhoAmI = function () {

    /**
     * Creates an instance of the who am I client
     * @param {Object} options - configuration parameters
     */
    function WhoAmI(options) {
      _classCallCheck(this, WhoAmI);

      this.options = options;
    }

    /**
     * Retrieves the customer UUID and permissions corresponding to the access token passed
     * @param {string} accessToken - the oauth bearer token.
     * @return {Promise} - the http request promise
     */


    _createClass(WhoAmI, [{
      key: 'getMe',
      value: function getMe(accessToken) {
        (0, _validator.typeValidation)(arguments, getMeParameterDefinition);
        var url = this.options.apiUrl + '/api/v1/me';
        log('GET ' + url);

        return (0, _axios2.default)({
          method: 'GET',
          url: url,
          headers: (0, _http.defaultHeaders)(accessToken)
        });
      }
    }]);

    return WhoAmI;
  }();

  var getMeParameterDefinition = [{ name: 'accessToken', validations: ['required', 'string'] }];

  module.exports = WhoAmI;
});

},{"../utils/http":34,"../utils/validator":35,"axios":1,"debug":18}],33:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', './entities/customer', './entities/account', './entities/address', './entities/transaction', './entities/card', './entities/oauth', './entities/contact', './entities/payment', './entities/mandate', './entities/savingsGoals', './entities/whoAmI'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, require('./entities/customer'), require('./entities/account'), require('./entities/address'), require('./entities/transaction'), require('./entities/card'), require('./entities/oauth'), require('./entities/contact'), require('./entities/payment'), require('./entities/mandate'), require('./entities/savingsGoals'), require('./entities/whoAmI'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, global.customer, global.account, global.address, global.transaction, global.card, global.oauth, global.contact, global.payment, global.mandate, global.savingsGoals, global.whoAmI);
    global.starling = mod.exports;
  }
})(this, function (module, _customer, _account, _address, _transaction, _card, _oauth, _contact, _payment, _mandate, _savingsGoals, _whoAmI) {
  'use strict';

  var _customer2 = _interopRequireDefault(_customer);

  var _account2 = _interopRequireDefault(_account);

  var _address2 = _interopRequireDefault(_address);

  var _transaction2 = _interopRequireDefault(_transaction);

  var _card2 = _interopRequireDefault(_card);

  var _oauth2 = _interopRequireDefault(_oauth);

  var _contact2 = _interopRequireDefault(_contact);

  var _payment2 = _interopRequireDefault(_payment);

  var _mandate2 = _interopRequireDefault(_mandate);

  var _savingsGoals2 = _interopRequireDefault(_savingsGoals);

  var _whoAmI2 = _interopRequireDefault(_whoAmI);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
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

  var Starling = function () {

    /**
     * Create an instance of the starling client
     * @param {Object=} options - configuration parameters
     */
    function Starling(options) {
      _classCallCheck(this, Starling);

      var defaults = {
        apiUrl: 'https://api.starlingbank.com',
        oauthUrl: 'https://oauth.starlingbank.com',
        clientId: '',
        clientSecret: ''
      };

      this.config = Object.assign({}, defaults, options);

      this.whoAmI = new _whoAmI2.default(this.config);
      this.customer = new _customer2.default(this.config);
      this.account = new _account2.default(this.config);
      this.address = new _address2.default(this.config);
      this.transaction = new _transaction2.default(this.config);
      this.payment = new _payment2.default(this.config);
      this.mandate = new _mandate2.default(this.config);
      this.contact = new _contact2.default(this.config);
      this.card = new _card2.default(this.config);
      this.savingsGoals = new _savingsGoals2.default(this.config);
      this.oAuth = new _oauth2.default(this.config);
    }

    /**
     * Gets the customer UUID and permissions corresponding to the access token passed
     * @param {string=} accessToken - the oauth bearer token.  If not
     * specified, the accessToken on the options object is used.
     * @return {Promise} - the http request promise
     */


    _createClass(Starling, [{
      key: 'getMe',
      value: function getMe() {
        var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.config.accessToken;

        return this.whoAmI.getMe(accessToken);
      }
    }, {
      key: 'getCustomer',
      value: function getCustomer() {
        var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.config.accessToken;

        return this.customer.getCustomer(accessToken);
      }
    }, {
      key: 'getAccount',
      value: function getAccount() {
        var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.config.accessToken;

        return this.account.getAccount(accessToken);
      }
    }, {
      key: 'getBalance',
      value: function getBalance() {
        var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.config.accessToken;

        return this.account.getBalance(accessToken);
      }
    }, {
      key: 'getAddresses',
      value: function getAddresses() {
        var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.config.accessToken;

        return this.address.getAddresses(accessToken);
      }
    }, {
      key: 'getTransactions',
      value: function getTransactions() {
        var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.config.accessToken;
        var fromDate = arguments[1];
        var toDate = arguments[2];
        var source = arguments[3];

        return this.transaction.getTransactions(accessToken, fromDate, toDate, source);
      }
    }, {
      key: 'getTransaction',
      value: function getTransaction() {
        var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.config.accessToken;
        var transactionId = arguments[1];
        var source = arguments[2];

        return this.transaction.getTransaction(accessToken, transactionId, source);
      }
    }, {
      key: 'listMandates',
      value: function listMandates() {
        var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.config.accessToken;

        return this.mandate.listMandates(accessToken);
      }
    }, {
      key: 'deleteMandate',
      value: function deleteMandate() {
        var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.config.accessToken;
        var mandateId = arguments[1];

        return this.mandate.deleteMandate(accessToken, mandateId);
      }
    }, {
      key: 'listScheduledPayments',
      value: function listScheduledPayments() {
        var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.config.accessToken;

        return this.payment.listScheduledPayments(accessToken);
      }
    }, {
      key: 'makeLocalPayment',
      value: function makeLocalPayment() {
        var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.config.accessToken;
        var destinationAccountUid = arguments[1];
        var reference = arguments[2];
        var amount = arguments[3];
        var currency = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'GBP';

        return this.payment.makeLocalPayment(accessToken, destinationAccountUid, reference, amount, currency);
      }
    }, {
      key: 'getContacts',
      value: function getContacts() {
        var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.config.accessToken;

        return this.contact.getContacts(accessToken);
      }
    }, {
      key: 'getContactAccount',
      value: function getContactAccount() {
        var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.config.accessToken;
        var contactId = arguments[1];

        return this.contact.getContactAccount(accessToken, contactId);
      }
    }, {
      key: 'createContact',
      value: function createContact() {
        var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.config.accessToken;
        var name = arguments[1];
        var accountType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'UK_ACCOUNT_AND_SORT_CODE';
        var accountNumber = arguments[3];
        var sortCode = arguments[4];
        var customerId = arguments[5];

        return this.contact.createContact(accessToken, name, accountType, accountNumber, sortCode, customerId);
      }
    }, {
      key: 'deleteContact',
      value: function deleteContact(accessToken, contactId) {
        return this.contact.deleteContact(accessToken, contactId);
      }
    }, {
      key: 'listSavingsGoals',
      value: function listSavingsGoals() {
        var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.config.accessToken;

        return this.savingsGoals.listSavingsGoals(accessToken);
      }
    }, {
      key: 'getSavingsGoal',
      value: function getSavingsGoal() {
        var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.config.accessToken;
        var savingsGoalId = arguments[1];

        return this.savingsGoals.getSavingsGoal(accessToken, savingsGoalId);
      }
    }, {
      key: 'addMoneyToSavingsGoal',
      value: function addMoneyToSavingsGoal() {
        var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.config.accessToken;
        var savingsGoalId = arguments[1];
        var transactionId = arguments[2];
        var amount = arguments[3];
        var currency = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'GBP';

        return this.savingsGoals.addMoneyToSavingsGoal(accessToken, savingsGoalId, transactionId, amount, currency);
      }
    }, {
      key: 'createSavingsGoal',
      value: function createSavingsGoal() {
        var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.config.accessToken;
        var savingsGoalId = arguments[1];
        var name = arguments[2];
        var currency = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'GBP';
        var targetAmount = arguments[4];
        var targetCurrency = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'GBP';
        var base64EncodedPhoto = arguments[6];

        return this.savingsGoals.createSavingsGoal(accessToken, savingsGoalId, name, currency, targetAmount, targetCurrency, base64EncodedPhoto);
      }
    }, {
      key: 'deleteSavingsGoal',
      value: function deleteSavingsGoal(accessToken, savingsGoalId) {
        return this.savingsGoals.deleteSavingsGoal(accessToken, savingsGoalId);
      }
    }, {
      key: 'getCard',
      value: function getCard() {
        var accessToken = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.config.accessToken;

        return this.card.getCard(accessToken);
      }
    }, {
      key: 'getAccessToken',
      value: function getAccessToken(authorizationCode) {
        return this.oAuth.getAccessToken(authorizationCode);
      }
    }, {
      key: 'refreshAccessToken',
      value: function refreshAccessToken(refreshToken) {
        return this.oAuth.refreshAccessToken(refreshToken);
      }
    }]);

    return Starling;
  }();

  module.exports = Starling;
});

},{"./entities/account":22,"./entities/address":23,"./entities/card":24,"./entities/contact":25,"./entities/customer":26,"./entities/mandate":27,"./entities/oauth":28,"./entities/payment":29,"./entities/savingsGoals":30,"./entities/transaction":31,"./entities/whoAmI":32}],34:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.http = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var defaultHeaders = exports.defaultHeaders = function defaultHeaders(accessToken) {
    return {
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken
    };
  };

  var postHeaders = exports.postHeaders = function postHeaders(accessToken) {
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + accessToken
    };
  };
});

},{}],35:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.validator = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var runRules = function runRules(pos, name, rules, value) {
    var valueType = typeof value === 'undefined' ? 'undefined' : _typeof(value);

    if (rules[0] == 'optional') {
      if (value && valueType !== rules[1]) {
        return name + ' parameter in position ' + pos + ' is an optional ' + rules[1] + ' but was ' + valueType;
      }
    }
    if (rules[0] == 'required') {
      if (value && valueType !== rules[1]) {
        return name + ' parameter in position ' + pos + ' is a required ' + rules[1] + ' but was ' + valueType;
      } else if (!value) {
        return name + ' parameter in position ' + pos + ' is a required ' + rules[1] + ' but was ' + value;
      }
    }
  };

  var typeValidation = exports.typeValidation = function typeValidation(args, def) {
    var problems = [];
    for (var i = 0; i < def.length; i++) {
      var pos = i;
      var name = def[i].name;
      var rules = def[i].validations;
      var value = i <= args.length ? args[i] : undefined;
      var problem = runRules(pos, name, rules, value);
      if (problem) problems.push(problem);
    }

    if (problems.length) {
      throw problems;
    }
  };
});

},{}]},{},[33])(33)
});

//# sourceMappingURL=starling.bundle.js.map
