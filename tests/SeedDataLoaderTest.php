<?php

require_once (PLUGIN_FOLDER_PATH . '/SeedDataLoader.php');


class PublicSeedDataLoader extends SeedDataLoader {
  protected $instance;
  
  public function __construct() {
    
    $this->instance = new SeedDataLoader();
  }
  
  public function buildInsertQuery(array $dataList): string {
    return $this->instance->buildInsertQuery($dataList);
  }
  
}

class SeedDataLoaderTest extends \PHPUnit\Framework\TestCase {
  
  
  public function __construct() {
    parent::__construct(); // needed in test classes
    
  }
  
  
  public function testBuildInsertQuery() {
    $publicSeedDataLoader = new PublicSeedDataLoader();
  
    $inputList = [
      array (
        'isSiteWide' => 1,
        'targetUrl' => 'cnn.com/wfcrv',
        'displayThreshold' => 3,
        'offerCutoff' => 7,
      ),
      array (
        'isSiteWide' => 0,
        'targetUrl' => 'telegraph.co.uk/guedd',
        'displayThreshold' => 7,
        'offerCutoff' => 7,
      ),
      array (
        'isSiteWide' => 0,
        'targetUrl' => 'www.telegraph.co.uk/vmri2',
        'displayThreshold' => 2,
        'offerCutoff' => 3,
      )
    ];
    
    $expectedString = " ('1', 'cnn.com/wfcrv', '3', '7'), ('0', 'telegraph.co.uk/guedd', '7', '7'), ('0', 'www.telegraph.co.uk/vmri2', '2', '3');";
    
    $result = $publicSeedDataLoader->buildInsertQuery($inputList);
    
    $this->assertEquals($expectedString, $result);
  }
  
// public function testRunInsertQuery() {}
}