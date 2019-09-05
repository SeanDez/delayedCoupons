<?php

// setup a data passage variable
// localize the variable

// setup a wrapper function for the localizer and also to enqueue the react script

// add action to enqueue the loader

/** Registers, then localizes, then enqueues the react view
 */
function prepAllAdminScripts() {
  wp_register_script(
    'reactAdminArea'
    , PLUGIN_FOLDER_URL . 'shared/adminArea.bundle.js'
    , null
    , null
    , true
  );
  
  wp_localize_script('reactAdminArea', 'serverParams', [
    '_wpnonce' => wp_create_nonce('wp_rest')
    , 'apiBaseUrlFromWp' => get_rest_url()
  ]);
  
  wp_enqueue_script('reactAdminArea');
}
add_action('admin_enqueue_scripts', 'prepAllAdminScripts');




function createInjectionDiv() {
  echo '<div id="adminRoot"></div>';
}
add_action('admin_footer', 'createInjectionDiv');





function setupAdminSettingsPageParameters() {
  add_options_page(
    'Delayed Coupons Settings',
    'Delayed Coupons',
    'manage_options',
    'delayed-coupons',
    'prepAllAdminScripts'
  );
}
add_action('admin_menu', 'setupAdminSettingsPageParameters');








