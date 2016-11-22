/**
 * Created by nantian on 2016/10/27.
 */
$(document).ready(function(){
    //异步请求菜单数据
    $.get('/static/AdminLTE/dist/json/getMenu.json',doResponse,"json");
    //处理请求数据函数
    function doResponse(data){
        var $ul=$('<ul class="sidebar-menu"><li class="header">让运维更得心应手</li></ul>');
        $.each(data,function(i,v){
            var $li=$('<li class="treeview"></li>');
            var target=(v.type=="inner")?"_self":"_blank";
            $li.html('<a href="'+ v.url+'" target="'+target+'">'
            +'<i class="'+ v.icon+'"></i>'
            +'<span>'+ v.name+'</span>'
            +'</a>');
            if(v.child.length){
                var $ul2=$('<ul class="treeview-menu"></ul>');
                $.each(v.child,function(i,v){
                    var target=(v.type=="inner")?"_self":"_blank";
                    if(v.child.length){
                        var $li2=$('<li></li>');
                        $li2.html('<a href="#">'
                        + v.name
                        +'<span class="pull-right-container">'
                        +'<i class="fa fa-angle-left pull-right"></i>'
                        +'</span>'
                        +'</a>');
                        var $ul3=$('<ul class="treeview-menu"></ul>')
                        $.each(v.child,function(i,v){
                            var target=(v.type=="inner")?"_self":"_blank";
                            if(v.child.length){
                                var $li3=$('<li>'
                                +'<a href="#">'
                                +'<i class="'+ v.icon+'"></i>'
                                + v.name
                                +'<span class="pull-right-container">'
                                +'<i class="fa fa-angle-left pull-right"></i>'
                                +'</span>'
                                +'</a>'
                                +'</li>');
                                var $ul4=$('<ul class="treeview-menu"></ul>');
                                $.each(v.child,function(i,v){
                                    var target=(v.type=="inner")?"_self":"_blank";
                                    var $li4=$('<li><a href="'+v.url+'" target="'+target+'">'+ v.name+'</a></li>');
                                    $li4.appendTo($ul4);
                                });
                                $ul4.appendTo($li3);
                            }else{
                                var $li3=$('<li>'
                                +'<a href="'+ v.url+'" target="'+target+'">'
                                +'<i class="'+ v.icon+'"></i>'
                                + v.name
                                +'</a>'
                                +'</li>');
                            }
                            $li3.appendTo($ul3);
                        });
                        $ul3.appendTo($li2)
                    }else{
                        var $li2=$('<li><a href="'+ v.url+'" target="'+target+'">'+ v.name+'</a></li>');
                    }
                    $li2.appendTo($ul2);
                });
                $ul2.appendTo($li);
            }
            $li.appendTo($ul);
        });
        $ul.appendTo($("#sidebar-menu"));
        //菜单激活状态保持
        $ul.find("li>a").click(function(){
            //var state=$(this).siblings("ul.treeview-menu").attr("class");
            $(this).parent("li").siblings("li").children("ul").slideUp("normal",function(){
                $(this).parent("li").removeClass("active");
            });
            var s=$(this).siblings().length;
            if(!s){
                $(this).parent("li").addClass("active").siblings("li").removeClass("active");
            }
        });
        var url = window.location;
        $('ul.treeview-menu a').filter(function () {
            return this.href == url || url.href.indexOf(this.href) == 0;
        }).parent("li").addClass('active').parent("ul").addClass('menu-open')
        .parent("li").addClass('active').parent("ul").addClass('menu-open')
        .parent("li").addClass('active').parent("ul").addClass('menu-open')
        .parent("li").addClass('active');
    }
});