// node
import path from "node:path"

// npm
import { v4 as uuidv4 } from "uuid"

// types
import { 
  FileData, 
  PureTemplateFileData,
  PathedFileData,
  MlFileData,
  TemplateFileData,
} from "../config.js"

// models (class types)
interface File {
  id: string;
  majorType: "File";
  type: 
    "File" |
    "PureTemplateFile" |
    "PathedFile" |
    "TemplateFile" |
    "TemplateFileWithHeading" |
    "TemplateFileWithLandingHeading" |
    "ClpFile" |
    "MlFile" |
    "PklFile";
  fileName: string;
  fileType: string;
  displayName: string;
}

class File implements File {
  constructor(file: FileData) {
    this.id = uuidv4()
    this.majorType = "File"
    this.type = "File"
    this.fileName = file.fileName
    this.fileType = file.fileType
    this.displayName = file.displayName
  }
}

interface PureTemplateFile extends File {
  type: "PureTemplateFile";
  templateFile: string;
  templateFileFetched: boolean;
  lectureTemplateUrl: string;
  labTemplateUrl: string;
}

class PureTemplateFile extends File implements PureTemplateFile  {
  constructor(file: PureTemplateFileData) {
    super({
      fileName: file.fileName,
      fileType: file.fileType,
      displayName: file.displayName
    })
    this.type = "PureTemplateFile"
    this.templateFile = ""
    this.templateFileFetched = false
    this.lectureTemplateUrl = file.lectureTemplateUrl
    this.labTemplateUrl = file.labTemplateUrl
  }
}

interface PathedFile extends File {
  type: 
    "PathedFile" | 
    "TemplateFile" | 
    "TemplateFileWithHeading" | 
    "TemplateFileWithLandingHeading" |
    "ClpFile" |
    "MlFile" | 
    "PklFile";
  curPath: string;
  curFileContent: string;
  desiredPath: string;
  newFileContent: string;
  shouldCreate: boolean;
  canMoveOrCreate: boolean;
  didMoveOrCreate: boolean;
  isFound: boolean;
}

class PathedFile extends File implements PathedFile {
  constructor(file: PathedFileData) {
    super({
      fileName: file.fileName,
      fileType: file.fileType,
      displayName: file.displayName
    })
    this.type = "PathedFile"
    this.curPath = file.curPath
    this.curFileContent = file.curFileContent
    this.desiredPath = file.desiredPath
    this.newFileContent = ""
    this.shouldCreate = false
    this.canMoveOrCreate = false
    this.didMoveOrCreate = false
    this.isFound = file.isFound
  }
}

interface MlFile extends PathedFile {
  type: "MlFile";
  parentDirName: string;
  kebabName: string;
  titleCaseName: string;
  camelCaseName: string;
  isLvlUp: boolean;
  shouldMove: boolean;
  canUpdateHeading: boolean;
  didUpdateHeading: boolean;
}

class MlFile extends PathedFile {
  constructor(file: MlFileData) {
    super({
      fileName: file.fileName,
      fileType: file.fileType,
      displayName: file.displayName,
      curPath: file.curPath,
      curFileContent: file.curFileContent,
      desiredPath: file.desiredPath,
      isFound: file.isFound,
    })
    this.type = "MlFile"
    this.parentDirName = path.basename(path.dirname(file.desiredPath))
    this.kebabName = file.kebabName
    this.titleCaseName = file.titleCaseName
    this.camelCaseName = file.camelCaseName
    this.isLvlUp = file.isLvlUp
    this.shouldMove = file.isLvlUp
    this.canUpdateHeading = checkCanHeadingUpdate(file.curFileContent)
    this.didUpdateHeading = false
  }
}

interface ClpFile extends PathedFile {
  type: "ClpFile";
  canUpdateHeading: boolean;
  didUpdateHeading: boolean;
}

class ClpFile extends PathedFile implements ClpFile {
  constructor(file: PathedFileData) {
    super({
      fileName: file.fileName,
      fileType: file.fileType,
      displayName: file.displayName,
      curPath: file.curPath,
      curFileContent: file.curFileContent,
      desiredPath: file.desiredPath,
      isFound: file.isFound,
    })
    this.type = "ClpFile"
    this.canUpdateHeading = checkCanHeadingUpdate(file.curFileContent)
    this.didUpdateHeading = false
  }
}

interface TemplateFile extends PathedFile {
  type: 
    "TemplateFile" |
    "PklFile" |
    "TemplateFileWithHeading" |
    "TemplateFileWithLandingHeading";
  foundIn: string[];
  templateFile: string;
  templateFileFetched: boolean;
  lectureTemplateUrl: string;
  labTemplateUrl: string;
  shouldUpdateContent: boolean;
  canUpdateContent: boolean;
  didUpdateContent: boolean;
}

class TemplateFile extends PathedFile implements TemplateFile {
  constructor(file: TemplateFileData) {
    super({
      fileName: file.fileName,
      fileType: file.fileType,
      displayName: file.displayName,
      curPath: file.curPath,
      curFileContent: file.curFileContent,
      desiredPath: file.desiredPath,
      isFound: file.isFound,
    })
    this.type = "TemplateFile"
    this.foundIn = file.foundIn
    this.templateFile = ""
    this.templateFileFetched = false
    this.lectureTemplateUrl = file.lectureTemplateUrl
    this.labTemplateUrl = file.labTemplateUrl
  }
}

interface PklFile extends TemplateFile {
  type: "PklFile";
}

class PklFile extends TemplateFile implements PklFile {
  constructor(file: TemplateFileData) {
    super({
      fileName: file.fileName,
      fileType: file.fileType,
      displayName: file.displayName,
      curPath: file.curPath,
      curFileContent: file.curFileContent,
      desiredPath: file.desiredPath,
      isFound: file.isFound,
      foundIn: file.foundIn,
      lectureTemplateUrl: file.lectureTemplateUrl,
      labTemplateUrl: file.labTemplateUrl,
    })
    this.type = "PklFile"
  }
}

interface TemplateFileWithHeading extends TemplateFile {
  type: "TemplateFileWithHeading" | "TemplateFileWithLandingHeading";
  canUpdateHeading: boolean;
  didUpdateHeading: boolean;
}

class TemplateFileWithHeading extends TemplateFile implements TemplateFileWithHeading {
  constructor(file: TemplateFileData) {
    super({
      fileName: file.fileName,
      fileType: file.fileType,
      displayName: file.displayName,
      curPath: file.curPath,
      curFileContent: file.curFileContent,
      desiredPath: file.desiredPath,
      isFound: file.isFound,
      foundIn: file.foundIn,
      lectureTemplateUrl: file.lectureTemplateUrl,
      labTemplateUrl: file.labTemplateUrl,
    })
    this.type = "TemplateFileWithHeading"
    this.canUpdateHeading = checkCanHeadingUpdate(file.curFileContent)
    this.didUpdateHeading = false
  }
}

interface TemplateFileWithLandingHeading extends TemplateFileWithHeading {
  type: "TemplateFileWithLandingHeading";
}

class TemplateFileWithLandingHeading extends TemplateFileWithHeading implements TemplateFileWithLandingHeading {
  constructor(file: TemplateFileData) {
    super({
      fileName: file.fileName,
      fileType: file.fileType,
      displayName: file.displayName,
      curPath: file.curPath,
      curFileContent: file.curFileContent,
      desiredPath: file.desiredPath,
      isFound: file.isFound,
      foundIn: file.foundIn,
      lectureTemplateUrl: file.lectureTemplateUrl,
      labTemplateUrl: file.labTemplateUrl,
    })
    this.type = "TemplateFileWithLandingHeading"
  }
}

function checkCanHeadingUpdate(fileContent: string): boolean {
  const firstLine = fileContent.split("\n")[0]
  return firstLine.startsWith("# ![") && firstLine.endsWith(".png)")
}

export {
  PureTemplateFile,
  MlFile,
  ClpFile,
  TemplateFile,
  PklFile,
  TemplateFileWithHeading,
  TemplateFileWithLandingHeading,
}
