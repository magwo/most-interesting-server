
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


function getAsciiArt1() {
    return "   Here's a koala\n                    |       :     . |\n                    | '  :      '   |\n                    |  .  |   '  |  |\n          .--._ _...:.._ _.--. ,  ' |\n         (  ,  `        `  ,  )   . |\n          '-/              \\-'  |   |\n            |  o   /\\   o  |       :|\n            \\     _\\/_     / :  '   |\n            /'._   ^^   _.;___      |\n          /`    ````````      `\\=   |\n        /`                     /=  .|\n       ;             '--,-----'=    |\n       |                 `\\  |    . |\n       \\                   \\___ :   |\n       /'.                     `\\=  |\n       \\_/`--......_            /=  |\n                   |`-.        /= : |\n                   | : `-.__ /` .   |\n                   |jgs .   ` |    '|\n                   |  .  : `   . |  |".replace(/ /g, "&nbsp").split("\n");
}

function getAsciiArt2() {
    return "  The extremely rad unix walrus\n               ___\n            .-9 9 `\\\n          =(:(::)=  ;\n            ||||     \\\n            ||||      `-.\n           ,\\|\\|         `,\n          /                \\\n         ;                  `'---.,\n         |                         `\\\n         ;                     /     |\n         \\                    |      /\n  jgs     )           \\  __,.--\\    /\n       .-' \\,..._\\     \\`   .-'  .-'\n      `-=``       `:    |  /-/-/`\n                    `.__/".replace(/ /g, "&nbsp").split("\n");
}

function getRandomLines() {

    if(Math.random() < 0.0001) {
        // Time for a walrus!
        return getAsciiArt2();
    }
    if(Math.random() < 0.001) {
        // Time for a koala!
        return getAsciiArt1();
    }

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
    return [text];
}

function addLines(lines) {
    var styleClass = lines.length == 1 ? pickOne(classes) : classes[0];
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
        addLines(getRandomLines());
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

