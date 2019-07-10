<?php
namespace admin\utilities;

require_once (ADMIN_SETTINGS_UTILITIES . '/setupEnvVariables.php');

use \admin\setupEnvVariables;


/**
 * Used to respond to post requests
 * During testing its main method will return instead
 */
class AjaxResponder {

  // trait that sets environment and loads env variables
  use setupEnvVariables { setupEnvVariables::__construct as __sevConstruct;
  }
  
  /**
   * @param $environment string. If set to null, defaults to production or gets overridden by a NODE_ENV setting
   */
  public function __construct($environment = null) {
      $this->__sevConstruct($environment);
    }
    
}

