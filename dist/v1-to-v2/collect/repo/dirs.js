// node
import { readdir, stat } from "fs/promises";
import path from "path";
// npm
import { titleCase } from "title-case";
import { camelCase } from "change-case";
// local
import { fixCommonWords } from "./helpers.js";
// config
import { config } from "../../config.js";
// do the thing
async function getData(dirs, module) {
    const { defaultLayout, canvasLandingPages, internalResources, references, levelUp, } = dirs;
    const foundDirs = await getDirs();
    dirs.microlessons = getMicrolessonDirData(foundDirs, module);
    dirs.videoGuide.isFound = await findVideoGuide(foundDirs, dirs);
    dirs.levelUp.isFound = foundDirs.includes(levelUp.dirName);
    dirs.defaultLayout.isFound = foundDirs.includes(defaultLayout.dirName);
    dirs.canvasLandingPages.isFound = foundDirs.includes(canvasLandingPages.dirName);
    dirs.internalResources.isFound = foundDirs.includes(internalResources.dirName);
    dirs.references.isFound = foundDirs.includes(references.dirName);
    return dirs;
}
async function getDirs() {
    const dirs = await readdir(".", { withFileTypes: true });
    return dirs.filter((dir) => dir.isDirectory()).map((dir) => dir.name);
}
function getMicrolessonDirData(foundDirs, module) {
    const microlessonsDirs = filterStaticDirs(foundDirs, module);
    return microlessonsDirs.map((dir) => {
        const noDashName = titleCase(dir).replaceAll("-", " ");
        const fixedTitleCase = fixCommonWords(noDashName);
        return {
            type: "directory",
            isFound: true,
            path: `./${dir}`,
            dirName: dir,
            dirNameTitleCase: fixedTitleCase,
            dirNameCamelCase: camelCase(dir),
            isMigrated: false,
        };
    });
}
async function findVideoGuide(foundDirs, dirs) {
    if (!foundDirs.includes(dirs.internalResources.dirName))
        return false;
    try {
        await stat(dirs.videoGuide.path);
        return true;
    }
    catch (error) {
        return false;
    }
}
function filterStaticDirs(dirList, module) {
    if (module.meta.type === "lecture") {
        return dirList.filter((dir) => !config.lectureStaticDirs.includes(dir));
    }
    else {
        return dirList.filter((dir) => !config.labStaticDirs.includes(dir));
    }
}
async function getLevelUpMicrolessonDirData(files) {
    const foundDirs = await getDirs();
    return files.map((ml) => {
        const fileName = path.parse(ml.path).name;
        const noDashName = titleCase(fileName).replaceAll("-", " ");
        const fixedTitleCase = fixCommonWords(noDashName);
        // If isFound is true, there is already a dir with the name of a level up
        // microlesson in the repo so we'd have a conflict if we tried to create
        // a new dir for that microlesson.
        const isFound = foundDirs.includes(fileName);
        return {
            type: "directory",
            isFound: isFound,
            path: `./${fileName}`,
            dirName: fileName,
            dirNameTitleCase: fixedTitleCase,
            dirNameCamelCase: camelCase(fileName),
            isMigrated: false,
        };
    });
}
export { getData, getLevelUpMicrolessonDirData };
