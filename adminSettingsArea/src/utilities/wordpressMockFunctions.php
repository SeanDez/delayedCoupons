<?php

function wp_send_json($data) {
  $encodedData = json_encode($data);
  return $encodedData;
}

function wp_get_referrer() : string {
  return 'http://subdomain.maindomain.com/?query1=value1&query2=value2';
}





/** This class makes instances for $wpdb responses
 * Needed because $wpdb->get_results() returns an array of objects by default, not associative arrays
 * @param $key, string
 * @param $value, string
 */
class DummyObject {
  
  public function __construct($kVPairs) {
    $this->createProperties($kVPairs);
  }
  
  public function createProperties(array $AssocArray) {
    foreach ($AssocArray as $key => $value) {
      $this->{$key} = $value;
    }
  }
}


class WPDB {
  
  public $prefix = 'dummy_';
  
  public function get_results() {
    return [
      new DummyObject(['k1' => 'v1']),
      new DummyObject(['k2'=> 'v2']),
      new DummyObject(['k3' => 'v3'])
    ];
  }
}

////// global scoped $wpdb //////
$wpdb = new WPDB();




////// mocks just to avoid errors //////
function add_action() {};
function add_filter() {};