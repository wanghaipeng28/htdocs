<?php
    header('Content-Type:application/json');
    $homepage = file_get_contents('data.json');
    echo $homepage;
?>