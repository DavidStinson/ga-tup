// node
import path from "node:path";
// local
import { getDirs } from "../helpers.js";
import { getLvlUpFilePaths } from "../file/lvl-up.js";
import { makeTitleCase, checkForTemplateAssetItems, getFilesThatExist } from "../helpers.js";
// types
import { LvlUpMlDir } from "../../../types.js";
// do the thing
async function getData(iD) {
    // If there is no level-up dir, we don't need to do any of this.
    if (iD.dirs.lvlUp.curPath !== iD.dirs.lvlUp.desiredPath) {
        return iD.dirs;
    }
    const lvlUpFilePaths = await getLvlUpFilePaths(iD);
    const validLvlUpMlFilePaths = lvlUpFilePaths.filter((filepath) => (path.extname(filepath) === ".md"));
    // We only need to check to see if we can make microlesson dirs for Level 
    // Up microlessons if the level-up dir holds more than just a README.md
    // file.
    if (checkNeedToMakeLvlUpMlDirs(iD, validLvlUpMlFilePaths)) {
        iD.dirs.lvlUpMls = await getLvlUpMlDirData(iD.files.lvlUpMls);
    }
    return iD.dirs;
}
function checkNeedToMakeLvlUpMlDirs(iD, lvlUpFilesPaths) {
    const lvlUpDirOnlyHoldsReadmeFile = lvlUpFilesPaths.length <= 1 && lvlUpFilesPaths.includes("README");
    const isLecture = iD.module.meta.type === "lecture";
    return (!lvlUpDirOnlyHoldsReadmeFile && isLecture);
}
async function getLvlUpMlDirData(files) {
    const foundDirs = await getDirs();
    return await Promise.all(files.map(async (ml) => {
        const dir = path.parse(ml.curPath).name;
        // If isFound is true, there is already a dir with the name of a level up
        // microlesson in the repo so we'd have a conflict if we tried to create
        // a new dir for that microlesson.
        const isFound = foundDirs.includes(dir);
        const contains = await checkForTemplateAssetItems(dir);
        const containsReadme = (await getFilesThatExist([`./${dir}/README.md`]))
            .includes(`./${dir}/README.md`);
        return new LvlUpMlDir({
            dirName: dir,
            displayName: makeTitleCase(dir),
            curPath: "",
            desiredPath: `./${dir}`,
            shouldCreate: true,
            canCreate: !isFound,
            containsReadme: containsReadme,
            containsAssets: contains.assets,
            containsOriginalAssets: contains.originalAssets,
            containsOriginalAssetsReadme: contains.originalAssetsReadme,
        });
    }));
}
export { getData, checkNeedToMakeLvlUpMlDirs, getLvlUpMlDirData };
