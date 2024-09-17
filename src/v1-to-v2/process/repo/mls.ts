// types
import type { Data, Msgs, MlFile, MlDir, LvlUpMlDir } from "../../types.js"

// local
import { processFileWithHeading } from "./helpers.js"

// do the thing
function process(iD: Data): Msgs {
  const { verbose } = iD.cliOptions
  iD.repoMsgs = processMls(iD.repoMsgs, iD.files.mls, verbose)
  if (verbose) iD.repoMsgs = processMlDirsForAssets(iD, iD.dirs.mls)
  iD.repoMsgs = processInvalidMlFiles(iD, iD.files.invalidMlFiles)

  if (iD.dirs.lvlUpMls.length && iD.module.meta.type === "lecture") {
    iD.repoMsgs = processLvlUpMls(iD.repoMsgs, iD.files.lvlUpMls, verbose)
    iD.repoMsgs = processLevelUpMlDirs(iD.repoMsgs, iD.dirs.lvlUpMls, verbose)
  }

  iD.repoMsgs = processInvalidLvlUpMlFiles(iD, iD.files.invalidLvlUpFiles)

  return iD.repoMsgs
}

function processMls(msgs: Msgs, files: MlFile[], verbose: boolean): Msgs {
  const foundMls = files.filter((file) => file.isFound)
  const noMlsMsg = `No microlessons were found.`
  const oneMlMsg = `There is 1 microlesson.`
  const multipleMlsMsg = `There are ${foundMls.length} microlessons.`

  if (!foundMls.length) {
    msgs.warnings.push(noMlsMsg)
  } else if (foundMls.length === 1) {
    msgs.successes.push(oneMlMsg)
  } else if (foundMls.length > 1) {
    msgs.successes.push(multipleMlsMsg)
  }

  files.forEach((file) => {
    msgs = processMlFile(msgs, file)
    if (file.isFound) msgs = processFileWithHeading(msgs, file, verbose)
  })

  return msgs
}

function processMlFile(msgs: Msgs, ml: MlFile): Msgs {
  const foundMsg = `The ${ml.displayName} microlesson was found at ${ml.curPath}.`
  const notFoundMsg = `The ${ml.displayName} microlesson was not found at ${ml.desiredPath}. 
    It will not be created. No further action will be taken in this directory because we don't know what it is. 
    You may want to take further action manually.`

  if (ml.isFound) {
    msgs.successes.push(foundMsg)
  } else {
    msgs.failures.push(notFoundMsg)
  }

  return msgs
}

function processMlDirsForAssets(iD: Data, dirs: MlDir[]): Msgs {
  dirs.forEach((dir) => {
    iD.repoMsgs = processMlDirForAssets(iD.repoMsgs, dir)
  })
  return iD.repoMsgs
}

function processMlDirForAssets(msgs: Msgs, dir: MlDir | LvlUpMlDir): Msgs {
  // Eject out of this if we don't have a README.md file, we can't be sure of
  // what this directory actually is.
  if (!dir.containsReadme) return msgs

  const containsAll = `The ${dir.curPath} microlesson directory contains all the necessary asset template items.`
  const doesNotContainAssets = `The ${dir.curPath} microlesson directory does not contain an assets directory. 
   One will be created, along with the necessary sub-items.`
  const doesNotContainOriginalAssets = `The ${dir.curPath} microlesson directory does not contain an assets/originals directory.
   One will be created, along with the necessary sub-items.`
  const doesNotContainOriginalAssetsReadme = `The ${dir.curPath} microlesson directory does not contain an assets/originals/README.md file.
   One will be created.`

  if (
    dir.containsAssetsDir &&
    dir.containsOriginalAssetsDir &&
    dir.containsOriginalAssetsReadme
  ) {
    msgs.successes.push(containsAll)
  } else if (dir.containsAssetsDir && dir.containsOriginalAssetsDir) {
    msgs.successes.push(doesNotContainOriginalAssetsReadme)
  } else if (dir.containsAssetsDir) {
    msgs.successes.push(doesNotContainOriginalAssets)
  } else {
    msgs.successes.push(doesNotContainAssets)
  }

  return msgs
}

function processInvalidMlFiles(iD: Data, files: string[]): Msgs {
  files.forEach((file) => {
    const foundMsg = `The ${file} was found, but should not be a child of a microlesson directory.
    You may want to take further action manually.`

    iD.repoMsgs.failures.push(foundMsg)
  })
  return iD.repoMsgs
}

function processLvlUpMls(msgs: Msgs, files: MlFile[], verbose: boolean): Msgs {
  const noLvlUpMlsMsg = `No Level Up microlessons were found.`
  const oneLvlUpMlMsg = `There is 1 Level Up microlesson.`
  const multipleLvlUpMlsMsg = `There are ${files.length} Level Up microlessons.`

  if (!files.length) {
    msgs.successes.push(noLvlUpMlsMsg)
  } else if (files.length === 1) {
    msgs.successes.push(oneLvlUpMlMsg)
  } else if (files.length > 1) {
    msgs.successes.push(multipleLvlUpMlsMsg)
  }

  files.forEach((file) => {
    msgs = processLvlUpMlFile(msgs, file)
    msgs = processFileWithHeading(msgs, file, verbose)
  })

  return msgs
}

function processLvlUpMlFile(msgs: Msgs, ml: MlFile): Msgs {
  const foundMsg = `The ${ml.displayName} Level Up microlesson was found at ${ml.curPath}.`
  const canMoveOrCreateMsg = `The ${ml.displayName} Level Up microlesson can be moved from ${ml.curPath} to ${ml.desiredPath}.
   Further action may be required to complete the move.`
  const cannotMoveOrCreateMsg = `The ${ml.displayName} Level Up microlesson cannot be moved from ${ml.curPath} to ${ml.desiredPath}.
    There may be a conflict with another file or directory. You may want to take further action manually.`

  if (ml.isFound) msgs.successes.push(foundMsg)

  if (ml.shouldMove && ml.canMoveOrCreate) {
    msgs.successes.push(canMoveOrCreateMsg)
  } else if (ml.shouldMove && !ml.canMoveOrCreate) {
    msgs.failures.push(cannotMoveOrCreateMsg)
  }

  return msgs
}

function processLevelUpMlDirs(
  msgs: Msgs,
  dirs: LvlUpMlDir[],
  verbose: boolean,
): Msgs {
  const existingDirs = dirs.filter((dir) => dir.shouldCreate && !dir.canCreate)
  const noOverlapMsg = `No Level Up microlessons have overlapping names with existing directories.`
  const oneExistingMsg = `1 Level Up microlesson has an overlapping name with an existing directory in the root of the module.
    That Level Up microlesson will need to be manually migrated.`
  const multipleExistingMsg = `${existingDirs.length} Level Up microlessons have overlapping names with existing directories in the root of the module. 
    Those Level Up microlessons will need to be manually migrated.`

  if (!existingDirs.length) {
    msgs.successes.push(noOverlapMsg)
  } else if (existingDirs.length === 1) {
    msgs.failures.push(oneExistingMsg)
  } else if (existingDirs.length > 1) {
    msgs.failures.push(multipleExistingMsg)
  }

  dirs.forEach((dir) => {
    msgs = processLevelUpDirForOverlap(msgs, dir, verbose)
  })

  return msgs
}

function processLevelUpDirForOverlap(
  msgs: Msgs,
  dir: LvlUpMlDir,
  verbose: boolean,
): Msgs {
  const foundOverlapMsg = `The ${dir.desiredPath} directory name matches the name of an existing directory in the root of the module.`
  const notFoundCreateMsg = `The ${dir.desiredPath} directory can be created for the ${dir.displayName} Level Up microlesson.`
  const doesNotContainAssets = `The ${dir.desiredPath} Level Up microlesson directory does not contain an assets directory.
   One will be created, along with the necessary sub-items.`

  if (dir.shouldCreate && dir.canCreate && verbose) {
    msgs.successes.push(notFoundCreateMsg, doesNotContainAssets)
  } else if (dir.shouldCreate && !dir.canCreate) {
    msgs.failures.push(foundOverlapMsg)
  }

  return msgs
}

function processInvalidLvlUpMlFiles(iD: Data, files: string[]): Msgs {
  files.forEach((file) => {
    const foundMsg = `The ${file} was found, but should not be a child of the ./level-up directory.
    You may want to take further action manually.`

    iD.repoMsgs.failures.push(foundMsg)
  })
  return iD.repoMsgs
}

export { process }
