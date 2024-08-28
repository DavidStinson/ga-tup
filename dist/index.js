// npm
import { Command } from "commander";
// local
import { preflight } from "./preflight/index.js";
import { collect as collectLocalData } from "./local-collection/index.js";
import { process as processLocalData } from "./local-process/index.js";
import { render as renderLocalData } from "./local-render/index.js";
import { verify as verifyLocalData } from "./prompts/index.js";
import { collect as collectRemoteData } from "./remote-collection/index.js";
import { build as localBuild } from "./local-build/index.js";
// types
import { TemplateFile, Dir, } from "./types.js";
// config
import { config } from "./config.js";
const { templateUrls, staticDir, staticFile } = config;
// data setup
const originalAssetsReadmeFile = {
    type: "file",
    templateFile: "",
    lectureTemplateUrl: templateUrls.lecture.originalAssets,
    labTemplateUrl: templateUrls.lab.originalAssets,
};
const module = {
    type: "",
    prefix: "",
    headline: "",
    dirName: "",
    dirNameCamelCase: "",
    dirNameTitleCase: "",
    customHeadline: false,
};
const assets = {
    rootAssets: [],
    microlessonAssets: [],
    miscAssets: [],
};
const dirs = {
    defaultLayout: new Dir(staticDir.defaultLayout),
    canvasLandingPages: new Dir(staticDir.canvasLandingPages),
    internalResources: new Dir(staticDir.internalResources),
    levelUp: new Dir(staticDir.levelUp),
    references: new Dir(staticDir.references),
    videoGuide: new Dir(staticDir.videoGuide),
    microlessons: [],
    levelUpMicrolessons: []
};
const files = {
    defaultLayout: new TemplateFile(staticFile.defaultLayout),
    rootReadme: new TemplateFile(staticFile.rootReadme),
    videoHub: new TemplateFile(staticFile.videoHub),
    releaseNotes: new TemplateFile(staticFile.releaseNotes),
    instructorGuide: new TemplateFile(staticFile.instructorGuide),
    references: new TemplateFile(staticFile.references),
    originalAssetsReadme: originalAssetsReadmeFile,
    canvasLandingPages: [],
    microlessons: [],
    levelUpMicrolessons: [],
};
const localMsgs = {
    successes: [],
    warnings: [],
    failures: [],
};
const initialData = {
    module,
    assets,
    dirs,
    files,
    localMsgs,
};
// do the thing
async function main() {
    const cL = new Command();
    cL.version("0.1.0", "-v, --version", "Outputs the current version.");
    cL.name("ga-tup");
    cL.description("A template updater for GA's modular technical content.");
    cL.command("update", { isDefault: true })
        .description("Update this repo to version 2 of the template")
        .action(async () => {
        await preflight();
        const collectedLocalData = await collectLocalData(initialData);
        const processedLocalData = await processLocalData(collectedLocalData);
        await renderLocalData(processedLocalData.localMsgs);
        const verifiedLocalData = await verifyLocalData(processedLocalData);
        const collectedRemoteData = await collectRemoteData(verifiedLocalData);
        const finalData = await localBuild(collectedRemoteData);
    });
    cL.parse();
}
main();
