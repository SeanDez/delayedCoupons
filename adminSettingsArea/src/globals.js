// globals remove the need for export keyword
global.apiBaseUrl = `${process.env.REACT_APP_DEV_API_BASE}`;
global.clientNonce = 10;
global.namepaceAndVersion = 'defaultNamepaceAndVersion';

// some dependency is loading babel-polyfill. This is just a backup
if (!global._babelPolyfill) {
  require('babel-polyfill');
}