
var delayFactor = 1.0;

function addLines(lines) {
    var styleClass = server.getRandomClass(lines.length);
    $.each(lines, function() {
        var text = this;
        var newElem = $("<p></p>");
        var textElem = $("<span> " + text + "</span>");
        textElem.addClass(styleClass);
        var serverName = "mis-01"
        newElem.append("<span>[" + moment().format("HH:mm:ss") + " " + serverName + " (UTC " + moment.utc().format("HH:mm") + ")]</span>");
        newElem.append(textElem);
        $("#body_console").prepend(newElem);
    });
}


function cullOldEntries() {
    var scrollbackLimit = 250;
    $("#body_console p").slice(scrollbackLimit).remove();
}


var currentTimeoutId = undefined;
var counter = 0;
function doStuff() {
    var delay = 5 + 2600 * Math.random() * Math.random() * Math.random() * Math.random();
    delay *= delayFactor;
    currentTimeoutId = setTimeout(function() {
        addLines(server.getRandomLines());
        counter++;
        if(counter % 20 == 0) {
            cullOldEntries();
        }
        doStuff();
    }, delay);
}

// When ready, go go go
$(function() {
    if(window.location.search.match("controls")) {
        $("#controls").show();
    }
    doStuff();

    $("#controls #turbo").click(function() {
        if(delayFactor < 1.0) {
            delayFactor = 1.0;
        } else {
            delayFactor = 0.00001;
        }
    });

    var lastLineCount = counter;
    var lastTime = moment();
    setInterval(function() {
        var currentTime = moment();
        duration = currentTime - lastTime;
        lps = (counter - lastLineCount) / (duration / 1000.0);
        $("#controls #lps").text("" + Math.round(lps) + " L/S");
        lastTime = currentTime;
        lastLineCount = counter;
    }, 3000);

    $("#controls #play_pause").click(function () {
        if(typeof currentTimeoutId != "undefined") {
            clearTimeout(currentTimeoutId);
            currentTimeoutId = undefined;
        }
        else {
            doStuff();
        }
    });
})

