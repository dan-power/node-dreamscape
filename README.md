# node-dreamscape

_Dreamscape Reseller API module for node.js_

## Installation
To install `node-dreamscape`, you need [node.js](http://nodejs.org/) and [npm](https://github.com/npm/npm#super-easy-install).

Then run `npm install --save node-dreamscape` in your project directory.

## Usage
```javascript
var Dreamscape = require('./lib/dreamscape');

var client = Dreamscape.client({
  ResellerID: 'YOUR_RESELLER_ID',
  APIKey: 'YOUR_API_KEY',
  testing: false,
  nameServers: {
    item: [
      {Host: 'ns1.parkme.com.au', IP: '203.170.87.1'},
      {Host: 'ns2.parkme.com.au', IP: '203.170.87.2'}
    ]
  }
});
```
