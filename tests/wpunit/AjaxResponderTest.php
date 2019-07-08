<?php

require_once(PLUGIN_FOLDER_PATH . '/vendor/autoload.php');
require_once (PLUGIN_FOLDER_PATH . '/adminSettingsArea/src/utilities/AjaxResponder.php');




class AjaxResponderTest extends \Codeception\TestCase\WPTestCase {
  
  public function __construct() {
    parent::__construct(); // js equivalent: super()
    
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


//  public function testRes() : void {
//    $ajaxResponder = new \admin\utilities\AjaxResponder(getenv('NODE_ENV'));
//
//    $output = $ajaxResponder->res([['k' => 'v']]);
//
//    // true needed to convert from stdClass object to (usable) array
//    $decodedOutput = json_decode($output, true);
//
//    $this->assertEquals([['k' => 'v']], $decodedOutput);
//  }



  public function test_it_works()
  {
      $post = static::factory()->post->create_and_get();

      $this->assertInstanceOf(\WP_Post::class, $post);
  }
}













