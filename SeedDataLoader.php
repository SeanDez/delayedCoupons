<?php

require_once ('vendor/autoload.php');

// Env variables
use \Dotenv\Dotenv;


class SeedDataLoader {
  protected $userName;
  protected $password;
  protected $server;
  protected $dbName;
  protected $dbConnection;
  
  
  public function __construct() {
    Dotenv::create(__DIR__)->load();
  

    $this->userName = getenv('SQL_USER');
    $this->password = getenv('SQL_PW');
    $this->server = 'localhost';
    $this->dbName = getenv('SQL_DB');
    
    $this->connectToDbReportAnyError();
    $this->closeConnection();
  }
  
  
  /** Connect to database
   * Also see if there's a connection error
   */
  public function connectToDbReportAnyError() : void {
    $this->dbConnection = new mysqli(
      $this->server,
      $this->userName,
      $this->password,
      $this->dbName
    );
  
    if ($this->dbConnection->connect_error) {
      die('Connection Error: ' . $this->dbConnection->connect_error);
    }
    
  }
  
  
  
  
   /**
   * @param $recordCount. Determines how many records will be generated
   * @return array;
   */
  protected function generateCouponData(int $recordCount) : array {
    $array = [];
    $prefixes = ['', 'www.', 'http://'];
    $bodies = ['google.com', 'yahoo.com', 'telegraph.co.uk', 'cnn.com'];
    
    // create an array entry
    for ($i = 0; $i < $recordCount; $i++) {
      
      // give $page 5 random alpha characters
      $page = '';
      for ($j = 0; $j < 5; $j++) {
        $page .= chr(mt_rand(97, 122));
      }
      
      // choose a prefix and body from the list
      $prefix = $prefixes[mt_rand(0, 2)];
      $body = $bodies[mt_rand(0, 3)];
      
      
      $array[] = [
        'isSiteWide' => mt_rand(0, 1),
        'targetUrl' => $prefix . $body .'/'. $page,
        'displayThreshold' => mt_rand(3, 20),
        'offerCutoff' => mt_rand(1, 7),
      ];
    }
    
    return $array;
  }
  
  
  
  
  /** Seeds the database
   *
   * Each loop stitches another value to an insert query (following the values keyword)
   */
// setup the query string to concat add
  protected function buildInsertQuery(array $dataList) : string {
    $values = '';
    
    for ($i = 0; $i < sizeof($dataList); $i++) {
      // setup the final lined modifier
      $endingMark = ',';
      if ($i === (sizeof($dataList) - 1)) {
        $endingMark = ';';
      }
      
      if ($i === 0) {
        var_export('i is 0', true);
      }
      
      
      // interpolate properties into the string
      $values = $values . " ('{$dataList[$i]['isSiteWide']}', '{$dataList[$i]['targetUrl']}', '{$dataList[$i]['displayThreshold']}', '{$dataList[$i]['offerCutoff']}'){$endingMark}";
    
    }
    
    return $values;
  }
  
  
  public function runInsertQuery (string $valuesConcattedString) {
    global $dbConnection;

//  $resultOfQuery = $dbConnection->query("insert into delayedCoupons_coupons values {$valuesConcattedString};");
    $resultOfQuery = ("insert into delayedCoupons_coupons values {$valuesConcattedString};");
    
    echo '====================================================';
    echo var_export($resultOfQuery, true);
    echo'                   ==========                 ';
    
  }
  
  
  
  /** Close connection
   */
  public function closeConnection() {
    $this->dbConnection->close();
  }
  
  
  
}
















