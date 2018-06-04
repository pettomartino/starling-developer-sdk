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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVudGl0aWVzL3NhdmluZ3NHb2Fscy5qcyJdLCJuYW1lcyI6WyJsb2ciLCJTYXZpbmdzR29hbHMiLCJvcHRpb25zIiwiYWNjZXNzVG9rZW4iLCJhcmd1bWVudHMiLCJsaXN0U2F2aW5nc0dvYWxzUGFyYW1ldGVyRGVmaW5pdGlvbiIsInVybCIsImFwaVVybCIsIm1ldGhvZCIsImhlYWRlcnMiLCJzYXZpbmdzR29hbElkIiwiZ2V0U2F2aW5nc0dvYWxQYXJhbWV0ZXJEZWZpbml0aW9uIiwibmFtZSIsImN1cnJlbmN5IiwidGFyZ2V0QW1vdW50IiwidGFyZ2V0Q3VycmVuY3kiLCJiYXNlNjRFbmNvZGVkUGhvdG8iLCJjcmVhdGVTYXZpbmdzR29hbFBhcmFtZXRlckRlZmluaXRpb24iLCJkYXRhIiwiSlNPTiIsInN0cmluZ2lmeSIsInRhcmdldCIsImRlbGV0ZVNhdmluZ3NHb2FsUGFyYW1ldGVyRGVmaW5pdGlvbiIsInRyYW5zYWN0aW9uSWQiLCJhbW91bnQiLCJhZGRNb25leVNhdmluZ3NHb2FsUGFyYW1ldGVyRGVmaW5pdGlvbiIsIm1pbm9yVW5pdHMiLCJ2YWxpZGF0aW9ucyIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFLQSxNQUFNQSxNQUFNLHFCQUFNLCtCQUFOLENBQVo7O0FBRUE7Ozs7TUFHTUMsWTtBQUNKOzs7O0FBSUEsMEJBQWFDLE9BQWIsRUFBc0I7QUFBQTs7QUFDcEIsV0FBS0EsT0FBTCxHQUFlQSxPQUFmO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozt1Q0FLa0JDLFcsRUFBYTtBQUM3Qix1Q0FBZUMsU0FBZixFQUEwQkMsbUNBQTFCO0FBQ0EsWUFBTUMsTUFBUyxLQUFLSixPQUFMLENBQWFLLE1BQXRCLDBCQUFOO0FBQ0FQLHFCQUFXTSxHQUFYO0FBQ0EsZUFBTyxxQkFBTTtBQUNYRSxrQkFBUSxLQURHO0FBRVhGLGtCQUZXO0FBR1hHLG1CQUFT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RUFBYyxRQUFkLENBQTdCLEVBSDJDLEVBSTNDLEVBQUVmLE1BQU0sVUFBUixFQUFvQmUsYUFBYSxDQUFFLFVBQUYsRUFBYyxRQUFkLENBQWpDLEVBSjJDLEVBSzNDLEVBQUVmLE1BQU0sY0FBUixFQUF3QmUsYUFBYSxDQUFFLFVBQUYsRUFBYyxRQUFkLENBQXJDLEVBTDJDLEVBTTNDLEVBQUVmLE1BQU0sZ0JBQVIsRUFBMEJlLGFBQWEsQ0FBRSxVQUFGLEVBQWMsUUFBZCxDQUF2QyxFQU4yQyxFQU8zQyxFQUFFZixNQUFNLG9CQUFSLEVBQThCZSxhQUFhLENBQUUsVUFBRixFQUFjLFFBQWQsQ0FBM0MsRUFQMkMsQ0FBN0M7O0FBVUEsTUFBTUYseUNBQXlDLENBQzdDLEVBQUViLE1BQU0sYUFBUixFQUF1QmUsYUFBYSxDQUFFLFVBQUYsRUFBYyxRQUFkLENBQXBDLEVBRDZDLEVBRTdDLEVBQUVmLE1BQU0sZUFBUixFQUF5QmUsYUFBYSxDQUFFLFVBQUYsRUFBYyxRQUFkLENBQXRDLEVBRjZDLEVBRzdDLEVBQUVmLE1BQU0sZUFBUixFQUF5QmUsYUFBYSxDQUFFLFVBQUYsRUFBYyxRQUFkLENBQXRDLEVBSDZDLEVBSTdDLEVBQUVmLE1BQU0sUUFBUixFQUFrQmUsYUFBYSxDQUFFLFVBQUYsRUFBYyxRQUFkLENBQS9CLEVBSjZDLENBQS9DOztBQU9BQyxTQUFPQyxPQUFQLEdBQWlCNUIsWUFBakIiLCJmaWxlIjoiZW50aXRpZXMvc2F2aW5nc0dvYWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcbmltcG9ydCBkZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5pbXBvcnQgeyBkZWZhdWx0SGVhZGVycywgcG9zdEhlYWRlcnMgfSBmcm9tICcuLi91dGlscy9odHRwJztcbmltcG9ydCB7IHR5cGVWYWxpZGF0aW9uIH0gZnJvbSAnLi4vdXRpbHMvdmFsaWRhdG9yJztcblxuY29uc3QgbG9nID0gZGVidWcoJ3N0YXJsaW5nOnNhdmluZy1nb2Fscy1zZXJ2aWNlJyk7XG5cbi8qKlxuICogU2VydmljZSB0byBpbnRlcmFjdCB3aXRoIGEgY3VzdG9tZXIncyBzYXZpbmdzIGdvYWxzXG4gKi9cbmNsYXNzIFNhdmluZ3NHb2FscyB7XG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgc2F2aW5ncyBnb2FsIHNlcnZpY2VcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnNcbiAgICovXG4gIGNvbnN0cnVjdG9yIChvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgbGlzdCBvZiB0aGUgY3VzdG9tZXIncyBzYXZpbmdzIGdvYWxzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhY2Nlc3NUb2tlbiAtIHRoZSBvYXV0aCBiZWFyZXIgdG9rZW4uXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIGh0dHAgcmVxdWVzdCBwcm9taXNlXG4gICAqL1xuICBsaXN0U2F2aW5nc0dvYWxzIChhY2Nlc3NUb2tlbikge1xuICAgIHR5cGVWYWxpZGF0aW9uKGFyZ3VtZW50cywgbGlzdFNhdmluZ3NHb2Fsc1BhcmFtZXRlckRlZmluaXRpb24pO1xuICAgIGNvbnN0IHVybCA9IGAke3RoaXMub3B0aW9ucy5hcGlVcmx9L2FwaS92MS9zYXZpbmdzLWdvYWxzYDtcbiAgICBsb2coYEdFVCAke3VybH1gKTtcbiAgICByZXR1cm4gYXhpb3Moe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybCxcbiAgICAgIGhlYWRlcnM6IGRlZmF1bHRIZWFkZXJzKGFjY2Vzc1Rva2VuKVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSBzcGVjaWZpYyBzYXZpbmdzIGdvYWxcbiAgICogQHBhcmFtIHtzdHJpbmd9IGFjY2Vzc1Rva2VuIC0gdGhlIG9hdXRoIGJlYXJlciB0b2tlbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHNhdmluZ3NHb2FsSWQgLSB0aGUgc2F2aW5ncyBnb2FsJ3MgSUQuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIGh0dHAgcmVxdWVzdCBwcm9taXNlXG4gICAqL1xuICBnZXRTYXZpbmdzR29hbCAoYWNjZXNzVG9rZW4sIHNhdmluZ3NHb2FsSWQpIHtcbiAgICB0eXBlVmFsaWRhdGlvbihhcmd1bWVudHMsIGdldFNhdmluZ3NHb2FsUGFyYW1ldGVyRGVmaW5pdGlvbik7XG4gICAgY29uc3QgdXJsID0gYCR7dGhpcy5vcHRpb25zLmFwaVVybH0vYXBpL3YxL3NhdmluZ3MtZ29hbHMvJHtzYXZpbmdzR29hbElkfWA7XG4gICAgbG9nKGBHRVQgJHt1cmx9YCk7XG4gICAgcmV0dXJuIGF4aW9zKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmwsXG4gICAgICBoZWFkZXJzOiBkZWZhdWx0SGVhZGVycyhhY2Nlc3NUb2tlbilcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgc2F2aW5ncyBnb2FsXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhY2Nlc3NUb2tlbiAtIHRoZSBvYXV0aCBiZWFyZXIgdG9rZW4uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzYXZpbmdzR29hbElkIC0gdGhlIHNhdmluZ3MgZ29hbCdzIElELCBnZW5lcmF0ZSBvbmUgaWYgY3JlYXRpbmcgYSBnb2FsLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIHRoZSBuYW1lIG9mIHRoZSBuZXcgY29udGFjdC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGN1cnJlbmN5IC0gdGhlIGN1cnJlbmN5IG9mIHRoZSBzYXZpbmdzIGdvYWwuIERlZmF1bHRzIHRvICdHQlAnLlxuICAgKiBAcGFyYW0ge251bWJlcn0gdGFyZ2V0QW1vdW50IC0gdGhlIHRhcmdldCBhbW91bnQgaW4gbWlub3IgdW5pdHMgKGUuZy4gMTIzNCA9PiDCozEyLjM0KS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRhcmdldEN1cnJlbmN5IC0gdGhlIHRhcmdldCBjdXJyZW5jeSwgYWxzbyBkZWZhdWx0cyB0byAnR0JQJy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGJhc2U2NEVuY29kZWRQaG90byAtIGJhc2U2NCBlbmNvZGVkIGltYWdlIHRvIGFzc29jaWF0ZSB3aXRoIHRoZSBnb2FsLiAob3B0aW9uYWwpXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIGh0dHAgcmVxdWVzdCBwcm9taXNlXG4gICAqL1xuICBjcmVhdGVTYXZpbmdzR29hbCAoYWNjZXNzVG9rZW4sIHNhdmluZ3NHb2FsSWQsIG5hbWUsIGN1cnJlbmN5LCB0YXJnZXRBbW91bnQsIHRhcmdldEN1cnJlbmN5LCBiYXNlNjRFbmNvZGVkUGhvdG8pIHtcbiAgICB0eXBlVmFsaWRhdGlvbihhcmd1bWVudHMsIGNyZWF0ZVNhdmluZ3NHb2FsUGFyYW1ldGVyRGVmaW5pdGlvbik7XG4gICAgY29uc3QgdXJsID0gYCR7dGhpcy5vcHRpb25zLmFwaVVybH0vYXBpL3YxL3NhdmluZ3MtZ29hbHMvJHtzYXZpbmdzR29hbElkfWA7XG4gICAgbG9nKGBQVVQgJHt1cmx9YCk7XG4gICAgcmV0dXJuIGF4aW9zKHtcbiAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICB1cmwsXG4gICAgICBoZWFkZXJzOiBwb3N0SGVhZGVycyhhY2Nlc3NUb2tlbiksXG4gICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIG5hbWUsXG4gICAgICAgIGN1cnJlbmN5LFxuICAgICAgICB0YXJnZXQ6IHtcbiAgICAgICAgICB0YXJnZXRBbW91bnQsXG4gICAgICAgICAgdGFyZ2V0Q3VycmVuY3lcbiAgICAgICAgfSxcbiAgICAgICAgYmFzZTY0RW5jb2RlZFBob3RvXG4gICAgICB9KVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZXMgc3BlY2lmaWMgc2F2aW5ncyBnb2FsXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhY2Nlc3NUb2tlbiAtIHRoZSBvYXV0aCBiZWFyZXIgdG9rZW4uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzYXZpbmdzR29hbElkIC0gdGhlIHVuaXF1ZSBtYW5kYXRlIElEXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IC0gdGhlIGh0dHAgcmVxdWVzdCBwcm9taXNlXG4gICAqL1xuICBkZWxldGVTYXZpbmdzR29hbCAoYWNjZXNzVG9rZW4sIHNhdmluZ3NHb2FsSWQpIHtcbiAgICB0eXBlVmFsaWRhdGlvbihhcmd1bWVudHMsIGRlbGV0ZVNhdmluZ3NHb2FsUGFyYW1ldGVyRGVmaW5pdGlvbik7XG4gICAgY29uc3QgdXJsID0gYCR7dGhpcy5vcHRpb25zLmFwaVVybH0vYXBpL3YxL3NhdmluZ3MtZ29hbHMvJHtzYXZpbmdzR29hbElkfWA7XG4gICAgbG9nKGBERUxFVEUgJHt1cmx9YCk7XG4gICAgcmV0dXJuIGF4aW9zKHtcbiAgICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgICB1cmwsXG4gICAgICBoZWFkZXJzOiBkZWZhdWx0SGVhZGVycyhhY2Nlc3NUb2tlbilcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgbW9uZXkgdG8gYSBzcGVjaWZpYyBzYXZpbmdzIGdvYWxcbiAgICogQHBhcmFtIHtzdHJpbmd9IGFjY2Vzc1Rva2VuIC0gdGhlIG9hdXRoIGJlYXJlciB0b2tlbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHNhdmluZ3NHb2FsSWQgLSB0aGUgc2F2aW5ncyBnb2FsJ3MgSUQuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0cmFuc2FjdGlvbklkIC0gYSB0cmFuc2FjdGlvbiBJRCBmb3IgdGhpcyB0cmFuc2FjdGlvblxuICAgKiBAcGFyYW0ge251bWJlcn0gYW1vdW50IC0gYW4gYW1vdW50IGluIG1pbm9yIHVuaXRcbiAgICogQHJldHVybiB7UHJvbWlzZX0gLSB0aGUgaHR0cCByZXF1ZXN0IHByb21pc2VcbiAgICovXG4gIGFkZE1vbmV5VG9TYXZpbmdzR29hbCAoYWNjZXNzVG9rZW4sIHNhdmluZ3NHb2FsSWQsIHRyYW5zYWN0aW9uSWQsIGFtb3VudCwgY3VycmVuY3kpIHtcbiAgICB0eXBlVmFsaWRhdGlvbihhcmd1bWVudHMsIGFkZE1vbmV5U2F2aW5nc0dvYWxQYXJhbWV0ZXJEZWZpbml0aW9uKTtcbiAgICBjb25zdCB1cmwgPSBgJHt0aGlzLm9wdGlvbnMuYXBpVXJsfS9hcGkvdjEvc2F2aW5ncy1nb2Fscy8ke3NhdmluZ3NHb2FsSWR9L2FkZC1tb25leS8ke3RyYW5zYWN0aW9uSWR9YDtcbiAgICBsb2coYFBVVCAke3VybH1gKTtcbiAgICByZXR1cm4gYXhpb3Moe1xuICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgIHVybCxcbiAgICAgIGhlYWRlcnM6IHBvc3RIZWFkZXJzKGFjY2Vzc1Rva2VuKSxcbiAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgYW1vdW50OiB7XG4gICAgICAgICAgY3VycmVuY3ksXG4gICAgICAgICAgbWlub3JVbml0czogYW1vdW50XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgbGlzdFNhdmluZ3NHb2Fsc1BhcmFtZXRlckRlZmluaXRpb24gPSBbXG4gIHsgbmFtZTogJ2FjY2Vzc1Rva2VuJywgdmFsaWRhdGlvbnM6IFsgJ3JlcXVpcmVkJywgJ3N0cmluZycgXSB9XG5dO1xuXG5jb25zdCBnZXRTYXZpbmdzR29hbFBhcmFtZXRlckRlZmluaXRpb24gPSBbXG4gIHsgbmFtZTogJ2FjY2Vzc1Rva2VuJywgdmFsaWRhdGlvbnM6IFsgJ3JlcXVpcmVkJywgJ3N0cmluZycgXSB9LFxuICB7IG5hbWU6ICdzYXZpbmdzR29hbElkJywgdmFsaWRhdGlvbnM6IFsgJ3JlcXVpcmVkJywgJ3N0cmluZycgXSB9XG5dO1xuXG5jb25zdCBkZWxldGVTYXZpbmdzR29hbFBhcmFtZXRlckRlZmluaXRpb24gPSBbXG4gIHsgbmFtZTogJ2FjY2Vzc1Rva2VuJywgdmFsaWRhdGlvbnM6IFsgJ3JlcXVpcmVkJywgJ3N0cmluZycgXSB9LFxuICB7IG5hbWU6ICdzYXZpbmdzR29hbElkJywgdmFsaWRhdGlvbnM6IFsgJ3JlcXVpcmVkJywgJ3N0cmluZycgXSB9XG5dO1xuXG5jb25zdCBjcmVhdGVTYXZpbmdzR29hbFBhcmFtZXRlckRlZmluaXRpb24gPSBbXG4gIHsgbmFtZTogJ2FjY2Vzc1Rva2VuJywgdmFsaWRhdGlvbnM6IFsgJ3JlcXVpcmVkJywgJ3N0cmluZycgXSB9LFxuICB7IG5hbWU6ICdzYXZpbmdzR29hbElkJywgdmFsaWRhdGlvbnM6IFsgJ3JlcXVpcmVkJywgJ3N0cmluZycgXSB9LFxuICB7IG5hbWU6ICduYW1lJywgdmFsaWRhdGlvbnM6IFsgJ3JlcXVpcmVkJywgJ3N0cmluZycgXSB9LFxuICB7IG5hbWU6ICdjdXJyZW5jeScsIHZhbGlkYXRpb25zOiBbICdyZXF1aXJlZCcsICdzdHJpbmcnIF0gfSxcbiAgeyBuYW1lOiAndGFyZ2V0QW1vdW50JywgdmFsaWRhdGlvbnM6IFsgJ29wdGlvbmFsJywgJ251bWJlcicgXSB9LFxuICB7IG5hbWU6ICd0YXJnZXRDdXJyZW5jeScsIHZhbGlkYXRpb25zOiBbICdvcHRpb25hbCcsICdzdHJpbmcnIF0gfSxcbiAgeyBuYW1lOiAnYmFzZTY0RW5jb2RlZFBob3RvJywgdmFsaWRhdGlvbnM6IFsgJ29wdGlvbmFsJywgJ3N0cmluZycgXSB9XG5dO1xuXG5jb25zdCBhZGRNb25leVNhdmluZ3NHb2FsUGFyYW1ldGVyRGVmaW5pdGlvbiA9IFtcbiAgeyBuYW1lOiAnYWNjZXNzVG9rZW4nLCB2YWxpZGF0aW9uczogWyAncmVxdWlyZWQnLCAnc3RyaW5nJyBdIH0sXG4gIHsgbmFtZTogJ3NhdmluZ3NHb2FsSWQnLCB2YWxpZGF0aW9uczogWyAncmVxdWlyZWQnLCAnc3RyaW5nJyBdIH0sXG4gIHsgbmFtZTogJ3RyYW5zYWN0aW9uSWQnLCB2YWxpZGF0aW9uczogWyAncmVxdWlyZWQnLCAnc3RyaW5nJyBdIH0sXG4gIHsgbmFtZTogJ2Ftb3VudCcsIHZhbGlkYXRpb25zOiBbICdyZXF1aXJlZCcsICdudW1iZXInIF0gfSxcbl07XG5cbm1vZHVsZS5leHBvcnRzID0gU2F2aW5nc0dvYWxzO1xuIl19
//# sourceMappingURL=savingsGoals.js.map
