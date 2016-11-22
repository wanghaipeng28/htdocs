/**
 * Created by Administrator on 2016-11-22.
 */
(function(){
    try{
        var $=jQuery;
    }catch (err){
        throw new Error("依赖的jQuery函数不存在！");
    }
    var aD=[];
    function statistics(data,arr){
        if(arr.length){
            a(data,arr);
        }else{
            return data;
        }
    }
    function a(d,arr){
        $.each(d,function(i,v){

            //$.each(val,function(item,val){
            //
            //});
        });
    }
    $.statistics=statistics;
})()
