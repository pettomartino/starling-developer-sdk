(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.starling = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"../utils/http":13,"../utils/validator":14,"axios":undefined,"debug":undefined}],2:[function(require,module,exports){
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

},{"../utils/http":13,"../utils/validator":14,"axios":undefined,"debug":undefined}],3:[function(require,module,exports){
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

},{"../utils/http":13,"../utils/validator":14,"axios":undefined,"debug":undefined}],4:[function(require,module,exports){
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

},{"../utils/http":13,"../utils/validator":14,"axios":undefined,"debug":undefined}],5:[function(require,module,exports){
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

},{"../utils/http":13,"../utils/validator":14,"axios":undefined,"debug":undefined}],6:[function(require,module,exports){
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

},{"../utils/http":13,"../utils/validator":14,"axios":undefined,"debug":undefined}],7:[function(require,module,exports){
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

},{"../utils/validator":14,"axios":undefined,"debug":undefined}],8:[function(require,module,exports){
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

},{"../utils/http":13,"../utils/validator":14,"axios":undefined,"debug":undefined}],9:[function(require,module,exports){
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

},{"../utils/http":13,"../utils/validator":14,"axios":undefined,"debug":undefined}],10:[function(require,module,exports){
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

},{"../utils/http":13,"../utils/validator":14,"axios":undefined,"debug":undefined}],11:[function(require,module,exports){
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

},{"../utils/http":13,"../utils/validator":14,"axios":undefined,"debug":undefined}],12:[function(require,module,exports){
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

},{"./entities/account":1,"./entities/address":2,"./entities/card":3,"./entities/contact":4,"./entities/customer":5,"./entities/mandate":6,"./entities/oauth":7,"./entities/payment":8,"./entities/savingsGoals":9,"./entities/transaction":10,"./entities/whoAmI":11}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{}]},{},[12])(12)
});

//# sourceMappingURL=starling.js.map
