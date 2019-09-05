<?php

////// Project Requires //////

require_once(__DIR__ . '/vendor/autoload.php');



////// Env Variable Setup //////
Dotenv\Dotenv
  ::create(__DIR__)
  ->load();



////// Constants //////
define('PLUGIN_FOLDER_PATH', __DIR__);
define('ADMIN_SETTINGS_PATH', PLUGIN_FOLDER_PATH . '/adminSettingsArea');
define('ADMIN_SETTINGS_SRC', ADMIN_SETTINGS_PATH . '/src');
define('ADMIN_SETTINGS_UTILITIES', ADMIN_SETTINGS_SRC . '/utilities');




