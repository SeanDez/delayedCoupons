<?php
// require (PLUGIN_FOLDER_PATH . '/vendor/autoload.php');
require (ADMIN_SETTINGS_PATH . '/Visitors.php');

use \admin\controllers\Visitors;
use \admin\controllers\protectedMethodsInVisitors;


class VisitorsTest extends \PHPUnit\Framework\TestCase {
  use protectedMethodsInVisitors;
  
  public function testCaptureSubdomainWithLongUrl() {

    $result = $this->captureSubdomain();
    $this->assertEquals('subdomain', $result);
  }
  
  public function testBreakApartUrl() {
    
    $result = $this->breakApartUrl();
    $this->assertEquals([
        'subMainTld' => 'subdomain.maindomain.com'
        , 'slashQueryString' => '/?query1=value1&query2=value2'
      ]
    , $result);
  }
  
  
}