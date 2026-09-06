import { formatLogPrefix } from "./util.mjs";
import { tick } from "./main.mjs";
import { getRandomClass } from "./server.mjs";

var ANSI_RESET = "\x1b[0m";

var classColors = {
    normal: "\x1b[37m",
    info: "\x1b[90m",
    warning: "\x1b[33m",
    error: "\x1b[31m",
    debug: "\x1b[35m",
};

function colorLine(text, color) {
    return color + text + ANSI_RESET;
}

function colorLineByClass(text, styleClass) {
    var color = classColors[styleClass];
    if (!color) {
        return text;
    }
    return colorLine(text, color);
}

function addLines(lines) {
    var styleClass = getRandomClass(lines.length);
    for (var i = 0; i < lines.length; i++) {
        var text = lines[i].replace(/&nbsp/g, " ");
        console.log(formatLogPrefix() + " " + colorLineByClass(text, styleClass));
    }
}

function getDelayFactor() {
    return 1;
}

tick(addLines, getDelayFactor);
