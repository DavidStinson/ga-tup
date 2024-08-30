interface ConfiguredFile {
  readonly path: string;
  readonly lectureTemplateUrl: string;
  readonly labTemplateUrl: string;
}

interface ConfiguredDir {
  readonly path: string;
  readonly dirName: string;
  readonly dirNameTitleCase: string;
  readonly dirNameCamelCase: string;
}

interface DiskFile {
  path: string;
  fileContent: PromiseFulfilledResult<string>;
}

interface File {
  type: "file";
  path: string;
  oldFile: string;
  newFile: string;
  canUpdateHeader: boolean;
  isFound: boolean;
}

interface TemplateFile extends File {
  templateFile: string;
  lectureTemplateUrl: string;
  labTemplateUrl: string;
}

interface PureTemplateFile {
  type: "file";
  templateFile: string;
  readonly lectureTemplateUrl: string;
  readonly labTemplateUrl: string;
}

interface Assets {
  rootAssets: string[];
  microlessonAssets: string[];
  miscAssets: string[];
}

interface Dir {
  type: "dir";
  isFound: boolean;
  path: string;
  dirName: string;
  dirNameTitleCase: string;
  dirNameCamelCase: string;
}

interface Module {
  type: "" | "lectureTemplateUrl" | "labTemplateUrl";
  prefix: string;
  headline: string;
  dirName: string;
  dirNameCamelCase: string;
  dirNameTitleCase: string;
  customHeadline: boolean;
  isMigratingLevelUp: boolean;
}

interface Dirs {
  defaultLayout: Dir;
  canvasLandingPages: Dir;
  internalResources: Dir;
  levelUp: Dir;
  references: Dir;
  videoGuide: Dir;
  microlessons: Dir[];
  levelUpMicrolessons: Dir[];
}

interface Files {
  defaultLayout: TemplateFile;
  rootReadme: TemplateFile;
  videoHub: TemplateFile;
  releaseNotes: TemplateFile;
  instructorGuide: TemplateFile;
  references: TemplateFile;
  originalAssetsReadme: PureTemplateFile;
  canvasLandingPages: File[];
  microlessons: File[];
  levelUpMicrolessons: File[];
}

interface Msgs {
  successes: string[];
  warnings: string[];
  failures: string[];
}

interface Env {
  isPklInstalled: boolean;
}

interface Data {
  module: Module;
  assets: Assets;
  dirs: Dirs;
  files: Files;
  repoMsgs: Msgs;
  env: Env;
  envMsgs: Msgs;
}

class TemplateFile implements TemplateFile {
  type: "file";
  path: string;
  oldFile: string;
  newFile: string;
  canUpdateHeader: boolean;
  isFound: boolean;
  templateFile: string;
  lectureTemplateUrl: string;
  labTemplateUrl: string;

  constructor(file: ConfiguredFile) {
    this.type = "file"
    this.path = file.path
    this.oldFile = ""
    this.newFile = ""
    this.canUpdateHeader = false
    this.isFound = false
    this.templateFile = ""
    this.lectureTemplateUrl = file.lectureTemplateUrl
    this.labTemplateUrl = file.labTemplateUrl
  }
}

class File implements File {
  type: "file";
  path: string;
  oldFile: string;
  newFile: string;
  canUpdateHeader: boolean;
  isFound: boolean;

  constructor(file: DiskFile) {
    this.type = "file"
    this.path = file.path
    this.oldFile = file.fileContent.value
    this.newFile = ""
    this.canUpdateHeader = file.fileContent.value.startsWith("# ![")
    this.isFound = true
  }
}

class Dir implements Dir {
  type: "dir";
  isFound: boolean;
  path: string;
  dirName: string;
  dirNameTitleCase: string;
  dirNameCamelCase: string;

  constructor(dir: ConfiguredDir) {
    this.type = "dir"
    this.isFound = false
    this.path = dir.path
    this.dirName = dir.dirName
    this.dirNameTitleCase = dir.dirNameTitleCase
    this.dirNameCamelCase = dir.dirNameCamelCase
  }
}

export {
  File,
  TemplateFile,
  PureTemplateFile,
  Assets,
  Dir,
  Module,
  Dirs,
  Files,
  Msgs,
  Env,
  Data,
}