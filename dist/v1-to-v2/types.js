class PureTemplateFile {
    type;
    templateFile;
    lectureTemplateUrl;
    labTemplateUrl;
    constructor(file) {
        this.type = "file";
        this.templateFile = "";
        this.lectureTemplateUrl = file.lectureTemplateUrl;
        this.labTemplateUrl = file.labTemplateUrl;
    }
}
class TemplateFile {
    type;
    path;
    oldFile;
    newFile;
    canUpdateHeader;
    isFound;
    templateFile;
    lectureTemplateUrl;
    labTemplateUrl;
    fileNameTitleCase;
    constructor(file) {
        this.type = "file";
        this.path = file.path;
        this.oldFile = "";
        this.newFile = "";
        this.canUpdateHeader = false;
        this.isFound = false;
        this.templateFile = "";
        this.lectureTemplateUrl = file.lectureTemplateUrl;
        this.labTemplateUrl = file.labTemplateUrl;
        this.fileNameTitleCase = file.fileNameTitleCase;
        this.isMigrated = false;
    }
}
class File {
    type;
    path;
    oldFile;
    newFile;
    canUpdateHeader;
    isFound;
    constructor(file) {
        this.type = "file";
        this.path = file.path;
        this.oldFile = file.fileContent.value;
        this.newFile = "";
        this.canUpdateHeader = file.fileContent.value.startsWith("# ![");
        this.isFound = true;
        this.isMigrated = false;
    }
}
class Dir {
    type;
    isFound;
    path;
    dirName;
    dirNameTitleCase;
    dirNameCamelCase;
    constructor(dir) {
        this.type = "directory";
        this.isFound = false;
        this.path = dir.path;
        this.dirName = dir.dirName;
        this.dirNameTitleCase = dir.dirNameTitleCase;
        this.dirNameCamelCase = dir.dirNameCamelCase;
        this.isMigrated = false;
    }
}
export { File, TemplateFile, PureTemplateFile, Dir, };
