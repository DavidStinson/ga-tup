// node
import { rm } from "node:fs/promises"

// types
import { Data, Assets } from "../../types.js"

async function remove(iD: Data): Promise<Assets> {
  const assetsToRemove = [
    ...iD.assets.rootAssets,
    ...iD.assets.mlAssets,
    ...iD.assets.miscAssets,
  ]

  const removedResults = await Promise.all(assetsToRemove.map(async (asset) => {
    try {
      await rm(asset, { force: true })
      return true
    } catch (error) {
      return false
    }
  }))

  removedResults.forEach((result, index) => {
    if (!result) iD.assets.undeletedAssets.push(assetsToRemove[index])
  })

  return iD.assets
}

export { remove }