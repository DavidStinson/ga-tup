// local
import {
  buildSubHeading,
  removeHero,
  updatePrefixAndHeadline,
} from "./helpers.js"

// types
import { Data, TemplateFile, Module } from "../../types.js"

// do the thing
function buildNewTemplateFiles(iD: Data) {
  iD.files.defaultLayout = buildNewDefaultLayout(iD)
  iD.files.rootReadme = buildNewRootReadme(iD)
  iD.files.videoHub = buildNewFile(iD.files.videoHub, iD.module)
  iD.files.releaseNotes = buildNewFile(iD.files.releaseNotes, iD.module)
  iD.files.instructorGuide = buildNewFile(iD.files.instructorGuide, iD.module)
  iD.files.references = buildNewFile(iD.files.references, iD.module)
  
  return iD.files
}

function buildNewDefaultLayout(iD: Data) {
  const moduleTitle = iD.module.prefix
    ? `${iD.module.prefix} - ${iD.module.headline}`
    : iD.module.headline

  iD.files.defaultLayout.newFile = iD.files.defaultLayout.templateFile.replace(
    "<title>[tktk Module Name]</title>",
    `<title>${moduleTitle}</title>`
  )

  return iD.files.defaultLayout
}

function buildNewRootReadme(iD: Data) {
  const { files, module, } = iD
  const { rootReadme } = files

  if (rootReadme.isFound && rootReadme.canUpdateHeader) {
    const oldFile = removeHero(rootReadme.oldFile)
    const template = updatePrefixAndHeadline(rootReadme.templateFile, module)
    rootReadme.newFile = oldFile + template
  } else if (rootReadme.isFound) {
    const template = updatePrefixAndHeadline(rootReadme.templateFile, module)
    rootReadme.newFile = rootReadme.oldFile + template
  } else {
    const template = updatePrefixAndHeadline(rootReadme.templateFile, module)
    rootReadme.newFile = template
  }
  return rootReadme
}

function buildNewFile(file: TemplateFile, module: Module): TemplateFile {
  const heading = buildSubHeading(module, file.fileNameTitleCase)

  if (file.isFound && file.canUpdateHeader) {
    const oldFile = removeHero(file.oldFile)
    file.newFile = heading + oldFile
  } else if (file.isFound) {
    file.newFile = heading + file.oldFile
  } else {
    const template = updatePrefixAndHeadline(file.templateFile, module)
    file.newFile = template
  }

  return file
}

export { buildNewTemplateFiles }
