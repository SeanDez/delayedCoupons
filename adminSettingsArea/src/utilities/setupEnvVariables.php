<?php
namespace admin;

use Dotenv\Dotenv;

require_once (PLUGIN_FOLDER_PATH . '/vendor/autoload.php');



trait setupEnvVariables {
  protected $environment;
  
  /** Tells the instance how to behave, depending on environment
   *
   * @param string $environment
   */
  
  public function __construct($environment = 'production') {
    // setup env variables
    $this->setupEnvVariables();
    
    // setup environment
    $this->setEnvironment($environment);
  }
  
  
  /**
   * Takes a string and sets the appropriate environment
   * Protected: used only by constructor
   * @param string $environment (production | testing)
   */
  protected function setEnvironment($environment) : void {
  
    // preferentially set $environment to NODE_ENV
    // if not defined then set it to the argument. Default === production
    if (getenv('NODE_ENV')) {
      $this->environment = getenv('NODE_ENV');
    } else {
      $this->environment = $environment;
    }
  }
  
  /** loads Env variables
   * always loads the dev environment as it
   * is used to control debug / test activity
   */
  public function setupEnvVariables() : void {
    \Dotenv\Dotenv
      ::create(PLUGIN_FOLDER_PATH)
      ->load();
  }
  
}