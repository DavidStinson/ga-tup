// workers
import { preflightPrompt, repoAndEnvPrompt } from "./prompt/index.js";
import { collectRepo, collectEnv, collectRemote } from "./collect/index.js";
import { processEnv, processRepo, processResults } from "./process/index.js";
import { renderPreflight, renderRepoAndEnv } from "./render/index.js";
import { buildLocal, buildRepo } from "./build/index.js";
// types
import { PureTemplateFile, PklFile, TemplateFile, TemplateFileWithHeading, TemplateFileWithLandingHeading, TemplateDir, } from "./types.js";
// config
import { config } from "./config.js";
const { templateFile, pureTemplateFile, templateDir } = config;
// data setup
const module = {
    prefix: "",
    headline: "",
    dirName: "",
    dirNameCamelCase: "",
    dirNameTitleCase: "",
    meta: {
        type: "",
        typeUrl: "",
        customHeadline: false,
        isMigratingLvlUp: false,
        createdConfigJson: false,
        containsFallbackClp: false,
        containsAssetsDir: false,
        createdAssetsDir: false,
        containsOriginalAssetsDir: false,
        createdOriginalAssetsDir: false,
        containsOriginalAssetsReadme: false,
        createdOriginalAssetsReadme: false,
    },
};
const assets = {
    rootAssets: [],
    mlAssets: [],
    miscAssets: [],
};
const dirs = {
    defaultLayout: new TemplateDir(templateDir.defaultLayout),
    clps: new TemplateDir(templateDir.canvasLandingPages),
    internalResources: new TemplateDir(templateDir.internalResources),
    internalData: new TemplateDir(templateDir.internalData),
    lvlUp: new TemplateDir(templateDir.levelUp),
    references: new TemplateDir(templateDir.references),
    videoGuide: new TemplateDir(templateDir.videoGuide),
    mls: [],
    lvlUpMls: [],
};
const files = {
    defaultLayout: new TemplateFile(templateFile.defaultLayout),
    rootReadme: new TemplateFileWithLandingHeading(templateFile.rootReadme),
    videoHub: new TemplateFileWithHeading(templateFile.videoHub),
    releaseNotes: new TemplateFileWithHeading(templateFile.releaseNotes),
    instructorGuide: new TemplateFileWithHeading(templateFile.instructorGuide),
    references: new TemplateFileWithHeading(templateFile.references),
    pklConfig: new PklFile(templateFile.pklConfig),
    pklMicrolessons: new PklFile(templateFile.pklMicrolessons),
    originalAssetsReadmeTemplate: new PureTemplateFile(pureTemplateFile.originalAssets),
    fallbackCanvasLandingPageTemplate: new PureTemplateFile(pureTemplateFile.fallbackClp),
    clps: [],
    mls: [],
    invalidMlFiles: [],
    lvlUpMls: [],
    invalidLvlUpFiles: [],
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
const resultMsgs = {
    unchanged: [],
    successes: [],
    warnings: [],
    failures: [],
};
const cliOptions = {
    verbose: false,
};
const initialData = {
    module,
    assets,
    dirs,
    files,
    env,
    repoMsgs,
    envMsgs,
    resultMsgs,
    cliOptions,
};
async function v1ToV2(cliOptions) {
    initialData.cliOptions = cliOptions;
    await renderPreflight(initialData);
    const preflightData = await preflightPrompt(initialData);
    const collectedRepoData = await collectRepo(preflightData);
    const processedRepoData = processRepo(collectedRepoData);
    const collectedEnvData = await collectEnv(processedRepoData);
    const processedEnvData = processEnv(collectedEnvData);
    await renderRepoAndEnv(processedEnvData);
    const repoAndEnvData = await repoAndEnvPrompt(processedEnvData);
    const collectedRemoteData = await collectRemote(repoAndEnvData);
    const builtData = await buildLocal(collectedRemoteData);
    const finalData = await buildRepo(builtData);
    const resultsData = await processResults(finalData);
}
export { v1ToV2 };
