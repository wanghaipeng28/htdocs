<?php
    header('Content-Type:application/json');
    $draw = $_REQUEST['draw'];
    $draw = intval($draw);
    $data = [
        [
            'Name'=>'Tiger Nixon',
            'Position'=>'System Architect',
            'city'=>'Edinburgh',
            'id'=>'5421',
            'date'=>'2011年0425',
            'salary'=>'$320'
        ],
        [
            'Name'=>'Tiger Nixon',
            'Position'=>'System Architect',
            'city'=>'Edinburgh',
            'id'=>'5421',
            'date'=>'2011年0425',
            'salary'=>'$320'
        ],
        [
            'Name'=>'Tiger Nixon',
            'Position'=>'System Architect',
            'city'=>'Edinburgh',
            'id'=>'5421',
            'date'=>'2011年0425',
            'salary'=>'$320'
        ],
        [
            'Name'=>'Tiger Nixon',
            'Position'=>'System Architect',
            'city'=>'Edinburgh',
            'id'=>'5421',
            'date'=>'2011年0425',
            'salary'=>'$320'
        ],
        [
            'Name'=>'Tiger Nixon',
            'Position'=>'System Architect',
            'city'=>'Edinburgh',
            'id'=>'5421',
            'date'=>'2011年0425',
            'salary'=>'$320'
        ]
    ];
    $output = [
        'draw'=>$draw,
        'recordsTotal'=>60,
        'recordsFiltered'=>60,
        'data'=>$data
    ];
    echo json_encode($output);
?>