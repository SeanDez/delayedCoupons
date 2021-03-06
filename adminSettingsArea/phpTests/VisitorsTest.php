<?php
// require (PLUGIN_FOLDER_PATH . '/vendor/autoload.php');
require_once (ADMIN_SETTINGS_PATH . '/Visitors.php');
require_once (ADMIN_SETTINGS_PATH . '/src/utilities/wordpressMockFunctions.php');

use \admin\controllers\Visitors;
use \admin\controllers\protectedMethodsInVisitors;





class VisitorsTest extends \PHPUnit\Framework\TestCase {
  use protectedMethodsInVisitors;
  
//  public function testCaptureSubdomainWithLongUrl() {
//
//    $result = $this->captureSubdomain();
//    $this->assertEquals('subdomain', $result);
//  }
  
  public function testBreakApartUrl() {
    $_SERVER['REQUEST_URI'] = 'category/page?query1=value1&query2=value2';
    
    $result = $this->breakApartUrl();
    $this->assertEquals([
      'rawUrl' => 'http://subdomain.maindomain.com/category/page?query1=value1&query2=value2'
        , 'urlRoot' => 'http://subdomain.maindomain.com/category/page'
        , 'queryString' => '?query1=value1&query2=value2'
      ]
    , $result);
  }
  
  
}