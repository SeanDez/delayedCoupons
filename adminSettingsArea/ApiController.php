<?php

namespace admin\controllers;



class ApiController extends \WP_Rest_Controller {
  // edit these, especially the version, when they change
  protected $namespace = 'delayedCoupons';
  protected $version = '1.0';
  
  // use this
  protected $urlBase;
  
  public function __construct() {
    $this->urlBase = $this->namespace . '/' . $this->version;
    echo '====================================================';
    echo var_export($this->urlBase, true);
    echo'                   =====$this->urlBase=====                 ';
    
  }
  
  
  
  public function respondAllCoupons() {
    global $wpdb;
    $query = $wpdb->get_results("select * from {$wpdb->prefix}delayedCoupons_coupons");
    
    wp_send_json($query);
  }
  
  
  public function deleteSingleCoupon(int $couponId) {
    global $wpdb;
    
    if ($couponId) {
      $result = $wpdb->delete("{$wpdb->prefix}delayedCoupons_coupons", [
        'couponId' => $couponId
      ]);
      
      // respond with success or error based on 1 row affected being success
      wp_send_json($result === 1 ?
        ['success' => '1 coupon deleted'] :
        ['error' => 'Something went wrong during the delete db query itself. A non-1 value was returned']
      );
    }
    else {
      wp_send_json(['error' => 'no couponId key']);
    }
  }
  
  
  public function respondWithString() {
    return 'dummy return from object';
  }
  
  
  public function registerDummyRoute() {
    register_rest_route($this->urlBase, 'dummyMethod', [
      'methods' => 'GET',
      'callback' => [$this, 'respondWithString']
    ]);
  }
  
  
  public function registerLoadCouponRoute() {
    register_rest_route($this->urlBase, 'loadAllCoupons', [
      'methods' => 'GET',
      'callback' => 'respondAllCoupons'
    ]);
  }
  
  
  public function registerDeleteSingleCouponRoute() {
    register_rest_route($this->urlBase, 'deleteCoupon/(?P<couponId>\d+)', [
      'methods' => 'get',
      'callback' => 'deleteSingleCoupon'
    ]);
  }
  
}

