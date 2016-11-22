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
    var s=null;
    function drawTable(data,colHead,showCol){//依次传入需要渲染的数据、表头对象和需要显示的列
        s=showCol;
        this.html("");//清空表格
        var thead=$("<thead></thead>");
        var hTr=$("<tr></tr>");
        var tbody=$('<tbody></tbody>');
        //用来判断传入的数据类型
        var proto=Object.prototype.toString.call(data);
        if(proto=="[object Array]"){
            $.each(colHead,function(i,v){
                if(showCol[i]){
                    if(i!=="groupName"){
                        var th=$('<th>'+colHead[i]+'</th>');
                        hTr.append(th);
                    }
                }
            });
            $.each(data,function(i,v){
                var bTr=drawTableList(false,v,"list");
                tbody.append(bTr);
            });
        }else{
            $.each(colHead,function(i,v){
                if(showCol[i]) {
                    var th = $('<th>'+v+'</th>');
                    hTr.append(th);
                }
            });
            $.each(data,function(i,v){
                var bTr=drawTableGroup(v.level,"d"+v.level+i,v);
                tbody.append(bTr);
                dataObj["d"+v.level+i]= v.data;
            });
        }
        thead.append(hTr).appendTo(this);
        this.append(tbody);
        tbody.on("click","tr.group_header",function(){
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
                if(s[item]){
                    if(item!=="level"&&item!=="data"){
                        if(item=="groupName"){
                            var td=$('<td class="list_group_name space'+l+'">'+val+'</td>');
                        }else{
                            var td=$('<td>'+val+'</td>');
                        }
                        bTr.append(td);
                    }
                }
            });
        }else{
            var bTr=drawTableList(true,data,i)
        }
        return bTr;
    }
    function drawTableList(isGroup,data,i){
        var bTr=$('<tr data-tar="'+i+'" data-act="mianban"></tr>');
        $.each(data,function(item,val){
            if(s[item]){
                if(isGroup){
                    var td=$("<td>"+val+"</td>");
                }else{
                    if(item!=="groupName"){
                        var td=$("<td>"+val+"</td>");
                    }
                }
            }
            bTr.append(td);
        });
        return bTr
    }
    $.fn.drawTable=drawTable;
})()