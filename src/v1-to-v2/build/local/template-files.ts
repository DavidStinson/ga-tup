// local
import {
  buildSubHeading,
  removeHero,
  updatePrefixAndHeadline,
  updateHeadline,
} from "./helpers.js"

// types
import type {
  Data,
  TemplateFile,
  TemplateFileWithHeading,
  Module,
} from "../../types.js"

// do the thing
function build(iD: Data) {
  iD.files.defaultLayout = buildNewDefaultLayout(
    iD.files.defaultLayout,
    iD.module,
  )
  iD.files.rootReadme = buildNewRootReadme(iD)
  iD.files.videoHub = buildNewFile(iD.files.videoHub, iD.module)
  iD.files.releaseNotes = buildNewFile(iD.files.releaseNotes, iD.module)
  iD.files.instructorGuide = buildNewFile(iD.files.instructorGuide, iD.module)
  iD.files.references = buildNewFile(iD.files.references, iD.module)

  return iD.files
}

function buildNewDefaultLayout(file: TemplateFile, module: Module) {
  // If we couldn't fetch the template file, we shouldn't do anything
  if (!file.templateFileFetched) return file

  const moduleTitle = module.prefix
    ? `${module.prefix} - ${module.headline}`
    : module.headline

  file.newFileContent = file.templateFile.replace(
    "<title>[tktk Module Name]</title>",
    `<title>${moduleTitle}</title>`,
  )

  return file
}

function buildNewRootReadme(iD: Data) {
  const { files, module } = iD
  const { rootReadme } = files

  // If we couldn't fetch the template file, we shouldn't do anything
  if (!rootReadme.templateFileFetched) return rootReadme

  if (rootReadme.isFound && rootReadme.canUpdateHeading) {
    const oldFile = removeHero(rootReadme.curFileContent)
    const template = updatePrefixAndHeadline(rootReadme.templateFile, module)
    rootReadme.newFileContent = `${template}
    
    -- tktk old file content below this line --

    ${oldFile}`
    rootReadme.didUpdateHeading = true
  } else if (rootReadme.isFound) {
    const template = updatePrefixAndHeadline(rootReadme.templateFile, module)
    rootReadme.newFileContent = rootReadme.curFileContent + template
  } else {
    const template = updatePrefixAndHeadline(rootReadme.templateFile, module)
    rootReadme.newFileContent = template
    rootReadme.didUpdateHeading = true
  }
  return rootReadme
}

function buildNewFile(
  file: TemplateFileWithHeading,
  module: Module,
): TemplateFileWithHeading {
  const heading = buildSubHeading(module, file.displayName)

  if (file.isFound && file.canUpdateHeading) {
    const oldFile = removeHero(file.curFileContent)
    file.newFileContent = heading + oldFile
    file.didUpdateHeading = true
  } else if (file.isFound) {
    file.newFileContent = heading + file.curFileContent
  } else if (file.templateFileFetched) {
    // If we couldn't fetch the template file, we shouldn't do anything

    const template = updateHeadline(file.templateFile, module)
    file.newFileContent = template
    file.didUpdateHeading = true
  }

  return file
}

export { build }
