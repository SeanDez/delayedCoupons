<?php

namespace admin\controllers;


class ApiController extends \WP_Rest_Controller {
  // edit these, especially the version, when they change
  protected $namespace = 'delayedCoupons';
  protected $version = '1.0';
  
  // use this
  public $namepaceAndVersion;
  
  public function __construct() {
    $this->namepaceAndVersion = $this->namespace . '/' . $this->version;
  }
  
  
  /** Utility functions
   */
  
  
  /** Sends auth error if not admin
   */
  protected function isAdminOrRejectionResponse() {
    if (current_user_can('administrator') === false) {
      wp_send_json(['error' => 'You do not have Administrator credentials.']);
    }
  }
  
  
  /** Translate error keys into messages
   *
   * @param $errorKeys. keys set to non-null value
   * @return array. Messages ready to be concatted and displayed
   */
  protected function translateErrorKeysIntoMessages (array $errorKeys) : array {
    $errorMessages = [];
    
    foreach ($errorKeys as $key => $value) {
      if ($key === 'clientNonce') { continue; }
      else if ($key === 'displayThreshold') {
        $errorMessages[] = 'Number of Required Page Visits Before Showing Coupon.';
      } else if ($key === 'numberOfOffers') {
        $errorMessages[] = 'Max Times Offer Shown (per visitor).';
      } else if (isset($key)) {
        $wordsArray = preg_split('/(?=[A-Z])/', $value, null, PREG_SPLIT_NO_EMPTY);
        
        // capitalizes first word which is normally lowercase by convention
        $wordsArray[0] = ucfirst($wordsArray[0]);
        
        $wordsString = implode(" ", $wordsArray);
        $messageWithPeriod = $wordsString . '.';
        
        $errorMessages[] = $messageWithPeriod;
      } else {
        wp_send_json(['error' => 'error from function translatedErrorKeysIntoMessages']);
      }
    }
    
    return $errorMessages;
  }
  
  
  /** returns target data if a current target matches, otherwise returns null
   */
  protected function getTargetRowForMatchingPageUrl(string $pageUrl)  {
    global $wpdb;
    
    $targetRow = $wpdb->get_row("
      select *
      from {$wpdb->prefix}delayedCoupons_targets
      where targetUrl = '{$pageUrl}'
    ");
    
    if (isset($targetRow)) {
      return $targetRow;
    }
    
    else return null;
  }
  
  
  /** responds with JSON string, with an embedded array, on error. else returns false
   */
  protected function respondWithErrorMessagesIfNullFieldsFound(array $requestParams) {
    $errorKeys = [];
    foreach ($requestParams as $key => $value) {
      if (isset($key) === false || $value === "") {
        $errorKeys[] = $key;
      }
    }
    
    $errorMessageArray = $this->translateErrorKeysIntoMessages($errorKeys);
    $uiReadyMessage = 'Please fill out these empty fields: ' . implode(' ' , $errorMessageArray);
    
    wp_send_json(['error' => $uiReadyMessage]);
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
    
    // server form validation
    $this->respondWithErrorMessagesIfNullFieldsFound($jsonArray);
    
    $currentPageTarget = $this->getTargetRowForMatchingPageUrl($jsonArray['pageTarget']);
    
    if (isset($currentPageTarget)) {
      wp_send_json(['error' => "A coupon is already assigned to this page. If you want to reassign a coupon, first click on 'View Coupons' and delete the record with id: {$currentPageTarget->fk_coupons_targets}"]);
    };
    
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
        , 'addCouponBorder' => $jsonArray['addCouponBorder']
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
  
  
  public function loadCoupons(\WP_REST_Request $request) {
    global $wpdb;
    
    $queryParams = $request->get_params();
    
    $rows = $wpdb->get_results("
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
    LIMIT {$queryParams['limit']}
    OFFSET {$queryParams['offset']}
    ");
    
    $totalCount = $wpdb->get_var("select count(*) from {$wpdb->prefix}delayedCoupons_coupons");
    
    wp_send_json([
      'rows' => $rows
      , 'totalCount' => $totalCount
    ]);
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
  }
  
  
  public function authCallback(\WP_REST_Request $request) : void {
    $this->isAdminOrRejectionResponse();
    
    wp_send_json([
      'success' => "You've received back an Authenticated endpoint response and have access to wp_get_current_user()"
    ]);
  }
  
  
  
  /** Route registrations
   */
  
  
  public function registerAuth() : void {
    register_rest_route($this->namepaceAndVersion, 'auth', [
      'methods' => 'get'
      , 'callback' => [$this, 'authCallback']
    ]);
  }
  
  
  public function registerLoadCouponRoute() : void {
    register_rest_route($this->namepaceAndVersion, "load", [
      'methods' => ['get', 'post'],
      'callback' => [$this, 'loadCoupons']
    ]);
  }
  
  
  public function registerAddCoupon() : void {
    register_rest_route($this->namepaceAndVersion, 'add', [
      'methods' => 'post',
      'callback' => [$this, 'addNewCoupon']
    ]);
  }
  
  
  public function registerDeleteSingleCouponRoute() : void {
    register_rest_route($this->namepaceAndVersion, "delete/(?P<couponId>[\d]+)", [
      'methods' => ['get', 'post'],
      'callback' => [$this, 'deleteSingleCoupon']
    ]);
  }
  
}

