// types
import { Data, TemplateFile, Module } from "../types.js"


function buildDefaultLayout(iD: Data) {
  const { files, module } = iD
  const { defaultLayout } = files

  const moduleTitle = module.prefix 
    ? `${module.prefix} - ${module.headline}` 
    : module.headline

  defaultLayout.newFile = defaultLayout.templateFile.replace(
    "<title>[tktk Module Name]</title>",
    `<title>${moduleTitle}</title>`
  )
  
  
  
  return defaultLayout
}

function buildRootReadme(iD: Data) {
  const { files, module } = iD
  const { rootReadme } = files

  rootReadme.templateFile = updatePrefix(rootReadme, module)
  rootReadme.templateFile = updateHeadline(rootReadme, module)
  
  if (rootReadme.isFound) {
    rootReadme.oldFile.slice(rootReadme.oldFile.indexOf("\\"))
    rootReadme.newFile = rootReadme.oldFile + rootReadme.templateFile
  } else {
    rootReadme.newFile = rootReadme.templateFile
  }
  return rootReadme
}

async function buildVideoHub(iD: Data) {
  const { files, module } = iD
  const { videoHub } = files

  videoHub.templateFile = updateHeadline(videoHub, module)

  return videoHub
}

function buildReleaseNotes(iD: Data) {
  const { files, module } = iD
  const { releaseNotes } = files

  releaseNotes.templateFile = updateHeadline(releaseNotes, module)

  return releaseNotes
}

async function buildInstructorGuide(iD: Data) {
  const { files, module } = iD
  const { instructorGuide } = files

  instructorGuide.templateFile = updateHeadline(instructorGuide, module)
  
  return instructorGuide
}

async function buildReferences(iD: Data) {
  const { files, module } = iD
  const { references } = files

  references.templateFile = updateHeadline(references, module)
  
  return references
}

function updatePrefix(file: TemplateFile, module: Module) {
  return file.templateFile.replace(
    '<span class="prefix"></span>',
    `<span class="prefix">${module.prefix}</span>`
  )
}

function updateHeadline(file: TemplateFile, module: Module) {
  return file.templateFile.replace(
    '<span class="headline">[tktk Module Name]</span>',
    `<span class="headline">${module.headline}</span>`
  )
}

export {
  buildDefaultLayout,
  buildRootReadme,
  buildVideoHub,
  buildReleaseNotes,
  buildInstructorGuide,
  buildReferences,
}
