// node
import os from "node:os"

// types
import type { Data, ResultMsgs } from "../../types.js"

// do the thing
function process(iD: Data): ResultMsgs {
  const { assets } = iD
  const totalFoundAssets =
    assets.miscAssets.length + assets.mlAssets.length + assets.rootAssets.length
  const allAssetsWereRemoved = totalFoundAssets === assets.deletedAssets.length
  const assetsNotDeleted = assets.assetsNotDeleted.map(
    (asset) => `    ${asset}${os.EOL}`,
  )

  const noFoundAssetsMsg = `No legacy template assets were found.`
  const allAssetsWereRemovedMsg = `All legacy assets were removed.`
  const someAssetsWereRemovedMsg = `Some legacy assets were removed.`
  const noAssetsWereRemovedMsg = `No legacy assets were removed.`

  const someAssetsWereRemovedWithListMsg = `Some legacy assets were not removed. These include:
${assetsNotDeleted.join("")}`

  const noAssetsWereRemovedWithListMsg = `No legacy assets were removed. These include:
${assetsNotDeleted.join("")}`

  if (totalFoundAssets === 0) {
    iD.resultMsgs.unchanged.push(noFoundAssetsMsg)
  } else if (allAssetsWereRemoved) {
    iD.resultMsgs.successes.push(allAssetsWereRemovedMsg)
  } else if (assets.deletedAssets.length && assets.assetsNotDeleted.length) {
    iD.resultMsgs.warnings.push(
      iD.cliOptions.verbose
        ? someAssetsWereRemovedWithListMsg
        : someAssetsWereRemovedMsg,
    )
  } else if (!assets.deletedAssets.length && assets.assetsNotDeleted.length) {
    iD.resultMsgs.warnings.push(
      iD.cliOptions.verbose
        ? noAssetsWereRemovedWithListMsg
        : noAssetsWereRemovedMsg,
    )
  }

  return iD.resultMsgs
}

export { process }
