// types
import { Data, ResultMsgs, MlFile, MlDir, LvlUpMlDir } from "../../types.js"

// local
import { processHeading } from "./helpers.js"

// do the thing
function process(iD: Data): ResultMsgs {
  const { cliOptions } = iD

  iD.resultMsgs = processMls(iD.resultMsgs, iD.files.mls)
  iD.resultMsgs = processMlDirsForAssets(iD, iD.dirs.mls, cliOptions.verbose)
  iD.resultMsgs = processInvalidMlFiles(iD, iD.files.invalidMlFiles)

  if (
    iD.dirs.lvlUpMls.length &&
    iD.module.meta.type === "lecture" &&
    !iD.module.meta.isMigratingLvlUp
  ) {
    iD.resultMsgs = processUnmovedLvlUpMls(iD.resultMsgs, iD.files.lvlUpMls)
  } else if (
    iD.dirs.lvlUpMls.length &&
    iD.module.meta.type === "lecture" &&
    iD.module.meta.isMigratingLvlUp
  ) {
    iD.resultMsgs = processLvlUpMls(iD.resultMsgs, iD.files.lvlUpMls)
    iD.resultMsgs = processLevelUpMlDirs(
      iD.resultMsgs,
      iD.dirs.lvlUpMls,
      cliOptions.verbose,
    )
  }

  iD.resultMsgs = processInvalidLvlUpMlFiles(iD, iD.files.invalidLvlUpFiles)

  return iD.resultMsgs
}

function processMls(msgs: ResultMsgs, files: MlFile[]): ResultMsgs {
  files.forEach((file) => {
    if (file.isFound) msgs = processHeading(msgs, file)
  })

  return msgs
}

function processMlDirsForAssets(
  iD: Data,
  dirs: MlDir[],
  verbose: boolean,
): ResultMsgs {
  dirs.forEach((dir) => {
    iD.resultMsgs = processMlDirForAssets(
      iD.resultMsgs,
      dir,
      dir.curPath,
      verbose,
    )
  })
  return iD.resultMsgs
}

function processMlDirForAssets(
  msgs: ResultMsgs,
  dir: MlDir | LvlUpMlDir,
  path: string,
  verbose: boolean,
): ResultMsgs {
  if (!dir.containsReadme) return msgs

  const containedAll = `The ${path} microlesson directory already contained all the necessary asset template items. No changes were made.`
  const createdAll = `The ${path} microlesson directory did not contain all the necessary asset template items, but they were all created.`

  const createdAssetsDir = `The ${path} microlesson directory did not contain an assets directory. One was created.`
  const didNotCreateAssetsDir = `The ${path} microlesson directory did not contain an assets directory. Something went wrong while creating it.
    You'll need to create this directory manually.`
  const createdOriginalAssetsDir = `The ${path} microlesson directory did not contain an assets/originals directory. One was created.`
  const didNotCreateOriginalAssetsDir = `The ${path} microlesson directory did not contain an assets/originals directory. Something went wrong while creating it.
    You'll need to create this directory manually.`
  const createdOriginalAssetsReadme = `The ${path} microlesson directory did not contain an assets/originals/README.md file. One was created.`
  const didNotCreateOriginalAssetsReadme = `The ${path} microlesson directory did not contain an assets/originals/README.md file. Something went wrong while creating it.
    You'll need to create this file manually.`

  if (
    dir.containsAssetsDir &&
    dir.containsOriginalAssetsDir &&
    dir.containsOriginalAssetsReadme
  ) {
    if (verbose) msgs.unchanged.push(containedAll)
    return msgs
  } else if (
    !dir.containsAssetsDir &&
    dir.createdAssetsDir &&
    !dir.containsOriginalAssetsDir &&
    dir.createdOriginalAssetsDir &&
    !dir.containsOriginalAssetsReadme &&
    dir.createdOriginalAssetsReadme
  ) {
    msgs.successes.push(createdAll)
    return msgs
  }

  if (!dir.containsAssetsDir && dir.createdAssetsDir) {
    msgs.successes.push(createdAssetsDir)
  } else if (!dir.containsAssetsDir && !dir.createdAssetsDir) {
    msgs.failures.push(didNotCreateAssetsDir)
  }

  if (!dir.containsOriginalAssetsDir && dir.createdOriginalAssetsDir) {
    msgs.successes.push(createdOriginalAssetsDir)
  } else if (!dir.containsOriginalAssetsDir && !dir.createdOriginalAssetsDir) {
    msgs.failures.push(didNotCreateOriginalAssetsDir)
  }

  if (!dir.containsOriginalAssetsReadme && dir.createdOriginalAssetsReadme) {
    msgs.successes.push(createdOriginalAssetsReadme)
  } else if (
    !dir.containsOriginalAssetsReadme &&
    !dir.createdOriginalAssetsReadme
  ) {
    msgs.failures.push(didNotCreateOriginalAssetsReadme)
  }

  return msgs
}

function processInvalidMlFiles(iD: Data, files: string[]): ResultMsgs {
  files.forEach((file) => {
    const foundMsg = `The ${file} was found, but should not be a child of a microlesson directory.
    You may want to take further action manually.`

    iD.resultMsgs.failures.push(foundMsg)
  })
  return iD.resultMsgs
}

function processUnmovedLvlUpMls(msgs: ResultMsgs, files: MlFile[]): ResultMsgs {
  const notMigratingLvlUpMsg = `You decided not to move the existing Level Up microlessons from the ./level-up directory and into their own microlesson directories.
    You'll need to move them manually.`

  msgs.failures.push(notMigratingLvlUpMsg)

  files.forEach((file) => {
    msgs = processHeading(msgs, file)
  })

  return msgs
}

function processLvlUpMls(msgs: ResultMsgs, files: MlFile[]): ResultMsgs {
  files.forEach((file) => {
    msgs = processLvlUpMl(msgs, file)
    msgs = processHeading(msgs, file)
  })

  return msgs
}

function processLvlUpMl(msgs: ResultMsgs, file: MlFile): ResultMsgs {
  const didMoveOrCreateMsg = `The ${file.displayName} Level Up microlesson was moved from ${file.curPath} to ${file.desiredPath}.
    Further action may be required - like moving the assets for this microlesson - to complete the move.`
  const didNotMoveOrCreateMsg = `The ${file.displayName} Level Up microlesson was not moved from ${file.curPath} to ${file.desiredPath}.
    There may be a conflict with another file or directory. You may want to take further action manually.`

  if (!file.isFound) return msgs

  if (file.didMoveOrCreate) {
    msgs.failures.push(didMoveOrCreateMsg)
  } else if (!file.didMoveOrCreate) {
    msgs.failures.push(didNotMoveOrCreateMsg)
  }

  return msgs
}

function processLevelUpMlDirs(
  msgs: ResultMsgs,
  dirs: LvlUpMlDir[],
  verbose: boolean,
): ResultMsgs {
  dirs.forEach((dir) => {
    msgs = processLevelUpMlDir(msgs, dir)
    msgs = processMlDirForAssets(msgs, dir, dir.curPath, verbose)
  })
  return msgs
}

function processLevelUpMlDir(msgs: ResultMsgs, dir: LvlUpMlDir): ResultMsgs {
  const createMsg = `The ${dir.desiredPath} directory was created for the ${dir.displayName} Level Up microlesson.`
  const notCreatedMsg = `Something went wrong while creating the ${dir.desiredPath} directory for the ${dir.displayName} Level Up microlesson.
    You'll need to create it manually.`
  const foundOverlapMsg = `The ${dir.desiredPath} directory name matches the name of an existing directory in the root of the module.
    You'll need to rename the directory or move it to a new location manually.`

  if (dir.didCreate) {
    msgs.successes.push(createMsg)
  } else if (dir.shouldCreate && dir.canCreate && !dir.didCreate) {
    msgs.failures.push(notCreatedMsg)
  } else if (dir.shouldCreate && !dir.canCreate) {
    msgs.failures.push(foundOverlapMsg)
  }

  return msgs
}

function processInvalidLvlUpMlFiles(iD: Data, files: string[]): ResultMsgs {
  files.forEach((file) => {
    const foundMsg = `The ${file} was found, but should not be a child of the ./level-up directory.
    You may want to take further action manually.`

    iD.resultMsgs.failures.push(foundMsg)
  })
  return iD.resultMsgs
}

export { process }
