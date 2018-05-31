import { viewport } from 'jquery.viewport'; //
import TagManager from './js/lib/TagManager';
import { flexslider } from  './js/jquery.flexslider';
import Util from './js/lib/Util';
import { SoundCloudPlayer } from './js/sc-player';
import { SCWaveform } from './js/sc-player-waveform';


var $controls = $(".controls");
        
var scplayer = new SoundCloudPlayer([
        //"/jonyc/sets/random-stuff-from-random-times/"
        // "/jonyc/tracks/"
        "/jonyc/sets/on-jonycmusic-com"
        // "/jonyc/sets/published-work"
    ],{
      consumer_key: "aa7372d5d5bac8e208d0b63553ea3a1d"
    , autoplay: false
    , loop: false
    , toggle_pause: true
    , preload: true
});
var scwaveform = new SCWaveform(scplayer, {scrub:true});

var genreList = new TagManager(), 
    tagList = new TagManager();

genreList.on("TagManager.add", function(e, tag,taglist){
    $("<li/>").html(
            $("<a/>").html(tag).attr("href", "#").attr("data-prefix", "genre-").attr("data-value",tag)
        )
        .appendTo($("#listGenres .taglist"))
    resetTray();
    autoHideTray();
});
tagList.on("TagManager.add", function(e, tag,taglist){
    $("<li/>").html(
            $("<a/>").html(tag).attr("href", "#").attr("data-prefix", "tag-").attr("data-value",tag)
        )
        .appendTo($("#listTags .taglist"))
    resetTray();
    autoHideTray();
});

$controls.on("click", 'div', function(e){
    e.preventDefault();
    var $this = $(this), action = ''
    if( $this.hasClass('play') ){ scplayer.pause(); action = "play"; }
    else if( $this.hasClass('pause') ){ scplayer.pause(); action = "pause"}
    else if( $this.hasClass('stop') ){ scplayer.stop(); action = "stop"}
    else if( $this.hasClass('next') ){ scplayer.next(); action = "next"}
    else if( $this.hasClass('prev') ){ scplayer.prev(); action = "prev"}

    Util.GoogleEventTrack("Player", "click", action );
});
scplayer.on("scplayer.pause", function(e, is_paused){
    if(is_paused === true){
        $controls.find('.play').addClass("pause");
    }else{
        $controls.find('.play').removeClass("pause");
    }
});

scplayer.on("scplayer.play", function(e, is_paused){
    $controls.find('.play').removeClass("pause");
});
scplayer.on("scplayer.stop", function(e, is_paused){
    $controls.find('.play').addClass("pause");
});


scplayer.on("scplayer.init", function(e, track, sound){
    var $pl = $("#playlist");
    $pl.empty();
    //
    var playlist = scplayer.playlist();
    for(var x=0, l=playlist.length; x<l; x++){
        var $li = $("<li/>", {"html": "..."}).appendTo($pl);
        (function(x,$li){
            //lookup the track info
            scplayer.track_info(x).done(function(track){
                $li.html("")
                if (track.artwork_url){
                    $li.css("background-image", "url("+track.artwork_url.replace("large.jpg","t300x300.jpg")+")")
                    $li.addClass("artwork")
                }
                var $a = $("<a/>").html(track.title);
                $a.addClass("track");
                $a.attr("href", track.permalink_url);
                $a.attr("data-track-id", track.id);
                $a.attr("target", "_blank");
                $a.attr('data-index', x);
                var $icon = $a.clone();
                $icon.attr("class","new-window-icon");
                $li.append($a);
                $li.append($icon);
                if (track.tag_list){
                        var tag_list = track.tag_list.split(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g);
                        for (var i in tag_list){
                            if (tag_list[i].trim().length>0)
                                $li.addClass("tag-"+Util.encodeForClass(tag_list[i]));
                        }
                        tagList.addTag(tag_list);
                }
                        

                if(track.genre) {
                    $li.addClass("genre-"+Util.encodeForClass(track.genre));
                    genreList.addTag(track.genre)
                }
                RegisterClicks();
            });
        })(x,$li);          
    }
    $("#playlist").find('li:first').addClass('active');
});


scplayer.on("scplayer.changing_track", function(e, index){
    $("#playlist").find('li').removeClass('active').eq(index).addClass('active');
    $("#player .trackInfo").html("<strong>"+e.target.get_track().title+"</strong> ["+e.target.get_track().genre+"] - "+e.target.get_track().tag_list);
});

//click playlist tracks
function RegisterClicks(){
    $(".taglist a").unbind("click");
    $(".taglist a").on("click", function(e){
        $("#playlist li.hidden").removeClass("hidden");
        $(e.target).parents(".taglist").find("a.active").removeClass("active");
        if($(e.target).attr("data-prefix")){
            //Hide the other tiles
            $("#playlist li:not(."+Util.encodeForClass($(e.target).attr("data-prefix")+$(e.target).attr("data-value"))+")").addClass("hidden");
        }
        //highlight the selected link
        $(e.target).addClass("active");
        resetFilters($(e.target).parents(".taglist-section").attr("id"));
        
        Util.GoogleEventTrack("Tags", "click", $(e.target).parents(".taglist-section").attr("id")+"-"+$(e.target).attr("data-value"));
        e.preventDefault();
    });
    
    $("#tagLists .filter-btn").unbind("click");
    $("#tagLists .filter-btn").on("click", function(){
        $("#tagLists").toggleClass("active")
    });

    $("#playlist a.track").unbind("click");
    $("#playlist a.track").on("click", function(e){
        var $this = $(e.target);
        scplayer.goto($this.data('index')).play();
        if (!$(e.target).hasClass("new-window-icon")){
            e.preventDefault();
            Util.GoogleEventTrack("Tile", "click", $(e.target).text())
        }
    });
}

//Utilities
function resizeWaveForm(){
    $("#waveform").width($(window).width() - $("#controls").width()-15);
}

function resetFilters(tag_section_id){
    $("#tagLists .taglist-section:not([id="+tag_section_id+"]) a.active").removeClass("active");
    $("#tagLists .taglist-section:not([id="+tag_section_id+"])").find("a:first").addClass("active");
}

function resetTray(){
    $("#tagLists .filter-btn").css("left", -$("#tagLists .filter-btn").width()+5);
    $("#tagLists").css("right", -$("#tagLists").innerWidth());
}

function autoHideTray(){
    if ($("#playlist").is(":in-viewport"))
        $("#tagLists.hide").removeClass("hide")
    else
        $("#tagLists").addClass("hide");
    resetTray()
}

//Resize Window
$(window).on("resize", function(){
    resizeWaveForm();
    resetTray();
    autoHideTray();
})
$(window).on("scroll", function(e){
    autoHideTray();
})

//Some initialiation

resizeWaveForm();
resetTray();
autoHideTray();

// initiate slider
$('.flexslider').flexslider({
    animation: "slide",
    controlNav: "thumbnails",
    slideshow: false
});

//Noodle code.. sorry.. 