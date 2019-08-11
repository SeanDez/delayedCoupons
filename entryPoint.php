<?php

namespace DelayedCoupons;

////// Plugin Declaration (read by WP Core) //////
use admin\controllers\AjaxController;


/**
 * Plugin Name: Delayed Coupons
 * Description: Show coupons after a visitor visits a specific page a certain number of times
 * */



/** Basic Project Setup
 * Env variables, constant definitions, class autoloads
 */
// todo doing absolute path on this seems to break it. Find out why
require_once ('bootstrap.php');




////// Global Constants //////
define("PLUGIN_FOLDER_URL", plugin_dir_url(__FILE__));


////// On Plugin Activation //////

require_once ('adminSettingsArea/DataBase.php');
require_once (ADMIN_SETTINGS_PATH . '/Visitors.php');

use admin\controllers\Visitors;

/** Creates DB tables on plugin activation
 */
use \DataBase;
$database = new DataBase();

register_activation_hook(__FILE__, [$database, 'initializeTables']);
register_activation_hook(__FILE__, [$database, 'initializeDummyTable']);




////// Page Builder Functions & Matching Hooks //////

// Admin Page
require_once ('adminSettingsArea/index.php');

// Ajax Handlers
require_once('adminSettingsArea/AjaxControllers.php');

$ajaxController = new AjaxController();

/** Deprecated after REST API switch
 * todo copy over functionality and then remove
 */
add_action('wp_ajax_loadCouponData', [$ajaxController, 'handleLoadCouponData']);
add_action('wp_ajax_deleteCurrentCoupon', [$ajaxController, 'handleDeleteCurrentCoupon']);
// add_action('wp_ajax_addNewCoupon', [$ajaxController, 'handleAddNewCoupon']);


function handleAddNewCoupon() {
  $fileContents = file_get_contents('php://input');
  $decodedContents = json_decode($fileContents);

//    global $wpdb;
//    $wpdb->insert;
  
  wp_send_json('placeholder');
}

add_action('wp_ajax_addNewCoupon', 'handleAddNewCoupon');


/** Handles all aspects of triggers and coupon display
 * Cookie setting. Trigger checks. Coupon retrieval and rendering
 */
$visitors = new Visitors();
add_action('init', [$visitors, 'logVisitsAndControlCouponDisplay']);





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


//function add_allowed_origins(array $origins = []) {
//  $origins[] = 'http://localhost:8080';
//  return $origins;
//}
//add_filter('allowed_http_origins', 'add_allowed_origins');



/** Not sure about these next 2
 */

//function add_cors_http_header() {
//  header("Access-Control-Allow-Origin: *");
//}
//
//add_action('send_headers', 'add_cors_http_header');


//function handleRestPreServeRequest() {
//  function( $value ) {
//    header( 'Access-Control-Allow-Origin: *' );
//    header( 'Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE' );
//    header( 'Access-Control-Allow-Credentials: true' );
//
//    return $value;
//  };
//}
//
//function resetPreServeRequest() {
//  remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );
//  add_filter( 'rest_pre_serve_request', 'handleRestPreServeRequest');
//}
//
//add_action( 'rest_api_init', 'resetPreServeRequest', 15 );


/** Rest Api Extensions
 * Endpoints for adding coupons, deleting, and loading coupon data.
 */
require_once ('adminSettingsArea/ApiController.php');
use \admin\controllers\ApiController;

$apiController = new ApiController();
add_action('rest_api_init', [$apiController, 'registerLoadCouponRoute']);
add_action('rest_api_init', [$apiController, 'registerDeleteSingleCouponRoute']);

//function hookAllRestControllers() {
//  global $apiController;
//
//  $apiController->registerLoadCouponRoute();
//  $apiController->registerDeleteSingleCouponRoute();
//}






















