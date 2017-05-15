<?php
return array (
  'basePath' => 'C:\\xampp\\htdocs\\bugfree3.0.1\\protected\\config\\..',
  'name' => 'BugFree 3.0.1',
  'preload' => 
  array (
    0 => 'log',
  ),
  'language' => 'zh_cn',
  'theme' => 'classic',
  'defaultController' => 'site',
  'timeZone' => 'Asia/Shanghai',
  'import' => 
  array (
    0 => 'application.models.*',
    1 => 'application.components.*',
    2 => 'application.service.*',
  ),
  'modules' => 
  array (
    'gii' => 
    array (
      'class' => 'system.gii.GiiModule',
      'password' => '123456',
      'ipFilters' => 
      array (
        0 => '127.0.0.1',
        1 => '::1',
      ),
    ),
  ),
  'components' => 
  array (
    'user' => 
    array (
      'allowAutoLogin' => true,
    ),
    'request' => 
    array (
      'enableCookieValidation' => true,
    ),
    'cache' => 
    array (
      'class' => 'CDbCache',
      'connectionID' => 'db',
    ),
    'urlManager' => 
    array (
      'urlFormat' => 'path',
      'showScriptName' => false,
      'rules' => 
      array (
        '<type:\\w+>/<id:\\d+>/<action:\\w+>' => 'info/edit',
        '<type:\\w+>/list/<product_id:\\d+>' => 'info/index',
        '<type:\\w+>/<id:\\d+>' => 'info/edit',
        '<controller:\\w+>/view/<id:\\d+>' => '<controller>/view',
        '<controller:\\w+>/<id:\\d+>' => '<controller>/view',
        '<controller:\\w+>/<action:\\w+>/<id:\\d+>' => '<controller>/<action>',
        '<controller:\\w+>/<action:\\w+>' => '<controller>/<action>',
      ),
    ),
    'db' => 
    array (
      'pdoClass' => 'NestedPDO',
      'connectionString' => 'mysql:host=localhost;dbname=bugfree;port=3306',
      'emulatePrepare' => true,
      'username' => 'root',
      'password' => '',
      'charset' => 'utf8',
      'tablePrefix' => 'bf_',
    ),
    'errorHandler' => 
    array (
      'errorAction' => 'site/error',
    ),
    'log' => 
    array (
      'class' => 'CLogRouter',
      'routes' => 
      array (
        0 => 
        array (
          'class' => 'CFileLogRoute',
          'levels' => 'info, error, warning',
          'categories' => 'bugfree.*',
        ),
      ),
    ),
  ),
  'params' => 
  array (
    'uploadPath' => '../BugFile',
    'picPreviewApp' => 'http://::1/BugFile',
    'allUserGroupId' => 1,
    'ldap' => 
    array (
      'host' => '',
      'port' => '',
      'base' => '',
      'user' => '',
      'pass' => '',
    ),
    'mail' => 
    array (
      'on' => '1',
      'from_address' => 'bugfree-noreply@test.com',
      'from_name' => 'BugFree',
      'send_method' => 'SMTP',
      'send_params' => 
      array (
        'host' => '',
        'smtp_auth' => false,
        'username' => '',
        'password' => '',
      ),
    ),
  ),
)
?>