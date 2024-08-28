// local
import { check as goodItemFound, checkInverse as badItemFound, checkFileWithHeaders, checkCanvasLandingPages, checkMicrolessons, checkAssets, } from "./checks.js";
// do the thing
async function process(iD) {
    iD.localMsgs = goodItemFound(iD.localMsgs, iD.dirs.defaultLayout);
    iD.localMsgs = goodItemFound(iD.localMsgs, iD.files.defaultLayout);
    iD.localMsgs = goodItemFound(iD.localMsgs, iD.dirs.canvasLandingPages);
    iD.localMsgs = checkCanvasLandingPages(iD.localMsgs, iD.files.canvasLandingPages);
    iD.localMsgs = goodItemFound(iD.localMsgs, iD.dirs.internalResources);
    iD.localMsgs = goodItemFound(iD.localMsgs, iD.files.videoHub);
    if (iD.files.videoHub.isFound) {
        iD.localMsgs = checkFileWithHeaders(iD.localMsgs, iD.files.videoHub);
    }
    iD.localMsgs = goodItemFound(iD.localMsgs, iD.files.releaseNotes);
    if (iD.files.releaseNotes.isFound) {
        iD.localMsgs = checkFileWithHeaders(iD.localMsgs, iD.files.releaseNotes);
    }
    iD.localMsgs = goodItemFound(iD.localMsgs, iD.files.instructorGuide);
    if (iD.files.instructorGuide.isFound) {
        iD.localMsgs = checkFileWithHeaders(iD.localMsgs, iD.files.instructorGuide);
    }
    iD.localMsgs = badItemFound(iD.localMsgs, iD.dirs.videoGuide);
    iD.localMsgs = goodItemFound(iD.localMsgs, iD.dirs.references);
    iD.localMsgs = goodItemFound(iD.localMsgs, iD.files.references);
    if (iD.files.references.isFound) {
        iD.localMsgs = checkFileWithHeaders(iD.localMsgs, iD.files.references);
    }
    iD.localMsgs = badItemFound(iD.localMsgs, iD.dirs.levelUp);
    iD.localMsgs = goodItemFound(iD.localMsgs, iD.files.rootReadme);
    if (iD.files.rootReadme.isFound) {
        iD.localMsgs = checkFileWithHeaders(iD.localMsgs, iD.files.rootReadme);
    }
    iD.localMsgs = checkMicrolessons(iD.localMsgs, iD.files.microlessons);
    iD.localMsgs = checkAssets(iD.localMsgs, iD.assets);
    return iD;
}
export { process };
