/**
 * Created by Administrator on 2016-11-26.
 */
(function(){
    try{
        var $=jQuery;
    }catch (err){
        throw new Error("依赖的jQuery函数不存在！");
    }
    function cabinet_v(option){//参数待定
        !option&&(option={});
        !option.defaultScale&&(option.defaultScale=0.9);
        !option.maxScale&&(option.maxScale=1.5);
        !option.minScale&&(option.minScale=0.2);
        var canvas=this[0];
        var ctx=canvas.getContext("2d");
        //创建图形父类
        function Img(){
            this.s=option.defaultScale;
        }
        //图形缩放函数
        Img.prototype.scale=function(s,origin){
            if(this.s>option.maxScale&&s>1){s=1}
            if(this.s<option.minScale&&s<1){s=1}
            this.x=origin[0]-(origin[0]-this.x)*s;
            this.y=origin[1]-(origin[1]-this.y)*s;
            this.width=this.width*s;
            this.height=this.height*s;
            this.s=this.s*s;
        }
        //图形的移动函数
        Img.prototype.move=function(x,y){
            this.x=x;
            this.y=y;
        }
        //构建机柜类
        function Cabinet(name,x,y,width,height){
            this.x=x;
            this.y=y;
            this.name=name;
            Img.call(this);
            this.width=width*this.s;//机柜的初始宽高
            this.height=height*this.s;
        }
        //继承图形父类
        Object.setPrototypeOf(Cabinet.prototype,Img.prototype);
        //机柜的绘制函数
        Cabinet.prototype.draw=function(){
            ctx.fillStyle="#e5e6eA";
            ctx.fillRect(this.x,this.y,this.width,this.height);
            ctx.strokeStyle="#676A73";
            ctx.lineWidth=14*this.s;
            ctx.strokeRect(this.x,this.y,this.width,this.height);
            ctx.fillStyle="#e4393c";
            ctx.font=(this.s*22+'px helvetica');
            var w=ctx.measureText(this.name).width;
            ctx.fillText(this.name,this.x,this.y-19*this.s);
            ctx.strokeStyle="#666";
            ctx.lineWidth=1;
            ctx.strokeRect(this.x+70*this.s,this.y+60*this.s,this.width-140*this.s,this.height-120*this.s);
            ctx.strokeStyle="#aaa";
            for(var i=0;i<=42;i++){
                ctx.strokeRect(this.x+this.width-70*this.s,this.y+(60+40*i)*this.s,40*this.s,1);
                if(i>0){
                    ctx.fillText(43-i+"",this.x+this.width-55*this.s,this.y+(50+40*i)*this.s);
                }
            }
        }
        //创建机房类
        function Device(name,x,y,width,height){
            this.x=x;this.y=y;this.name=name;
            Img.call(this);
            this.width=width*this.s;this.height=height*this.s;
        }
        //继承图形父类
        Object.setPrototypeOf(Device.prototype,Img.prototype);
        //机房的绘制函数
        Device.prototype.draw=function(){
            ctx.lineWidth=1;
            ctx.strokeStyle="#000";//绘制颜色
            ctx.strokeRect(this.x,this.y,this.width , this.height);
            ctx.lineWidth = 2;
            ctx.strokeStyle="#000080";//绘制颜色
            ctx.fillStyle="#171833";
            ctx.fillRect(this.x+3*this.s,this.y+3*this.s , this.width-6*this.s,this.height-6*this.s);
            ctx.strokeRect(this.x+3*this.s,this.y+3*this.s , this.width-6*this.s,this.height-6*this.s);
            //指示灯
            ctx.fillStyle="#0F0";
            ctx.beginPath();
            ctx.arc(this.x+this.width-70*this.s,this.y+this.height/3,5*this.s,0,Math.PI*2,true);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle="#fff";
            ctx.font=(10*this.s+'px helvetica');
            var w=ctx.measureText(this.name).width;
            ctx.fillText("RUN",this.x+this.width-60*this.s,this.y+this.height/3+4*this.s);
            //设备名称
            ctx.fillStyle="#fff";
            ctx.font=(this.s*30+'px helvetica');
            var w=ctx.measureText(this.name).width;
            ctx.fillText(this.name,this.x+10*this.s,this.y+this.height-5*this.s);
        }
        var images={
            img:{},
            scale:option.defaultScale,
            timer:null,//用于保存定时器
            init:function(){
                var self=this;
                canvas.onmousedown=function(e){
                    if(e.buttons==1){
                        var bX=e.offsetX,bY=e.offsetY;
                        canvas.onmousemove=function(e){
                            self.clear();
                            var mX= e.offsetX-bX,mY= e.offsetY-bY;
                            $.each(self.img,function(i,v){
                                var desX= v.x+mX,desY= v.y+mY;
                                v.move(desX, desY);
                            });
                            self.draw();
                            bX= e.offsetX,bY= e.offsetY;
                        }
                    }
                }
                document.onmouseup=function(){
                    canvas.onmousemove=null;
                }
                var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel";
                canvas.addEventListener(mousewheelevt, function(e){
                    self.clear();
                    if(e.wheelDelta>0){
                        var s=1.05;
                    }else{
                        var s=100/105;
                    }
                    $.each(self.img,function(i,v){
                        v.scale(s,[e.offsetX, e.offsetY]);
                    })
                    self.draw();
                }, false);
                this.draw();
            },
            start:function(data){//注意渲染顺序
                var me=this;
                var unused=48;
                var device=[];
                $.each(data.device,function(i,v){
                    unused-= v.occupy;
                    device.push({
                        "id":"CD"+ v.position_u,
                        "name": v.deviceName,
                        "x":70*option.defaultScale,
                        "y":((43- v.position_u)*40+60-v.occupy*40)*option.defaultScale,
                        "w":460,
                        "h": v.occupy*40
                    })

                });
                this.addCabinet("C",data.name+"(空闲U位:"+unused+")",0,0,600,1800);
                $.each(device,function(i,v){
                    me.addDevice(v.id, v.name, v.x, v.y, v.w, v.h);
                });
                //视图剧中
                var offsetX= (canvas.width-600*option.defaultScale)/2,
                    offsetY= (canvas.height-1800*option.defaultScale)/2;
                var s= canvas.height*0.94/1800/option.defaultScale;
                $.each(this.img,function(i,v){
                    var desX= v.x+offsetX,desY= v.y+offsetY;
                    v.move(desX, desY);
                    v.scale(s,[canvas.width/2,canvas.height/2]);
                });
                return this;
            },
            addCabinet:function(id,name,x,y,width,height){//后进入数组的元素先渲染
                this.img[id]=new Cabinet(name,x,y,width,height);
            },
            addDevice:function(pos,name,x,y,width,height){
                this.img[pos]=new Device(name,x,y,width,height);
            },
            draw:function(){
                $.each(this.img,function(i,v){
                    v.draw();
                });
            },
            //添加画布的双击事件
            addDblclickEvent:function(fun){
                var me=this;
                canvas.addEventListener("dblclick",function(e){
                    var mX=e.offsetX,mY=e.offsetY;
                    var tar=null;
                    $.each(me.img,function(i,v){
                        if(v.constructor===Device){
                            if(mX> v.x&&mX<( v.x+ v.width)&&mY>v.y&&mY<(v.y+ v.height)){
                                tar=v;
                            }
                        }
                    });
                    if(typeof(fun)=="function"){
                        fun(tar);
                    };
                })
                return this;
            },
            //定义清除画布函数
            clear:function(){
                ctx.clearRect(0,0, canvas.width, canvas.height);
            }
        }
        return images;
    }
    $.fn.cabinet_v=cabinet_v;
    cabinet_v=null;//释放内存
})()