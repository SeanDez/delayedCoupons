// normally I need to individually export
global.apiBaseUrl = `${process.env.REACT_APP_DEV_API_BASE}`;

if (typeof apiBaseUrlFromWp !== 'undefined') { global.apiBaseUrl = apiBaseUrlFromWp; }

