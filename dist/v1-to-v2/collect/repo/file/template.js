// node
import { readFile } from "node:fs/promises";
// do the thing
async function getData(iD) {
    const { files, dirs } = iD;
    const internalResourcesWillExist = dirs.internalResources.isFound ||
        (dirs.internalResources.canCreate && dirs.internalResources.shouldCreate);
    const internalDataWillExist = dirs.internalData.isFound ||
        (dirs.internalData.canCreate && dirs.internalData.shouldCreate);
    const referencesWillExist = dirs.references.isFound ||
        (dirs.references.canCreate && dirs.references.shouldCreate);
    files.defaultLayout = await getTemplateFileData(files.defaultLayout);
    files.rootReadme = await getTemplateFileData(files.rootReadme);
    if (internalResourcesWillExist) {
        files.videoHub = await getTemplateFileData(files.videoHub);
        files.releaseNotes = await getTemplateFileData(files.releaseNotes);
        files.instructorGuide = await getTemplateFileData(files.instructorGuide);
    }
    if (internalResourcesWillExist && internalDataWillExist) {
        files.pklConfig = await getTemplateFileData(files.pklConfig);
        files.pklMicrolessons = await getTemplateFileData(files.pklMicrolessons);
    }
    if (referencesWillExist) {
        files.references = await getTemplateFileData(files.references);
    }
    return iD.files;
}
async function getTemplateFileData(file) {
    try {
        const currentFile = await readFile(file.desiredPath, "utf-8");
        return {
            ...file,
            curPath: file.desiredPath,
            curFileContent: currentFile,
            isFound: true,
            shouldUpdateContent: true,
            ...((file.type === "TemplateFileWithHeading" ||
                file.type === "TemplateFileWithLandingHeading") && {
                canUpdateHeading: checkCanHeadingUpdate(currentFile),
            }),
        };
    }
    catch (error) {
        return {
            ...file,
            shouldCreate: true,
            canMoveOrCreate: true,
        };
    }
}
function checkCanHeadingUpdate(fileContent) {
    const firstLine = fileContent.split("\n")[0];
    return firstLine.startsWith("# ![") && firstLine.endsWith(".png)");
}
export { getData };
