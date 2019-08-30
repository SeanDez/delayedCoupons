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
  
  /** Utility functions
   */
  
  protected function checkIfAdmin() {
    $isAdmin = current_user_can('delete_site');
    return $isAdmin;
  }
  
  /** Callback functions
   */
  
  /** Adds coupon and also target data
   * responds with single success or error key
   * success key sends back success data
   * error key sends back error message to be shown in an error box
   *
   * @param $request. all params including json, route, queries, body are consolidated into this one object
   */
  public function addNewCoupon(\WP_REST_Request $request) {
    global $wpdb;
    $jsonArray = $request->get_params();
    
    
    $couponQueryResult = $wpdb->insert(
      "{$wpdb->prefix}delayedCoupons_coupons"
      , [
        'titleText' =>
          $jsonArray['couponHeadline'],
        'descriptionText' => $jsonArray['couponDescription'],
        'titleTextColor' => $jsonArray['headlineTextColor'],
        'titleBackgroundColor' =>
          $jsonArray['headlineBackgroundColor'],
        'descriptionTextColor' => $jsonArray['descriptionTextColor'],
        'descriptionBackgroundColor' => $jsonArray['descriptionBackgroundColor']
      ]);
    
    $couponId = $wpdb->insert_id;
    
    // insert a target row using couponId as a foreign key
    $wpdb->insert("{$wpdb->prefix}delayedCoupons_targets", [
      'isSitewide' => false
      , 'targetUrl' => $jsonArray['pageTarget']
      , 'displayThreshold' => $jsonArray['displayThreshold']
      , 'offerCutoff' => $jsonArray['numberOfOffers']
      , 'fk_coupons_targets' => $couponId
      , 'unixTime' => microtime(true)
    ]);
    
    // todo figure out how to send 2 results back and how to logically configure it
    if ($wpdb->last_error !== '') {
      wp_send_json(['error' => $wpdb->last_error]);
    }
    
    wp_send_json([
      'newCouponId' => $couponId
    ]);
  
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
    $couponId = $request->get_param('couponId');
    
    $queryResult = $wpdb->delete("{$wpdb->prefix}delayedCoupons_coupons",  ['couponId' => $couponId]);
    
    if ($queryResult === 1) {
      wp_send_json([
        'deletedCouponId' => $couponId
      ]);
    } else if ($queryResult === false) {
      wp_send_json(['error' => '$queryResult returned false indicating the database failed to delete the row targeted by couponId']);
    } else {
      wp_send_json(['error' => 'unspecified error, else block in callback hit']);
    }
    
    wp_send_json($request);
    wp_send_json('test string');
  }
  
  
  
  
  /** Route registrations
   */
  
  public function registerLoadCouponRoute() : void {
    register_rest_route($this->urlBase, 'loadAll', [
      'methods' => ['GET', 'post'],
      'callback' => [$this, 'respondAllCoupons']
    ]);
  }
  
  public function registerAddCoupon() : void {
    register_rest_route($this->urlBase, 'add', [
      'methods' => 'post',
      'callback' => [$this, 'addNewCoupon']
    ]);
  }
  
  
  public function registerDeleteSingleCouponRoute() : void {
    register_rest_route($this->urlBase, "delete/(?P<couponId>[\d]+)", [
      'methods' => ['get', 'post'],
      'callback' => [$this, 'deleteSingleCoupon']
    ]);
  }
  
}

