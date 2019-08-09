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
    if (array_key_exists('visitorId', $_COOKIE)) {
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
      'visitorId'
      , "{$newIdForNewVisitor}"
      , time() + (50 * 365 * 24 * 60 * 60)
      , '/'
      , null
      , null
      , true
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
    preg_match('/(^http:\/\/[^\?\s]+)(\?[^\s]+)?/', wp_get_referer(), $regexOutput);
    
    $brokenUpUrl = [
      'rawUrl' => $regexOutput[0]
      , 'urlRoot' => $regexOutput[1]
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
   * @param $urlData array. the broken up URL data;
   * @return int = 1 on success. returns false on error
   *
   * not test covered
   */
  protected function logVisit(string $visitorIdCookie, array $urlData) : int {
    global $wpdb;
    
    $result = $wpdb->insert(
      "{$wpdb->prefix}delayedCoupons_visits",
      [
        "visitorId" => $visitorIdCookie
        , "urlVisited" => $urlData['rawUrl'] . $urlData['queryString']
        , "urlRoot" => $urlData['urlRoot']
        , 'queryString' => $urlData['queryString']
      ]
    );
    
    return $result;
  }
  
  protected function scanAgainstUrlTargets(array $urlData) {
    global $wpdb;

    $conditionMatch = $wpdb->get_results("
      SELECT t.*, visitData.count
      FROM
        {$wpdb->prefix}delayedCoupons_targets t, (
          select count(*)
          from {$wpdb->prefix}delayedCoupons_visits v
          ) as visitData
      WHERE t.targetUrl = {$urlData['rawUrl']}
        AND t.displayThreshold < visitData.count
        AND  t.displayThreshold + t.offerCutoff >= visitData.count
    ");
    
    return $conditionMatch;
  }
  
  /** Returns coupon data as assoc. array
   */
  protected function lookUpCouponData(string $couponId) {
    global $wpdb;
    
    $query = $wpdb->get_results("
      SELECT *
      FROM {$wpdb->prefix}delayedCoupons_coupons
      WHERE couponId = {$couponId}
    ");
    
    return $query;
  }
  
  /** Render the coupon to the page as an overlay
   * @param $couponSettings array. Has information for text/bg colors, and headline/desc content
   */
  protected function renderCoupon(array $couponSettings) {
//    require_once(PLUGIN_FOLDER_PATH . 'frontFacingOverlay/coupon.php');
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
  
  public function logVisitsAndControlCouponDisplay() {
    // get visitor cookie or set new one
    $cookieInfo = $this->getVisitorIdCookie();
    
    // for new visitors
    if ($cookieInfo === false) {
      $cookieInfo = $this->createVisitorIdCookie();
    }
  
    // grab the url pieces
    $urlInfo = $this->breakApartUrl();
    
    // log the visit
    try {
      $this->logVisit($cookieInfo, $urlInfo);
    } catch (\Exception $error) {
      print_r('something went awry while logging visit');
    }
    
    // check if this visit matches a URL. if so, return trigger conditions and coupon data
    $targetMatchData = $this->scanAgainstUrlTargets($urlInfo);
    
    // if $targetMatchData then lookup the coupon data and render it. Otherwise die
    if (array_key_exists('targetId', $targetMatchData)) {
      $textDescriptionColors = $this->lookUpCouponData($targetMatchData['fk_coupons_targets']);
      $this->renderCoupon($textDescriptionColors);
    }
    // else do nothing. DON'T Die
    
  }
}









