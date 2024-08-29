// do the thing
function process(iD) {
    iD.envMsgs = pklFound(iD.envMsgs, iD.env.isPklInstalled);
    return iD;
}
function pklFound(msgs, isPklInstalled) {
    if (isPklInstalled) {
        msgs.successes.push("Pkl is installed. A config.json file will be created with a fallback course. All other courses will need to be manually migrated.");
    }
    else {
        msgs.failures.push("Pkl is not installed. A config.json file will not be created for this module.");
    }
    return msgs;
}
export { process };
