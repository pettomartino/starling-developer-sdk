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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0YXJsaW5nLmpzIl0sIm5hbWVzIjpbIlN0YXJsaW5nIiwib3B0aW9ucyIsImRlZmF1bHRzIiwiYXBpVXJsIiwib2F1dGhVcmwiLCJjbGllbnRJZCIsImNsaWVudFNlY3JldCIsImNvbmZpZyIsIk9iamVjdCIsImFzc2lnbiIsIndob0FtSSIsIldob0FtSSIsImN1c3RvbWVyIiwiQ3VzdG9tZXIiLCJhY2NvdW50IiwiQWNjb3VudCIsImFkZHJlc3MiLCJBZGRyZXNzIiwidHJhbnNhY3Rpb24iLCJUcmFuc2FjdGlvbiIsInBheW1lbnQiLCJQYXltZW50IiwibWFuZGF0ZSIsIk1hbmRhdGUiLCJjb250YWN0IiwiQ29udGFjdCIsImNhcmQiLCJDYXJkIiwic2F2aW5nc0dvYWxzIiwiU2F2aW5nc0dvYWxzIiwib0F1dGgiLCJPQXV0aCIsImFjY2Vzc1Rva2VuIiwiZ2V0TWUiLCJnZXRDdXN0b21lciIsImdldEFjY291bnQiLCJnZXRCYWxhbmNlIiwiZ2V0QWRkcmVzc2VzIiwiZnJvbURhdGUiLCJ0b0RhdGUiLCJzb3VyY2UiLCJnZXRUcmFuc2FjdGlvbnMiLCJ0cmFuc2FjdGlvbklkIiwiZ2V0VHJhbnNhY3Rpb24iLCJsaXN0TWFuZGF0ZXMiLCJtYW5kYXRlSWQiLCJkZWxldGVNYW5kYXRlIiwibGlzdFNjaGVkdWxlZFBheW1lbnRzIiwiZGVzdGluYXRpb25BY2NvdW50VWlkIiwicmVmZXJlbmNlIiwiYW1vdW50IiwiY3VycmVuY3kiLCJtYWtlTG9jYWxQYXltZW50IiwiZ2V0Q29udGFjdHMiLCJjb250YWN0SWQiLCJnZXRDb250YWN0QWNjb3VudCIsIm5hbWUiLCJhY2NvdW50VHlwZSIsImFjY291bnROdW1iZXIiLCJzb3J0Q29kZSIsImN1c3RvbWVySWQiLCJjcmVhdGVDb250YWN0IiwiZGVsZXRlQ29udGFjdCIsImxpc3RTYXZpbmdzR29hbHMiLCJzYXZpbmdzR29hbElkIiwiZ2V0U2F2aW5nc0dvYWwiLCJhZGRNb25leVRvU2F2aW5nc0dvYWwiLCJ0YXJnZXRBbW91bnQiLCJ0YXJnZXRDdXJyZW5jeSIsImJhc2U2NEVuY29kZWRQaG90byIsImNyZWF0ZVNhdmluZ3NHb2FsIiwiZGVsZXRlU2F2aW5nc0dvYWwiLCJnZXRDYXJkIiwiYXV0aG9yaXphdGlvbkNvZGUiLCJnZXRBY2Nlc3NUb2tlbiIsInJlZnJlc2hUb2tlbiIsInJlZnJlc2hBY2Nlc3NUb2tlbiIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFlTUEsUTs7QUFFSjs7OztBQUlBLHNCQUFhQyxPQUFiLEVBQXNCO0FBQUE7O0FBQ3BCLFVBQU1DLFdBQVc7QUFDZkMsZ0JBQVEsOEJBRE87QUFFZkMsa0JBQVUsZ0NBRks7QUFHZkMsa0JBQVUsRUFISztBQUlmQyxzQkFBYztBQUpDLE9BQWpCOztBQU9BLFdBQUtDLE1BQUwsR0FBY0MsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JQLFFBQWxCLEVBQTRCRCxPQUE1QixDQUFkOztBQUVBLFdBQUtTLE1BQUwsR0FBYyxJQUFJQyxnQkFBSixDQUFXLEtBQUtKLE1BQWhCLENBQWQ7QUFDQSxXQUFLSyxRQUFMLEdBQWdCLElBQUlDLGtCQUFKLENBQWEsS0FBS04sTUFBbEIsQ0FBaEI7QUFDQSxXQUFLTyxPQUFMLEdBQWUsSUFBSUMsaUJBQUosQ0FBWSxLQUFLUixNQUFqQixDQUFmO0FBQ0EsV0FBS1MsT0FBTCxHQUFlLElBQUlDLGlCQUFKLENBQVksS0FBS1YsTUFBakIsQ0FBZjtBQUNBLFdBQUtXLFdBQUwsR0FBbUIsSUFBSUMscUJBQUosQ0FBZ0IsS0FBS1osTUFBckIsQ0FBbkI7QUFDQSxXQUFLYSxPQUFMLEdBQWUsSUFBSUMsaUJBQUosQ0FBWSxLQUFLZCxNQUFqQixDQUFmO0FBQ0EsV0FBS2UsT0FBTCxHQUFlLElBQUlDLGlCQUFKLENBQVksS0FBS2hCLE1BQWpCLENBQWY7QUFDQSxXQUFLaUIsT0FBTCxHQUFlLElB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QUFDakMsZUFBTyxLQUFLM0MsS0FBTCxDQUFXNEMsY0FBWCxDQUEwQkQsaUJBQTFCLENBQVA7QUFDRDs7O3lDQVFtQkUsWSxFQUFjO0FBQ2hDLGVBQU8sS0FBSzdDLEtBQUwsQ0FBVzhDLGtCQUFYLENBQThCRCxZQUE5QixDQUFQO0FBQ0Q7Ozs7OztBQUdIRSxTQUFPQyxPQUFQLEdBQWlCOUUsUUFBakIiLCJmaWxlIjoic3RhcmxpbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ3VzdG9tZXIgZnJvbSAnLi9lbnRpdGllcy9jdXN0b21lcic7XG5pbXBvcnQgQWNjb3VudCBmcm9tICcuL2VudGl0aWVzL2FjY291bnQnO1xuaW1wb3J0IEFkZHJlc3MgZnJvbSAnLi9lbnRpdGllcy9hZGRyZXNzJztcbmltcG9ydCBUcmFuc2FjdGlvbiBmcm9tICcuL2VudGl0aWVzL3RyYW5zYWN0aW9uJztcbmltcG9ydCBDYXJkIGZyb20gJy4vZW50aXRpZXMvY2FyZCc7XG5pbXBvcnQgT0F1dGggZnJvbSAnLi9lbnRpdGllcy9vYXV0aCc7XG5pbXBvcnQgQ29udGFjdCBmcm9tICcuL2VudGl0aWVzL2NvbnRhY3QnO1xuaW1wb3J0IFBheW1lbnQgZnJvbSAnLi9lbnRpdGllcy9wYXltZW50JztcbmltcG9ydCBNYW5kYXRlIGZyb20gJy4vZW50aXRpZXMvbWFuZGF0ZSc7XG5pbXBvcnQgU2F2aW5nc0dvYWxzIGZyb20gJy4vZW50aXRpZXMvc2F2aW5nc0dvYWxzJztcbmltcG9ydCBXaG9BbUkgZnJvbSAnLi9lbnRpdGllcy93aG9BbUknO1xuXG4vKipcbiAqIEZhY2FkZSB0byBkaXNwYXRjaCBvcGVyYXRpb25zIHRvIHNlcnZpY2VzXG4gKi9cbmNsYXNzIFN0YXJsaW5nIHtcblxuICAvKipcbiAgICogQ3JlYXRlIGFuIGluc3RhbmNlIG9mIHRoZSBzdGFybGluZyBjbGllbnRcbiAgICogQHBhcmFtIHtPYmplY3Q9fSBvcHRpb25zIC0gY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzXG4gICAqL1xuICBjb25zdHJ1Y3RvciAob3B0aW9ucykge1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgYXBpVXJsOiAnaHR0cHM6Ly9hcGkuc3RhcmxpbmdiYW5rLmNvbScsXG4gICAgICBvYXV0aFVybDogJ2h0dHBzOi8vb2F1dGguc3RhcmxpbmdiYW5rLmNvbScsXG4gICAgICBjbGllbnRJZDogJycsXG4gICAgICBjbGllbnRTZWNyZXQ6ICcnXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlnID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy53aG9BbUkgPSBuZXcgV2hvQW1JKHRoaXMuY29uZmlnKTtcbiAgICB0aGlzLmN1c3RvbWVyID0gbmV3IEN1c3RvbWVyKHRoaXMuY29uZmlnKTtcbiAgICB0aGlzLmFjY291bnQgPSBuZXcgQWNjb3VudCh0aGlzLmNvbmZpZyk7XG4gICAgdGhpcy5hZGRyZXNzID0gbmV3IEFkZHJlc3ModGhpcy5jb25maWcpO1xuICAgIHRoaXMudHJhbnNhY3Rpb24gPSBuZXcgVHJhbnNhY3Rpb24odGhpcy5jb25maWcpO1xuICAgIHRoaXMucGF5bWVudCA9IG5ldyBQYXltZW50KHRoaXMuY29uZmlnKTtcbiAgICB0aGlzLm1hbmRhdGUgPSBuZXcgTWFuZGF0ZSh0aGlzLmNvbmZpZyk7XG4gICAgdGhpcy5jb250YWN0ID0gbmV3IENvbnRhY3QodGhpcy5jb25maWcpO1xuICAgIHRoaXMuY2FyZCA9IG5ldyBDYXJkKHRoaXMuY29uZmlnKTtcbiAgICB0aGlzLnNhdmluZ3NHb2FscyA9IG5ldyBTYXZpbmdzR29hbHModGhpcy5jb25maWcpO1xuICAgIHRoaXMub0F1dGggPSBuZXcgT0F1dGgodGhpcy5jb25maWcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGN1c3RvbWVyIFVVSUQgYW5kIHBlcm1pc3Npb25zIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGFjY2VzcyB0b2tlbiBwYXNzZWRcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBhY2Nlc3NUb2tlbiAtIHRoZSBvYXV0aCBiZWFyZXIgdG9rZW4uICBJZiBub3RcbiAgICogc3BlY2lmaWVkLCB0aGUgYWNjZXNzVG9rZW4gb24gdGhlIG9wdGlvbnMgb2JqZWN0IGlzIHVzZWQuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIGh0dHAgcmVxdWVzdCBwcm9taXNlXG4gICAqL1xuICBnZXRNZSAoYWNjZXNzVG9rZW4gPSB0aGlzLmNvbmZpZy5hY2Nlc3NUb2tlbikge1xuICAgIHJldHVybiB0aGlzLndob0FtSS5nZXRNZShhY2Nlc3NUb2tlbik7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgY3VzdG9tZXIncyBkZXRhaWxzXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gYWNjZXNzVG9rZW4gLSB0aGUgb2F1dGggYmVhcmVyIHRva2VuLiBJZiBub3RcbiAgICogc3BlY2lmaWVkLCB0aGUgYWNjZXNzVG9rZW4gb24gdGhlIG9wdGlvbnMgb2JqZWN0IGlzIHVzZWQuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIGh0dHAgcmVxdWVzdCBwcm9taXNlXG4gICAqL1xuICBnZXRDdXN0b21lciAoYWNjZXNzVG9rZW4gPSB0aGlzLmNvbmZpZy5hY2Nlc3NUb2tlbikge1xuICAgIHJldHVybiB0aGlzLmN1c3RvbWVyLmdldEN1c3RvbWVyKGFjY2Vzc1Rva2VuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBjdXN0b21lcidzIGFjY291bnQgZGV0YWlsc1xuICAgKiBAcGFyYW0ge3N0cmluZz19IGFjY2Vzc1Rva2VuIC0gdGhlIG9hdXRoIGJlYXJlciB0b2tlbi4gIElmIG5vdFxuICAgKiBzcGVjaWZpZWQsIHRoZSBhY2Nlc3NUb2tlbiBvbiB0aGUgb3B0aW9ucyBvYmplY3QgaXMgdXNlZC5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgaHR0cCByZXF1ZXN0IHByb21pc2VcbiAgICovXG4gIGdldEFjY291bnQgKGFjY2Vzc1Rva2VuID0gdGhpcy5jb25maWcuYWNjZXNzVG9rZW4pIHtcbiAgICByZXR1cm4gdGhpcy5hY2NvdW50LmdldEFjY291bnQoYWNjZXNzVG9rZW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGN1c3RvbWVyJ3MgYmFsYW5jZVxuICAgKiBAcGFyYW0ge3N0cmluZz19IGFjY2Vzc1Rva2VuIC0gdGhlIG9hdXRoIGJlYXJlciB0b2tlbi4gIElmIG5vdFxuICAgKiBzcGVjaWZpZWQsIHRoZSBhY2Nlc3NUb2tlbiBvbiB0aGUgb3B0aW9ucyBvYmplY3QgaXMgdXNlZC5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgaHR0cCByZXF1ZXN0IHByb21pc2VcbiAgICovXG4gIGdldEJhbGFuY2UgKGFjY2Vzc1Rva2VuID0gdGhpcy5jb25maWcuYWNjZXNzVG9rZW4pIHtcbiAgICByZXR1cm4gdGhpcy5hY2NvdW50LmdldEJhbGFuY2UoYWNjZXNzVG9rZW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGN1c3RvbWVyJ3MgYWRkcmVzc2VzIChjdXJyZW50IGFuZCBwcmV2aW91cylcbiAgICogQHBhcmFtIHtzdHJpbmc9fSBhY2Nlc3NUb2tlbiAtIHRoZSBvYXV0aCBiZWFyZXIgdG9rZW4uICBJZiBub3RcbiAgICogc3BlY2lmaWVkLCB0aGUgYWNjZXNzVG9rZW4gb24gdGhlIG9wdGlvbnMgb2JqZWN0IGlzIHVzZWQuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIGh0dHAgcmVxdWVzdCBwcm9taXNlXG4gICAqL1xuICBnZXRBZGRyZXNzZXMgKGFjY2Vzc1Rva2VuID0gdGhpcy5jb25maWcuYWNjZXNzVG9rZW4pIHtcbiAgICByZXR1cm4gdGhpcy5hZGRyZXNzLmdldEFkZHJlc3NlcyhhY2Nlc3NUb2tlbik7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgY3VzdG9tZXIncyB0cmFuc2FjdGlvbiBoaXN0b3J5XG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gYWNjZXNzVG9rZW4gLSB0aGUgb2F1dGggYmVhcmVyIHRva2VuLiAgSWYgbm90XG4gICAqIHNwZWNpZmllZCwgdGhlIGFjY2Vzc1Rva2VuIG9uIHRoZSBvcHRpb25zIG9iamVjdCBpcyB1c2VkLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZnJvbURhdGUgLSBmaWx0ZXIgdHJhbnNhY3Rpb25zIGFmdGVyIHRoaXMgZGF0ZS4gRm9ybWF0OiBZWVlZLU1NLUREIChvcHRpb25hbCxcbiAgICogICBkZWZhdWx0cyB0byBtb3N0IHJlY2VudCAxMDAgdHJhbnNhY3Rpb25zKVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9EYXRlIC0gZmlsdGVyIHRyYW5zYWN0aW9ucyBiZWZvcmUgdGhpcyBkYXRlLiBGb3JtYXQ6IFlZWVktTU0tREQgKG9wdGlvbmFsLFxuICAgKiAgIGRlZmF1bHRzIHRvIGN1cnJlbnQgZGF0ZSBpZiBub3QgcHJvdmlkZWQpXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc291cmNlIC0gdGhlIHRyYW5zYWN0aW9uIHR5cGUgKGUuZy4gZmFzdGVyIHBheW1lbnRzLCBtYXN0ZXJjYXJkKS5cbiAgICogSWYgbm90IHNwZWNpZmllZCwgcmVzdWx0cyBhcmUgbm90IGZpbHRlcmVkIGJ5IHNvdXJjZS5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgaHR0cCByZXF1ZXN0IHByb21pc2VcbiAgICovXG4gIGdldFRyYW5zYWN0aW9ucyAoYWNjZXNzVG9rZW4gPSB0aGlzLmNvbmZpZy5hY2Nlc3NUb2tlbiwgZnJvbURhdGUsIHRvRGF0ZSwgc291cmNlKSB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNhY3Rpb24uZ2V0VHJhbnNhY3Rpb25zKGFjY2Vzc1Rva2VuLCBmcm9tRGF0ZSwgdG9EYXRlLCBzb3VyY2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGZ1bGwgZGV0YWlscyBvZiBhIHNpbmdsZSB0cmFuc2FjdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZz19IGFjY2Vzc1Rva2VuIC0gdGhlIG9hdXRoIGJlYXJlciB0b2tlbi4gIElmIG5vdFxuICAgKiBzcGVjaWZpZWQsIHRoZSBhY2Nlc3NUb2tlbiBvbiB0aGUgb3B0aW9ucyBvYmplY3QgaXMgdXNlZC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRyYW5zYWN0aW9uSWQgLSB0aGUgdW5pcXVlIHRyYW5zYWN0aW9uIElEXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gc291cmNlIC0gdGhlIHRyYW5zYWN0aW9uIHR5cGUgKGUuZy4gZmFzdGVyIHBheW1lbnRzLCBtYXN0ZXJjYXJkKS5cbiAgICogSWYgbm90IHNwZWNpZmllZCwgb25seSBnZW5lcmljIHRyYW5zYWN0aW9uIGluZm9ybWF0aW9uIHdpbGwgYmUgcmV0dXJuZWQuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIGh0dHAgcmVxdWVzdCBwcm9taXNlXG4gICAqL1xuICBnZXRUcmFuc2FjdGlvbiAoYWNjZXNzVG9rZW4gPSB0aGlzLmNvbmZpZy5hY2Nlc3NUb2tlbiwgdHJhbnNhY3Rpb25JZCwgc291cmNlKSB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNhY3Rpb24uZ2V0VHJhbnNhY3Rpb24oYWNjZXNzVG9rZW4sIHRyYW5zYWN0aW9uSWQsIHNvdXJjZSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgY3VzdG9tZXIncyBjdXJyZW50IGRpcmVjdC1kZWJpdCBtYW5kYXRlc1xuICAgKiBAcGFyYW0ge3N0cmluZz19IGFjY2Vzc1Rva2VuIC0gdGhlIG9hdXRoIGJlYXJlciB0b2tlbi4gIElmIG5vdFxuICAgKiBzcGVjaWZpZWQsIHRoZSBhY2Nlc3NUb2tlbiBvbiB0aGUgb3B0aW9ucyBvYmplY3QgaXMgdXNlZC5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgaHR0cCByZXF1ZXN0IHByb21pc2VcbiAgICovXG4gIGxpc3RNYW5kYXRlcyAoYWNjZXNzVG9rZW4gPSB0aGlzLmNvbmZpZy5hY2Nlc3NUb2tlbikge1xuICAgIHJldHVybiB0aGlzLm1hbmRhdGUubGlzdE1hbmRhdGVzKGFjY2Vzc1Rva2VuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGVzIHNwZWNpZmljIGRpcmVjdCBkZWJpdCBtYW5kYXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhY2Nlc3NUb2tlbiAtIHRoZSBvYXV0aCBiZWFyZXIgdG9rZW4uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtYW5kYXRlSWQgLSB0aGUgdW5pcXVlIG1hbmRhdGUgSURcbiAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgaHR0cCByZXF1ZXN0IHByb21pc2VcbiAgICovXG4gIGRlbGV0ZU1hbmRhdGUgKGFjY2Vzc1Rva2VuID0gdGhpcy5jb25maWcuYWNjZXNzVG9rZW4sIG1hbmRhdGVJZCkge1xuICAgIHJldHVybiB0aGlzLm1hbmRhdGUuZGVsZXRlTWFuZGF0ZShhY2Nlc3NUb2tlbiwgbWFuZGF0ZUlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMaXN0cyB0aGUgY3VzdG9tZXIncyBzY2hlZHVsZWQgcGF5bWVudHNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGFjY2Vzc1Rva2VuIC0gdGhlIG9hdXRoIGJlYXJlciB0b2tlbi5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgaHR0cCByZXF1ZXN0IHByb21pc2VcbiAgICovXG4gIGxpc3RTY2hlZHVsZWRQYXltZW50cyAoYWNjZXNzVG9rZW4gPSB0aGlzLmNvbmZpZy5hY2Nlc3NUb2tlbikge1xuICAgIHJldHVybiB0aGlzLnBheW1lbnQubGlzdFNjaGVkdWxlZFBheW1lbnRzKGFjY2Vzc1Rva2VuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlcyBhIHBheW1lbnQgb24gYmVoYWxmIG9mIHRoZSBjdXN0b21lciB0byBhbm90aGVyIFVLIGJhbmsgYWNjb3VudCB1c2luZyB0aGUgRmFzdGVyIFBheW1lbnRzIG5ldHdvcmtcbiAgICogQHBhcmFtIHtzdHJpbmd9IGFjY2Vzc1Rva2VuIC0gdGhlIG9hdXRoIGJlYXJlciB0b2tlbi5cbiAgICogIEBwYXJhbSB7c3RyaW5nfSBkZXN0aW5hdGlvbkFjY291bnRVaWQgLSB0aGUgYWNjb3VudCBpZGVudGlmaWVyIG9mIHRoZSByZWNpcGllbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlZmVyZW5jZSAtIFRoZSBwYXltZW50IHJlZmVyZW5jZSwgbWF4LiAxOCBjaGFyYWN0ZXJzLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gYW1vdW50IC0gdGhlIGFtb3VudCB0byBiZSBzZW5kLlxuICAgKiBAcGFyYW0ge3N0cmluZz19IGN1cnJlbmN5IC0gdGhlIGN1cnJlbmN5LCBvcHRpb25hbCwgZGVmYXVsdHMgdG8gXCJHQlBcIi5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgaHR0cCByZXF1ZXN0IHByb21pc2VcbiAgICovXG4gIG1ha2VMb2NhbFBheW1lbnQgKGFjY2Vzc1Rva2VuID0gdGhpcy5jb25maWcuYWNjZXNzVG9rZW4sIGRlc3RpbmF0aW9uQWNjb3VudFVpZCwgcmVmZXJlbmNlLCBhbW91bnQsIGN1cnJlbmN5ID0gJ0dCUCcpIHtcbiAgICByZXR1cm4gdGhpcy5wYXltZW50Lm1ha2VMb2NhbFBheW1lbnQoYWNjZXNzVG9rZW4sIGRlc3RpbmF0aW9uQWNjb3VudFVpZCwgcmVmZXJlbmNlLCBhbW91bnQsIGN1cnJlbmN5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBjdXN0b21lcidzIGNvbnRhY3RzIChwYXllZXMpXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhY2Nlc3NUb2tlbiAtIHRoZSBvYXV0aCBiZWFyZXIgdG9rZW4uXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIGh0dHAgcmVxdWVzdCBwcm9taXNlXG4gICAqL1xuICBnZXRDb250YWN0cyAoYWNjZXNzVG9rZW4gPSB0aGlzLmNvbmZpZy5hY2Nlc3NUb2tlbikge1xuICAgIHJldHVybiB0aGlzLmNvbnRhY3QuZ2V0Q29udGFjdHMoYWNjZXNzVG9rZW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSBzcGVjaWZpYyBjb250YWN0IChwYXllZSlcbiAgICogQHBhcmFtIHtzdHJpbmd9IGFjY2Vzc1Rva2VuIC0gdGhlIG9hdXRoIGJlYXJlciB0b2tlbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbnRhY3RJZCAtIHRoZSBjb250YWN0J3MgSUQuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIGh0dHAgcmVxdWVzdCBwcm9taXNlXG4gICAqL1xuICBnZXRDb250YWN0QWNjb3VudCAoYWNjZXNzVG9rZW4gPSB0aGlzLmNvbmZpZy5hY2Nlc3NUb2tlbiwgY29udGFjdElkKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGFjdC5nZXRDb250YWN0QWNjb3VudChhY2Nlc3NUb2tlbiwgY29udGFjdElkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgY29udGFjdCAocGF5ZWUpIGZvciB0aGUgY3VzdG9tZXJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGFjY2Vzc1Rva2VuIC0gdGhlIG9hdXRoIGJlYXJlciB0b2tlbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgbmV3IGNvbnRhY3QuXG4gICAqIEBwYXJhbSB7c3RyaW5nPX0gYWNjb3VudFR5cGUgLSB0aGUgYWNjb3VudCB0eXBlIChkb21lc3RpYyBvciBpbnRlcm5hdGlvbmFsKSwgb3B0aW9uYWwgYW5kIGRlZmF1bHRzIHRvXG4gICAqICAgVUtfQUNDT1VOVF9BTkRfU09SVF9DT0RFLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gYWNjb3VudE51bWJlciAtIHRoZSBjb250YWN0J3MgYmFuayBhY2NvdW50IG51bWJlci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHNvcnRDb2RlIC0gdGhlIGNvbnRhY3QncyBzb3J0IGNvZGUuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjdXN0b21lcklkIC0gdGhlIGN1c3RvbWVyJ3MgSUQuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIGh0dHAgcmVxdWVzdCBwcm9taXNlXG4gICAqL1xuICBjcmVhdGVDb250YWN0IChhY2Nlc3NUb2tlbiA9IHRoaXMuY29uZmlnLmFjY2Vzc1Rva2VuLCBuYW1lLCBhY2NvdW50VHlwZSA9ICdVS19BQ0NPVU5UX0FORF9TT1JUX0NPREUnLCBhY2NvdW50TnVtYmVyLCBzb3J0Q29kZSwgY3VzdG9tZXJJZCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRhY3QuY3JlYXRlQ29udGFjdChhY2Nlc3NUb2tlbiwgbmFtZSwgYWNjb3VudFR5cGUsIGFjY291bnROdW1iZXIsIHNvcnRDb2RlLCBjdXN0b21lcklkKTtcbiAgfVxuXG4gIGRlbGV0ZUNvbnRhY3QgKGFjY2Vzc1Rva2VuLCBjb250YWN0SWQpIHtcbiAgICByZXR1cm4gdGhpcy5jb250YWN0LmRlbGV0ZUNvbnRhY3QoYWNjZXNzVG9rZW4sIGNvbnRhY3RJZCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIGxpc3Qgb2YgdGhlIGN1c3RvbWVyJ3Mgc2F2aW5ncyBnb2Fsc1xuICAgKiBAcGFyYW0ge3N0cmluZ30gYWNjZXNzVG9rZW4gLSB0aGUgb2F1dGggYmVhcmVyIHRva2VuLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBodHRwIHJlcXVlc3QgcHJvbWlzZVxuICAgKi9cbiAgbGlzdFNhdmluZ3NHb2FscyAoYWNjZXNzVG9rZW4gPSB0aGlzLmNvbmZpZy5hY2Nlc3NUb2tlbikge1xuICAgIHJldHVybiB0aGlzLnNhdmluZ3NHb2Fscy5saXN0U2F2aW5nc0dvYWxzKGFjY2Vzc1Rva2VuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgc3BlY2lmaWMgc2F2aW5ncyBnb2FsXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhY2Nlc3NUb2tlbiAtIHRoZSBvYXV0aCBiZWFyZXIgdG9rZW4uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzYXZpbmdzR29hbElkIC0gdGhlIHNhdmluZ3MgZ29hbCdzIElELlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBodHRwIHJlcXVlc3QgcHJvbWlzZVxuICAgKi9cbiAgZ2V0U2F2aW5nc0dvYWwgKGFjY2Vzc1Rva2VuID0gdGhpcy5jb25maWcuYWNjZXNzVG9rZW4sIHNhdmluZ3NHb2FsSWQpIHtcbiAgICByZXR1cm4gdGhpcy5zYXZpbmdzR29hbHMuZ2V0U2F2aW5nc0dvYWwoYWNjZXNzVG9rZW4sIHNhdmluZ3NHb2FsSWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBtb25leSB0byBhIHNwZWNpZmljIHNhdmluZ3MgZ29hbFxuICAgKiBAcGFyYW0ge3N0cmluZ30gYWNjZXNzVG9rZW4gLSB0aGUgb2F1dGggYmVhcmVyIHRva2VuLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2F2aW5nc0dvYWxJZCAtIHRoZSBzYXZpbmdzIGdvYWwncyBJRC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRyYW5zYWN0aW9uSWQgLSBhIHRyYW5zYWN0aW9uIElEIGZvciB0aGlzIHRyYW5zYWN0aW9uXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhbW91bnQgLSBhbiBhbW91bnQgaW4gbWlub3IgdW5pdFxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIHRoZSBodHRwIHJlcXVlc3QgcHJvbWlzZVxuICAgKi9cbiAgYWRkTW9uZXlUb1NhdmluZ3NHb2FsIChhY2Nlc3NUb2tlbiA9IHRoaXMuY29uZmlnLmFjY2Vzc1Rva2VuLCBzYXZpbmdzR29hbElkLCB0cmFuc2FjdGlvbklkLCBhbW91bnQsIGN1cnJlbmN5ID0gJ0dCUCcpIHtcbiAgICByZXR1cm4gdGhpcy5zYXZpbmdzR29hbHMuYWRkTW9uZXlUb1NhdmluZ3NHb2FsKFxuICAgICAgYWNjZXNzVG9rZW4sXG4gICAgICBzYXZpbmdzR29hbElkLFxuICAgICAgdHJhbnNhY3Rpb25JZCxcbiAgICAgIGFtb3VudCxcbiAgICAgIGN1cnJlbmN5XG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgY29udGFjdCAocGF5ZWUpIGZvciB0aGUgY3VzdG9tZXJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGFjY2Vzc1Rva2VuIC0gdGhlIG9hdXRoIGJlYXJlciB0b2tlbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHNhdmluZ3NHb2FsSWQgLSB0aGUgc2F2aW5ncyBnb2FsJ3MgSUQsIGdlbmVyYXRlIG9uZSBpZiBjcmVhdGluZyBhIGdvYWwuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gdGhlIG5hbWUgb2YgdGhlIG5ldyBjb250YWN0LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY3VycmVuY3kgLSB0aGUgY3VycmVuY3kgb2YgdGhlIHNhdmluZ3MgZ29hbC4gRGVmYXVsdHMgdG8gJ0dCUCcuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0YXJnZXRBbW91bnQgLSB0aGUgdGFyZ2V0IGFtb3VudCBpbiBtaW5vciB1bml0cyAoZS5nLiAxMjM0ID0+IMKjMTIuMzQpLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGFyZ2V0Q3VycmVuY3kgLSB0aGUgdGFyZ2V0IGN1cnJlbmN5LCBhbHNvIGRlZmF1bHRzIHRvICdHQlAnLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gYmFzZTY0RW5jb2RlZFBob3RvIC0gYmFzZTY0IGVuY29kZWQgaW1hZ2UgdG8gYXNzb2NpYXRlIHdpdGggdGhlIGdvYWwuIChvcHRpb25hbClcbiAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgaHR0cCByZXF1ZXN0IHByb21pc2VcbiAgICovXG4gIGNyZWF0ZVNhdmluZ3NHb2FsIChhY2Nlc3NUb2tlbiA9IHRoaXMuY29uZmlnLmFjY2Vzc1Rva2VuLCBzYXZpbmdzR29hbElkLCBuYW1lLCBjdXJyZW5jeSA9ICdHQlAnLCAgdGFyZ2V0QW1vdW50LCB0YXJnZXRDdXJyZW5jeSA9ICdHQlAnLCBiYXNlNjRFbmNvZGVkUGhvdG8pIHtcbiAgICByZXR1cm4gdGhpcy5zYXZpbmdzR29hbHMuY3JlYXRlU2F2aW5nc0dvYWwoYWNjZXNzVG9rZW4sIHNhdmluZ3NHb2FsSWQsIG5hbWUsIGN1cnJlbmN5LCAgdGFyZ2V0QW1vdW50LCB0YXJnZXRDdXJyZW5jeSwgYmFzZTY0RW5jb2RlZFBob3RvKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGVzIHNwZWNpZmljIGRpcmVjdCBkZWJpdCBtYW5kYXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhY2Nlc3NUb2tlbiAtIHRoZSBvYXV0aCBiZWFyZXIgdG9rZW4uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzYXZpbmdzR29hbElkIC0gdGhlIHVuaXF1ZSBtYW5kYXRlIElEXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIGh0dHAgcmVxdWVzdCBwcm9taXNlXG4gICAqL1xuICBkZWxldGVTYXZpbmdzR29hbCAoYWNjZXNzVG9rZW4sIHNhdmluZ3NHb2FsSWQpIHtcbiAgICByZXR1cm4gdGhpcy5zYXZpbmdzR29hbHMuZGVsZXRlU2F2aW5nc0dvYWwoYWNjZXNzVG9rZW4sIHNhdmluZ3NHb2FsSWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGN1c3RvbWVyJ3MgY2FyZFxuICAgKiBAcGFyYW0ge3N0cmluZz19IGFjY2Vzc1Rva2VuIC0gdGhlIG9hdXRoIGJlYXJlciB0b2tlbi4gIElmIG5vdFxuICAgKiBzcGVjaWZpZWQsIHRoZSBhY2Nlc3NUb2tlbiBvbiB0aGUgb3B0aW9ucyBvYmplY3QgaXMgdXNlZC5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgaHR0cCByZXF1ZXN0IHByb21pc2VcbiAgICovXG4gIGdldENhcmQgKGFjY2Vzc1Rva2VuID0gdGhpcy5jb25maWcuYWNjZXNzVG9rZW4pIHtcbiAgICByZXR1cm4gdGhpcy5jYXJkLmdldENhcmQoYWNjZXNzVG9rZW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4Y2hhbmdlcyB0aGUgYXV0aG9yaXphdGlvbiBjb2RlIGZvciBhbiBhY2Nlc3MgdG9rZW5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGF1dGhvcml6YXRpb25Db2RlIC0gdGhlIGF1dGhvcml6YXRpb24gY29kZSwgYWNxdWlyZWQgZnJvbSB0aGUgdXNlciBhZ2VudCBhZnRlciB0aGVcbiAgICogdXNlciBhdXRoZW50aWNhdGVzIHdpdGggc3RhcmxpbmdcbiAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgaHR0cCByZXF1ZXN0IHByb21pc2VcbiAgICovXG4gIGdldEFjY2Vzc1Rva2VuIChhdXRob3JpemF0aW9uQ29kZSkge1xuICAgIHJldHVybiB0aGlzLm9BdXRoLmdldEFjY2Vzc1Rva2VuKGF1dGhvcml6YXRpb25Db2RlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGNoYW5nZXMgdGhlIGF1dGhvcml6YXRpb24gY29kZSBmb3IgYW4gYWNjZXNzIHRva2VuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZWZyZXNoVG9rZW4gLSB0aGUgb2F1dGggcmVmcmVzaCB0b2tlbiwgdXNlZCB0byBjbGFpbSBhIG5ldyBhY2Nlc3MgdG9rZW4gd2hlbiB0aGUgYWNjZXNzIHRva2VuXG4gICAqIGV4cGlyZXMuIEEgbmV3IHJlZnJlc2ggdG9rZW4gaXMgYWxzbyByZXR1cm5lZC5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgaHR0cCByZXF1ZXN0IHByb21pc2VcbiAgICovXG4gIHJlZnJlc2hBY2Nlc3NUb2tlbiAocmVmcmVzaFRva2VuKSB7XG4gICAgcmV0dXJuIHRoaXMub0F1dGgucmVmcmVzaEFjY2Vzc1Rva2VuKHJlZnJlc2hUb2tlbik7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTdGFybGluZztcbiJdfQ==
//# sourceMappingURL=starling.js.map
