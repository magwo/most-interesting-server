export var serverName = "mis-01";

function pad2(n) {
    return (n < 10 ? "0" : "") + n;
}

function formatHms(date) {
    return pad2(date.getHours()) + ":" + pad2(date.getMinutes()) + ":" + pad2(date.getSeconds());
}

function formatUtcHm(date) {
    return pad2(date.getUTCHours()) + ":" + pad2(date.getUTCMinutes());
}

export function formatLogPrefix() {
    var now = new Date();
    return "[" + formatHms(now) + " " + serverName + " (UTC " + formatUtcHm(now) + ")]";
}
