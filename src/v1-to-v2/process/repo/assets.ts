// types
import { Data, Msgs } from "../../types.js"

function process(iD: Data): Msgs {
  const totalAssets =
    iD.assets.rootAssets.length +
    iD.assets.mlAssets.length +
    iD.assets.miscAssets.length
  const totalAssetsToDeleteMsg = `${totalAssets} legacy hero banner assets will be deleted.
   Any pages that cannot be automatically updated with new banners must be updated manually.`

  iD.repoMsgs.warnings.push(totalAssetsToDeleteMsg)

  return iD.repoMsgs
}

export { process }
