// local
import { buildLandingHeading, removeHero, updatePrefixAndHeadline, } from "./helpers.js";
// do the thing
function buildNewCanvasLandingPages(iD) {
    const { files, module } = iD;
    const migratedClps = migrateExistingClps(files.canvasLandingPages, module);
    if (!module.meta.didContainFallbackClp) {
        migratedClps.push(buildFallbackClp(files, module));
    }
    return migratedClps;
}
function migrateExistingClps(clps, module) {
    clps.forEach((file, idx) => {
        clps[idx] = migrateExistingClp(file, module);
    });
    return clps;
}
function migrateExistingClp(file, module) {
    const headline = buildLandingHeading(module);
    if (file.canUpdateHeader) {
        const oldFileNoHero = removeHero(file.oldFile);
        file.newFile = headline + oldFileNoHero;
    }
    else {
        file.newFile = headline + file.oldFile;
    }
    return file;
}
function buildFallbackClp(files, module) {
    const fallbackClpWithHeadline = updatePrefixAndHeadline(files.fallbackCanvasLandingPageTemplate.templateFile, module);
    return {
        type: "file",
        path: "./canvas-landing-pages/fallback.md",
        oldFile: "",
        newFile: fallbackClpWithHeadline,
        canUpdateHeader: true,
        isFound: false,
        isMigrated: false,
    };
}
export { buildNewCanvasLandingPages };
