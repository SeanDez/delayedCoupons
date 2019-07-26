<?php

require_once ('vendor/autoload.php');

// Env variables
use \Dotenv\Dotenv;


class SeedDataLoader {
  public $pdo;
  
  
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
    
    if (isset($this->pdo) === false) {
      try {
        $this->pdo = new PDO($dsn, $userName, $password, $options);
        return $this->pdo;
      }
      catch (PDOException $error) {
        echo 'Connection error: ' . $error->getMessage();
        die;
      }
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
  
  
  /** Generates array of records ready to be fed to a PDO statement inside execute
   *
   * @param $recordCount. controls how many records are made
   *
   * @param $idOffset. set this to the lowest value id in the coupons table to match creation of foreign keys to that table
   *
   * @return array of records
   */
  protected function generateTargetRecords(int $recordCount, int $idOffset) : array {
    $records = [];
    for ($i = 0; $i < $recordCount; $i++) {
      $records[] = [
        'isSitewide' => false,
        'targetUrl' => $this->createDummyUrl(),
        'displayThreshold' => mt_rand(3, 10),
        'offerCutoff' => mt_rand(1, 7),
        'fk_coupons_targets' => $idOffset + $i
      ];
    }
    
    return $records;
  }
  
  protected function executePdoStatement(PDOStatement $statement, array $records) : void {
    foreach ($records as $record) {
      $statement->execute([
        $record['isSitewide'],
        $record['targetUrl'],
        $record['displayThreshold'],
        $record['offerCutoff'],
        $record['fk_coupons_targets']
      ]);
    }
  }
  
  
  /** Public Methods
   */
  
  public function addCouponDataAndClose(int $recordCount) {
    $recordArray = $this->generateCouponData($recordCount);
    
    $concattedString = $this->buildInsertQuery($recordArray);
    
    $queryResult = $this->runInsertQuery($concattedString);
  }
  
  public function addTargetRecordsAndClose(int $recordCount, int $idOffset) {
    
    try {
      // start an instance. Begin the transaction
      $this->connectToDbReportAnyError();
      $this->pdo->beginTransaction();
  
      // prepare the statement / define the query
      $pdoStatement = $this->pdo->prepare('insert into wp_delayedCoupons_targets (`isSitewide`, `targetUrl`, `displayThreshold`, `offerCutoff`, `fk_coupons_targets`) values (?, ?, ?, ?, ?)');
  
      // prepare values data for the statement
      $targetRecordValues = $this->generateTargetRecords(5, $idOffset);
  
      // execute statement and commit
      $this->executePdoStatement($pdoStatement, $targetRecordValues);
      $this->pdo->commit();
  
      // set connection object to null, closing the transaction
      $this->pdo = null; // can also use ->close() on pdo;
    }
    
    catch (Exception $error) {
      echo $error->getMessage();
    }
  }
  
}


$cliArgs = getopt(null, ['type:', 'count:', 'id-offset:']);
if ($cliArgs) {
  // convert strings to ints and shorten variable names
  if ($cliArgs['count']) {
    $count = intval($cliArgs['count']);
  }
  
  if ($cliArgs['id-offset']) {
    $idOffset = intVal($cliArgs['id-offset']);
  }

  // create object, select the right parent method and run it with cli arguments
  $seedDataLoader = new SeedDataLoader();
  
  if ($cliArgs['type'] === 'targets') {
    $seedDataLoader->addTargetRecordsAndClose($count, $idOffset);
  }
  
}
else {
  echo '=======no parameters passed======';
}



















//$seedDataLoader = new SeedDataLoader();
////$seedDataLoader->addCouponDataAndClose(2);
//
//try {
//  $seedDataLoader->connectToDbReportAnyError();
//  if ($seedDataLoader->pdo) {
//    echo '===========Connected to db============';
//  }
//  else {
//    echo 'COULD NOT CONNECT';
//  }
//}
//catch (PDOException $error) {
//  echo $error->getMessage();
//}
//
//
///** THE SCRIPT
// * generates records and inserts them
// */
//
//try {
//  $seedDataLoader->pdo->beginTransaction();
//  $sqlStatement = $seedDataLoader->pdo
//    ->prepare('insert into `wp_delayedCoupons_coupons`(`totalHits`, `titleText`, `descriptionText`, `titleTextColor`, `titleBackgroundColor`, `descriptionTextColor`, `descriptionBackgroundColor`) values (?, ?, ?, ?, ?, ?, ?)');
//
//  // generate data array. bind it's values in a loop
//  $data2dArray = $seedDataLoader->generateCouponArray(5);
//
//
//  foreach ($data2dArray as $array1d) {
//    $sqlStatement
//      ->execute([
//        $array1d['totalHits'],
//        $array1d['titleText'],
//        $array1d['descriptionText'],
//        $array1d['titleTextColor'],
//        $array1d['titleBackgroundColor'],
//        $array1d['descriptionTextColor'],
//        $array1d['descriptionBackgroundColor']
//      ]);
//  }
//
//  $seedDataLoader->pdo->commit();
//}
//catch (Exception $error) {
//  throw $error;
//}
//
//// if target, select parent method. Give records
//if ($_GET['target'] === 'coupons') {
//  $seedDataLoader->addCouponDataAndClose($_GET['count']);
//}






