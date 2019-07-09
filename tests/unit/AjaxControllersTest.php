<?php
namespace utilities;

require_once ('/var/www/html/wptest2/wp-content/plugins/delayedCoupons/vendor/autoload.php');
require_once ('/var/www/html/wptest2/wp-content/plugins/delayedCoupons/adminSettingsArea/AjaxControllers.php');

////// constants //////
define('PLUGIN_FOLDER_PATH', '/var/www/html/wptest2/wp-content/plugins/delayedCoupons');
define("PLUGIN_FOLDER_URL", '/var/www/html/wptest2/wp-content/plugins/delayedCoupons');



use admin\controllers\AjaxController;
use \admin\setupEnvVariables;
use \phpmock\mockery\PHPMockery;


class AjaxControllersTest extends \Codeception\TestCase\WPTestCase {

  use setupEnvVariables {setupEnvVariables::__construct as __sevConstruct;}
  
  public function __construct() {
    parent::__construct();
    $this->__sevConstruct();
  }



  public function setUp(): void {
    // Before...
    parent::setUp();

    // Your set up methods here.

  }

  public function tearDown(): void {
    // Your tear down methods here.

    // Then...
    parent::tearDown();
  }

  // Tests

  public function testEnvVariables() {
    $this->assertEquals("development", $_ENV['NODE_ENV']);
  }

  public function testHandleCouponData() {
    // setup a mock return associative array
    $inputOutput = [['k', 'v'], ['k2', 'v2']];
    
    // setup targets under test
    $ajaxController = new AjaxController();
    
    
    // use mockery to mock the $wpdb class to return a fake array
    $wpdb = \Mockery
      ::mock('\WPDB')
      ->makePartial();
    $wpdb
      ->shouldReceive('get_results')
      ->andReturn('testing');
  
    $result = $ajaxController->handleLoadCouponData();
    codecept_debug($result);
    codecept_debug('=====$result=====');
  
    $this->assertEquals(
      $inputOutput,
      json_decode($result)
    );
  }
  
  
}
