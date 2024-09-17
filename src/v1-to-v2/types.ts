// models (types)
import {
  PureTemplateFile,
  MlFile,
  ClpFile,
  TemplateFile,
  PklFile,
  TemplateFileWithHeading,
  TemplateFileWithLandingHeading,
} from "./models/file.js"
import { TemplateDir, MlDir, LvlUpMlDir } from "./models/dir.js"

// types
import type { CliOptions } from "../types.js"

// do the thing
interface Assets {
  rootAssets: string[]
  mlAssets: string[]
  miscAssets: string[]
  deletedAssets: string[]
  assetsNotDeleted: string[]
}

interface Meta {
  type: "" | "lecture" | "lab"
  typeUrl: "" | "lectureTemplateUrl" | "labTemplateUrl"
  customHeadline: boolean
  isMigratingLvlUp: boolean
  containsFallbackClp: boolean
  createdFallbackClp: boolean
  createdConfigJson: boolean
  containsAssetsDir: boolean
  createdAssetsDir: boolean
  containsOriginalAssetsDir: boolean
  createdOriginalAssetsDir: boolean
  containsOriginalAssetsReadme: boolean
  createdOriginalAssetsReadme: boolean
}

interface Module {
  prefix: string
  headline: string
  dirName: string
  dirNameCamelCase: string
  dirNameTitleCase: string
  meta: Meta
}

interface Dirs {
  defaultLayout: TemplateDir
  clps: TemplateDir
  internalResources: TemplateDir
  lvlUp: TemplateDir
  references: TemplateDir
  videoGuide: TemplateDir
  internalData: TemplateDir
  mls: MlDir[]
  lvlUpMls: LvlUpMlDir[]
}

interface Files {
  defaultLayout: TemplateFile
  rootReadme: TemplateFileWithLandingHeading
  videoHub: TemplateFileWithHeading
  releaseNotes: TemplateFileWithHeading
  instructorGuide: TemplateFileWithHeading
  references: TemplateFileWithHeading
  pklConfig: PklFile
  pklMicrolessons: PklFile
  originalAssetsReadmeTemplate: PureTemplateFile
  fallbackCanvasLandingPageTemplate: PureTemplateFile
  clps: ClpFile[]
  mls: MlFile[]
  invalidMlFiles: string[]
  lvlUpMls: MlFile[]
  invalidLvlUpFiles: string[]
}

interface Msgs {
  successes: string[]
  warnings: string[]
  failures: string[]
}

interface ResultMsgs extends Msgs {
  unchanged: string[]
}

interface Env {
  isPklInstalled: boolean
}

interface Data {
  module: Module
  assets: Assets
  dirs: Dirs
  files: Files
  repoMsgs: Msgs
  env: Env
  envMsgs: Msgs
  resultMsgs: ResultMsgs
  cliOptions: CliOptions
}

export {
  PureTemplateFile,
  PklFile,
  TemplateFile,
  TemplateFileWithHeading,
  TemplateFileWithLandingHeading,
  ClpFile,
  MlFile,
  TemplateDir,
  MlDir,
  LvlUpMlDir,
}

export type { Assets, Meta, Module, Dirs, Files, Msgs, ResultMsgs, Env, Data }
