define(["jquery"], function(){
    // Events
    /*  
        TagManager.add
        TagManager.select
        TagManager.deselect
    */
    
    function TagManager(){

        var _tags = [];
        var _selected = -1;
        var _this = this, $this = jQuery(this);

        this.addTag = function(taglist){
            // enter a tag or a list of them
            if (typeof(taglist) === "string")
                taglist = [taglist];
            for (var i =0; i< taglist.length; i++){
                if (_tags.indexOf(taglist[i]) === -1){
                    _tags[_tags.length] = taglist[i];
                    _this.trigger("TagManager.add", taglist[i], taglist);                    
                }

            }

        }
        this.select = function(tagName){
            _selected = _tags.indexOf(tagName);
            -this.trigger("TagManager.select", _selected);
        }
        this.deselect = function(){
            _selected = -1
            _this.trigger("TagManager.deselect", _selected);
        }

        //events - using jquery
        this.on = function(evnt, cb){
            return $this.on(evnt, cb);
        };
        this.trigger = function(evnt){
            var args = (arguments.length > 1) ? __slice.call(arguments, 1) : [];
            return $this.trigger(evnt, args);
        };

        return {
            addTag: this.addTag
            , select: this.select
            , deselect: this.deselect
            , on: this.on

        }
    }
    return TagManager;
})