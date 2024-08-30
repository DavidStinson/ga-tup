// node
import { readdir } from "fs/promises";
// local
import { getData as getFileData } from "./file-details.js";
import { getData as getFilesData } from "./files-details.js";
import { getData as getIfFilesExist } from "./files-exists.js";
import { getData as getDirs, getLevelUpMicrolessonDirData } from "./dirs.js";
import { getData as getModule } from "./module.js";
// config
import { config } from "../../config.js";
const { path } = config;
// do the thing
async function collect(iD) {
    iD.files.rootReadme = await getFileData(iD.files.rootReadme);
    iD.files.defaultLayout = await getFileData(iD.files.defaultLayout);
    iD.assets.rootAssets = await getIfFilesExist(path.rootAssets);
    iD.module = getModule(iD.module);
    iD.dirs = await getDirs(iD.dirs, iD.module);
    const mlAssetCandidates = getMicrolessonAssetPaths(iD.dirs.microlessons);
    iD.assets.microlessonAssets = await getIfFilesExist(mlAssetCandidates);
    if (iD.dirs.internalResources.isFound) {
        iD.files.videoHub = await getFileData(iD.files.videoHub);
        iD.files.releaseNotes = await getFileData(iD.files.releaseNotes);
        iD.files.instructorGuide = await getFileData(iD.files.instructorGuide);
        iD.assets.miscAssets.push(...(await getIfFilesExist(path.internalResourcesAssets)));
    }
    if (iD.dirs.references.isFound) {
        iD.files.references = await getFileData(iD.files.references);
        iD.assets.miscAssets.push(...(await getIfFilesExist(path.referencesAssets)));
    }
    if (iD.dirs.canvasLandingPages.isFound) {
        const canvasLandingPagesPaths = await getFilePathsOfDirChildren("./canvas-landing-pages");
        iD.files.canvasLandingPages = await getFilesData(canvasLandingPagesPaths);
    }
    if (iD.dirs.microlessons.length) {
        const mlPagesPaths = getMicrolessonReadmePaths(iD.dirs.microlessons);
        iD.files.microlessons = await getFilesData(mlPagesPaths);
    }
    if (iD.dirs.levelUp.isFound) {
        const levelUpDirPath = config.staticDir.levelUp.path;
        const levelUpFilesPaths = await getFilePathsOfDirChildren(levelUpDirPath);
        iD.files.levelUpMicrolessons = await getFilesData(levelUpFilesPaths);
        // We only need to check to see if we can make microlesson dirs for level 
        // up microlessons if the level up dir holds more than just a README.md
        // file.
        const levelUpDirOnlyHoldsReadmeFile = levelUpFilesPaths.length <= 1 && levelUpFilesPaths.includes("README.md");
        const isLecture = iD.module.type === "lectureTemplateUrl";
        if (!levelUpDirOnlyHoldsReadmeFile && isLecture) {
            iD.dirs.levelUpMicrolessons = await getLevelUpMicrolessonDirData(iD.files.levelUpMicrolessons);
        }
    }
    return iD;
}
function getMicrolessonReadmePaths(mls) {
    return mls.map((ml) => `./${ml.dirName}/README.md`);
}
function getMicrolessonAssetPaths(mls) {
    const mlAssetCandidates = [];
    mls.forEach((ml) => {
        mlAssetCandidates.push(`./${ml.dirName}/assets/hero.png`);
        mlAssetCandidates.push(`./${ml.dirName}/assets/originals/hero.eps`);
    });
    return mlAssetCandidates;
}
async function getFilePathsOfDirChildren(dirPath) {
    return (await readdir(dirPath, { withFileTypes: true }))
        .filter((item) => !item.isDirectory())
        .map((item) => `${dirPath}/${item.name}`);
}
export { collect };
