/*!
 * node-dreamscape
 *
 * Copyright 2017 Dan Power
 * Released under the MIT license
 */
 (function() {
   // Utilities
   var util = require('./util');
  /**
    * Account resource
    * @class Account
    */
  var Account = (function() {
    function Account(client) {
      this.client = client;
    }

    /**
     * Retrieves the reseller’s current balance.
     *
     * @param {requestCallback} [callback] - callback that handles the response
     * @memberof Account
     */
    Account.prototype.get = function(callback) {
      this.client._call('GetBalance', null, function(results) {
        var data = {};

        if(results.APIResponse.Balance) {
          data = {
            'balance': results.APIResponse.Balance['$value']
          };
        }
        callback(data, results.APIResponse.Errors);
      });
    };

    return Account;
  })();

  module.exports = Account;
}).call(this);
