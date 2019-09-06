// normally I need to individually export
global.apiBaseUrl = `${process.env.REACT_APP_DEV_API_BASE}`;

if (serverParams &&
  typeof serverParams.apiBaseUrlFromWp !== 'undefined') {
  global.apiBaseUrl = serverParams.apiBaseUrlFromWp;
}


// some dependency is loading babel-polyfill. This is just a backup
if (!global._babelPolyfill) {
  require('babel-polyfill');
}