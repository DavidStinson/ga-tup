// npm
import { Command } from "commander";
// workers
import { preflightPrompt, repoAndEnvPrompt } from "./prompt/index.js";
import { collectRepo, collectEnv, collectRemote } from "./collect/index.js";
import { processEnv, processRepo } from "./process/index.js";
import { renderPreflight, renderRepoAndEnv } from "./render/index.js";
import { buildLocal } from "./build/index.js";
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
    isMigratingLevelUp: false,
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
    levelUpMicrolessons: [],
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
const env = {
    isPklInstalled: false,
};
const repoMsgs = {
    successes: [],
    warnings: [],
    failures: [],
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
    env,
    repoMsgs,
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
        await renderPreflight();
        const preflightData = await preflightPrompt(initialData);
        const collectedRepoData = await collectRepo(preflightData);
        const processedRepoData = processRepo(collectedRepoData);
        const collectedEnvData = await collectEnv(processedRepoData);
        const processedEnvData = processEnv(collectedEnvData);
        await renderRepoAndEnv(processedEnvData);
        const repoAndEnvData = await repoAndEnvPrompt(processedEnvData);
        const collectedRemoteData = await collectRemote(repoAndEnvData);
        const finalData = await buildLocal(collectedRemoteData);
    });
    cL.parse();
}
main();
