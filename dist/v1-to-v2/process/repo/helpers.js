// do the thing
function processGoodItem(msgs, item) {
    const foundMsg = `The ${item.curPath} ${item.majorType.toLowerCase()} was found.`;
    const fileNotFoundMsg = `The ${item.desiredPath} file was not found. 
   It will be created, but need to be manually updated.`;
    const fileNotFoundCannotCreateMsg = `The ${item.desiredPath} file was not found and cannot be created automatically.
    It will need to be manually created with the necessary content.`;
    const dirNotFoundMsg = `The ${item.desiredPath} directory was not found. It will be created.`;
    const dirNotFoundCannotCreateMsg = `The ${item.desiredPath} directory was not found and cannot be created automatically.
    It will need to be manually created with the necessary content.`;
    if (item.isFound) {
        msgs.successes.push(foundMsg);
    }
    else if (item.majorType === "File" && item.shouldCreate && item.canMoveOrCreate) {
        msgs.successes.push(fileNotFoundMsg);
    }
    else if (item.majorType === "File" && item.shouldCreate && !item.canMoveOrCreate) {
        msgs.failures.push(fileNotFoundCannotCreateMsg);
    }
    else if (item.majorType === "Directory" && item.shouldCreate && item.canCreate) {
        msgs.successes.push(dirNotFoundMsg);
    }
    else if (item.majorType === "Directory" && item.shouldCreate && !item.canCreate) {
        msgs.failures.push(dirNotFoundCannotCreateMsg);
    }
    return msgs;
}
function processBadItem(msgs, item) {
    const foundMsg = `The ${item.curPath} ${item.majorType.toLowerCase()} was found and will need to be manually migrated.`;
    const notFoundMsg = `The ${item.desiredPath} ${item.majorType.toLowerCase()} was not found. 
   No further action is required.`;
    if (item.isFound) {
        msgs.failures.push(foundMsg);
    }
    else {
        msgs.successes.push(notFoundMsg);
    }
    return msgs;
}
function processFileWithHeading(msgs, file, verbose) {
    const canUpdateMsg = `The ${file.curPath} file's h1 heading can be updated.`;
    const cannotUpdateMsg = `The ${file.curPath} file's h1 heading cannot be updated automatically.
    Its h1 heading will need to be manually updated.`;
    if (file.canUpdateHeading && verbose) {
        msgs.successes.push(canUpdateMsg);
    }
    else if (!file.canUpdateHeading) {
        msgs.failures.push(cannotUpdateMsg);
    }
    return msgs;
}
export { processGoodItem, processBadItem, processFileWithHeading, };
