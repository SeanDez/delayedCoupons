<?php
namespace admin\controllers;

require_once(PLUGIN_FOLDER_PATH . '/vendor/autoload.php');
use League\Uri\Parser;
use Pdp\Cache;
use Pdp\CurlHttpClient;
use Pdp\Manager;
use Pdp\Rules;



trait protectedMethodsInVisitors {
  
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
   *
   * not test covered
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
  
  /** Chunks a url down to an associative array
   * @return array. Named array of sub.main.tld/cat/page..., and ?query=values
   **
   * passes test with a long url
   */
  protected function breakApartUrl() : array {
    // i = 0: raw match
    // i = 1: capture group for: subdomain, domain, categories, pages
    // i = 2: capture group: query string
    $regexOutput = [];
    preg_match('/(^http:\/\/[^\?\s]+)(\?[^\s]+)?/', wp_get_referrer(), $regexOutput);
    
    $brokenUpUrl = [
      'urlRoot' => $regexOutput[1]
      , 'queryString' => $regexOutput[2] ? $regexOutput[2] : ''
    ];
    
    return $brokenUpUrl;
  }
  
  /** Captures the subdomain, if any
   * @return string,
   *
   * DEPRECATED
   */
  protected function captureSubdomain() : string {
    
    $manager = new Manager(new Cache(), new CurlHttpClient());
    $rules = $manager->getRules();
    
    // grab the root of the url, defined as:
    // subdomain.maindomain.tld
    $uriComponents = $rules->resolve(
      $this->breakApartUrl()['subMainTld']
    );
    
    // return only the subdomain
    $subdomain = $uriComponents->getSubDomain();
    return $subdomain;
  }
  
  /** Captures path excluding subdomain
   *
   * not test covered
   */
  protected function capturePathWithoutSubdomain() : string {
    $regexOutput = [];
    
    // searches for 2 period delimiters. No match if none
    $regexTest = '/http:\/\/(\w*)\.\w*\./';
    
    preg_match($regexTest, wp_get_referrer(), $regexOutput);
    
    if (count($regexOutput) > 0) {
      return $regexOutput[1];
    }
    return '';
  }
  
  
  /** Insert a new row into visits table
   * @param $visitorIdCookie string. Value of cookie visitorId
   * @return int = 1 on success. returns false on error
   *
   * not test covered
   */
  protected function logVisit($visitorIdCookie) : int {
    global $wpdb;
    $result = $wpdb->insert(
      "{$wpdb->prefix}delayedCoupons_visits",
      [
        "visitorId" => $visitorIdCookie
        , "urlVisited" => wp_get_referrer()
        , "urlBase" => $this->breakApartUrl()['subMainTld']
      ]
    );
    
    return $result;
  }
  
  protected function scanAgainstUrlTargets() {
  
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









