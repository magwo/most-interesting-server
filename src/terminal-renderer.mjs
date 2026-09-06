import { formatLogPrefix } from "./util.mjs";
import { tick } from "./main.mjs";

function addLines(lines) {
    for (var i = 0; i < lines.length; i++) {
        var text = lines[i].replace(/&nbsp/g, " ");
        console.log(formatLogPrefix() + " " + text);
    }
}

function getDelayFactor() {
    return 1;
}

tick(addLines, getDelayFactor);
