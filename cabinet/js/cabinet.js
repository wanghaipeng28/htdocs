/**
 * Created by Administrator on 2016-11-26.
 */
(function(){
    try{
        var $=jQuery;
    }catch (err){
        throw new Error("依赖的jQuery函数不存在！");
    }
    function engineRoom(option){//参数待定
        !option&&(option={});
        !option.defaultScale&&(option.defaultScale=0.2);
        !option.maxScale&&(option.maxScale=1.3);
        !option.minScale&&(option.minScale=0.15);
        var c=this[0];
        var ctx=c.getContext("2d");
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
            ctx.lineWidth=1;
            ctx.strokeStyle="#000";//绘制颜色
            ctx.strokeRect(this.x,this.y,this.width , this.height);
            ctx.strokeStyle="#000";//绘制颜色
            ctx.strokeRect(this.x+10*this.s,this.y+10*this.s , this.width-20*this.s,this.height-20*this.s);
            ctx.strokeStyle ='#444';//线条颜色
            ctx.lineWidth = 2;//设置线宽
            ctx.beginPath();
            ctx.moveTo(this.x+10*this.s , this.y+10*this.s);
            ctx.lineTo(this.x+this.width-10*this.s , this.y+this.height-10*this.s);
            ctx.moveTo(this.x+10*this.s , this.y+this.height-10*this.s);
            ctx.lineTo(this.x+this.width-10*this.s , this.y+10*this.s);
            ctx.closePath();//可以把这句注释掉再运行比较下不同
            ctx.stroke();
            ctx.fillStyle="#f00";
            ctx.font=(this.s*80+'px helvetica');
            var w=ctx.measureText(this.name).width;
            ctx.fillText(this.name,(this.width-w)/2+this.x,this.height+this.y+65*this.s);
        }
        //创建机房类
        function Room(name,x,y,width,height){
            this.x=x;this.y=y;this.name=name;
            Img.call(this);
            this.width=width*this.s;this.height=height*this.s;
        }
        //继承图形父类
        Object.setPrototypeOf(Room.prototype,Img.prototype);
        //机房的绘制函数
        Room.prototype.draw=function(){
            ctx.fillStyle="#C5C6CA";
            ctx.fillRect(this.x,this.y,this.width,this.height);
            ctx.strokeStyle="#676A73"
            ctx.lineWidth=20*this.s;
            ctx.strokeRect(this.x,this.y,this.width,this.height);
            ctx.fillStyle="#333";
            ctx.font=(this.s*22+'px helvetica');
            var w=ctx.measureText(this.name).width;
            ctx.fillText(this.name,this.x,this.y-19*this.s);
        }
        var images={
            img:{},
            scale:option.defaultScale,
            timer:null,//用于保存定时器
            init:function(){
                var self=this;
                c.onmousedown=function(e){
                    if(e.buttons==1){
                        var bX=e.offsetX,bY=e.offsetY;
                        c.onmousemove=function(e){
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
                    c.onmousemove=null;
                }
                var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel";
                c.addEventListener(mousewheelevt, function(e){
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
                }, false)
                this.draw();
            },
            start:function(data){//注意渲染顺序
                var index={}
                for(var i=65;i<91;i++){
                    index[String.fromCharCode(i)]=i-64;
                }
                //index={A: 1, B: 2, C: 3, D: 4, E: 5.....}
                var maxCol= 0,maxRol=0;
                $.each(data.cabinet,function(i,v){
                    var cRArr=/^([A-Z])([0-9]+)/.exec(v.name);
                    index[cRArr[1]]-0>maxRol&&(maxRol=index[cRArr[1]]-0);
                    cRArr[2]-0>maxCol&&(maxCol=cRArr[2]-0);
                });

                return this;
            },
            addCabinet:function(id,name,x,y,width,height){//后进入数组的元素先渲染
                this.img[id]=new Cabinet(name,x,y,width,height);
                return this;
            },
            addRoom:function(id,name,x,y,width,height){
                this.img[id]=new Room(name,x,y,width,height);
                return this;
            },
            draw:function(){
                $.each(this.img,function(i,v){
                    v.draw();
                });
            },
            //定义清除画布函数
            clear:function(){
                ctx.clearRect(0,0, c.width, c.height);
            }
        }
        return images;
    }
    $.fn.engineRoom=engineRoom;
    engineRoom=null;//释放内存
})()