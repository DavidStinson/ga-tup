// npm
import ora from "ora";
// local
import { getData as getFileData, getPureData as getPureFileData } from "./file-fetch.js";
// do the thing
async function collect(iD) {
    const { files } = iD;
    const { type } = iD.module;
    const dataSpinner = ora({
        text: "Retrieving template data...",
        spinner: "triangle",
    });
    dataSpinner.start();
    if (type === "")
        return iD;
    try {
        iD.files.defaultLayout = await getFileData(files.defaultLayout, type);
        iD.files.rootReadme = await getFileData(files.rootReadme, type);
        iD.files.videoHub = await getFileData(files.videoHub, type);
        iD.files.releaseNotes = await getFileData(files.releaseNotes, type);
        iD.files.instructorGuide = await getFileData(files.instructorGuide, type);
        iD.files.references = await getFileData(files.references, type);
        iD.files.originalAssetsReadme = await getPureFileData(files.originalAssetsReadme, type);
        if (dataSpinner.isSpinning) {
            dataSpinner.succeed("Retrieved templates!");
        }
        return iD;
    }
    catch (error) {
        if (dataSpinner.isSpinning) {
            dataSpinner.fail("Failed to retrieve templates.");
        }
        process.exit(0);
    }
}
export { collect, };
