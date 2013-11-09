
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
    "parsing subsystem",
    "all devices",
    "all modules",
];

var failed_pre = [
    "crashed while",
    "got STOP signal when",
    "could not read settings while",
    "unable to access configuration for",
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
    if(Math.random() > 0.9) {
        text += " " + pickOne(failed_pre);
    }
    text += " " + pickOne(actions);
    if(Math.random() > 0.5) {
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
    newElem.append("<span class='timestamp'>[" + moment().format("HH:mm:ss") + " (UTC " + moment.utc().format("HH:mm") + "]</span>");
    newElem.append(textElem);
    $("#body_console").append(newElem);
}


function cullOldEntries() {
    var consoleHeight = $("#body_console").innerHeight();
    var lineHeight = $("#body_console p").first().height();
    var removalCounter = 0;
    $("#body_console p").each(function() {
        if($(this).position().top + lineHeight > consoleHeight) {
            removalCounter++;
        }
    });
    $("#body_console p").slice(0, removalCounter).remove();
}

var shouldPlay = true;
var currentTimeoutId = undefined;
function doStuff() {
    if(shouldPlay) {
        var delay = 30 + 2400 * Math.random() * Math.random() * Math.random() * Math.random();
        currentTimeoutId = setTimeout(function() {
            addLine(getRandomLine());
            cullOldEntries();
            doStuff();
        }, delay);
    }
}

// When ready, go go go
$(function() {
    if(window.location.search.match("controls")) {
        $("#controls").show();
    }
    doStuff();

    $("#controls #play_pause").click(function () {
        if(shouldPlay) {
            if(typeof currentTimeoutId != "undefined") {
                clearTimeout(currentTimeoutId);
                currentTimeoutId = undefined;
            }
            shouldPlay = false;
        } else {
            shouldPlay = true;
            doStuff();
        }
    });
})

