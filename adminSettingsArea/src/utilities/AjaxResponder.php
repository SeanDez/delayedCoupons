<?php
namespace admin\utilities;

require_once (PLUGIN_FOLDER_PATH . '/vendor/autoload.php');
require_once (PLUGIN_FOLDER_PATH . '/adminSettingsArea/src/utilities/setupEnvVariables.php');

use admin\setupEnvVariables;


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
  
    
  /**
   * Responds in production. Returns in testing.
   * @param mixed $responseData
   * @return mixed
   */
  public function res($responseData) {
    if ($this->environment === 'production') {
      wp_send_json($responseData);
    } else if ($this->environment === 'development') {
      return json_encode($responseData);
    } else {
      throw new Error('AjaxResponder environment misconfigured');
    }
  }
}

