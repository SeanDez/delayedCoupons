<?php
namespace admin\controllers;

use mysql_xdevapi\Exception;

require (PLUGIN_FOLDER_PATH . 'vendor/autoload.php');


trait protectedMethodsinVisitors {
  // to enable importing protected methods into test class
  
  
  /** Get visitor Id from cookie
   * If none, return an explicit value to indicate none
   *
   * @return mixed. string = value, otherwise false
   */
  protected function getVisitorIdCookie() {
    if ($_COOKIE['visitorId']) {
      return $_COOKIE['visitorId'];
    }
    else {
      return false;
    };
  }
  
  /** Creates a new database visitor record in the visits table
   */
  protected function createVisitorIdCookie() : bool {
    global $wpdb;
    // select max(visitorId) from wp_dc_visits
    $highestVisitorId = $wpdb->get_var("SELECT MAX(visitorId) from {$wpdb->prefix}delayedCoupons_visits");
    
    $newIdForNewVisitor = intval($highestVisitorId) + 1;
    $setResult = setcookie(
      'visitorId',
      "{$newIdForNewVisitor}", [
        'httponly' => true
        , 'expires' => time() + (50 * 365 * 24 * 60 * 60)
      ]
    );
    
    return $setResult;
  }
  
  protected function logVisit($visitorIdCookie) {
    global $wpdb;
    $wpdb->insert(
    "{$wpdb->prefix}delayedCoupons_visits",
      [
        "visitorId" => $visitorIdCookie
        , "urlVisited" => wp_get_referrer()
      ]
    );
  }
  
}

class Visitors {
  use protectedMethodsinVisitors;
  
  
  
  ////// Public Functions //////
  
  
  /** handle cookie checks and database on every single page visit
   *
   * If no cookie it will be set
   *
   * visits will always log to the database
   *
   * visits will check against a database of triggers for a given target. Triggers are all URL based
   *
   * If a match is found, trigger conditions will be checked against. A positive result will return the coupon data to display
   *
   * @param $urlInfo array. Contains page url of visitor
   */
  
  public function logVisitsAndControlCouponDisplay($urlInfo) {
    // get visitor cookie or set new one
    $cookieInfo = $this->getVisitorIdCookie();
    
    // for new visitors
    if ($cookieInfo === false) {
      $cookieInfo = $this->createVisitorIdCookie();
    }
    
    
    // log the visit
    try {
      $this->logVisit($cookieInfo);
    } catch (\Exception $error) {
      print_r('something went awry while logging visit');
    }
    
    
    // check if this visit matches a URL. if so, return trigger conditions and coupon data
    $matchData = $this->scanAgainstUrlTargets($urlInfo);
    
    // if $matchData['found'] then lookup the coupon data and render it. Otherwise die
    if ($matchData['found']) {
      $textDescriptionColors = $this->lookupCouponData($urlInfo);
      $this->renderCoupon($textDescriptionColors);
    } else {
      wp_die();
    }
    
  }
}