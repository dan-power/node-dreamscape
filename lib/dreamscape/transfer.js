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
   * Transfer resource
   * @class Transfer
   */
 var Transfer = (function() {
   function Transfer(client) {
     this.client = client;
   }

   // TransferCheck 	Checks if a domain name is transferrable.
   Transfer.prototype.check = function(domain, key, cb) {
     this.client._call('TransferCheck', {
       'TransferCheckRequest': {
         'DomainName': domain,
         'AuthKey': key
       }
     }, function(results) {
       cb({
          'Success': results.APIResponse.Success['$value'],
          'IsEligibleForRenewal': results.APIResponse.IsEligibleForRenewal['$value']
        }, results.APIResponse.Errors ? util._clean(results.APIResponse.Errors) : null);
     });
   };

   // TransferInfo 	Retrieves the transfer information.
   Transfer.prototype.get = function(domain, cb) {
     this.client._call('TransferInfo', {
       'TransferInfoRequest': {
         'DomainName': domain
       }
     }, function(results) {
       cb(util._clean(results.APIResponse.TransferDetails),
          results.APIResponse.Errors ? util._clean(results.APIResponse.Errors) : null);
     });
   };

   // TransferStart 	Starts the transfer of a domain name.
   Transfer.prototype.start = function(contact, domain, key, period, premium, cb) {
     this.client._call('TransferStart', {
      'TransferStartRequest': {
     		'ContactIdentifier': contact,
     		'DomainName': domain,
        'AuthKey': key,
     		'RenewalPeriod': period,
        'Premium': premium
      }
     }, function(results) {
       cb(util._clean(results.APIResponse.TransferDetails),
         results.APIResponse.Errors ? util._clean(results.APIResponse.Errors) : null);
     });
   };

   // TransferCancel 	Cancels the transfer of a domain name.
   Transfer.prototype.cancel = function(domain, cb) {
     this.client._call('TransferCancel', {
       'TransferCancelRequest': {
         'DomainName': domain
       }
     }, function(results) {
       cb(util._clean(results.APIResponse.Success),
         results.APIResponse.Errors ? util._clean(results.APIResponse.Errors) : null);
     });
   };

   // SendAPINotification 	Sends a transfer notification for the reseller to test their notification_url script with
   Transfer.prototype.sendNotification = function(domain, action, url, cb) {
     this.client._call('SendAPINotification', {
       	'SendAPINotificationRequest': {
       		'DomainName': domain,
       		'Action': action, //'Transfer Out Request'
       		'URL': url //'http://testdomain.com/notifications.php'
        }
     }, function(results) {
       cb(util._clean(results.APIResponse.TransferDetails),
         results.APIResponse.Errors ? util._clean(results.APIResponse.Errors) : null);
     });
   };

   return Transfer;
 })();

 module.exports = Transfer;
 }).call(this);
