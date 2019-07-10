<?php
namespace admin\controllers;

require_once ('/var/www/html/wptest2/wp-content/plugins/delayedCoupons' . '/vendor/autoload.php');
require_once ('/var/www/html/wptest2/wp-content/plugins/delayedCoupons' . '/adminSettingsArea/src/utilities/AjaxResponder.php');
require_once ('/var/www/html/wptest2/wp-content/plugins/delayedCoupons' . '/adminSettingsArea/src/utilities/setupEnvVariables.php');

use \admin\setupEnvVariables;
use admin\utilities\AjaxResponder;


class AjaxController {
  
  use \admin\setupEnvVariables {setupEnvVariables::__construct as protected __sevConstruct;}
  
  
  
  public function __construct() {
    // parent::__construct();
    $this->__sevConstruct('NODE_ENV');
  }
  
  
  
  public function handleLoadCouponData() {
    // run a select * query on all coupon records
    global $wpdb;
    
    $recordsList = $wpdb->get_results("select * from {$wpdb->prefix}delayedCoupons_coupons");
    
    return wp_send_json($recordsList);
  }
  

  /** Deletes a coupon db entry
   * id param is taken from the php filestream sent by
   * application/json requestor
   */
  public function handleDeleteCurrentCoupon() {
    // access php file stream
    $fileContents = file_get_contents('php://input');
    $decodedContents = json_decode($fileContents);
    $couponId = $decodedContents->couponId;
    
    global $wpdb;
    $result = $wpdb->delete("{$wpdb->prefix}delayedCoupons_coupons", ['couponId' => "{$couponId}"]);
    
    // false on error, otherwise 1
    wp_send_json($result);
  }
}

////// Wordpress Action Hooks //////
/// todo add handlers
//add_action('wp_ajax_loadCouponData', null);
//add_action('wp_ajax_deleteCurrentCoupon', null);




















