<?php

// setup a data passage variable
// localize the variable

// setup a wrapper function for the localizer and also to enqueue the react script

// add action to enqueue the loader

/** Registers, then localizes, then enqueues the react view
 */
function prepAllAdminScripts() {
  echo "<p>test echo prepAllAdminScripts</p>";
  
  $url = PLUGIN_FOLDER_URL . 'shared/adminArea.bundle.js';
  echo "url: {$url}"; // shows working url to .js file
  
  // 1. register a handle for the js file
  wp_register_script(
    'reactAdminArea'
    , $url
    , null
    , null
    , true
  );
  
  // 2. pass data from php to js
  wp_localize_script('reactAdminArea', 'serverParams', [
    '_wpnonce' => wp_create_nonce('wp_rest')
    , 'apiBaseUrlFromWp' => get_rest_url()
  ]);
  
//  echo '<div id="adminRoot"></div>';
//  echo "<script src='{$url}'></script>";
  
  // 3. actually call the enqueue function on the handle
  wp_enqueue_script('reactAdminArea');
  
}

// 3. setup an HTML shell for react to inject into
function createInjectionDiv() {
  echo '<div id="adminRoot"></div>';
}
add_action('admin_footer', 'createInjectionDiv');

// 4. load the .js file through wordpress's hook queue
add_action('admin_enqueue_scripts', 'prepAllAdminScripts');



function loadReactAndDependencies() {

}

// todo namespace this and everything else



function setupAdminSettingsPageParameters() {
  // 5a. setup admin page
  add_options_page(
    'Delayed Coupons Settings',
    'Delayed Coupons',
    'manage_options',
    'delayed-coupons',
    'prepAllAdminScripts'
  );
}
// 5b. add action into the admin_menu hook
add_action('admin_menu', 'setupAdminSettingsPageParameters');








