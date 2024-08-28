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
        this.type = "dir";
        this.isFound = false;
        this.path = dir.path;
        this.dirName = dir.dirName;
        this.dirNameTitleCase = dir.dirNameTitleCase;
        this.dirNameCamelCase = dir.dirNameCamelCase;
    }
}
export { File, TemplateFile, Dir, };
