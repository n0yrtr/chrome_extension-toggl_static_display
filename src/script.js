$(() => poll());
var isFirst = true;
var res_duration = 0;
var description = ''
var invisible = false;

const TOP_RIGHT = 0
const BOTTOM_RIGHT = 1
const BOTTOM_LEFT = 2
const TOP_LEFT = 3

var position_index = TOP_RIGHT


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
            $("#mytoggle_timer_n0yrtr_9999").remove()
            invisible = true;
            return
        }
});

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
          const res = JSON.parse(await getJSON(jsonPath))
          description = res.data.description
          res_duration = res.data.duration
          duration = res_duration + now
      }
      sec = duration % 60
      const min =  Math.floor(duration/60);


      $("#mytoggle_timer_n0yrtr_9999").remove();

      $('<ul id= "mytoggle_timer_n0yrtr_9999" style="\
        position: fixed;\
        right: 0px;\
        background-color: #00000088;\
        z-index: 10000000000000000000;\
        color: #FFF;\
        max-width: 150px;\
        white-space: nowrap;\
        margin: 0px;\
        padding: 10px;\
        list-style: none;\
        text-decoration: none;\
        ">\
        <li style="\
            overflow: hidden;\
            text-overflow: ellipsis;">' + description + '</li><li>' + min + ':' + sec + '</li></ul>')
      .appendTo('body');

      movePosition(position_index)

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
}

function getJSON(filename) {
    return new Promise(function(r) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', chrome.extension.getURL(filename), true);
        xhr.onreadystatechange = function() {
            if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                r(xhr.responseText);
            }
        };
        xhr.send();
    });
}


