global.ajaxUrl = "hardCoded value";

if (window) {
  if (window.ajaxUrl) { global.ajaxUrl = window.ajaxUrl }
}

