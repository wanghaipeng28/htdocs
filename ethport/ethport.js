/**
 * Created by Administrator on 2016-11-26.
 */
$(document).ready(function(){
    var c=document.getElementById("canvas");
    var ctx=c.getContext("2d");
    var image1=new Image();
    image1.src="img/t_normal.png";
    var image2=new Image();
    image2.src="img/t_up_nodata2.png";
    image2.onload=function(){
        //var eth=new EthPort([image1,image2],"1","normal",20,20);
        images.addBrd("单板1",48,0,0,1552,496);
        for(var i=0;i<181;i++){
            var r=parseInt(i/24);
            if((i+1)%24==0){
                var c=23;
            }else{
                var c=(i)%24;
            }
            images.addEthPort([image1,image2],i+1+"","normal",20+(c)*63,20+r*57);
        }
        images.init();
        //var eth1=new EthPort([image1,image2],"2","normal",82,20);
        //var eth2=new EthPort(image2,"3","normal1",20,76);
        //var bar=new Brd("单板1",48,0,0,620,152);

        setInterval(function(){
            images.clear();
            images.draw();
        },130);
    }
    //创建图形父类
    function Img(){
        this.s=1;
    }
    //图形缩放函数
    Img.prototype.scale=function(s,origin){
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
    //以太网端口类
    function EthPort(img,name,status,x,y){
        this.image=img;
        this.status=status;
        this.x=x;
        this.y=y;
        this.index=0;
        this.width=0;
        this.height=0;
        this.name=name;
        Img.call(this);
    }
    //继承图形父类
    Object.setPrototypeOf(EthPort.prototype,Img.prototype);
    //以太网端口的绘制函数
    EthPort.prototype.draw=function(){
        if(this.status=="normal"){
            this.width=this.image[this.index].width*this.s;
            this.height=this.image[this.index].height*this.s;
            ctx.drawImage(this.image[this.index],this.x,this.y,this.width,this.height);
            this.index++;
            if(this.index==this.image.length){
                this.index=0;
            }
        }else{
            this.width=this.image.width*this.s;
            this.height=this.image.height*this.s;
            ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
        }
        ctx.fillStyle="#fff";
        ctx.font=(this.s*20+'px helvetica');
        var w=ctx.measureText(this.name).width;
        ctx.fillText(this.name,(this.width-w)/2+this.x,this.height/2+this.y+10*this.s);
    }
    //创建单板类
    function Brd(name,port,x,y,width,height){
        this.x=x;this.y=y;this.name=name;this.port=port;
        Img.call(this);
        this.width=width*this.s;this.height=height*this.s;
    }
    //继承图形父类
    Object.setPrototypeOf(Brd.prototype,Img.prototype);
    //以太网端口的绘制函数
    Brd.prototype.draw=function(){
        ctx.fillStyle="#5D5D75";
        ctx.fillRect(this.x,this.y,this.width,this.height);
        ctx.strokeStyle="#3D3E40"
        ctx.lineWidth=8*this.s;
        ctx.strokeRect(this.x,this.y,this.width,this.height);
        ctx.fillStyle="#e4393c";
        ctx.font=(this.s*20+'px helvetica');
        var w=ctx.measureText(this.name).width;
        ctx.fillText(this.name,this.x,this.y-9*this.s);
    }
    var images={
        ethPorts:[],
        brd:[],
        init:function(){
            var self=this;
            c.onmousedown=function(e){
                if(e.buttons==1){
                    var bX=e.offsetX,bY=e.offsetY;
                    c.onmousemove=function(e){
                        self.clear();
                        var mX= e.offsetX-bX,mY= e.offsetY-bY;
                        $.each(self.ethPorts,function(i,v){
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
                console.log(1);
                self.clear();
                if(e.wheelDelta>0){
                    var s=1.05;
                }else{
                    var s=100/105;
                }
                $.each(self.ethPorts,function(i,v){
                    v.scale(s,[e.offsetX, e.offsetY]);
                })
                self.draw();
            }, false)
        },
        addEthPort:function(img,name,status,x,y){
            this.ethPorts.push(new EthPort(img,name,status,x,y));
        },
        addBrd:function(name,port,x,y,width,height){
            this.ethPorts.push(new Brd(name,port,x,y,width,height));
        },
        draw:function(){
            $.each(this.ethPorts,function(i,v){
                v.draw();
            });
        },
        //定义清除画布函数
        clear:function(){
            ctx.clearRect(0,0, c.width, c.height);
        }
    }
});