/**
 * Created by nantian on 2017/4/21.
 */
$(document).ready(function(){
    $("div.whp").dropzone({
        url:"data/updata.php",
        paramName:"excel",
        acceptedFiles:".xlsx",
        addRemoveLinks:true,
        init:function(){
            this.on("dragenter", function(){
                $("#discover").addClass("active");
                console.log(1);
            });
            this.on("success", function(f){
                $("#discover").removeClass("active");
                if(f.status == "success"){
                    var p = '<p><b>'+ f.name+'</b><span>'+ f.size+'B</span><a href="#">删除</a></p>';
                    $("#fu_jian").append(p);
                }
            });
        }
    });
    $("#fu_jian").on("click","a[href]",function(e){
        e = e || event;
        e.preventDefault();
        $(this).parents("p").remove();
    });
    $("#add_fu_jian").click(function(){
        $("div.whp").trigger("click")
    });
});