<?php
	$secret = 'secret';
	$authobj = array(
		'api_key' => 'MjkwYzc3MDI2MjhhNGZkNDg1MjJkODgyYjBmN2MyMTM4M',
		'upn' => 'whp@company.com',
		'timestamp' => time() * 1000,
		'signature_method' => 'HMAC-SHA1',
		'api_version' => '1.0'
	);
	$authobj['signature'] = hash_hmac('sha1', $authobj['api_key'] . $authobj['upn'] . $authobj['timestamp'], $secret);
	$valid_json_auth_object = json_encode($authobj);
	echo 'True';
?>