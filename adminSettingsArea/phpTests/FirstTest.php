<?php



class First {
  
  /** returns sum
   * A simple method to use for basic PhpUnit testing
   */
  public function add ($a, $b) : int {
    $sum = $a + $b;
    return $sum;
  }
  
  public function dummyRes($data) {
    return wp_send_json($data);
  }
}


use \PHPUnit\Framework\TestCase;

class FirstTest extends TestCase {
  
  public function testAdd() {
    $first = new First();
    $result = $first->add(2, 5);
    
    $this->assertEquals(7, $result);
  }
  
  public function testDummyRes() {
    $first = new First();
    $result = $first->dummyRes(4);

    echo '====================================================';
    var_dump($result);
    echo '====================================================';
    print_r('=====$result=====');
    echo '====================================================';
    
    
    $this->assertEquals(4, json_decode($result));
    
  }
}