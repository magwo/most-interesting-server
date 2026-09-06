import { comments, getRandomLines } from "./server.mjs";

var currentRun = undefined;

function wait(millis) {
    return new Promise(function(resolve) {
        setTimeout(resolve, millis);
    });
}

async function addDotsOverTime(lastLine, replaceLastLine) {
    var dotCount = 2 + Math.random() * Math.random() * 31;
    const speed = 0.5 + 1.0 * Math.random();
    for(var i = 0; i < dotCount; i++) {
        await wait(10 + 600 * speed * Math.random() * Math.random());
        lastLine += ".";
        replaceLastLine(lastLine);
    }
    lastLine += " " + comments[Math.floor(Math.random() * comments.length)];
    replaceLastLine(lastLine);
    await wait(200);
}

async function addSpinnerOverTime(lastLine, replaceLastLine) {
    const frames = ["|", "/", "-", "\\"];
    const frameCount = 12 + Math.floor(Math.random() * 20);
    for(var i = 0; i < frameCount; i++) {
        await wait(100);
        replaceLastLine(lastLine + " " + frames[i % frames.length]);
    }
    await wait(200);
    replaceLastLine(lastLine);
}

async function addProgressBarOverTime(lastLine, replaceLastLine) {
    const progressBarLength = 12 + Math.random() * 10;
    const speed = 0.5 + 2.0 * Math.random();
    for(var i = 0; i <= progressBarLength; i++) {
        await wait(10 + 600 * speed * Math.random() * Math.random());
        var progress = "=".repeat(i).padEnd(progressBarLength, " ");
        replaceLastLine(lastLine + " [" + progress + "]");
    }
    await wait(200);
}

export async function startServer(addLines, replaceLastLine, delayFactor) {
    var run = Symbol();
    currentRun = run;

    while(currentRun === run) {
        var delay = 5 + 2600 * Math.random() * Math.random() * Math.random() * Math.random();
        delay *= delayFactor();
        await wait(delay);
        if(currentRun !== run) {
            break;
        }
        var lines = getRandomLines();
        var lastLine = lines[lines.length - 1];
        addLines(lines);
        var animation = Math.random();
        if(animation < 0.02) {
            await addDotsOverTime(lastLine, replaceLastLine);
        }
        else if(animation < 0.04) {
            await addSpinnerOverTime(lastLine, replaceLastLine);
        }
        else if(animation < 0.06) {
            await addProgressBarOverTime(lastLine, replaceLastLine);
        }
    }
}

export function pause() {
    currentRun = undefined;
}

export function isRunning() {
    return typeof currentRun != "undefined";
}
