<?php
    $homepage = file_get_contents('data.json');
    $ids = $_REQUEST['ids'];
    $ids = json_decode($ids);
    $db = file_get_contents('data.json');
    $db = json_decode($db,true);
    $result = [];
    for($i=0; $i < count($db); $i++){
        if(!in_array($db[$i]['id'],$ids)){
            array_push($result, $db[$i]);
        }
    }
    $result = json_encode($result);
    file_put_contents('data.json',$result);
    echo $result;
?>