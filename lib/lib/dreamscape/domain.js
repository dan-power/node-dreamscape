"use strict";
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
   * Domain resource
   * @class Domain
   */
var Domain = (function() {
  function Domain(client) {
    this.client = client;
  }

  Domain.prototype.domain = function(domainName, contacts, business, ns) {
    // The name of the domain.
    this.DomainName = domainName || '';

    // The registrant contact identifier.
    this.RegistrantContactIdentifier = contacts.registrant || '';

    // The admin contact identifier.
    this.AdminContactIdentifier = contacts.admin || 'C-002902661-SN';

    // The billing contact identifier.
    this.BillingContactIdentifier = contacts.billing || 'C-002902661-SN';
    // The tech contact identifier.
    this.TechContactIdentifier = contacts.tech || 'C-002902661-SN';

    // The period in years to register the domain for.
    // Note: Some TLDs will not accept all RegistrationPeriod values.
    this.RegistrationPeriod = period || 2;
    this.Eligibility = new domain.Eligibility(business);

    // Set to true if the domain is premium. This information will be returned
    // in a DomainCheck response.
    this.Premium = premium || false;

    // An array of NameServer objects.
    this.NameServers = ns || Dreamscape.options.nameServers;

    this.valid = function() {
      var valid = true;

      if(!this.DomainName.length < 2) valid = false;
      if(!this.RegistrantContactIdentifier.match(/[R]{1}-[0-9]{9}-[A-Z]{2}/)) valid = false;
      if(!this.AdminContactIdentifier.match(/[C]{1}-[0-9]{9}-[A-Z]{2}/)) valid = false;
      if(!this.BillingContactIdentifier.match(/[C]{1}-[0-9]{9}-[A-Z]{2}/)) valid = false;
      if(!this.TechContactIdentifier.match(/[C]{1}-[0-9]{9}-[A-Z]{2}/)) valid = false;
      // .au limited to 2 years min and max.
      if(this.DomainName.match('/\.au$/') && this.RegistrationPeriod !== 2) valid = false;
      if(this.RegistrationPeriod > 10) valid = false;
      if(!this.Eligibility.valid()) valid = false;
      if(!this.NameServers) valid = false;

      if (this.AccountType === 'business' &&
          this.BusinessNumberType.match(/^(ABN|ACN|VICBN|NSWBN|SABN|NTBN|WABN|TASBN|ACTBN|QLDBN|TM|OTHER)$/)) valid = false;
    };

    this.toJSON = function() {
      return {
        'DomainName': this.DomainName,
        'RegistrantContactIdentifier': this.RegistrantContactIdentifier,
        'AdminContactIdentifier': this.AdminContactIdentifier,
        'BillingContactIdentifier': this.BillingContactIdentifier,
        'RegistrationPeriod': this.RegistrationPeriod,
        'Eligibility': this.Eligibility.toJSON(),
        'Premium': this.Premium,
        'NameServers': this.NameServers
      };
    };
  };

  // Eligibility applies to .AU domain registrations and is governed by .auda
  //  (The Australian Domain Name Administrator).
  // For more information on Domain Name Eligibility policies see the following
  // link: http://www.auda.org.au/policies/2012-04/
  Domain.prototype.eligibility = function(business) {
    // The policy reason (1 or 2).
    // 1 = Personal, 2 = Business
    this.PolicyReason = 1;

    // The business type.
    this.BusinessType = business.type || 'Company';

    // The business name.
    this.BusinessName = business.name || '';

    // The business number type.
    this.BusinessNumberType = business.numberType || 'ABN';

    // The business number.
    this.BusinessNumber = business.number || '';

    // The trading name (optional).
    this.TradingName = business.trading.name || '';

    // The trading number type (optional).
    this.TradingNumberType = business.trading.numberType || '';

    // The trading number (optional).
    this.TradingNumber = business.trading.number || '';

    this.valid = function() {
      var valid = true;

      if(this.PolicyReason > 2 || this.PolicyReason < 1) valid = false;
      // if(!this.BusinessType.match(/^(Charity|Child Care Centre|Citizen/Resident|Club|Commercial Statutory Body|Company|Government School|Higher Education Institution|Incorporated Association|Industry Body|National Body|Non-Government School|Non-profit Organisation|Other|Partnership|Pending TM Owner|Political Party|Pre-School||Registered Business|Religious\/Church Group|Research Organisation|Sole Trader|Trade Union|Trademark Owner|Training Organisation)$/)) valid = false;
      if(this.BusinessName.length < 2) valid = false;
      if(!this.BusinessNumberType.match(/^(ABN|ACN|VICBN|NSWBN|SABN|NTBN|WABN|TASBN|ACTBN|QLDBN|TM|OTHER)$/)) valid = false;
      if(!this.BusinessNumber.length < 5) valid = false;

      // These are optional, so it may depend on PolicyReason. The excellent
      // documentation of the Dreamscape API does not mention what this actually does!
      //
      // if(!this.TradingName) valid = false;
      // if(!this.TradingNumberType) valid = false;
      // if(!this.TradingNumber) valid = false;
    };

    this.toJSON = function() {
      return {
        'PolicyReason': this.PolicyReason,
        'BusinessType': this.BusinessType,
        'BusinessName': this.BusinessName,
        'BusinessNumberType': this.BusinessNumberType,
        'BusinessNumber': this.BusinessNumber
        // 'TradingName': this.TradingName,
        // 'TradingNumberType': this.TradingNumberType,
        // 'TradingNumber': this.TradingNumber
      };
    };
  };

  /**
   * Is the DomainName provided in the correct format?
   * @param  {string} DomainName
   * @return {boolean}
   */
  Domain.prototype.isValid = function(domainName) {
    return(domainName.match(/[CR]{1}-[0-9]{9}-[A-Z]{2}/));
  };

  //DomainInfo 	Retrieves the domain information.
  Domain.prototype.get = function(domain, cb) {
    this.client._call('DomainInfo', {'DomainInfoRequest':{'DomainName':domain}}, function(results) {
      cb(util._clean(results.APIResponse.DomainDetails),
        results.APIResponse.Errors ? util._array(results.APIResponse.Errors) : null);
    });
  };

  // GetDomainList 	Retrieves a list of the reseller’s domains.
  Domain.prototype.list = function(cb) {
    this.client._call('GetDomainList', null, function(results) {
      var obj = util._clean(results.APIResponse.DomainList.item);
      var arr = Object.keys(obj).map(function (key) { return obj[key]; });

      cb(arr,
        results.APIResponse.Errors ? util._array(results.APIResponse.Errors) : null);

      // cb(util._clean(results.APIResponse.DomainList.item));
    });
  };

  // GetDomainPriceList 	Retrieves a list of all domain products available to the Reseller.
  Domain.prototype.prices = function(cb) {
    this.client._call('GetDomainPriceList', null, function(results) {
      var obj = util._clean(results.APIResponse.DomainPriceList.item);
      var arr = Object.keys(obj).map(function (key) { return obj[key]; });
      cb(arr);
    });
  };

  // DomainCheck 	Checks the existence of a domain name.
  Domain.prototype.check = function(array, cb) {
    var object = {
      'DomainCheckRequest': {
        'DomainNames': {'item': array}
      }
    };

    this.client._call('DomainCheck', object, function(results) {
      var obj = results.APIResponse.AvailabilityList;

      obj = obj ? obj.item : {};

      cb(util._array(obj),
        results.APIResponse.Errors ? util._array(results.APIResponse.Errors) : null);
    });
  };

  // DomainCreate 	Creates a domain object.
  Domain.prototype.create = function(data, cb) {
    this.client._call('DomainCreate', {'DomainInfoRequest': data}, function(results) {
      cb(util._clean(results.APIResponse.DomainDetails),
        results.APIResponse.Errors ? util._array(results.APIResponse.Errors) : null);
    });
  };

  // DomainUpdate 	Updates an existing domain object.
  Domain.prototype.update = function(data, cb) {
    this.client._call('DomainUpdate', {'DomainInfoRequest': data}, function(results) {
      cb(util._clean(results.APIResponse.DomainDetails),
        results.APIResponse.Errors ? util._array(results.APIResponse.Errors) : null);
    });
  };

  // DomainDelete 	Deletes a domain object.
  Domain.prototype.delete = function(domain, cb) {
    this.this.client._call('DomainDelete', {'DomainInfoRequest':{'DomainName':domain}}, function(results) {
      cb(results.DomainDetails,
         results.APIResponse.Errors ? util._array(results.APIResponse.Errors) : null);
    });
  };

  // DomainRenew 	Renews a domain object.
  Domain.prototype.renew = function(domain, cb) {
     this.this.client._call('DomainRenew', {'DomainInfoRequest':{'DomainName':domain}}, function(results) {
      cb(results.DomainDetails,
         results.APIResponse.Errors ? util._array(results.APIResponse.Errors) : null);
    });
  };

  return Domain;
})();

module.exports = Domain;
}).call(this);
