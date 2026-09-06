import { getRandomClass, getRandomLines } from "./server.mjs";

var delayFactor = 1.0;

function pad2(n) {
    return (n < 10 ? "0" : "") + n;
}

function formatHms(date) {
    return pad2(date.getHours()) + ":" + pad2(date.getMinutes()) + ":" + pad2(date.getSeconds());
}

function formatUtcHm(date) {
    return pad2(date.getUTCHours()) + ":" + pad2(date.getUTCMinutes());
}

function formatLogPrefix(serverName) {
    var now = new Date();
    return "[" + formatHms(now) + " " + serverName + " (UTC " + formatUtcHm(now) + ")]";
}

function addLines(lines) {
    var styleClass = getRandomClass(lines.length);
    var consoleEl = document.getElementById("body_console");
    for (var i = 0; i < lines.length; i++) {
        var text = lines[i];
        var newElem = document.createElement("p");
        var textElem = document.createElement("span");
        textElem.innerHTML = " " + text;
        textElem.className = styleClass;
        var serverName = "mis-01"
        var timestampElem = document.createElement("span");
        timestampElem.textContent = formatLogPrefix(serverName);
        newElem.appendChild(timestampElem);
        newElem.appendChild(textElem);
        consoleEl.insertBefore(newElem, consoleEl.firstChild);
    }
}


function cullOldEntries() {
    var scrollbackLimit = 250;
    var paragraphs = document.querySelectorAll("#body_console p");
    for (var i = scrollbackLimit; i < paragraphs.length; i++) {
        paragraphs[i].parentNode.removeChild(paragraphs[i]);
    }
}


var currentTimeoutId = undefined;
var counter = 0;
function doStuff() {
    var delay = 5 + 2600 * Math.random() * Math.random() * Math.random() * Math.random();
    delay *= delayFactor;
    currentTimeoutId = setTimeout(function() {
        addLines(getRandomLines());
        counter++;
        if(counter % 20 == 0) {
            cullOldEntries();
        }
        doStuff();
    }, delay);
}

// When ready, go go go
document.addEventListener("DOMContentLoaded", function() {
    if(window.location.search.match("controls")) {
        document.getElementById("controls").style.display = "block";
    }
    doStuff();

    document.getElementById("turbo").addEventListener("click", function() {
        if(delayFactor < 1.0) {
            delayFactor = 1.0;
        } else {
            delayFactor = 0.00001;
        }
    });

    var lastLineCount = counter;
    var lastTime = Date.now();
    setInterval(function() {
        var currentTime = Date.now();
        var duration = currentTime - lastTime;
        var lps = (counter - lastLineCount) / (duration / 1000.0);
        document.getElementById("lps").textContent = "" + Math.round(lps) + " L/S";
        lastTime = currentTime;
        lastLineCount = counter;
    }, 3000);

    document.getElementById("play_pause").addEventListener("click", function () {
        if(typeof currentTimeoutId != "undefined") {
            clearTimeout(currentTimeoutId);
            currentTimeoutId = undefined;
        }
        else {
            doStuff();
        }
    });
});
