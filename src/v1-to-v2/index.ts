
// workers
import { preflightPrompt, repoAndEnvPrompt } from "./prompt/index.js"
import { collectRepo, collectEnv, collectRemote } from "./collect/index.js"
import { processEnv, processRepo } from "./process/index.js"
import { renderPreflight, renderRepoAndEnv } from "./render/index.js"
import { buildLocal } from "./build/index.js"

// types
import {
  TemplateFile,
  PureTemplateFile,
  Assets,
  Module,
  Dir,
  Dirs,
  Files,
  Msgs,
  Env,
  Data,
} from "./types.js"

// config
import { config } from "./config.js"
const { templateFile, staticDir, staticFile } = config

// data setup
const module: Module = {
  prefix: "",
  headline: "",
  dirName: "",
  dirNameCamelCase: "",
  dirNameTitleCase: "",
  meta: {
    type: "",
    typeUrl: "",
    customHeadline: false,
    isMigratingLevelUp: false,
    didContainFallbackClp: false,
  },
}

const assets: Assets = {
  rootAssets: [],
  microlessonAssets: [],
  miscAssets: [],
}

const dirs: Dirs = {
  defaultLayout: new Dir(staticDir.defaultLayout),
  canvasLandingPages: new Dir(staticDir.canvasLandingPages),
  internalResources: new Dir(staticDir.internalResources),
  levelUp: new Dir(staticDir.levelUp),
  references: new Dir(staticDir.references),
  videoGuide: new Dir(staticDir.videoGuide),
  microlessons: [],
  levelUpMicrolessons: [],
}

const files: Files = {
  defaultLayout: new TemplateFile(staticFile.defaultLayout),
  rootReadme: new TemplateFile(staticFile.rootReadme),
  videoHub: new TemplateFile(staticFile.videoHub),
  releaseNotes: new TemplateFile(staticFile.releaseNotes),
  instructorGuide: new TemplateFile(staticFile.instructorGuide),
  references: new TemplateFile(staticFile.references),
  originalAssetsReadmeTemplate: new PureTemplateFile(
    templateFile.originalAssets
  ),
  fallbackCanvasLandingPageTemplate: new PureTemplateFile(
    templateFile.fallbackClp
  ),
  canvasLandingPages: [],
  microlessons: [],
  levelUpMicrolessons: [],
}

const env: Env = {
  isPklInstalled: false,
}

const repoMsgs: Msgs = {
  successes: [],
  warnings: [],
  failures: [],
}

const envMsgs: Msgs = {
  successes: [],
  warnings: [],
  failures: [],
}

const initialData: Data = {
  module,
  assets,
  dirs,
  files,
  env,
  repoMsgs,
  envMsgs,
}

async function v1ToV2() {
  await renderPreflight()
  const preflightData = await preflightPrompt(initialData)
  const collectedRepoData = await collectRepo(preflightData)
  const processedRepoData = processRepo(collectedRepoData)
  const collectedEnvData = await collectEnv(processedRepoData)
  const processedEnvData = processEnv(collectedEnvData)
  await renderRepoAndEnv(processedEnvData)
  const repoAndEnvData = await repoAndEnvPrompt(processedEnvData)
  const collectedRemoteData = await collectRemote(repoAndEnvData)
  const finalData = await buildLocal(collectedRemoteData)
}

export { v1ToV2 }
