import { getRandomClass } from "./server.mjs";
import { formatLogPrefix } from "./util.mjs";
import { tick, pause, isRunning } from "./main.mjs";

var delayFactor = 1.0;
var counter = 0;

export function addLines(lines) {
    var styleClass = getRandomClass(lines.length);
    var consoleEl = document.getElementById("body_console");
    for (var i = 0; i < lines.length; i++) {
        var text = lines[i];
        var newElem = document.createElement("p");
        var textElem = document.createElement("span");
        textElem.innerHTML = " " + text;
        textElem.className = styleClass;
        var timestampElem = document.createElement("span");
        timestampElem.textContent = formatLogPrefix();
        newElem.appendChild(timestampElem);
        newElem.appendChild(textElem);
        consoleEl.insertBefore(newElem, consoleEl.firstChild);
    }
    counter++;
    if(counter % 20 == 0) {
        cullOldEntries();
    }
}

export function cullOldEntries() {
    var scrollbackLimit = 250;
    var paragraphs = document.querySelectorAll("#body_console p");
    for (var i = scrollbackLimit; i < paragraphs.length; i++) {
        paragraphs[i].parentNode.removeChild(paragraphs[i]);
    }
}

function getDelayFactor() {
    return delayFactor;
}

document.addEventListener("DOMContentLoaded", function() {
    if(window.location.search.match("controls")) {
        document.getElementById("controls").style.display = "block";
    }

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
        if(isRunning()) {
            pause();
        }
        else {
            tick(addLines, getDelayFactor);
        }
    });

    tick(addLines, getDelayFactor);
});
