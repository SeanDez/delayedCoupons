<?php

function loadReactAdminAreaBundle() {
  require_once ('jsInjectContainer.php');
}

function setupAdminSettingsPageParameters() {
  add_options_page(
    'Delayed Coupons Settings',
    'Delayed Coupons',
    'manage_options',
    'delayed-coupons',
    'loadReactAdminAreaBundle'
  );
}
add_action('admin_menu', 'setupAdminSettingsPageParameters');











