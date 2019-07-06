<?php

/**
 * Class AjaxResponder
 * Used to respond to post requests
 * During testing its instance will return instead
 */

class AjaxResponder {
  
  protected $environment;
  
  /**
   * AjaxResponder constructor.
   *
   * Tells the instance how to behave, depending on environment
   *
   * @param string $environment
   */
  
  public function __construct($environment = 'production') {
    $this->setEnvironment($environment);
  }
  
  
  /**
   * Takes a string and sets the appropriate environment
   *
   * @param string $environment (production | testing)
   */
  public function setEnvironment($environment) {
    $this->environment = $environment;
  }
  
  
  /**
   * Responds in production. Returns in testing
   * @param mixed $responseData
   * @return mixed
   */
  public function res($responseData) {
    if ($this->environment === 'production') {
      wp_send_json($responseData);
    } else {
      return json_encode($responseData);
    }
  }
}

