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
    
  }
  
  
  /** Callback functions
   */
  public function addNewCoupon() {
    global $wpdb;
  
    // grab the json data
    $fileContents = file_get_contents('php://input');
    $decodedContents = json_decode($fileContents);
  
    
    
    wp_send_json('placeholder');
  }
  
  
  public function respondAllCoupons() {
    global $wpdb;
    
      $urlCounts = $wpdb->get_results("
      SELECT c.couponId, t.fk_coupons_targets, t.targetUrl, t.displayThreshold, t.offerCutoff, visitCounts.totalVisits, c.titleText, c.descriptionText
      FROM {$wpdb->prefix}delayedCoupons_coupons c
      
      left join {$wpdb->prefix}delayedCoupons_targets t
      on c.couponId = t.fk_coupons_targets
      
      left join -- left retains all left (target) rows
      ( -- step 1
        SELECT urlVisited -- needed for the join
        , count(*) as 'totalVisits'
        FROM {$wpdb->prefix}delayedCoupons_visits
        
        group by urlVisited
      ) as visitCounts
      on t.targetUrl = visitCounts.urlVisited
      
      order by c.couponId
      ");
      
      wp_send_json($urlCounts);
  }
  
  
  public function deleteSingleCoupon(\WP_REST_Request $request) {
    global $wpdb;
    
    $fullRequest = $request;
    $stop = 0;
    
//    if ($couponId) {
//      $result = $wpdb->delete("{$wpdb->prefix}delayedCoupons_coupons", [
//        'couponId' => $couponId
//      ]);
      
      // respond with success or error based on 1 row affected being success
      wp_send_json($request);
      
//        $result === 1 ?
//        ['success' => '1 coupon deleted'] :
//        ['error' => 'Something went wrong during the delete db query itself. A non-1 value was returned']
//      );
//    }
//    else {
//      wp_send_json(['error' => 'no couponId key']);
//    }
  }
  
  
  
  
  /** Route registrations
   */
  
  public function registerLoadCouponRoute() {
    register_rest_route($this->urlBase, 'loadAllCoupons', [
      'methods' => 'GET',
      'callback' => [$this, 'respondAllCoupons']
    ]);
  }
  
  
  public function registerDeleteSingleCouponRoute() {
    register_rest_route($this->urlBase, 'deleteCoupon/(?P<couponId>[\d]+)', [
      'methods' => 'get',
      'callback' => [$this, 'deleteSingleCoupon']
    ]);
  }
  
}

