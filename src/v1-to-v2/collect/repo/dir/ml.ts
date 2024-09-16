// local
import {
  getDirs,
  makeTitleCase,
  checkForTemplateAssetItems,
  getFilesThatExist,
} from "../helpers.js"

// types
import { MlDir, Dirs, Module } from "../../../types.js"

// config
import { config } from "../../../config.js"

// do the thing
async function getData(dirs: Dirs, module: Module): Promise<Dirs> {
  const foundDirs = await getDirs()
  const microlessonDirs = filterTemplateDirs(foundDirs, module)

  dirs.mls = await Promise.all(
    microlessonDirs.map(async (dir) => {
      try {
        const contains = await checkForTemplateAssetItems(dir)
        const containsReadme = (
          await getFilesThatExist([`./${dir}/README.md`])
        ).includes(`./${dir}/README.md`)

        return new MlDir({
          dirName: dir,
          displayName: makeTitleCase(dir),
          curPath: `./${dir}`,
          containsReadme: containsReadme,
          containsAssets: contains.assets,
          containsOriginalAssets: contains.originalAssets,
          containsOriginalAssetsReadme: contains.originalAssetsReadme,
        })
      } catch (error) {
        return new MlDir({
          dirName: dir,
          displayName: makeTitleCase(dir),
          curPath: `./${dir}`,
          containsReadme: false,
          containsAssets: false,
          containsOriginalAssets: false,
          containsOriginalAssetsReadme: false,
        })
      }
    }),
  )

  return dirs
}

function filterTemplateDirs(dirList: string[], module: Module): string[] {
  // This can't happen, but TS doesn't know that
  if (module.meta.type === "") return dirList

  const expectedDirsForModule = config.templateRootDirs[module.meta.type]

  return dirList.filter((dir) => !expectedDirsForModule.includes(dir))
}

export { getData }
