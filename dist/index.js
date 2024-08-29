// npm
import { Command } from "commander";
// local
import { preflight } from "./preflight/index.js";
import { collect as collectRepoData } from "./repo-collection/index.js";
import { process as processRepoData } from "./repo-process/index.js";
import { collectAndProcess as collectAndProcessEnvData } from "./env/index.js";
import { renderRepoAndEnvData } from "./render/index.js";
import { verify as verifyRepoData } from "./prompts/index.js";
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
const repoMsgs = {
    successes: [],
    warnings: [],
    failures: [],
};
const env = {
    isPklInstalled: false,
};
const envMsgs = {
    successes: [],
    warnings: [],
    failures: [],
};
const initialData = {
    module,
    assets,
    dirs,
    files,
    repoMsgs,
    env,
    envMsgs,
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
        const collectedRepoData = await collectRepoData(initialData);
        const processedRepoData = await processRepoData(collectedRepoData);
        const processedEnvData = await collectAndProcessEnvData(processedRepoData);
        await renderRepoAndEnvData(processedEnvData);
        const verifiedRepoData = await verifyRepoData(processedRepoData);
        const collectedRemoteData = await collectRemoteData(verifiedRepoData);
        const finalData = await localBuild(collectedRemoteData);
    });
    cL.parse();
}
main();
