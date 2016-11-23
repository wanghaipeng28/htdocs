/**
 * Created by Administrator on 2016-11-22.
 */
(function(){
    try{
        var $=jQuery;
    }catch (err){
        throw new Error("依赖的jQuery函数不存在！");
    }
    var groupData=null;
    function statistics(data,arr){
        if(arr.length){
            return a(data,arr);
        }else{
            return data;
        }
    }
    function a(d,arr){
        var aD={};
        $.each(d,function(i,v){
            groupData=aD;
            $.each(arr,function(iArr,vArr){
                var groupName=v[vArr];
                if(groupData[groupName]){
                    $.each(v,function(item,val){
                        if(typeof(val)=="number"){
                            groupData[groupName][item]+=val;
                        }
                    });
                }else{
                    groupData[groupName]={};
										groupData[groupName].groupName=groupName;
                    $.each(v,function(item,val){
                        if(typeof(val)=="string"){
													groupData[groupName][item]="";
                        }else if(typeof(val)=="number"){
                            if(!groupData[groupName][item]){
                                groupData[groupName][item]=0;
                            }
                            groupData[groupName][item]+=val;
                        }
                    });
                    if(iArr==arr.length-1){
                        groupData[groupName].data=[];
                    }else{
                        groupData[groupName].data={};
                    }
                    groupData[groupName].level=iArr+1;
                }
                groupData=groupData[groupName].data;
            });
            groupData.push(v);
        });
        return aD;
    }
    $.statistics=statistics;
})()
