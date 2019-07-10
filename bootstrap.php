<?php

////// Project Requires //////
require_once('vendor/autoload.php');


////// Env Variable Setup //////
Dotenv\Dotenv
  ::create(__DIR__)
  ->load();


////// Constants //////
define('PLUGIN_FOLDER_PATH', __DIR__);
define('ADMIN_SETTINGS_PATH', __DIR__ . '/adminSettingsArea');
define('ADMIN_SETTINGS_SRC', ADMIN_SETTINGS_PATH . '/src');
define('ADMIN_SETTINGS_UTILITIES', ADMIN_SETTINGS_SRC . '/utilities');




