const templateFilesBaseURL =
  "https://pages.git.generalassemb.ly/modular-curriculum-all-courses/TEMPLATE-FILES/v2"

// types
interface FileData {
  readonly fileName: string
  readonly fileType: string
  readonly displayName: string
}

interface PureTemplateFileData extends FileData {
  readonly lectureTemplateUrl: string
  readonly labTemplateUrl: string
}

interface PathedFileData extends FileData {
  readonly desiredPath: string
  readonly curPath: string
  readonly curFileContent: string
  readonly isFound: boolean
}

interface TemplateFileData extends PathedFileData {
  readonly foundIn: string[]
  readonly lectureTemplateUrl: string
  readonly labTemplateUrl: string
  readonly requiresManualMigrationOnUpdate: boolean
  readonly requiresManualMigrationOnUpdateMsg: string
  readonly requiresManualMigrationOnCreate: boolean
  readonly requiresManualMigrationOnCreateMsg: string
}

interface MlFileData extends PathedFileData {
  readonly kebabName: string
  readonly titleCaseName: string
  readonly camelCaseName: string
  readonly isLvlUp: boolean
  readonly shouldMove: boolean
}

interface DirData {
  readonly dirName: string
  readonly displayName: string
}

interface TemplateDirData extends DirData {
  readonly desiredPath: string
  readonly foundIn: string[]
}

interface MlDirData extends DirData {
  readonly curPath: string
  readonly containsReadme: boolean
  readonly containsAssets: boolean
  readonly containsOriginalAssets: boolean
  readonly containsOriginalAssetsReadme: boolean
}

interface LvlUpMlDirData extends MlDirData {
  readonly desiredPath: string
  readonly shouldCreate: boolean
  readonly canCreate: boolean
}

interface Dictionary {
  [index: string]: string
}

interface Config {
  path: {
    rootAssets: string[]
    referencesAssets: string[]
    internalResourcesAssets: string[]
  }
  templateRootDirs: {
    lecture: string[]
    lab: string[]
  }
  templateRequiredDirPaths: {
    lecture: string[]
    lab: string[]
  }
  templateDir: {
    defaultLayout: TemplateDirData
    canvasLandingPages: TemplateDirData
    internalResources: TemplateDirData
    levelUp: TemplateDirData
    references: TemplateDirData
    videoGuide: TemplateDirData
    internalData: TemplateDirData
  }
  templateFile: {
    defaultLayout: TemplateFileData
    rootReadme: TemplateFileData
    videoHub: TemplateFileData
    releaseNotes: TemplateFileData
    instructorGuide: TemplateFileData
    references: TemplateFileData
    pklConfig: TemplateFileData
    pklMicrolessons: TemplateFileData
  }
  pureTemplateFile: {
    originalAssets: PureTemplateFileData
    fallbackClp: PureTemplateFileData
  }
  vars: {
    pklTemplateUrl: string
    configJsonPath: string
  }
  commonWords: Dictionary
}

const config: Config = {
  path: {
    rootAssets: [
      "./assets/hero.png",
      "./assets/instructor-guide.png",
      "./assets/release-notes.png",
      "./assets/video-hub.png",
      "./assets/originals/hero.eps",
      "./assets/originals/instructor-guide.eps",
      "./assets/originals/release-notes.eps",
      "./assets/originals/video-hub.eps",
    ],
    referencesAssets: [
      "./references/assets/hero.png",
      "./references/assets/originals/hero.eps",
    ],
    internalResourcesAssets: [
      "./internal-resources/assets/hero-instructor-guide.png",
      "./internal-resources/assets/hero-release-notes.png",
      "./internal-resources/assets/originals/hero-instructor-guide.eps",
      "./internal-resources/assets/originals/hero-release-notes.eps",
    ],
  },
  templateRootDirs: {
    lecture: [
      ".git",
      "_layouts",
      "assets",
      "canvas-landing-pages",
      "internal-resources",
      "level-up",
      "references",
      "node_modules",
    ],
    lab: [
      ".git",
      "_layouts",
      "assets",
      "canvas-landing-pages",
      "internal-resources",
      "node_modules",
    ],
  },
  templateRequiredDirPaths: {
    lecture: [
      "./_layouts",
      "./assets",
      "./assets/originals",
      "./canvas-landing-pages",
      "./internal-resources",
      "./internal-resources/data",
      "./references",
    ],
    lab: [
      "./_layouts",
      "./assets",
      "./assets/originals",
      "./canvas-landing-pages",
      "./internal-resources",
      "./internal-resources/data",
      "./references",
    ],
  },
  templateDir: {
    defaultLayout: {
      displayName: "Default HTML Layout",
      desiredPath: "./_layouts",
      dirName: "_layouts",
      foundIn: ["lecture", "lab"],
    },
    canvasLandingPages: {
      displayName: "Canvas Landing Pages",
      desiredPath: "./canvas-landing-pages",
      dirName: "canvas-landing-pages",
      foundIn: ["lecture", "lab"],
    },
    internalResources: {
      displayName: "Internal Resources",
      desiredPath: "./internal-resources",
      dirName: "internal-resources",
      foundIn: ["lecture", "lab"],
    },
    levelUp: {
      displayName: "Level Up",
      desiredPath: "./level-up",
      dirName: "level-up",
      foundIn: [],
    },
    references: {
      displayName: "References",
      desiredPath: "./references",
      dirName: "references",
      foundIn: ["lecture"],
    },
    videoGuide: {
      displayName: "Video Guide",
      desiredPath: "./internal-resources/video-guide",
      dirName: "video-guide",
      foundIn: [],
    },
    internalData: {
      displayName: "Internal Data",
      desiredPath: "./internal-resources/data",
      dirName: "data",
      foundIn: ["lecture", "lab"],
    },
  },
  templateFile: {
    defaultLayout: {
      fileName: "default",
      fileType: ".html",
      displayName: "Default HTML Layout",
      curPath: "",
      curFileContent: "",
      isFound: false,
      desiredPath: "./_layouts/default.html",
      foundIn: ["lecture", "lab"],
      lectureTemplateUrl: `${templateFilesBaseURL}/default-html.txt`,
      labTemplateUrl: `${templateFilesBaseURL}/default-html.txt`,
      requiresManualMigrationOnUpdate: false,
      requiresManualMigrationOnUpdateMsg: "",
      requiresManualMigrationOnCreate: false,
      requiresManualMigrationOnCreateMsg: "",
    },
    rootReadme: {
      fileName: "README",
      fileType: ".md",
      displayName: "Root README",
      curPath: "",
      curFileContent: "",
      isFound: false,
      desiredPath: "./README.md",
      foundIn: ["lecture", "lab"],
      lectureTemplateUrl: `${templateFilesBaseURL}/lecture-root-readme.txt`,
      labTemplateUrl: `${templateFilesBaseURL}/lab-root-readme.txt`,
      requiresManualMigrationOnUpdate: true,
      requiresManualMigrationOnUpdateMsg: `Content in the ./README.md file will need to be copied from the original content layout and placed into the new sections.
    The original content can be found below the '-- tktk old file content below this line --' line in this file.`,
      requiresManualMigrationOnCreate: true,
      requiresManualMigrationOnCreateMsg:
        "You will need to place the appropriate content into the ./README.md file.",
    },
    videoHub: {
      fileName: "video-hub",
      fileType: ".md",
      displayName: "Video Hub",
      curPath: "",
      curFileContent: "",
      isFound: false,
      desiredPath: "./internal-resources/video-hub.md",
      foundIn: ["lecture", "lab"],
      lectureTemplateUrl: `${templateFilesBaseURL}/video-hub.txt`,
      labTemplateUrl: `${templateFilesBaseURL}/video-hub.txt`,
      requiresManualMigrationOnUpdate: false,
      requiresManualMigrationOnUpdateMsg: "",
      requiresManualMigrationOnCreate: false,
      requiresManualMigrationOnCreateMsg:
        "If any video content exists in this module, it will need to be added to the ./internal-resources/video-hub.md file.",
    },
    releaseNotes: {
      fileName: "release-notes",
      fileType: ".md",
      displayName: "Release Notes",
      curPath: "",
      curFileContent: "",
      isFound: false,
      desiredPath: "./internal-resources/release-notes.md",
      foundIn: ["lecture", "lab"],
      lectureTemplateUrl: `${templateFilesBaseURL}/lecture-release-notes.txt`,
      labTemplateUrl: `${templateFilesBaseURL}/lab-release-notes.txt`,
      requiresManualMigrationOnUpdate: false,
      requiresManualMigrationOnUpdateMsg: "",
      requiresManualMigrationOnCreate: true,
      requiresManualMigrationOnCreateMsg:
        "You will need to place the appropriate content into the ./internal-resources/release-notes.md file.",
    },
    instructorGuide: {
      fileName: "instructor-guide",
      fileType: ".md",
      displayName: "Instructor Guide",
      curPath: "",
      curFileContent: "",
      isFound: false,
      desiredPath: "./internal-resources/instructor-guide.md",
      foundIn: ["lecture", "lab"],
      lectureTemplateUrl: `${templateFilesBaseURL}/instructor-guide.txt`,
      labTemplateUrl: `${templateFilesBaseURL}/instructor-guide.txt`,
      requiresManualMigrationOnUpdate: false,
      requiresManualMigrationOnUpdateMsg: "",
      requiresManualMigrationOnCreate: true,
      requiresManualMigrationOnCreateMsg:
        "You will need to place the appropriate content into the ./internal-resources/instructor-guide.md file.",
    },
    references: {
      fileName: "references",
      fileType: ".md",
      displayName: "References",
      curPath: "",
      curFileContent: "",
      isFound: false,
      desiredPath: "./references/README.md",
      foundIn: ["lecture"],
      lectureTemplateUrl: `${templateFilesBaseURL}/references.txt`,
      labTemplateUrl: `${templateFilesBaseURL}/references.txt`,
      requiresManualMigrationOnUpdate: false,
      requiresManualMigrationOnUpdateMsg: "",
      requiresManualMigrationOnCreate: true,
      requiresManualMigrationOnCreateMsg:
        "You will need to place the appropriate content into the ./references/README.md file.",
    },
    pklConfig: {
      fileName: "config",
      fileType: ".pkl",
      displayName: "Pkl Config",
      curPath: "",
      curFileContent: "",
      isFound: false,
      desiredPath: "./internal-resources/data/config.pkl",
      foundIn: ["lecture", "lab"],
      lectureTemplateUrl: `${templateFilesBaseURL}/pkl-config.txt`,
      labTemplateUrl: `${templateFilesBaseURL}/pkl-config.txt`,
      requiresManualMigrationOnUpdate: false,
      requiresManualMigrationOnUpdateMsg: "",
      requiresManualMigrationOnCreate: false,
      requiresManualMigrationOnCreateMsg: "",
    },
    pklMicrolessons: {
      fileName: "microlessons",
      fileType: ".pkl",
      displayName: "Pkl Microlessons",
      curPath: "",
      curFileContent: "",
      isFound: false,
      desiredPath: "./internal-resources/data/microlessons.pkl",
      foundIn: ["lecture", "lab"],
      lectureTemplateUrl: `${templateFilesBaseURL}/pkl-microlessons.txt`,
      labTemplateUrl: `${templateFilesBaseURL}/pkl-microlessons.txt`,
      requiresManualMigrationOnUpdate: false,
      requiresManualMigrationOnUpdateMsg: "",
      requiresManualMigrationOnCreate: false,
      requiresManualMigrationOnCreateMsg: "",
    },
  },
  pureTemplateFile: {
    originalAssets: {
      fileName: "README",
      fileType: ".md",
      displayName: "Original Assets Readme",
      lectureTemplateUrl: `${templateFilesBaseURL}/original-assets-readme.txt`,
      labTemplateUrl: `${templateFilesBaseURL}/original-assets-readme.txt`,
    },
    fallbackClp: {
      fileName: "fallback",
      fileType: ".md",
      displayName: "Lecture CLP Fallback",
      lectureTemplateUrl: `${templateFilesBaseURL}/lecture-clp-fallback.txt`,
      labTemplateUrl: `${templateFilesBaseURL}/lab-clp-fallback.txt`,
    },
  },
  vars: {
    pklTemplateUrl:
      "https://pages.git.generalassemb.ly/modular-curriculum-all-courses/universal-resources-internal/static/v2/pkl/template.pkl",
    configJsonPath: "./internal-resources/data/config.json",
  },
  commonWords: {
    Javascript: "JavaScript",
    Github: "GitHub",
  },
}

export { config }

export type {
  FileData,
  PureTemplateFileData,
  PathedFileData,
  TemplateFileData,
  MlFileData,
  DirData,
  TemplateDirData,
  MlDirData,
  LvlUpMlDirData,
}
