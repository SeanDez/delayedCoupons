<?php
namespace admin;

use Dotenv\Dotenv;

require_once ('/var/www/html/wptest2/wp-content/plugins/delayedCoupons' . '/vendor/autoload.php');



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
  
  
  /** Sets the environment if given explicitly. Otherwise depends on NODE_ENV.
   *
   * If NODE_ENV also not defined, assumes production
   *
   * Protected: used only by constructor
   *
   * @param string $environment (production | development)
   */
  protected function setEnvironment($environment = null) : void {
    if ($environment) {
      $this->environment = $environment;
    } else if (getenv('NODE_ENV')) {
      $this->environment = getenv('NODE_ENV');
    } else {
      $this->environment = 'production';
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