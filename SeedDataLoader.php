<?php

require_once ('vendor/autoload.php');

// Env variables
use \Dotenv\Dotenv;


class SeedDataLoader {
  public $dbConnection;
  
  
  public function __construct() {
    Dotenv::create(__DIR__)->load();
    
  }
  
  
  /** Connect to database
   * Print to page if there's a connection error
   */
  public function connectToDbReportAnyError() {
    $userName = getenv('SQL_USER');
    $password = getenv('SQL_PW');
    $dsn = getenv('SQL_DSN');
    $options  = [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];
    
    try {
      $this->dbConnection = new PDO($dsn, $userName, $password, $options);
      return $this->dbConnection;
    }
    catch (PDOException $error) {
      echo 'Connection error: ' . $error->getMessage();
      die;
    }
  }
  
  /** Create dummy URLS
   */
  protected function createDummyUrl() : string {
    $prefixes = ['', 'www.', 'http://'];
    $bodies = ['google.com', 'yahoo.com', 'telegraph.co.uk', 'cnn.com'];
  
    // give $page 5 random alpha characters
    $page = '';
    for ($j = 0; $j < 5; $j++) {
      $page .= chr(mt_rand(97, 122));
    }

    // choose a prefix and body from the list
    $prefix = $prefixes[mt_rand(0, 2)];
    $body = $bodies[mt_rand(0, 3)];
    
    return $prefix . $body .'/'. $page;
  }
  
  
   /**
   * @param $recordCount. Determines how many records will be generated
   * @return array;
   */
  public function generateCouponArray(int $recordCount) : array {
    // options
    $tTexts = ['title', 'title2', 'title3'];
    $dTexts = ['desc1', 'desc2', 'desc3'];
    $tColors = ['blue', 'green', 'purple'];
    $bColors = ['red', 'orange', 'yellow'];
    
    
    $couponDataArray = [];
    for ($i = 0; $i < $recordCount; $i++) {
      $couponDataArray[] = [
        "totalHits" => mt_rand(0, 100),
        "titleText" => $tTexts[mt_rand(0, count($tTexts) - 1)],
        "descriptionText" => $dTexts[mt_rand(0, 2)],
        "titleTextColor" => $tColors[mt_rand(0, count($tColors) - 1)],
        "titleBackgroundColor" => $bColors[mt_rand(0, count($bColors) - 1)],
        "descriptionTextColor" => $tColors[mt_rand(0, count($tColors) - 1)],
        "descriptionBackgroundColor" => $bColors[mt_rand(0, count($bColors) - 1)]
      ];
    }
    
    return $couponDataArray;
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
    var_dump($values, '==== vd');
    return $values;
  }
  
  
  protected function runInsertQuery (string $valuesConcattedString) {
    
    $resultOfQuery = $this->dbConnection->query("insert into wp_delayedCoupons_coupons values {$valuesConcattedString};");
    
    return $resultOfQuery;
  }
  
  
  /** Close connection
   */
  protected function closeConnection() {
    $this->dbConnection->close();
  }
  
  
  
  /** Public Methods
   */
  
  public function addCouponDataAndClose(int $recordCount) {
    $recordArray = $this->generateCouponData($recordCount);
    
    $concattedString = $this->buildInsertQuery($recordArray);
    echo '====================================================';
    echo var_dump($concattedString);
    echo'     =====$concattedString=====     ';
    
    
    $queryResult = $this->runInsertQuery($concattedString);
    echo '====================================================';
    echo var_dump($queryResult);
    echo'     =====$queryResult=====     ';
    
    
  }
  
}


$seedDataLoader = new SeedDataLoader();
//$seedDataLoader->addCouponDataAndClose(2);

try {
  $seedDataLoader->connectToDbReportAnyError();
  if ($seedDataLoader->dbConnection) {
    echo '===========Connected to db============';
  }
  else {
    echo 'COULD NOT CONNECT';
  }
}
catch (PDOException $error) {
  echo $error->getMessage();
}


/** THE SCRIPT
 * generates records and inserts them
 */

try {
  $seedDataLoader->dbConnection->beginTransaction();
  $sqlStatement = $seedDataLoader->dbConnection
    ->prepare('insert into `wp_delayedCoupons_coupons`(`totalHits`, `titleText`, `descriptionText`, `titleTextColor`, `titleBackgroundColor`, `descriptionTextColor`, `descriptionBackgroundColor`) values (?, ?, ?, ?, ?, ?, ?)');
  
  // generate data array. bind it's values in a loop
  $data2dArray = $seedDataLoader->generateCouponArray(5);
  echo '====================================================';
  echo var_dump($data2dArray);
  echo'     =====$data2dArray=====     ';
  
  
  foreach ($data2dArray as $array1d) {
    $sqlStatement
      ->execute([
        $array1d['totalHits'],
        $array1d['titleText'],
        $array1d['descriptionText'],
        $array1d['titleTextColor'],
        $array1d['titleBackgroundColor'],
        $array1d['descriptionTextColor'],
        $array1d['descriptionBackgroundColor']
      ]);
  }
  
  $seedDataLoader->dbConnection->commit();
}
catch (Exception $error) {
  throw $error;
}

// if target, select parent method. Give records
if ($_GET['target'] === 'coupons') {
  $seedDataLoader->addCouponDataAndClose($_GET['count']);
}






