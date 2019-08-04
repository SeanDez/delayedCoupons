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
  
  
  
  
}