// node
import { rm } from "node:fs/promises"

// types
import type { Data, Assets } from "../../types.js"

// do the thing
async function remove(iD: Data): Promise<Assets> {
  const assetsToRemove = [
    ...iD.assets.rootAssets,
    ...iD.assets.mlAssets,
    ...iD.assets.miscAssets,
  ]

  const removedResults = await Promise.all(
    assetsToRemove.map(async (asset) => {
      try {
        await rm(asset, { force: true })
        return true
      } catch (error) {
        return false
      }
    }),
  )

  removedResults.forEach((result, index) => {
    if (result) {
      iD.assets.deletedAssets.push(assetsToRemove[index]!)
    } else {
      iD.assets.assetsNotDeleted.push(assetsToRemove[index]!)
    }
  })

  return iD.assets
}

export { remove }
