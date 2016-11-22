/**
 * Created by nantian on 2016/11/21.
 */
(function(){
    try{
        var $=jQuery;
    }catch (err){
        throw new Error("依赖的jQuery函数不存在！");
    }
    var dataObj={};
    function drawTable(data,colHead){//依次传入需要渲染的数据和表头对象
        var thead=$("<thead></thead>");
        var hTr=$("<tr></tr>");
        var tbody=$('<tbody></tbody>');
        if(data[0].groupName==""){
            $.each(data[0],function(i,v){
                if(i!=="groupName"){
                    var th=$('<th>'+colHead[i]+'</th>');
                    hTr.append(th);
                }
            });
            $.each(data,function(i,v){
                var bTr=drawTableList(false,v,"list");
                tbody.append(bTr);
            });
        }else{
            $.each(data[0],function(i,v){
                if(i!=="level"&&i!=="data"){
                    var th=$('<th>'+colHead[i]+'</th>');
                    hTr.append(th);
                }
            });
            $.each(data,function(i,v){
                var bTr=drawTableGroup(v.level,"d"+v.level+i,v);
                tbody.append(bTr);
                dataObj["d"+v.level+i]= v.data;
            });
        }
        $(this).append(tbody);
        thead.append(hTr).appendTo(this);
        $(this).on("click","tr[data-tar]",function(){
            $(this).find(".list_group_name")
                .toggleClass("showChild");
            var tar=$(this).attr("data-tar");
            var thisTr=this;
            if($(this).find(".showChild").length>0){
                $.each(dataObj[tar],function(i,v){
                    var bTr=drawTableGroup(v.level,tar+i,v);
                    dataObj[tar+i]= v.data;
                    $(thisTr).after(bTr[0]);
                });
            }else{
                $(thisTr).siblings("tr[data-tar^="+tar+"]").remove();
            }
        });
    }
    function drawTableGroup(l,i,data){
        if(data.groupName){
            var bTr=$('<tr class="group_header" data-tar="'+i+'"></tr>');
            $.each(data,function(item,val){
                if(item!=="level"&&item!=="data"){
                    if(item=="groupName"){
                        var td=$('<td class="list_group_name space'+l+'">'+val+'</td>');
                    }else{
                        var td=$('<td>'+val+'</td>');
                    }
                    bTr.append(td);
                }
            });
        }else{
            var bTr=drawTableList(true,data,i)
        }
        return bTr;
    }
    function drawTableList(isGroup,data,i){
        var bTr=$('<tr data-tar="'+i+'"></tr>');
        $.each(data,function(item,val){
            if(isGroup){
                var td=$("<td>"+val+"</td>");
            }else{
                if(item!=="groupName"){
                    var td=$("<td>"+val+"</td>");
                }
            }
            bTr.append(td);
        });
        return bTr
    }
    $.fn.drawTable=drawTable;
})()
var jsonData1=[
    {
        "groupName":"黑山扈",
        "area":"",
        "regional":"",
        "functionA":"",
        "deviceName":"",
        "manageIp":"",
        "interfaceTotal":10,
        "usedInterface":7,
        "level":1,
        "data":[
            {
                "groupName":"A1",
                "area":"",
                "regional":"",
                "functionA":"",
                "deviceName":"",
                "manageIp":"",
                "interfaceTotal":10,
                "usedInterface":7,
                "level":2,
                "data":[
                    {
                        "groupName":"",
                        "area":"黑山扈",
                        "regional":"A1",
                        "functionA":"b1",
                        "deviceName":"交换机1",
                        "manageIp":"192.168.1.1",
                        "interfaceTotal":5,
                        "usedInterface":3
                    },
                    {
                        "groupName":"",
                        "area":"黑山扈",
                        "regional":"A1",
                        "functionA":"b2",
                        "deviceName":"交换机2",
                        "manageIp":"192.168.1.2",
                        "interfaceTotal":5,
                        "usedInterface":4
                    }
                ]
            }
        ]
    },
    {
        "groupName":"西单",
        "area":"",
        "regional":"",
        "functionA":"",
        "deviceName":"",
        "manageIp":"",
        "interfaceTotal":20,
        "usedInterface":9,
        "level":1,
        "data":[
            {
                "groupName":"A2",
                "area":"",
                "regional":"",
                "functionA":"",
                "deviceName":"",
                "manageIp":"",
                "interfaceTotal":20,
                "usedInterface":9,
                "level":2,
                "data":[
                    {
                        "groupName":"",
                        "area":"西单",
                        "regional":"A2",
                        "functionA":"b1",
                        "deviceName":"交换机3",
                        "manageIp":"192.168.1.3",
                        "interfaceTotal":13,
                        "usedInterface":5
                    },
                    {
                        "groupName":"",
                        "area":"西单",
                        "regional":"A2",
                        "functionA":"b2",
                        "deviceName":"交换机4",
                        "manageIp":"192.168.1.4",
                        "interfaceTotal":7,
                        "usedInterface":4
                    }
                ]
            }
        ]
    }
];
var jsonData2=[
    {
        "groupName":"",
        "area":"黑山扈",
        "regional":"A1",
        "functionA":"b1",
        "deviceName":"交换机1",
        "manageIp":"192.168.1.1",
        "interfaceTotal":5,
        "usedInterface":3
    },
    {
        "groupName":"",
        "area":"黑山扈",
        "regional":"A1",
        "functionA":"b2",
        "deviceName":"交换机2",
        "manageIp":"192.168.1.2",
        "interfaceTotal":5,
        "usedInterface":4
    },
    {
        "groupName":"",
        "area":"西单",
        "regional":"A1",
        "functionA":"b1",
        "deviceName":"交换机3",
        "manageIp":"192.168.1.3",
        "interfaceTotal":5,
        "usedInterface":3
    },
    {
        "groupName":"",
        "area":"西单",
        "regional":"A1",
        "functionA":"b2",
        "deviceName":"交换机3",
        "manageIp":"192.168.1.3",
        "interfaceTotal":5,
        "usedInterface":4
    }
];
var col={
    "groupName":"分组",
    "area":"地域",
    "regional":"区域",
    "functionA":"功能区",
    "deviceName":"设备名",
    "manageIp":"管理IP",
    "interfaceTotal":"接口总数",
    "usedInterface":"已用接口总数"
}
$(document).ready(function(){
    //调用渲染函数
    $("#list_table").drawTable(jsonData1,col);
});