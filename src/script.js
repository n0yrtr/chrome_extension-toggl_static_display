var isFirst = true;
var res_duration = 0;
var description = ''

var calendar = ''

const TOP_RIGHT = 0
const BOTTOM_RIGHT = 1
const BOTTOM_LEFT = 2
const TOP_LEFT = 3


var defaults = {position: BOTTOM_RIGHT, hidden: false};


var position_index = defaults.position
var invisible = defaults.hidden

chrome.storage.sync.get(
  defaults,
  function(storageData) {
    position_index = storageData.position;
    invisible = storageData.hidden;
    init();
    $(() => poll());
  }
);



// clickされた時の処理
$(document).on('click', '#mytoggle_timer_n0yrtr_9999', function(){
       if(position_index === TOP_RIGHT) {
            movePosition(BOTTOM_RIGHT)
            return
        }
        if(position_index === BOTTOM_RIGHT) {
            movePosition(BOTTOM_LEFT)
            return
        }
        if(position_index === BOTTOM_LEFT) {
            movePosition(TOP_LEFT)
            return
        }
        if(position_index === TOP_LEFT) {
            movePosition(TOP_RIGHT)
            return
        }
});

$(document).on('click', '#mytoggle_timer_n0yrtr_9999_close', function(){
   minimize();
});
$(document).on('click', '#mytoggle_timer_n0yrtr_9999_expand', function(){
    expand();
});

function init() {
    $('<ul id= "mytoggle_timer_n0yrtr_9999" style="\
        position: fixed;\
        right: 0px;\
        background-color: #00000088;\
        z-index: 10000000000000000000;\
        color: #FFF;\
        max-width: 250px;\
        white-space: nowrap;\
        margin: 0px;\
        padding: 10px;\
        list-style: none;\
        text-decoration: none;\
        line-height: 1; \
        text-align: left; \
        font-family: sans-serif;\
        ">\
        <li id="mytoggle_timer_n0yrtr_9999_description"\
            style="\
                overflow: hidden;\
                text-overflow: ellipsis;\
	        font-size: xx-small;"></li>\
            <li id="mytoggle_timer_n0yrtr_9999_time"></li>\
            <li id="mytoggle_timer_n0yrtr_9999_calendar"\
                style="\
                    overflow: hidden;\
                    white-space: pre-wrap;\
                    text-overflow: ellipsis;\
                    max-height: 100px;\
		    font-size: xx-small;"\
            ></li>\
        <li id="mytoggle_timer_n0yrtr_9999_close"\
            style="\
                overflow: hidden;\
                text-overflow: ellipsis;\
                font-size: xx-small;\
                position: absolute;\
                top: 10px;\
                right: 10px;">x</li>\
        </ul>')
      .appendTo('body');

      movePosition(position_index)
}

async function poll() {
  if(invisible) {
    return
  }
  try {
      const now = Math.floor(Date.now()/1000)
      var duration = res_duration + now
      
      if((duration % 60 <= 3) || isFirst) {
          isFirst = false;
          const jsonPath = 'result_data.json'
          const res = JSON.parse(await getFile(jsonPath))
          if(res.data) {
            description = res.data.description
            res_duration = res.data.duration
            duration = res_duration + now  
          }
          

          const carendarFilePath = 'result_schedule.txt'
          calendar = await getFile(carendarFilePath)
      }
      sec = duration % 60
      const min =  Math.floor(duration/60);
      const descriptionDom = $('#mytoggle_timer_n0yrtr_9999_description')
      descriptionDom.text(description)
      const time = min + ':' + sec;
      $('#mytoggle_timer_n0yrtr_9999_time').text(time)
      $('#mytoggle_timer_n0yrtr_9999_calendar').text(calendar)

 } catch(e) {
    console.log(e)
 } finally {
    setTimeout(function(){poll()},1000);
 }

}

function movePosition(position) {
    if(position === TOP_RIGHT) {
        $("#mytoggle_timer_n0yrtr_9999").css('top','0');
        $("#mytoggle_timer_n0yrtr_9999").css('bottom','');
        $("#mytoggle_timer_n0yrtr_9999").css('right','0');
        $("#mytoggle_timer_n0yrtr_9999").css('left','');
    }
    if(position === BOTTOM_RIGHT) {
        $("#mytoggle_timer_n0yrtr_9999").css('top','');
        $("#mytoggle_timer_n0yrtr_9999").css('bottom','0');
        $("#mytoggle_timer_n0yrtr_9999").css('right','0');
        $("#mytoggle_timer_n0yrtr_9999").css('left','');
    }
    if(position === BOTTOM_LEFT) {
        $("#mytoggle_timer_n0yrtr_9999").css('top','');
        $("#mytoggle_timer_n0yrtr_9999").css('bottom','0');
        $("#mytoggle_timer_n0yrtr_9999").css('right','');
        $("#mytoggle_timer_n0yrtr_9999").css('left','0');
    }
    if(position === TOP_LEFT) {
        $("#mytoggle_timer_n0yrtr_9999").css('top','0');
        $("#mytoggle_timer_n0yrtr_9999").css('bottom','');
        $("#mytoggle_timer_n0yrtr_9999").css('right','');
        $("#mytoggle_timer_n0yrtr_9999").css('left','0');
    }
    position_index = position
    var storageData = {position: position_index, hidden: invisible}
    chrome.storage.sync.set(storageData, function(){});
}

function minimize() {
    $("#mytoggle_timer_n0yrtr_9999_description").css('display','none')
    $("#mytoggle_timer_n0yrtr_9999_time").css('display','none')
    $("#mytoggle_timer_n0yrtr_9999_calendar").css('display','none')
    $("#mytoggle_timer_n0yrtr_9999").css('max-height','20px');
    $("#mytoggle_timer_n0yrtr_9999").css('max-width','20px');
    $("#mytoggle_timer_n0yrtr_9999_close").remove()
    $('<li id="mytoggle_timer_n0yrtr_9999_expand"\
            style="\
                overflow: hidden;\
                text-overflow: ellipsis;\
                font-size: xx-small;\
                position: absolute;\
                top: 10px;\
                right: 10px;">□</li>').appendTo($("#mytoggle_timer_n0yrtr_9999"))
    invisible = true;

    var storageData = {position: position_index, hidden: invisible}
    chrome.storage.sync.set(storageData, function(){});
}

function expand() {
    $("#mytoggle_timer_n0yrtr_9999_description").css('display','block')
    $("#mytoggle_timer_n0yrtr_9999_time").css('display','block')
    $("#mytoggle_timer_n0yrtr_9999_calendar").css('display','block')
    $("#mytoggle_timer_n0yrtr_9999").css('max-height','initial');
    $("#mytoggle_timer_n0yrtr_9999").css('max-width','250px');
    $("#mytoggle_timer_n0yrtr_9999_expand").remove()
    $('<li id="mytoggle_timer_n0yrtr_9999_close"\
            style="\
                overflow: hidden;\
                text-overflow: ellipsis;\
                font-size: xx-small;\
                position: absolute;\
                top: 10px;\
                right: 10px;">x</li>').appendTo($("#mytoggle_timer_n0yrtr_9999"))
    invisible = false;

    var storageData = {position: position_index, hidden: invisible}
    chrome.storage.sync.set(storageData, function(){});
    $(() => poll());
}

function getFile(filename) {
    return new Promise(function(r) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', chrome.runtime.getURL(filename), true);
        xhr.onreadystatechange = function() {
            if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                r(xhr.responseText);
            }
        };
        xhr.send();
    });
}


