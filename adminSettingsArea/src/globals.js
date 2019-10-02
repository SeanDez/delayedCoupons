import dotenv from "dotenv";
dotenv.config();

// globals remove the need for export keyword
global.apiBaseUrl = `${process.env.REACT_APP_DEV_API_BASE}`;
console.log(apiBaseUrl, `=====apiBaseUrl inside globals.js=====`);

global.clientNonce = "5d6352af1d";
global.namepaceAndVersion = 'delayedCoupons/1.0';



// some dependency is loading babel-polyfill. This is just a backup
if (!global._babelPolyfill) {
  require('babel-polyfill');
}