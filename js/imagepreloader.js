/**
 * Created by haungsn on 9/25/14.
 */
var ImagePreLoader = Class.create({
    initialize: function(imageNameArray, completeFn, errorFn){
        this.images = new Array();
        var count = 0;
        for(var i =0;i< imageNameArray.length;i++)
        {
            this.images.push(new Image());
            this.images[i].src = imageNameArray[i];
            this.images[i].onload = function(evt){
                //console.log("Image loaded:" + this.src);
                count++;
                if(count == imageNameArray.length)
                {
                    completeFn(evt);
                }
            };
            this.images[i].onerror = function(evt){
                errorFn(evt);
            };
        }
    }
});

ImagePreLoader.createNumericImageArray = function(path, prefixString, beginNum, endNum, imgExtension){
    var array = new Array();
    for(var i = beginNum;i <= endNum; i++){
        array.push(path + prefixString + i + imgExtension);
    }
    return array;
};