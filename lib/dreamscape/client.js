/*!
 * node-dreamscape
 *
 * Copyright 2017 Dan Power
 * Released under the MIT license
 */
 (function() {
  // External Dependencies
  var soap = require('soap');

  // API sections
  var Account = require('./account'),
    Contact = require('./contact'),
    Domain = require('./domain'),
    Transfer = require('./transfer');

  // Utilities
  var util = require('./util');

  /**
    * Client resource
    * @class Client
    */
  var Client = (function() {
    /**
     * Create a new Client instance.
     *
     * @param {string} token - The DigitalOcean token used for authorization.
     * @param {ClientOptions} [options] - An object whose values are used to configure a client instance.
     * @memberof Client
     */
    function Client(options) {
      this.options = options;

      this.ResellerID = options.ResellerID;
      this.APIKey = options.APIKey;

      this.hostDefaults = options.nameServers || {
        item: [
          {Host: 'ns1.parkme.com.au', IP: '203.170.87.1'},
          {Host: 'ns2.parkme.com.au', IP: '203.170.87.2'}
        ]
      };
      this.url = options.testing ?
              'http://soap-test.secureapi.com.au/wsdl/API-1.3.wsdl' :  // Testing
              'https://soap.secureapi.com.au/wsdl/API-1.3.wsdl'        // Production

      this.account = new Account(this);
      this.contact = new Contact(this);
      this.domain = new Domain(this);
      this.transfer = new Transfer(this);
    }

    /** @private */
    Client.prototype._call = function(method, params, cb) {
      var header = '<tns:Authenticate><AuthenticateRequest>'+
                     '<ResellerID>'+this.ResellerID+'</ResellerID>'+
                     '<APIKey>'+this.APIKey+'</APIKey>'+
                   '</AuthenticateRequest></tns:Authenticate>';

      soap.createClient(this.url, function(err, soapClient) {
        if (err) console.error(err);

        soapClient.addSoapHeader(header);
        soapClient[method](params, function(err, result, raw, soapHeader) {
          if (err)
            console.error(err);

          cb(result.return || null, err || null);
        });

      });
    };

    return Client;
  })();

  module.exports = function(token, options) {
    return new Client(token, options);
  };
}).call(this);
