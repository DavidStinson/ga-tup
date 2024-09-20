// node
import os from "node:os"

// types
import type {
  Data,
  ResultMsgs,
  TemplateFile,
  Meta,
  TemplateDir,
  Module,
  PklFile,
  MlFile,
  Files,
  Env,
  TemplateFileWithHeading,
  TemplateFileWithLandingHeading,
} from "../../types.js"

// local
import { processTemplateDir } from "./helpers.js"
import { config } from "../../config.js"

// do the thing
function process(iD: Data): ResultMsgs {
  const { verbose } = iD.cliOptions
  const { dirs, files } = iD

  iD.resultMsgs = processTemplateDir(iD.resultMsgs, dirs.defaultLayout, verbose)
  iD.resultMsgs = processTemplateFile(iD.resultMsgs, files.defaultLayout, files)

  iD.resultMsgs = processTemplateFile(iD.resultMsgs, files.rootReadme, files)

  iD.resultMsgs = processTemplateDir(
    iD.resultMsgs,
    dirs.internalResources,
    verbose,
  )
  iD.resultMsgs = processTemplateDir(iD.resultMsgs, dirs.internalData, verbose)
  iD.resultMsgs = processTemplateFile(iD.resultMsgs, files.pklConfig, files)
  iD.resultMsgs = processTemplateFile(
    iD.resultMsgs,
    files.pklMicrolessons,
    files,
  )
  iD.resultMsgs = processConfigJson(iD.resultMsgs, iD.module.meta, iD.env)
  iD.resultMsgs = processTemplateFile(iD.resultMsgs, files.videoHub, files)
  iD.resultMsgs = processTemplateFile(iD.resultMsgs, files.releaseNotes, files)
  iD.resultMsgs = processTemplateFile(
    iD.resultMsgs,
    files.instructorGuide,
    files,
  )
  iD.resultMsgs = processTemplateDir(iD.resultMsgs, dirs.videoGuide, verbose)

  if (iD.module.meta.type === "lecture") {
    iD.resultMsgs = processTemplateDir(iD.resultMsgs, dirs.references, verbose)
    iD.resultMsgs = processTemplateFile(iD.resultMsgs, files.references, files)
    iD.resultMsgs = processLevelUpDir(
      iD.resultMsgs,
      dirs.lvlUp,
      iD.module,
      iD.files,
    )
  }

  iD.resultMsgs = processRootAssets(iD.resultMsgs, iD.module.meta)

  return iD.resultMsgs
}

function processTemplateFile(
  msgs: ResultMsgs,
  file:
    | TemplateFile
    | PklFile
    | TemplateFileWithHeading
    | TemplateFileWithLandingHeading,
  files: Files,
): ResultMsgs {
  const templateFileNotFetchedMsg = `The ${file.displayName} file at ${file.curPath} could not be fetched from the remote template repo. 
    However, you opted to continue with the update. No work was done on this file, and you will need to create or update the file manually.`
  const foundButNotUpdated = `The ${file.displayName} file at ${file.desiredPath} was found but could not be updated. 
    You will need to update the file manually.`
  const shouldButCanNotCreateMsg = `The ${file.displayName} file at ${file.desiredPath} can not be created automatically.
    You will need to create the file manually.`
  const shouldButDidNotCreateMsg = `Something went wrong creating the ${file.displayName} file at ${file.desiredPath}.
    You will need to create the file manually.`
  const notFoundAndShouldNotCreateMsg = `The ${file.displayName} file at ${file.desiredPath} was not found and you opted not to create it.
    You will need to create the file manually.`
  const somethingWentWrongMsg = `Something went wrong while working on the ${file.displayName} file.
    You will need to create or update the file manually.`

  if (!file.templateFileFetched) {
    msgs.failures.push(templateFileNotFetchedMsg)
  } else if (file.isFound && !file.didUpdateInPlace) {
    msgs.failures.push(foundButNotUpdated)
  } else if (file.isFound && file.didUpdateInPlace) {
    msgs = handleUpdated(msgs, file, files)
  } else if (file.shouldCreate && !file.canMoveOrCreate) {
    msgs.failures.push(shouldButCanNotCreateMsg)
  } else if (file.shouldCreate && !file.didMoveOrCreate) {
    msgs.failures.push(shouldButDidNotCreateMsg)
  } else if (file.shouldCreate && file.didMoveOrCreate) {
    msgs = handleCreated(msgs, file, files)
  } else if (!file.isFound && !file.shouldCreate) {
    msgs.failures.push(notFoundAndShouldNotCreateMsg)
  } else {
    msgs.failures.push(somethingWentWrongMsg)
  }

  return msgs
}

function handleCreated(
  msgs: ResultMsgs,
  file:
    | TemplateFile
    | PklFile
    | TemplateFileWithHeading
    | TemplateFileWithLandingHeading,
  files: Files,
): ResultMsgs {
  const shouldAndDidCreateMsg = `The ${file.displayName} file at ${file.desiredPath} was created and no additional work is required.`

  switch (file.type) {
    case "TemplateFile":
      if (file.requiresManualMigrationOnCreate) {
        msgs.failures.push(file.requiresManualMigrationOnCreateMsg)
      } else {
        msgs.successes.push(shouldAndDidCreateMsg)
      }
      break
    case "PklFile":
      msgs = processCreatedPklFile(msgs, file as PklFile, files)
      break
    default:
      msgs = processCreatedTemplateFileWithHeading(
        msgs,
        file as TemplateFileWithHeading,
      )
      break
  }

  return msgs
}

function processCreatedPklFile(
  msgs: ResultMsgs,
  file: PklFile,
  files: Files,
): ResultMsgs {
  const anyUnorderedMls = getAnyUnorderedMls(files)

  const shouldAndDidCreateMsg = `The ${file.displayName} file at ${file.desiredPath} was created and no additional work is required.`
  const otherCoursesWarning = `A default Fallback course was created in ${file.desiredPath} with the microlessons in the correct order.
    However, if any other courses use this module you will need to create the course in this file.`
  const shouldAndDidCreateWithUnorderedMlsMsg = `The ${file.displayName} file at ${file.desiredPath} was created but some microlessons are not in the correct order.
    You will need to update the file manually.
    You should also audit the README.md file at the root of the project. It may be missing a link to some microlessons.`
  const otherCoursesOutOfOrderWarning = `The microlessons in the Fallback course in the ${file.desiredPath} file is out of order. 
    If any other courses use this module you will need to create the course in the ${file.desiredPath} file as well.`

  if (!anyUnorderedMls.length) {
    msgs.successes.push(shouldAndDidCreateMsg)
    if (file.fileName === "config") msgs.warnings.push(otherCoursesWarning)
  } else if (anyUnorderedMls.length) {
    msgs.failures.push(shouldAndDidCreateWithUnorderedMlsMsg)
    if (file.fileName === "config") {
      msgs.warnings.push(otherCoursesOutOfOrderWarning)
    }
  }

  if (anyUnorderedMls.length) {
    const unorderedMls = anyUnorderedMls.map((ml, idx) => {
      return `    ${ml.displayName}${os.EOL}`
    })
    msgs.failures.push(`The order of these microlessons could not be determined:
${unorderedMls.join("")}`)
  }

  return msgs
}

function processCreatedTemplateFileWithHeading(
  msgs: ResultMsgs,
  file: TemplateFileWithHeading,
): ResultMsgs {
  const shouldAndDidCreateMsg = `The ${file.displayName} file at ${file.desiredPath} was created and no additional work is required.`
  const shouldAndDidCreateWithBadHeadingMsg = `The ${file.displayName} file at ${file.desiredPath} was created but the heading is incorrect.
    You will need to update the file manually.`
  const createdWithBadHeadingMsg = `The ${file.displayName} file at ${file.desiredPath} has an incorrect heading.`

  if (file.didUpdateHeading) {
    if (file.requiresManualMigrationOnCreate) {
      msgs.failures.push(file.requiresManualMigrationOnCreateMsg)
    } else {
      msgs.successes.push(shouldAndDidCreateMsg)
    }
  } else if (!file.didUpdateHeading) {
    if (file.requiresManualMigrationOnCreate) {
      msgs.failures.push(
        file.requiresManualMigrationOnCreateMsg,
        createdWithBadHeadingMsg,
      )
    } else {
      msgs.failures.push(shouldAndDidCreateWithBadHeadingMsg)
    }
  }

  return msgs
}

function handleUpdated(
  msgs: ResultMsgs,
  file:
    | TemplateFile
    | PklFile
    | TemplateFileWithHeading
    | TemplateFileWithLandingHeading,
  files: Files,
): ResultMsgs {
  const foundAndUpdatedMsg = `The ${file.displayName} file at ${file.desiredPath} was fully updated and no additional work is required.`

  switch (file.type) {
    case "TemplateFile":
      if (file.requiresManualMigrationOnUpdate) {
        msgs.failures.push(file.requiresManualMigrationOnUpdateMsg)
      } else {
        msgs.successes.push(foundAndUpdatedMsg)
      }
      break
    case "PklFile":
      msgs = processUpdatedPklFile(msgs, file as PklFile, files)
      break
    default:
      msgs = processUpdatedTemplateFileWithHeading(
        msgs,
        file as TemplateFileWithHeading,
      )
      break
  }

  return msgs
}

function processUpdatedPklFile(
  msgs: ResultMsgs,
  file: PklFile,
  files: Files,
): ResultMsgs {
  const anyUnorderedMls = getAnyUnorderedMls(files)

  const foundAndUpdatedMsg = `The ${file.displayName} file at ${file.desiredPath} was fully updated and no additional work is required.`
  const otherCoursesWarning = `A default Fallback course was updated in ${file.desiredPath} with the microlessons in the correct order.
    However, if any other courses use this module you will need to create the course in this file.`
  const foundAndUpdatedWithUnorderedMlsMsg = `The ${file.displayName} file at ${file.desiredPath} was fully updated but some microlessons are not in the correct order.
    You will need to update the file manually.
    You should also audit the README.md file at the root of the project. It may be missing a link to these microlessons.`
  const otherCoursesOutOfOrderWarning = `The microlessons in the Fallback course in the ${file.desiredPath} file is out of order. If any other courses use this module you will need to create the course in the ${file.desiredPath} file as well.`

  if (!anyUnorderedMls.length) {
    msgs.successes.push(foundAndUpdatedMsg)
    if (file.fileName === "config") msgs.warnings.push(otherCoursesWarning)
  } else if (anyUnorderedMls) {
    msgs.failures.push(foundAndUpdatedWithUnorderedMlsMsg)
    if (file.fileName === "config") {
      msgs.warnings.push(otherCoursesOutOfOrderWarning)
    }
  }

  if (anyUnorderedMls.length) {
    const unorderedMls = anyUnorderedMls.map((ml, idx) => {
      return `    ${ml.displayName}${os.EOL}`
    })
    msgs.failures.push(`The order of these microlessons could not be determined:
${unorderedMls.join("")}`)
  }

  return msgs
}

function processUpdatedTemplateFileWithHeading(
  msgs: ResultMsgs,
  file: TemplateFileWithHeading,
): ResultMsgs {
  const foundAndUpdatedMsg = `The ${file.displayName} file at ${file.desiredPath} was fully updated and no additional work is required.`
  const foundAndUpdatedWithBadHeadingMsg = `The ${file.displayName} file at ${file.desiredPath} was fully updated but the heading is incorrect.
    You will need to update the file manually.`
  const updatedWithBadHeadingMsg = `The ${file.displayName} file at ${file.desiredPath} has an incorrect heading.`

  if (file.didUpdateHeading) {
    if (file.requiresManualMigrationOnUpdate) {
      msgs.failures.push(file.requiresManualMigrationOnUpdateMsg)
    } else {
      msgs.successes.push(foundAndUpdatedMsg)
    }
  } else if (!file.didUpdateHeading) {
    if (file.requiresManualMigrationOnUpdate) {
      msgs.failures.push(
        file.requiresManualMigrationOnUpdateMsg,
        updatedWithBadHeadingMsg,
      )
    } else {
      msgs.failures.push(foundAndUpdatedWithBadHeadingMsg)
    }
  }

  return msgs
}

function getAnyUnorderedMls(files: Files): MlFile[] {
  const unorderedMls = files.mls.filter((ml) => ml.deliveryOrder === -1)
  const unorderedLvlUpMls = files.lvlUpMls.filter(
    (ml) => ml.deliveryOrder === -1,
  )

  return [...unorderedMls, ...unorderedLvlUpMls]
}

function processConfigJson(msgs: ResultMsgs, meta: Meta, env: Env): ResultMsgs {
  const pklNotInstalledMsg = `Pkl is not installed. A config.json file was not created for this module at ${config.vars.configJsonPath}. 
    A config.json file should be created manually after pkl is installed.`
  const pklInstalledNoConfigCreatedMsg = `Pkl is installed but something went wrong while creating a course configuration file at ${config.vars.configJsonPath}.
    A config.json file should be created manually.`
  const pklInstalledAndConfigCreatedMsg = `A course configuration file was created at ${config.vars.configJsonPath}.`
  const configCreatedButMightNeedUpdatesMsg = `The course configuration file at ${config.vars.configJsonPath} was created.
    However, it might need to be recreated with pkl if you add more courses or change the order of microlessons in the config.pkl file.`

  if (!env.isPklInstalled) {
    msgs.failures.push(pklNotInstalledMsg)
  } else if (env.isPklInstalled && !meta.createdConfigJson) {
    msgs.failures.push(pklInstalledNoConfigCreatedMsg)
  } else if (env.isPklInstalled && meta.createdConfigJson) {
    msgs.successes.push(pklInstalledAndConfigCreatedMsg)
    msgs.warnings.push(configCreatedButMightNeedUpdatesMsg)
  }

  return msgs
}

function processLevelUpDir(
  msgs: ResultMsgs,
  dir: TemplateDir,
  module: Module,
  files: Files,
): ResultMsgs {
  const allLevelUpsMigrated = files.lvlUpMls.every((ml) => ml.didMoveOrCreate)
  const someLevelUpsMigrated = files.lvlUpMls.some((ml) => ml.didMoveOrCreate)
  const noUnknownFilesInLvlUpDir = files.invalidLvlUpFiles.length === 0

  const notFoundMsg = `The ${dir.desiredPath} directory was not found. No further action is required.`
  const notMigratingLvlUpMsg = `You decided to not move any Level Up microlessons from the level-up directory. You should manually move these microlessons to their proper locations.`
  const allLvlUpMlsMigratedAndNoUnknownFilesMsg = `All the microlessons in the Level Up directory at ${dir.desiredPath} were moved to their proper locations.
    You will need to manually move any assets associated with these microlessons to their new locations.`
  const allLvlUpMlsMigratedButUnkownFilesRemainMsg = `All the microlessons in the Level Up directory at ${dir.desiredPath} were moved to their proper locations.
    However, there are unknown files in this directory that will need to be investigated.`
  const someLvlUpMlsMigratedMsg = `Some of the microlessons in the Level Up directory at ${dir.desiredPath} were migrated.
    You will need to manually move any assets associated with these microlessons to their new locations.`
  const noLevelUpsMigratedMsg = `No Level Up microlessons were migrated. You will need to manually move the Level Up microlessons to their proper locations.`

  if (!dir.isFound) {
    msgs.successes.push(notFoundMsg)
  } else if (!module.meta.isMigratingLvlUp) {
    msgs.failures.push(notMigratingLvlUpMsg)
  } else if (allLevelUpsMigrated && noUnknownFilesInLvlUpDir) {
    msgs.failures.push(allLvlUpMlsMigratedAndNoUnknownFilesMsg)
  } else if (allLevelUpsMigrated && !noUnknownFilesInLvlUpDir) {
    msgs.failures.push(allLvlUpMlsMigratedButUnkownFilesRemainMsg)
  } else if (!allLevelUpsMigrated && someLevelUpsMigrated) {
    msgs.failures.push(someLvlUpMlsMigratedMsg)
  } else if (!allLevelUpsMigrated && !someLevelUpsMigrated) {
    msgs.failures.push(noLevelUpsMigratedMsg)
  }

  return msgs
}

function processRootAssets(msgs: ResultMsgs, meta: Meta): ResultMsgs {
  const rootAssetsAlreadyExistMsg = `The assets directory and its subitems already exist at ./assets. No further action is required.`
  const createdAll = `The root directory did not contain any of the necessary asset template items, but they were all created.`
  const rootAssetsDirCreatedMsg = `An assets directory was created at ./assets.`
  const rootAssetsDirNotCreatedMsg = `An assets directory was not created at ./assets. You'll need to create this directory, and its subitems, manually.`
  const rootOriginalAssetsDirCreatedMsg = `The original assets directory was created at ./assets/originals.`
  const rootOriginalAssetsDirNotCreatedMsg = `The original assets directory at ./assets/originals was not found. You'll need to create this directory, and its subitems, manually.`
  const rootOriginalAssetsReadmeCreatedMsg = `The original assets readme was created at ./assets/originals/README.md.`
  const rootOriginalAssetsReadmeNotCreatedMsg = `The original assets readme at ./assets/originals/README.md was not found. You'll need to create this file manually.`

  if (
    meta.containsAssetsDir &&
    meta.containsOriginalAssetsDir &&
    meta.containsOriginalAssetsReadme
  ) {
    msgs.successes.push(rootAssetsAlreadyExistMsg)
    return msgs
  } else if (
    !meta.containsAssetsDir &&
    meta.createdAssetsDir &&
    !meta.containsOriginalAssetsDir &&
    meta.createdOriginalAssetsDir &&
    !meta.containsOriginalAssetsReadme &&
    meta.createdOriginalAssetsReadme
  ) {
    msgs.successes.push(createdAll)
    return msgs
  }

  if (!meta.containsAssetsDir && meta.createdAssetsDir) {
    msgs.successes.push(rootAssetsDirCreatedMsg)
  } else if (!meta.containsAssetsDir && !meta.createdAssetsDir) {
    msgs.failures.push(rootAssetsDirNotCreatedMsg)
  }

  if (!meta.containsOriginalAssetsDir && meta.createdOriginalAssetsDir) {
    msgs.successes.push(rootOriginalAssetsDirCreatedMsg)
  } else if (
    !meta.containsOriginalAssetsDir &&
    !meta.createdOriginalAssetsDir
  ) {
    msgs.failures.push(rootOriginalAssetsDirNotCreatedMsg)
  }

  if (!meta.containsOriginalAssetsReadme && meta.createdOriginalAssetsReadme) {
    msgs.successes.push(rootOriginalAssetsReadmeCreatedMsg)
  } else if (
    !meta.containsOriginalAssetsReadme &&
    !meta.createdOriginalAssetsReadme
  ) {
    msgs.failures.push(rootOriginalAssetsReadmeNotCreatedMsg)
  }

  return msgs
}

export { process }
