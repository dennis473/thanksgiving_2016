var Point = Class.create({
    initialize: function(x,y){
        this.x = x;
        this.y = y;
    }
});

var Sprite = Class.create({
    initialize: function(x,y,w,h,container){

        this.actualWidth = w;
        this.actualHeight = h;

        this.actualX = x;
        this.actualY = y;
        this.container = container;
        this.x = x / 100 * this.container.width;
        this.y = y / 100  * this.container.height;
        this.width = w /100 *this.container.width;
        if(this.width < 1)
        {
            this.width = 1;
        }
        this.height = h /100 * this.container.height;
        if(this.height < 1)
        {
            this.height = 1;
        }
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.width = Math.round(this.width);
        this.height = Math.round(this.height);

    },
    getCenterX: function(){
        return this.x + this.width/2;
    },
    getCenterY: function(){
        return this.y + this.height/2;
    },
    getCenter: function(){
        return{x: this.getCenterX(),y: this.getCenterY()};
    },
    moveBy: function (dx, dy){
        this.x += Math.round( dx/100 * this.container.width);
        this.y += Math.round(dy * this.container.height);
    },
    moveTo: function(x,y){
        this.x = Math.round( x/100 * this.container.width);
        this.y = Math.round( y/100 * this.container.height);
    },
    checkContainsPoint: function(pt){
        return (pt.x > this.x) &&  (pt.x < this.x + this.width) &&
            ( pt.y > this.y - this.height/2 ) && (pt.y < this.y + this.height/2);

    },
    contains: function(pt)
    {
        var cx = this.getCenterX();
        var cy = this.getCenterY();

          var radius = Math.min(this.width,this.height)/2 ;
         var dist_sq = (this.getCenterX()-pt.x)*(this.getCenterX()-pt.x) + (this.getCenterY()-pt.y)*(this.getCenterY()-pt.y);
         if( dist_sq < radius * radius)
         {
         return true;
         }
         return false;
    },

    resize: function(){
        this.x = Math.round(this.actualX/100 * this.container.width);
        this.y = Math.round(this.actualY/100 * this.container.height);
        this.width = Math.round(this.actualWidth/100 * this.container.width);
        this.height = Math.round(this.actualHeight/100 * this.container.height);
        if(this.width < 1)
        {
            this.width = 1;
        }
        if(this.height < 1)
        {
            this.height = 1;
        }
    },
    draw: function(graphics){
        graphics.save();
        graphics.lineWidth = 3;
        graphics.strokeStyle = "rgb(0,0,0)";
        graphics.strokeRect(this.x, this.y, this.width, this.height);
        graphics.restore();

    }
});


/******************************************************************************/


var ImageSprite = Class.create(Sprite,{
    initialize: function($super,x,y,w,h,container,image){
        $super(x,y,w,h,container);
        this.img = image;
        this.debug = false;
    },
    draw: function($super,graphics){
        graphics.save();
        graphics.drawImage(this.img,0,0,this.img.width,this.img.height,this.x,this.y,this.width,this.height);
        graphics.restore();
        if(this.debug){
            $super(graphics);
        }
    },

    debugToggle: function(debug){
        this.debug=debug;
    }
});

/********************************************************************************/

var AnimatedSprite = Class.create(ImageSprite,{
    initialize: function($super,x,y,w,h,container,img,frameCount,fps){
        $super(x,y,w,h,container,img);
        this.frameCount = frameCount;
        this.currentFrame = 0;
        this.fps = fps;
        this.playing = true;
        this.loopCount=-1;
        this.date = new Date();
        this.accumulate = this.date.getTime();
        this.isReverse = false;
        this.frameWidth = this.img.width/this.frameCount;
    },
    draw: function ($super,graphics){
        graphics.save();
        graphics.drawImage(this.img,this.frameWidth*this.currentFrame,0,this.frameWidth,this.img.height,this.x,this.y,
            this.width,this.height);


        if(this.debug)
        {
            graphics.beginPath();
            graphics.lineWidth = 1;
            graphics.strokeStyle = '#003300';

            graphics.strokeRect(this.x, this.y, this.width, this.height);
            var cx = this.getCenterX();
            var cy = this.getCenterY();
            graphics.lineWidth=3;
            graphics.strokeStyle="#00FF00";
            graphics.moveTo(cx, cy-this.height/2);
            graphics.bezierCurveTo(cx + this.width/2, cy - this.height/2,
                cx + this.width/2, cy + this.height/2,
                cx, cy + this.height/2);
            graphics.bezierCurveTo(cx - this.width/2, cy + this.height/2,
                cx - this.width/2, cy - this.height/2,
                cx, cy - this.height/2);
            graphics.stroke();
        }
        graphics.closePath();
        graphics.restore();

    },
    play: function(loopCount){
        this.playing = true;
        this.loopCount = loopCount;
    },
    update: function(worldTime){
        var elapsedTime = (worldTime - this.accumulate);
        var frameTime = 1000/this.fps;
        if(elapsedTime > frameTime && this.playing)
        {
            if(this.isReverse)
            {
                this.currentFrame--;
                if(this.currentFrame < 0)
                {
                    this.currentFrame = this.frameCount -1;
                }

            }
            else
            {
                this.currentFrame++;
                this.currentFrame %= this.frameCount;
            }
            if(this.currentFrame == 0 && this.loopCount > 0)
            {
                this.loopCount--;
                if(this.loopCount == 0)
                {
                    this.playing = false;
                }
            }
            this.accumulate = worldTime;
        }
    },
    pause: function(){
        this.playing = false;
    },
    goToFrame: function(frame){
        this.currentFrame = frame%this.frameCount;
    }
});

