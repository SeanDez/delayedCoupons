<?php

namespace DelayedCoupons;

// todo doing absolute path on this seems to break it. Find out why
require_once ('bootstrap.php'); // Env variables, constant definitions, class autoloads
require_once ('adminSettingsArea/DataBase.php');
require_once (ADMIN_SETTINGS_PATH . '/Visitors.php');
require_once ('adminSettingsArea/ApiController.php');

use admin\controllers\Visitors;
use \DataBase;
use admin\controllers\AjaxController;
use \admin\controllers\ApiController;

$apiController = new ApiController();
$database = new DataBase();
$visitors = new Visitors();



////// Plugin Declaration (read by WP Core) //////

/**
 * Plugin Name: Delayed Coupons
 *
 * Description: Show coupons after a visitor visits a specific page a certain number of times
 * */



////// Global Constants //////
define("PLUGIN_FOLDER_URL", plugin_dir_url(__FILE__));


////// On Plugin Activation //////

/** Creates DB tables on plugin activation
 */
register_activation_hook(__FILE__, [$database, 'initializeTables']);
register_activation_hook(__FILE__, [$database, 'initializeDummyTable']);




////// Page Builder Functions & Matching Hooks //////

// Admin Page

$namespaceAgain = $apiController->namepaceAndVersion;

require_once ('adminSettingsArea/index.php');



/** On init getOrSetVisitorCookie() handles the cookie data, for the very next method
 *
 * At the end of rendering the body, the visit is logged and db checks are done to see if this pageload should trigger a coupon render
 */
add_action('init', [$visitors, 'getOrSetVisitorCookie']);
add_action('wp_footer', [$visitors, 'logVisitsAndControlCouponDisplay']);





/** CORS handing
 * todo fix cors to work in plugin file
 * The next 2 functions work if put in the theme's functions.php file.
 *
 * Neither works in this file though.
 *
 * As plugins can not depend on what is in other php files this needs to be fixed
 */
 
function add_cors_http_header() {
  header("Access-Control-Allow-Origin: *");
}
add_action('init', __NAMESPACE__ . '\\' . 'add_cors_http_header');



/** Rest Api Extensions
 * Endpoints for adding coupons, deleting, and loading coupon data.
 */
add_action('rest_api_init', [$apiController, 'registerLoadCouponRoute']);
add_action('rest_api_init', [$apiController, 'registerAddCoupon']);
add_action('rest_api_init', [$apiController, 'registerDeleteSingleCouponRoute']);























