import { getRandomLines } from "./server.mjs";

var currentTimeoutId = undefined;

export function tick(addLines, delayFactor) {
    var delay = 5 + 2600 * Math.random() * Math.random() * Math.random() * Math.random();
    delay *= delayFactor();
    currentTimeoutId = setTimeout(function() {
        addLines(getRandomLines());
        tick(addLines, delayFactor);
    }, delay);
}

export function pause() {
    if(typeof currentTimeoutId != "undefined") {
        clearTimeout(currentTimeoutId);
        currentTimeoutId = undefined;
    }
}

export function isRunning() {
    return typeof currentTimeoutId != "undefined";
}
