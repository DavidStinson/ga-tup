// node
import { stat } from "node:fs/promises"

// types
import type { TemplateDir, Dirs, Module, Data } from "../../../types.js"

// do the thing
async function getData(iD: Data): Promise<Dirs> {
  const { module, dirs } = iD

  dirs.defaultLayout = await getTemplateData(module, dirs.defaultLayout)
  dirs.clps = await getTemplateData(module, dirs.clps)
  dirs.internalResources = await getTemplateData(module, dirs.internalResources)
  dirs.lvlUp = await getTemplateData(module, dirs.lvlUp)
  dirs.references = await getTemplateData(module, dirs.references)
  dirs.internalData = await getTemplateData(module, dirs.internalData)
  dirs.videoGuide = await getTemplateData(module, dirs.videoGuide)

  return dirs
}

async function getTemplateData(
  module: Module,
  dir: TemplateDir,
): Promise<TemplateDir> {
  try {
    await stat(dir.desiredPath)
    return {
      ...dir,
      curPath: dir.desiredPath,
      isFound: true,
      shouldRemove: !dir.foundIn.includes(module.meta.type),
    }
  } catch (error) {
    return {
      ...dir,
      shouldCreate: dir.foundIn.includes(module.meta.type),
      canCreate: true,
    }
  }
}

export { getData }
