// local
import { checkGoodItem, checkBadItem, checkFileWithHeaders, checkCanvasLandingPages, checkMicrolessons, checkAssets, checkLevelUpDirs, } from "./checks.js";
// do the thing
function process(iD) {
    const isLectureModule = iD.module.type === "lectureTemplateUrl";
    iD.repoMsgs = checkGoodItem(iD.repoMsgs, iD.dirs.defaultLayout);
    iD.repoMsgs = checkGoodItem(iD.repoMsgs, iD.files.defaultLayout);
    iD.repoMsgs = checkGoodItem(iD.repoMsgs, iD.dirs.canvasLandingPages);
    iD.repoMsgs = checkCanvasLandingPages(iD.repoMsgs, iD.files.canvasLandingPages);
    iD.repoMsgs = checkGoodItem(iD.repoMsgs, iD.dirs.internalResources);
    iD.repoMsgs = checkGoodItem(iD.repoMsgs, iD.files.videoHub);
    if (iD.files.videoHub.isFound) {
        iD.repoMsgs = checkFileWithHeaders(iD.repoMsgs, iD.files.videoHub);
    }
    iD.repoMsgs = checkGoodItem(iD.repoMsgs, iD.files.releaseNotes);
    if (iD.files.releaseNotes.isFound) {
        iD.repoMsgs = checkFileWithHeaders(iD.repoMsgs, iD.files.releaseNotes);
    }
    iD.repoMsgs = checkGoodItem(iD.repoMsgs, iD.files.instructorGuide);
    if (iD.files.instructorGuide.isFound) {
        iD.repoMsgs = checkFileWithHeaders(iD.repoMsgs, iD.files.instructorGuide);
    }
    iD.repoMsgs = checkBadItem(iD.repoMsgs, iD.dirs.videoGuide);
    if (isLectureModule) {
        iD.repoMsgs = checkGoodItem(iD.repoMsgs, iD.dirs.references);
        iD.repoMsgs = checkGoodItem(iD.repoMsgs, iD.files.references);
        if (iD.files.references.isFound) {
            iD.repoMsgs = checkFileWithHeaders(iD.repoMsgs, iD.files.references);
        }
    }
    if (isLectureModule) {
        iD.repoMsgs = checkBadItem(iD.repoMsgs, iD.dirs.levelUp);
    }
    iD.repoMsgs = checkGoodItem(iD.repoMsgs, iD.files.rootReadme);
    if (iD.files.rootReadme.isFound) {
        iD.repoMsgs = checkFileWithHeaders(iD.repoMsgs, iD.files.rootReadme);
    }
    iD.repoMsgs = checkMicrolessons(iD.repoMsgs, iD.files.microlessons, false);
    iD.repoMsgs = checkAssets(iD.repoMsgs, iD.assets);
    if (iD.dirs.levelUpMicrolessons.length && isLectureModule) {
        iD.repoMsgs = checkMicrolessons(iD.repoMsgs, iD.files.levelUpMicrolessons, true);
        iD.repoMsgs = checkLevelUpDirs(iD.repoMsgs, iD.dirs.levelUpMicrolessons);
    }
    return iD;
}
export { process };
