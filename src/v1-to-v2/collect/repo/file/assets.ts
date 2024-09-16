// local
import { getFilesThatExist } from "../helpers.js"

// types
import { Data, Assets, MlDir } from "../../../types.js"

// config
import { config } from "../../../config.js"

// do the thing
async function getData(iD: Data): Promise<Assets> {
  iD.assets.rootAssets = await getFilesThatExist(config.path.rootAssets)

  const mlAssetCandidates = getMicrolessonAssetPaths(iD.dirs.mls)
  iD.assets.mlAssets = await getFilesThatExist(mlAssetCandidates)

  if (iD.dirs.internalResources.isFound) {
    iD.assets.miscAssets.push(
      ...(await getFilesThatExist(config.path.internalResourcesAssets)),
    )
  }

  if (iD.dirs.references.isFound) {
    iD.assets.miscAssets.push(
      ...(await getFilesThatExist(config.path.referencesAssets)),
    )
  }

  return iD.assets
}

function getMicrolessonAssetPaths(mls: MlDir[]): string[] {
  const mlAssetCandidates: string[] = []

  mls.forEach((ml) => {
    mlAssetCandidates.push(`./${ml.dirName}/assets/hero.png`)
    mlAssetCandidates.push(`./${ml.dirName}/assets/originals/hero.eps`)
  })

  return mlAssetCandidates
}

export { getData }
