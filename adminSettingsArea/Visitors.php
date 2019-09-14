<?php
namespace admin\controllers;

require_once(PLUGIN_FOLDER_PATH . '/vendor/autoload.php');
use League\Uri\Parser;
use Pdp\Cache;
use Pdp\CurlHttpClient;
use Pdp\Manager;
use Pdp\Rules;


trait protectedMethodsInVisitors {
  protected $visitorIdCookie;
  /** Get visitor Id from cookie
   * If none, return an explicit value to indicate none
   *
   * @return mixed. string = value, otherwise false
   */
  protected function getVisitorIdCookie() : void {
    if (isset($_COOKIE['delayedCoupons_visitorId'])) {
      $this->visitorIdCookie = $_COOKIE['delayedCoupons_visitorId'];
    }
  }
  
  /** Creates a new database visitor record in the visits table
   *
   * not test covered
   */
  protected function createVisitorIdCookie() : void {
    global $wpdb;
    
    $highestVisitorId = $wpdb->get_var("SELECT MAX(visitorId) from {$wpdb->prefix}delayedCoupons_visits");
    
    $newIdForNewVisitor = intval($highestVisitorId) + 1;
    $this->visitorIdCookie = $newIdForNewVisitor;
    
    $setResult = setcookie(
      'delayedCoupons_visitorId'
      , strval($newIdForNewVisitor)
      , time() + (50 * 365 * 24 * 60 * 60)
      , '/'
      , null
      , null
      , true
    );
  }
  
  /** Chunks a url down to an associative array
   * @return array. Named array of sub.main.tld/cat/page..., and ?query=values
   **
   * passes test with a long url
   */
  protected function breakApartUrl() : array {
    $currentUrl = 'http://' . $_SERVER['SERVER_NAME'] . wp_unslash($_SERVER['REQUEST_URI']);
    
    // i = 0: raw match
    // i = 1: subdomain, domain, categories, pages
    // i = 2: query string
    $regexOutput = [];
    preg_match('/(^http:\/\/[^\?\s]+)(\?[^\s]+)?/', $currentUrl, $regexOutput);
    
    $brokenUpUrl = [
      'rawUrl' => isset($regexOutput[0]) ? $regexOutput[0] : ''
      , 'urlRoot' => isset($regexOutput[1]) ? $regexOutput[1] : ''
      , 'queryString' => isset($regexOutput[2]) ? $regexOutput[2] : ''
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
    
    preg_match($regexTest, wp_get_referer(), $regexOutput);
    
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
        , "urlVisited" => $urlData['rawUrl']
        , "urlRoot" => $urlData['urlRoot']
        , 'queryString' => $urlData['queryString']
        , 'unixTime' => microtime(true)
      ]
    );
    
    return $result;
  }
  
  /** checks the current page visit to see if it meets triggers of any targets
   *
   * @param $urlData object. contains rawUrl string
   *
   * @param $visitorId string. taken from visitor cookie. used to match against visit records
   *
   * @return mixed. Object containing target data on success, otherwise null
   */
  protected function scanAgainstUrlTargets(array $urlData, string $visitorId) {
    global $wpdb;
    
    $visitUrlCount = $wpdb->get_var("
      select count(*)
      from {$wpdb->prefix}delayedCoupons_visits v
      where v.urlVisited = '{$urlData['rawUrl']}'
    ");
    
    // select the target record that matches the current visit
    $matchingTargetRow = $wpdb->get_row("
      select *
      from {$wpdb->prefix}delayedCoupons_targets t
      where t.targetUrl = '{$urlData['rawUrl']}'
    ");
    
    // if target is found check if the visit count for this user falls within parameters
    if (isset($matchingTargetRow)) {
      $minTargetViews = $matchingTargetRow->displayThreshold;
      $maxTargetViews = $minTargetViews + $matchingTargetRow->offerCutoff;
      
      $numberOfPageVisitsByUser = intval(
        $wpdb->get_var("
        select count(*)
        from {$wpdb->prefix}delayedCoupons_visits v,
          {$wpdb->prefix}delayedCoupons_targets t
        where v.visitorId = '{$visitorId}'
        and v.urlVisited = '{$urlData['rawUrl']}'
        and v.unixTime > t.unixTime
      "));
      
      if ($numberOfPageVisitsByUser >= $minTargetViews &&
        $numberOfPageVisitsByUser <= $maxTargetViews
      ) {
        return $matchingTargetRow;
      }
    }
    
    return null;
  }
  
  /** Returns coupon data as assoc. array
   */
  protected function lookUpCouponData(string $couponId) : object {
    global $wpdb;
    
    $query = $wpdb->get_row("
      SELECT *
      FROM {$wpdb->prefix}delayedCoupons_coupons c
      WHERE c.couponId = {$couponId}
    ");
    
    return $query;
  }
  
  /** Render the coupon to the page as an overlay
   * @param $couponSettings object. Has information for text/bg colors, and headline/desc content
   */
  protected function renderCoupon(object $couponSettings) {
    require_once(PLUGIN_FOLDER_PATH . '/frontFacingOverlay/coupon.php');
  }
  
  /** Filters urls of junk pages that should not be recorded
   * @return bool. true if passed. false if match found
   */
  protected function filterOutJunkUrls(array $urlInfo) : bool {
    $junkUrlPatterns = [
      '/\/wp-admin\//'
      , '/\/wp-cron.php/'
    ];
    
    foreach ($junkUrlPatterns as $pattern) {
      if (preg_match($pattern, $urlInfo['rawUrl']) === 1) {
        return false;
      }
    }
    return true;
  }
}


class Visitors {
  use protectedMethodsinVisitors;
  
  
  ////// Public Functions //////
  
  /** Visitor cookie generation or retrieval
   * MUST run before the parent visit logging and coupon render method
   */
  public function getOrSetVisitorCookie() {
    $this->getVisitorIdCookie();
    
    if (isset($this->visitorIdCookie) === false) {
      $this->createVisitorIdCookie();
    }
  }
  
  /** handle visit logging and coupon renders on every single page visit
   *
   * IMPORTANT: Relies on getOrSetVisitorCookie() to run in an earlier hook! Otherwise will break
   *
   * visits will always log to the database
   *
   * visits will check against a database of triggers for a given target. Triggers are all URL based
   *
   * If a match is found, trigger conditions will be checked against. A positive result will return the coupon data to display
  */
  public function logVisitsAndControlCouponDisplay() {
    // grab the url pieces
    $urlInfo = $this->breakApartUrl();
    
    try {
      // log the visit if not a junk url
      if ($this->filterOutJunkUrls($urlInfo) === true) {
        $this->logVisit($this->visitorIdCookie, $urlInfo);
  
        // check if this visit matches a URL. if so, return trigger conditions and coupon data
        $targetMatchData = $this->scanAgainstUrlTargets($urlInfo, $this->visitorIdCookie);
  
        // if $targetMatchData then lookup the coupon data and render it. Otherwise die
        if (isset($targetMatchData->targetId)) {
          $textDescriptionColors = $this->lookUpCouponData($targetMatchData->fk_coupons_targets);
          $this->renderCoupon($textDescriptionColors);
        }
        
      }
    } catch (\Exception $error) {
      print_r('something went awry while logging visit, scanning against the targets table, or attempting to render');
    }
  }
}









