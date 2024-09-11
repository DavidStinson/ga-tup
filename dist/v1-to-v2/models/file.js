// node
import path from "node:path";
// npm
import { v4 as uuidv4 } from "uuid";
class File {
    constructor(file) {
        this.id = uuidv4();
        this.majorType = "File";
        this.type = "File";
        this.fileName = file.fileName;
        this.fileType = file.fileType;
        this.displayName = file.displayName;
    }
}
class PureTemplateFile extends File {
    constructor(file) {
        super({
            fileName: file.fileName,
            fileType: file.fileType,
            displayName: file.displayName
        });
        this.type = "PureTemplateFile";
        this.templateFile = "";
        this.templateFileFetched = false;
        this.lectureTemplateUrl = file.lectureTemplateUrl;
        this.labTemplateUrl = file.labTemplateUrl;
    }
}
class PathedFile extends File {
    constructor(file) {
        super({
            fileName: file.fileName,
            fileType: file.fileType,
            displayName: file.displayName
        });
        this.type = "PathedFile";
        this.curPath = file.curPath;
        this.curFileContent = file.curFileContent;
        this.desiredPath = file.desiredPath;
        this.newFileContent = "";
        this.shouldCreate = false;
        this.canMoveOrCreate = false;
        this.didMoveOrCreate = false;
        this.isFound = file.isFound;
    }
}
class MlFile extends PathedFile {
    constructor(file) {
        super({
            fileName: file.fileName,
            fileType: file.fileType,
            displayName: file.displayName,
            curPath: file.curPath,
            curFileContent: file.curFileContent,
            desiredPath: file.desiredPath,
            isFound: file.isFound,
        });
        this.type = "MlFile";
        this.parentDirName = path.basename(path.dirname(file.desiredPath));
        this.kebabName = file.kebabName;
        this.titleCaseName = file.titleCaseName;
        this.camelCaseName = file.camelCaseName;
        this.isLvlUp = file.isLvlUp;
        this.shouldMove = file.isLvlUp;
        this.canUpdateHeading = checkCanHeadingUpdate(file.curFileContent);
        this.didUpdateHeading = false;
    }
}
class ClpFile extends PathedFile {
    constructor(file) {
        super({
            fileName: file.fileName,
            fileType: file.fileType,
            displayName: file.displayName,
            curPath: file.curPath,
            curFileContent: file.curFileContent,
            desiredPath: file.desiredPath,
            isFound: file.isFound,
        });
        this.type = "ClpFile";
        this.canUpdateHeading = checkCanHeadingUpdate(file.curFileContent);
        this.didUpdateHeading = false;
    }
}
class TemplateFile extends PathedFile {
    constructor(file) {
        super({
            fileName: file.fileName,
            fileType: file.fileType,
            displayName: file.displayName,
            curPath: file.curPath,
            curFileContent: file.curFileContent,
            desiredPath: file.desiredPath,
            isFound: file.isFound,
        });
        this.type = "TemplateFile";
        this.foundIn = file.foundIn;
        this.templateFile = "";
        this.templateFileFetched = false;
        this.lectureTemplateUrl = file.lectureTemplateUrl;
        this.labTemplateUrl = file.labTemplateUrl;
    }
}
class PklFile extends TemplateFile {
    constructor(file) {
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
        });
        this.type = "PklFile";
    }
}
class TemplateFileWithHeading extends TemplateFile {
    constructor(file) {
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
        });
        this.type = "TemplateFileWithHeading";
        this.canUpdateHeading = checkCanHeadingUpdate(file.curFileContent);
        this.didUpdateHeading = false;
    }
}
class TemplateFileWithLandingHeading extends TemplateFileWithHeading {
    constructor(file) {
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
        });
        this.type = "TemplateFileWithLandingHeading";
    }
}
function checkCanHeadingUpdate(fileContent) {
    const firstLine = fileContent.split("\n")[0];
    return firstLine.startsWith("# ![") && firstLine.endsWith(".png)");
}
export { PureTemplateFile, MlFile, ClpFile, TemplateFile, PklFile, TemplateFileWithHeading, TemplateFileWithLandingHeading, };
