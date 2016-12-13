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
        !option.defaultScale&&(option.defaultScale=0.20);
        !option.maxScale&&(option.maxScale=1.3);
        !option.minScale&&(option.minScale=0.15);
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
        function Cabinet(name,x,y,width,height,isExist){
            this.isExist=isExist;
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
            if(this.isExist){
                ctx.lineWidth = 2;
                ctx.strokeStyle="#0f0";//绘制颜色
                ctx.strokeRect(this.x+10*this.s,this.y+10*this.s , this.width-20*this.s,this.height-20*this.s);
                ctx.strokeStyle ='#0f0';//线条颜色
                ctx.beginPath();
                ctx.moveTo(this.x+10*this.s , this.y+10*this.s);
                ctx.lineTo(this.x+this.width-10*this.s , this.y+this.height-10*this.s);
                ctx.moveTo(this.x+10*this.s , this.y+this.height-10*this.s);
                ctx.lineTo(this.x+this.width-10*this.s , this.y+10*this.s);
                ctx.closePath();//可以把这句注释掉再运行比较下不同
                ctx.stroke();
            }
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
            ctx.fillStyle="#e5e6eA";
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
                var index={};
                var img={};
                for(var i=65;i<91;i++){
                    index[String.fromCharCode(i)]=i-64;
                }
                //index={A: 1, B: 2, C: 3, D: 4, E: 5.....}
                var maxCol= 0,maxRol=0;
                $.each(data.cabinet,function(i,v){
                    var cRArr=/^([A-Z])([0-9]+)/.exec(v.name);
                    index[cRArr[1]]-0>maxRol&&(maxRol=index[cRArr[1]]-0);
                    cRArr[2]-0>maxCol&&(maxCol=cRArr[2]-0);
                    img[index[cRArr[1]]+"-"+cRArr[2]]={
                        pos: index[cRArr[1]]+"-"+cRArr[2],
                        name: v.name,
                        x: 244*(cRArr[2]-1)*option.defaultScale,
                        y: 392*(index[cRArr[1]]-1)*option.defaultScale,
                        width: 240,
                        height: 130
                    };
                });
                //绘制房间
                this.addRoom("R",data.roomName,-200*option.defaultScale,-200*option.defaultScale,244*maxCol+400,392*maxRol+200);
                //绘制机柜
                for(var r=1;r<=maxRol;r++){
                    for(var c=1;c<=maxCol;c++){
                        var imgVal=img[r+"-"+c];
                        if(imgVal){
                            this.addCabinet(imgVal.pos,imgVal.name,imgVal.x,imgVal.y,imgVal.width,imgVal.height,true);
                        }else{
                            this.addCabinet(r+"-"+c,"N",244*(c-1)*option.defaultScale,392*(r-1)*option.defaultScale,240,130,false);
                        }
                    }
                }
                //视图剧中
                var offsetX= (canvas.width-244*maxCol*option.defaultScale)/2,
                    offsetY= (canvas.height-(392*maxRol-230)*option.defaultScale)/2;
                var s= canvas.width*0.94/(244*maxCol+400)/option.defaultScale;
                $.each(this.img,function(i,v){
                    var desX= v.x+offsetX,desY= v.y+offsetY;
                    v.move(desX, desY);
                    v.scale(s,[canvas.width/2,canvas.height/2]);
                });
                return this;
            },
            addCabinet:function(pos,name,x,y,width,height,isExist){//后进入数组的元素先渲染
                this.img[pos]=new Cabinet(name,x,y,width,height,isExist);
            },
            addRoom:function(id,name,x,y,width,height){
                this.img[id]=new Room(name,x,y,width,height);
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
                        if(v.constructor===Cabinet){
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
    $.fn.engineRoom=engineRoom;
    engineRoom=null;//释放内存
})()