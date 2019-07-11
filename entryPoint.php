<?php

namespace DelayedCoupons;

////// Plugin Declaration (read by WP Core) //////

/**
 * Plugin Name: Delayed Coupons
 * Description: Show coupons after a visitor visits a specific page
 * a certain number of times
 * */




require_once ('bootstrap.php');



////// Global Constants //////

//define('PLUGIN_FOLDER_PATH', plugin_dir_path(__FILE__));
define("PLUGIN_FOLDER_URL", plugin_dir_url(__FILE__));


////// On Plugin Activation Hook //////




////// Page Builder Functions & Matching Hooks //////

// Admin Page
require_once ('adminSettingsArea/index.php');

// Ajax Handlers
require_once('adminSettingsArea/AjaxControllers.php');


























