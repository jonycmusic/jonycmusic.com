define(["jquery"], function($){
    //Singleton Utilities

    function encodeForClass(string){
        return string.trim().replace(/[\s,\",\&,\']/g,"-");
    }

    // Google Analytics
    function GoogleTrack(trackingString){
        ga&&ga('send', 'pageview', 'trackingString');
        try{
            console.log("Page View:"+trackingString);
        }catch(_){
        
        }
    }

    function GoogleEventTrack(category,action, name, num){
        ga&&ga('send', 'event', category, action, name, num);
        //sow in console
        try{
            console.log("Event:"+category+","+action+","+ name+","+ val);
        }catch(_){
        
        }
    }
    return {
         encodeForClass:encodeForClass
        ,GoogleTrack:GoogleTrack
        ,GoogleEventTrack:GoogleEventTrack
    };
})