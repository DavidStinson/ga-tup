// npm
import { v4 as uuidv4 } from "uuid"

// config types
import { 
  DirData, TemplateDirData, MlDirData, LvlUpMlDirData
} from "../config.js"

// models (class types)
interface Dir {
  id: string;
  majorType: "Directory";
  type: "Dir" | "TemplateDir" | "MlDir" | "LvlUpMlDir";
  curPath: string;
  dirName: string;
  displayName: string;
}

class Dir implements Dir {
  constructor(dir: DirData) {
    this.id = uuidv4()
    this.majorType = "Directory"
    this.type = "Dir"
    this.curPath = ""
    this.dirName = dir.dirName
    this.displayName = dir.displayName
  }
}

interface TemplateDir extends Dir {
  type: "TemplateDir";
  desiredPath: string;
  foundIn: string[];
  isFound: boolean;
  shouldRemove: boolean;
  shouldCreate: boolean;
  canCreate: boolean;
  didCreate: boolean;
}

class TemplateDir extends Dir implements TemplateDir {
  constructor(dir: TemplateDirData) {
    super({dirName: dir.dirName, displayName: dir.displayName})
    this.type = "TemplateDir"
    this.desiredPath = dir.desiredPath
    this.foundIn = dir.foundIn
    this.isFound = false
    this.shouldRemove = false
    this.shouldCreate = false
    this.canCreate = false
    this.didCreate = false
  }
}

interface MlDir extends Dir {
  type: "MlDir" | "LvlUpMlDir";
  containsReadme: boolean;
  containsAssetsDir: boolean;
  createdAssetsDir: boolean;
  containsOriginalAssetsDir: boolean;
  createdOriginalAssetsDir: boolean;
  containsOriginalAssetsReadme: boolean;
  createdOriginalAssetsReadme: boolean;
}

class MlDir extends Dir implements MlDir {
  constructor(dir: MlDirData) {
    super({dirName: dir.dirName, displayName: dir.displayName})
    this.type = "MlDir"
    this.curPath = dir.curPath
    this.containsReadme = dir.containsReadme
    this.containsAssetsDir = dir.containsAssets
    this.createdAssetsDir = false
    this.containsOriginalAssetsDir = dir.containsOriginalAssets
    this.createdOriginalAssetsDir = false
    this.containsOriginalAssetsReadme = dir.containsOriginalAssetsReadme
    this.createdOriginalAssetsReadme = false
  }
}

interface LvlUpMlDir extends MlDir {
  type: "LvlUpMlDir";
  desiredPath: string;
  shouldCreate: boolean;
  canCreate: boolean;
  didCreate: boolean;
}

class LvlUpMlDir extends MlDir implements LvlUpMlDir {
  constructor(dir: LvlUpMlDirData) {
    super({
      dirName: dir.dirName,
      displayName: dir.displayName,
      curPath: "",
      containsReadme: dir.containsReadme,
      containsAssets: dir.containsAssets,
      containsOriginalAssets: dir.containsOriginalAssets,
      containsOriginalAssetsReadme: dir.containsOriginalAssetsReadme,
    })
    this.type = "LvlUpMlDir"
    this.desiredPath = dir.desiredPath
    this.shouldCreate = true
    this.canCreate = dir.canCreate
    this.didCreate = false
  }
}

export { TemplateDir, MlDir, LvlUpMlDir }
