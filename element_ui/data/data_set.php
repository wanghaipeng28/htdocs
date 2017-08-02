<?php
    header('Content-Type:application/json');
    $r_data = $_REQUEST['data'];
    $data = json_decode($r_data,true);
    $db = file_get_contents('data.json');
    $db = json_decode($db,true);
    if($data['id']){
        for($i=0;$i<count($db);$i++){
            if($db[$i]['id'] == $data['id']){
                $db[$i] = $data;
            }
        }
    }else{
        $len = count($db);
        $data['id'] = $len;
        $db[] = $data;
    }
    $db = json_encode($db);
    file_put_contents('data.json',$db);
    //var_dump($data['id']);
    echo $db;
?>