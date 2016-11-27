/**
 * Created by Administrator on 2016-11-26.
 */
$(document).ready(function(){
    $.L("canvas",{
        t_normal0:"img/t_normal.png",
        b_normal0:"img/b_normal.png",
        t_normal1:"img/t_up_nodata2.png",
        b_normal1:"img/b_up_nodata2.png",
        t_shutdown:"img/t_shutdown.png",
        b_shutdown:"img/b_shutdown.png",
        t_up_nodata:"img/t_up_nodata3.png",
        b_up_nodata:"img/b_up_nodata3.png"
    },function(img){
        var images=$("canvas").eth_switch({defaultScale:0.5,autoUpdata:false});
        var oldData=null;
        $.get("json/data.json",function(data){
            images.start(data,img);
            images.init();
            setInterval(function(){
                $.get("json/data.json",function(data){
                    images.refreshData(data);
                });
            },5000)
        },"json")
    });
});