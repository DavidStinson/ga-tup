// local
import { buildSubHeading, removeHero, updatePrefixAndHeadline, updateHeadline, } from "./helpers.js";
// do the thing
function build(iD) {
    iD.files.defaultLayout = buildNewDefaultLayout(iD.files.defaultLayout, iD.module);
    iD.files.rootReadme = buildNewRootReadme(iD);
    iD.files.videoHub = buildNewFile(iD.files.videoHub, iD.module);
    iD.files.releaseNotes = buildNewFile(iD.files.releaseNotes, iD.module);
    iD.files.instructorGuide = buildNewFile(iD.files.instructorGuide, iD.module);
    iD.files.references = buildNewFile(iD.files.references, iD.module);
    return iD.files;
}
function buildNewDefaultLayout(file, module) {
    if ((!file.shouldUpdateContent || !file.canUpdateContent)) {
        return file;
    }
    const moduleTitle = module.prefix
        ? `${module.prefix} - ${module.headline}`
        : module.headline;
    file.newFileContent = file.templateFile.replace("<title>[tktk Module Name]</title>", `<title>${moduleTitle}</title>`);
    return file;
}
function buildNewRootReadme(iD) {
    const { files, module, } = iD;
    const { rootReadme } = files;
    if (rootReadme.isFound && rootReadme.canUpdateHeading) {
        const oldFile = removeHero(rootReadme.curFileContent);
        const template = updatePrefixAndHeadline(rootReadme.templateFile, module);
        rootReadme.newFileContent = oldFile + template;
        rootReadme.didUpdateHeading = true;
    }
    else if (rootReadme.isFound) {
        const template = updatePrefixAndHeadline(rootReadme.templateFile, module);
        rootReadme.newFileContent = rootReadme.curFileContent + template;
    }
    else {
        const template = updatePrefixAndHeadline(rootReadme.templateFile, module);
        rootReadme.newFileContent = template;
        rootReadme.didUpdateHeading = true;
    }
    return rootReadme;
}
function buildNewFile(file, module) {
    const heading = buildSubHeading(module, file.displayName);
    if (file.isFound && file.canUpdateHeading) {
        const oldFile = removeHero(file.curFileContent);
        file.newFileContent = heading + oldFile;
        file.didUpdateHeading = true;
    }
    else if (file.isFound) {
        file.newFileContent = heading + file.curFileContent;
    }
    else {
        const template = updateHeadline(file.templateFile, module);
        file.newFileContent = template;
        file.didUpdateHeading = true;
    }
    return file;
}
export { build };
