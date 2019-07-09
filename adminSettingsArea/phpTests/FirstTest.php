<?php

class First {
  
  /** returns sum
   * A simple method to use for basic PhpUnit testing
   */
  public function add ($a, $b) : int {
    $sum = $a + $b;
    return $sum;
  }
}


use \PHPUnit\Framework\TestCase;

class FirstTest extends TestCase {
  
  public function testAdd() {
    $first = new First();
    
    $result = $first->add(2, 5);
   
    var_dump([4, 82, 823, 23]);
    print_r('=====test=====');
    
    
    
    $this->assertEquals(7, $result);
    $this->assertEquals(5, $result);
  }
}