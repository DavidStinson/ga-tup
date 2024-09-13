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
    iD.resultMsgs = processPklFile(iD.resultMsgs, files.pklConfig, files, verbose);
    iD.resultMsgs = processPklFile(iD.resultMsgs, files.pklMicrolessons, files, verbose);
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
    const templateFileNotFetchedMsg = `The ${file.displayName} file at ${file.curPath} could not be fetched from the remote template repo. 
    However, you opted to continue with the update. No work was done on this file, and you will need to create or update the file manually.`;
    const foundAndUpdatedMsg = `The ${file.displayName} file at ${file.desiredPath} was fully updated and no additional work is required.`;
    const foundButNotUpdated = `The ${file.displayName} file at ${file.desiredPath} was found but could not be updated. 
    You will need to update the file manually.`;
    const shouldButCanNotCreateMsg = `The ${file.displayName} file at ${file.desiredPath} can not be created automatically.
    You will need to create the file manually.`;
    const shouldButDidNotCreateMsg = `Something went wrong creating the ${file.displayName} file at ${file.desiredPath}.
    You will need to create the file manually.`;
    const shouldAndDidCreateMsg = `The ${file.displayName} file at ${file.desiredPath} was created and no additional work is required.`;
    const notFoundAndShouldNotCreateMsg = `The ${file.displayName} file at ${file.desiredPath} was not found and you opted not to create it.
    You will need to create the file manually.`;
    const somethingWentWrongMsg = `Something went wrong while working on the ${file.displayName} file.
    You will need to create or update the file manually.`;
    if (!file.templateFileFetched) {
        msgs.failures.push(templateFileNotFetchedMsg);
    }
    else if (file.isFound && !file.didUpdateInPlace) {
        msgs.failures.push(foundButNotUpdated);
    }
    else if (file.isFound && file.didUpdateInPlace) {
        msgs.successes.push(foundAndUpdatedMsg);
    }
    else if (file.shouldCreate && !file.canMoveOrCreate) {
        msgs.failures.push(shouldButCanNotCreateMsg);
    }
    else if (file.shouldCreate && !file.didMoveOrCreate) {
        msgs.failures.push(shouldButDidNotCreateMsg);
    }
    else if (file.shouldCreate && file.didMoveOrCreate) {
        msgs.successes.push(shouldAndDidCreateMsg);
    }
    else if (!file.isFound && !file.shouldCreate) {
        msgs.failures.push(notFoundAndShouldNotCreateMsg);
    }
    else {
        msgs.failures.push(somethingWentWrongMsg);
    }
    return msgs;
}
function processPklFile(msgs, file, files, verbose) {
    const unorderedMls = files.mls.filter(ml => (ml.deliveryOrder === -1));
    const unorderedLvlUpMls = files.lvlUpMls.filter(ml => (ml.deliveryOrder === -1));
    const allUnorderedMls = [...unorderedMls, ...unorderedLvlUpMls];
    const anyUnorderedMls = allUnorderedMls.length > 0;
    const templateFileNotFetchedMsg = `The ${file.displayName} file at ${file.curPath} could not be fetched from the remote template repo. 
  However, you opted to continue with the update. No work was done on this file, and you will need to create or update the file manually.`;
    const foundButNotUpdated = `The ${file.displayName} file at ${file.desiredPath} was found but could not be updated. 
    You will need to update the file manually.`;
    const foundAndUpdatedMsg = `The ${file.displayName} file at ${file.desiredPath} was fully updated and no additional work is required.`;
    const foundAndUpdatedWithUnorderedMlsMsg = `The ${file.displayName} file at ${file.desiredPath} was fully updated but some microlessons are not in the correct order.
    You will need to update the file manually.`;
    const shouldButCanNotCreateMsg = `The ${file.displayName} file at ${file.desiredPath} can not be created automatically.
    You will need to create the file manually.`;
    const shouldButDidNotCreateMsg = `Something went wrong creating the ${file.displayName} file at ${file.desiredPath}.
    You will need to create the file manually.`;
    const shouldAndDidCreateMsg = `The ${file.displayName} file at ${file.desiredPath} was created and no additional work is required.`;
    const shouldAndDidCreateWithUnorderedMlsMsg = `The ${file.displayName} file at ${file.desiredPath} was created but some microlessons are not in the correct order.
    You will need to update the file manually.`;
    const notFoundAndShouldNotCreateMsg = `The ${file.displayName} file at ${file.desiredPath} was not found and you opted not to create it.
    You will need to create the file manually.`;
    const somethingWentWrongMsg = `Something went wrong while working on the ${file.displayName} file.
    You will need to create or update the file manually.`;
    if (!file.templateFileFetched) {
        msgs.failures.push(templateFileNotFetchedMsg);
    }
    else if (file.isFound && !file.didUpdateInPlace) {
        msgs.failures.push(foundButNotUpdated);
    }
    else if (file.isFound &&
        file.didUpdateInPlace &&
        (file.type === "PklFile" && !anyUnorderedMls)) {
        msgs.successes.push(foundAndUpdatedMsg);
    }
    else if (file.isFound &&
        file.didUpdateInPlace &&
        (file.type === "PklFile" && anyUnorderedMls)) {
        msgs.warnings.push(foundAndUpdatedWithUnorderedMlsMsg);
    }
    else if (file.shouldCreate && !file.canMoveOrCreate) {
        msgs.failures.push(shouldButCanNotCreateMsg);
    }
    else if (file.shouldCreate && !file.didMoveOrCreate) {
        msgs.failures.push(shouldButDidNotCreateMsg);
    }
    else if (file.shouldCreate &&
        file.didMoveOrCreate &&
        (file.type === "PklFile" && !anyUnorderedMls)) {
        msgs.successes.push(shouldAndDidCreateMsg);
    }
    else if (file.shouldCreate &&
        file.didMoveOrCreate &&
        (file.type === "PklFile" && anyUnorderedMls)) {
        msgs.warnings.push(shouldAndDidCreateWithUnorderedMlsMsg);
    }
    else if (!file.isFound && !file.shouldCreate) {
        msgs.failures.push(notFoundAndShouldNotCreateMsg);
    }
    else {
        msgs.failures.push(somethingWentWrongMsg);
    }
    return msgs;
}
function processTemplateFileWithHeading(msgs, file, verbose) {
    const templateFileNotFetchedMsg = `The ${file.displayName} file at ${file.curPath} could not be fetched from the remote template repo. 
  However, you opted to continue with the update. No work was done on this file, and you will need to create or update the file manually.`;
    const foundButNotUpdated = `The ${file.displayName} file at ${file.desiredPath} was found but could not be updated. 
    You will need to update the file manually.`;
    const foundAndUpdatedMsg = `The ${file.displayName} file at ${file.desiredPath} was fully updated and no additional work is required.`;
    const foundAndUpdatedWithBadHeadingMsg = `The ${file.displayName} file at ${file.desiredPath} was fully updated but the heading is incorrect.
    You will need to update the file manually.`;
    const shouldButCanNotCreateMsg = `The ${file.displayName} file at ${file.desiredPath} can not be created automatically.
    You will need to create the file manually.`;
    const shouldButDidNotCreateMsg = `Something went wrong creating the ${file.displayName} file at ${file.desiredPath}.
    You will need to create the file manually.`;
    const shouldAndDidCreateMsg = `The ${file.displayName} file at ${file.desiredPath} was created and no additional work is required.`;
    const shouldAndDidCreateWithBadHeadingMsg = `The ${file.displayName} file at ${file.desiredPath} was created but the heading is incorrect.
    You will need to update the file manually.`;
    const notFoundAndShouldNotCreateMsg = `The ${file.displayName} file at ${file.desiredPath} was not found and you opted not to create it.
    You will need to create the file manually.`;
    const somethingWentWrongMsg = `Something went wrong while working on the ${file.displayName} file.
    You will need to create or update the file manually.`;
    if (!file.templateFileFetched) {
        msgs.failures.push(templateFileNotFetchedMsg);
    }
    else if (file.isFound && !file.didUpdateInPlace) {
        msgs.failures.push(foundButNotUpdated);
    }
    else if (file.isFound &&
        file.didUpdateInPlace &&
        ((file.type === "TemplateFileWithHeading" ||
            file.type === "TemplateFileWithLandingHeading") && file.didUpdateHeading)) {
        msgs.successes.push(foundAndUpdatedMsg);
    }
    else if (file.isFound &&
        file.didUpdateInPlace &&
        ((file.type === "TemplateFileWithHeading" || file.type === "TemplateFileWithLandingHeading") && !file.didUpdateHeading)) {
        msgs.warnings.push(foundAndUpdatedWithBadHeadingMsg);
    }
    else if (file.shouldCreate && !file.canMoveOrCreate) {
        msgs.failures.push(shouldButCanNotCreateMsg);
    }
    else if (file.shouldCreate && !file.didMoveOrCreate) {
        msgs.failures.push(shouldButDidNotCreateMsg);
    }
    else if (file.shouldCreate && file.didMoveOrCreate && file.didUpdateHeading) {
        msgs.successes.push(shouldAndDidCreateMsg);
    }
    else if (file.shouldCreate && file.didMoveOrCreate && !file.didUpdateHeading) {
        msgs.warnings.push(shouldAndDidCreateWithBadHeadingMsg);
    }
    else if (!file.isFound && !file.shouldCreate) {
        msgs.failures.push(notFoundAndShouldNotCreateMsg);
    }
    else {
        msgs.failures.push(somethingWentWrongMsg);
    }
    return msgs;
}
function processConfigJson(msgs, meta) {
    return msgs;
}
function processLevelUpDir(msgs, dir, module, verbose) {
    return msgs;
}
export { process };
