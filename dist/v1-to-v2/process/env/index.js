// do the thing
function process(iD) {
    iD.envMsgs = pklFound(iD.envMsgs, iD.env.isPklInstalled);
    return iD;
}
function pklFound(msgs, isPklInstalled) {
    const pklInstalledMsg = `Pkl is installed. A config.json file will be created with a fallback course.
   All other courses will need to be manually created.`;
    const pklNotInstalledMsg = `Pkl is not installed. A config.json file will not be created for this module. 
    A config.json file should be created manually after pkl is installed.`;
    if (isPklInstalled) {
        msgs.successes.push(pklInstalledMsg);
    }
    else {
        msgs.failures.push(pklNotInstalledMsg);
    }
    return msgs;
}
export { process };
