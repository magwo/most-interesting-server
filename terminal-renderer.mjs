import { formatLogPrefix } from "./util.mjs";
import { startServer } from "./main.mjs";
import { getRandomClass } from "./server.mjs";

var ANSI_RESET = "\x1b[0m";
var ANSI_REPLACE_LAST_LINE = "\x1b[1A\x1b[2K\r";
var lastLinePrefix;
var lastLineStyleClass;

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

export function addLines(lines) {
    var styleClass = getRandomClass(lines.length);
    for (var i = 0; i < lines.length; i++) {
        var text = lines[i].replace(/&nbsp/g, " ");
        lastLinePrefix = formatLogPrefix();
        lastLineStyleClass = styleClass;
        console.log(lastLinePrefix + " " + colorLineByClass(text, styleClass));
    }
}

export function replaceLastLine(text) {
    if(typeof lastLinePrefix == "undefined") {
        addLines([text]);
        return;
    }
    text = text.replace(/&nbsp/g, " ");
    process.stdout.write(
        ANSI_REPLACE_LAST_LINE
        + lastLinePrefix + " "
        + colorLineByClass(text, lastLineStyleClass)
        + "\n"
    );
}

function getDelayFactor() {
    return 1;
}

startServer(addLines, replaceLastLine, getDelayFactor);
