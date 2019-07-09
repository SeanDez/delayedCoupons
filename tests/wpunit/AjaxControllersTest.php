<?php
namespace utilities;

require_once (PLUGIN_FOLDER_PATH . '/vendor/autoload.php');
require_once (PLUGIN_FOLDER_PATH . '/adminSettingsArea/AjaxControllers.php');

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
    // use mockery to mock the $wpdb class to return a fake array
    $wpdb = \Mockery::mock('\WPDB');
    $wpdb
      ->shouldReceive('get_results')
      ->andReturn([['k', 'v'], ['k2', 'v2']]);
  
    
    PHPMockery::mock(__NAMESPACE__, "wp_send_json")
              ->andReturn();
    
    
    // @expect: <hardcoded array> === $dbQuery
  }
  
  
}
