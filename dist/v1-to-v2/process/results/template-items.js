// local
import { processTemplateDir } from "./helpers.js";
// do the thing
function process(iD) {
    const { verbose } = iD.cliOptions;
    const { dirs, files } = iD;
    iD.resultMsgs = processTemplateDir(iD.resultMsgs, dirs.defaultLayout, verbose);
    iD.resultMsgs = processTemplateFile(iD.resultMsgs, files.defaultLayout, verbose);
    iD.resultMsgs = processTemplateFileWithHeading(iD.resultMsgs, files.rootReadme, verbose);
    iD.resultMsgs = processTemplateDir(iD.resultMsgs, dirs.internalResources, verbose);
    iD.resultMsgs = processTemplateDir(iD.resultMsgs, dirs.internalData, verbose);
    iD.resultMsgs = processTemplateFile(iD.resultMsgs, files.pklConfig, verbose);
    iD.resultMsgs = processTemplateFile(iD.resultMsgs, files.pklMicrolessons, verbose);
    iD.resultMsgs = processConfigJson(iD.resultMsgs, iD.module.meta);
    iD.resultMsgs = processTemplateFileWithHeading(iD.resultMsgs, files.videoHub, verbose);
    iD.resultMsgs = processTemplateFileWithHeading(iD.resultMsgs, files.releaseNotes, verbose);
    iD.resultMsgs = processTemplateFileWithHeading(iD.resultMsgs, files.instructorGuide, verbose);
    iD.resultMsgs = processTemplateDir(iD.resultMsgs, dirs.videoGuide, verbose);
    if (iD.module.meta.type === "lecture") {
        iD.resultMsgs = processTemplateDir(iD.resultMsgs, dirs.references, verbose);
        iD.resultMsgs = processTemplateFileWithHeading(iD.resultMsgs, files.references, verbose);
        iD.resultMsgs = processLevelUpDir(iD.resultMsgs, dirs.lvlUp, iD.module, verbose);
    }
    return iD.resultMsgs;
}
function processTemplateFile(msgs, file, verbose) {
    // const createdOrUpdated = file.isFound && file.didMoveOrCreate 
    //   ? "updated"
    //   : file.isFound && file.
    const templateFileNotFetchedMsg = `The ${file.displayName} file at ${file.desiredPath} could not be fetched from the remote template repo. 
    However, you opted to continue with the update. This file will require manual updates to complete work on it.`;
    const pklFileMsg = `The ${file.displayName} file at ${file.desiredPath} was`;
    if (file.didMoveOrCreate && !file.templateFileFetched) {
        msgs.failures.push(templateFileNotFetchedMsg);
    }
    return msgs;
}
function processTemplateFileWithHeading(msgs, file, verbose) {
    return msgs;
}
function processConfigJson(msgs, meta) {
    return msgs;
}
function processLevelUpDir(msgs, dir, module, verbose) {
    return msgs;
}
export { process };
