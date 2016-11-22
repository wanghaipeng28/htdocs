/**
 * Created by nantian on 2016/10/21.
 */
(function(){
    try{
        var $=jQuery;
    }catch (err){
        throw new Error("依赖的jQuery函数不存在！");
    }
    function T(option){
        //设置默认参数
        !option.defaultScale&&(option.defaultScale=0.45);
        !option.maxScale&&(option.maxScale=3.5);
        !option.minScale&&(option.minScale=0.2);
        if(!option.color){
            option.color={
                bgc:"#ddd",
                nodeFontColor:"#50BDFF",
                nodeBorderColor:"#5994E6",
                lineColor:"#666",
                lineFontColor:"#FF50BD"
            }
        }else{
            !option.color.bgc&&(option.color.bgc="#ddd");
            !option.color.nodeFontColor&&(option.color.nodeFontColor="#50BDFF");
            !option.color.nodeBorderColor&&(option.color.nodeBorderColor="#5994E6");
            !option.color.lineColor&&(option.color.lineColor="#666");
            !option.color.lineFontColor&&(option.color.lineFontColor="#FF50BD");
        }

        var c=$("#"+option.canvas)[0];
        $(c).css("backgroundColor",option.color.bgc);
        var ctx=c.getContext("2d");
        //创建图形父类(第一个参数用来表示图形类型，e为设备 l为连线)
        function ImageClass(c,img){
            this.s=option.defaultScale;
            this.c=c;
            this.selected=false;
        }
        //定义渲染设备函数
        ImageClass.prototype.drawE=function(){
            //选中时显示边框
            if(this.selected){
                ctx.strokeStyle=option.color.nodeBorderColor;
                ctx.lineWidth=3;
                ctx.strokeRect(this.x-3,this.y-3,this.width+6,this.height+20*this.s+11);
                ctx.fillStyle=option.color.bgc;
                ctx.fillRect(this.x-3,this.y-3,this.width+6,this.height+20*this.s+11);
            }
            ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
            ctx.fillStyle=option.color.nodeFontColor;
            ctx.font=(this.s*20+'px helvetica');
            var w=ctx.measureText(this.name).width;
            ctx.fillText(this.name,(this.width-w)/2+this.x,this.y+this.height+20*this.s);
        }
        //定义渲染连接线函数
        ImageClass.prototype.drawL=function(){
            var x1=this.node1.x+this.node1.width/2,
                y1=this.node1.y+this.node1.height/2;
            var x2=this.node2.x+this.node2.width/2,
                y2=this.node2.y+this.node2.height/2;
            var x3=(x1+x2)/2,
                y3=(y1+y2)/2;
            ctx.beginPath();
            ctx.lineWidth="1";
            ctx.strokeStyle=option.color.lineColor; // 红色路径
            ctx.moveTo(x1,y1);
            ctx.lineTo(x2,y2);
            ctx.stroke(); // 进行绘制
            ctx.fillStyle=option.color.lineFontColor;//绘制连线文本
            ctx.font=(this.node1.s*24+'px helvetica');
            var w=ctx.measureText(this.name).width;
            ctx.fillText(this.name,x3-w/2,y3+(this.node1.s*24)/2);

        }
        //定义移动函数
        ImageClass.prototype.move=function(x,y){
            this.x=x;
            this.y=y;
        }
        //定义全部图形的缩放函数
        ImageClass.prototype.scale=function(s,origin){
            if(this.s>option.maxScale&&s>1){s=1}
            if(this.s<option.minScale&&s<1){s=1}
            this.x=origin[0]-(origin[0]-this.x)*s;
            this.y=origin[1]-(origin[1]-this.y)*s;
            this.width=this.width*s;
            this.height=this.height*s;
            this.s=this.s*s;
        }

        //创建设备类
        function E(id,nName,img,x,y){
            this.x=x;
            this.y=y;
            this.img=img;
            //设置初始缩放比例
            this.width=this.img.width*option.defaultScale;
            this.height=this.img.height*option.defaultScale;
            this.id=id;
            this.name=nName;
            ImageClass.call(this,"e");
        }
        //设置Route的父类为Image
        Object.setPrototypeOf(E.prototype,ImageClass.prototype);
        //创建交换机类
        function Line(name,node1,node2){
            this.name=name;
            this.node1=node1;
            this.node2=node2;
            ImageClass.call(this,"l");
        }
        //设置Route的父类为Image
        Object.setPrototypeOf(Line.prototype,ImageClass.prototype);
        //用了保持画布中所有的图形
        var imgList={
            eImgs:{},
            lines:[],
            init:function(){
                var self=this;
                c.onmousedown=function(e){
										if(e.buttons==1){
												var x= e.offsetX,y= e.offsetY;
												var target=null;
												var offsetX= 0,offsetY=0;
												var isAll=true;
												var bX=x,bY=y;
												$.each(self.eImgs,function(i,v){
														if(x> v.x&&x<( v.x+ v.width)&&y>v.y&&y<(v.y+ v.height)){
																isAll=false;
																target=v;
																offsetX= x- v.x;
																offsetY= y- v.y;
																v.selected=true;
														}else{
																v.selected=false;
														}
												});
												c.onmousemove=function(e){
														if(!isAll){
																self.clear();
																var desX= e.offsetX-offsetX,desY= e.offsetY-offsetY
																target.move(desX, desY);
																self.draw();
														}else{
																self.clear();
																var mX= e.offsetX-bX,mY= e.offsetY-bY;
																$.each(self.eImgs,function(i,v){
																		var desX= v.x+mX,desY= v.y+mY;
																		v.move(desX, desY);
																});
																self.draw();
																bX= e.offsetX,bY= e.offsetY;
														}
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
                    $.each(self.eImgs,function(i,v){
                        v.scale(s,[e.offsetX, e.offsetY]);
                    })
                    self.draw();
                }, false)
            },
            addEquipment:function(id,nName,img,x,y){
                this.eImgs["id"+id]=new E(id,nName,img,x,y);
            },
            addLine:function(label,from,to){
                var node1=this.eImgs["id"+from];
                var node2=this.eImgs["id"+to];
                this.lines.push(new Line(label,node1,node2));
            },
            //定义搜索节点函数
            searchNode:function(str){
                var x,y;
                var searched=false;
                var width= c.width,height= c.height;
                $.each(this.eImgs,function(i,v){
                    if(v.name==str){
                        searched=true;
                        x= v.x+v.width/2,y= v.y+v.height/2;
                        v.selected=true;
                    }else{
                        v.selected=false;
                    }
                });
                if(searched){
                    this.centerTO(x,y,width,height);
                    return true;
                }else{
                    return false;
                }
            },
            //定义搜索动画函数
            centerTO:function(x,y,w,h){
                var time=150,//定义动画所需要的总时间
                    STEP=50,//定义移动的总步数
                    moved=0;//定义移动过的次数
                var dX=w/2-x,//定义水平方向移动的距离
                    dY=h/2-y;
                var stepX=dX/STEP,//定义每次移动距离
                    stepY=dY/STEP;
                var t=time/STEP;//定义每次移动所需的时间
                var timer=setInterval(function(){
                    moved++;
                    if(moved>=STEP){
                        STEP=0;
                        clearInterval(timer);
                    }
                    this.clear();
                    $.each(this.eImgs,function(i,v){
                        v.x+=stepX;
                        v.y+=stepY;
                    });
                    this.draw();
                }.bind(this),t);

            },
            draw:function(){
                $.each(this.lines,function(i,v){
                    v.drawL();
                });
                $.each(this.eImgs,function(i,v){
                    v.drawE();
                });
            },
            //定义清除画布函数
            clear:function(){
                ctx.clearRect(0,0, c.width, c.height);
            }
        }
        return imgList;
    }
    $.T=T;
    //canvas加载图片过程
    function L(canvasId,obj,fn){
        var c=document.getElementById(canvasId);
        c.style.backgroundColor="#ddd";
        var ctx= c.getContext("2d");
        imgs={};
        var l={
            width: c.width,
            height: c.height,
            n:0,
            p:0,
            draw:function(){
                var p = parseInt(this.p);
                ctx.clearRect(0,0,this.width,this.height);
                ctx.font='50px helvetica';
                ctx.strokeStyle='#fff';
                var w=ctx.measureText(p+'%').width;
                ctx.lineWidth='4';
                var endd=3.60*p-90;
                ctx.beginPath();
                ctx.arc(this.width/2,this.height/2,80,-90*Math.PI/180,endd*Math.PI/180);
                ctx.stroke();
                ctx.fillStyle='#eee';
                ctx.strokeStyle='#111';
                ctx.lineWidth='1';
                ctx.fillText(p+'%',this.width/2-w/2,this.height/2+20);
                ctx.strokeText(p+'%',this.width/2-w/2,this.height/2+20);
                if(this.p>98){
                    ctx.clearRect(0,0,this.width,this.height);
                    fn(imgs);
                }
            }
        };
        for(var i in obj){
            l.n++;
        }
        for(var i in obj){
            var src=obj[i];
            imgs[i]=new Image();
            imgs[i].src=src;
            imgs[i].onload=function(){
                l.p+=(1/l.n)*100;
                l.draw();
            };
        }
    }
    $.L=L;
})();