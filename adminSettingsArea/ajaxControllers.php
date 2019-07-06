<?php
namespace admin\controllers;

class AjaxController {

  public function handleLoadCouponData() {
    // run a select * query on all coupon records
    global $wpdb;
    
    $recordsList = $wpdb::get_results("select * from {$wpdb->prefix}delayedCoupons_coupons");
    
    // respond with the data
    
  }

  public function handleDeleteCurrentCoupon() {
    // access php file stream
    $fileContents = file_get_contents('php://input');
    $decodedContents = json_decode($fileContents);
    $couponId = $decodedContents->couponId;
    
    global $wpdb;
      $wpdb::delete("{$wpdb->prefix}delayedCoupons_coupons", ['couponId' => "{$couponId}"]);
  }
}

////// Wordpress Action Hooks //////
/// todo add handlers
add_action('wp_ajax_loadCouponData', null);
add_action('wp_ajax_deleteCurrentCoupon', null);




















