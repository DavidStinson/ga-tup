// npm
import { v4 as uuidv4 } from "uuid";
class Dir {
    constructor(dir) {
        this.id = uuidv4();
        this.majorType = "Directory";
        this.type = "Dir";
        this.curPath = "";
        this.dirName = dir.dirName;
        this.displayName = dir.displayName;
    }
}
class TemplateDir extends Dir {
    constructor(dir) {
        super({ dirName: dir.dirName, displayName: dir.displayName });
        this.type = "TemplateDir";
        this.desiredPath = dir.desiredPath;
        this.foundIn = dir.foundIn;
        this.isFound = false;
        this.shouldRemove = false;
        this.shouldCreate = false;
        this.canCreate = false;
        this.didCreate = false;
    }
}
class MlDir extends Dir {
    constructor(dir) {
        super({ dirName: dir.dirName, displayName: dir.displayName });
        this.type = "MlDir";
        this.curPath = dir.curPath;
        this.containsReadme = dir.containsReadme;
        this.containsAssetsDir = dir.containsAssets;
        this.createdAssetsDir = false;
        this.containsOriginalAssetsDir = dir.containsOriginalAssets;
        this.createdOriginalAssetsDir = false;
        this.containsOriginalAssetsReadme = dir.containsOriginalAssetsReadme;
        this.createdOriginalAssetsReadme = false;
    }
}
class LvlUpMlDir extends MlDir {
    constructor(dir) {
        super({
            dirName: dir.dirName,
            displayName: dir.displayName,
            curPath: "",
            containsReadme: dir.containsReadme,
            containsAssets: dir.containsAssets,
            containsOriginalAssets: dir.containsOriginalAssets,
            containsOriginalAssetsReadme: dir.containsOriginalAssetsReadme,
        });
        this.type = "LvlUpMlDir";
        this.desiredPath = dir.desiredPath;
        this.shouldCreate = true;
        this.canCreate = dir.canCreate;
        this.didCreate = false;
    }
}
export { TemplateDir, MlDir, LvlUpMlDir };
