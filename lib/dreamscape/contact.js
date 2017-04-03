/*!
 * node-dreamscape
 *
 * Copyright 2017 Dan Power
 * Released under the MIT license
 */
(function() {

var postcode = require('postcode-validator');
var Isemail = require('isemail');

// Utilities
var util = require('./util');

// var ABN = require("abn-validator");

var Contact = (function() {
  function Contact(client) {
    this.client = client;
  }

  // The Contact Object.
  Contact.prototype.contact = function(name, address, phone, email, type, business) {
    if(typeof business === 'undefined')
      var business = {};

    // The contact's first name.
    this.FirstName = name.first || 'Powerd';

    // The contact's last name.
    this.LastName = name.last || 'Domains';

    // The number/street portion of the contact's address.
    this.Address = address.street || '';

    // The city portion of the contact's address.
    this.City = address.city || 'Melbourne';

    // The 2 letter country code of the contact’s address. eg. AU, US, NZ
    this.Country = address.country || 'AU';

    // The state portion of the contact's address.
    this.State = address.state || 'VIC';

    // The post code portion of the contact's address.
    this.PostCode = address.postCode || '3000';

    // The 2 digit country calling code of the contact’s phone/mobile number.
    this.CountryCode = phone.countryCode || '61';

    // The contact's phone number.
    this.Phone = phone.landLine || '';

    // The contact's mobile number.
    this.Mobile = phone.mobile || '';

    // The contact's email address.
    this.Email = email || '';

    // The account type. 'personal' or 'business'
    this.AccountType = type || 'personal';

    // Is this a business contact?
    this.isBusiness = function() {
      return this.AccountType === 'business';
    };

    // The contact's business name (if account type is business).
    this.BusinessName = business.name || '';

    // The contact's business number type (if account type is business).
    // Accepted values:
    //  ABN, ACN, VICBN, NSWBN, SABN, NTBN, WABN, TASBN, ACTBN, QLDBN, TM, OTHER
    this.BusinessNumberType = business.numberType || '';

    // The contact's business number (if account type is business).
    this.BusinessNumber = business.number || '';

    this.valid = function() {
      var valid = true;

      if (this.FirstName.length < 2) valid = false;
      if (this.LastName.length < 2) valid = false;
      if (this.Address.length < 2) valid = false;
      if (this.City.length < 2) valid = false;
      if (this.Country.length < 2) valid = false;
      if(this.Country === 'AU' &&
        !this.State.match(/^(VIC|NSW|ACT|WA|SA|QLD|NT|TAS)$/)) valid = false;

      if(!this.CountryCode.match(/^(AF|AX|AL|DZ|AS|AD|AO|AI|AQ|AG|AR|AM|AW|AU|AT|AZ|BS|BH|BD|BB|BY|BE|BZ|BJ|BM|BT|BO|BQ|BA|BW|BV|BR|IO|BN|BG|BF|BI|KH|CM|CA|CV|KY|CF|TD|CL|CN|CX|CC|CO|KM|CG|CD|CK|CR|CI|HR|CU|CW|CY|CZ|DK|DJ|DM|DO|EC|EG|SV|GQ|ER|EE|ET|FK|FO|FJ|FI|FR|GF|PF|TF|GA|GM|GE|DE|GH|GI|GR|GL|GD|GP|GU|GT|GG|GN|GW|GY|HT|HM|VA|HN|HK|HU|IS|IN|ID|IR|IQ|IE|IM|IL|IT|JM|JP|JE|JO|KZ|KE|KI|KP|KR|KW|KG|LA|LV|LB|LS|LR|LY|LI|LT|LU|MO|MK|MG|MW|MY|MV|ML|MT|MH|MQ|MR|MU|YT|MX|FM|MD|MC|MN|ME|MS|MA|MZ|MM|NA|NR|NP|NL|NC|NZ|NI|NE|NG|NU|NF|MP|NO|OM|PK|PW|PS|PA|PG|PY|PE|PH|PN|PL|PT|PR|QA|RE|RO|RU|RW|BL|SH|KN|LC|MF|PM|VC|WS|SM|ST|SA|SN|RS|SC|SL|SG|SX|SK|SI|SB|SO|ZA|GS|SS|ES|LK|SD|SR|SJ|SZ|SE|CH|SY|TW|TJ|TZ|TH|TL|TG|TK|TO|TT|TN|TR|TM|TC|TV|UG|UA|AE|GB|US|UM|UY|UZ|VU|VE|VN|VG|VI|WF|EH|YE|ZM|ZW)$/)) valid = false;
      else if(!postcode.validate(this.PostCode, this.CountryCode)) valid = false;
      if (this.Country === 'AU' &&
          this.Phone.length < 8 &&
          this.Mobile.length < 9) valid = false;
      if(!Isemail.validate(this.Email, {checkDNS: true})) valid = false;
      if(!this.AccountType.match(/^(business|personal)$/)) valid = false;
      if (this.AccountType === 'business' &&
          this.BusinessName.length < 2) valid = false;
      if (this.AccountType === 'business' &&
          !this.BusinessNumberType.match(/^(ABN|ACN|VICBN|NSWBN|SABN|NTBN|WABN|TASBN|ACTBN|QLDBN|TM|OTHER)$/)) valid = false;
      // if (this.AccountType === 'business' &&
      //     this.BusinessNumberType === 'ABN' &&
      //     ABN(this.BusinessNumber)) valid = false;
    };
    this.toJSON = function() {
      var obj = {
        'FirstName': this.FirstName,
        'LastName': this.LastName,
        'Address': this.Address,
        'City': this.City,
        'Country': this.Country,
        'State': this.State,
        'PostCode': this.PostCode,
        'CountryCode': this.CountryCode,
        'Phone': this.Phone,
        'Mobile': this.Mobile,
        'Email': this.Email,
        'AccountType': this.AccountType
      };

      if(this.AccountType === 'business') {
        obj['BusinessName'] = this.BusinessName;
        obj['BusinessNumberType'] = this.BusinessNumberType;
        obj['BusinessNumber'] = this.BusinessNumber;
      }

      return obj;
    };
  };

  /**
   * Is the ContactItentifier provided in the correct format?
   * @param  {string} ContactIdentifier
   * @return {boolean}
   */
  Contact.prototype.isValid = function(id) {
    return(id.match(/[CR]{1}-[0-9]{9}-[A-Z]{2}/));
  };

  /**
   * This operation is used to check if a unique contact identifier exists.
   * Contact identifiers are generated by the ContactCreate and
   * ContactCloneToRegistrant operations. This operation is useful to ensure
   * that a previously generated contact identifier still exists.
   * @param  {string} ContactIdentifier
   * @param  {function} cb
   */
  Contact.prototype.check = function(id, cb) {
    if(!this.isValid(id))
      cb(null, 'ContactIdentifier invalid format.');

    this.client._call('ContactCheck',
        {'ContactCheckRequest': {'ContactIdentifier': id }},
        function(results) {
          cb(util._clean(results.APIResponse.AvailabilityList.item), null);
        });
  };

  /**
   * This operation will retrieve all the details attached to the specified
   * contact.
   * NOTE: In order to successfully complete this operation, the ContactIdentifier
   *       must belong to the reseller.
   * @param  {string} ContactIdentifier
   * @param  {function} cb
   */
  Contact.prototype.get = function(id, cb) {
    if(!this.isValid(id))
      cb(null, 'ContactIdentifier invalid format.');

    this.client._call('ContactInfo', {'ContactInfoRequest': {'ContactIdentifier': id }},
        function(results) {
            cb(
              util._clean(results.APIResponse.ContactDetails),
              util._clean(results.APIResponse.Errors)
            );
        });
  };

  /**
   * This operation creates a contact under the reseller's account. This contact
   * can then be used to create domain objects.
   * @param  {string} ContactIdentifier
   * @param  {function} cb
   */
  Contact.prototype.create = function(id, cb) {
    if(!this.isValid(id))
      cb(null, 'ContactIdentifier invalid format.');

    this.client._call('ContactCreate',
        {'ContactCreateRequest': id},
        function(results) {
          cb(util._clean(results.APIResponse.ContactDetails),
             util._clean(results.APIResponse.Errors));
        });
  };

  /**
   * This operation will update the details attached to the specified contact
   * identifier.
   * NOTE: In order to successfully complete this operation, the ContactIdentifier
   *       must belong to the reseller.
   * @param  {string} ContactIdentifier
   * @param  {function} cb
   */
  Contact.prototype.update = function(id, cb) {
    if(!this.isValid(id))
      cb(null, 'ContactIdentifier invalid format.');

    this.client._call('ContactUpdate',
        {'ContactCheckRequest': {'ContactIdentifier': id }},
        function(results) {
          cb(util._clean(results.APIResponse.ContactDetails),
             util._clean(results.APIResponse.Errors));
        });
  };

  /**
   * This operation creates a registrant based on a contact.
   * NOTE: In order to successfully complete this operation, the ContactIdentifier
   *       must belong to the reseller.
   * @param  {string} ContactIdentifier
   * @param  {function} cb
   */
  Contact.prototype.cloneToRegistrant = function(id, cb) {
    if(!this.isValid(id))
      cb(null, 'ContactIdentifier invalid format.');

    this.client._call('ContactCloneToRegistrant',
      {'ContactCheckRequest': {'ContactIdentifier': id }},
      function(results) {
        cb(util._clean(results.APIResponse.ContactDetails),
           util._clean(results.APIResponse.Errors));
      });
  };

  /**
   * This operation retrieves a list of contact identifiers belonging to the reseller.
   * NOTE: Registrant contacts are not returned as they are treated differently to
   *       admin, tech, and billing contacts.
   * @param  {function} cb
   */
  Contact.prototype.list = function(cb) {
    this.client._call('GetContactIdentifierList',
        null,
        function(results) {
          var old = results.APIResponse.ContactIdentifierList.item,
              arr = [];

          for (var i = 0, j = old.length; i < j; i++) {
            arr.push(old[i]['$value'] );
          }

          cb(arr, null);
        });
  };

  return Contact;
})();

module.exports = Contact;
}).call(this);
