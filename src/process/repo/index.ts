// local
import {
  check as goodItemFound,
  checkInverse as badItemFound,
  checkFileWithHeaders,
  checkCanvasLandingPages,
  checkMicrolessons,
  checkAssets,
} from "./checks.js"

// types
import { Data } from "../../types.js"

// do the thing
function process(iD: Data): Data {
  iD.repoMsgs = goodItemFound(iD.repoMsgs, iD.dirs.defaultLayout)
  iD.repoMsgs = goodItemFound(iD.repoMsgs, iD.files.defaultLayout)

  iD.repoMsgs = goodItemFound(iD.repoMsgs, iD.dirs.canvasLandingPages)
  iD.repoMsgs = checkCanvasLandingPages(
    iD.repoMsgs,
    iD.files.canvasLandingPages
  )

  iD.repoMsgs = goodItemFound(iD.repoMsgs, iD.dirs.internalResources)

  iD.repoMsgs = goodItemFound(iD.repoMsgs, iD.files.videoHub)
  if (iD.files.videoHub.isFound) {
    iD.repoMsgs = checkFileWithHeaders(iD.repoMsgs, iD.files.videoHub)
  }
  iD.repoMsgs = goodItemFound(iD.repoMsgs, iD.files.releaseNotes)
  if (iD.files.releaseNotes.isFound) {
    iD.repoMsgs = checkFileWithHeaders(iD.repoMsgs, iD.files.releaseNotes)
  }
  iD.repoMsgs = goodItemFound(iD.repoMsgs, iD.files.instructorGuide)
  if (iD.files.instructorGuide.isFound) {
    iD.repoMsgs = checkFileWithHeaders(iD.repoMsgs, iD.files.instructorGuide)
  }

  iD.repoMsgs = badItemFound(iD.repoMsgs, iD.dirs.videoGuide)

  iD.repoMsgs = goodItemFound(iD.repoMsgs, iD.dirs.references)
  iD.repoMsgs = goodItemFound(iD.repoMsgs, iD.files.references)
  if (iD.files.references.isFound) {
    iD.repoMsgs = checkFileWithHeaders(iD.repoMsgs, iD.files.references)
  }

  iD.repoMsgs = badItemFound(iD.repoMsgs, iD.dirs.levelUp)

  iD.repoMsgs = goodItemFound(iD.repoMsgs, iD.files.rootReadme)
  if (iD.files.rootReadme.isFound) {
    iD.repoMsgs = checkFileWithHeaders(iD.repoMsgs, iD.files.rootReadme)
  }

  iD.repoMsgs = checkMicrolessons(iD.repoMsgs, iD.files.microlessons)
  iD.repoMsgs = checkAssets(iD.repoMsgs, iD.assets)

  return iD
}

export { process }
