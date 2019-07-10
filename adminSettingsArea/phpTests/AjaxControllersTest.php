<?php

require_once (ADMIN_SETTINGS_PATH . '/AjaxControllers.php');
use admin\controllers\AjaxController;

use \PHPUnit\Framework\TestCase;

/** Tests the handlers of the React application
 * Does not test the DB
 */

class AjaxControllersTest extends TestCase {
  
  public function testHandleLoadCouponData() {
    $ajaxController = new AjaxController();
    $result = $ajaxController->handleLoadCouponData();
    
    $this->assertEquals(
      json_encode([["k1" => "v1"], ["k2" => "v2"], ["k3" => "v3"]]),
      $result);
  }
}