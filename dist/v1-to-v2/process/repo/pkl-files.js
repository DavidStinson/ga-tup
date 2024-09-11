// do the thing
function process(iD) {
    iD.repoMsgs = processPklFile(iD.repoMsgs, iD.files.pklConfig);
    iD.repoMsgs = processPklFile(iD.repoMsgs, iD.files.pklMicrolessons);
    return iD.repoMsgs;
}
function processPklFile(msgs, file) {
    const foundMsg = `The ${file.curPath} file was found but will be replaced as part of the update. 
   It will require further manual updates.`;
    const notFoundMsg = `The ${file.desiredPath} file was not found. 
   It will be created, but need some manual updates.`;
    if (file.isFound) {
        msgs.successes.push(foundMsg);
    }
    else {
        msgs.successes.push(notFoundMsg);
    }
    return msgs;
}
export { process };
