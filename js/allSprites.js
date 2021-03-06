var Button = Class.create(Sprite,{
    initialize: function($super,x,y,width,height,container,text,size){
        $super(x,y,width,height,container);
        this.text = text;
    },
    draw: function ($super,graphics) {
       // $super(graphics);
        graphics.save();
        graphics.fillStyle = 'orange';
        graphics.fillRect(this.x,this.y, this.width, this.height);
        graphics.fill();
        graphics.fillStyle = 'white';
        graphics.font = .2 * this.height * this.width/this.height+"px Arial";
        var dim = graphics.measureText(this.text);

        var h = graphics.measureText("M").width;
        graphics.fillText(this.text, this.x +  this.width/2 - dim.width/2  , this.y + this.height/2 + .4*h );
        graphics.stroke();
        graphics.restore();
        if(this.debug)
        {
            $super(graphics);
        }

    },
    resize: function($super){
        $super();
    }
});


var Turkey = Class.create(AnimatedSprite,{
    initialize: function($super,x,y,w,h,container,img,shotImg,explosionImg,rightOrLeftFacing,zigzagDistance,speed){ ///add speed

        $super(x,y,w,h,container,img,6,9);
        this.direction = rightOrLeftFacing;
        if(rightOrLeftFacing=="right")
        {
            this.speed = Math.round(speed/1000 * this.container.width);

        }
        else
        {
            this.speed = Math.round(-speed/1000 * this.container.width);
        }
        this.alpha = 1.0;

        this.shotImg = shotImg;

        this.explosionImg = explosionImg;
        this.explodeFrame = 0;


        this.jumpMinY = this.y-zigzagDistance/100*this.container.height;
        this.defaultY = this.y;
        this.moveIncrement = -.0075 * this.container.width;
        this.isJumping = false;
        this.isShot = false;
    },
    shootTurkey: function(){
        this.isShot = true;
        this.isJumping = false;
        this.explodeFrame++;
    },
    zigzag: function(){
        if(!this.isJumping && !this.isShot)
        {
            this.isJumping = true;
        }
    },
    update: function($super,worldTime){
        if(this.explodeFrame>0)
        {
            this.explodeFrame++;
        }
        $super(worldTime);
        if(!this.isShot)
        {
            this.moveBy(this.speed,0);
        }

        if(this.isJumping)
        {
            this.moveBy(0,this.moveIncrement);
            if(this.y <= this.jumpMinY)
            {
                this.moveIncrement *= -1;
                this.y = this.jumpMinY;
            }
            else if(this.y >= this.defaultY)
            {
                this.y = this.defaultY;
                this.isJumping = false;
                this.isShot = false;
                this.moveIncrement *= -1;
            }
        }
    },
    draw: function($super, graphics)
    {
        if(!this.isShot)
        {

            $super(graphics);
        }
        else
        {
            graphics.save();
            this.alpha -= .05;
            if(this.alpha < 0)
            {
                this.alpha = 0;
            }
            ctx.globalAlpha = this.alpha;
            graphics.drawImage(this.shotImg,this.x,this.y,this.width,this.height);
            ctx.globalAlpha = 1.0;
            if(this.debug){
                $super(graphics);
            }
            graphics.restore();
        }
        if(this.explodeFrame>0 && this.explodeFrame<6)
        {
            graphics.drawImage(this.explosionImg,this.x,this.y,this.width,this.height);
        }
    }
});
