<?php

namespace DelayedCoupons;

/*
 * Plugin Name: Delayed Coupons
 * Description: Show coupons after a visitor visits a specific page
 * a certain number of times
 * */

require_once ('vendor/autoload.php');


// global constants
define('PLUGIN_FOLDER_PATH', plugin_dir_path(__FILE__));
define("PLUGIN_FOLDER_URL", plugin_dir_url(__FILE__));


////// ON PLUGIN ACTIVATION //////




////// PAGE BUILDER FUNCTIONS AND MATCHING HOOKS //////

// ADMIN PAGE
require_once ('adminSettingsArea/index.php');




























