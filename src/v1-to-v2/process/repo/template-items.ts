// types
import { Data, Msgs, Meta, PklFile } from "../../types.js"

// local
import {
  processGoodItem,
  processBadItem,
  processFileWithHeading,
} from "./helpers.js"

// do the thing
function process(iD: Data): Msgs {
  const { verbose } = iD.cliOptions

  iD.repoMsgs = processGoodItem(iD.repoMsgs, iD.dirs.defaultLayout)
  iD.repoMsgs = processGoodItem(iD.repoMsgs, iD.files.defaultLayout)

  iD.repoMsgs = processGoodItem(iD.repoMsgs, iD.files.rootReadme)
  if (iD.files.rootReadme.isFound) {
    iD.repoMsgs = processFileWithHeading(
      iD.repoMsgs,
      iD.files.rootReadme,
      verbose,
    )
  }

  iD.repoMsgs = processGoodItem(iD.repoMsgs, iD.dirs.internalResources)
  iD.repoMsgs = processGoodItem(iD.repoMsgs, iD.dirs.internalData)
  iD.repoMsgs = processPklFile(iD.repoMsgs, iD.files.pklConfig)
  iD.repoMsgs = processPklFile(iD.repoMsgs, iD.files.pklMicrolessons)
  iD.repoMsgs = processGoodItem(iD.repoMsgs, iD.files.videoHub)
  if (iD.files.videoHub.isFound) {
    iD.repoMsgs = processFileWithHeading(
      iD.repoMsgs,
      iD.files.videoHub,
      verbose,
    )
  }
  iD.repoMsgs = processGoodItem(iD.repoMsgs, iD.files.releaseNotes)
  if (iD.files.releaseNotes.isFound) {
    iD.repoMsgs = processFileWithHeading(
      iD.repoMsgs,
      iD.files.releaseNotes,
      verbose,
    )
  }
  iD.repoMsgs = processGoodItem(iD.repoMsgs, iD.files.instructorGuide)
  if (iD.files.instructorGuide.isFound) {
    iD.repoMsgs = processFileWithHeading(
      iD.repoMsgs,
      iD.files.instructorGuide,
      verbose,
    )
  }
  iD.repoMsgs = processBadItem(iD.repoMsgs, iD.dirs.videoGuide)

  if (iD.module.meta.type === "lecture") {
    iD.repoMsgs = processGoodItem(iD.repoMsgs, iD.dirs.references)
    iD.repoMsgs = processGoodItem(iD.repoMsgs, iD.files.references)
    if (iD.files.references.isFound) {
      iD.repoMsgs = processFileWithHeading(
        iD.repoMsgs,
        iD.files.references,
        verbose,
      )
    }

    iD.repoMsgs = processBadItem(iD.repoMsgs, iD.dirs.lvlUp)
  }

  iD.repoMsgs = processRootDirForAssets(iD.repoMsgs, iD.module.meta)

  return iD.repoMsgs
}

function processRootDirForAssets(msgs: Msgs, repo: Meta): Msgs {
  const containsAll = `The root directory contains all the necessary asset template items.`
  const doesNotContainAssets = `The root directory does not contain an assets directory. 
   One will be created, along with the necessary sub-items.`
  const doesNotContainOriginalAssets = `The root directory does not contain an assets/originals directory.
   One will be created, along with the necessary sub-items.`
  const doesNotContainOriginalAssetsReadme = `The root directory does not contain an assets/originals/README.md file.
   One will be created.`

  if (
    repo.containsAssetsDir &&
    repo.containsOriginalAssetsDir &&
    repo.containsOriginalAssetsReadme
  ) {
    msgs.successes.push(containsAll)
  } else if (repo.containsAssetsDir && repo.containsOriginalAssetsDir) {
    msgs.successes.push(doesNotContainOriginalAssetsReadme)
  } else if (repo.containsAssetsDir) {
    msgs.successes.push(doesNotContainOriginalAssets)
  } else {
    msgs.successes.push(doesNotContainAssets)
  }

  return msgs
}

function processPklFile(msgs: Msgs, file: PklFile): Msgs {
  const foundMsg = `The ${file.curPath} file was found but will be replaced as part of the update. 
   It will require further manual updates.`
  const notFoundMsg = `The ${file.desiredPath} file was not found. 
   It will be created, but need some manual updates.`

  if (file.isFound) {
    msgs.successes.push(foundMsg)
  } else {
    msgs.successes.push(notFoundMsg)
  }

  return msgs
}

export { process }
