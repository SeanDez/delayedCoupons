<?php
require (PLUGIN_FOLDER_PATH . 'vendor/autoload.php');


class Visitors {
  
  /** Get visitor Id from cookie
   * If none, return an explicit value to indicate none
   */
  
  
  
  
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
    $cookieInfo = $this->getVisitorCookie();
    if ($cookieInfo === null) {
      $cookieInfo = $this->createNewVisitor();
    }
    
    // log the visit
    $this->logVisit($cookieInfo);
    
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