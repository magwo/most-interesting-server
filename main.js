
var nouns = [
    "remote",
    "expansion module",
    "user",
    "root",
    "cache subsystem",
    "SMP architecture",
    "network",
    "system",
    "controller",
    "HDD",
    "journaling file system",
    "external traffic router",
    "packet transporter",
    "parser subsystem",
    "daemon monitor",
    "process tasker",
    "all devices",
    "all modules",
    "thread decoupler",
];

var failed_pre = [
    "crashed while",
    "got STOP signal when",
    "could not read settings while",
    "unable to access configuration for",
    "encountered a configuration error when",
];

var actions = [
    "rebooting",
    "warming up",
    "initializing",
    "reverting",
    "triangulating",
    "enhancing",
    "mounting",
    "caching",
    "re-hashing",
    "un-mounting",
];

var comments = [
    "[REGISTERED]",
    "[JOURNALED]",
    "[UNJOURNALED]",
    "[NOT CONFIGURED]",
    "[OK]",
    "[FAILED]",
];

var classes = [
    "normal",
    "normal",
    "normal",
    "normal",
    "normal",
    "normal",
    "normal",
    "normal",
    "normal",
    "normal",
    "normal",
    "normal",
    "normal",
    "info",
    "info",
    "info",
    "warning",
    "error",
    "debug",
];


var delayFactor = 1.0;

function pickOne(arr, forbidden) {
    var item = arr[Math.floor(Math.random()*arr.length)];
    if(item == forbidden) {
        return pickOne(arr, forbidden);
    }
    return item;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function padToLength(str, character, length) {
    var padding = "";
    if(str.length < length) {
        var numCharsPad = length - str.length;
        var padding = new Array(numCharsPad).join(character);
    }
    return str + padding;
}


function getRandomLine() {
    var firstNoun = pickOne(nouns);
    var text = capitalize(firstNoun);
    if(Math.random() > 0.85) {
        text += " " + pickOne(failed_pre);
    }
    text += " " + pickOne(actions);
    if(Math.random() > 0.4) {
        text += " " + pickOne(nouns, firstNoun);
    }
    if(Math.random() > 0.95) {
        text = padToLength(text, ".", 80);
        text += pickOne(comments);
    }
    return text;
}

function addLine(text) {
    var newElem = $("<p></p>");
    var textElem = $("<span> " + text + "</span>");
    textElem.addClass(pickOne(classes));
    var serverName = "most-interesting.server"
    newElem.append("<span>[" + moment().format("HH:mm:ss") + " " + serverName + " (UTC " + moment.utc().format("HH:mm") + ")]</span>");
    newElem.append(textElem);
    $("#body_console").prepend(newElem);
}


function cullOldEntries() {
    var scrollbackLimit = 150;
    var removalCounter = 0;
    $("#body_console p").slice(scrollbackLimit).remove();
}


var currentTimeoutId = undefined;
var counter = 0;
function doStuff() {
    var delay = 5 + 2600 * Math.random() * Math.random() * Math.random() * Math.random();
    delay *= delayFactor;
    currentTimeoutId = setTimeout(function() {
        addLine(getRandomLine());
        counter++;
        if(counter % 100 == 0) {
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

